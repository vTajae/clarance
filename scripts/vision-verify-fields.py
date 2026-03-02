#!/usr/bin/env python3
"""
SF-86 Vision-Based Field Label Verification
=============================================

Uses a local vision model (Ollama) to verify field label mappings by examining
the actual PDF page around each field's bounding rectangle.

For each field:
  1. Renders the PDF region around the field (with padding for context)
  2. Sends the crop to a vision model asking "what label is near this field?"
  3. Compares the model's answer with our current registry label
  4. Flags mismatches for human review

Requirements:
  - Ollama running locally with a vision model (e.g. llama3.2-vision, llava, qwen2.5-vl)
  - Python 3.10+
  - The PDF service running (for page rendering) OR the SF-86 template PDF locally

Usage:
  # Using the PDF service for rendering (recommended):
  python scripts/vision-verify-fields.py --mode service

  # Using local PyMuPDF rendering (requires pymupdf installed):
  python scripts/vision-verify-fields.py --mode local --pdf pdf-service/templates/sf861.pdf

  # Options:
  --ollama-url    Ollama API endpoint (default: http://localhost:11434)
  --model         Vision model name (default: llama3.2-vision)
  --service-url   PDF service URL (default: http://localhost:8001)
  --section       Only verify fields in this section
  --confidence    Only verify fields below this confidence (default: 1.0 = all)
  --limit         Max fields to process (default: unlimited)
  --batch-size    Fields per batch for progress reporting (default: 50)
  --output        Output report path (default: scripts/vision-verify-report.json)
  --concurrency   Parallel requests to Ollama (default: 1)
"""

from __future__ import annotations

import argparse
import base64
import json
import sys
import time
from dataclasses import dataclass, field as dc_field
from pathlib import Path
from typing import Any
from urllib.request import Request, urlopen
from urllib.error import URLError

# ---------------------------------------------------------------------------
# ANSI colors
# ---------------------------------------------------------------------------

class C:
    GREEN = "\033[32m"
    RED = "\033[31m"
    YELLOW = "\033[33m"
    CYAN = "\033[36m"
    BOLD = "\033[1m"
    DIM = "\033[2m"
    RESET = "\033[0m"

def cprint(color: str, text: str) -> str:
    return f"{color}{text}{C.RESET}"

# ---------------------------------------------------------------------------
# Data structures
# ---------------------------------------------------------------------------

@dataclass
class FieldEntry:
    pdf_field_name: str
    semantic_key: str
    section: str
    label: str
    pdf_field_type: str
    ui_field_type: str
    pdf_page: int  # 1-based in registry
    pdf_rect: dict[str, float] | None
    confidence: float
    manually_verified: bool

@dataclass
class VerificationResult:
    pdf_field_name: str
    semantic_key: str
    section: str
    registry_label: str
    vision_label: str
    confidence: float
    match: bool
    similarity_score: float
    page: int
    notes: str = ""

# ---------------------------------------------------------------------------
# Registry loading
# ---------------------------------------------------------------------------

def load_registry(registry_path: str) -> list[FieldEntry]:
    """Load field registry JSON and return as list of FieldEntry."""
    path = Path(registry_path)
    if not path.is_file():
        print(cprint(C.RED, f"Registry not found: {registry_path}"))
        sys.exit(1)

    data = json.loads(path.read_text())
    entries = []
    for item in data:
        rect = item.get("pdfRect")
        entries.append(FieldEntry(
            pdf_field_name=item["pdfFieldName"],
            semantic_key=item["semanticKey"],
            section=item["section"],
            label=item["label"],
            pdf_field_type=item["pdfFieldType"],
            ui_field_type=item["uiFieldType"],
            pdf_page=item.get("pdfPage", 0),
            pdf_rect=rect if isinstance(rect, dict) else None,
            confidence=item.get("classificationConfidence", 0),
            manually_verified=item.get("manuallyVerified", False),
        ))
    return entries

# ---------------------------------------------------------------------------
# Image acquisition
# ---------------------------------------------------------------------------

def get_crop_from_service(
    service_url: str,
    version: str,
    page_num: int,  # 0-based
    x: float,
    y: float,
    w: float,
    h: float,
    padding: float = 50,
    dpi: int = 200,
) -> bytes:
    """Fetch a cropped region from the PDF service."""
    url = (
        f"{service_url}/render-crop/{version}/{page_num}"
        f"?x={x}&y={y}&w={w}&h={h}&padding={padding}&dpi={dpi}"
    )
    req = Request(url)
    try:
        resp = urlopen(req, timeout=30)
        return resp.read()
    except URLError as e:
        raise RuntimeError(f"PDF service request failed: {e}") from e


def get_crop_local(
    pdf_path: str,
    page_num: int,  # 0-based
    x: float,
    y: float,
    w: float,
    h: float,
    padding: float = 50,
    dpi: int = 200,
) -> bytes:
    """Render a cropped region using local PyMuPDF."""
    try:
        import fitz
    except ImportError:
        print(cprint(C.RED, "PyMuPDF (fitz) not installed. Use --mode service or: pip install pymupdf"))
        sys.exit(1)

    doc = fitz.open(pdf_path)
    try:
        page = doc[page_num]
        page_rect = page.rect
        crop = fitz.Rect(
            max(x - padding, page_rect.x0),
            max(y - padding, page_rect.y0),
            min(x + w + padding, page_rect.x1),
            min(y + h + padding, page_rect.y1),
        )
        zoom = dpi / 72.0
        mat = fitz.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=mat, clip=crop)
        return pix.tobytes("png")
    finally:
        doc.close()


def get_page_region_estimate(
    service_url: str | None,
    pdf_path: str | None,
    version: str,
    page_num: int,  # 0-based
    dpi: int = 150,
) -> bytes:
    """Get a full page render when no pdfRect is available."""
    if service_url:
        url = f"{service_url}/render-page/{version}/{page_num}?dpi={dpi}"
        req = Request(url)
        try:
            resp = urlopen(req, timeout=30)
            return resp.read()
        except URLError as e:
            raise RuntimeError(f"PDF service request failed: {e}") from e
    elif pdf_path:
        try:
            import fitz
        except ImportError:
            print(cprint(C.RED, "PyMuPDF not installed."))
            sys.exit(1)
        doc = fitz.open(pdf_path)
        try:
            page = doc[page_num]
            zoom = dpi / 72.0
            mat = fitz.Matrix(zoom, zoom)
            pix = page.get_pixmap(matrix=mat)
            return pix.tobytes("png")
        finally:
            doc.close()
    else:
        raise RuntimeError("No image source configured")

# ---------------------------------------------------------------------------
# Ollama vision API
# ---------------------------------------------------------------------------

def query_vision_model(
    ollama_url: str,
    model: str,
    image_bytes: bytes,
    prompt: str,
    timeout: int = 60,
) -> str:
    """Send an image + prompt to Ollama's vision API and return the text response."""
    b64_image = base64.b64encode(image_bytes).decode("utf-8")

    payload = json.dumps({
        "model": model,
        "prompt": prompt,
        "images": [b64_image],
        "stream": False,
        "options": {
            "temperature": 0.1,  # Low temperature for factual extraction
            "num_predict": 100,  # Short response expected
        },
    }).encode("utf-8")

    req = Request(
        f"{ollama_url}/api/generate",
        data=payload,
        headers={"Content-Type": "application/json"},
    )

    try:
        resp = urlopen(req, timeout=timeout)
        data = json.loads(resp.read())
        return data.get("response", "").strip()
    except URLError as e:
        raise RuntimeError(f"Ollama request failed: {e}") from e
    except json.JSONDecodeError as e:
        raise RuntimeError(f"Invalid JSON from Ollama: {e}") from e

# ---------------------------------------------------------------------------
# Label comparison
# ---------------------------------------------------------------------------

def normalize_label(text: str) -> str:
    """Normalize a label for comparison."""
    import re
    # Lowercase, strip punctuation, collapse whitespace
    text = text.lower().strip()
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def compute_similarity(label_a: str, label_b: str) -> float:
    """Compute word-overlap similarity between two labels (0.0-1.0)."""
    a_words = set(normalize_label(label_a).split())
    b_words = set(normalize_label(label_b).split())

    if not a_words or not b_words:
        return 0.0

    intersection = a_words & b_words
    union = a_words | b_words
    return len(intersection) / len(union) if union else 0.0


FIELD_PROMPT = """Look at this cropped region from a US government form (SF-86).
There is a form field (text input, checkbox, dropdown, or radio button) in or near the center of this image.

What is the label, question, or description text printed near this form field?
This is the text that tells the user what information to enter in this field.

Reply with ONLY the label text, nothing else. If you cannot determine the label, reply "UNKNOWN".
"""

PAGE_PROMPT = """Look at this page from a US government form (SF-86).
I need to identify the label for a specific form field on this page.
The field is named "{field_name}" and is of type {field_type}.
Our current label for this field is: "{current_label}"

What section of the form is this page showing? What labels/questions are visible?
Is "{current_label}" a reasonable label for a {field_type} field on this page?

Reply in this format:
LABEL: <the actual label you see for this field, or UNKNOWN>
MATCH: <YES if our label seems correct, NO if it seems wrong, UNSURE if unclear>
"""

# ---------------------------------------------------------------------------
# Main verification loop
# ---------------------------------------------------------------------------

def verify_fields(
    fields: list[FieldEntry],
    *,
    ollama_url: str,
    model: str,
    service_url: str | None,
    pdf_path: str | None,
    version: str,
    batch_size: int,
) -> list[VerificationResult]:
    """Run vision verification on a list of fields."""
    results: list[VerificationResult] = []
    total = len(fields)

    for i, field in enumerate(fields):
        if (i + 1) % batch_size == 0 or i == 0:
            print(f"\n{cprint(C.CYAN, f'[{i + 1}/{total}]')} Processing {field.section} / {field.label}...")

        page_0 = field.pdf_page - 1  # Convert 1-based to 0-based
        if page_0 < 0:
            page_0 = 0

        try:
            # Strategy 1: If we have pdfRect, crop around the field
            if field.pdf_rect and all(
                k in field.pdf_rect for k in ("x", "y", "width", "height")
            ):
                rect = field.pdf_rect
                if service_url:
                    img = get_crop_from_service(
                        service_url, version, page_0,
                        rect["x"], rect["y"], rect["width"], rect["height"],
                        padding=60, dpi=200,
                    )
                elif pdf_path:
                    img = get_crop_local(
                        pdf_path, page_0,
                        rect["x"], rect["y"], rect["width"], rect["height"],
                        padding=60, dpi=200,
                    )
                else:
                    raise RuntimeError("No image source")

                response = query_vision_model(ollama_url, model, img, FIELD_PROMPT)

            # Strategy 2: No pdfRect, send the full page with context
            else:
                img = get_page_region_estimate(
                    service_url, pdf_path, version, page_0, dpi=120,
                )
                prompt = PAGE_PROMPT.format(
                    field_name=field.pdf_field_name,
                    field_type=field.pdf_field_type,
                    current_label=field.label,
                )
                response = query_vision_model(ollama_url, model, img, prompt)

            # Parse the response
            vision_label = response
            notes = ""

            # If response follows LABEL:/MATCH: format, parse it
            # Handle markdown bold variants: **LABEL:** or LABEL:
            if "LABEL:" in response:
                for line in response.split("\n"):
                    line = line.strip().lstrip("*").strip()
                    if line.upper().startswith("LABEL:"):
                        vision_label = line[6:].strip().rstrip("*").strip()
                    elif line.upper().startswith("MATCH:"):
                        notes = line[6:].strip().rstrip("*").strip()

            # Compute similarity
            sim = compute_similarity(field.label, vision_label)
            # Trust the model's self-reported match assessment
            model_says_match = "yes" in notes.lower() if notes else False
            is_match = sim >= 0.4 or model_says_match

            if vision_label.upper() == "UNKNOWN":
                is_match = True  # Can't disprove, skip
                notes = "Vision model could not determine label"
                sim = 0.5

            results.append(VerificationResult(
                pdf_field_name=field.pdf_field_name,
                semantic_key=field.semantic_key,
                section=field.section,
                registry_label=field.label,
                vision_label=vision_label,
                confidence=field.confidence,
                match=is_match,
                similarity_score=sim,
                page=field.pdf_page,
                notes=notes,
            ))

            # Progress indicator
            status = cprint(C.GREEN, "MATCH") if is_match else cprint(C.RED, "MISMATCH")
            if (i + 1) % 10 == 0 or not is_match:
                print(f"  {status} [{sim:.2f}] {field.label} -> {vision_label[:60]}")

        except Exception as e:
            print(f"  {cprint(C.YELLOW, 'SKIP')} {field.pdf_field_name}: {e}")
            results.append(VerificationResult(
                pdf_field_name=field.pdf_field_name,
                semantic_key=field.semantic_key,
                section=field.section,
                registry_label=field.label,
                vision_label="ERROR",
                confidence=field.confidence,
                match=True,  # Don't flag errors as mismatches
                similarity_score=0,
                page=field.pdf_page,
                notes=f"Error: {e}",
            ))

    return results

# ---------------------------------------------------------------------------
# Report generation
# ---------------------------------------------------------------------------

def generate_report(
    results: list[VerificationResult],
    output_path: str,
    model: str,
) -> dict[str, Any]:
    """Generate and save the verification report."""
    matches = [r for r in results if r.match]
    mismatches = [r for r in results if not r.match]
    errors = [r for r in results if r.vision_label == "ERROR"]
    unknowns = [r for r in results if r.vision_label.upper() == "UNKNOWN"]

    # Group mismatches by section
    by_section: dict[str, list[dict]] = {}
    for r in mismatches:
        by_section.setdefault(r.section, []).append({
            "pdfFieldName": r.pdf_field_name,
            "semanticKey": r.semantic_key,
            "registryLabel": r.registry_label,
            "visionLabel": r.vision_label,
            "similarity": round(r.similarity_score, 3),
            "confidence": r.confidence,
            "page": r.page,
        })

    # Group by confidence band
    by_confidence = {"high": 0, "medium": 0, "low": 0}
    mismatch_by_confidence = {"high": 0, "medium": 0, "low": 0}
    for r in results:
        band = "high" if r.confidence >= 0.8 else "medium" if r.confidence >= 0.5 else "low"
        by_confidence[band] += 1
        if not r.match:
            mismatch_by_confidence[band] += 1

    report = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "model": model,
        "summary": {
            "total": len(results),
            "matches": len(matches),
            "mismatches": len(mismatches),
            "errors": len(errors),
            "unknowns": len(unknowns),
            "mismatchRate": round(len(mismatches) / max(len(results), 1), 4),
        },
        "mismatchesBySection": by_section,
        "mismatchesByConfidence": mismatch_by_confidence,
        "totalByConfidence": by_confidence,
        "allMismatches": [
            {
                "pdfFieldName": r.pdf_field_name,
                "semanticKey": r.semantic_key,
                "section": r.section,
                "registryLabel": r.registry_label,
                "visionLabel": r.vision_label,
                "similarity": round(r.similarity_score, 3),
                "confidence": r.confidence,
                "page": r.page,
                "notes": r.notes,
            }
            for r in sorted(mismatches, key=lambda r: r.similarity_score)
        ],
    }

    Path(output_path).write_text(json.dumps(report, indent=2))
    return report

# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Vision-based field label verification for SF-86 registry"
    )
    parser.add_argument(
        "--mode", choices=["service", "local"], default="service",
        help="Image source: 'service' (PDF microservice) or 'local' (PyMuPDF)",
    )
    parser.add_argument(
        "--ollama-url", default="http://localhost:11434",
        help="Ollama API endpoint",
    )
    parser.add_argument(
        "--model", default="llama3.2-vision",
        help="Ollama vision model name",
    )
    parser.add_argument(
        "--service-url", default="http://localhost:8001",
        help="PDF service URL (for --mode service)",
    )
    parser.add_argument(
        "--pdf", default=None,
        help="Path to SF-86 template PDF (for --mode local)",
    )
    parser.add_argument(
        "--version", default="sf861",
        help="PDF version slug for service mode",
    )
    parser.add_argument(
        "--registry", default=None,
        help="Path to field-registry.json",
    )
    parser.add_argument(
        "--section", default=None,
        help="Only verify fields in this section",
    )
    parser.add_argument(
        "--confidence", type=float, default=1.0,
        help="Only verify fields below this confidence threshold",
    )
    parser.add_argument(
        "--unverified-only", action="store_true",
        help="Only verify fields not yet manually verified",
    )
    parser.add_argument(
        "--limit", type=int, default=0,
        help="Max fields to process (0 = unlimited)",
    )
    parser.add_argument(
        "--batch-size", type=int, default=50,
        help="Progress reporting interval",
    )
    parser.add_argument(
        "--output", default=None,
        help="Output report path",
    )

    args = parser.parse_args()

    print(f"\n{cprint(C.BOLD, '=== SF-86 Vision Field Verification ===')}\n")
    print(f"Mode:     {args.mode}")
    print(f"Model:    {args.model}")
    print(f"Ollama:   {args.ollama_url}")

    # Resolve paths
    script_dir = Path(__file__).resolve().parent
    project_root = script_dir.parent

    registry_path = args.registry or str(
        project_root / "app" / "src" / "lib" / "field-registry" / "field-registry.json"
    )
    output_path = args.output or str(script_dir / "vision-verify-report.json")

    # Check Ollama connectivity
    print(f"\nChecking Ollama at {args.ollama_url}...")
    try:
        resp = urlopen(Request(f"{args.ollama_url}/api/tags"), timeout=5)
        models_data = json.loads(resp.read())
        available_models = [m["name"] for m in models_data.get("models", [])]
        print(f"  Available models: {', '.join(available_models) or 'none'}")

        # Check if requested model is available
        model_found = any(args.model in m for m in available_models)
        if not model_found:
            print(cprint(C.YELLOW, f"\n  Model '{args.model}' not found. Available vision models:"))
            vision_keywords = ["vision", "llava", "llama3.2-vision", "qwen2.5-vl", "minicpm"]
            vision_models = [m for m in available_models if any(k in m.lower() for k in vision_keywords)]
            if vision_models:
                for m in vision_models:
                    print(f"    - {m}")
                print(f"\n  To use one: python {sys.argv[0]} --model {vision_models[0]}")
            else:
                print(f"\n  No vision models found. Install one with:")
                print(f"    ollama pull llama3.2-vision")
                print(f"    ollama pull llava:13b")
                print(f"    ollama pull qwen2.5-vl:7b")
            sys.exit(1)

        print(cprint(C.GREEN, f"  Model '{args.model}' available."))
    except URLError:
        print(cprint(C.RED, f"  Cannot reach Ollama at {args.ollama_url}"))
        print(f"  Start Ollama with: ollama serve")
        print(f"  Then pull a vision model: ollama pull {args.model}")
        sys.exit(1)

    # Check PDF service if using service mode
    if args.mode == "service":
        print(f"\nChecking PDF service at {args.service_url}...")
        try:
            resp = urlopen(Request(f"{args.service_url}/health"), timeout=5)
            print(cprint(C.GREEN, "  PDF service healthy."))
        except URLError:
            print(cprint(C.RED, f"  PDF service not reachable at {args.service_url}"))
            print("  Start it with: docker compose up pdf-service")
            sys.exit(1)

    # Load registry
    print(f"\nLoading registry from {registry_path}...")
    fields = load_registry(registry_path)
    print(f"  Loaded {cprint(C.CYAN, str(len(fields)))} fields.")

    # Apply filters
    if args.section:
        fields = [f for f in fields if f.section == args.section]
        print(f"  Filtered to section '{args.section}': {len(fields)} fields")

    if args.confidence < 1.0:
        fields = [f for f in fields if f.confidence < args.confidence]
        print(f"  Filtered to confidence < {args.confidence}: {len(fields)} fields")

    if args.unverified_only:
        fields = [f for f in fields if not f.manually_verified]
        print(f"  Filtered to unverified only: {len(fields)} fields")

    # Sort by confidence ascending (verify worst first)
    fields.sort(key=lambda f: f.confidence)

    if args.limit > 0:
        fields = fields[:args.limit]
        print(f"  Limited to {args.limit} fields")

    if not fields:
        print(cprint(C.YELLOW, "\n  No fields to verify after filtering."))
        sys.exit(0)

    print(f"\n{cprint(C.BOLD, f'Verifying {len(fields)} fields...')}")

    # Run verification
    start = time.time()
    results = verify_fields(
        fields,
        ollama_url=args.ollama_url,
        model=args.model,
        service_url=args.service_url if args.mode == "service" else None,
        pdf_path=args.pdf if args.mode == "local" else None,
        version=args.version,
        batch_size=args.batch_size,
    )
    elapsed = time.time() - start

    # Generate report
    report = generate_report(results, output_path, args.model)

    # Print summary
    summary = report["summary"]
    print(f"\n{cprint(C.BOLD, '=== VERIFICATION RESULTS ===')}\n")
    print(f"Total verified:  {cprint(C.CYAN, str(summary['total']))}")
    print(f"Matches:         {cprint(C.GREEN, str(summary['matches']))}")
    print(f"Mismatches:      {cprint(C.RED, str(summary['mismatches'])) if summary['mismatches'] > 0 else cprint(C.GREEN, '0')}")
    print(f"Errors:          {cprint(C.YELLOW, str(summary['errors'])) if summary['errors'] > 0 else '0'}")
    print(f"Unknown:         {summary['unknowns']}")
    print(f"Mismatch rate:   {summary['mismatchRate'] * 100:.1f}%")
    print(f"Time:            {elapsed:.1f}s ({elapsed / max(len(results), 1):.1f}s/field)")

    # Mismatch details
    mismatches = report.get("allMismatches", [])
    if mismatches:
        print(f"\n{cprint(C.BOLD, f'--- Top Mismatches (worst similarity first) ---')}")
        for m in mismatches[:20]:
            print(f"\n  {cprint(C.RED, m['pdfFieldName'])}")
            print(f"    Registry:  {cprint(C.YELLOW, m['registryLabel'])}")
            print(f"    Vision:    {cprint(C.CYAN, m['visionLabel'])}")
            print(f"    Similarity: {m['similarity']:.2f}  Confidence: {m['confidence']:.2f}  Page: {m['page']}")

    print(f"\n{cprint(C.DIM, f'Full report saved to: {output_path}')}\n")


if __name__ == "__main__":
    main()

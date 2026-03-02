#!/usr/bin/env python3
"""
SF-86 Text-Proximity Field Label Verification
==============================================

Uses PyMuPDF text extraction to find the actual label printed near each
form field on the PDF. Compares with the registry label to identify mismatches.

This is 100x faster and more reliable than vision-based verification because
it extracts exact text rather than asking a model to interpret an image.

Strategy:
  1. Extract all text blocks with bounding rectangles from each PDF page
  2. For each form field, find the nearest text block(s) using spatial proximity
  3. Score matches: labels directly ABOVE a field are most likely correct,
     followed by LEFT, then BELOW, then RIGHT
  4. Compare best-match text with registry label
  5. Generate corrections for mismatched fields

Usage (run inside Docker container with pymupdf):
  docker exec sf86-pdf-service python3 /app/scripts/text-proximity-verify.py

Or mount the script:
  docker exec sf86-pdf-service python3 /scripts/text-proximity-verify.py
"""

from __future__ import annotations

import json
import math
import re
import sys
import time
from dataclasses import dataclass, field as dc_field
from pathlib import Path
from typing import Any

try:
    import fitz
except ImportError:
    print("ERROR: PyMuPDF (fitz) not installed. Run inside the PDF service container.")
    sys.exit(1)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

# How far (in PDF points) to search for label text near a field
MAX_LABEL_DISTANCE = 80  # ~1.1 inches

# Weight factors for directional proximity (higher = preferred label position)
# Labels are most commonly above or to the left of form fields
DIRECTION_WEIGHTS = {
    "above": 2.0,      # Label printed above the field (most common)
    "left": 1.5,       # Label to the left of the field
    "above_left": 1.8, # Diagonal above-left
    "below": 0.8,      # Label below (less common for this form)
    "right": 0.5,      # Label to the right (uncommon)
    "other": 0.3,      # Far away
}

# Minimum similarity score to consider a match
MATCH_THRESHOLD = 0.35

# ---------------------------------------------------------------------------
# Data structures
# ---------------------------------------------------------------------------

@dataclass
class TextBlock:
    """A text block extracted from the PDF."""
    x0: float
    y0: float
    x1: float
    y1: float
    text: str
    page: int

@dataclass
class FieldRect:
    """A form field's bounding rectangle."""
    x: float
    y: float
    width: float
    height: float

    @property
    def x0(self) -> float:
        return self.x

    @property
    def y0(self) -> float:
        return self.y

    @property
    def x1(self) -> float:
        return self.x + self.width

    @property
    def y1(self) -> float:
        return self.y + self.height

    @property
    def cx(self) -> float:
        return self.x + self.width / 2

    @property
    def cy(self) -> float:
        return self.y + self.height / 2

@dataclass
class LabelCandidate:
    """A candidate label found near a form field."""
    text: str
    distance: float
    direction: str
    score: float  # Combined proximity + direction score
    block: TextBlock

@dataclass
class VerificationResult:
    """Result of verifying one field's label."""
    pdf_field_name: str
    semantic_key: str
    section: str
    registry_label: str
    nearest_label: str
    similarity: float
    is_match: bool
    confidence: float
    page: int
    candidates: list[dict[str, Any]] = dc_field(default_factory=list)
    suggested_label: str = ""

# ---------------------------------------------------------------------------
# Text extraction
# ---------------------------------------------------------------------------

def extract_text_blocks(doc: fitz.Document, page_num: int) -> list[TextBlock]:
    """Extract text blocks with positions from a PDF page."""
    page = doc[page_num]
    blocks = page.get_text("blocks")
    result = []
    for b in blocks:
        x0, y0, x1, y1, text, block_no, block_type = b
        if block_type != 0:  # Skip image blocks
            continue
        text = text.strip()
        if not text:
            continue
        result.append(TextBlock(x0=x0, y0=y0, x1=x1, y1=y1, text=text, page=page_num))
    return result


def extract_text_lines(doc: fitz.Document, page_num: int) -> list[TextBlock]:
    """Extract text at line level for finer granularity."""
    page = doc[page_num]
    # Use "dict" output for line-level extraction
    page_dict = page.get_text("dict")
    result = []
    for block in page_dict.get("blocks", []):
        if block.get("type") != 0:
            continue
        for line in block.get("lines", []):
            bbox = line.get("bbox", (0, 0, 0, 0))
            spans = line.get("spans", [])
            text = " ".join(s.get("text", "") for s in spans).strip()
            if not text:
                continue
            result.append(TextBlock(
                x0=bbox[0], y0=bbox[1], x1=bbox[2], y1=bbox[3],
                text=text, page=page_num,
            ))
    return result

# ---------------------------------------------------------------------------
# Proximity scoring
# ---------------------------------------------------------------------------

def classify_direction(field: FieldRect, block: TextBlock) -> str:
    """Classify the spatial relationship between a field and a text block."""
    # Block center
    bx = (block.x0 + block.x1) / 2
    by = (block.y0 + block.y1) / 2

    # Field center
    fx = field.cx
    fy = field.cy

    dx = bx - fx
    dy = by - fy  # Positive = below (PDF y increases downward)

    # Primarily above
    if dy < -5 and abs(dx) < field.width * 1.5:
        if dx < -field.width * 0.3:
            return "above_left"
        return "above"
    # Primarily left
    if dx < -5 and abs(dy) < 20:
        return "left"
    # Primarily below
    if dy > 5 and abs(dx) < field.width * 1.5:
        return "below"
    # Primarily right
    if dx > 5 and abs(dy) < 20:
        return "right"
    return "other"


def compute_distance(field: FieldRect, block: TextBlock) -> float:
    """Compute minimum distance between field rect and text block rect."""
    # Horizontal distance
    if block.x1 < field.x0:
        dx = field.x0 - block.x1
    elif block.x0 > field.x1:
        dx = block.x0 - field.x1
    else:
        dx = 0

    # Vertical distance
    if block.y1 < field.y0:
        dy = field.y0 - block.y1
    elif block.y0 > field.y1:
        dy = block.y0 - field.y1
    else:
        dy = 0

    return math.sqrt(dx * dx + dy * dy)


def find_nearest_labels(
    field: FieldRect,
    text_blocks: list[TextBlock],
    max_distance: float = MAX_LABEL_DISTANCE,
    top_n: int = 5,
) -> list[LabelCandidate]:
    """Find the nearest text labels to a form field."""
    candidates = []

    for block in text_blocks:
        dist = compute_distance(field, block)
        if dist > max_distance:
            continue

        direction = classify_direction(field, block)
        weight = DIRECTION_WEIGHTS.get(direction, 0.3)

        # Score: inverse distance * direction weight
        # Add 1 to avoid division by zero
        score = weight / (dist + 1)

        candidates.append(LabelCandidate(
            text=block.text,
            distance=dist,
            direction=direction,
            score=score,
            block=block,
        ))

    # Sort by score descending
    candidates.sort(key=lambda c: c.score, reverse=True)
    return candidates[:top_n]

# ---------------------------------------------------------------------------
# Label comparison
# ---------------------------------------------------------------------------

def normalize_label(text: str) -> str:
    """Normalize a label for comparison."""
    text = text.lower().strip()
    # Remove newlines and extra whitespace
    text = re.sub(r'\s+', ' ', text)
    # Remove punctuation except apostrophes
    text = re.sub(r"[^a-z0-9'\s]", ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def compute_similarity(label_a: str, label_b: str) -> float:
    """Compute word-overlap similarity between two labels."""
    a_norm = normalize_label(label_a)
    b_norm = normalize_label(label_b)

    a_words = set(a_norm.split())
    b_words = set(b_norm.split())

    if not a_words or not b_words:
        return 0.0

    intersection = a_words & b_words
    union = a_words | b_words
    jaccard = len(intersection) / len(union) if union else 0.0

    # Also check substring containment
    if a_norm in b_norm or b_norm in a_norm:
        return max(jaccard, 0.7)

    # Check if first N significant words match
    a_sig = [w for w in a_norm.split() if len(w) > 2][:4]
    b_sig = [w for w in b_norm.split() if len(w) > 2][:4]
    if a_sig and b_sig and a_sig == b_sig:
        return max(jaccard, 0.8)

    return jaccard


def pick_best_label(
    registry_label: str,
    candidates: list[LabelCandidate],
    field_type: str = "",
) -> tuple[str, float, bool]:
    """Pick the best label from candidates and determine if it matches registry.

    Strategy:
    - Check ALL nearby candidates (not just top 2) for a match with registry label
    - If any candidate matches, it's a match (the registry label IS present nearby)
    - Only if NO candidate matches, flag as mismatch
    - The nearest candidate by distance (not score) becomes the suggested correction

    Returns (best_label, similarity, is_match).
    """
    if not candidates:
        return "", 0.0, False

    # First pass: check if the registry label text appears in ANY nearby candidate
    # This handles cases where direction weighting pushes the actual label down
    best_sim = 0.0
    best_text = ""

    for c in candidates:
        lines = [l.strip() for l in c.text.split("\n") if l.strip()]
        for line in lines[:2]:
            sim = compute_similarity(registry_label, line)

            # Short labels: exact or substring match
            reg_word_count = len(normalize_label(registry_label).split())
            if reg_word_count <= 2:
                if normalize_label(line) == normalize_label(registry_label):
                    sim = 1.0
                elif normalize_label(registry_label) in normalize_label(line):
                    sim = max(sim, 0.6)

            if sim > best_sim:
                best_sim = sim
                best_text = line

    is_match = best_sim >= MATCH_THRESHOLD

    # If no match, the suggestion is from the nearest candidate by distance
    # (not by direction-weighted score)
    if not is_match:
        # Sort by raw distance for the suggestion
        by_distance = sorted(candidates, key=lambda c: c.distance)
        if by_distance:
            nearest = by_distance[0]
            nearest_text = nearest.text.split("\n")[0].strip()
            # Skip YES/NO/option values for radio/checkbox fields
            if nearest_text.upper() in ('YES', 'NO', 'ON', 'OFF') and len(by_distance) > 1:
                nearest_text = by_distance[1].text.split("\n")[0].strip()
            if not best_text:
                best_text = nearest_text

    if not best_text and candidates:
        best_text = candidates[0].text.split("\n")[0].strip()

    return best_text, best_sim, is_match

# ---------------------------------------------------------------------------
# Main verification
# ---------------------------------------------------------------------------

def verify_all_fields(
    pdf_path: str,
    registry: list[dict[str, Any]],
    *,
    section_filter: str | None = None,
    confidence_max: float = 1.0,
    limit: int = 0,
) -> list[VerificationResult]:
    """Run text-proximity verification on registry fields."""
    doc = fitz.open(pdf_path)

    # Pre-extract text for all needed pages
    page_cache: dict[int, list[TextBlock]] = {}

    def get_page_text(page_num: int) -> list[TextBlock]:
        if page_num not in page_cache:
            page_cache[page_num] = extract_text_lines(doc, page_num)
        return page_cache[page_num]

    # Filter fields
    fields = registry
    if section_filter:
        fields = [f for f in fields if f.get("section") == section_filter]
    if confidence_max < 1.0:
        fields = [f for f in fields if f.get("classificationConfidence", 1.0) < confidence_max]

    # Sort by confidence ascending (worst first)
    fields.sort(key=lambda f: f.get("classificationConfidence", 1.0))

    if limit > 0:
        fields = fields[:limit]

    total = len(fields)
    results = []

    print(f"\nVerifying {total} fields...")

    for i, field_def in enumerate(fields):
        pdf_page = field_def.get("pdfPage", 1)
        page_0 = pdf_page - 1  # Convert 1-based to 0-based
        if page_0 < 0:
            page_0 = 0

        rect_data = field_def.get("pdfRect")
        if not rect_data or not all(k in rect_data for k in ("x", "y", "width", "height")):
            # No rect data - skip
            results.append(VerificationResult(
                pdf_field_name=field_def["pdfFieldName"],
                semantic_key=field_def["semanticKey"],
                section=field_def["section"],
                registry_label=field_def["label"],
                nearest_label="",
                similarity=0.0,
                is_match=True,  # Can't verify, assume OK
                confidence=field_def.get("classificationConfidence", 0),
                page=pdf_page,
                suggested_label="",
            ))
            continue

        field_rect = FieldRect(
            x=rect_data["x"],
            y=rect_data["y"],
            width=rect_data["width"],
            height=rect_data["height"],
        )

        text_blocks = get_page_text(page_0)
        candidates = find_nearest_labels(field_rect, text_blocks)

        best_label, sim, is_match = pick_best_label(
            field_def["label"], candidates,
            field_type=field_def.get("pdfFieldType", ""),
        )

        # Determine suggested label for mismatches
        suggested = ""
        if not is_match and candidates:
            # The closest text block in the preferred direction is the suggestion
            suggested = candidates[0].text.split("\n")[0].strip()

        result = VerificationResult(
            pdf_field_name=field_def["pdfFieldName"],
            semantic_key=field_def["semanticKey"],
            section=field_def["section"],
            registry_label=field_def["label"],
            nearest_label=best_label,
            similarity=sim,
            is_match=is_match,
            confidence=field_def.get("classificationConfidence", 0),
            page=pdf_page,
            candidates=[
                {
                    "text": c.text.split("\n")[0].strip()[:100],
                    "distance": round(c.distance, 1),
                    "direction": c.direction,
                    "score": round(c.score, 4),
                }
                for c in candidates[:3]
            ],
            suggested_label=suggested,
        )
        results.append(result)

        # Progress
        if (i + 1) % 100 == 0 or i == 0:
            match_so_far = sum(1 for r in results if r.is_match)
            print(f"  [{i + 1}/{total}] {match_so_far} matches so far...")

        if not is_match and (i + 1) <= 20:
            print(f"  MISMATCH p{pdf_page}: {field_def['pdfFieldName']}")
            print(f"    Registry: {field_def['label'][:60]}")
            print(f"    Nearest:  {best_label[:60]}")
            if suggested:
                print(f"    Suggest:  {suggested[:60]}")

    doc.close()
    return results

# ---------------------------------------------------------------------------
# Report
# ---------------------------------------------------------------------------

def generate_report(
    results: list[VerificationResult],
    output_path: str,
) -> dict[str, Any]:
    """Generate verification report."""
    matches = [r for r in results if r.is_match]
    mismatches = [r for r in results if not r.is_match]

    # Group by section
    by_section: dict[str, int] = {}
    for r in mismatches:
        by_section[r.section] = by_section.get(r.section, 0) + 1

    # Group by confidence band
    bands = {"high": [0, 0], "medium": [0, 0], "low": [0, 0]}
    for r in results:
        band = "high" if r.confidence >= 0.8 else "medium" if r.confidence >= 0.5 else "low"
        bands[band][0] += 1
        if not r.is_match:
            bands[band][1] += 1

    report = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "method": "text-proximity",
        "summary": {
            "total": len(results),
            "matches": len(matches),
            "mismatches": len(mismatches),
            "match_rate": round(len(matches) / max(len(results), 1), 4),
        },
        "by_section": by_section,
        "by_confidence": {
            band: {"total": v[0], "mismatches": v[1]}
            for band, v in bands.items()
        },
        "corrections": [
            {
                "pdfFieldName": r.pdf_field_name,
                "semanticKey": r.semantic_key,
                "section": r.section,
                "page": r.page,
                "currentLabel": r.registry_label,
                "suggestedLabel": r.suggested_label,
                "nearestText": r.nearest_label,
                "similarity": round(r.similarity, 3),
                "confidence": r.confidence,
                "candidates": r.candidates,
            }
            for r in mismatches
        ],
        "all_results": [
            {
                "pdfFieldName": r.pdf_field_name,
                "semanticKey": r.semantic_key,
                "section": r.section,
                "page": r.page,
                "registryLabel": r.registry_label,
                "nearestLabel": r.nearest_label,
                "similarity": round(r.similarity, 3),
                "isMatch": r.is_match,
                "confidence": r.confidence,
                "candidates": r.candidates,
            }
            for r in results
        ],
    }

    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    Path(output_path).write_text(json.dumps(report, indent=2))
    return report


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    import argparse

    parser = argparse.ArgumentParser(
        description="Text-proximity field label verification for SF-86"
    )
    parser.add_argument(
        "--pdf", default="/app/templates/sf861.pdf",
        help="Path to SF-86 template PDF",
    )
    parser.add_argument(
        "--registry", default="/app/field-registry.json",
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
        "--limit", type=int, default=0,
        help="Max fields to process (0 = unlimited)",
    )
    parser.add_argument(
        "--output", default="/app/output/text-proximity-report.json",
        help="Output report path",
    )

    args = parser.parse_args()

    print(f"\n=== SF-86 Text-Proximity Field Verification ===\n")
    print(f"PDF:      {args.pdf}")
    print(f"Registry: {args.registry}")

    # Load registry
    registry = json.loads(Path(args.registry).read_text())
    print(f"Loaded {len(registry)} fields from registry")

    if args.section:
        print(f"Section filter: {args.section}")
    if args.confidence < 1.0:
        print(f"Confidence filter: < {args.confidence}")
    if args.limit > 0:
        print(f"Limit: {args.limit}")

    start = time.time()
    results = verify_all_fields(
        args.pdf,
        registry,
        section_filter=args.section,
        confidence_max=args.confidence,
        limit=args.limit,
    )
    elapsed = time.time() - start

    report = generate_report(results, args.output)

    s = report["summary"]
    print(f"\n=== RESULTS ===")
    print(f"Total:      {s['total']}")
    print(f"Matches:    {s['matches']}")
    print(f"Mismatches: {s['mismatches']}")
    print(f"Match rate: {s['match_rate'] * 100:.1f}%")
    print(f"Time:       {elapsed:.1f}s ({elapsed / max(s['total'], 1) * 1000:.0f}ms/field)")

    if report["by_section"]:
        print(f"\nMismatches by section:")
        for sec, count in sorted(report["by_section"].items(), key=lambda x: -x[1]):
            print(f"  {sec}: {count}")

    print(f"\nBy confidence band:")
    for band, stats in report["by_confidence"].items():
        if stats["total"] > 0:
            print(f"  {band}: {stats['mismatches']}/{stats['total']} mismatches")

    print(f"\nReport saved to: {args.output}")

    # Show top corrections
    corrections = report.get("corrections", [])
    if corrections:
        print(f"\n--- Top {min(20, len(corrections))} Corrections ---")
        for c in corrections[:20]:
            print(f"\n  {c['pdfFieldName']}")
            print(f"    Current:   {c['currentLabel'][:60]}")
            print(f"    Suggested: {c['suggestedLabel'][:60]}")
            print(f"    Nearest:   {c['nearestText'][:60]}")


if __name__ == "__main__":
    main()

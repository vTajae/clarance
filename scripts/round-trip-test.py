#!/usr/bin/env python3
"""
SF-86 PDF Round-Trip Test

Tests the fill/extract pipeline by:
  1. Loading the field registry (6,197 fields)
  2. Generating deterministic test values for each field type
  3. POSTing values to /fill-pdf to produce a filled PDF
  4. POSTing the filled PDF to /extract-fields to read values back
  5. Comparing sent vs extracted values per field type
  6. Printing a summary table and saving a detailed JSON report

Usage:
    python scripts/round-trip-test.py
    python scripts/round-trip-test.py --service-url http://localhost:8001
    python scripts/round-trip-test.py --dry-run
"""

from __future__ import annotations

import argparse
import json
import sys
import tempfile
import time
import urllib.request
import urllib.error
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
FIELD_REGISTRY_PATH = PROJECT_ROOT / "app" / "src" / "lib" / "field-registry" / "field-registry.json"
REPORT_OUTPUT_PATH = SCRIPT_DIR / "round-trip-report.json"

# ---------------------------------------------------------------------------
# Field types
# ---------------------------------------------------------------------------

TEXT = "PDFTextField"
CHECKBOX = "PDFCheckBox"
DROPDOWN = "PDFDropdown"
RADIO = "PDFRadioGroup"

ALL_TYPES = [TEXT, CHECKBOX, DROPDOWN, RADIO]

DEFAULT_MAX_LENGTH = 50

# ---------------------------------------------------------------------------
# Data structures
# ---------------------------------------------------------------------------


@dataclass
class TypeStats:
    """Accumulates match statistics for a single field type."""

    sent: int = 0
    extracted: int = 0
    matched: int = 0

    @property
    def rate(self) -> float:
        return (self.matched / self.extracted * 100.0) if self.extracted > 0 else 0.0


@dataclass
class Mismatch:
    """Records a single field whose extracted value did not match the sent value."""

    pdfFieldName: str
    pdfFieldType: str
    sent: str
    extracted: str | None
    label: str

    def to_dict(self) -> dict[str, Any]:
        return {
            "pdfFieldName": self.pdfFieldName,
            "pdfFieldType": self.pdfFieldType,
            "sent": self.sent,
            "extracted": self.extracted,
            "label": self.label,
        }


# ---------------------------------------------------------------------------
# Test value generation
# ---------------------------------------------------------------------------


def generate_test_values(
    registry: list[dict[str, Any]],
) -> tuple[dict[str, str], dict[str, dict[str, Any]]]:
    """Build a dict of {pdfFieldName: test_value} from the field registry.

    Also returns a lookup dict of {pdfFieldName: registry_entry} for later
    comparison and reporting.

    Fields whose generated value is empty are excluded from the output.
    """
    values: dict[str, str] = {}
    lookup: dict[str, dict[str, Any]] = {}
    checkbox_index = 0

    for entry in registry:
        name: str = entry["pdfFieldName"]
        ftype: str = entry["pdfFieldType"]
        label: str = entry.get("label", "")
        options: list[str] | None = entry.get("options")
        max_length: int | None = entry.get("maxLength")
        value_map: dict[str, str] | None = entry.get("valueMap")

        lookup[name] = entry
        value = ""

        if ftype == TEXT:
            raw = f"Test {label}"
            limit = max_length if max_length and max_length > 0 else DEFAULT_MAX_LENGTH
            value = raw[:limit]

        elif ftype == CHECKBOX:
            # Alternate: roughly 50% Yes, 50% No
            value = "Yes" if checkbox_index % 2 == 0 else "No"
            checkbox_index += 1

        elif ftype == DROPDOWN:
            if options and len(options) > 0:
                value = options[0]
            # else: leave empty, skip

        elif ftype == RADIO:
            if options and len(options) > 0:
                display_val = options[0]
                # Convert to PDF value using valueMap (1-based index)
                # so fill_pdf sends the correct value to the PDF service.
                if value_map and display_val in value_map:
                    value = value_map[display_val]
                else:
                    # Fallback: use 1-based index directly
                    value = "1"
            # else: leave empty, skip

        if value:
            values[name] = value

    return values, lookup


# ---------------------------------------------------------------------------
# Comparison logic
# ---------------------------------------------------------------------------


def compare_results(
    sent_values: dict[str, str],
    extracted_fields: dict[str, Any],
    lookup: dict[str, dict[str, Any]],
) -> tuple[dict[str, TypeStats], list[Mismatch]]:
    """Compare sent values against extracted values, per field type.

    Returns per-type statistics and a list of mismatches.
    """
    stats: dict[str, TypeStats] = {t: TypeStats() for t in ALL_TYPES}
    mismatches: list[Mismatch] = []

    for name, sent_val in sent_values.items():
        entry = lookup.get(name)
        if entry is None:
            continue

        ftype = entry["pdfFieldType"]
        label = entry.get("label", "")

        if ftype not in stats:
            continue

        stats[ftype].sent += 1

        extracted_val = extracted_fields.get(name)

        if ftype == CHECKBOX:
            # Only count checkboxes we sent "Yes" to as meaningful.
            # Checkboxes sent "No" may not round-trip because the PDF
            # extraction reports unfilled checkboxes as "No" regardless.
            if sent_val != "Yes":
                # Don't count "No" sends in sent/extracted/matched at all
                stats[ftype].sent -= 1
                continue

            # We sent "Yes" -- check extraction
            stats[ftype].extracted += 1
            if extracted_val and extracted_val.strip().lower() in ("yes", "true", "on", "1"):
                stats[ftype].matched += 1
            else:
                mismatches.append(
                    Mismatch(
                        pdfFieldName=name,
                        pdfFieldType=ftype,
                        sent=sent_val,
                        extracted=extracted_val,
                        label=label,
                    )
                )

        elif ftype == TEXT:
            if extracted_val is not None:
                stats[ftype].extracted += 1
                if extracted_val == sent_val:
                    stats[ftype].matched += 1
                else:
                    mismatches.append(
                        Mismatch(
                            pdfFieldName=name,
                            pdfFieldType=ftype,
                            sent=sent_val,
                            extracted=extracted_val,
                            label=label,
                        )
                    )
            else:
                # Field not in extraction result at all
                mismatches.append(
                    Mismatch(
                        pdfFieldName=name,
                        pdfFieldType=ftype,
                        sent=sent_val,
                        extracted=None,
                        label=label,
                    )
                )

        elif ftype == DROPDOWN:
            if extracted_val is not None:
                stats[ftype].extracted += 1
                if extracted_val == sent_val:
                    stats[ftype].matched += 1
                else:
                    mismatches.append(
                        Mismatch(
                            pdfFieldName=name,
                            pdfFieldType=ftype,
                            sent=sent_val,
                            extracted=extracted_val,
                            label=label,
                        )
                    )
            else:
                mismatches.append(
                    Mismatch(
                        pdfFieldName=name,
                        pdfFieldType=ftype,
                        sent=sent_val,
                        extracted=None,
                        label=label,
                    )
                )

        elif ftype == RADIO:
            # Radio values are 1-based indices (from valueMap).
            # Extraction now returns 1-based indices too, so direct
            # comparison should work.  If no value was extracted, the
            # radio was not set (possible if fill didn't find a match).
            if extracted_val is not None:
                stats[ftype].extracted += 1
                if extracted_val == sent_val:
                    stats[ftype].matched += 1
                else:
                    mismatches.append(
                        Mismatch(
                            pdfFieldName=name,
                            pdfFieldType=ftype,
                            sent=sent_val,
                            extracted=extracted_val,
                            label=label,
                        )
                    )
            else:
                mismatches.append(
                    Mismatch(
                        pdfFieldName=name,
                        pdfFieldType=ftype,
                        sent=sent_val,
                        extracted=None,
                        label=label,
                    )
                )

    return stats, mismatches


# ---------------------------------------------------------------------------
# Display
# ---------------------------------------------------------------------------

SEPARATOR_HEAVY = "\u2550" * 55
SEPARATOR_LIGHT = "\u2500" * 55


def print_summary(stats: dict[str, TypeStats], elapsed_fill: float, elapsed_extract: float) -> None:
    """Print a formatted summary table to stdout."""
    print()
    print(SEPARATOR_HEAVY)
    print("SF-86 Round-Trip Test Results")
    print(SEPARATOR_HEAVY)
    print(f"{'Field Type':<16}{'Sent':>8}{'Extracted':>11}{'Matched':>9}{'Rate':>9}")
    print(SEPARATOR_LIGHT)

    total_sent = 0
    total_extracted = 0
    total_matched = 0

    type_display_order = [TEXT, CHECKBOX, DROPDOWN, RADIO]
    type_labels = {
        TEXT: "TextField",
        CHECKBOX: "CheckBox",
        DROPDOWN: "Dropdown",
        RADIO: "RadioGroup",
    }

    for ftype in type_display_order:
        s = stats[ftype]
        total_sent += s.sent
        total_extracted += s.extracted
        total_matched += s.matched
        print(f"{type_labels[ftype]:<16}{s.sent:>8}{s.extracted:>11}{s.matched:>9}{s.rate:>8.1f}%")

    print(SEPARATOR_LIGHT)
    total_rate = (total_matched / total_extracted * 100.0) if total_extracted > 0 else 0.0
    print(f"{'TOTAL':<16}{total_sent:>8}{total_extracted:>11}{total_matched:>9}{total_rate:>8.1f}%")
    print(SEPARATOR_HEAVY)
    print()
    print(f"  Fill time:    {elapsed_fill:.1f}s")
    print(f"  Extract time: {elapsed_extract:.1f}s")
    print(f"  Total time:   {elapsed_fill + elapsed_extract:.1f}s")
    print()


def print_dry_run_summary(values: dict[str, str], lookup: dict[str, dict[str, Any]]) -> None:
    """Print value generation counts without calling the service."""
    counts: dict[str, int] = {t: 0 for t in ALL_TYPES}
    for name, val in values.items():
        entry = lookup.get(name)
        if entry:
            ftype = entry["pdfFieldType"]
            if ftype in counts:
                counts[ftype] += 1

    type_labels = {
        TEXT: "TextField",
        CHECKBOX: "CheckBox",
        DROPDOWN: "Dropdown",
        RADIO: "RadioGroup",
    }

    print()
    print(SEPARATOR_HEAVY)
    print("SF-86 Round-Trip Test -- DRY RUN")
    print(SEPARATOR_HEAVY)
    print(f"{'Field Type':<20}{'Values Generated':>18}")
    print(SEPARATOR_LIGHT)
    total = 0
    for ftype in ALL_TYPES:
        c = counts[ftype]
        total += c
        print(f"{type_labels[ftype]:<20}{c:>18}")
    print(SEPARATOR_LIGHT)
    print(f"{'TOTAL':<20}{total:>18}")
    print(SEPARATOR_HEAVY)
    print()
    print(f"  Registry fields:    {len(lookup)}")
    print(f"  Non-empty values:   {len(values)}")
    print(f"  Skipped (empty):    {len(lookup) - len(values)}")
    print()


# ---------------------------------------------------------------------------
# Report
# ---------------------------------------------------------------------------


def save_report(
    stats: dict[str, TypeStats],
    mismatches: list[Mismatch],
    elapsed_fill: float,
    elapsed_extract: float,
) -> None:
    """Write a detailed JSON report to disk."""
    type_labels = {
        TEXT: "TextField",
        CHECKBOX: "CheckBox",
        DROPDOWN: "Dropdown",
        RADIO: "RadioGroup",
    }

    summary: dict[str, Any] = {}
    for ftype in ALL_TYPES:
        s = stats[ftype]
        summary[type_labels[ftype]] = {
            "sent": s.sent,
            "extracted": s.extracted,
            "matched": s.matched,
            "rate": round(s.rate, 2),
        }

    total_sent = sum(s.sent for s in stats.values())
    total_extracted = sum(s.extracted for s in stats.values())
    total_matched = sum(s.matched for s in stats.values())
    total_rate = (total_matched / total_extracted * 100.0) if total_extracted > 0 else 0.0

    summary["TOTAL"] = {
        "sent": total_sent,
        "extracted": total_extracted,
        "matched": total_matched,
        "rate": round(total_rate, 2),
    }

    report = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
        "elapsed_fill_seconds": round(elapsed_fill, 2),
        "elapsed_extract_seconds": round(elapsed_extract, 2),
        "summary": summary,
        "mismatch_count": len(mismatches),
        "mismatches": [m.to_dict() for m in mismatches],
    }

    REPORT_OUTPUT_PATH.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(f"  Report saved to: {REPORT_OUTPUT_PATH}")
    print()


# ---------------------------------------------------------------------------
# Service calls
# ---------------------------------------------------------------------------


def call_fill_pdf(
    service_url: str,
    field_values: dict[str, str],
    template: str = "sf861.pdf",
    timeout: int = 120,
) -> tuple[bytes, float]:
    """POST field values to /fill-pdf and return (pdf_bytes, elapsed_seconds)."""
    url = f"{service_url.rstrip('/')}/fill-pdf"
    payload = {
        "template_path": template,
        "field_values": field_values,
    }

    print(f"  Filling PDF with {len(field_values)} field values...")
    print(f"  POST {url}")

    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    start = time.perf_counter()
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            elapsed = time.perf_counter() - start
            content_type = resp.headers.get("content-type", "")
            if "application/pdf" not in content_type:
                print(f"  WARNING: Expected application/pdf, got {content_type}", file=sys.stderr)
            pdf_bytes = resp.read()
    except urllib.error.HTTPError as exc:
        elapsed = time.perf_counter() - start
        print(f"  ERROR: /fill-pdf returned {exc.code}", file=sys.stderr)
        print(f"  Response: {exc.read().decode('utf-8', errors='replace')[:500]}", file=sys.stderr)
        sys.exit(1)

    print(f"  Received {len(pdf_bytes):,} bytes in {elapsed:.1f}s")
    return pdf_bytes, elapsed


def _build_multipart(filename: str, file_bytes: bytes, field_name: str = "file") -> tuple[bytes, str]:
    """Build a multipart/form-data body for a single file upload."""
    boundary = f"----PythonBoundary{int(time.time() * 1000)}"
    parts: list[bytes] = []
    parts.append(f"--{boundary}\r\n".encode())
    parts.append(
        f'Content-Disposition: form-data; name="{field_name}"; filename="{filename}"\r\n'.encode()
    )
    parts.append(b"Content-Type: application/pdf\r\n\r\n")
    parts.append(file_bytes)
    parts.append(f"\r\n--{boundary}--\r\n".encode())
    body = b"".join(parts)
    content_type = f"multipart/form-data; boundary={boundary}"
    return body, content_type


def call_extract_fields(
    service_url: str,
    pdf_bytes: bytes,
    timeout: int = 120,
) -> tuple[dict[str, Any], float]:
    """POST a PDF to /extract-fields and return (fields_dict, elapsed_seconds)."""
    url = f"{service_url.rstrip('/')}/extract-fields"

    print(f"  Extracting fields from filled PDF...")
    print(f"  POST {url}")

    body, content_type = _build_multipart("round-trip-test.pdf", pdf_bytes)
    req = urllib.request.Request(
        url,
        data=body,
        headers={"Content-Type": content_type},
        method="POST",
    )

    start = time.perf_counter()
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            elapsed = time.perf_counter() - start
            data = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        elapsed = time.perf_counter() - start
        print(f"  ERROR: /extract-fields returned {exc.code}", file=sys.stderr)
        print(f"  Response: {exc.read().decode('utf-8', errors='replace')[:500]}", file=sys.stderr)
        sys.exit(1)

    field_count = data.get("field_count", 0)
    fields = data.get("fields", {})
    print(f"  Extracted {field_count} fields in {elapsed:.1f}s")
    return fields, elapsed


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main() -> None:
    parser = argparse.ArgumentParser(
        description="SF-86 PDF round-trip fill/extract validation test.",
    )
    parser.add_argument(
        "--service-url",
        default="http://localhost:8001",
        help="Base URL of the PDF service (default: http://localhost:8001)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Generate test values and print counts without calling the service.",
    )
    parser.add_argument(
        "--template",
        default="sf861.pdf",
        help="Template PDF filename (default: sf861.pdf)",
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=120,
        help="HTTP request timeout in seconds (default: 120)",
    )
    args = parser.parse_args()

    # -- Load registry -------------------------------------------------------
    if not FIELD_REGISTRY_PATH.is_file():
        print(f"ERROR: Field registry not found at {FIELD_REGISTRY_PATH}", file=sys.stderr)
        sys.exit(1)

    print(f"Loading field registry from {FIELD_REGISTRY_PATH}...")
    registry: list[dict[str, Any]] = json.loads(
        FIELD_REGISTRY_PATH.read_text(encoding="utf-8")
    )
    print(f"  Loaded {len(registry)} field definitions.")

    # -- Generate test values ------------------------------------------------
    print("Generating test values...")
    sent_values, lookup = generate_test_values(registry)
    print(f"  Generated {len(sent_values)} non-empty values ({len(lookup) - len(sent_values)} skipped).")

    # -- Dry run exit --------------------------------------------------------
    if args.dry_run:
        print_dry_run_summary(sent_values, lookup)
        return

    # -- Health check --------------------------------------------------------
    print(f"\nChecking service health at {args.service_url}...")
    health_url = f"{args.service_url.rstrip('/')}/health"
    try:
        with urllib.request.urlopen(health_url, timeout=10) as resp:
            health = json.loads(resp.read().decode("utf-8"))
            print(f"  Service: {health.get('service', 'unknown')} -- {health.get('status', 'unknown')}")
            print(f"  Templates: {health.get('templates_available', [])}")
    except urllib.error.URLError as exc:
        print(f"  ERROR: Cannot connect to {args.service_url}", file=sys.stderr)
        print(f"  Reason: {exc.reason}", file=sys.stderr)
        print("  Is the PDF service running? Start it with:", file=sys.stderr)
        print("    cd pdf-service && uvicorn main:app --port 8001", file=sys.stderr)
        sys.exit(1)
    except TimeoutError:
        print(f"  ERROR: Health check timed out", file=sys.stderr)
        sys.exit(1)

    # -- Fill PDF ------------------------------------------------------------
    print()
    pdf_bytes, elapsed_fill = call_fill_pdf(
        args.service_url,
        sent_values,
        template=args.template,
        timeout=args.timeout,
    )

    # -- Save temp file (for debugging; also needed for extract upload) ------
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False, prefix="sf86_rt_") as tmp:
        tmp.write(pdf_bytes)
        tmp_path = tmp.name
    print(f"  Saved filled PDF to {tmp_path}")

    # -- Extract fields ------------------------------------------------------
    print()
    extracted_fields, elapsed_extract = call_extract_fields(
        args.service_url,
        pdf_bytes,
        timeout=args.timeout,
    )

    # -- Compare -------------------------------------------------------------
    print("\nComparing sent vs extracted values...")
    stats, mismatches = compare_results(sent_values, extracted_fields, lookup)

    # -- Output --------------------------------------------------------------
    print_summary(stats, elapsed_fill, elapsed_extract)

    if mismatches:
        print(f"  {len(mismatches)} mismatches found (see report for details).")
    else:
        print("  All fields matched perfectly.")

    save_report(stats, mismatches, elapsed_fill, elapsed_extract)

    # -- Clean up temp file --------------------------------------------------
    try:
        Path(tmp_path).unlink()
    except OSError:
        pass


if __name__ == "__main__":
    main()

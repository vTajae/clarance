#!/usr/bin/env python3
"""
Live review of SF-86 sections 13A, 13B, and 13C.

Loads the field registry, generates unique test values for every field in
sections 13A/B/C, renders filled pages via the PDF service, and performs a
round-trip fill-then-extract verification.

Outputs:
  /tmp/section13-review/page_{N}.png   -- rendered page images
  /tmp/section13-review/report.json    -- machine-readable results
"""

from __future__ import annotations

import json
import os
import sys
import time
from collections import defaultdict
from pathlib import Path
from typing import Any

import urllib.request
import urllib.error

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

REGISTRY_PATH = Path(
    "/home/watery/Desktop/clear-rents/app/src/lib/field-registry/field-registry.json"
)
OUTPUT_DIR = Path("/tmp/section13-review")
API_BASE = "http://localhost:8001"
TEMPLATE = "sf861"
SECTIONS = ("section13A", "section13B", "section13C")
DPI = 150


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def load_registry() -> list[dict[str, Any]]:
    with open(REGISTRY_PATH, "r", encoding="utf-8") as fh:
        return json.load(fh)


def truncate(value: str, max_length: int | None) -> str:
    if max_length and len(value) > max_length:
        return value[:max_length]
    return value


def generate_ui_value(
    field: dict[str, Any],
    index: int,
    checkbox_toggle: bool,
) -> Any:
    """Return a UI-layer test value appropriate for the field type."""
    ft = field.get("uiFieldType", "text")
    page = field.get("pdfPage", 0)
    label = field.get("label", "unknown")
    max_len = field.get("maxLength")
    options = field.get("options") or []
    value_map = field.get("valueMap") or {}

    if ft == "checkbox":
        return checkbox_toggle

    if ft == "radio":
        if value_map:
            keys = list(value_map.keys())
            return keys[index % len(keys)]
        return "1"

    if ft == "date":
        month = (index % 12) + 1
        day = (index % 28) + 1
        return f"{month:02d}/{day:02d}/2025"

    if ft in ("telephone", "phone"):
        return f"555{page:02d}{index:05d}"

    if ft == "email":
        return f"f{index}@test.com"

    if ft == "select":
        if options:
            return options[0] if isinstance(options[0], str) else str(options[0])
        return ""

    if ft == "state":
        if options:
            return options[0] if isinstance(options[0], str) else str(options[0])
        return ""

    if ft == "country":
        return "United States"

    # Default: text (including 'textarea', etc.)
    short_label = label[:20].replace(" ", "")
    section_tag = field.get("section", "S13")[-3:].upper()
    raw = f"{section_tag}_P{page}_{short_label}"
    limit = max_len if max_len else 50
    return truncate(raw, limit)


def ui_to_pdf(field: dict[str, Any], ui_value: Any) -> str:
    """Transform a UI value into the string the PDF service expects."""
    ft = field.get("uiFieldType", "text")
    value_map = field.get("valueMap") or {}

    if ft == "checkbox":
        return "Yes" if ui_value else "Off"

    if ft == "radio":
        if value_map:
            mapped = value_map.get(str(ui_value))
            if mapped is not None:
                return str(mapped)
        return str(ui_value)

    if ft in ("telephone", "phone"):
        digits = str(ui_value).replace("-", "").replace(" ", "")
        digits = digits.lstrip("+1")
        if len(digits) < 10:
            digits = digits.ljust(10, "0")
        return f"({digits[:3]}) {digits[3:6]}-{digits[6:10]}"

    if ft == "select" or ft == "state":
        if value_map:
            mapped = value_map.get(str(ui_value))
            if mapped is not None:
                return str(mapped)
        return str(ui_value)

    if ft == "country":
        if value_map:
            mapped = value_map.get(str(ui_value))
            if mapped is not None:
                return str(mapped)
        return str(ui_value)

    # text, date, email, textarea, etc.
    return str(ui_value)


# ---------------------------------------------------------------------------
# Main script
# ---------------------------------------------------------------------------


def main() -> None:
    print("=" * 72)
    print("  LIVE REVIEW: Sections 13A, 13B, 13C")
    print("=" * 72)

    # -- Load registry -------------------------------------------------------
    print(f"\nLoading registry from {REGISTRY_PATH} ...")
    registry = load_registry()
    print(f"  Total fields in registry: {len(registry)}")

    # -- Filter to target sections -------------------------------------------
    section_fields: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for entry in registry:
        sec = entry.get("section", "")
        if sec in SECTIONS:
            section_fields[sec].append(entry)

    total_target = sum(len(v) for v in section_fields.values())
    for sec in SECTIONS:
        count = len(section_fields.get(sec, []))
        print(f"  {sec}: {count} fields")
    print(f"  Total target fields: {total_target}")

    if total_target == 0:
        print("\nERROR: No fields found for sections 13A/B/C. Aborting.")
        sys.exit(1)

    # -- Generate test values ------------------------------------------------
    print("\nGenerating test values ...")
    # {pdfFieldName: pdfValue}
    all_pdf_values: dict[str, str] = {}
    # For reporting
    field_details: list[dict[str, Any]] = []
    # Per-page grouping for render
    page_fields: dict[int, dict[str, str]] = defaultdict(dict)

    global_index = 0
    for sec in SECTIONS:
        fields = section_fields.get(sec, [])
        for field in fields:
            checkbox_toggle = (global_index % 2) == 0
            ui_val = generate_ui_value(field, global_index, checkbox_toggle)
            pdf_val = ui_to_pdf(field, ui_val)
            pdf_name = field["pdfFieldName"]
            pdf_page = field.get("pdfPage", 1)  # 1-based in registry

            all_pdf_values[pdf_name] = pdf_val
            page_fields[pdf_page][pdf_name] = pdf_val

            field_details.append(
                {
                    "pdfFieldName": pdf_name,
                    "section": sec,
                    "pdfPage": pdf_page,
                    "uiFieldType": field.get("uiFieldType", "text"),
                    "label": field.get("label", ""),
                    "uiValue": ui_val,
                    "pdfValue": pdf_val,
                }
            )
            global_index += 1

    pages_involved = sorted(page_fields.keys())
    print(f"  Pages involved: {pages_involved}")
    for p in pages_involved:
        print(f"    Page {p}: {len(page_fields[p])} fields")

    # -- Create output directory ---------------------------------------------
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"\nOutput directory: {OUTPUT_DIR}")

    # -- Render filled pages -------------------------------------------------
    print("\n--- Rendering filled pages ---")
    render_results: dict[int, dict[str, Any]] = {}
    for page in pages_involved:
        api_page = page - 1  # 0-based for API
        url = f"{API_BASE}/render-filled-page/{TEMPLATE}/{api_page}?dpi={DPI}"
        payload = json.dumps({"field_values": page_fields[page]}).encode()

        print(f"  Page {page} (API page {api_page}): "
              f"{len(page_fields[page])} fields ... ", end="", flush=True)

        t0 = time.monotonic()
        try:
            req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"}, method="POST")
            with urllib.request.urlopen(req, timeout=120) as resp:
                data = resp.read()
                elapsed = time.monotonic() - t0
                out_path = OUTPUT_DIR / f"page_{page}.png"
                out_path.write_bytes(data)
                size_kb = len(data) / 1024
                print(f"OK ({elapsed:.1f}s, {size_kb:.0f} KB)")
                render_results[page] = {
                    "status": "ok",
                    "elapsed_s": round(elapsed, 2),
                    "size_bytes": len(data),
                    "field_count": len(page_fields[page]),
                    "image_path": str(out_path),
                }
        except urllib.error.HTTPError as exc:
            elapsed = time.monotonic() - t0
            print(f"FAIL (HTTP {exc.code}, {elapsed:.1f}s)")
            render_results[page] = {
                "status": "error",
                "http_status": exc.code,
                "body": exc.read().decode()[:500],
                "elapsed_s": round(elapsed, 2),
                "field_count": len(page_fields[page]),
            }
        except Exception as exc:
            elapsed = time.monotonic() - t0
            print(f"EXCEPTION ({type(exc).__name__}: {exc})")
            render_results[page] = {
                "status": "exception",
                "error": str(exc),
                "elapsed_s": round(elapsed, 2),
                "field_count": len(page_fields[page]),
            }

    # -- Round-trip verification ---------------------------------------------
    print("\n--- Round-trip verification ---")

    # Step 1: Fill PDF
    print("  Filling PDF with all section 13 values ... ", end="", flush=True)
    fill_url = f"{API_BASE}/fill-pdf"
    fill_payload = json.dumps({
        "template_path": f"{TEMPLATE}.pdf",
        "field_values": all_pdf_values,
    }).encode()

    filled_pdf_bytes: bytes | None = None
    t0 = time.monotonic()
    try:
        req = urllib.request.Request(fill_url, data=fill_payload, headers={"Content-Type": "application/json"}, method="POST")
        with urllib.request.urlopen(req, timeout=300) as resp:
            filled_pdf_bytes = resp.read()
            elapsed = time.monotonic() - t0
            print(f"OK ({elapsed:.1f}s, {len(filled_pdf_bytes) / 1024:.0f} KB)")
            filled_path = OUTPUT_DIR / "filled_section13.pdf"
            filled_path.write_bytes(filled_pdf_bytes)
            print(f"  Saved filled PDF: {filled_path}")
    except urllib.error.HTTPError as exc:
        elapsed = time.monotonic() - t0
        print(f"FAIL (HTTP {exc.code}, {elapsed:.1f}s)")
        print(f"  Response: {exc.read().decode()[:300]}")
    except Exception as exc:
        elapsed = time.monotonic() - t0
        print(f"EXCEPTION ({type(exc).__name__}: {exc})")

    # Step 2: Extract fields from filled PDF
    extract_results: dict[str, Any] = {}
    if filled_pdf_bytes:
        print("  Extracting fields from filled PDF ... ", end="", flush=True)
        extract_url = f"{API_BASE}/extract-fields"
        t0 = time.monotonic()
        try:
            # Build multipart form data manually
            boundary = "----PythonBoundary123456"
            body_parts = []
            body_parts.append(f"--{boundary}".encode())
            body_parts.append(b'Content-Disposition: form-data; name="file"; filename="filled.pdf"')
            body_parts.append(b"Content-Type: application/pdf")
            body_parts.append(b"")
            body_parts.append(filled_pdf_bytes)
            body_parts.append(f"--{boundary}--".encode())
            body_data = b"\r\n".join(body_parts)

            req = urllib.request.Request(
                extract_url,
                data=body_data,
                headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=120) as resp:
                extracted_data = json.loads(resp.read().decode())
                elapsed = time.monotonic() - t0
                # fields is a dict: {field_name: value}
                extracted_fields = extracted_data.get("fields", {})
                field_count = extracted_data.get("field_count", len(extracted_fields))
                print(f"OK ({elapsed:.1f}s, {field_count} fields returned)")

                # Build lookup: field_name -> value (skip Off/empty)
                extracted_map: dict[str, str] = {}
                for name, val in extracted_fields.items():
                    if val and val != "Off":
                        extracted_map[name] = val

                # Compare per section
                section_match: dict[str, dict[str, int]] = {}
                mismatch_details: list[dict[str, Any]] = []
                unmapped_fields: list[str] = []

                for sec in SECTIONS:
                    match_count = 0
                    mismatch_count = 0
                    missing_count = 0

                    for fd in field_details:
                        if fd["section"] != sec:
                            continue
                        pdf_name = fd["pdfFieldName"]
                        expected = fd["pdfValue"]

                        # Skip Off/empty — those won't appear in extract
                        if expected in ("Off", ""):
                            match_count += 1
                            continue

                        actual = extracted_map.get(pdf_name)
                        if actual is None:
                            missing_count += 1
                            unmapped_fields.append(pdf_name)
                        elif actual == expected:
                            match_count += 1
                        else:
                            mismatch_count += 1
                            mismatch_details.append(
                                {
                                    "section": sec,
                                    "pdfFieldName": pdf_name,
                                    "expected": expected,
                                    "actual": actual,
                                    "uiFieldType": fd["uiFieldType"],
                                    "label": fd["label"],
                                }
                            )

                    section_match[sec] = {
                        "match": match_count,
                        "mismatch": mismatch_count,
                        "missing": missing_count,
                        "total": match_count + mismatch_count + missing_count,
                    }

                extract_results = {
                    "per_section": section_match,
                    "mismatches": mismatch_details,
                    "unmapped_fields": unmapped_fields,
                    "total_extracted": len(extracted_fields),
                    "total_non_empty_extracted": len(extracted_map),
                }
        except urllib.error.HTTPError as exc:
            elapsed = time.monotonic() - t0
            print(f"FAIL (HTTP {exc.code}, {elapsed:.1f}s)")
            extract_results = {
                "status": "error",
                "http_status": exc.code,
                "body": exc.read().decode()[:500],
            }
        except Exception as exc:
            elapsed = time.monotonic() - t0
            print(f"EXCEPTION ({type(exc).__name__}: {exc})")
            extract_results = {"status": "exception", "error": str(exc)}

    # -- Summary report ------------------------------------------------------
    print("\n" + "=" * 72)
    print("  SUMMARY REPORT")
    print("=" * 72)

    print("\n  Per-page rendering:")
    for page in pages_involved:
        r = render_results.get(page, {})
        status = r.get("status", "unknown")
        count = r.get("field_count", 0)
        if status == "ok":
            print(f"    Page {page}: {count} fields filled, "
                  f"image saved ({r.get('size_bytes', 0) / 1024:.0f} KB)")
        else:
            print(f"    Page {page}: {count} fields, STATUS={status}")

    if extract_results and "per_section" in extract_results:
        print("\n  Round-trip verification:")
        total_match = 0
        total_mismatch = 0
        total_missing = 0
        for sec in SECTIONS:
            sr = extract_results["per_section"].get(sec, {})
            m = sr.get("match", 0)
            mm = sr.get("mismatch", 0)
            mi = sr.get("missing", 0)
            t = sr.get("total", 0)
            total_match += m
            total_mismatch += mm
            total_missing += mi
            pct = (m / t * 100) if t > 0 else 0
            print(f"    {sec}: {m}/{t} match ({pct:.1f}%), "
                  f"{mm} mismatches, {mi} missing")

        grand_total = total_match + total_mismatch + total_missing
        grand_pct = (total_match / grand_total * 100) if grand_total > 0 else 0
        print(f"\n    TOTAL: {total_match}/{grand_total} match ({grand_pct:.1f}%)")

        if extract_results.get("mismatches"):
            print(f"\n  Mismatches ({len(extract_results['mismatches'])}):")
            for mm in extract_results["mismatches"][:20]:
                print(f"    [{mm['section']}] {mm['pdfFieldName']}: "
                      f"expected={mm['expected']!r} actual={mm['actual']!r} "
                      f"({mm['uiFieldType']})")
            if len(extract_results["mismatches"]) > 20:
                remaining = len(extract_results["mismatches"]) - 20
                print(f"    ... and {remaining} more (see report.json)")

        if extract_results.get("unmapped_fields"):
            print(f"\n  Unmapped fields ({len(extract_results['unmapped_fields'])}):")
            for uf in extract_results["unmapped_fields"][:10]:
                print(f"    {uf}")
            if len(extract_results["unmapped_fields"]) > 10:
                remaining = len(extract_results["unmapped_fields"]) - 10
                print(f"    ... and {remaining} more (see report.json)")
    else:
        print("\n  Round-trip verification: SKIPPED (fill or extract failed)")

    # -- Save JSON report ----------------------------------------------------
    report = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
        "sections": list(SECTIONS),
        "total_fields": total_target,
        "fields_per_section": {sec: len(section_fields.get(sec, []))
                               for sec in SECTIONS},
        "pages_involved": pages_involved,
        "render_results": {str(k): v for k, v in render_results.items()},
        "round_trip": extract_results,
        "field_details": field_details,
    }

    report_path = OUTPUT_DIR / "report.json"
    with open(report_path, "w", encoding="utf-8") as fh:
        json.dump(report, fh, indent=2, default=str)

    print(f"\n  Report saved: {report_path}")
    print("=" * 72)
    print("  DONE")
    print("=" * 72)


if __name__ == "__main__":
    main()

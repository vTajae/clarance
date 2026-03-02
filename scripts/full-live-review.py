#!/usr/bin/env python3
"""
Full live review of ALL 38 SF-86 sections with 3 data profiles.

Generates 3 distinct fill versions, round-trips each, then cross-references
to identify any gaps in field mapping.

Outputs:
  /tmp/full-live-review/v{1,2,3}/page_{N}.png  -- rendered page images
  /tmp/full-live-review/v{1,2,3}/filled.pdf     -- filled PDF
  /tmp/full-live-review/v{1,2,3}/results.json   -- per-version results
  /tmp/full-live-review/cross-reference.json     -- cross-reference report
"""

from __future__ import annotations

import hashlib
import json
import os
import sys
import time
import urllib.error
import urllib.request
from collections import defaultdict
from pathlib import Path
from typing import Any

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

REGISTRY_PATH = Path(
    "/home/watery/Desktop/clear-rents/app/src/lib/field-registry/field-registry.json"
)
OUTPUT_DIR = Path("/tmp/full-live-review")
API_BASE = "http://localhost:8001"
TEMPLATE = "sf861"
DPI = 150
EXCLUDED_SECTIONS = {"ssnPageHeader"}

# ---------------------------------------------------------------------------
# Value generation profiles
# ---------------------------------------------------------------------------

def _hash_seed(seed: str) -> int:
    return int(hashlib.md5(seed.encode()).hexdigest()[:8], 16)


def generate_value_v1(field: dict, idx: int) -> Any:
    """Profile 1: Section-encoded identifiers (e.g. 'S1_P5_LastName')."""
    ft = field.get("uiFieldType", "text")
    sec = field.get("section", "?")[-4:].upper()
    page = field.get("pdfPage", 0)
    label = field.get("label", "field")[:18].replace(" ", "")
    max_len = field.get("maxLength")
    options = field.get("options") or []
    vmap = field.get("valueMap") or {}

    if ft in ("checkbox", "branch", "notApplicable"):
        return idx % 2 == 0
    if ft == "radio":
        keys = list(vmap.keys()) if vmap else ["1"]
        return keys[idx % len(keys)]
    if ft in ("date", "dateRange"):
        m = (idx % 12) + 1
        d = (idx % 28) + 1
        return f"{m:02d}/{d:02d}/2024"
    if ft in ("telephone", "phone"):
        return f"555{page:02d}{idx:05d}"
    if ft == "email":
        return f"v1_{idx}@test.com"
    if ft in ("select", "state"):
        return options[0] if options else ""
    if ft == "country":
        return "United States"
    # text/textarea
    raw = f"{sec}_P{page}_{label}"
    limit = max_len if max_len else 50
    return raw[:limit]


def generate_value_v2(field: dict, idx: int) -> Any:
    """Profile 2: Numeric sequence identifiers (e.g. 'F00042_employerName')."""
    ft = field.get("uiFieldType", "text")
    sk = field.get("semanticKey", "?")
    short_sk = sk.split(".")[-1][:15]
    max_len = field.get("maxLength")
    options = field.get("options") or []
    vmap = field.get("valueMap") or {}

    if ft in ("checkbox", "branch", "notApplicable"):
        return idx % 3 != 0  # different pattern from v1
    if ft == "radio":
        keys = list(vmap.keys()) if vmap else ["1"]
        return keys[(idx + 1) % len(keys)]  # shifted by 1
    if ft in ("date", "dateRange"):
        m = ((idx + 3) % 12) + 1
        d = ((idx + 7) % 28) + 1
        return f"{m:02d}/{d:02d}/2023"
    if ft in ("telephone", "phone"):
        return f"444{idx:07d}"
    if ft == "email":
        return f"v2.f{idx}@example.org"
    if ft in ("select", "state"):
        return options[min(1, len(options) - 1)] if len(options) > 1 else (options[0] if options else "")
    if ft == "country":
        if options and len(options) > 1:
            return options[1]
        return "Canada"
    # text/textarea
    raw = f"F{idx:05d}_{short_sk}"
    limit = max_len if max_len else 50
    return raw[:limit]


def generate_value_v3(field: dict, idx: int) -> Any:
    """Profile 3: Realistic-style data with unique markers."""
    ft = field.get("uiFieldType", "text")
    page = field.get("pdfPage", 0)
    sec = field.get("section", "?")
    max_len = field.get("maxLength")
    options = field.get("options") or []
    vmap = field.get("valueMap") or {}
    label_lower = field.get("label", "").lower()

    if ft in ("checkbox", "branch", "notApplicable"):
        return idx % 5 < 3  # 60% checked
    if ft == "radio":
        keys = list(vmap.keys()) if vmap else ["1"]
        return keys[(idx + 2) % len(keys)]
    if ft in ("date", "dateRange"):
        y = 2020 + (idx % 5)
        m = (idx % 12) + 1
        d = (idx % 28) + 1
        return f"{m:02d}/{d:02d}/{y}"
    if ft in ("telephone", "phone"):
        return f"333{page:02d}{idx:05d}"
    if ft == "email":
        return f"user{idx}.v3@mail.net"
    if ft in ("select", "state"):
        pick = idx % max(len(options), 1)
        return options[pick] if options else ""
    if ft == "country":
        countries = ["United States", "Canada", "United Kingdom", "Germany"]
        return countries[idx % len(countries)]
    # text/textarea — use label hints for realistic-ish data
    tag = f"[{sec[-4:]}.{page}.{idx}]"
    if "name" in label_lower or "first" in label_lower:
        raw = f"Name{idx}{tag}"
    elif "city" in label_lower:
        cities = ["Houston", "Denver", "Portland", "Miami", "Seattle"]
        raw = f"{cities[idx % len(cities)]}{tag}"
    elif "zip" in label_lower:
        raw = f"{10000 + idx}"
    elif "address" in label_lower or "street" in label_lower:
        raw = f"{100 + idx} Main St{tag}"
    elif "title" in label_lower or "position" in label_lower:
        raw = f"Position{idx}{tag}"
    else:
        raw = f"Val{idx}{tag}"
    limit = max_len if max_len else 50
    return raw[:limit]


PROFILES = {
    "v1": ("Section-encoded identifiers", generate_value_v1),
    "v2": ("Numeric sequence IDs", generate_value_v2),
    "v3": ("Realistic-style with markers", generate_value_v3),
}

# ---------------------------------------------------------------------------
# Value transformation (UI -> PDF)
# ---------------------------------------------------------------------------

def ui_to_pdf(field: dict, ui_value: Any) -> str:
    ft = field.get("uiFieldType", "text")
    vmap = field.get("valueMap") or {}

    if ui_value is None or ui_value == "":
        return ""

    if ft in ("checkbox", "branch", "notApplicable"):
        return "Yes" if ui_value else "Off"

    if ft == "radio":
        if vmap:
            mapped = vmap.get(str(ui_value))
            if mapped is not None:
                return str(mapped)
        return str(ui_value)

    if ft in ("telephone", "phone"):
        digits = str(ui_value).replace("-", "").replace(" ", "").replace("+", "")
        if digits.startswith("1") and len(digits) == 11:
            digits = digits[1:]
        digits = digits.ljust(10, "0")[:10]
        return f"({digits[:3]}) {digits[3:6]}-{digits[6:10]}"

    if ft in ("select", "state", "country"):
        if vmap:
            mapped = vmap.get(str(ui_value))
            if mapped is not None:
                return str(mapped)
        return str(ui_value)

    return str(ui_value)


# ---------------------------------------------------------------------------
# HTTP helpers (stdlib only)
# ---------------------------------------------------------------------------

def post_json(url: str, payload: dict, timeout: int = 300) -> tuple[int, bytes]:
    data = json.dumps(payload).encode()
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.status, resp.read()
    except urllib.error.HTTPError as exc:
        return exc.code, exc.read()


def post_multipart(url: str, filename: str, file_bytes: bytes, timeout: int = 120) -> tuple[int, bytes]:
    boundary = "----Py3Boundary9876543210"
    parts = [
        f"--{boundary}".encode(),
        f'Content-Disposition: form-data; name="file"; filename="{filename}"'.encode(),
        b"Content-Type: application/pdf",
        b"",
        file_bytes,
        f"--{boundary}--".encode(),
    ]
    body = b"\r\n".join(parts)
    req = urllib.request.Request(
        url, data=body,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.status, resp.read()
    except urllib.error.HTTPError as exc:
        return exc.code, exc.read()


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def run_version(
    version_key: str,
    description: str,
    gen_func,
    all_fields: list[dict],
    out_dir: Path,
) -> dict:
    """Run a single fill-render-extract cycle for one data profile."""
    print(f"\n{'='*72}")
    print(f"  VERSION {version_key.upper()}: {description}")
    print(f"{'='*72}")

    # Generate values
    all_pdf_values: dict[str, str] = {}
    page_fields: dict[int, dict[str, str]] = defaultdict(dict)
    field_details: list[dict] = []

    for idx, field in enumerate(all_fields):
        ui_val = gen_func(field, idx)
        pdf_val = ui_to_pdf(field, ui_val)
        pdf_name = field["pdfFieldName"]
        pdf_page = field.get("pdfPage", 1)

        if pdf_val and pdf_val != "Off":
            all_pdf_values[pdf_name] = pdf_val
            page_fields[pdf_page][pdf_name] = pdf_val

        field_details.append({
            "pdfFieldName": pdf_name,
            "section": field.get("section", ""),
            "semanticKey": field.get("semanticKey", ""),
            "pdfPage": pdf_page,
            "uiFieldType": field.get("uiFieldType", "text"),
            "uiValue": ui_val if not isinstance(ui_val, bool) else str(ui_val),
            "pdfValue": pdf_val,
        })

    pages = sorted(page_fields.keys())
    non_empty = sum(1 for d in field_details if d["pdfValue"] and d["pdfValue"] != "Off")
    print(f"  {len(all_fields)} fields, {non_empty} non-empty, {len(pages)} pages")

    # Render pages
    print(f"\n  Rendering {len(pages)} pages ...")
    render_ok = 0
    render_fail = 0
    for i, page in enumerate(pages):
        api_page = page - 1
        url = f"{API_BASE}/render-filled-page/{TEMPLATE}/{api_page}?dpi={DPI}"
        status, data = post_json(url, {"field_values": page_fields[page]}, timeout=120)
        if status == 200:
            (out_dir / f"page_{page}.png").write_bytes(data)
            render_ok += 1
        else:
            render_fail += 1
            print(f"    Page {page}: FAIL (HTTP {status})")
        # Progress every 20 pages
        if (i + 1) % 20 == 0 or i + 1 == len(pages):
            print(f"    [{i+1}/{len(pages)}] rendered ({render_ok} ok, {render_fail} fail)")

    # Fill PDF
    print(f"\n  Filling complete PDF ({len(all_pdf_values)} values) ...")
    t0 = time.monotonic()
    fill_status, fill_data = post_json(
        f"{API_BASE}/fill-pdf",
        {"template_path": f"{TEMPLATE}.pdf", "field_values": all_pdf_values},
        timeout=300,
    )
    fill_elapsed = time.monotonic() - t0

    filled_pdf: bytes | None = None
    if fill_status == 200:
        filled_pdf = fill_data
        (out_dir / "filled.pdf").write_bytes(filled_pdf)
        print(f"    OK ({fill_elapsed:.1f}s, {len(filled_pdf)/1024:.0f} KB)")
    else:
        print(f"    FAIL (HTTP {fill_status}, {fill_elapsed:.1f}s)")

    # Extract
    extract_map: dict[str, str] = {}
    if filled_pdf:
        print(f"  Extracting fields ...")
        t0 = time.monotonic()
        ext_status, ext_data = post_multipart(
            f"{API_BASE}/extract-fields", "filled.pdf", filled_pdf
        )
        ext_elapsed = time.monotonic() - t0
        if ext_status == 200:
            ext_json = json.loads(ext_data.decode())
            raw_fields = ext_json.get("fields", {})
            for name, val in raw_fields.items():
                if val and val != "Off":
                    extract_map[name] = val
            print(f"    OK ({ext_elapsed:.1f}s, {len(extract_map)} non-empty fields)")
        else:
            print(f"    FAIL (HTTP {ext_status}, {ext_elapsed:.1f}s)")

    # Compare
    sections_result: dict[str, dict] = {}
    mismatches: list[dict] = []
    missing: list[dict] = []

    by_section: dict[str, list[dict]] = defaultdict(list)
    for fd in field_details:
        by_section[fd["section"]].append(fd)

    for sec in sorted(by_section.keys()):
        match_count = 0
        mismatch_count = 0
        missing_count = 0
        total = len(by_section[sec])

        for fd in by_section[sec]:
            expected = fd["pdfValue"]
            pdf_name = fd["pdfFieldName"]

            if expected in ("Off", ""):
                match_count += 1
                continue

            actual = extract_map.get(pdf_name)
            if actual is None:
                missing_count += 1
                missing.append({
                    "section": sec, "pdfFieldName": pdf_name,
                    "expected": expected, "type": fd["uiFieldType"],
                    "semanticKey": fd["semanticKey"],
                })
            elif actual == expected:
                match_count += 1
            else:
                mismatch_count += 1
                mismatches.append({
                    "section": sec, "pdfFieldName": pdf_name,
                    "expected": expected, "actual": actual,
                    "type": fd["uiFieldType"],
                    "semanticKey": fd["semanticKey"],
                })

        sections_result[sec] = {
            "total": total,
            "match": match_count,
            "mismatch": mismatch_count,
            "missing": missing_count,
        }

    total_match = sum(s["match"] for s in sections_result.values())
    total_mismatch = sum(s["mismatch"] for s in sections_result.values())
    total_missing = sum(s["missing"] for s in sections_result.values())
    grand = total_match + total_mismatch + total_missing
    pct = (total_match / grand * 100) if grand > 0 else 0

    print(f"\n  Round-trip: {total_match}/{grand} match ({pct:.1f}%), "
          f"{total_mismatch} mismatches, {total_missing} missing")

    # Print per-section summary
    for sec in sorted(sections_result.keys()):
        sr = sections_result[sec]
        if sr["mismatch"] > 0 or sr["missing"] > 0:
            print(f"    {sec:15s}: {sr['match']}/{sr['total']} match, "
                  f"{sr['mismatch']} mismatch, {sr['missing']} missing")

    if mismatches:
        print(f"\n  Mismatches ({len(mismatches)}):")
        for mm in mismatches[:30]:
            print(f"    [{mm['section']}] {mm['pdfFieldName'][:50]}: "
                  f"expected={mm['expected']!r} actual={mm['actual']!r} ({mm['type']})")
        if len(mismatches) > 30:
            print(f"    ... and {len(mismatches) - 30} more")

    if missing:
        print(f"\n  Missing from extract ({len(missing)}):")
        for ms in missing[:20]:
            print(f"    [{ms['section']}] {ms['pdfFieldName'][:50]} ({ms['type']}): expected={ms['expected']!r}")
        if len(missing) > 20:
            print(f"    ... and {len(missing) - 20} more")

    result = {
        "version": version_key,
        "description": description,
        "total_fields": len(all_fields),
        "non_empty_values": non_empty,
        "pages_rendered": render_ok,
        "pages_failed": render_fail,
        "round_trip": {
            "total": grand,
            "match": total_match,
            "mismatch": total_mismatch,
            "missing": total_missing,
            "pct": round(pct, 2),
        },
        "per_section": sections_result,
        "mismatches": mismatches,
        "missing": missing,
        "field_details": field_details,
    }

    result_path = out_dir / "results.json"
    with open(result_path, "w") as fh:
        json.dump(result, fh, indent=2, default=str)

    return result


def cross_reference(results: list[dict], out_dir: Path) -> None:
    """Cross-reference 3 versions to find consistent gaps."""
    print(f"\n{'='*72}")
    print(f"  CROSS-REFERENCE ANALYSIS")
    print(f"{'='*72}")

    # Fields that failed in ALL versions
    all_sections = set()
    for r in results:
        all_sections.update(r["per_section"].keys())

    section_summary: dict[str, dict] = {}
    for sec in sorted(all_sections):
        matches_all = True
        details = []
        for r in results:
            sr = r["per_section"].get(sec, {})
            match = sr.get("match", 0)
            total = sr.get("total", 0)
            mismatch = sr.get("mismatch", 0)
            missing = sr.get("missing", 0)
            details.append({"v": r["version"], "match": match, "total": total,
                           "mismatch": mismatch, "missing": missing})
            if mismatch > 0 or missing > 0:
                matches_all = False

        section_summary[sec] = {
            "all_pass": matches_all,
            "versions": details,
        }

    # Print summary table
    print(f"\n  {'Section':<16} {'V1 Match':>12} {'V2 Match':>12} {'V3 Match':>12} {'Status':>10}")
    print(f"  {'-'*16} {'-'*12} {'-'*12} {'-'*12} {'-'*10}")

    pass_count = 0
    fail_count = 0
    for sec in sorted(section_summary.keys()):
        ss = section_summary[sec]
        cols = []
        for d in ss["versions"]:
            cols.append(f"{d['match']}/{d['total']}")
        status = "PASS" if ss["all_pass"] else "FAIL"
        if ss["all_pass"]:
            pass_count += 1
        else:
            fail_count += 1
        print(f"  {sec:<16} {cols[0]:>12} {cols[1]:>12} {cols[2]:>12} {status:>10}")

    print(f"\n  Sections: {pass_count} PASS, {fail_count} FAIL out of {len(section_summary)}")

    # Find fields that mismatch/missing consistently across versions
    mismatch_by_field: dict[str, list[str]] = defaultdict(list)
    missing_by_field: dict[str, list[str]] = defaultdict(list)

    for r in results:
        v = r["version"]
        for mm in r.get("mismatches", []):
            mismatch_by_field[mm["pdfFieldName"]].append(v)
        for ms in r.get("missing", []):
            missing_by_field[ms["pdfFieldName"]].append(v)

    consistent_mismatches = {k: v for k, v in mismatch_by_field.items() if len(v) == len(results)}
    consistent_missing = {k: v for k, v in missing_by_field.items() if len(v) == len(results)}

    if consistent_mismatches:
        print(f"\n  Fields mismatching in ALL {len(results)} versions ({len(consistent_mismatches)}):")
        for fname in sorted(consistent_mismatches.keys())[:30]:
            print(f"    {fname}")
    else:
        print(f"\n  No fields mismatch consistently across all versions.")

    if consistent_missing:
        print(f"\n  Fields missing in ALL {len(results)} versions ({len(consistent_missing)}):")
        for fname in sorted(consistent_missing.keys())[:30]:
            print(f"    {fname}")
    else:
        print(f"\n  No fields missing consistently across all versions.")

    # Grand totals
    print(f"\n  Grand totals across {len(results)} versions:")
    for r in results:
        rt = r["round_trip"]
        print(f"    {r['version']}: {rt['match']}/{rt['total']} ({rt['pct']}%) "
              f"- {rt['mismatch']} mismatch, {rt['missing']} missing")

    # Save cross-reference report
    xref = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
        "versions": [r["version"] for r in results],
        "section_summary": section_summary,
        "consistent_mismatches": list(consistent_mismatches.keys()),
        "consistent_missing": list(consistent_missing.keys()),
        "grand_totals": [
            {"version": r["version"], **r["round_trip"]} for r in results
        ],
    }
    xref_path = out_dir / "cross-reference.json"
    with open(xref_path, "w") as fh:
        json.dump(xref, fh, indent=2, default=str)
    print(f"\n  Cross-reference report: {xref_path}")


def main() -> None:
    print("="*72)
    print("  FULL SF-86 LIVE REVIEW — 3 DATA PROFILES")
    print("="*72)

    # Load registry
    print(f"\nLoading registry ...")
    with open(REGISTRY_PATH) as fh:
        registry = json.load(fh)

    # Filter to non-SSN sections
    all_fields = [e for e in registry if e.get("section", "") not in EXCLUDED_SECTIONS]
    all_fields.sort(key=lambda e: (e.get("pdfPage", 0), e.get("pdfFieldName", "")))

    sections = sorted(set(e["section"] for e in all_fields))
    print(f"  {len(all_fields)} fields across {len(sections)} sections")
    print(f"  Sections: {', '.join(sections)}")

    # Ensure output dirs
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Run 3 versions
    results = []
    for vkey, (desc, gen_func) in PROFILES.items():
        v_dir = OUTPUT_DIR / vkey
        v_dir.mkdir(parents=True, exist_ok=True)
        result = run_version(vkey, desc, gen_func, all_fields, v_dir)
        results.append(result)

    # Cross-reference
    cross_reference(results, OUTPUT_DIR)

    print(f"\n{'='*72}")
    print(f"  ALL DONE")
    print(f"{'='*72}")


if __name__ == "__main__":
    main()

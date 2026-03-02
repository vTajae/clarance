#!/usr/bin/env python3
"""
SF-86 Semantic Mapping Validation Test

Verifies that PDF fields are correctly mapped to UI fields — that
"Last Name" in the PDF ends up in the "Last Name" UI field, not in
some other field due to undeterministic naming conventions.

This is different from the round-trip test which only checks that
values survive fill/extract. This test checks that:

  1. Known PDF field names map to the expected semantic keys
  2. The registry's labels match expected human-readable names
  3. Value transformations (radio valueMap, date formats, etc.) are correct
  4. The full pipeline (PDF → extract → map → semantic key) works correctly
  5. No field "swaps" exist — each PDF field goes to exactly one correct UI slot

Usage:
    python scripts/mapping-validation-test.py
    python scripts/mapping-validation-test.py --service-url http://localhost:8001
"""

from __future__ import annotations

import json
import sys
import time
import urllib.request
import urllib.error
from pathlib import Path
from typing import Any

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
REGISTRY_PATH = PROJECT_ROOT / "app" / "src" / "lib" / "field-registry" / "field-registry.json"

# ---------------------------------------------------------------------------
# Well-known SF-86 field expectations
#
# These are fields whose semantic meaning is unambiguous. If any of
# these map to the wrong semantic key or label, the mapping is broken.
# ---------------------------------------------------------------------------

KNOWN_FIELDS: list[dict[str, Any]] = [
    # --- Text fields ---
    {
        "pdfFieldName": "form1[0].Sections1-6[0].TextField11[0]",
        "expectedSemanticKey": "personalInfo.section1",
        "expectedLabel": "Last name",
        "expectedSection": "personalInfo",
        "expectedType": "PDFTextField",
        "testValue": "Smith",
        "expectedExtracted": "Smith",  # text passthrough
    },
    {
        "pdfFieldName": "form1[0].Sections1-6[0].TextField11[1]",
        "expectedSemanticKey": "personalInfo.firstName",
        "expectedLabel": "First name",
        "expectedSection": "personalInfo",
        "expectedType": "PDFTextField",
        "testValue": "John",
        "expectedExtracted": "John",
    },
    # --- Date field (actual DOB field uses a date-specific PDF name) ---
    {
        "pdfFieldName": "form1[0].Sections1-6[0].From_Datefield_Name_2[0]",
        "expectedSemanticKey": "birthInfo.section2",
        "expectedLabel": "Section 2. Date of Birth. Provide your date of birth (month/day/year).",
        "expectedSection": "birthInfo",
        "expectedType": "PDFTextField",
        "testValue": "01/15/1990",
        "expectedExtracted": "01/15/1990",  # raw text round-trips
    },
    # --- Checkbox ---
    {
        "pdfFieldName": "form1[0].Sections1-6[0].#field[18]",
        "expectedSemanticKey": "birthInfo.isEstimate",
        "expectedLabel": "Estimate",
        "expectedSection": "birthInfo",
        "expectedType": "PDFCheckBox",
        "testValue": "Yes",
        "expectedExtracted": "Yes",
    },
    # --- Radio button (Sex: Male/Female) ---
    {
        "pdfFieldName": "form1[0].Sections1-6[0].p3-rb3b[0]",
        "expectedSemanticKey": "physicalAttributes.p3rb3b",
        "expectedLabel": "Sex",
        "expectedSection": "physicalAttributes",
        "expectedType": "PDFRadioGroup",
        "expectedValueMap": {"1": "Male", "Male": "1", "2": "Female", "Female": "2"},
        "testValue": "1",  # 1-based index → should select "Male" widget
        "expectedExtracted": "1",
    },
    # --- Radio button (Maiden name?: NO/YES) ---
    {
        "pdfFieldName": "form1[0].Sections1-6[0].section5[0].RadioButtonList[0]",
        "expectedSemanticKey": "namesInfo.RadioButtonList_7",
        "expectedLabel": "Maiden name?",
        "expectedSection": "namesInfo",
        "expectedType": "PDFRadioGroup",
        "expectedValueMap": {"1": "NO", "NO": "1", "2": "YES", "YES": "2"},
        "testValue": "2",  # 1-based index → should select "YES" widget
        "expectedExtracted": "2",
    },
    # --- Dropdown (Suffix) ---
    {
        "pdfFieldName": "form1[0].Sections1-6[0].section5[0].suffix[0]",
        "expectedSemanticKey": "namesInfo.suffix",
        "expectedLabel": "Suffix",
        "expectedSection": "namesInfo",
        "expectedType": "PDFDropdown",
        "testValue": "III",
        "expectedExtracted": "III",
    },
]

# ---------------------------------------------------------------------------
# ANSI colors for terminal output
# ---------------------------------------------------------------------------

GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
BOLD = "\033[1m"
RESET = "\033[0m"
CHECK = f"{GREEN}\u2714{RESET}"
CROSS = f"{RED}\u2718{RESET}"
WARN = f"{YELLOW}\u26A0{RESET}"


def ok(msg: str) -> str:
    return f"  {CHECK} {msg}"


def fail(msg: str) -> str:
    return f"  {CROSS} {msg}"


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------


def test_registry_integrity(registry: list[dict[str, Any]]) -> tuple[int, int]:
    """Verify registry structural properties."""
    print(f"\n{BOLD}=== Test 1: Registry Integrity ==={RESET}\n")

    passes = 0
    failures = 0

    # 1a. Unique pdfFieldNames
    pdf_names = [e["pdfFieldName"] for e in registry]
    unique_pdf = len(set(pdf_names))
    if unique_pdf == len(pdf_names):
        print(ok(f"All {len(pdf_names)} pdfFieldNames are unique"))
        passes += 1
    else:
        print(fail(f"Duplicate pdfFieldNames: {len(pdf_names) - unique_pdf} duplicates"))
        failures += 1

    # 1b. Unique semanticKeys
    sem_keys = [e["semanticKey"] for e in registry]
    unique_sem = len(set(sem_keys))
    if unique_sem == len(sem_keys):
        print(ok(f"All {len(sem_keys)} semanticKeys are unique"))
        passes += 1
    else:
        print(fail(f"Duplicate semanticKeys: {len(sem_keys) - unique_sem} duplicates"))
        failures += 1

    # 1c. Every entry has required fields
    required = {"pdfFieldName", "semanticKey", "section", "label", "pdfFieldType"}
    missing_count = 0
    for e in registry:
        for r in required:
            if not e.get(r):
                missing_count += 1
    if missing_count == 0:
        print(ok(f"All entries have required fields ({', '.join(sorted(required))})"))
        passes += 1
    else:
        print(fail(f"{missing_count} missing required fields across registry"))
        failures += 1

    # 1d. No empty labels
    empty_labels = sum(1 for e in registry if not e.get("label") or e["label"].strip() == "")
    if empty_labels == 0:
        print(ok(f"Zero empty labels (all {len(registry)} fields have meaningful labels)"))
        passes += 1
    else:
        print(fail(f"{empty_labels} fields have empty labels"))
        failures += 1

    # 1e. Radio fields all have valueMap
    radio_fields = [e for e in registry if e["pdfFieldType"] == "PDFRadioGroup"]
    radios_with_map = sum(1 for e in radio_fields if e.get("valueMap"))
    if radios_with_map == len(radio_fields):
        print(ok(f"All {len(radio_fields)} radio fields have valueMap"))
        passes += 1
    else:
        print(fail(f"{len(radio_fields) - radios_with_map}/{len(radio_fields)} radio fields missing valueMap"))
        failures += 1

    # 1f. Dropdown fields all have options
    dropdown_fields = [e for e in registry if e["pdfFieldType"] == "PDFDropdown"]
    drops_with_opts = sum(1 for e in dropdown_fields if e.get("options") and len(e["options"]) > 0)
    if drops_with_opts == len(dropdown_fields):
        print(ok(f"All {len(dropdown_fields)} dropdown fields have options"))
        passes += 1
    else:
        print(fail(f"{len(dropdown_fields) - drops_with_opts}/{len(dropdown_fields)} dropdowns missing options"))
        failures += 1

    return passes, failures


def test_known_field_mappings(registry: list[dict[str, Any]]) -> tuple[int, int]:
    """Verify well-known fields map to the expected semantic keys and labels."""
    print(f"\n{BOLD}=== Test 2: Known Field Semantic Mappings ==={RESET}\n")

    by_pdf = {e["pdfFieldName"]: e for e in registry}
    passes = 0
    failures = 0

    for kf in KNOWN_FIELDS:
        pdf_name = kf["pdfFieldName"]
        entry = by_pdf.get(pdf_name)

        if not entry:
            print(fail(f"'{pdf_name}' not found in registry"))
            failures += 1
            continue

        short_name = pdf_name.split(".")[-1]

        # Check semantic key
        if entry["semanticKey"] == kf["expectedSemanticKey"]:
            print(ok(f"{short_name} → semanticKey: {entry['semanticKey']}"))
            passes += 1
        else:
            print(fail(f"{short_name} → semanticKey: expected '{kf['expectedSemanticKey']}', got '{entry['semanticKey']}'"))
            failures += 1

        # Check label
        if entry.get("label") == kf["expectedLabel"]:
            print(ok(f"  label: \"{entry['label']}\""))
            passes += 1
        else:
            print(fail(f"  label: expected \"{kf['expectedLabel']}\", got \"{entry.get('label')}\""))
            failures += 1

        # Check section
        if entry.get("section") == kf["expectedSection"]:
            print(ok(f"  section: {entry['section']}"))
            passes += 1
        else:
            print(fail(f"  section: expected '{kf['expectedSection']}', got '{entry.get('section')}'"))
            failures += 1

        # Check type
        if entry.get("pdfFieldType") == kf["expectedType"]:
            print(ok(f"  type: {entry['pdfFieldType']}"))
            passes += 1
        else:
            print(fail(f"  type: expected '{kf['expectedType']}', got '{entry.get('pdfFieldType')}'"))
            failures += 1

        # Check valueMap if expected
        if "expectedValueMap" in kf:
            actual_map = entry.get("valueMap", {})
            expected_map = kf["expectedValueMap"]
            if actual_map == expected_map:
                print(ok(f"  valueMap: {json.dumps(expected_map)}"))
                passes += 1
            else:
                print(fail(f"  valueMap mismatch:\n    expected: {json.dumps(expected_map)}\n    got:      {json.dumps(actual_map)}"))
                failures += 1

    return passes, failures


def test_no_duplicate_semantic_targets(registry: list[dict[str, Any]]) -> tuple[int, int]:
    """Verify no two PDF fields map to the same semantic key (no collisions)."""
    print(f"\n{BOLD}=== Test 3: No Semantic Key Collisions ==={RESET}\n")

    sem_to_pdfs: dict[str, list[str]] = {}
    for e in registry:
        sk = e["semanticKey"]
        sem_to_pdfs.setdefault(sk, []).append(e["pdfFieldName"])

    collisions = {sk: pdfs for sk, pdfs in sem_to_pdfs.items() if len(pdfs) > 1}

    passes = 0
    failures = 0

    if not collisions:
        print(ok(f"Zero collisions — each of {len(sem_to_pdfs)} semantic keys has exactly 1 PDF field"))
        passes += 1
    else:
        print(fail(f"{len(collisions)} semantic keys have multiple PDF fields:"))
        for sk, pdfs in list(collisions.items())[:10]:
            print(f"    {sk}: {pdfs}")
        failures += 1

    # Also check reverse: no PDF field maps to multiple semantic keys
    pdf_to_sems: dict[str, list[str]] = {}
    for e in registry:
        pn = e["pdfFieldName"]
        pdf_to_sems.setdefault(pn, []).append(e["semanticKey"])

    rev_collisions = {pn: sks for pn, sks in pdf_to_sems.items() if len(sks) > 1}

    if not rev_collisions:
        print(ok(f"Zero reverse collisions — each PDF field maps to exactly 1 semantic key"))
        passes += 1
    else:
        print(fail(f"{len(rev_collisions)} PDF fields map to multiple semantic keys"))
        failures += 1

    return passes, failures


def test_pipeline_round_trip(
    registry: list[dict[str, Any]],
    service_url: str,
) -> tuple[int, int]:
    """Fill known fields, extract, and verify values map to correct semantic keys."""
    print(f"\n{BOLD}=== Test 4: Pipeline Round-Trip (Fill → Extract → Map) ==={RESET}\n")

    by_pdf = {e["pdfFieldName"]: e for e in registry}

    # Build fill values from known fields
    fill_values = {}
    for kf in KNOWN_FIELDS:
        fill_values[kf["pdfFieldName"]] = kf["testValue"]

    # Fill PDF
    print(f"  Filling PDF with {len(fill_values)} known field values...")
    url = f"{service_url.rstrip('/')}/fill-pdf"
    payload = json.dumps({
        "template_path": "sf861.pdf",
        "field_values": fill_values,
    }).encode("utf-8")

    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            pdf_bytes = resp.read()
        print(f"  Received {len(pdf_bytes):,} bytes")
    except urllib.error.HTTPError as exc:
        print(fail(f"fill-pdf failed: {exc.code}"))
        return 0, 1

    # Extract fields
    print(f"  Extracting fields from filled PDF...")
    boundary = f"----Bound{int(time.time() * 1000)}"
    parts = [
        f"--{boundary}\r\n".encode(),
        b'Content-Disposition: form-data; name="file"; filename="test.pdf"\r\n',
        b"Content-Type: application/pdf\r\n\r\n",
        pdf_bytes,
        f"\r\n--{boundary}--\r\n".encode(),
    ]
    body = b"".join(parts)

    req2 = urllib.request.Request(
        f"{service_url.rstrip('/')}/extract-fields",
        data=body,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req2, timeout=120) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        extracted = data.get("fields", {})
        print(f"  Extracted {len(extracted)} fields")
    except urllib.error.HTTPError as exc:
        print(fail(f"extract-fields failed: {exc.code}"))
        return 0, 1

    # Now simulate the import mapping: pdfFieldName → semanticKey
    print(f"\n  Verifying semantic mapping for known fields:\n")
    passes = 0
    failures = 0

    for kf in KNOWN_FIELDS:
        pdf_name = kf["pdfFieldName"]
        short = pdf_name.split(".")[-1]
        expected_sk = kf["expectedSemanticKey"]
        expected_val = kf["expectedExtracted"]

        # Check extraction
        extracted_val = extracted.get(pdf_name)
        if extracted_val is None:
            print(fail(f"{short}: not in extraction result"))
            failures += 1
            continue

        # Check value
        if str(extracted_val) == expected_val:
            print(ok(f"{short}: extracted '{extracted_val}' (correct)"))
            passes += 1
        else:
            print(fail(f"{short}: expected '{expected_val}', got '{extracted_val}'"))
            failures += 1

        # Check that registry maps this PDF field to the expected semantic key
        entry = by_pdf.get(pdf_name)
        if entry and entry["semanticKey"] == expected_sk:
            print(ok(f"  → maps to '{expected_sk}' in section '{entry['section']}' ({entry['label']})"))
            passes += 1
        else:
            actual_sk = entry["semanticKey"] if entry else "<not found>"
            print(fail(f"  → expected '{expected_sk}', maps to '{actual_sk}'"))
            failures += 1

    return passes, failures


def test_value_map_bidirectionality(registry: list[dict[str, Any]]) -> tuple[int, int]:
    """Verify every radio/dropdown valueMap is perfectly bidirectional."""
    print(f"\n{BOLD}=== Test 5: ValueMap Bidirectionality ==={RESET}\n")

    passes = 0
    failures = 0
    fields_checked = 0

    for entry in registry:
        vm = entry.get("valueMap")
        if not vm:
            continue

        fields_checked += 1
        # For each key→value, there should be a value→key
        broken = []
        for k, v in vm.items():
            if v not in vm:
                broken.append(f"'{k}' → '{v}' but '{v}' has no reverse mapping")
            elif vm[v] != k:
                broken.append(f"'{k}' → '{v}' but '{v}' → '{vm[v]}' (expected '{k}')")

        if not broken:
            pass  # silent pass for individual fields
        else:
            short = entry["pdfFieldName"].split(".")[-1]
            for b in broken:
                print(fail(f"  {short}: {b}"))
            failures += 1

    if failures == 0:
        print(ok(f"All {fields_checked} fields with valueMap are perfectly bidirectional"))
        passes += 1
    else:
        print(fail(f"{failures} fields have broken bidirectional valueMaps"))

    return passes, failures


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main() -> None:
    import argparse

    parser = argparse.ArgumentParser(description="SF-86 semantic mapping validation")
    parser.add_argument("--service-url", default="http://localhost:8001")
    args = parser.parse_args()

    # Load registry
    if not REGISTRY_PATH.is_file():
        print(f"ERROR: Registry not found at {REGISTRY_PATH}", file=sys.stderr)
        sys.exit(1)

    print(f"Loading field registry from {REGISTRY_PATH}...")
    registry: list[dict[str, Any]] = json.loads(REGISTRY_PATH.read_text("utf-8"))
    print(f"  {len(registry)} field definitions loaded.\n")

    total_passes = 0
    total_failures = 0

    # Test 1: Registry structural integrity
    p, f = test_registry_integrity(registry)
    total_passes += p
    total_failures += f

    # Test 2: Known field semantic mappings
    p, f = test_known_field_mappings(registry)
    total_passes += p
    total_failures += f

    # Test 3: No semantic key collisions
    p, f = test_no_duplicate_semantic_targets(registry)
    total_passes += p
    total_failures += f

    # Test 4: Pipeline round-trip with semantic mapping
    try:
        with urllib.request.urlopen(f"{args.service_url}/health", timeout=5) as r:
            pass
        p, f = test_pipeline_round_trip(registry, args.service_url)
        total_passes += p
        total_failures += f
    except (urllib.error.URLError, TimeoutError):
        print(f"\n{WARN}  Skipping pipeline test — PDF service not reachable at {args.service_url}")

    # Test 5: ValueMap bidirectionality
    p, f = test_value_map_bidirectionality(registry)
    total_passes += p
    total_failures += f

    # Summary
    sep = "=" * 55
    print(f"\n{sep}")
    print(f"{BOLD}Semantic Mapping Validation Summary{RESET}")
    print(sep)
    print(f"  {CHECK} Passed: {total_passes}")
    if total_failures > 0:
        print(f"  {CROSS} Failed: {total_failures}")
    else:
        print(f"  {CHECK} Failed: 0")
    print(sep)

    if total_failures > 0:
        print(f"\n{RED}FAIL{RESET} — {total_failures} assertion(s) failed\n")
        sys.exit(1)
    else:
        print(f"\n{GREEN}PASS{RESET} — All semantic mappings verified correctly\n")


if __name__ == "__main__":
    main()

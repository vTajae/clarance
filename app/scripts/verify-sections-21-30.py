#!/usr/bin/env python3
"""
Verify SF-86 PDF field registry mapping for sections 21-30 + ssnPageHeader.

For each section:
1. Count registry fields
2. Find PDF pages
3. Verify each registry pdfFieldName exists as a widget on the correct page
4. Report mismatches

Also produces a grand total across ALL sections (1-30 + ssnPageHeader) = should be 6,197.
"""

import json
import sys
from collections import defaultdict

import fitz  # PyMuPDF

REGISTRY_PATH = "/app/registry/field-registry.json"
PDF_PATH = "/app/templates/sf861.pdf"

TARGET_SECTIONS = [
    "section21", "section21A", "section21B", "section21C", "section21D", "section21E",
    "section22", "section23", "section24", "section25", "section26", "section27",
    "section28", "section29", "section30", "ssnPageHeader",
]

ALL_SECTIONS = [
    "section1", "section3", "section4", "section5", "section6", "section7",
    "section8", "section9", "section10", "section11", "section12",
    "section13A", "section13B", "section13C",
    "section14", "section15", "section16", "section17", "section18",
    "section19", "section20A", "section20B", "section20C",
    "section21", "section21A", "section21B", "section21C", "section21D", "section21E",
    "section22", "section23", "section24", "section25", "section26", "section27",
    "section28", "section29", "section30", "ssnPageHeader",
]


def main():
    # Load registry
    with open(REGISTRY_PATH) as f:
        registry = json.load(f)
    print(f"Registry loaded: {len(registry)} total fields")

    # Open PDF and build widget index: { (field_name, page_number): widget_type }
    doc = fitz.open(PDF_PATH)
    print(f"PDF loaded: {len(doc)} pages\n")

    # Build index of all PDF widgets: field_name -> set of pages
    pdf_widgets = defaultdict(set)       # field_name -> {page_nums}
    pdf_widget_types = {}                 # field_name -> widget type int
    all_widget_names = set()

    for page_num in range(len(doc)):
        page = doc[page_num]
        for widget in page.widgets():
            fname = widget.field_name
            if fname:
                pdf_widgets[fname].add(page_num + 1)  # 1-based pages
                pdf_widget_types[fname] = widget.field_type
                all_widget_names.add(fname)

    total_widgets = sum(len(pages) for pages in pdf_widgets.values())
    print(f"PDF widgets indexed: {len(pdf_widgets)} unique field names, {total_widgets} widget instances\n")

    # Group registry entries by section
    by_section = defaultdict(list)
    for entry in registry:
        by_section[entry["section"]].append(entry)

    # ---- Verify target sections ----
    print("=" * 70)
    print("VERIFICATION: Sections 21-30 + ssnPageHeader")
    print("=" * 70)

    target_total = 0
    target_verified = 0
    target_missing = 0
    target_wrong_page = 0
    all_issues = []

    for sec in TARGET_SECTIONS:
        entries = by_section.get(sec, [])
        count = len(entries)
        target_total += count

        if not entries:
            print(f"\nSECTION: {sec}")
            print(f"  Registry: 0 fields | Pages: []")
            print(f"  All verified: N/A (no fields)")
            continue

        pages = sorted(set(e["pdfPage"] for e in entries))
        verified = 0
        missing = []
        wrong_page = []

        for e in entries:
            fname = e["pdfFieldName"]
            expected_page = e["pdfPage"]

            if fname not in pdf_widgets:
                missing.append((fname, expected_page))
            elif expected_page not in pdf_widgets[fname]:
                actual_pages = sorted(pdf_widgets[fname])
                wrong_page.append((fname, expected_page, actual_pages))
            else:
                verified += 1

        target_verified += verified
        target_missing += len(missing)
        target_wrong_page += len(wrong_page)

        all_ok = verified == count
        status = "YES" if all_ok else "NO"

        print(f"\nSECTION: {sec}")
        print(f"  Registry: {count} fields | Pages: {pages}")
        print(f"  Verified: {verified}/{count} | Missing: {len(missing)} | Wrong page: {len(wrong_page)}")
        print(f"  All verified: {status}")

        if missing:
            all_issues.append((sec, "MISSING", missing))
            for fname, pg in missing[:5]:
                print(f"    MISSING: {fname} (expected page {pg})")
            if len(missing) > 5:
                print(f"    ... and {len(missing) - 5} more missing")

        if wrong_page:
            all_issues.append((sec, "WRONG_PAGE", wrong_page))
            for fname, expected, actual in wrong_page[:5]:
                print(f"    WRONG PAGE: {fname} expected={expected} actual={actual}")
            if len(wrong_page) > 5:
                print(f"    ... and {len(wrong_page) - 5} more wrong page")

    print("\n" + "=" * 70)
    print("TARGET SECTIONS SUMMARY")
    print("=" * 70)
    print(f"  Total fields: {target_total}")
    print(f"  Verified:     {target_verified}")
    print(f"  Missing:      {target_missing}")
    print(f"  Wrong page:   {target_wrong_page}")
    print(f"  Pass rate:    {target_verified}/{target_total} ({100*target_verified/target_total:.1f}%)")

    # ---- Grand total across ALL sections ----
    print("\n" + "=" * 70)
    print("GRAND TOTAL: ALL SECTIONS (1-30 + ssnPageHeader)")
    print("=" * 70)

    grand_total = 0
    grand_verified = 0
    grand_missing = 0
    grand_wrong_page = 0
    section_summaries = []

    for sec in ALL_SECTIONS:
        entries = by_section.get(sec, [])
        count = len(entries)
        grand_total += count

        v = 0
        m = 0
        wp = 0
        for e in entries:
            fname = e["pdfFieldName"]
            expected_page = e["pdfPage"]
            if fname not in pdf_widgets:
                m += 1
            elif expected_page not in pdf_widgets[fname]:
                wp += 1
            else:
                v += 1

        grand_verified += v
        grand_missing += m
        grand_wrong_page += wp
        status = "OK" if v == count else f"FAIL({m}m/{wp}wp)"
        section_summaries.append((sec, count, v, m, wp, status))

    # Print compact table
    print(f"\n{'Section':<16} {'Fields':>6} {'Verified':>8} {'Missing':>7} {'WrongPg':>7} {'Status':>10}")
    print("-" * 60)
    for sec, count, v, m, wp, status in section_summaries:
        print(f"{sec:<16} {count:>6} {v:>8} {m:>7} {wp:>7} {status:>10}")
    print("-" * 60)
    print(f"{'TOTAL':<16} {grand_total:>6} {grand_verified:>8} {grand_missing:>7} {grand_wrong_page:>7}")

    # Check for uncategorized sections
    all_reg_sections = set(e["section"] for e in registry)
    known = set(ALL_SECTIONS)
    unknown = all_reg_sections - known
    if unknown:
        extra_count = sum(1 for e in registry if e["section"] in unknown)
        print(f"\n  WARNING: {len(unknown)} unknown sections with {extra_count} fields: {unknown}")

    print(f"\n  Expected total: 6,197")
    print(f"  Registry total: {len(registry)}")
    print(f"  Sections total: {grand_total}")
    print(f"  Match: {'YES' if grand_total == 6197 else 'NO'}")
    print(f"  Grand pass rate: {grand_verified}/{grand_total} ({100*grand_verified/grand_total:.1f}%)")

    doc.close()

    # Exit code
    if grand_verified == grand_total and grand_total == 6197:
        print("\n*** ALL 6,197 FIELDS VERIFIED SUCCESSFULLY ***")
        sys.exit(0)
    else:
        print(f"\n*** VERIFICATION INCOMPLETE: {grand_total - grand_verified} issues ***")
        sys.exit(1)


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Verify SF-86 PDF field registry mapping for History group sections (10-13).
Runs inside the sf86-pdf-service Docker container.

For each section:
1. Count registry fields
2. Find PDF pages
3. Extract widgets from those pages using PyMuPDF
4. Count unique widget field_names that belong to this section's registry entries
5. Verify every registry field_name exists as an actual PDF widget
6. Report match/mismatch
"""

import json
import sys
from collections import defaultdict

import fitz

REGISTRY_PATH = "/app/registry/field-registry.json"
PDF_PATH = "/app/templates/sf861.pdf"

SECTIONS = ["section10", "section11", "section12", "section13A", "section13B", "section13C"]

# PyMuPDF field_type constants
FIELD_TYPE_NAMES = {
    0: "none",
    1: "pushbutton",
    2: "checkbox",
    3: "combobox",
    4: "listbox",
    5: "radiobutton",
    6: "signature",
    7: "text",
}


def load_registry():
    with open(REGISTRY_PATH) as f:
        return json.load(f)


def extract_all_pdf_widgets(doc):
    """Extract all widgets from all pages, returning dict of field_name -> list of (page, type, on_state)."""
    widgets_by_name = defaultdict(list)
    for page_idx in range(doc.page_count):
        page = doc[page_idx]
        pdf_page = page_idx + 1  # 1-based
        for w in page.widgets():
            fname = w.field_name
            ftype = w.field_type
            on_state = None
            if ftype == 5:  # radio
                try:
                    on_state = w.on_state()
                except:
                    on_state = "?"
            widgets_by_name[fname].append({
                "page": pdf_page,
                "type": ftype,
                "type_name": FIELD_TYPE_NAMES.get(ftype, f"unknown({ftype})"),
                "on_state": on_state,
            })
    return widgets_by_name


def main():
    print("=" * 70)
    print("SF-86 FIELD REGISTRY VERIFICATION — History Group (Sections 10–13)")
    print("=" * 70)
    print()

    # Load registry
    registry = load_registry()
    print(f"Registry loaded: {len(registry)} total fields")

    # Load PDF
    doc = fitz.open(PDF_PATH)
    print(f"PDF loaded: {doc.page_count} pages")
    print()

    # Extract all PDF widgets
    print("Extracting all PDF widgets...")
    all_pdf_widgets = extract_all_pdf_widgets(doc)
    total_unique = len(all_pdf_widgets)
    total_instances = sum(len(v) for v in all_pdf_widgets.values())
    print(f"  Unique field_names: {total_unique}")
    print(f"  Total widget instances: {total_instances}")
    print()

    # Process each section
    all_ok = True
    summary = []

    for section_name in SECTIONS:
        # Get registry entries for this section
        section_fields = [f for f in registry if f.get("section") == section_name]
        if not section_fields:
            print(f"SECTION: {section_name}")
            print(f"  Registry: 0 fields — SKIPPED (not in registry)")
            print()
            continue

        title = section_fields[0].get("sf86SectionName", "?")
        pages = sorted(set(f["pdfPage"] for f in section_fields))
        registry_field_names = set(f["pdfFieldName"] for f in section_fields)

        # Count by type
        type_counts = defaultdict(int)
        for f in section_fields:
            type_counts[f.get("uiFieldType", "?")] += 1

        # Check which registry field_names exist in PDF
        found_in_pdf = set()
        missing_from_pdf = set()
        for fname in registry_field_names:
            if fname in all_pdf_widgets:
                found_in_pdf.add(fname)
            else:
                missing_from_pdf.add(fname)

        # Also check: how many PDF widgets on these pages are NOT in this section's registry
        # (they could belong to other sections or be SSN headers)
        pdf_widgets_on_pages = set()
        for fname, instances in all_pdf_widgets.items():
            for inst in instances:
                if inst["page"] in pages:
                    pdf_widgets_on_pages.add(fname)

        extra_in_pdf = pdf_widgets_on_pages - registry_field_names
        # Filter out SSN fields from extras (they're ssnPageHeader)
        ssn_extras = {f for f in extra_in_pdf if "SSN" in f.upper() or "ssn" in f.lower()}
        # Filter out fields that belong to OTHER sections
        other_section_fields = set()
        for f in registry:
            if f.get("section") != section_name and f["pdfFieldName"] in extra_in_pdf:
                other_section_fields.add(f["pdfFieldName"])

        truly_unmapped = extra_in_pdf - ssn_extras - other_section_fields

        match_ok = len(missing_from_pdf) == 0
        if not match_ok:
            all_ok = False

        # Report
        print(f"SECTION: {section_name} ({title})")
        print(f"  Registry: {len(section_fields)} fields")
        print(f"  Pages: {pages}")
        print(f"  Field types: {dict(type_counts)}")
        print(f"  Registry fields found in PDF: {len(found_in_pdf)}/{len(registry_field_names)}")
        print(f"  All registry fields exist in PDF: {'YES' if match_ok else 'NO'}")
        if missing_from_pdf:
            print(f"  Missing from PDF ({len(missing_from_pdf)}):")
            for m in sorted(missing_from_pdf):
                print(f"    - {m}")
        print(f"  PDF widgets on section pages: {len(pdf_widgets_on_pages)} unique field_names")
        if ssn_extras:
            print(f"  SSN header fields (excluded): {len(ssn_extras)}")
        if other_section_fields:
            print(f"  Fields belonging to other sections: {len(other_section_fields)}")
        if truly_unmapped:
            print(f"  PDF widgets NOT in any registry section ({len(truly_unmapped)}):")
            for u in sorted(truly_unmapped)[:20]:
                instances = all_pdf_widgets[u]
                types = set(inst["type_name"] for inst in instances)
                pgs = set(inst["page"] for inst in instances)
                print(f"    - {u}  (type={types}, pages={pgs})")
            if len(truly_unmapped) > 20:
                print(f"    ... and {len(truly_unmapped) - 20} more")
        print(f"  Match: {'OK' if match_ok else 'ISSUE'}")
        print()

        summary.append({
            "section": section_name,
            "title": title,
            "registry_count": len(section_fields),
            "pages": pages,
            "found": len(found_in_pdf),
            "missing": len(missing_from_pdf),
            "match": match_ok,
        })

    # Final summary
    print("=" * 70)
    print("SUMMARY")
    print("=" * 70)
    total_fields = 0
    total_found = 0
    total_missing = 0
    for s in summary:
        status = "OK" if s["match"] else "ISSUE"
        print(f"  {s['section']:12s}  {s['registry_count']:5d} fields  found={s['found']:5d}  missing={s['missing']:3d}  [{status}]")
        total_fields += s["registry_count"]
        total_found += s["found"]
        total_missing += s["missing"]

    print(f"  {'TOTAL':12s}  {total_fields:5d} fields  found={total_found:5d}  missing={total_missing:3d}")
    print()
    if all_ok:
        print("RESULT: ALL SECTIONS VERIFIED — 100% registry-to-PDF match")
    else:
        print(f"RESULT: {total_missing} FIELDS MISSING FROM PDF — needs investigation")

    doc.close()
    return 0 if all_ok else 1


if __name__ == "__main__":
    sys.exit(main())

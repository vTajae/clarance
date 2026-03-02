#!/usr/bin/env python3
"""Verify SF-86 PDF field registry mapping for sections 19, 20A, 20B, 20C (Foreign group).

For each section:
1. Count registry fields
2. Find PDF pages from registry pdfPage values
3. For each registry field, verify pdfFieldName exists as a widget on that page
4. Report results
"""

import json
import fitz  # PyMuPDF

REGISTRY_PATH = "/app/registry/field-registry.json"
PDF_PATH = "/app/templates/sf861.pdf"
TARGET_SECTIONS = ["section19", "section20A", "section20B", "section20C"]

SECTION_LABELS = {
    "section19": "Foreign Contacts",
    "section20A": "Foreign Activities",
    "section20B": "Foreign Business/Professional Activities",
    "section20C": "Foreign Travel",
}


def build_pdf_widget_index(doc):
    """Build a dict: pdfFieldName -> set of page numbers where widget exists."""
    index = {}
    for page_num in range(len(doc)):
        page = doc[page_num]
        for widget in page.widgets():
            name = widget.field_name
            if name not in index:
                index[name] = set()
            index[name].add(page_num)
    return index


def main():
    # Load registry
    with open(REGISTRY_PATH) as f:
        registry = json.load(f)

    # Load PDF
    doc = fitz.open(PDF_PATH)
    print(f"PDF loaded: {len(doc)} pages, building widget index...")

    widget_index = build_pdf_widget_index(doc)
    total_widgets = len(widget_index)
    print(f"Widget index built: {total_widgets} unique field names across all pages\n")
    print("=" * 80)

    overall_total = 0
    overall_verified = 0
    overall_missing = 0

    for section in TARGET_SECTIONS:
        label = SECTION_LABELS.get(section, "")
        fields = [r for r in registry if r.get("section") == section]
        pages = sorted(set(r.get("pdfPage", -1) for r in fields))
        field_count = len(fields)

        missing = []
        wrong_page = []
        verified = 0

        for field in fields:
            pdf_name = field["pdfFieldName"]
            expected_page = field.get("pdfPage")

            if pdf_name not in widget_index:
                missing.append({
                    "pdfFieldName": pdf_name,
                    "expectedPage": expected_page,
                    "label": field.get("label", ""),
                    "type": field.get("pdfFieldType", ""),
                })
            else:
                widget_pages = widget_index[pdf_name]
                # PyMuPDF pages are 0-indexed, registry pdfPage is 1-indexed
                # Check if registry uses 0-indexed or 1-indexed
                if expected_page in widget_pages:
                    verified += 1
                elif (expected_page - 1) in widget_pages:
                    # Registry is 1-indexed, PyMuPDF is 0-indexed
                    verified += 1
                else:
                    wrong_page.append({
                        "pdfFieldName": pdf_name,
                        "expectedPage": expected_page,
                        "actualPages": sorted(widget_pages),
                        "label": field.get("label", ""),
                    })

        all_ok = len(missing) == 0 and len(wrong_page) == 0
        overall_total += field_count
        overall_verified += verified
        overall_missing += len(missing) + len(wrong_page)

        print(f"\nSECTION: {section} — {label}")
        print(f"  Registry: {field_count} fields | Pages: {pages}")
        print(f"  Verified: {verified}/{field_count}")
        print(f"  All fields verified: {'YES' if all_ok else 'NO'}")

        if missing:
            print(f"  Missing from PDF: {len(missing)}")
            for m in missing:
                print(f"    - {m['pdfFieldName']} (page {m['expectedPage']}, {m['type']}, \"{m['label']}\")")

        if wrong_page:
            print(f"  Wrong page: {len(wrong_page)}")
            for w in wrong_page:
                print(f"    - {w['pdfFieldName']} expected page {w['expectedPage']}, found on {w['actualPages']} (\"{w['label']}\")")

    print("\n" + "=" * 80)
    print(f"\nOVERALL SUMMARY (Foreign group: sections 19, 20A, 20B, 20C)")
    print(f"  Total fields: {overall_total}")
    print(f"  Verified:     {overall_verified}")
    print(f"  Issues:       {overall_missing}")
    print(f"  Status:       {'ALL VERIFIED' if overall_missing == 0 else 'HAS ISSUES'}")

    doc.close()


if __name__ == "__main__":
    main()

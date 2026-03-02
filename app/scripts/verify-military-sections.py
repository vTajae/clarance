#!/usr/bin/env python3
"""
Verify SF-86 PDF field registry mapping for sections 14-16 (Military group).
Checks that every pdfFieldName in the registry exists as an actual widget in the PDF.
"""

import json
import fitz  # PyMuPDF

PDF_PATH = "/app/templates/sf861.pdf"
REGISTRY_PATH = "/app/registry/field-registry.json"

SECTIONS = ["section14", "section15", "section16"]

def main():
    # Load registry
    with open(REGISTRY_PATH) as f:
        registry = json.load(f)

    # Load PDF
    doc = fitz.open(PDF_PATH)

    # Build a set of all widget field_names per page from the PDF
    # For radio groups, the same field_name appears on multiple widgets
    pdf_widgets_by_page = {}  # page_num (1-based) -> set of field_names
    pdf_all_widgets = set()
    for page_idx in range(len(doc)):
        page_num = page_idx + 1
        page = doc[page_idx]
        names = set()
        for w in page.widgets():
            if w.field_name:
                names.add(w.field_name)
                pdf_all_widgets.add(w.field_name)
        pdf_widgets_by_page[page_num] = names

    # Process each section
    for sec in SECTIONS:
        fields = [f for f in registry if f.get("section") == sec]
        if not fields:
            print(f"\nSECTION: {sec}")
            print(f"  Registry: 0 fields")
            print(f"  SKIPPED: No fields found")
            continue

        pages = sorted(set(f.get("pdfPage", 0) for f in fields))

        # Check each field
        missing_on_page = []  # Field not found on its declared page
        missing_anywhere = []  # Field not found anywhere in PDF
        found_on_page = 0
        found_elsewhere = 0

        # Track unique pdfFieldNames (radio groups may have multiple registry entries)
        checked = set()

        for f in fields:
            pdf_name = f.get("pdfFieldName", "")
            pdf_page = f.get("pdfPage", 0)

            if not pdf_name:
                missing_anywhere.append({"field": f.get("semanticKey", "?"), "reason": "no pdfFieldName"})
                continue

            # Skip duplicates (radio group widgets share same pdfFieldName)
            check_key = (pdf_name, pdf_page)
            if check_key in checked:
                found_on_page += 1
                continue
            checked.add(check_key)

            page_widgets = pdf_widgets_by_page.get(pdf_page, set())
            if pdf_name in page_widgets:
                found_on_page += 1
            elif pdf_name in pdf_all_widgets:
                # Found in PDF but on different page
                actual_pages = [p for p, ws in pdf_widgets_by_page.items() if pdf_name in ws]
                found_elsewhere += 1
                missing_on_page.append({
                    "pdfFieldName": pdf_name,
                    "declared_page": pdf_page,
                    "actual_pages": actual_pages,
                    "semanticKey": f.get("semanticKey", "?"),
                    "label": f.get("label", "?")
                })
            else:
                missing_anywhere.append({
                    "pdfFieldName": pdf_name,
                    "declared_page": pdf_page,
                    "semanticKey": f.get("semanticKey", "?"),
                    "label": f.get("label", "?")
                })

        total = len(fields)
        all_ok = len(missing_on_page) == 0 and len(missing_anywhere) == 0

        print(f"\nSECTION: {sec}")
        print(f"  Registry: {total} fields | Pages: {pages}")
        print(f"  Found on declared page: {found_on_page}/{total}")
        if found_elsewhere > 0:
            print(f"  Found on DIFFERENT page: {found_elsewhere}")
        print(f"  All fields verified in PDF: {'YES' if all_ok else 'NO'}")

        if missing_on_page:
            print(f"  Wrong page ({len(missing_on_page)}):")
            for m in missing_on_page:
                print(f"    - {m['pdfFieldName']}")
                print(f"      declared page={m['declared_page']}, actual pages={m['actual_pages']}")
                print(f"      label: {m['label']}")

        if missing_anywhere:
            print(f"  Missing from PDF entirely ({len(missing_anywhere)}):")
            for m in missing_anywhere:
                print(f"    - {m['pdfFieldName']} (page {m['declared_page']})")
                print(f"      label: {m['label']}")

    # Summary
    print("\n" + "=" * 60)
    total_all = sum(len([f for f in registry if f.get("section") == s]) for s in SECTIONS)
    print(f"TOTAL: {total_all} fields across sections {', '.join(SECTIONS)}")
    print(f"PDF has {len(pdf_all_widgets)} unique widget field names total")

    doc.close()

if __name__ == "__main__":
    main()

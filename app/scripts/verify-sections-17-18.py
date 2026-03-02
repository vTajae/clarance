#!/usr/bin/env python3
"""Verify SF-86 PDF field registry mapping for sections 17-18 (Relationships group)."""

import json
import fitz

REGISTRY_PATH = "/app/registry/field-registry.json"
PDF_PATH = "/app/templates/sf861.pdf"
SECTIONS = ["section17", "section18"]

def main():
    # Load registry
    with open(REGISTRY_PATH, "r") as f:
        registry = json.load(f)

    # Open PDF
    doc = fitz.open(PDF_PATH)

    # Build widget index: page_num (1-based) -> set of field_names
    widget_index = {}
    for page_idx in range(len(doc)):
        page_num = page_idx + 1
        names = set()
        for w in doc[page_idx].widgets():
            if w.field_name:
                names.add(w.field_name)
        if names:
            widget_index[page_num] = names

    # Also build a global set of all widget field names across all pages
    all_widgets_global = set()
    for names in widget_index.values():
        all_widgets_global |= names

    for section in SECTIONS:
        # Filter registry for this section
        fields = [f for f in registry if f.get("section") == section]
        field_count = len(fields)

        # Get pages
        pages = sorted(set(f["pdfPage"] for f in fields))

        print(f"SECTION: {section}")
        print(f"  Registry: {field_count} fields | Pages: {pages}")

        # Verify each field
        missing = []
        wrong_page = []
        found = 0

        for f in fields:
            name = f["pdfFieldName"]
            page = f["pdfPage"]
            page_widgets = widget_index.get(page, set())

            if name in page_widgets:
                found += 1
            elif name in all_widgets_global:
                # Field exists but on a different page
                actual_pages = [p for p, ws in widget_index.items() if name in ws]
                wrong_page.append({
                    "field": name,
                    "registry_page": page,
                    "actual_pages": actual_pages,
                    "semanticKey": f.get("semanticKey", ""),
                })
            else:
                missing.append({
                    "field": name,
                    "registry_page": page,
                    "semanticKey": f.get("semanticKey", ""),
                    "type": f.get("uiFieldType", ""),
                })

        all_ok = len(missing) == 0 and len(wrong_page) == 0
        print(f"  All fields verified: {'YES' if all_ok else 'NO'}")
        print(f"  Found on correct page: {found}/{field_count}")

        if wrong_page:
            print(f"  Wrong page: {len(wrong_page)}")
            for wp in wrong_page[:20]:
                print(f"    - {wp['field']}")
                print(f"      Registry page: {wp['registry_page']}, Actual: {wp['actual_pages']}")
                print(f"      semanticKey: {wp['semanticKey']}")
            if len(wrong_page) > 20:
                print(f"    ... and {len(wrong_page) - 20} more")

        if missing:
            print(f"  Missing from PDF: {len(missing)}")
            for m in missing[:20]:
                print(f"    - {m['field']} (page {m['registry_page']}, {m['type']})")
                print(f"      semanticKey: {m['semanticKey']}")
            if len(missing) > 20:
                print(f"    ... and {len(missing) - 20} more")

        print()

    # Additional: show field type breakdown per section
    print("=" * 60)
    print("FIELD TYPE BREAKDOWN")
    print("=" * 60)
    for section in SECTIONS:
        fields = [f for f in registry if f.get("section") == section]
        types = {}
        for f in fields:
            t = f.get("uiFieldType", "unknown")
            types[t] = types.get(t, 0) + 1
        print(f"\n{section}:")
        for t, c in sorted(types.items(), key=lambda x: -x[1]):
            print(f"  {t}: {c}")

    doc.close()
    print("\nDone.")

if __name__ == "__main__":
    main()

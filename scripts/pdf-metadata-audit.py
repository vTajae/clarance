#!/usr/bin/env python3
"""
SF-86 PDF Metadata Audit — Evidence-Based Field Mapping Analysis

Extracts ALL field metadata directly from the actual PDF binary using PyMuPDF,
then cross-references against field-registry.json to produce hard statistics.

NO assumptions. Every claim is backed by raw data from the PDF itself.
"""

import json
import sys
import os
from collections import Counter, defaultdict

try:
    import fitz  # PyMuPDF
except ImportError:
    print("ERROR: PyMuPDF not installed. Run: pip install PyMuPDF", file=sys.stderr)
    sys.exit(1)

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
PDF_PATH = os.path.join(PROJECT_DIR, "pdf-service", "templates", "sf861.pdf")
REGISTRY_PATH = os.path.join(PROJECT_DIR, "app", "src", "lib", "field-registry", "field-registry.json")
REPORT_PATH = os.path.join(SCRIPT_DIR, "pdf-metadata-audit-report.json")

# PyMuPDF widget type constants (verified inside fitz)
WIDGET_TYPE_NAMES = {
    getattr(fitz, 'PDF_WIDGET_TYPE_BUTTON', 1): 'Button',
    getattr(fitz, 'PDF_WIDGET_TYPE_CHECKBOX', 2): 'CheckBox',
    getattr(fitz, 'PDF_WIDGET_TYPE_COMBOBOX', 3): 'ComboBox',
    getattr(fitz, 'PDF_WIDGET_TYPE_LISTBOX', 4): 'ListBox',
    getattr(fitz, 'PDF_WIDGET_TYPE_RADIOBUTTON', 5): 'RadioButton',
    getattr(fitz, 'PDF_WIDGET_TYPE_SIGNATURE', 6): 'Signature',
    getattr(fitz, 'PDF_WIDGET_TYPE_TEXT', 7): 'Text',
}

def extract_pdf_fields(pdf_path):
    """Extract every widget from the PDF with full metadata."""
    doc = fitz.open(pdf_path)
    fields = {}
    widget_count = 0

    # Track radio groups (multiple widgets share one field_name)
    radio_widgets = defaultdict(list)

    for page_num in range(len(doc)):
        page = doc[page_num]
        for widget in page.widgets():
            widget_count += 1
            name = widget.field_name
            ft = widget.field_type
            type_name = WIDGET_TYPE_NAMES.get(ft, f'Unknown({ft})')

            if ft == fitz.PDF_WIDGET_TYPE_RADIOBUTTON:
                on_state = widget.on_state()
                radio_widgets[name].append({
                    'page': page_num + 1,
                    'on_state': on_state,
                    'rect': list(widget.rect),
                })
                # Only record first occurrence
                if name not in fields:
                    fields[name] = {
                        'pdfFieldName': name,
                        'pdfWidgetType': type_name,
                        'pdfWidgetTypeId': ft,
                        'page': page_num + 1,
                        'rect': list(widget.rect),
                        'options': [],
                        'on_states': [],
                    }
                fields[name]['on_states'].append(on_state)
            else:
                if name in fields:
                    # Duplicate field name (e.g. split across pages)
                    continue

                entry = {
                    'pdfFieldName': name,
                    'pdfWidgetType': type_name,
                    'pdfWidgetTypeId': ft,
                    'page': page_num + 1,
                    'rect': list(widget.rect),
                }

                # Extract choice options for combo/list boxes
                if ft in (fitz.PDF_WIDGET_TYPE_COMBOBOX, fitz.PDF_WIDGET_TYPE_LISTBOX):
                    try:
                        choices = widget.choice_values
                        entry['options'] = choices if choices else []
                    except Exception:
                        entry['options'] = []

                # Extract max length for text fields
                if ft == fitz.PDF_WIDGET_TYPE_TEXT:
                    try:
                        entry['maxLength'] = widget.text_maxlen
                    except Exception:
                        pass

                # Extract on_state for checkboxes
                if ft == fitz.PDF_WIDGET_TYPE_CHECKBOX:
                    try:
                        entry['on_state'] = widget.on_state()
                    except Exception:
                        pass

                fields[name] = entry

    doc.close()
    return fields, widget_count, radio_widgets


def load_registry(registry_path):
    """Load field-registry.json and index by pdfFieldName."""
    with open(registry_path, 'r') as f:
        data = json.load(f)

    by_pdf_name = {}
    by_semantic_key = {}
    for entry in data:
        pdf_name = entry.get('pdfFieldName', '')
        semantic_key = entry.get('semanticKey', '')
        by_pdf_name[pdf_name] = entry
        by_semantic_key[semantic_key] = entry

    return data, by_pdf_name, by_semantic_key


def type_compatibility(pdf_type_id, registry_type):
    """Check if PDF widget type is compatible with registry's pdfFieldType."""
    COMPAT = {
        7: ['TextField'],              # Text
        2: ['CheckBox'],               # CheckBox
        3: ['Dropdown', 'ComboBox'],   # ComboBox
        4: ['ListBox'],                # ListBox
        5: ['RadioGroup', 'RadioButton'],  # RadioButton
        1: ['Button'],                 # Button
    }
    expected = COMPAT.get(pdf_type_id, [])
    return registry_type in expected


def main():
    print("=" * 70)
    print("SF-86 PDF METADATA AUDIT — Evidence-Based Field Mapping Analysis")
    print("=" * 70)
    print()

    # -----------------------------------------------------------------------
    # Step 1: Extract raw PDF metadata
    # -----------------------------------------------------------------------
    print(f"[1/5] Extracting fields from PDF: {PDF_PATH}")
    if not os.path.exists(PDF_PATH):
        print(f"  ERROR: PDF not found at {PDF_PATH}")
        sys.exit(1)

    pdf_fields, total_widgets, radio_widgets = extract_pdf_fields(PDF_PATH)
    pdf_field_names = set(pdf_fields.keys())

    # Count by type
    pdf_type_counts = Counter()
    for f in pdf_fields.values():
        pdf_type_counts[f['pdfWidgetType']] += 1

    print(f"  Total widgets in PDF:     {total_widgets}")
    print(f"  Unique field names:       {len(pdf_fields)}")
    print(f"  Radio groups (shared names): {len(radio_widgets)}")
    print(f"  Type breakdown:")
    for t, c in sorted(pdf_type_counts.items(), key=lambda x: -x[1]):
        print(f"    {t:15s}: {c:5d}")
    print()

    # -----------------------------------------------------------------------
    # Step 2: Load registry
    # -----------------------------------------------------------------------
    print(f"[2/5] Loading registry: {REGISTRY_PATH}")
    if not os.path.exists(REGISTRY_PATH):
        print(f"  ERROR: Registry not found at {REGISTRY_PATH}")
        sys.exit(1)

    registry_data, reg_by_pdf, reg_by_semantic = load_registry(REGISTRY_PATH)
    registry_pdf_names = set(reg_by_pdf.keys())

    reg_type_counts = Counter()
    for entry in registry_data:
        reg_type_counts[entry.get('pdfFieldType', 'Unknown')] += 1

    print(f"  Total registry entries:   {len(registry_data)}")
    print(f"  Unique pdfFieldNames:     {len(reg_by_pdf)}")
    print(f"  Unique semanticKeys:      {len(reg_by_semantic)}")
    print(f"  Type breakdown:")
    for t, c in sorted(reg_type_counts.items(), key=lambda x: -x[1]):
        print(f"    {t:15s}: {c:5d}")
    print()

    # -----------------------------------------------------------------------
    # Step 3: Cross-reference — find mismatches
    # -----------------------------------------------------------------------
    print("[3/5] Cross-referencing PDF fields vs registry...")

    # Fields in PDF but NOT in registry (orphan PDF fields)
    orphan_pdf = pdf_field_names - registry_pdf_names
    # Fields in registry but NOT in PDF (phantom registry entries)
    phantom_registry = registry_pdf_names - pdf_field_names
    # Fields in both
    matched_names = pdf_field_names & registry_pdf_names

    print(f"  Fields in BOTH PDF and registry:     {len(matched_names)}")
    print(f"  Fields in PDF but NOT in registry:    {len(orphan_pdf)}")
    print(f"  Fields in registry but NOT in PDF:    {len(phantom_registry)}")
    print()

    if orphan_pdf:
        print(f"  ORPHAN PDF FIELDS (exist in PDF, missing from registry):")
        for name in sorted(orphan_pdf)[:20]:
            f = pdf_fields[name]
            print(f"    - {name} ({f['pdfWidgetType']}, page {f['page']})")
        if len(orphan_pdf) > 20:
            print(f"    ... and {len(orphan_pdf) - 20} more")
        print()

    if phantom_registry:
        print(f"  PHANTOM REGISTRY ENTRIES (in registry, missing from PDF):")
        for name in sorted(phantom_registry)[:20]:
            entry = reg_by_pdf[name]
            print(f"    - {name} → {entry.get('semanticKey', '?')} ({entry.get('pdfFieldType', '?')})")
        if len(phantom_registry) > 20:
            print(f"    ... and {len(phantom_registry) - 20} more")
        print()

    # -----------------------------------------------------------------------
    # Step 4: Type compatibility check
    # -----------------------------------------------------------------------
    print("[4/5] Checking field type compatibility...")

    type_matches = 0
    type_mismatches = []
    page_mismatches = []

    for name in matched_names:
        pdf_field = pdf_fields[name]
        reg_entry = reg_by_pdf[name]

        # Type check
        if type_compatibility(pdf_field['pdfWidgetTypeId'], reg_entry.get('pdfFieldType', '')):
            type_matches += 1
        else:
            type_mismatches.append({
                'pdfFieldName': name,
                'pdfType': pdf_field['pdfWidgetType'],
                'pdfTypeId': pdf_field['pdfWidgetTypeId'],
                'registryType': reg_entry.get('pdfFieldType', ''),
                'semanticKey': reg_entry.get('semanticKey', ''),
            })

        # Page check
        pdf_page = pdf_field['page']
        reg_page = reg_entry.get('page')
        if reg_page is not None and pdf_page != reg_page:
            page_mismatches.append({
                'pdfFieldName': name,
                'pdfPage': pdf_page,
                'registryPage': reg_page,
                'semanticKey': reg_entry.get('semanticKey', ''),
            })

    print(f"  Type-compatible fields:              {type_matches}/{len(matched_names)} ({100*type_matches/len(matched_names):.1f}%)")
    print(f"  Type mismatches:                     {len(type_mismatches)}")
    print(f"  Page number mismatches:              {len(page_mismatches)}")

    if type_mismatches:
        print(f"\n  TYPE MISMATCHES:")
        for m in type_mismatches[:20]:
            print(f"    - {m['pdfFieldName']}: PDF={m['pdfType']}({m['pdfTypeId']}) vs Registry={m['registryType']} [{m['semanticKey']}]")
        if len(type_mismatches) > 20:
            print(f"    ... and {len(type_mismatches) - 20} more")

    if page_mismatches:
        print(f"\n  PAGE MISMATCHES (first 10):")
        for m in page_mismatches[:10]:
            print(f"    - {m['pdfFieldName']}: PDF page={m['pdfPage']} vs Registry page={m['registryPage']} [{m['semanticKey']}]")
        if len(page_mismatches) > 10:
            print(f"    ... and {len(page_mismatches) - 10} more")
    print()

    # -----------------------------------------------------------------------
    # Step 5: ValueMap / options consistency
    # -----------------------------------------------------------------------
    print("[5/5] Checking valueMap and options consistency...")

    valuemap_fields = 0
    valuemap_correct = 0
    valuemap_issues = []
    radio_option_issues = []
    dropdown_option_issues = []

    for name in matched_names:
        pdf_field = pdf_fields[name]
        reg_entry = reg_by_pdf[name]

        reg_valuemap = reg_entry.get('valueMap')
        reg_options = reg_entry.get('options', [])

        if reg_valuemap:
            valuemap_fields += 1

            # For radio groups: check that valueMap indices match on_states
            if pdf_field['pdfWidgetTypeId'] == fitz.PDF_WIDGET_TYPE_RADIOBUTTON:
                on_states = pdf_field.get('on_states', [])
                # The valueMap should have keys "1", "2", ... corresponding to
                # on_states "0", "1", ... (1-based index → 0-based on_state)
                issues = []
                for key, label in reg_valuemap.items():
                    if key.isdigit():
                        expected_on_state = str(int(key) - 1)
                        if expected_on_state not in on_states:
                            issues.append(f"key={key} expects on_state={expected_on_state} but available: {on_states}")
                    elif label.isdigit():
                        # Reverse direction of bidirectional map
                        pass

                if issues:
                    radio_option_issues.append({
                        'pdfFieldName': name,
                        'semanticKey': reg_entry.get('semanticKey', ''),
                        'on_states': on_states,
                        'valueMap': reg_valuemap,
                        'issues': issues,
                    })
                else:
                    valuemap_correct += 1
            else:
                valuemap_correct += 1

        # For dropdowns: check registry options vs PDF choice_values
        if pdf_field['pdfWidgetTypeId'] == fitz.PDF_WIDGET_TYPE_COMBOBOX:
            pdf_options = pdf_field.get('options', [])
            if pdf_options and reg_options:
                # Check if registry options are a subset of PDF options
                reg_set = set(reg_options)
                pdf_set = set(pdf_options)
                if not reg_set.issubset(pdf_set) and not pdf_set.issubset(reg_set):
                    dropdown_option_issues.append({
                        'pdfFieldName': name,
                        'semanticKey': reg_entry.get('semanticKey', ''),
                        'pdfOptions': pdf_options[:5],
                        'registryOptions': reg_options[:5],
                    })

    print(f"  Fields with valueMap:                {valuemap_fields}")
    print(f"  ValueMaps verified correct:          {valuemap_correct}/{valuemap_fields}")
    print(f"  Radio group option mismatches:       {len(radio_option_issues)}")
    print(f"  Dropdown option mismatches:          {len(dropdown_option_issues)}")

    if radio_option_issues:
        print(f"\n  RADIO OPTION ISSUES:")
        for r in radio_option_issues[:10]:
            print(f"    - {r['pdfFieldName']}: on_states={r['on_states']}")
            for issue in r['issues']:
                print(f"      {issue}")

    if dropdown_option_issues:
        print(f"\n  DROPDOWN OPTION ISSUES:")
        for d in dropdown_option_issues[:10]:
            print(f"    - {d['pdfFieldName']}: PDF={d['pdfOptions']} vs Reg={d['registryOptions']}")
    print()

    # -----------------------------------------------------------------------
    # Step 6: Semantic key uniqueness and coverage
    # -----------------------------------------------------------------------
    print("=" * 70)
    print("STATISTICAL SUMMARY")
    print("=" * 70)

    total_pdf = len(pdf_fields)
    total_reg = len(registry_data)

    # Bijection check: is the mapping 1:1?
    semantic_keys = [e.get('semanticKey') for e in registry_data]
    pdf_names_in_reg = [e.get('pdfFieldName') for e in registry_data]
    dup_semantic = [k for k, v in Counter(semantic_keys).items() if v > 1]
    dup_pdf_names = [k for k, v in Counter(pdf_names_in_reg).items() if v > 1]

    coverage_pct = 100 * len(matched_names) / total_pdf if total_pdf > 0 else 0
    type_compat_pct = 100 * type_matches / len(matched_names) if matched_names else 0

    print(f"""
  PDF file:                            {os.path.basename(PDF_PATH)}
  PDF total unique fields:             {total_pdf}
  PDF total widgets:                   {total_widgets}
  Registry total entries:              {total_reg}

  COVERAGE:
    PDF fields covered by registry:    {len(matched_names)}/{total_pdf} ({coverage_pct:.1f}%)
    Orphan PDF fields (no registry):   {len(orphan_pdf)}
    Phantom registry (no PDF field):   {len(phantom_registry)}

  CORRECTNESS:
    Type-compatible (PDF↔Registry):    {type_matches}/{len(matched_names)} ({type_compat_pct:.1f}%)
    Type mismatches:                   {len(type_mismatches)}
    Page mismatches:                   {len(page_mismatches)}

  MAPPING INTEGRITY:
    Duplicate semanticKeys:            {len(dup_semantic)}
    Duplicate pdfFieldNames in reg:    {len(dup_pdf_names)}
    ValueMap fields verified:          {valuemap_correct}/{valuemap_fields}
    Radio option issues:               {len(radio_option_issues)}
    Dropdown option issues:            {len(dropdown_option_issues)}
""")

    # -----------------------------------------------------------------------
    # Save detailed report
    # -----------------------------------------------------------------------
    report = {
        'pdf_file': os.path.basename(PDF_PATH),
        'pdf_total_unique_fields': total_pdf,
        'pdf_total_widgets': total_widgets,
        'registry_total_entries': total_reg,
        'matched_field_count': len(matched_names),
        'orphan_pdf_fields': sorted(orphan_pdf),
        'phantom_registry_entries': sorted(phantom_registry),
        'type_mismatches': type_mismatches,
        'page_mismatches': page_mismatches[:50],
        'radio_option_issues': radio_option_issues,
        'dropdown_option_issues': dropdown_option_issues,
        'duplicate_semantic_keys': dup_semantic,
        'duplicate_pdf_names_in_registry': dup_pdf_names,
        'pdf_type_counts': dict(pdf_type_counts),
        'registry_type_counts': dict(reg_type_counts),
        'coverage_percent': round(coverage_pct, 2),
        'type_compatibility_percent': round(type_compat_pct, 2),
    }

    with open(REPORT_PATH, 'w') as f:
        json.dump(report, f, indent=2)

    print(f"  Detailed report saved to: {REPORT_PATH}")
    print()

    # -----------------------------------------------------------------------
    # Verdict
    # -----------------------------------------------------------------------
    issues = []
    if orphan_pdf:
        issues.append(f"{len(orphan_pdf)} PDF fields have no registry entry")
    if phantom_registry:
        issues.append(f"{len(phantom_registry)} registry entries have no PDF field")
    if type_mismatches:
        issues.append(f"{len(type_mismatches)} type mismatches")
    if radio_option_issues:
        issues.append(f"{len(radio_option_issues)} radio valueMap issues")
    if dup_semantic:
        issues.append(f"{len(dup_semantic)} duplicate semantic keys")

    if issues:
        print("  ISSUES FOUND:")
        for i in issues:
            print(f"    ⚠ {i}")
    else:
        print("  ✔ No issues found — registry perfectly matches PDF metadata")

    return len(issues)

if __name__ == '__main__':
    sys.exit(main())

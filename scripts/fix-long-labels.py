#!/usr/bin/env python3
"""Fix instruction-leak labels in field-registry.json for sections 11-30.

Conservative approach: only fix labels where the extraction is clearly correct.
"""

import json
import re
import sys

REGISTRY_PATH = "app/src/lib/field-registry/field-registry.json"

# Reliable trailing label patterns (after instruction text)
TRAILING_LABELS = {
    "Street address": "Street address",
    "Street": "Street address",  # Truncated version
    "Last name": "Last name",
    "First name": "First name",
    "Middle name": "Middle name",
    "Suffix": "Suffix",
    "City": "City",
    "State": "State",
    "Zip Code": "Zip Code",
    "Country": "Country",
    "Telephone number": "Telephone number",
    "Extension": "Extension",
    "Email address": "Email address",
    "Passport number": "Passport number",
    "Cell/Mobile number": "Cell/Mobile number",
}

# Labels that indicate a bad extraction
BAD_EXTRACTIONS = {
    "Row 1", "Row 2", "Row 3", "Row 4",
    "Pro", "Str", "Stree", "Same", "Not", "Vol",
    "From Date (Mon", "From Date (Mont", "From Date (Month/Year",
    "From Date (Month/Yea", "For corres", "Check all t",
    "Date of your",
}

MIN_LABEL_LENGTH = 4


def is_valid_label(label: str) -> bool:
    """Check if extracted label looks valid."""
    if len(label) < MIN_LABEL_LENGTH:
        return False
    if label in BAD_EXTRACTIONS:
        return False
    # Reject if it looks truncated (ends mid-word without punctuation)
    if re.search(r'[a-z]$', label) and len(label) < 10:
        return False
    # Reject labels ending with unclosed parenthesis
    if '(' in label and ')' not in label:
        return False
    # Reject labels that end mid-sentence
    if re.search(r'\b(the|and|or|of|for|in|to|a|an|at|by)\s*$', label, re.I):
        return False
    # Reject truncated descriptions
    if re.search(r'activ\b', label):
        return False
    # Reject if starts with instruction words
    if re.match(r'^(Provide|Complete|If |Enter|List|For |otherwise|including|to include|Indicate)', label, re.I):
        return False
    return True


def extract_label(label: str, semantic_key: str) -> str | None:
    """Extract a clean label. Returns None if unsure."""

    if len(label) <= 80:
        return None

    # Pattern 1: "Section N. ..." prefix
    m = re.match(r'^Section \d+[A-E]?\.\s*[^.]+\.\s*(.+)', label)
    if m:
        remainder = m.group(1).strip().rstrip('.')
        if is_valid_label(remainder) and len(remainder) <= 60:
            return remainder

    # Pattern 2: Label ends with a known trailing label
    stripped = label.rstrip('. ')
    for trail, replacement in TRAILING_LABELS.items():
        if stripped.endswith(trail):
            return replacement

    # Pattern 3: instruction text ends with ")" or "." followed by short label
    m = re.search(r'[.)]\s+([A-Z][a-z][\w\s/()-]{2,50})$', stripped)
    if m:
        tail = m.group(1).strip()
        if is_valid_label(tail) and len(tail) <= 55:
            return tail

    # Pattern 4: "Provide the date [of/you/when]..." → "Date ..."
    m = re.match(r'^Provide the (date (?:of |you |when |that )[\w\s]+?)(?:\.|[\s(])', label)
    if m:
        extracted = m.group(1).strip()
        if is_valid_label(extracted) and len(extracted) <= 60:
            return extracted[0].upper() + extracted[1:]

    # Pattern 5: "Provide [short noun phrase]." at the very start
    m = re.match(r'^Provide (?:the |your |a |an |)([\w\s]{4,40}?)\.', label)
    if m:
        extracted = m.group(1).strip()
        # Only if it's a clear noun phrase (not a clause)
        if (is_valid_label(extracted) and len(extracted) <= 40
            and not re.search(r'\b(if|and|or|that|which|who|when|where)\b', extracted, re.I)):
            return extracted[0].upper() + extracted[1:]

    # Pattern 6: "Complete the following if you... Entry #N [label]"
    m = re.search(r'Entry #\d+\s+(.+?)$', label)
    if m:
        tail = m.group(1).strip().rstrip('.')
        if is_valid_label(tail) and len(tail) <= 60:
            return tail

    # Pattern 7: "13A.N Complete the following ... From Date (Month/Year)"
    m = re.search(r'(From Date \(Month/Year\))\s*$', label)
    if m:
        return "From date (month/year)"

    # Pattern 8: "Degree/diploma (...)" → "Degree/diploma"
    if label.startswith('Degree/diploma'):
        return "Degree/diploma"

    return None


def main():
    with open(REGISTRY_PATH) as f:
        data = json.load(f)

    fixes = []
    skipped = 0
    for i, field in enumerate(data):
        label = field.get('label', '')
        section = field.get('section', '')
        sk = field.get('semanticKey', '')
        sec_num = re.match(r'section(\d+)', section)
        if not sec_num:
            continue
        num = int(sec_num.group(1))
        if num < 11:
            continue
        if len(label) <= 80:
            continue

        new_label = extract_label(label, sk)
        if new_label and new_label != label and len(new_label) < len(label):
            fixes.append({
                'index': i,
                'semanticKey': sk,
                'section': section,
                'old': label[:120],
                'new': new_label,
            })
        else:
            skipped += 1

    if '--dry-run' in sys.argv or '-n' in sys.argv:
        print(f"Would fix {len(fixes)} labels ({skipped} skipped):")
        for fix in fixes:
            print(f"\n  [{fix['section']}] {fix['semanticKey']}:")
            print(f"    OLD: \"{fix['old']}\"")
            print(f"    NEW: \"{fix['new']}\"")
        return

    # Apply fixes
    for fix in fixes:
        data[fix['index']]['label'] = fix['new']

    with open(REGISTRY_PATH, 'w') as f:
        json.dump(data, f, indent=2)
        f.write('\n')

    print(f"Fixed {len(fixes)} labels ({skipped} skipped)")

    from collections import Counter
    by_section = Counter(fix['section'] for fix in fixes)
    for sec, count in sorted(by_section.items(), key=lambda x: x[0]):
        print(f"  {sec}: {count} labels")


if __name__ == '__main__':
    main()

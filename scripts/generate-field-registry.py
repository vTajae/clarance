#!/usr/bin/env python3
"""
Generate field-registry.json from legacy mapping data.

Combines four legacy data sources:
1. allFieldsTo_JSON.json    - raw 6,197 fields with IDs and types
2. field-page-mapping.json  - labels, semantic values, pages, options
3. field-sections.json      - section assignments with confidence
4. Reference.json           - partial semantic keys
"""

import json
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LEGACY_B = ROOT / "legacy" / "clarance-b" / "tools" / "externalTools"
LEGACY_F = ROOT / "legacy" / "clarance-f" / "reports"
OUTPUT = ROOT / "app" / "src" / "lib" / "field-registry"

# ---------- SF-86 Section → Our section key mapping ----------

# Must match SF86Section type in types.ts exactly
SECTION_ID_TO_KEY = {
    1: "personalInfo",
    2: "birthInfo",
    3: "birthInfo",            # Place of birth is part of birthInfo
    4: "personalInfo",         # SSN is part of personalInfo (section 1+4)
    5: "namesInfo",
    6: "physicalAttributes",
    7: "contactInfo",
    8: "passportInfo",
    9: "citizenshipInfo",
    10: "dualCitizenshipInfo",
    11: "residencyInfo",
    12: "schoolInfo",
    13: "employmentInfo",
    14: "serviceInfo",
    15: "militaryHistoryInfo",
    16: "peopleThatKnow",
    17: "relationshipInfo",
    18: "relativesInfo",
    19: "foreignContacts",
    20: "foreignActivities",
    21: "mentalHealth",
    22: "policeRecord",
    23: "drugActivity",
    24: "alcoholUse",
    25: "investigationsInfo",
    26: "finances",
    27: "technology",
    28: "civil",
    29: "association",
    30: "signature",
}

# Section key → section group mapping (must match SECTION_GROUPS in types.ts)
SECTION_TO_GROUP = {
    "personalInfo": "identification",
    "birthInfo": "identification",
    "namesInfo": "identification",
    "physicalAttributes": "identification",
    "contactInfo": "identification",
    "passportInfo": "citizenship",
    "citizenshipInfo": "citizenship",
    "dualCitizenshipInfo": "citizenship",
    "residencyInfo": "history",
    "employmentInfo": "history",
    "schoolInfo": "history",
    "serviceInfo": "history",
    "militaryHistoryInfo": "military",
    "peopleThatKnow": "relationships",
    "relationshipInfo": "relationships",
    "relativesInfo": "relationships",
    "foreignContacts": "foreign",
    "foreignActivities": "foreign",
    "mentalHealth": "psychological",
    "policeRecord": "legal",
    "drugActivity": "substance",
    "alcoholUse": "substance",
    "investigationsInfo": "legal",
    "finances": "financial",
    "technology": "review",
    "civil": "legal",
    "association": "review",
    "signature": "review",
}

# PDF type → UI type mapping
PDF_TYPE_TO_UI = {
    "PDFTextField": "text",
    "PDFCheckBox": "checkbox",
    "PDFDropdown": "select",
    "PDFRadioGroup": "radio",
}


def detect_ui_field_type(pdf_type: str, label: str, semantic_value: str, options: list | None) -> str:
    """Infer the more specific UI field type from label content."""
    label_lower = (label or "").lower()
    val_lower = (semantic_value or "").lower()

    if pdf_type == "PDFCheckBox":
        return "checkbox"
    if pdf_type == "PDFRadioGroup":
        return "radio"
    if pdf_type == "PDFDropdown":
        # Check for known dropdown types
        if any(kw in label_lower for kw in ["state", "province"]):
            return "state"
        if any(kw in label_lower for kw in ["country"]):
            return "country"
        if any(kw in label_lower for kw in ["suffix"]):
            return "select"
        return "select"

    # PDFTextField — detect special types from labels
    if any(kw in label_lower for kw in ["date", "month/year", "mm/dd/yyyy"]):
        return "date"
    if any(kw in val_lower for kw in ["startdate", "enddate", "fromdate", "todate"]):
        return "date"
    if "from_datefield" in val_lower or "to_datefield" in val_lower:
        return "date"
    if any(kw in label_lower for kw in ["ssn", "social security"]):
        return "ssn"
    if any(kw in label_lower for kw in ["email", "e-mail"]):
        return "email"
    if any(kw in label_lower for kw in ["telephone", "phone", "number"]) and "ext" not in label_lower:
        return "telephone"
    if any(kw in label_lower for kw in ["height"]):
        return "height"
    if any(kw in label_lower for kw in ["zip", "postal"]):
        return "text"
    return "text"


def extract_repeat_info(pdf_name: str) -> tuple[str | None, int | None]:
    """Detect repeating group and instance index from the PDF field path."""
    # Patterns like section5[0].TextField11[4] → index 1 of repeating group
    # Section18_2[3] → instance 3 of Section18_2 repeat group
    # section_13_1[2] → instance 2 of section 13.1

    parts = pdf_name.split(".")

    # Look for indexed section parts (e.g., Section18_2[3], section_13_1[2])
    for part in parts:
        match = re.match(r"(Section\d+[-_]\d+(?:[-_]\d+)?)\[(\d+)\]", part, re.IGNORECASE)
        if match:
            group_name = match.group(1).lower().replace("-", "_")
            idx = int(match.group(2))
            return group_name, idx

        match = re.match(r"(section_?\d+[-_]\d+(?:[-_]\d+)?)\[(\d+)\]", part, re.IGNORECASE)
        if match:
            group_name = match.group(1).lower().replace("-", "_")
            idx = int(match.group(2))
            return group_name, idx

    # Section11[0] through Section11-4[0] → residency instances
    for part in parts:
        match = re.match(r"Section11(?:-(\d+))?\[0\]", part)
        if match:
            suffix = match.group(1)
            idx = int(suffix) - 1 if suffix else 0
            return "residency", idx

    return None, None


def generate_semantic_key(
    pdf_name: str,
    section_key: str,
    label: str,
    semantic_value: str | None,
    field_index_in_section: int,
    pdf_type: str,
    repeat_group: str | None,
    repeat_index: int | None,
) -> str:
    """Generate a hierarchical semantic key for this field."""

    # If we have a semantic value from the legacy mapping, use it as a base
    if semantic_value and isinstance(semantic_value, str):
        # Pattern: sect5firstName#1 → otherNames.0.firstName
        match = re.match(r"sect(\d+)(\w+)#(\d+)", semantic_value)
        if match:
            field_name = match.group(2)
            instance = int(match.group(3)) - 1  # 0-indexed
            # Convert camelCase properly
            field_name = field_name[0].lower() + field_name[1:]
            return f"{section_key}.{instance}.{field_name}"

    # For fields with a good label, derive from label
    if label and label not in ("", "RadioButtonList", "CheckBox"):
        # Clean the label to make a key
        key_parts = []
        clean_label = label.strip()

        # Common label → key mappings
        label_map = {
            "Middle Name": "middleName",
            "First Name": "firstName",
            "Last name": "lastName",
            "Last Name": "lastName",
            "Suffix": "suffix",
            "Estimate": "isEstimate",
            "Present": "isPresent",
            "SSN": "ssn",
            "City": "city",
            "County": "county",
            "State": "state",
            "Country": "country",
            "Zip Code": "zipCode",
            "Street": "street",
            "APO/FPO": "apoFpo",
        }

        if clean_label in label_map:
            field_name = label_map[clean_label]
        else:
            # Generate from label text
            # Strip long instructional text (take first meaningful phrase)
            if len(clean_label) > 60:
                # Take first sentence or phrase
                for sep in [". ", " - ", ": ", ", "]:
                    if sep in clean_label[:60]:
                        clean_label = clean_label[:clean_label.index(sep)]
                        break
                else:
                    clean_label = clean_label[:50]

            # Convert to camelCase
            words = re.sub(r"[^a-zA-Z0-9\s]", "", clean_label).split()
            if words:
                field_name = words[0].lower() + "".join(w.capitalize() for w in words[1:])
            else:
                field_name = f"field{field_index_in_section}"

        # Add repeat index if applicable
        if repeat_index is not None:
            return f"{section_key}.{repeat_index}.{field_name}"
        return f"{section_key}.{field_name}"

    # Fallback: use generic name with index
    leaf = pdf_name.split(".")[-1]
    clean = re.sub(r"\[\d+\]", "", leaf).replace("#", "")
    if repeat_index is not None:
        return f"{section_key}.{repeat_index}.{clean}_{field_index_in_section}"
    return f"{section_key}.{clean}_{field_index_in_section}"


def build_registry():
    """Build the complete field registry from legacy data."""

    print("Loading legacy data sources...")

    # Load all sources
    with open(LEGACY_B / "allFieldsTo_JSON.json") as f:
        raw_fields = json.load(f)
    print(f"  Raw fields: {len(raw_fields)}")

    with open(LEGACY_F / "field-page-mapping.json") as f:
        page_mapping = json.load(f)
    print(f"  Page mapping: {len(page_mapping)} entries")

    with open(LEGACY_F / "field-sections.json") as f:
        section_mapping = json.load(f)
    print(f"  Section mapping: {len(section_mapping)} entries")

    with open(LEGACY_B / "Reference.json") as f:
        reference = json.load(f)
    ref_by_name = {f["name"]: f for f in reference}
    print(f"  Reference: {len(reference)} entries")

    with open(LEGACY_F / "field-labels.json") as f:
        labels = json.load(f)
    print(f"  Labels: {len(labels)} entries")

    # Track semantic keys for uniqueness
    seen_keys = {}
    registry = []
    section_field_counter = defaultdict(int)

    for raw in raw_fields:
        pdf_name = raw["name"]
        pdf_id = raw["id"]
        pdf_type = raw["type"]

        # Get page mapping data
        pm = page_mapping.get(pdf_name, {})
        page = pm.get("page", 0)
        label = pm.get("label", labels.get(pdf_name, ""))
        semantic_value = pm.get("value")
        options = pm.get("options")
        required = pm.get("required", False)

        # Get section assignment
        sm = section_mapping.get(pdf_name, {})
        section_id = sm.get("section", 0)
        section_name = sm.get("sectionName", "Unknown")
        confidence = sm.get("confidence", 0)

        # Map section ID to our section key
        section_key = SECTION_ID_TO_KEY.get(section_id, "unknown")
        group = SECTION_TO_GROUP.get(section_key, "review")

        # Get reference value (partial semantic from Reference.json)
        ref = ref_by_name.get(pdf_name, {})
        ref_value = ref.get("value", "")

        # Detect repeat info
        repeat_group, repeat_index = extract_repeat_info(pdf_name)

        # Track field index within section
        section_field_counter[section_key] += 1
        field_idx = section_field_counter[section_key]

        # Determine UI field type
        ui_type = detect_ui_field_type(
            pdf_type,
            label,
            str(semantic_value) if semantic_value else "",
            options,
        )

        # Generate semantic key
        sem_key = generate_semantic_key(
            pdf_name,
            section_key,
            label,
            semantic_value if isinstance(semantic_value, str) else None,
            field_idx,
            pdf_type,
            repeat_group,
            repeat_index,
        )

        # Ensure uniqueness
        if sem_key in seen_keys:
            # Append a disambiguator
            counter = 2
            base = sem_key
            while sem_key in seen_keys:
                sem_key = f"{base}_{counter}"
                counter += 1
        seen_keys[sem_key] = True

        # Handle value for options (dropdown/radio)
        value_map = None
        if options and pdf_type == "PDFRadioGroup":
            value_map = {opt: opt for opt in options}
        elif options and pdf_type == "PDFDropdown":
            value_map = {opt: opt for opt in options}

        # Detect max length from label hints
        max_length = None
        if pdf_type == "PDFTextField":
            # Look for hints like "(25 characters)" in the label
            len_match = re.search(r"\((\d+)\s*char", label or "")
            if len_match:
                max_length = int(len_match.group(1))

        # Build the registry entry
        entry = {
            "pdfFieldName": pdf_name,
            "pdfObjectRef": pdf_id,
            "pdfFieldType": pdf_type,
            "pdfPage": page,
            "semanticKey": sem_key,
            "section": section_key,
            "sectionGroup": group,
            "sf86SectionId": section_id,
            "sf86SectionName": section_name,
            "label": label[:200] if label else "",  # Truncate very long labels
            "uiFieldType": ui_type,
            "required": required if isinstance(required, bool) else False,
            "classificationConfidence": confidence,
            "manuallyVerified": False,
        }

        # Optional fields
        if options:
            entry["options"] = options
        if value_map:
            entry["valueMap"] = value_map
        if max_length:
            entry["maxLength"] = max_length
        if repeat_group:
            entry["repeatGroup"] = repeat_group
        if repeat_index is not None:
            entry["repeatIndex"] = repeat_index

        # Add reference value if useful
        if ref_value and isinstance(ref_value, str) and ref_value not in ("Yes", "No", "YES", "NO"):
            entry["referenceValue"] = ref_value

        registry.append(entry)

    return registry


def print_stats(registry: list):
    """Print summary statistics."""
    from collections import Counter

    print(f"\n{'=' * 60}")
    print(f"FIELD REGISTRY SUMMARY")
    print(f"{'=' * 60}")
    print(f"Total fields: {len(registry)}")

    # By section
    section_counts = Counter(e["section"] for e in registry)
    print(f"\nFields by section:")
    for section, count in section_counts.most_common():
        print(f"  {section:25s}: {count:4d}")

    # By UI type
    type_counts = Counter(e["uiFieldType"] for e in registry)
    print(f"\nFields by UI type:")
    for t, c in type_counts.most_common():
        print(f"  {t:15s}: {c:4d}")

    # By PDF type
    pdf_counts = Counter(e["pdfFieldType"] for e in registry)
    print(f"\nFields by PDF type:")
    for t, c in pdf_counts.most_common():
        print(f"  {t:15s}: {c:4d}")

    # Confidence distribution
    high = sum(1 for e in registry if e["classificationConfidence"] >= 0.8)
    med = sum(1 for e in registry if 0.5 <= e["classificationConfidence"] < 0.8)
    low = sum(1 for e in registry if e["classificationConfidence"] < 0.5)
    print(f"\nConfidence distribution:")
    print(f"  High (≥0.8): {high}")
    print(f"  Medium (0.5-0.8): {med}")
    print(f"  Low (<0.5): {low}")

    # Fields with options
    with_opts = sum(1 for e in registry if "options" in e)
    print(f"\nFields with options: {with_opts}")

    # Repeat groups
    repeat_groups = Counter(e.get("repeatGroup") for e in registry if e.get("repeatGroup"))
    if repeat_groups:
        print(f"\nRepeat groups:")
        for g, c in repeat_groups.most_common():
            print(f"  {g}: {c} fields")

    # Pages
    pages = sorted(set(e["pdfPage"] for e in registry))
    print(f"\nPage range: {min(pages)} - {max(pages)} ({len(pages)} pages)")


def main():
    registry = build_registry()
    print_stats(registry)

    # Write output
    output_path = OUTPUT / "field-registry.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, "w") as f:
        json.dump(registry, f, indent=2)

    size_mb = output_path.stat().st_size / (1024 * 1024)
    print(f"\nWritten to: {output_path}")
    print(f"File size: {size_mb:.2f} MB")

    # Also write a compact version for production
    compact_path = OUTPUT / "field-registry.min.json"
    with open(compact_path, "w") as f:
        json.dump(registry, f, separators=(",", ":"))

    compact_mb = compact_path.stat().st_size / (1024 * 1024)
    print(f"Compact version: {compact_path} ({compact_mb:.2f} MB)")


if __name__ == "__main__":
    main()

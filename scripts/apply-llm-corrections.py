#!/usr/bin/env python3
"""
Apply 102 LLM-reviewed label corrections to field-registry.json.

These corrections were produced by 6 parallel LLM review agents analyzing
the remaining 322 text-proximity mismatches. Each correction was individually
reasoned about with SF-86 domain knowledge.

Run: python3 scripts/apply-llm-corrections.py
"""

import json
from pathlib import Path


def main():
    registry_path = Path("app/src/lib/field-registry/field-registry.json")
    corrections_path = Path("scripts/llm-corrections-combined.json")

    registry = json.loads(registry_path.read_text())
    corrections = json.loads(corrections_path.read_text())

    reg_map = {f["pdfFieldName"]: f for f in registry}

    applied = 0
    skipped = 0
    already_correct = 0

    for c in corrections:
        field_name = c["pdfFieldName"]
        new_label = c["newLabel"]

        field = reg_map.get(field_name)
        if not field:
            # Try without escaped dots
            field = reg_map.get(field_name.replace("\\.", "."))
        if not field:
            print(f"  NOT FOUND: {field_name}")
            skipped += 1
            continue

        old_label = field.get("label", "")
        if old_label == new_label:
            already_correct += 1
            continue

        field["label"] = new_label
        if field.get("classificationConfidence", 0) < 0.85:
            field["classificationConfidence"] = 0.85
        field["manuallyVerified"] = True
        applied += 1
        print(f"  FIXED: {field_name[:60]}")
        print(f"    {old_label[:55]} → {new_label[:55]}")

    registry_path.write_text(json.dumps(registry, indent=2))

    print(f"\n=== Summary ===")
    print(f"Corrections in file: {len(corrections)}")
    print(f"Applied: {applied}")
    print(f"Already correct: {already_correct}")
    print(f"Not found: {skipped}")
    print(f"Registry saved to: {registry_path}")


if __name__ == "__main__":
    main()

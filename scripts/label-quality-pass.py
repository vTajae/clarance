#!/usr/bin/env python3
"""
Label Quality Pass: Cross-reference field labels against PDF analysis
=====================================================================

Compares current field-registry.json labels against question text extracted
by pdf-page-analysis.py, flagging mismatches where a better label exists.

Usage:
  python3 scripts/label-quality-pass.py [--apply]

Without --apply: dry run, shows proposed changes.
With --apply: writes corrections to field-registry.json.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any

PROJECT_ROOT = Path(__file__).resolve().parent.parent
REGISTRY_PATH = PROJECT_ROOT / "app/src/lib/field-registry/field-registry.json"
ANALYSIS_PATH = PROJECT_ROOT / "app/src/lib/wizard/pdf-analysis.json"


def normalize(text: str) -> str:
    """Normalize text for comparison."""
    text = text.lower().strip()
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r"[^a-z0-9'\s]", ' ', text)
    return re.sub(r'\s+', ' ', text).strip()


def word_overlap(a: str, b: str) -> float:
    """Jaccard similarity on word sets."""
    wa = set(normalize(a).split())
    wb = set(normalize(b).split())
    if not wa or not wb:
        return 0.0
    return len(wa & wb) / len(wa | wb)


def is_generic_label(label: str) -> bool:
    """Check if a label is too generic to be useful."""
    generic_patterns = [
        r'^TextField\d+',
        r'^RadioButton\w*\d+',
        r'^CheckBox\d+',
        r'^#field',
        r'^field\[',
        r'^Dropdown\d+',
    ]
    return any(re.match(p, label, re.IGNORECASE) for p in generic_patterns)


def is_truncated_instruction(label: str) -> bool:
    """Check if label is an overly long instruction that got truncated."""
    return len(label) > 100 and ('...' in label or label.endswith('"'))


def find_better_label(
    field: dict[str, Any],
    analysis: dict[str, Any],
) -> str | None:
    """Find a better label from PDF analysis for a field."""
    section = field.get("section", "")
    semantic_key = field["semanticKey"]
    current_label = field.get("label", "")

    # Skip fields with manually verified labels
    if field.get("manuallyVerified"):
        return None

    # Get question groups from the section
    section_info = analysis.get("sectionInstructions", {}).get(section, {})
    questions = section_info.get("questions", [])

    # Find questions that reference this field
    for q in questions:
        q_fields = q.get("fieldKeys", [])
        if semantic_key in q_fields:
            q_text = q.get("text", "")
            if q_text and len(q_text) > 5:
                # Check if question text is a better label
                # Prefer shorter, more specific text over current label
                if is_generic_label(current_label):
                    return q_text[:200]
                if is_truncated_instruction(current_label) and len(q_text) < len(current_label):
                    return q_text[:200]
                # Skip overlap check if current label is a short, specific label.
                # Short labels like "First Name", "City", "Date From" are already
                # good; question text ("Provide your full legal name") is worse.
                if len(current_label) <= 60 and not is_generic_label(current_label):
                    continue
                # Check if there's significantly better overlap
                if word_overlap(current_label, q_text) < 0.1 and len(q_text) < 80:
                    # Only suggest if the question text is clearly a better label
                    if '?' in q_text:
                        return q_text[:200]

    # Check conditional map for gate fields
    cond_map = analysis.get("conditionalMap", {})
    if semantic_key in cond_map:
        cond_info = cond_map[semantic_key]
        q_text = cond_info.get("questionText", "")
        if q_text and len(q_text) > 5 and is_generic_label(current_label):
            return q_text[:200]

    return None


def main():
    apply_changes = "--apply" in sys.argv

    print("=== Label Quality Pass ===\n")

    registry = json.loads(REGISTRY_PATH.read_text())
    analysis = json.loads(ANALYSIS_PATH.read_text())
    print(f"Registry: {len(registry)} fields")
    print(f"Analysis: {analysis['metadata']['totalPages']} pages")

    corrections: list[dict[str, str]] = []
    generic_count = 0
    truncated_count = 0

    for field in registry:
        label = field.get("label", "")
        if is_generic_label(label):
            generic_count += 1
        if is_truncated_instruction(label):
            truncated_count += 1

        better = find_better_label(field, analysis)
        if better:
            corrections.append({
                "semanticKey": field["semanticKey"],
                "section": field["section"],
                "currentLabel": label,
                "suggestedLabel": better,
            })

    print(f"\nGeneric labels found:   {generic_count}")
    print(f"Truncated labels found: {truncated_count}")
    print(f"Corrections proposed:   {len(corrections)}")

    if corrections:
        print(f"\n--- Top {min(20, len(corrections))} Corrections ---")
        for c in corrections[:20]:
            print(f"\n  {c['semanticKey']} ({c['section']})")
            print(f"    Current:   {c['currentLabel'][:60]}")
            print(f"    Suggested: {c['suggestedLabel'][:60]}")

    if apply_changes and corrections:
        print(f"\nApplying {len(corrections)} corrections...")
        correction_map = {c["semanticKey"]: c["suggestedLabel"] for c in corrections}

        for field in registry:
            if field["semanticKey"] in correction_map:
                field["label"] = correction_map[field["semanticKey"]]

        REGISTRY_PATH.write_text(json.dumps(registry, indent=2))
        print(f"Wrote updated registry to {REGISTRY_PATH}")
    elif corrections:
        print(f"\nDry run complete. Run with --apply to write corrections.")

    # Save report
    report_path = PROJECT_ROOT / "scripts/label-quality-report.json"
    report = {
        "totalFields": len(registry),
        "genericLabels": generic_count,
        "truncatedLabels": truncated_count,
        "correctionsProposed": len(corrections),
        "corrections": corrections,
    }
    report_path.write_text(json.dumps(report, indent=2))
    print(f"Report saved to: {report_path}")


if __name__ == "__main__":
    main()

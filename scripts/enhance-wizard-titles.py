#!/usr/bin/env python3
"""
Enhance Wizard Step Titles
==========================

Post-processes wizard-steps.json to replace generic/duplicate step titles
with descriptive, entry-indexed titles derived from field labels and
PDF question text.

Usage:
  python3 scripts/enhance-wizard-titles.py [--dry-run]

Reads:
  - app/src/lib/wizard/wizard-steps.json
  - app/src/lib/field-registry/field-registry.json
  - app/src/lib/wizard/pdf-analysis.json (optional, for richer guidance)

Writes:
  - app/src/lib/wizard/wizard-steps.json (overwritten unless --dry-run)
"""

from __future__ import annotations

import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parent.parent
WIZARD_PATH = PROJECT_ROOT / "app/src/lib/wizard/wizard-steps.json"
REGISTRY_PATH = PROJECT_ROOT / "app/src/lib/field-registry/field-registry.json"
ANALYSIS_PATH = PROJECT_ROOT / "app/src/lib/wizard/pdf-analysis.json"

# Entity labels by section for repeat group entries
ENTITY_LABELS: dict[str, str] = {
    "section5": "Other Name",
    "section7": "Contact",
    "section8": "Passport",
    "section10": "Citizenship",
    "section11": "Residence",
    "section12": "School",
    "section13A": "Employment",
    "section13B": "Federal Service",
    "section13C": "Employment Record",
    "section15": "Military Service",
    "section16": "Reference",
    "section17": "Relationship",
    "section18": "Relative",
    "section19": "Foreign Contact",
    "section20A": "Foreign Financial Interest",
    "section20B": "Foreign Business",
    "section20C": "Foreign Travel",
    "section21A": "Court-Ordered Counseling",
    "section21B": "Incompetence Ruling",
    "section21C": "Hospitalization",
    "section21D": "Healthcare Professional",
    "section21E": "Counseling",
    "section22": "Police Record",
    "section23": "Drug Activity",
    "section24": "Alcohol Incident",
    "section25": "Investigation",
    "section26": "Financial Issue",
    "section27": "IT Incident",
    "section28": "Court Action",
    "section29": "Association",
}

# Topic keywords to extract from field labels (priority order)
TOPIC_PATTERNS: list[tuple[str, list[str]]] = [
    ("Position & Status", ["position title", "employment status"]),
    ("Position History", ["position title. row", "supervisor. row"]),
    ("Employer Address", ["address of employer", "street address", "provide address"]),
    ("Work Location", ["work address", "physical work location", "physically located"]),
    ("Supervisor Contact", ["email address of your supervisor", "supervisor"]),
    ("APO/FPO Address", ["apo/fpo", "apo fpo"]),
    ("Dates & Duration", ["from date", "to date", "date from", "date to", "month/year"]),
    ("Verifier Information", ["verifier", "verification"]),
    ("Self-Employment", ["self-employment", "self employment"]),
    ("Address", ["street", "city", "state", "zip code", "country", "address"]),
    ("Phone & Email", ["telephone", "phone", "email"]),
    ("Name", ["first name", "last name", "middle name", "full name", "maiden"]),
    ("Date of Birth", ["date of birth", "dob"]),
    ("Citizenship", ["citizenship", "citizen"]),
    ("Documentation", ["document number", "certificate", "passport", "license"]),
    ("Relationship", ["relationship", "relative type", "nature of"]),
    ("Deceased Information", ["deceased", "date of death"]),
    ("Court Details", ["court", "offense", "charge", "sentence"]),
    ("Treatment Details", ["treatment", "counseling", "provider", "facility"]),
    ("Financial Details", ["amount", "account", "bank", "property"]),
    ("Additional Contact", ["additional contact", "person who knows"]),
    ("Details", []),  # fallback
]


# ---------------------------------------------------------------------------
# Registry helpers
# ---------------------------------------------------------------------------

def build_registry_map(registry: list[dict]) -> dict[str, dict]:
    """Map semanticKey -> field definition."""
    return {f["semanticKey"]: f for f in registry}


def derive_topic(field_keys: list[str], reg_map: dict[str, dict]) -> str:
    """Derive a short topic name from the field labels in a step."""
    labels = []
    for key in field_keys:
        f = reg_map.get(key)
        if f:
            labels.append(f["label"].lower())

    combined = " ".join(labels)

    for topic_name, keywords in TOPIC_PATTERNS:
        if not keywords:
            continue
        if any(kw in combined for kw in keywords):
            return topic_name

    # Fallback: use first field's label, truncated
    if labels:
        first = labels[0]
        # Clean up and capitalize
        first = re.sub(r'\.$', '', first).strip()
        words = first.split()[:4]
        return " ".join(w.capitalize() for w in words)

    return "Details"


def get_entry_label(section: str, repeat_index: int) -> str:
    """Get a descriptive entry label like 'Employment 1'."""
    entity = ENTITY_LABELS.get(section, "Entry")
    return f"{entity} {repeat_index + 1}"


# ---------------------------------------------------------------------------
# Title enhancement
# ---------------------------------------------------------------------------

def enhance_step_title(
    step: dict[str, Any],
    section: str,
    reg_map: dict[str, dict],
    step_index_in_section: int,
) -> str:
    """Generate an improved title for a wizard step."""
    field_keys = step.get("fieldKeys", [])
    repeat_group = step.get("repeatGroup")
    repeat_index = step.get("repeatIndex", 0)
    is_gate = step.get("gateFieldKey") and not step.get("isConditionalBlock")
    is_conditional = step.get("isConditionalBlock", False)

    # 1. Gate steps: keep question text, prefix with entry number for repeat groups
    if is_gate:
        gate_key = step["gateFieldKey"]
        gate_field = reg_map.get(gate_key, {})
        question = gate_field.get("label", step.get("title", ""))
        # Clean up overly long labels
        question = re.sub(r'\.$', '', question).strip()
        if len(question) > 80:
            question = question[:77] + "..."

        if repeat_group is not None:
            entry_label = get_entry_label(section, repeat_index)
            return f"{entry_label}: {question}"
        return question

    # 2. Conditional blocks: entry number + topic
    if is_conditional:
        topic = derive_topic(field_keys, reg_map)
        if repeat_group is not None:
            entry_label = get_entry_label(section, repeat_index)
            return f"{entry_label}: {topic}"
        return topic

    # 3. Non-gate, non-conditional steps in repeat groups
    if repeat_group is not None:
        entry_label = get_entry_label(section, repeat_index)
        topic = derive_topic(field_keys, reg_map)
        if topic != "Details":
            return f"{entry_label}: {topic}"
        return entry_label

    # 4. Regular steps (no repeat group)
    # Keep existing title if it's descriptive enough
    existing = step.get("title", "")
    if existing and not _is_generic_title(existing):
        return existing

    # Generate from fields
    topic = derive_topic(field_keys, reg_map)
    return topic


def _is_generic_title(title: str) -> bool:
    """Check if a title is generic and needs replacement."""
    generic_patterns = [
        r"^Entry \d+",
        r"^Details",
        r"- Details",
        r"^\(.+\)$",
    ]
    return any(re.search(p, title) for p in generic_patterns)


# ---------------------------------------------------------------------------
# Guidance enhancement
# ---------------------------------------------------------------------------

def enhance_guidance(
    step: dict[str, Any],
    section: str,
    reg_map: dict[str, dict],
    analysis: dict | None,
) -> str | None:
    """Optionally improve guidance text. Returns None to keep existing."""
    existing = step.get("guidance", "")

    # Don't replace good guidance
    if existing and len(existing) > 50 and "Answer this question" not in existing:
        return None

    # For gate steps, try to find actual PDF instruction
    if step.get("gateFieldKey") and analysis:
        gate_key = step["gateFieldKey"]
        cond_map = analysis.get("conditionalMap", {})
        info = cond_map.get(gate_key, {})
        if info.get("conditionalInstruction"):
            return info["conditionalInstruction"]

    # For conditional blocks with generic guidance
    if step.get("isConditionalBlock"):
        gate_key = step.get("gateFieldKey", "")
        gate_field = reg_map.get(gate_key, {})
        gate_label = gate_field.get("label", "")
        if gate_label:
            return f"Complete the following based on your answer to: {gate_label}"

    return None


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    dry_run = "--dry-run" in sys.argv

    print("=== Wizard Title Enhancement ===\n")

    # Load data
    wizard_data = json.loads(WIZARD_PATH.read_text())
    registry = json.loads(REGISTRY_PATH.read_text())
    reg_map = build_registry_map(registry)

    analysis = None
    if ANALYSIS_PATH.exists():
        analysis = json.loads(ANALYSIS_PATH.read_text())

    print(f"Wizard sections: {len(wizard_data)}")
    print(f"Registry fields: {len(registry)}")
    print(f"PDF analysis:    {'loaded' if analysis else 'not found'}\n")

    total_steps = 0
    total_changed = 0
    per_section_stats: dict[str, dict] = {}

    for section in sorted(wizard_data.keys()):
        steps = wizard_data[section]["steps"]
        section_changed = 0
        titles_before = Counter(s["title"] for s in steps)
        dupes_before = sum(c for c in titles_before.values() if c > 1)

        for i, step in enumerate(steps):
            old_title = step["title"]
            new_title = enhance_step_title(step, section, reg_map, i)

            if new_title != old_title:
                step["title"] = new_title
                section_changed += 1

            # Optionally enhance guidance
            new_guidance = enhance_guidance(step, section, reg_map, analysis)
            if new_guidance:
                step["guidance"] = new_guidance

        titles_after = Counter(s["title"] for s in steps)
        dupes_after = sum(c for c in titles_after.values() if c > 1)

        total_steps += len(steps)
        total_changed += section_changed

        if section_changed > 0 or dupes_before > 0:
            pct_before = 100 * dupes_before // len(steps) if steps else 0
            pct_after = 100 * dupes_after // len(steps) if steps else 0
            print(f"  {section}: {len(steps)} steps, {section_changed} titles changed, "
                  f"dupes {dupes_before}({pct_before}%) -> {dupes_after}({pct_after}%)")
            per_section_stats[section] = {
                "steps": len(steps),
                "changed": section_changed,
                "dupesBefore": dupes_before,
                "dupesAfter": dupes_after,
            }

    print(f"\n=== SUMMARY ===")
    print(f"Total steps:   {total_steps}")
    print(f"Titles changed: {total_changed}")

    # Check remaining duplicates
    remaining_dupes = 0
    for section in wizard_data:
        titles = Counter(s["title"] for s in wizard_data[section]["steps"])
        remaining_dupes += sum(c for c in titles.values() if c > 1)
    print(f"Remaining duplicates: {remaining_dupes}")

    if dry_run:
        print("\n[DRY RUN] No files written.")
    else:
        WIZARD_PATH.write_text(json.dumps(wizard_data, indent=2))
        print(f"\nWritten: {WIZARD_PATH}")


if __name__ == "__main__":
    main()

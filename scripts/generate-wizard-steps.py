#!/usr/bin/env python3
"""
Generate Wizard Steps from PDF Analysis
========================================

Consumes pdf-analysis.json + field-registry.json to produce a new wizard-steps.json
with question-grouped steps, real PDF instructions, and conditional context.

Usage:
  python3 scripts/generate-wizard-steps.py

Reads:
  - app/src/lib/wizard/pdf-analysis.json
  - app/src/lib/field-registry/field-registry.json
  - app/src/lib/wizard/wizard-steps.json (current, for comparison)

Writes:
  - app/src/lib/wizard/wizard-steps.json (overwritten)
"""

from __future__ import annotations

import json
import re
import sys
from collections import defaultdict
from pathlib import Path
from typing import Any

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parent.parent
REGISTRY_PATH = PROJECT_ROOT / "app/src/lib/field-registry/field-registry.json"
ANALYSIS_PATH = PROJECT_ROOT / "app/src/lib/wizard/pdf-analysis.json"
OUTPUT_PATH = PROJECT_ROOT / "app/src/lib/wizard/wizard-steps.json"

# Max fields per wizard step (avoid overwhelming the user)
MAX_FIELDS_PER_STEP = 12

# Section titles for guidance text
SECTION_TITLES = {
    "section1": "Full Name",
    "section2": "Date of Birth",
    "section3": "Place of Birth",
    "section4": "Social Security Number",
    "section5": "Other Names Used",
    "section6": "Your Identifying Information",
    "section7": "Contact Information",
    "section8": "Passport Information",
    "section9": "Citizenship Status",
    "section10": "Dual/Multiple Citizenship",
    "section11": "Where You Have Lived",
    "section12": "Where You Went to School",
    "section13A": "Employment Activities",
    "section13B": "Former Federal Civilian Employment",
    "section13C": "Employment Record",
    "section14": "Selective Service Record",
    "section15": "Military History",
    "section16": "People Who Know You Well",
    "section17": "Marital Status / Relationships",
    "section18": "Relatives",
    "section19": "Foreign Contacts",
    "section20A": "Foreign Activities - Financial",
    "section20B": "Foreign Activities - Business",
    "section20C": "Foreign Activities - Conferences",
    "section21": "Psychological and Emotional Health",
    "section21A": "Court-Ordered Counseling",
    "section21B": "Adjudication of Incompetence",
    "section21C": "Hospitalization",
    "section21D": "Healthcare Professional Consultation",
    "section21E": "Other Counseling",
    "section22": "Police Record",
    "section23": "Illegal Use of Drugs",
    "section24": "Use of Alcohol",
    "section25": "Investigations and Clearances",
    "section26": "Financial Record",
    "section27": "Use of Information Technology Systems",
    "section28": "Involvement in Non-Criminal Court Actions",
    "section29": "Association Record",
    "section30": "Certification / Signature",
}


# ---------------------------------------------------------------------------
# Data loading
# ---------------------------------------------------------------------------

def load_json(path: Path) -> Any:
    return json.loads(path.read_text())


# ---------------------------------------------------------------------------
# Step generation logic
# ---------------------------------------------------------------------------

def make_step_id(section: str, suffix: str) -> str:
    return f"{section}.{suffix}"


def get_section_questions(analysis: dict, section: str) -> list[dict]:
    """Get question groups from the analysis that pertain to a section."""
    info = analysis.get("sectionInstructions", {}).get(section, {})
    return info.get("questions", [])


def get_section_conditionals(analysis: dict, section: str) -> list[dict]:
    """Get conditional instructions for a section."""
    info = analysis.get("sectionInstructions", {}).get(section, {})
    return info.get("conditionalInstructions", [])


def get_section_pages(analysis: dict, section: str) -> list[int]:
    """Get the PDF pages that contain a section's fields."""
    info = analysis.get("sectionInstructions", {}).get(section, {})
    return info.get("pages", [])


def get_certification_text(analysis: dict) -> str:
    """Get the certification text from section 30."""
    return analysis.get("certificationText", {}).get("fullText", "")


def build_gate_index(fields: list[dict]) -> dict[str, list[str]]:
    """Map gate field key -> list of dependent field keys."""
    gate_map: dict[str, list[str]] = defaultdict(list)
    for f in fields:
        dep = f.get("dependsOn")
        if dep:
            gate_map[dep].append(f["semanticKey"])
    return dict(gate_map)


def find_conditional_instruction(
    analysis: dict,
    gate_key: str,
    section: str,
) -> str:
    """Find the conditional instruction text for a gate field."""
    cond_map = analysis.get("conditionalMap", {})
    info = cond_map.get(gate_key, {})
    if info.get("questionText"):
        return info["questionText"]
    return ""


def find_pdf_instruction(
    analysis: dict,
    field_keys: list[str],
    section: str,
) -> str:
    """Find PDF instruction text relevant to a set of fields."""
    questions = get_section_questions(analysis, section)
    for q in questions:
        # Check if any field keys overlap with this question's fields
        q_fields = set(q.get("fieldKeys", []))
        if q_fields & set(field_keys):
            inst = q.get("instruction", "")
            if inst:
                return inst
    return ""


def generate_section_steps(
    section: str,
    section_fields: list[dict],
    analysis: dict,
    gate_index: dict[str, list[str]],
) -> list[dict]:
    """Generate wizard steps for a single section."""
    steps: list[dict] = []
    section_pages = get_section_pages(analysis, section)
    section_title = SECTION_TITLES.get(section, section)

    # Separate gate fields and their dependents
    gate_fields = set(gate_index.keys()) & {f["semanticKey"] for f in section_fields}

    # Build repeat group info
    repeat_groups: dict[str, dict[int, list[dict]]] = defaultdict(lambda: defaultdict(list))
    non_repeat_fields: list[dict] = []

    for f in section_fields:
        rg = f.get("repeatGroup")
        if rg:
            ri = f.get("repeatIndex", 0)
            repeat_groups[rg][ri].append(f)
        else:
            non_repeat_fields.append(f)

    # 1. Generate gate steps first
    processed_keys: set[str] = set()

    for gate_key in sorted(gate_fields):
        gate_field = next((f for f in section_fields if f["semanticKey"] == gate_key), None)
        if not gate_field:
            continue

        # Don't add gate step if it's already in a repeat group (handled below)
        if gate_field.get("repeatGroup"):
            continue

        # Gate step: contains only the gate field
        gate_label = gate_field.get("label", "")
        cond_inst = find_conditional_instruction(analysis, gate_key, section)

        step = {
            "id": make_step_id(section, f"gate.{gate_key.split('.')[-1]}"),
            "title": gate_label if len(gate_label) < 80 else gate_label[:77] + "...",
            "guidance": f"Answer this question to continue with {section_title}.",
            "fieldKeys": [gate_key],
            "gateFieldKey": gate_key,
            "sourcePages": section_pages[:3],
        }
        if cond_inst:
            step["conditionalInstruction"] = cond_inst

        # Extract skip routing from option text (e.g. "NO (If NO, proceed to Section 6)")
        value_map = gate_field.get("valueMap", {})
        for opt in gate_field.get("options", []):
            m = re.search(
                r'(?:proceed|skip|go)\s+to\s+(?:Section|Item)\s+(\d+[A-E]?)',
                opt, re.IGNORECASE,
            )
            if m:
                # Use the valueMap value for this option (what the Jotai atom stores)
                stored_val = value_map.get(opt, opt)
                step["skipToSection"] = f"section{m.group(1)}"
                step["skipOnValue"] = stored_val
                break

        steps.append(step)
        processed_keys.add(gate_key)

        # Conditional block: fields that depend on this gate
        dep_keys = gate_index.get(gate_key, [])
        dep_fields = [
            f for f in section_fields
            if f["semanticKey"] in dep_keys and not f.get("repeatGroup")
        ]

        if dep_fields:
            # Group dependent fields into steps of MAX_FIELDS_PER_STEP
            for chunk_idx, chunk in enumerate(chunk_list(dep_fields, MAX_FIELDS_PER_STEP)):
                chunk_keys = [f["semanticKey"] for f in chunk]
                pdf_inst = find_pdf_instruction(analysis, chunk_keys, section)

                # Get showWhen from the first dependent field
                show_when = chunk[0].get("showWhen", "")
                trigger_text = ""
                if "YES" in show_when.upper():
                    trigger_text = "These fields appear because you answered Yes."
                elif "NO" in show_when.upper():
                    trigger_text = "These fields appear because you answered No."

                cond_step = {
                    "id": make_step_id(section, f"cond.{gate_key.split('.')[-1]}.{chunk_idx}"),
                    "title": f"{gate_label[:50]} - Details" if len(dep_fields) <= MAX_FIELDS_PER_STEP
                             else f"{gate_label[:50]} - Details ({chunk_idx + 1}/{-(-len(dep_fields) // MAX_FIELDS_PER_STEP)})",
                    "guidance": trigger_text or "Provide the details requested.",
                    "fieldKeys": chunk_keys,
                    "gateFieldKey": gate_key,
                    "isConditionalBlock": True,
                    "sourcePages": section_pages[:3],
                }
                if pdf_inst:
                    cond_step["pdfInstruction"] = pdf_inst

                steps.append(cond_step)
                for k in chunk_keys:
                    processed_keys.add(k)

    # 2. Generate steps for non-repeat, non-gate fields
    #
    # Entry-0 fields that depend on a gate now have dependsOn/showWhen in the
    # registry, so they are handled as conditional blocks in step 1 above.
    remaining = [f for f in non_repeat_fields if f["semanticKey"] not in processed_keys]

    if remaining:
        for chunk_idx, chunk in enumerate(chunk_list(remaining, MAX_FIELDS_PER_STEP)):
            chunk_keys = [f["semanticKey"] for f in chunk]
            pdf_inst = find_pdf_instruction(analysis, chunk_keys, section)

            title = section_title
            if len(remaining) > MAX_FIELDS_PER_STEP:
                total_chunks = -(-len(remaining) // MAX_FIELDS_PER_STEP)
                title = f"{section_title} ({chunk_idx + 1}/{total_chunks})"

            step = {
                "id": make_step_id(section, f"main.{chunk_idx}" if chunk_idx > 0 else "main"),
                "title": title,
                "guidance": get_section_guidance(section, analysis),
                "fieldKeys": chunk_keys,
                "sourcePages": section_pages[:3],
            }
            if pdf_inst:
                step["pdfInstruction"] = pdf_inst

            steps.append(step)

    # 3. Generate steps for repeat groups
    for rg_name, indices_dict in sorted(repeat_groups.items()):
        for ri, rg_fields in sorted(indices_dict.items()):
            # Separate gate fields within repeat group
            rg_gate_keys = gate_fields & {f["semanticKey"] for f in rg_fields}
            rg_processed: set[str] = set()

            for gate_key in sorted(rg_gate_keys):
                gate_field = next((f for f in rg_fields if f["semanticKey"] == gate_key), None)
                if not gate_field:
                    continue

                gate_label = gate_field.get("label", "")
                cond_inst = find_conditional_instruction(analysis, gate_key, section)

                gate_step = {
                    "id": make_step_id(section, f"{rg_name}-{ri}.gate.{gate_key.split('.')[-1]}"),
                    "title": gate_label if len(gate_label) < 80 else gate_label[:77] + "...",
                    "guidance": f"Answer this question to continue.",
                    "fieldKeys": [gate_key],
                    "gateFieldKey": gate_key,
                    "repeatGroup": rg_name,
                    "repeatIndex": ri,
                    "sourcePages": section_pages[:3],
                }
                if cond_inst:
                    gate_step["conditionalInstruction"] = cond_inst

                # Extract skip routing from option text
                rg_value_map = gate_field.get("valueMap", {})
                for opt in gate_field.get("options", []):
                    rm = re.search(
                        r'(?:proceed|skip|go)\s+to\s+(?:Section|Item)\s+(\d+[A-E]?)',
                        opt, re.IGNORECASE,
                    )
                    if rm:
                        stored_val = rg_value_map.get(opt, opt)
                        gate_step["skipToSection"] = f"section{rm.group(1)}"
                        gate_step["skipOnValue"] = stored_val
                        break

                steps.append(gate_step)
                rg_processed.add(gate_key)

                # Conditional entries in repeat group
                dep_keys = gate_index.get(gate_key, [])
                dep_fields_rg = [
                    f for f in rg_fields
                    if f["semanticKey"] in dep_keys
                ]
                for ci, chunk in enumerate(chunk_list(dep_fields_rg, MAX_FIELDS_PER_STEP)):
                    chunk_keys = [f["semanticKey"] for f in chunk]
                    cond_step = {
                        "id": make_step_id(section, f"{rg_name}-{ri}.cond.{gate_key.split('.')[-1]}.{ci}"),
                        "title": f"{gate_label[:50]} - Details",
                        "guidance": "Provide the details requested.",
                        "fieldKeys": chunk_keys,
                        "gateFieldKey": gate_key,
                        "isConditionalBlock": True,
                        "repeatGroup": rg_name,
                        "repeatIndex": ri,
                        "sourcePages": section_pages[:3],
                    }
                    steps.append(cond_step)
                    for k in chunk_keys:
                        rg_processed.add(k)

            # Non-gate fields in repeat group
            rg_remaining = [f for f in rg_fields if f["semanticKey"] not in rg_processed]
            for ci, chunk in enumerate(chunk_list(rg_remaining, MAX_FIELDS_PER_STEP)):
                chunk_keys = [f["semanticKey"] for f in chunk]
                pdf_inst = find_pdf_instruction(analysis, chunk_keys, section)

                rg_display = rg_name.replace("section", "").replace("_", " ").strip()
                entry_num = ri + 1
                total_chunks = -(-len(rg_remaining) // MAX_FIELDS_PER_STEP)
                title = f"Entry {entry_num}"
                if total_chunks > 1:
                    title = f"Entry {entry_num} ({ci + 1}/{total_chunks})"

                step = {
                    "id": make_step_id(section, f"{rg_name}-{ri}.{ci}"),
                    "title": title,
                    "guidance": get_section_guidance(section, analysis),
                    "fieldKeys": chunk_keys,
                    "repeatGroup": rg_name,
                    "repeatIndex": ri,
                    "sourcePages": section_pages[:3],
                }
                if pdf_inst:
                    step["pdfInstruction"] = pdf_inst

                steps.append(step)

    # Special: Section 30 certification
    if section == "section30":
        cert_text = get_certification_text(analysis)
        if cert_text:
            # Add certification instruction to first step
            if steps:
                steps[0]["pdfInstruction"] = cert_text

    return steps


def get_section_guidance(section: str, analysis: dict) -> str:
    """Generate guidance text for a section from analysis data."""
    info = analysis.get("sectionInstructions", {}).get(section, {})
    instructions = info.get("instructions", [])

    # Use first instruction block if available
    if instructions and len(instructions[0]) > 20:
        return instructions[0][:300]

    # Fallback to section title based guidance
    title = SECTION_TITLES.get(section, section)
    return f"Provide the information requested for {title}."


def chunk_list(items: list, size: int) -> list[list]:
    """Split a list into chunks of at most `size` items."""
    return [items[i:i + size] for i in range(0, len(items), size)] if items else []


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    print("=== Wizard Steps Generation ===\n")

    # Load data
    registry = load_json(REGISTRY_PATH)
    analysis = load_json(ANALYSIS_PATH)
    print(f"Registry: {len(registry)} fields")
    print(f"Analysis: {analysis['metadata']['totalPages']} pages analyzed")

    # Group fields by section, preserving page order
    fields_by_section: dict[str, list[dict]] = defaultdict(list)
    for f in registry:
        if f.get("section") == "ssnPageHeader":
            continue  # Skip SSN page headers
        fields_by_section[f["section"]].append(f)

    # Sort fields within each section by page, then y position
    for sec in fields_by_section:
        fields_by_section[sec].sort(
            key=lambda f: (f.get("pdfPage", 0), f.get("pdfRect", {}).get("y", 0))
        )

    # Build gate index
    gate_index = build_gate_index(registry)

    # Generate steps for each section
    wizard_data: dict[str, dict] = {}
    total_steps = 0
    total_fields = 0

    # Load linked-groups config for repeat-index remapping
    linked_groups_path = PROJECT_ROOT / "app/src/lib/wizard/linked-groups.json"
    linked_groups: dict[str, Any] = {}
    if linked_groups_path.exists():
        linked_groups = json.loads(linked_groups_path.read_text())

    for section in sorted(fields_by_section.keys()):
        section_fields = fields_by_section[section]
        steps = generate_section_steps(section, section_fields, analysis, gate_index)

        # Note: linked group sub-groups must share the same repeatIndex so that
        # getEntityEntries() can merge them into unified entity cards. Do NOT
        # remap indices — the registry's original indices are correct.

        total_steps += len(steps)
        total_fields += sum(len(s["fieldKeys"]) for s in steps)

        wizard_data[section] = {
            "sectionKey": section,
            "steps": steps,
        }

        print(f"  {section}: {len(steps)} steps, {len(section_fields)} fields")

    # Write output
    OUTPUT_PATH.write_text(json.dumps(wizard_data, indent=2))

    print(f"\n=== COMPLETE ===")
    print(f"Sections: {len(wizard_data)}")
    print(f"Steps:    {total_steps}")
    print(f"Fields covered: {total_fields}")
    print(f"Output:   {OUTPUT_PATH}")


if __name__ == "__main__":
    main()

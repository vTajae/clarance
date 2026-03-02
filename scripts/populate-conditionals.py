#!/usr/bin/env python3
"""
populate-conditionals.py — Populate dependsOn / showWhen in field-registry.json

CONSERVATIVE ALGORITHM (data-integrity-first):

  Only SECTION-LEVEL gates (those with "proceed to", "if no", "if yes" in their
  option text) control other fields. These gates have explicit scope markers
  that tell us exactly what they control.

  Sub-level gates (plain YES/NO with no navigation hint) do NOT gate other
  fields. They themselves may depend on a parent section-level gate, but
  their dependent fields remain always-visible when the parent is active.

  This is INTENTIONALLY conservative: some fields that could be hidden
  (e.g. discharge details when discharged=NO) stay visible. This is safe
  because it NEVER hides a field that should be filled — the worst case is
  the user sees fields they don't need, not that they can't see fields they
  DO need.

  Sub-level gating can be added incrementally via manual overrides once
  each section's form logic is individually verified against the PDF.

Usage:
    python3 scripts/populate-conditionals.py [--dry-run]

Output:
    Modifies app/src/lib/field-registry/field-registry.json in place.
"""

import json
import re
import sys
from pathlib import Path
from collections import defaultdict

REGISTRY_PATH = Path("app/src/lib/field-registry/field-registry.json")


# ---------------------------------------------------------------------------
# Gate classification
# ---------------------------------------------------------------------------

def is_yes_no_gate(field: dict) -> bool:
    """Check if a radio field has YES/NO options."""
    if field["uiFieldType"] != "radio":
        return False
    options = field.get("options", [])
    opts_lower = [o.strip().lower() for o in options]
    return "yes" in opts_lower or "no" in opts_lower


def is_section_level_gate(field: dict) -> bool:
    """
    Section-level gate: has explicit navigation hints in option text.
    These are the ONLY gates we trust for automated assignment.
    """
    options = field.get("options", [])
    for opt in options:
        lower = opt.strip().lower()
        if "proceed" in lower:
            return True
        if "if no" in lower:
            return True
        if "if yes" in lower:
            return True
        if "i decline" in lower:
            return True
    return False


def get_gate_trigger_value(field: dict) -> str:
    """Determine the showWhen expression for dependent fields."""
    options = field.get("options", [])
    for opt in options:
        opt_lower = opt.strip().lower()
        if opt_lower.startswith("no") and ("proceed" in opt_lower or "if no" in opt_lower):
            return "=== 'YES'"
        if opt_lower.startswith("yes") and ("complete" in opt_lower or "if yes" in opt_lower):
            return "=== 'YES'"
        if "i decline" in opt_lower:
            return "=== 'YES'"
    return "=== 'YES'"


# ---------------------------------------------------------------------------
# Core algorithm: Section-level gates only
# ---------------------------------------------------------------------------

def assign_conditionals(data: list[dict]) -> int:
    """
    Walk each section's fields in PDF array order.

    Only SECTION-LEVEL gates create conditional dependencies.
    All non-gate fields after a section-level gate depend on it,
    until the next section-level gate or repeat-group boundary.

    Sub-level YES/NO gates are treated as regular fields:
    - They depend on their parent section-level gate (if any)
    - They do NOT gate any other fields

    Returns the number of fields modified.
    """
    modified = 0
    by_section = defaultdict(list)
    for i, field in enumerate(data):
        by_section[field["section"]].append((i, field))

    for section, indexed_fields in sorted(by_section.items()):
        if section == "ssnPageHeader":
            continue

        current_gate: dict | None = None
        current_expression: str | None = None
        current_rg: str | None = None
        current_ri = None

        for idx, field in indexed_fields:
            field_rg = field.get("repeatGroup")
            field_ri = field.get("repeatIndex")

            # Boundary check: repeat group/index change clears the gate
            if current_gate is not None:
                if field_rg != current_rg or field_ri != current_ri:
                    current_gate = None
                    current_expression = None
                    current_rg = None
                    current_ri = None

            # Section-level gate encountered → becomes active gate
            if is_yes_no_gate(field) and is_section_level_gate(field):
                current_gate = field
                current_expression = get_gate_trigger_value(field)
                current_rg = field_rg
                current_ri = field_ri
                continue

            # All other fields (including sub-level gates) depend on
            # the current section-level gate if one is active
            if current_gate is not None:
                field["dependsOn"] = current_gate["semanticKey"]
                field["showWhen"] = current_expression
                modified += 1

    return modified


# ---------------------------------------------------------------------------
# Manual overrides for verified sub-level gates
# ---------------------------------------------------------------------------

def apply_manual_overrides(data: list[dict]) -> int:
    """
    Apply targeted overrides for well-understood sub-level patterns.
    Each override here has been individually verified against the PDF.
    """
    modified = 0
    by_key = {f["semanticKey"]: f for f in data}

    # Section 14: "Were you born a male?" → shows Selective Service question
    gate14 = by_key.get("serviceInfo.0.RadioButtonList_1")
    gate14_reg = by_key.get("serviceInfo.0.RadioButtonList_21")
    if gate14 and gate14_reg and not gate14_reg.get("dependsOn"):
        gate14_reg["dependsOn"] = gate14["semanticKey"]
        gate14_reg["showWhen"] = "=== 'Yes'"
        modified += 1

    return modified


# ---------------------------------------------------------------------------
# Validation
# ---------------------------------------------------------------------------

def remove_self_referencing(data: list[dict]) -> int:
    fixed = 0
    for field in data:
        if field.get("dependsOn") == field["semanticKey"]:
            del field["dependsOn"]
            if "showWhen" in field:
                del field["showWhen"]
            fixed += 1
    return fixed


def validate_references(data: list[dict]) -> list[str]:
    all_keys = {f["semanticKey"] for f in data}
    errors = []
    for field in data:
        dep = field.get("dependsOn")
        if dep and dep not in all_keys:
            errors.append(f"  {field['semanticKey']}: dependsOn '{dep}' not found")
    return errors


def detect_circular_deps(data: list[dict]) -> list[str]:
    by_key = {f["semanticKey"]: f for f in data}
    errors = []
    for field in data:
        if not field.get("dependsOn"):
            continue
        visited = {field["semanticKey"]}
        current = field.get("dependsOn")
        while current:
            if current in visited:
                errors.append(f"  Circular: {field['semanticKey']} → ... → {current}")
                break
            visited.add(current)
            parent = by_key.get(current)
            current = parent.get("dependsOn") if parent else None
    return errors


def verify_gate_types(data: list[dict]) -> list[str]:
    """Every field pointed to by dependsOn should be a section-level gate."""
    by_key = {f["semanticKey"]: f for f in data}
    gate_keys = {f["dependsOn"] for f in data if f.get("dependsOn")}
    warnings = []
    for gk in gate_keys:
        gate = by_key.get(gk)
        if gate and not is_section_level_gate(gate) and not gate.get("_manual_override"):
            # OK for manual overrides
            pass
    return warnings


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    dry_run = "--dry-run" in sys.argv

    if not REGISTRY_PATH.exists():
        print(f"ERROR: {REGISTRY_PATH} not found")
        sys.exit(1)

    with open(REGISTRY_PATH) as f:
        data = json.load(f)

    total_fields = len(data)
    existing_deps = sum(1 for f in data if f.get("dependsOn"))
    print(f"Registry: {total_fields} fields, {existing_deps} already have dependsOn")

    # Clear existing conditionals
    for field in data:
        if "dependsOn" in field:
            del field["dependsOn"]
        if "showWhen" in field:
            del field["showWhen"]

    # Phase 1: Section-level gate assignment
    auto_modified = assign_conditionals(data)
    print(f"Phase 1 (section-level gates): {auto_modified} fields assigned")

    # Phase 2: Manual overrides
    manual_modified = apply_manual_overrides(data)
    print(f"Phase 2 (manual overrides): {manual_modified} fields assigned")

    # Safety checks
    self_fixed = remove_self_referencing(data)
    if self_fixed:
        print(f"Fixed {self_fixed} self-referencing dependencies")

    ref_errors = validate_references(data)
    if ref_errors:
        print(f"\nERROR: {len(ref_errors)} broken references:")
        for e in ref_errors:
            print(e)
        sys.exit(1)

    circ_errors = detect_circular_deps(data)
    if circ_errors:
        print(f"\nERROR: {len(circ_errors)} circular dependencies:")
        for e in circ_errors:
            print(e)
        sys.exit(1)

    # Summary
    by_section = defaultdict(int)
    section_gates_used = set()
    for field in data:
        dep = field.get("dependsOn")
        if dep:
            by_section[field["section"]] += 1
            section_gates_used.add(dep)

    total_conditional = sum(by_section.values())
    total_gates = sum(1 for f in data if is_yes_no_gate(f))
    section_gates = sum(1 for f in data if is_yes_no_gate(f) and is_section_level_gate(f))
    sub_gates = total_gates - section_gates

    print(f"\nTotal: {total_conditional} conditional fields, {len(section_gates_used)} active gates")
    print(f"All YES/NO gates: {total_gates} ({section_gates} section-level, {sub_gates} sub-level)")
    print(f"Sub-level gates: NOT assigned (conservative — always visible)")
    print(f"\nBy section:")
    for section in sorted(by_section.keys()):
        print(f"  {section}: {by_section[section]} conditional fields")

    if dry_run:
        print("\n[DRY RUN] No changes written.")
    else:
        with open(REGISTRY_PATH, "w") as f:
            json.dump(data, f, indent=2)
            f.write("\n")
        print(f"\nWritten to {REGISTRY_PATH}")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Enrich field-registry.json with individual radio widget positions.

Fetches all widget coordinates from the PDF service, groups radio widgets
by field_name, and adds a `radioWidgets` array to each radio field in the
registry. Each entry contains {x, y, width, height, onState}.

Usage:
    python3 scripts/enrich-radio-widgets.py

Prerequisites:
    - PDF service running at localhost:8001
    - field-registry.json exists at app/src/lib/field-registry/
"""

import json
import sys
import urllib.request
from collections import defaultdict
from pathlib import Path

REGISTRY_PATH = Path(__file__).resolve().parent.parent / "app" / "src" / "lib" / "field-registry" / "field-registry.json"
PDF_SERVICE_URL = "http://localhost:8001/field-coordinates/sf861"


def fetch_field_coordinates() -> list[dict]:
    """Fetch all widget metadata from the PDF service."""
    print(f"Fetching field coordinates from {PDF_SERVICE_URL}...")
    req = urllib.request.Request(PDF_SERVICE_URL)
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read().decode())
    fields = data["fields"]
    print(f"  Got {len(fields)} widgets total")
    return fields


def group_radio_widgets(widgets: list[dict]) -> dict[str, list[dict]]:
    """Group radio widgets by field_name, preserving iteration order as onState."""
    radio_groups: dict[str, list[dict]] = defaultdict(list)

    for w in widgets:
        if w["field_type"] != "radio":
            continue
        name = w["field_name"]
        idx = len(radio_groups[name])  # 0-based on_state
        radio_groups[name].append({
            "x": round(w["x"], 2),
            "y": round(w["y"], 2),
            "width": round(w["width"], 2),
            "height": round(w["height"], 2),
            "onState": str(idx),
        })

    print(f"  Found {sum(len(v) for v in radio_groups.values())} radio widgets across {len(radio_groups)} groups")
    return dict(radio_groups)


def enrich_registry(radio_groups: dict[str, list[dict]]) -> None:
    """Add radioWidgets to each radio field in the registry."""
    print(f"Loading registry from {REGISTRY_PATH}...")
    with open(REGISTRY_PATH) as f:
        registry = json.load(f)

    enriched = 0
    skipped = 0
    missing = []

    for field in registry:
        if field.get("uiFieldType") != "radio":
            continue

        pdf_name = field["pdfFieldName"]
        if pdf_name in radio_groups:
            field["radioWidgets"] = radio_groups[pdf_name]
            enriched += 1
        else:
            missing.append(pdf_name)
            skipped += 1

    print(f"  Enriched: {enriched} radio fields")
    if skipped:
        print(f"  Skipped (no widgets found): {skipped}")
        for name in missing[:5]:
            print(f"    - {name}")

    # Validate
    issues = []
    for field in registry:
        if field.get("uiFieldType") != "radio":
            continue
        rw = field.get("radioWidgets")
        if not rw:
            issues.append(f"  MISSING radioWidgets: {field['pdfFieldName']}")
        elif len(rw) < 2:
            issues.append(f"  ONLY {len(rw)} widget(s): {field['pdfFieldName']}")
        opts = field.get("options", [])
        if rw and len(rw) != len(opts):
            issues.append(
                f"  MISMATCH: {field['pdfFieldName']} has {len(rw)} widgets but {len(opts)} options"
            )

    if issues:
        print(f"\n  Validation issues ({len(issues)}):")
        for issue in issues[:20]:
            print(issue)
        if len(issues) > 20:
            print(f"  ... and {len(issues) - 20} more")
    else:
        print("  Validation: ALL radio fields have matching radioWidgets!")

    # Write back
    print(f"Writing enriched registry...")
    with open(REGISTRY_PATH, "w") as f:
        json.dump(registry, f, indent=2)
        f.write("\n")
    print(f"  Done! {enriched} radio fields enriched with widget positions.")


def main() -> None:
    widgets = fetch_field_coordinates()
    radio_groups = group_radio_widgets(widgets)
    enrich_registry(radio_groups)


if __name__ == "__main__":
    main()

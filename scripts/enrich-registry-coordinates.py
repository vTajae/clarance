#!/usr/bin/env python3
"""Enrich field-registry.json with pdfRect coordinates from the PDF service.

Fetches field coordinates from GET /field-coordinates/sf861, matches each
registry entry by pdfFieldName, and writes the bounding rectangle back as
pdfRect: {x, y, width, height}.

Usage:
    python3 scripts/enrich-registry-coordinates.py

Requires: PDF service running at http://localhost:8001
"""

from __future__ import annotations

import json
import sys
import urllib.request
from pathlib import Path

PDF_SERVICE = "http://localhost:8001"
REGISTRY_PATH = Path(__file__).resolve().parent.parent / "app" / "src" / "lib" / "field-registry" / "field-registry.json"


def main() -> None:
    # 1. Fetch all field coordinates from the PDF service
    print(f"Fetching field coordinates from {PDF_SERVICE}/field-coordinates/sf861 ...")
    url = f"{PDF_SERVICE}/field-coordinates/sf861"
    with urllib.request.urlopen(url, timeout=30) as resp:
        data = json.loads(resp.read().decode())

    widgets = data["fields"]
    print(f"  Got {len(widgets)} widgets from PDF service")

    # 2. Build lookup: field_name → first widget's coordinates
    #    For radio groups, multiple widgets share the same field_name.
    #    We use the first one (smallest page / y position) as the representative.
    coord_lookup: dict[str, dict] = {}
    for w in widgets:
        name = w["field_name"]
        if name not in coord_lookup:
            coord_lookup[name] = {
                "x": round(w["x"], 2),
                "y": round(w["y"], 2),
                "width": round(w["width"], 2),
                "height": round(w["height"], 2),
            }

    print(f"  Built lookup for {len(coord_lookup)} unique field names")

    # 3. Load registry
    print(f"Loading registry from {REGISTRY_PATH} ...")
    with open(REGISTRY_PATH, "r") as f:
        registry = json.load(f)

    print(f"  Registry has {len(registry)} entries")

    # 4. Match and enrich
    matched = 0
    unmatched = []
    for entry in registry:
        pdf_name = entry["pdfFieldName"]
        if pdf_name in coord_lookup:
            entry["pdfRect"] = coord_lookup[pdf_name]
            matched += 1
        else:
            unmatched.append(pdf_name)

    print(f"\nResults:")
    print(f"  Matched:   {matched}/{len(registry)}")
    print(f"  Unmatched: {len(unmatched)}/{len(registry)}")

    if unmatched:
        print(f"\n  First 10 unmatched:")
        for name in unmatched[:10]:
            print(f"    - {name}")

    if matched == 0:
        print("\nERROR: No matches found. Aborting.")
        sys.exit(1)

    # 5. Write back
    print(f"\nWriting enriched registry back to {REGISTRY_PATH} ...")
    with open(REGISTRY_PATH, "w") as f:
        json.dump(registry, f, indent=2)
        f.write("\n")

    print(f"Done! {matched}/{len(registry)} fields now have pdfRect.")


if __name__ == "__main__":
    main()

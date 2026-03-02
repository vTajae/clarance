#!/usr/bin/env python3
"""
Fix radio button labels by finding the associated question text on the PDF.

Radio buttons in the SF-86 are typically YES/NO answers to questions.
The question text is printed above the radio group, often 20-100 points
away vertically. This script:

1. For each radio button with a generic/missing label
2. Searches UPWARD from the field for question text
3. Identifies text that looks like a question (ends with ?, starts with interrogative)
4. Falls back to the nearest instruction/paragraph text above

Run inside the PDF service container:
  docker exec sf86-pdf-service python3 /app/scripts/fix-radio-labels.py
"""

from __future__ import annotations

import json
import math
import re
import sys
import time
from pathlib import Path
from typing import Any

try:
    import fitz
except ImportError:
    print("ERROR: PyMuPDF not installed. Run inside Docker container.")
    sys.exit(1)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

# How far above the radio button to search (in PDF points)
SEARCH_ABOVE_DISTANCE = 150  # ~2 inches

# Question-starting words
QUESTION_STARTERS = [
    'do you', 'have you', 'are you', 'were you', 'will you', 'did you',
    'is there', 'are there', 'was there', 'has anyone', 'have any',
    'does the', 'does this', 'does your', 'has the', 'has your',
    'provide', 'complete', 'select', 'indicate', 'enter',
    'is your', 'is this', 'was your', 'was this',
]

# ---------------------------------------------------------------------------
# Label finding
# ---------------------------------------------------------------------------

def find_question_for_radio(
    doc: fitz.Document,
    page_num: int,  # 0-based
    field_rect: dict[str, float],
    field_name: str,
) -> tuple[str, float]:
    """Find the question text that a radio button answers.

    Returns (question_text, confidence).
    """
    page = doc[page_num]
    page_dict = page.get_text("dict")

    fx = field_rect["x"]
    fy = field_rect["y"]
    fw = field_rect["width"]
    fh = field_rect["height"]

    # Collect all text lines above and to the left of the radio button
    candidates = []

    for block in page_dict.get("blocks", []):
        if block.get("type") != 0:
            continue
        for line in block.get("lines", []):
            bbox = line.get("bbox", (0, 0, 0, 0))
            bx0, by0, bx1, by1 = bbox

            # Skip text that's below the field
            if by0 > fy + fh + 5:
                continue

            # Only look above (up to SEARCH_ABOVE_DISTANCE)
            vertical_dist = fy - by1  # Positive = above
            if vertical_dist < -5:
                continue
            if vertical_dist > SEARCH_ABOVE_DISTANCE:
                continue

            # Get the text
            spans = line.get("spans", [])
            text = " ".join(s.get("text", "") for s in spans).strip()
            if not text or len(text) < 3:
                continue

            # Skip YES/NO/option text
            if text.upper() in ("YES", "NO", "ON", "OFF", "OTHER"):
                continue

            # Score this candidate
            score = 0.0

            # Prefer question-like text
            text_lower = text.lower()
            is_question = (
                "?" in text
                or any(text_lower.startswith(q) for q in QUESTION_STARTERS)
            )
            if is_question:
                score += 5.0

            # Prefer text that's directly above (within horizontal bounds)
            horizontal_overlap = min(bx1, fx + fw) - max(bx0, fx)
            if horizontal_overlap > 0:
                score += 2.0

            # Prefer closer text
            distance = math.sqrt(max(vertical_dist, 0) ** 2 + max(bx0 - fx, 0) ** 2)
            score += 10.0 / (distance + 1)

            # Prefer longer text (likely instructions, not single words)
            if len(text) > 30:
                score += 1.0
            if len(text) > 60:
                score += 0.5

            # Prefer text that starts with a letter (not parenthetical)
            if text[0].isalpha() and text[0].isupper():
                score += 0.5

            candidates.append((score, text, distance))

    if not candidates:
        return "", 0.0

    # Sort by score descending
    candidates.sort(key=lambda x: -x[0])
    best_score, best_text, best_dist = candidates[0]

    # Clean up the text
    best_text = best_text.strip()
    if len(best_text) > 120:
        best_text = best_text[:117] + "..."

    # Confidence based on score
    confidence = min(best_score / 10.0, 1.0)

    return best_text, confidence


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    import argparse

    parser = argparse.ArgumentParser(description="Fix radio button labels in field registry")
    parser.add_argument("--pdf", default="/app/templates/sf861.pdf")
    parser.add_argument("--registry", default="/app/field-registry.json")
    parser.add_argument("--output", default="/app/output/radio-label-fixes.json")
    parser.add_argument("--apply", action="store_true", help="Apply fixes to registry in-place")

    args = parser.parse_args()

    print("\n=== Fix Radio Button Labels ===\n")

    # Load registry
    registry = json.loads(Path(args.registry).read_text())
    print(f"Registry: {len(registry)} fields")

    # Find radio buttons with generic labels
    generic_radios = [
        f for f in registry
        if f.get("pdfFieldType") == "PDFRadioGroup"
        and f.get("label", "").lower().strip() in ("radiobuttonlist", "checkbox", "unknown", "")
        and f.get("pdfRect")
    ]
    print(f"Radio buttons with generic labels: {len(generic_radios)}")

    if not generic_radios:
        print("Nothing to fix!")
        return

    doc = fitz.open(args.pdf)
    fixes = []
    failed = 0

    for i, field in enumerate(generic_radios):
        page_0 = field.get("pdfPage", 1) - 1
        if page_0 < 0:
            page_0 = 0

        question, confidence = find_question_for_radio(
            doc, page_0, field["pdfRect"], field["pdfFieldName"],
        )

        if question and confidence >= 0.3:
            fixes.append({
                "pdfFieldName": field["pdfFieldName"],
                "section": field["section"],
                "page": field.get("pdfPage", 0),
                "currentLabel": field["label"],
                "newLabel": question,
                "confidence": round(confidence, 3),
            })
        else:
            failed += 1

        if (i + 1) % 50 == 0:
            print(f"  [{i + 1}/{len(generic_radios)}] {len(fixes)} fixed, {failed} unfixed")

    doc.close()

    print(f"\nResults:")
    print(f"  Fixed: {len(fixes)}")
    print(f"  Unfixed: {failed}")

    # Save fixes
    output = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "total_generic_radios": len(generic_radios),
        "fixes_found": len(fixes),
        "unfixed": failed,
        "fixes": fixes,
    }
    Path(args.output).parent.mkdir(parents=True, exist_ok=True)
    Path(args.output).write_text(json.dumps(output, indent=2))
    print(f"Fixes saved to: {args.output}")

    # Show samples
    print(f"\n--- Sample Fixes ---")
    for f in fixes[:15]:
        print(f"  {f['pdfFieldName'][:50]}")
        print(f"    → {f['newLabel'][:80]}")
        print(f"    conf: {f['confidence']}")

    # Apply if requested
    if args.apply:
        reg_map = {f["pdfFieldName"]: f for f in registry}
        applied = 0
        for fix in fixes:
            field = reg_map.get(fix["pdfFieldName"])
            if field:
                field["label"] = fix["newLabel"]
                if field.get("classificationConfidence", 0) < 0.6:
                    field["classificationConfidence"] = 0.6
                applied += 1
        Path(args.registry).write_text(json.dumps(registry, indent=2))
        print(f"\nApplied {applied} fixes to {args.registry}")


if __name__ == "__main__":
    main()

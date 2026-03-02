#!/usr/bin/env python3
"""
Apply label corrections to field-registry.json based on text-proximity results.

Reads the text-proximity verification report and applies corrections in tiers:

Tier 1 (Auto-apply): Formatting-only fixes ("A P O" → "APO")
Tier 2 (Auto-apply): Generic labels → meaningful nearest text
Tier 3 (Auto-apply): Wrong labels where nearest text is clearly better
Tier 4 (Review file): Uncertain corrections for manual review

Also handles radio button labels specially: looks for question text above
the radio group rather than the YES/NO option text.

Usage:
  # Run inside Docker container (needs pymupdf for radio button fixup):
  docker exec sf86-pdf-service python3 /app/scripts/apply-label-corrections.py

  # Or locally (no pymupdf needed for basic corrections):
  python3 scripts/apply-label-corrections.py \
    --report scripts/text-proximity-all.json \
    --registry app/src/lib/field-registry/field-registry.json \
    --output app/src/lib/field-registry/field-registry.json \
    --review scripts/corrections-for-review.json
"""

from __future__ import annotations

import json
import re
import sys
import time
from pathlib import Path
from typing import Any

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def normalize(text: str) -> str:
    """Normalize for comparison (lowercase, strip punctuation/spaces)."""
    text = text.lower().strip()
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r"[^a-z0-9'\s]", ' ', text)
    return re.sub(r'\s+', ' ', text).strip()


def is_formatting_only(current: str, suggested: str) -> bool:
    """Check if the difference is just formatting (spaces, slashes, dashes)."""
    c = current.replace(' ', '').replace('/', '').replace('-', '').lower()
    s = suggested.replace(' ', '').replace('/', '').replace('-', '').lower()
    return c == s and c != ''


def is_generic_label(label: str) -> bool:
    """Check if a label is a generic/placeholder name."""
    generic = {
        'radiobuttonlist', 'checkbox', 'unknown', '', 'textfield',
        'dropdownlist', 'combobox', 'listbox',
    }
    return label.lower().strip() in generic


def is_good_suggestion(suggested: str) -> bool:
    """Check if a suggested label looks like a meaningful form label."""
    if not suggested or len(suggested) < 3:
        return False
    # Reject if it's just YES/NO/ON/OFF
    if suggested.upper() in ('YES', 'NO', 'ON', 'OFF', 'TRUE', 'FALSE'):
        return False
    # Reject if it starts with a digit or paren (fragment)
    if suggested[0].isdigit() or suggested.startswith('('):
        return False
    # Reject very short fragments
    if len(suggested) < 5 and not suggested[0].isupper():
        return False
    return True


def clean_suggested_label(text: str) -> str:
    """Clean up a suggested label for use in the registry."""
    # Remove leading/trailing whitespace and newlines
    text = text.strip()
    # Take first meaningful line if multi-line
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    if lines:
        text = lines[0]
    # Remove trailing parenthetical fragments
    # e.g. "Other  (Provide explanation and complete" → "Other (Provide explanation)"
    # But keep complete parentheticals
    if text.count('(') > text.count(')'):
        # Incomplete paren - truncate at the open paren
        paren_idx = text.rfind('(')
        text = text[:paren_idx].strip()
    # Cap length at 100 chars for readability
    if len(text) > 100:
        text = text[:97] + '...'
    return text

# ---------------------------------------------------------------------------
# Radio button special handling
# ---------------------------------------------------------------------------

def find_radio_question_text(
    correction: dict[str, Any],
    all_corrections: list[dict[str, Any]],
    all_results: list[dict[str, Any]],
) -> str | None:
    """For radio buttons, find the question text above the radio group.

    Radio buttons have YES/NO as nearest text, but the actual label is
    the question text printed above the group.
    """
    page = correction.get('page', 0)
    candidates = correction.get('candidates', [])

    # Look for candidate text that:
    # 1. Is from the "above" direction
    # 2. Contains a question (ends with ?)
    # 3. Or starts with "Do you", "Have you", "Are you", etc.
    # 4. Or is longer than 20 chars (likely a question/instruction)

    question_starters = [
        'do you', 'have you', 'are you', 'were you', 'will you',
        'did you', 'is there', 'are there', 'provide', 'select',
        'indicate', 'complete', 'enter',
    ]

    for c in candidates:
        text = c.get('text', '').strip()
        direction = c.get('direction', '')

        # Skip YES/NO/option values
        if text.upper() in ('YES', 'NO', 'ON', 'OFF'):
            continue

        # Check if it looks like a question/instruction
        text_lower = text.lower()
        is_question = (
            '?' in text
            or any(text_lower.startswith(q) for q in question_starters)
            or (len(text) > 25 and direction in ('above', 'above_left', 'left'))
        )

        if is_question:
            return clean_suggested_label(text)

    return None

# ---------------------------------------------------------------------------
# Main correction logic
# ---------------------------------------------------------------------------

def categorize_corrections(
    report: dict[str, Any],
) -> dict[str, list[dict[str, Any]]]:
    """Categorize corrections into tiers."""
    corrections = report.get('corrections', [])

    tiers = {
        'tier1_formatting': [],   # Safe: formatting only
        'tier2_generic': [],      # Safe: generic → meaningful label
        'tier3_wrong': [],        # Safe: clearly wrong label
        'tier4_review': [],       # Needs manual review
    }

    for c in corrections:
        current = c['currentLabel']
        suggested = c['suggestedLabel']
        nearest = c['nearestText']

        if is_formatting_only(current, suggested):
            c['_corrected_label'] = clean_suggested_label(suggested)
            tiers['tier1_formatting'].append(c)

        elif is_generic_label(current):
            if is_good_suggestion(suggested):
                c['_corrected_label'] = clean_suggested_label(suggested)
                tiers['tier2_generic'].append(c)
            else:
                # Try to find a better label from candidates
                better = find_radio_question_text(c, corrections, [])
                if better and is_good_suggestion(better):
                    c['_corrected_label'] = better
                    tiers['tier2_generic'].append(c)
                else:
                    tiers['tier4_review'].append(c)

        elif c['similarity'] == 0.0 and is_good_suggestion(nearest):
            # Zero similarity with good nearest text → clearly wrong
            c['_corrected_label'] = clean_suggested_label(nearest)
            tiers['tier3_wrong'].append(c)

        elif c['similarity'] < 0.2 and is_good_suggestion(nearest):
            # Very low similarity with good nearest text → likely wrong
            c['_corrected_label'] = clean_suggested_label(nearest)
            tiers['tier3_wrong'].append(c)

        else:
            tiers['tier4_review'].append(c)

    return tiers


def apply_corrections(
    registry: list[dict[str, Any]],
    tiers: dict[str, list[dict[str, Any]]],
    apply_tiers: list[str],
) -> tuple[list[dict[str, Any]], int]:
    """Apply corrections to the registry.

    Returns (updated_registry, num_applied).
    """
    # Build lookup by pdfFieldName
    corrections_map: dict[str, str] = {}
    for tier_name in apply_tiers:
        for c in tiers.get(tier_name, []):
            label = c.get('_corrected_label', '')
            if label:
                corrections_map[c['pdfFieldName']] = label

    applied = 0
    for field in registry:
        fname = field['pdfFieldName']
        if fname in corrections_map:
            old_label = field.get('label', '')
            new_label = corrections_map[fname]
            if old_label != new_label:
                field['label'] = new_label
                # Boost confidence since we've now verified the label
                if field.get('classificationConfidence', 0) < 0.7:
                    field['classificationConfidence'] = 0.7
                applied += 1

    return registry, applied


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    import argparse

    parser = argparse.ArgumentParser(description="Apply label corrections to field registry")
    parser.add_argument(
        "--report", default="scripts/text-proximity-all.json",
        help="Path to text-proximity verification report",
    )
    parser.add_argument(
        "--registry", default="app/src/lib/field-registry/field-registry.json",
        help="Path to field-registry.json",
    )
    parser.add_argument(
        "--output", default=None,
        help="Output path for corrected registry (default: same as --registry)",
    )
    parser.add_argument(
        "--review", default="scripts/corrections-for-review.json",
        help="Output path for corrections needing manual review",
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Don't write changes, just show what would be applied",
    )
    parser.add_argument(
        "--tiers", default="1,2,3",
        help="Comma-separated tier numbers to auto-apply (default: 1,2,3)",
    )

    args = parser.parse_args()
    output_path = args.output or args.registry

    print(f"\n=== Apply Label Corrections ===\n")

    # Load report
    report = json.loads(Path(args.report).read_text())
    corrections = report.get('corrections', [])
    print(f"Report: {len(corrections)} corrections from text-proximity verification")

    # Categorize
    tiers = categorize_corrections(report)
    for name, items in tiers.items():
        print(f"  {name}: {len(items)}")

    # Determine which tiers to apply
    apply_tier_nums = [int(t.strip()) for t in args.tiers.split(',')]
    tier_names = {
        1: 'tier1_formatting',
        2: 'tier2_generic',
        3: 'tier3_wrong',
        4: 'tier4_review',
    }
    apply_tiers = [tier_names[n] for n in apply_tier_nums if n in tier_names]
    print(f"\nApplying tiers: {apply_tiers}")

    total_to_apply = sum(len(tiers.get(t, [])) for t in apply_tiers)
    print(f"Total corrections to apply: {total_to_apply}")

    if args.dry_run:
        print("\n--- DRY RUN ---")
        for tier_name in apply_tiers:
            print(f"\n{tier_name}:")
            for c in tiers.get(tier_name, [])[:10]:
                print(f"  {c['pdfFieldName'][:50]}")
                print(f"    {c['currentLabel'][:60]}")
                print(f"    → {c.get('_corrected_label', '?')[:60]}")
            remaining = len(tiers.get(tier_name, [])) - 10
            if remaining > 0:
                print(f"  ... and {remaining} more")
        print("\nNo changes written (--dry-run)")
        return

    # Load registry
    registry = json.loads(Path(args.registry).read_text())
    print(f"\nLoaded registry: {len(registry)} fields")

    # Apply corrections
    registry, applied = apply_corrections(registry, tiers, apply_tiers)
    print(f"Applied: {applied} corrections")

    # Save updated registry
    Path(output_path).write_text(json.dumps(registry, indent=2))
    print(f"Saved to: {output_path}")

    # Save review file
    review_items = tiers.get('tier4_review', [])
    if review_items:
        review_output = {
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "count": len(review_items),
            "description": "Corrections that need manual review before applying",
            "items": [
                {
                    "pdfFieldName": c['pdfFieldName'],
                    "semanticKey": c['semanticKey'],
                    "section": c['section'],
                    "page": c['page'],
                    "currentLabel": c['currentLabel'],
                    "suggestedLabel": c['suggestedLabel'],
                    "nearestText": c['nearestText'],
                    "similarity": c['similarity'],
                    "confidence": c['confidence'],
                    "candidates": c.get('candidates', []),
                }
                for c in review_items
            ],
        }
        Path(args.review).write_text(json.dumps(review_output, indent=2))
        print(f"Review file: {args.review} ({len(review_items)} items)")

    # Summary
    print(f"\n=== Summary ===")
    print(f"Registry fields: {len(registry)}")
    print(f"Corrections applied: {applied}")
    print(f"Corrections for review: {len(review_items)}")


if __name__ == "__main__":
    main()

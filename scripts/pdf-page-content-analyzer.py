#!/usr/bin/env python3
"""
Enhanced PDF Page Content Analyzer (v2)
=========================================

Extracts structured content from the SF-86 PDF with:
- Numbered questions (e.g., "5.1", "13A.1") including standalone numbers
- Routing instructions ("If NO, proceed to Section 6")
- Lookback period detection ("last 10 years", "EVER")
- Entry boundaries with field mapping and visual grouping detection
- Horizontal rule / separator detection for entry boundaries
- Conditional instruction linking (gate field -> gated fields)
- Section structure specs for wizard generation

Usage (inside Docker container):
  docker exec sf86-pdf-service python3 /app/scripts/pdf-page-content-analyzer.py \
    --pdf /app/templates/sf861.pdf \
    --registry /app/field-registry.json \
    --output /app/page-content-analysis.json

Or copy files in:
  docker cp scripts/pdf-page-content-analyzer.py sf86-pdf-service:/app/scripts/
  docker cp app/src/lib/field-registry/field-registry.json sf86-pdf-service:/app/field-registry.json
  docker exec sf86-pdf-service python3 /app/scripts/pdf-page-content-analyzer.py
"""

from __future__ import annotations

import json
import re
import sys
import time
from collections import defaultdict
from dataclasses import dataclass, field as dc_field
from pathlib import Path
from typing import Any

try:
    import fitz
except ImportError:
    print("ERROR: PyMuPDF (fitz) not installed. Run inside the PDF service container.")
    sys.exit(1)


# ---------------------------------------------------------------------------
# Patterns
# ---------------------------------------------------------------------------

# Question number with text: "9.1 Complete the following...", "13A.1 Complete..."
# Handles separator dash, period, colon, en-dash, em-dash, or just whitespace
QUESTION_NUMBER_RE = re.compile(
    r'^(\d+[A-E]?\.\d+)\s*[.\-\u2013\u2014:]*\s+(.+)',
    re.IGNORECASE,
)

# Standalone question number on its own line: "17.3", "20A.1", "22.1"
STANDALONE_QUESTION_RE = re.compile(
    r'^(\d+[A-E]?\.\d+)\s*$',
)

# Simple question number without dot: "5 Provide your other names..."
# Only match if the number is <= 3 digits and followed by substantial text
SIMPLE_QUESTION_RE = re.compile(
    r'^(\d{1,2}[A-E]?)\s+([A-Z][a-z].{10,})',
)

# Routing instruction: "If NO, proceed to Section 6" or "proceed to 20A.2"
ROUTING_RE = re.compile(
    r'\b[Ii]f\s+'
    r'(YES|NO|you\s+(?:responded|answered)\s+(?:\'?Yes\'?|\'?No\'?)|'
    r'(?:Not\s+Applicable|N/?A|I\s+decline))'
    r'[,\s]+(?:then\s+)?'
    r'(?:proceed|skip|go|continue)\s+to\s+'
    r'(?:(?:Section|Item|Part)\s+)?(\d+[A-E]?(?:\.\d+)?)',
    re.IGNORECASE,
)

# "Complete the following if you responded 'Yes'"
COMPLETE_IF_RE = re.compile(
    r'[Cc]omplete\s+(?:the\s+)?following\s+if\s+you\s+(?:responded|answered)\s+'
    r"['\"]?(Yes|No)['\"]?",
    re.IGNORECASE,
)

# Entry boundary: "Entry #1", "Item 1", field index pattern
ENTRY_RE = re.compile(r'\b(?:Entry|Item)\s+#?(\d+)', re.IGNORECASE)

# Section header
SECTION_HEADER_RE = re.compile(
    r'^Section\s+(\d+[A-E]?)\s*[-\u2013\u2014:]\s*(.+)',
    re.IGNORECASE,
)

# "If NO/YES" inline in option text — also handles "proceed to 20A.2" (sub-question targets)
OPTION_ROUTING_RE = re.compile(
    r'\(If\s+(YES|NO|Not\s+Applicable|I\s+decline)[,\s]+'
    r'(?:proceed|skip|go)\s+to\s+(?:(?:Section|Item)\s+)?(\d+[A-E]?(?:\.\d+)?)\)',
    re.IGNORECASE,
)

# Lookback period: "last 10 years", "last seven (7) years", "last ten (10) years"
LOOKBACK_YEARS_RE = re.compile(
    r'\b(?:last|past)\s+(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s*'
    r'(?:\(\d+\))?\s*years?\b',
    re.IGNORECASE,
)

# "EVER" (all caps, standalone word) in questions
EVER_RE = re.compile(r'\bEVER\b')

# Word-to-number mapping for lookback
WORD_TO_NUM = {
    "one": 1, "two": 2, "three": 3, "four": 4, "five": 5,
    "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10,
}

# Numbered list items: "1.", "2.", "(a)", "(b)", "#1", "#2"
NUMBERED_LIST_RE = re.compile(r'^(?:\(?\d+[.)]\s|\(?[a-z][.)]\s|#\d+\s)', re.IGNORECASE)


# ---------------------------------------------------------------------------
# Data structures
# ---------------------------------------------------------------------------

@dataclass
class TextSpan:
    x0: float
    y0: float
    x1: float
    y1: float
    text: str
    font_size: float = 0.0
    is_bold: bool = False


@dataclass
class PageQuestion:
    """A numbered question extracted from a PDF page."""
    number: str  # e.g. "5.1"
    text: str
    y_position: float
    field_keys: list[str] = dc_field(default_factory=list)
    routing: dict[str, str] = dc_field(default_factory=dict)  # {"NO": "section6"}
    complete_if: str = ""  # "YES" or "NO"


@dataclass
class PageEntry:
    """An entry boundary on a PDF page."""
    index: int
    y_start: float
    y_end: float
    field_keys: list[str] = dc_field(default_factory=list)


@dataclass
class PageInstruction:
    """An instruction text block on a PDF page."""
    text: str
    y: float
    instruction_type: str  # "routing", "complete_if", "general"
    trigger_value: str = ""  # "YES", "NO"
    target_section: str = ""  # "section6"


# ---------------------------------------------------------------------------
# Text extraction
# ---------------------------------------------------------------------------

def extract_page_text(doc: fitz.Document, page_num: int) -> list[TextSpan]:
    """Extract text spans with font metadata from a page."""
    page = doc[page_num]
    page_dict = page.get_text("dict")
    spans: list[TextSpan] = []

    for block in page_dict.get("blocks", []):
        if block.get("type") != 0:
            continue
        for line in block.get("lines", []):
            bbox = line.get("bbox", (0, 0, 0, 0))
            line_spans = line.get("spans", [])
            if not line_spans:
                continue

            parts = []
            max_fs = 0.0
            bold = False

            for s in line_spans:
                t = s.get("text", "")
                if t.strip():
                    parts.append(t)
                fs = s.get("size", 0)
                if fs > max_fs:
                    max_fs = fs
                flags = s.get("flags", 0)
                if flags & 16:
                    bold = True
                fn = s.get("font", "").lower()
                if "bold" in fn or "black" in fn:
                    bold = True

            text = " ".join(parts).strip()
            if not text:
                continue

            spans.append(TextSpan(
                x0=bbox[0], y0=bbox[1], x1=bbox[2], y1=bbox[3],
                text=text, font_size=max_fs, is_bold=bold,
            ))

    spans.sort(key=lambda s: (s.y0, s.x0))
    return spans


# ---------------------------------------------------------------------------
# Horizontal rule / separator line detection
# ---------------------------------------------------------------------------

def extract_horizontal_rules(doc: fitz.Document, page_num: int) -> list[float]:
    """Extract Y-coordinates of horizontal separator lines from page drawings.

    A horizontal rule is a line where y0 == y1 (horizontal) and the width
    spans a significant portion of the page (> 200pt).
    """
    page = doc[page_num]
    rules: list[float] = []
    try:
        drawings = page.get_drawings()
    except Exception:
        return rules

    for d in drawings:
        items = d.get("items", [])
        if len(items) != 1:
            continue
        item = items[0]
        # Line item: ('l', Point(x0, y0), Point(x1, y1))
        if item[0] != "l":
            continue
        p0, p1 = item[1], item[2]
        # Horizontal: same Y, significant width
        if abs(p0.y - p1.y) < 1.0 and abs(p1.x - p0.x) > 200:
            rules.append(round(p0.y, 1))

    return sorted(set(rules))


# ---------------------------------------------------------------------------
# Lookback detection helpers
# ---------------------------------------------------------------------------

def detect_lookback(text: str) -> dict[str, Any] | None:
    """Detect lookback period from text. Returns {"years": N} or {"years": "EVER"} or None."""
    # Check for EVER first
    if EVER_RE.search(text):
        return {"years": "EVER"}

    m = LOOKBACK_YEARS_RE.search(text)
    if m:
        val = m.group(1).lower()
        if val.isdigit():
            return {"years": int(val)}
        elif val in WORD_TO_NUM:
            return {"years": WORD_TO_NUM[val]}

    return None


# ---------------------------------------------------------------------------
# Field cluster gap detection
# ---------------------------------------------------------------------------

def detect_field_clusters(
    page_fields: list[dict[str, Any]],
    gap_threshold: float = 20.0,
) -> list[dict[str, Any]]:
    """Detect visual field clusters separated by Y-coordinate gaps > threshold.

    Returns list of cluster dicts with {yStart, yEnd, fieldKeys, fieldCount}.
    """
    rects = []
    for f in page_fields:
        rect = f.get("pdfRect")
        if rect:
            rects.append({
                "key": f["semanticKey"],
                "y": rect.get("y", 0),
                "height": rect.get("height", 10),
            })

    if not rects:
        return []

    rects.sort(key=lambda r: r["y"])

    clusters: list[dict[str, Any]] = []
    current_keys = [rects[0]["key"]]
    current_y_start = rects[0]["y"]
    current_y_end = rects[0]["y"] + rects[0]["height"]

    for i in range(1, len(rects)):
        gap = rects[i]["y"] - current_y_end
        if gap > gap_threshold:
            # New cluster
            clusters.append({
                "yStart": round(current_y_start, 1),
                "yEnd": round(current_y_end, 1),
                "fieldKeys": current_keys,
                "fieldCount": len(current_keys),
            })
            current_keys = [rects[i]["key"]]
            current_y_start = rects[i]["y"]
            current_y_end = rects[i]["y"] + rects[i]["height"]
        else:
            current_keys.append(rects[i]["key"])
            y_bottom = rects[i]["y"] + rects[i]["height"]
            if y_bottom > current_y_end:
                current_y_end = y_bottom

    # Last cluster
    if current_keys:
        clusters.append({
            "yStart": round(current_y_start, 1),
            "yEnd": round(current_y_end, 1),
            "fieldKeys": current_keys,
            "fieldCount": len(current_keys),
        })

    return clusters


# ---------------------------------------------------------------------------
# Repeating label pattern detection
# ---------------------------------------------------------------------------

def detect_repeating_labels(spans: list[TextSpan]) -> list[dict[str, Any]]:
    """Detect repeating label patterns that indicate entry boundaries.

    If the same label text appears at different Y positions (separated by > 50px),
    each occurrence marks a new entry.
    """
    label_positions: dict[str, list[float]] = defaultdict(list)
    for span in spans:
        text = span.text.strip()
        # Only consider short label-like text (3-60 chars), not too short
        if 3 <= len(text) <= 60 and not text.startswith("Page "):
            label_positions[text].append(span.y0)

    repeating: list[dict[str, Any]] = []
    for label, positions in label_positions.items():
        if len(positions) < 2:
            continue
        positions.sort()
        # Check that positions are separated by > 50px (not just same line)
        separated = []
        last_y = positions[0]
        separated.append(last_y)
        for y in positions[1:]:
            if y - last_y > 50:
                separated.append(y)
                last_y = y

        if len(separated) >= 2:
            repeating.append({
                "label": label,
                "positions": [round(y, 1) for y in separated],
                "count": len(separated),
            })

    # Sort by count descending (most repeated labels first)
    repeating.sort(key=lambda r: -r["count"])
    return repeating[:10]  # Top 10 repeating labels


# ---------------------------------------------------------------------------
# Page content analysis
# ---------------------------------------------------------------------------

def analyze_page_content(
    doc: fitz.Document,
    page_num: int,
    page_fields: list[dict[str, Any]],
) -> dict[str, Any]:
    """Analyze a single page and extract structured content."""

    spans = extract_page_text(doc, page_num)
    h_rules = extract_horizontal_rules(doc, page_num)

    sections: list[str] = []
    questions: list[dict[str, Any]] = []
    entries: list[dict[str, Any]] = []
    instructions: list[dict[str, Any]] = []
    raw_text_blocks: list[dict[str, Any]] = []
    lookbacks: list[dict[str, Any]] = []

    # Track standalone question numbers for merging with next text span
    pending_standalone_q: dict[str, Any] | None = None

    for idx, span in enumerate(spans):
        text = span.text.strip()
        if not text:
            continue

        raw_text_blocks.append({
            "text": text,
            "y": round(span.y0, 1),
            "fontSize": round(span.font_size, 1),
            "bold": span.is_bold,
        })

        # If we have a pending standalone question number, try to merge with this span
        if pending_standalone_q is not None:
            # Next text span after a standalone number becomes the question text
            # Only merge if the next span is close (within 30px Y)
            y_dist = span.y0 - pending_standalone_q["_y"]
            if y_dist < 30 and y_dist >= 0:
                pending_standalone_q["text"] = text
                # Check for inline routing in the merged question text
                rm = ROUTING_RE.search(text)
                if rm:
                    trigger = _normalize_trigger(rm.group(1))
                    target = rm.group(2)
                    pending_standalone_q["routing"][trigger] = _format_target(target)
                # Check for lookback in question text
                lb = detect_lookback(text)
                if lb:
                    pending_standalone_q["lookback"] = lb
                questions.append(pending_standalone_q)
                del pending_standalone_q["_y"]  # Remove internal tracking field
                pending_standalone_q = None
                continue
            else:
                # Too far away, emit standalone q with no text
                del pending_standalone_q["_y"]
                questions.append(pending_standalone_q)
                pending_standalone_q = None
                # Fall through to process current span normally

        # Section header
        m = SECTION_HEADER_RE.match(text)
        if m:
            sections.append(f"section{m.group(1)}")
            continue

        # Question number with text: "13A.1 Complete the following..."
        qm = QUESTION_NUMBER_RE.match(text)
        if qm:
            q: dict[str, Any] = {
                "number": qm.group(1),
                "text": qm.group(2).strip(),
                "yPosition": round(span.y0, 1),
                "fieldKeys": [],
                "routing": {},
            }

            # Check for inline routing
            rm = ROUTING_RE.search(text)
            if rm:
                trigger = _normalize_trigger(rm.group(1))
                target = rm.group(2)
                q["routing"][trigger] = _format_target(target)

            # Check for lookback
            lb = detect_lookback(text)
            if lb:
                q["lookback"] = lb

            questions.append(q)
            continue

        # Standalone question number: "17.3", "20A.1", "22.1"
        sqm = STANDALONE_QUESTION_RE.match(text)
        if sqm:
            pending_standalone_q = {
                "number": sqm.group(1),
                "text": "",
                "yPosition": round(span.y0, 1),
                "fieldKeys": [],
                "routing": {},
                "_y": span.y0,  # Internal: for merging with next span
            }
            continue

        # Routing instruction
        rm = ROUTING_RE.search(text)
        if rm:
            trigger = _normalize_trigger(rm.group(1))
            target = rm.group(2)
            instructions.append({
                "text": text,
                "y": round(span.y0, 1),
                "type": "routing",
                "triggerValue": trigger,
                "targetSection": _format_target(target),
            })
            # Don't continue here - also check for complete_if and lookback below

        # "Complete the following if you responded 'Yes'"
        cm = COMPLETE_IF_RE.search(text)
        if cm:
            inst_entry = {
                "text": text,
                "y": round(span.y0, 1),
                "type": "complete_if",
                "triggerValue": cm.group(1).upper(),
            }
            # Check for lookback in complete_if instruction text
            lb = detect_lookback(text)
            if lb:
                inst_entry["lookback"] = lb
            instructions.append(inst_entry)
            continue

        # If routing was already matched above, skip further checks
        if rm:
            continue

        # Entry boundary
        em = ENTRY_RE.search(text)
        if em:
            entries.append({
                "index": int(em.group(1)) - 1,  # 0-based
                "yStart": round(span.y0, 1),
                "text": text,
            })
            continue

        # Option-embedded routing (in radio option text)
        orm = OPTION_ROUTING_RE.search(text)
        if orm:
            trigger = _normalize_trigger(orm.group(1))
            target = orm.group(2)
            instructions.append({
                "text": text,
                "y": round(span.y0, 1),
                "type": "option_routing",
                "triggerValue": trigger,
                "targetSection": _format_target(target),
            })
            continue

        # Lookback detection in general text (section intro paragraphs)
        lb = detect_lookback(text)
        if lb and len(text) > 30:
            lookbacks.append({
                "text": text[:200],
                "y": round(span.y0, 1),
                "lookback": lb,
            })

    # Flush any remaining pending standalone question
    if pending_standalone_q is not None:
        del pending_standalone_q["_y"]
        questions.append(pending_standalone_q)

    # Map fields to nearest question above them
    field_rects = []
    for f in page_fields:
        rect = f.get("pdfRect")
        if rect:
            field_rects.append({
                "key": f["semanticKey"],
                "section": f["section"],
                "y": rect.get("y", 0),
            })

    # Associate fields with questions
    sorted_qs = sorted(questions, key=lambda q: q["yPosition"])
    for fr in field_rects:
        best_q = None
        best_dist = float("inf")
        for q in sorted_qs:
            if q["yPosition"] <= fr["y"] + 5:
                dist = fr["y"] - q["yPosition"]
                if dist < best_dist:
                    best_dist = dist
                    best_q = q
        if best_q and best_dist < 300:
            if fr["key"] not in best_q["fieldKeys"]:
                best_q["fieldKeys"].append(fr["key"])

    # Get unique sections from fields
    field_sections = sorted(set(f["section"] for f in page_fields if f.get("section")))
    if not sections:
        sections = field_sections

    # Detect field clusters for visual grouping
    field_clusters = detect_field_clusters(page_fields)

    # Detect repeating label patterns
    repeating_labels = detect_repeating_labels(spans)

    # Build numbered list items
    numbered_items: list[dict[str, Any]] = []
    for span in spans:
        text = span.text.strip()
        if NUMBERED_LIST_RE.match(text):
            numbered_items.append({
                "text": text[:100],
                "y": round(span.y0, 1),
            })

    result: dict[str, Any] = {
        "page": page_num + 1,  # 1-based
        "sections": sections,
        "questions": questions,
        "entries": entries,
        "instructions": instructions,
        "fieldCount": len(page_fields),
        "fieldSections": field_sections,
    }

    # Add enhanced data (only when non-empty)
    if lookbacks:
        result["lookbacks"] = lookbacks
    if h_rules:
        result["horizontalRules"] = h_rules
    if field_clusters and len(field_clusters) > 1:
        result["fieldClusters"] = field_clusters
    if repeating_labels:
        result["repeatingLabels"] = repeating_labels
    if numbered_items:
        result["numberedItems"] = numbered_items

    return result


# ---------------------------------------------------------------------------
# Trigger/target normalization helpers
# ---------------------------------------------------------------------------

def _normalize_trigger(raw: str) -> str:
    """Normalize a trigger value to 'YES' or 'NO'."""
    upper = raw.strip().upper()
    if "YES" in upper:
        return "YES"
    elif "NO" in upper or "NOT" in upper or "DECLINE" in upper:
        return "NO"
    return upper


def _format_target(raw: str) -> str:
    """Format a routing target. If it contains a dot (e.g., '20A.2'), keep as sub-question.
    Otherwise prefix with 'section'."""
    raw = raw.strip()
    if "." in raw:
        # Sub-question reference like "20A.2" — keep as-is but still prefix
        return raw
    return f"section{raw}"


# ---------------------------------------------------------------------------
# Conditional instruction linking
# ---------------------------------------------------------------------------

def link_conditional_instructions(
    page_data: dict[str, Any],
    page_fields: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """Link 'complete_if' instructions to their nearest gate field above.

    For each "Complete the following if you responded 'Yes'" instruction,
    find the nearest radio/checkbox field above it by Y-position (the gate),
    then find all fields below it until the next instruction or entry boundary
    (the gated fields).
    """
    instructions = page_data.get("instructions", [])
    complete_ifs = [i for i in instructions if i.get("type") == "complete_if"]

    if not complete_ifs:
        return []

    # Get field positions sorted by Y
    field_rects = []
    for f in page_fields:
        rect = f.get("pdfRect")
        if rect and f.get("type") in ("radio", "checkbox", "branch"):
            field_rects.append({
                "key": f["semanticKey"],
                "y": rect.get("y", 0),
                "type": f.get("type", ""),
            })
    field_rects.sort(key=lambda r: r["y"])

    # Get all field positions (not just gate-capable)
    all_field_rects = []
    for f in page_fields:
        rect = f.get("pdfRect")
        if rect:
            all_field_rects.append({
                "key": f["semanticKey"],
                "y": rect.get("y", 0),
            })
    all_field_rects.sort(key=lambda r: r["y"])

    # Collect all boundary Y positions (instructions, entries) to define gated regions
    boundary_ys = sorted(
        [i["y"] for i in instructions] +
        [e["yStart"] for e in page_data.get("entries", [])]
    )

    conditional_blocks: list[dict[str, Any]] = []

    for ci in complete_ifs:
        ci_y = ci["y"]

        # Find nearest gate field above the instruction
        gate_field = None
        best_dist = float("inf")
        for fr in field_rects:
            if fr["y"] < ci_y:
                dist = ci_y - fr["y"]
                if dist < best_dist:
                    best_dist = dist
                    gate_field = fr

        # Find the next boundary below this instruction
        next_boundary_y = float("inf")
        for by in boundary_ys:
            if by > ci_y + 5:
                next_boundary_y = by
                break

        # Collect fields between instruction and next boundary
        gated_keys = []
        for fr in all_field_rects:
            if ci_y < fr["y"] < next_boundary_y:
                gated_keys.append(fr["key"])

        block: dict[str, Any] = {
            "instructionText": ci["text"][:200],
            "triggerValue": ci["triggerValue"],
            "yPosition": ci_y,
        }
        if gate_field:
            block["gateFieldKey"] = gate_field["key"]
        if gated_keys:
            block["fieldKeys"] = gated_keys

        conditional_blocks.append(block)

    return conditional_blocks


# ---------------------------------------------------------------------------
# Section spec generation
# ---------------------------------------------------------------------------

def generate_section_specs(
    pages: list[dict[str, Any]],
    registry: list[dict[str, Any]],
) -> dict[str, dict[str, Any]]:
    """Generate per-section structure specs from page analysis."""

    # Group fields by section
    fields_by_section: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for f in registry:
        if f.get("section") == "ssnPageHeader":
            continue
        fields_by_section[f["section"]].append(f)

    # Index fields by page for conditional linking
    fields_by_page: dict[int, list[dict[str, Any]]] = defaultdict(list)
    for f in registry:
        page = f.get("pdfPage", 1)
        fields_by_page[page].append(f)

    specs: dict[str, dict[str, Any]] = {}

    for section, fields in sorted(fields_by_section.items()):
        sec_pages = sorted(set(f.get("pdfPage", 1) for f in fields))

        # Collect questions and instructions from pages containing this section
        all_questions = []
        all_instructions = []
        all_entries = []
        all_conditional_blocks: list[dict[str, Any]] = []
        section_lookbacks: list[dict[str, Any]] = []

        for page_data in pages:
            if page_data["page"] not in sec_pages:
                continue
            # Filter questions by section
            for q in page_data.get("questions", []):
                sec_keys = [k for k in q.get("fieldKeys", [])
                           if any(f["semanticKey"] == k and f["section"] == section
                                 for f in registry)]
                if sec_keys or not q.get("fieldKeys"):
                    all_questions.append(q)

            all_instructions.extend(page_data.get("instructions", []))
            all_entries.extend(page_data.get("entries", []))

            # Collect lookbacks from page
            for lb_entry in page_data.get("lookbacks", []):
                section_lookbacks.append(lb_entry)

            # Link conditional instructions
            page_fields = fields_by_page.get(page_data["page"], [])
            sec_page_fields = [f for f in page_fields if f.get("section") == section]
            cond_blocks = link_conditional_instructions(page_data, sec_page_fields)
            all_conditional_blocks.extend(cond_blocks)

        # Build routing map
        routing: dict[str, str] = {}
        for inst in all_instructions:
            if inst.get("type") in ("routing", "option_routing") and inst.get("targetSection"):
                routing[inst["triggerValue"]] = inst["targetSection"]
        for q in all_questions:
            for trigger, target in q.get("routing", {}).items():
                routing[trigger] = target

        # Gate fields
        gate_keys = set()
        for f in fields:
            dep = f.get("dependsOn")
            if dep:
                gate_keys.add(dep)

        # Repeat groups
        repeat_groups: dict[str, dict[str, Any]] = {}
        for f in fields:
            rg = f.get("repeatGroup")
            if not rg:
                continue
            if rg not in repeat_groups:
                repeat_groups[rg] = {"indices": set(), "fieldsPerIndex": 0}
            repeat_groups[rg]["indices"].add(f.get("repeatIndex", 0))
            if f.get("repeatIndex", 0) == 0:
                repeat_groups[rg]["fieldsPerIndex"] += 1
        for rg in repeat_groups:
            repeat_groups[rg]["maxIndex"] = max(repeat_groups[rg]["indices"])
            repeat_groups[rg]["entryCount"] = len(repeat_groups[rg]["indices"])
            del repeat_groups[rg]["indices"]

        # Collect all question numbers
        question_numbers = sorted(set(q["number"] for q in all_questions))

        # Determine section-level lookback period
        # Priority: question-level lookback > page lookback text > None
        lookback_period = None
        for q in all_questions:
            lb = q.get("lookback")
            if lb:
                lookback_period = lb
                break
        if not lookback_period and section_lookbacks:
            lookback_period = section_lookbacks[0].get("lookback")

        spec: dict[str, Any] = {
            "section": section,
            "pages": sec_pages,
            "fieldCount": len(fields),
            "gateFieldCount": len(gate_keys),
            "gateFieldKeys": sorted(gate_keys),
            "routing": routing,
            "repeatGroups": repeat_groups,
            "questions": all_questions,
            "instructions": all_instructions,
            "entries": all_entries,
            # New enhanced fields
            "questionNumbers": question_numbers,
        }

        if lookback_period:
            spec["lookbackPeriod"] = lookback_period
        if all_conditional_blocks:
            spec["conditionalBlocks"] = all_conditional_blocks

        specs[section] = spec

    return specs


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    import argparse

    parser = argparse.ArgumentParser(description="Enhanced PDF page content analyzer v2")
    parser.add_argument("--pdf", default="/app/templates/sf861.pdf")
    parser.add_argument("--registry", default="/app/field-registry.json")
    parser.add_argument("--output", default="/app/page-content-analysis.json")
    parser.add_argument("--specs-dir", default="")
    args = parser.parse_args()

    print("=== Enhanced PDF Page Content Analyzer v2 ===\n")

    registry = json.loads(Path(args.registry).read_text())
    print(f"Registry: {len(registry)} fields")

    # Index fields by page
    fields_by_page: dict[int, list[dict[str, Any]]] = defaultdict(list)
    for f in registry:
        page = f.get("pdfPage", 1)
        fields_by_page[page].append(f)

    doc = fitz.open(args.pdf)
    total_pages = len(doc)
    print(f"PDF: {total_pages} pages\n")

    start = time.time()

    # Analyze each page
    pages = []
    for page_num in range(total_pages):
        page_fields = fields_by_page.get(page_num + 1, [])
        page_data = analyze_page_content(doc, page_num, page_fields)
        pages.append(page_data)

    doc.close()

    # Generate section specs
    section_specs = generate_section_specs(pages, registry)

    elapsed = time.time() - start

    # Summary stats
    total_questions = sum(len(p["questions"]) for p in pages)
    total_routing = sum(
        1 for p in pages
        for inst in p.get("instructions", [])
        if inst.get("type") in ("routing", "option_routing")
    )
    total_entries = sum(len(p["entries"]) for p in pages)
    total_lookback_pages = sum(1 for p in pages if p.get("lookbacks"))
    total_h_rules = sum(len(p.get("horizontalRules", [])) for p in pages)
    total_field_cluster_pages = sum(1 for p in pages if p.get("fieldClusters"))
    total_conditional_blocks = sum(
        len(spec.get("conditionalBlocks", []))
        for spec in section_specs.values()
    )
    sections_with_lookback = sum(
        1 for spec in section_specs.values()
        if spec.get("lookbackPeriod")
    )

    output = {
        "metadata": {
            "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "totalPages": total_pages,
            "totalFields": len(registry),
            "analysisTimeSeconds": round(elapsed, 1),
        },
        "pages": pages,
        "sectionSpecs": section_specs,
    }

    Path(args.output).parent.mkdir(parents=True, exist_ok=True)
    Path(args.output).write_text(json.dumps(output, indent=2))

    print(f"=== COMPLETE ({elapsed:.1f}s) ===")
    print(f"Questions found:        {total_questions}")
    print(f"Routing instr:          {total_routing}")
    print(f"Entry boundaries:       {total_entries}")
    print(f"Section specs:          {len(section_specs)}")
    print()
    print("--- v2 Enhancements ---")
    print(f"Lookback pages:         {total_lookback_pages}")
    print(f"Sections w/ lookback:   {sections_with_lookback}")
    print(f"Horizontal rules:       {total_h_rules}")
    print(f"Field cluster pages:    {total_field_cluster_pages}")
    print(f"Conditional blocks:     {total_conditional_blocks}")
    print()

    # Print per-section lookback summary
    print("--- Lookback Periods by Section ---")
    for sec_name, spec in sorted(section_specs.items()):
        lb = spec.get("lookbackPeriod")
        if lb:
            print(f"  {sec_name:15s}: {lb}")

    print()
    print("--- Question Numbers by Section ---")
    for sec_name, spec in sorted(section_specs.items()):
        qns = spec.get("questionNumbers", [])
        if qns:
            print(f"  {sec_name:15s}: {', '.join(qns)}")

    print(f"\nOutput: {args.output}")

    # Write section specs individually if --specs-dir provided
    if args.specs_dir:
        specs_path = Path(args.specs_dir)
        specs_path.mkdir(parents=True, exist_ok=True)
        for sec, spec in section_specs.items():
            (specs_path / f"{sec}.json").write_text(json.dumps(spec, indent=2))
        print(f"Section specs written to: {specs_path}/")


if __name__ == "__main__":
    main()

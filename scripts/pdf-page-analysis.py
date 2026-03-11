#!/usr/bin/env python3
"""
SF-86 PDF Page-by-Page Analysis
================================

Extracts structured content from the SF-86 PDF: section headers, question groups,
conditional instructions, field labels, and repeat group boundaries.

Produces `pdf-analysis.json` — the ground truth for wizard step generation.

Usage (run inside Docker container with pymupdf):
  docker exec sf86-pdf-service python3 /app/scripts/pdf-page-analysis.py \
    --pdf /app/templates/sf861.pdf \
    --registry /app/field-registry.json \
    --output /app/pdf-analysis.json
"""

from __future__ import annotations

import json
import math
import re
import sys
import time
from dataclasses import dataclass, field as dc_field
from pathlib import Path
from typing import Any

try:
    import fitz
except ImportError:
    print("ERROR: PyMuPDF (fitz) not installed. Run inside the PDF service container.")
    sys.exit(1)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

MAX_LABEL_DISTANCE = 80  # PDF points (~1.1 inches)

# Section header patterns
SECTION_HEADER_RE = re.compile(
    r'^Section\s+(\d+)\s*[-–—:]\s*(.+)',
    re.IGNORECASE,
)

# Conditional instruction patterns
CONDITIONAL_PATTERNS = [
    re.compile(r'[Ii]f\s+(?:yes|no|you|your|the|this|applicable)', re.IGNORECASE),
    re.compile(r'[Pp]roceed\s+to\s+(?:Section|Item|Part|the\s+next)', re.IGNORECASE),
    re.compile(r'[Cc]omplete\s+the\s+following', re.IGNORECASE),
    re.compile(r'[Dd]oes\s+not\s+apply', re.IGNORECASE),
    re.compile(r'[Ss]kip\s+to', re.IGNORECASE),
    re.compile(r'[Pp]rovide\s+(?:the\s+)?(?:details|information)\s+(?:below|in)', re.IGNORECASE),
    re.compile(r'[Aa]nswer\s+the\s+following', re.IGNORECASE),
    re.compile(r'(?:N/?A|Not\s+Applicable)', re.IGNORECASE),
]

# Question detection patterns
QUESTION_PATTERNS = [
    re.compile(r'\?\s*$'),  # Ends with ?
    re.compile(r'^(?:Have|Has|Do|Does|Did|Is|Are|Was|Were|Will|Would|Can|Could)\s+', re.IGNORECASE),
    re.compile(r'^(?:Provide|Enter|List|Give|Describe|Explain|Indicate|State)\s+', re.IGNORECASE),
]

# Repeat/entry patterns
ENTRY_PATTERNS = [
    re.compile(r'Entry\s+(\d+)', re.IGNORECASE),
    re.compile(r'Item\s+(\d+)', re.IGNORECASE),
    re.compile(r'(?:Additional|Another)\s+(?:entry|item|person|relative|employer|residence)', re.IGNORECASE),
    re.compile(r'(?:Do\s+you\s+have\s+another|Add\s+another)', re.IGNORECASE),
]

# Certification/signature text
CERTIFICATION_PATTERNS = [
    re.compile(r'[Ii]\s+certify', re.IGNORECASE),
    re.compile(r'[Mm]y\s+statements?\s+(?:are|on\s+this\s+form)', re.IGNORECASE),
    re.compile(r'[Uu]nder\s+penalty', re.IGNORECASE),
    re.compile(r'[Ff]ull,?\s+true,?\s+(?:and\s+)?correct', re.IGNORECASE),
    re.compile(r'[Ss]ignature', re.IGNORECASE),
]


# ---------------------------------------------------------------------------
# Data structures
# ---------------------------------------------------------------------------

@dataclass
class TextBlock:
    x0: float
    y0: float
    x1: float
    y1: float
    text: str
    page: int
    font_size: float = 0.0
    is_bold: bool = False


@dataclass
class FieldRect:
    x: float
    y: float
    width: float
    height: float
    semantic_key: str = ""
    section: str = ""

    @property
    def x0(self) -> float: return self.x
    @property
    def y0(self) -> float: return self.y
    @property
    def x1(self) -> float: return self.x + self.width
    @property
    def y1(self) -> float: return self.y + self.height
    @property
    def cx(self) -> float: return self.x + self.width / 2
    @property
    def cy(self) -> float: return self.y + self.height / 2


@dataclass
class QuestionGroup:
    question_text: str
    instruction_text: str = ""
    conditional_instructions: list[dict[str, str]] = dc_field(default_factory=list)
    field_keys: list[str] = dc_field(default_factory=list)
    y_position: float = 0.0
    block_type: str = "question"  # question, instruction, header, certification


# ---------------------------------------------------------------------------
# Text extraction with font info
# ---------------------------------------------------------------------------

def extract_text_with_font(doc: fitz.Document, page_num: int) -> list[TextBlock]:
    """Extract text blocks with font size and bold detection."""
    page = doc[page_num]
    page_dict = page.get_text("dict")
    result = []

    for block in page_dict.get("blocks", []):
        if block.get("type") != 0:
            continue
        for line in block.get("lines", []):
            bbox = line.get("bbox", (0, 0, 0, 0))
            spans = line.get("spans", [])
            if not spans:
                continue

            text_parts = []
            max_font_size = 0.0
            has_bold = False

            for span in spans:
                t = span.get("text", "")
                if t.strip():
                    text_parts.append(t)
                fs = span.get("size", 0)
                if fs > max_font_size:
                    max_font_size = fs
                flags = span.get("flags", 0)
                if flags & 16:  # Bold flag
                    has_bold = True
                font_name = span.get("font", "").lower()
                if "bold" in font_name or "black" in font_name:
                    has_bold = True

            text = " ".join(text_parts).strip()
            if not text:
                continue

            result.append(TextBlock(
                x0=bbox[0], y0=bbox[1], x1=bbox[2], y1=bbox[3],
                text=text, page=page_num,
                font_size=max_font_size, is_bold=has_bold,
            ))

    return result


def extract_text_lines(doc: fitz.Document, page_num: int) -> list[TextBlock]:
    """Extract text at line level (simpler, for label matching)."""
    page = doc[page_num]
    page_dict = page.get_text("dict")
    result = []
    for block in page_dict.get("blocks", []):
        if block.get("type") != 0:
            continue
        for line in block.get("lines", []):
            bbox = line.get("bbox", (0, 0, 0, 0))
            spans = line.get("spans", [])
            text = " ".join(s.get("text", "") for s in spans).strip()
            if not text:
                continue
            result.append(TextBlock(
                x0=bbox[0], y0=bbox[1], x1=bbox[2], y1=bbox[3],
                text=text, page=page_num,
            ))
    return result


# ---------------------------------------------------------------------------
# Block classification
# ---------------------------------------------------------------------------

def classify_block(block: TextBlock) -> str:
    """Classify a text block as header, question, instruction, conditional, certification, or label."""
    text = block.text.strip()

    # Section header: bold, large font, matches pattern
    if SECTION_HEADER_RE.match(text):
        return "section_header"
    if block.is_bold and block.font_size >= 10.5 and len(text) < 100:
        if any(kw in text.lower() for kw in ["section", "continuation", "general information"]):
            return "section_header"

    # Certification text
    if any(p.search(text) for p in CERTIFICATION_PATTERNS):
        return "certification"

    # Conditional instruction
    if any(p.search(text) for p in CONDITIONAL_PATTERNS):
        return "conditional"

    # Question text
    if any(p.search(text) for p in QUESTION_PATTERNS):
        return "question"

    # Entry/repeat patterns
    if any(p.search(text) for p in ENTRY_PATTERNS):
        return "entry_marker"

    # Short text near fields is likely a label
    if len(text) < 60 and not text.endswith('.'):
        return "label"

    # Longer text is instruction/static
    if len(text) >= 60:
        return "instruction"

    return "static"


# ---------------------------------------------------------------------------
# Field-text proximity
# ---------------------------------------------------------------------------

def compute_distance(field: FieldRect, block: TextBlock) -> float:
    """Compute minimum distance between field rect and text block rect."""
    if block.x1 < field.x0:
        dx = field.x0 - block.x1
    elif block.x0 > field.x1:
        dx = block.x0 - field.x1
    else:
        dx = 0
    if block.y1 < field.y0:
        dy = field.y0 - block.y1
    elif block.y0 > field.y1:
        dy = block.y0 - field.y1
    else:
        dy = 0
    return math.sqrt(dx * dx + dy * dy)


def associate_fields_with_questions(
    questions: list[QuestionGroup],
    fields: list[FieldRect],
) -> None:
    """Associate field keys with the nearest question group above them."""
    if not questions or not fields:
        return

    # Sort questions by y position
    sorted_qs = sorted(questions, key=lambda q: q.y_position)

    for field in fields:
        # Find the question group that is closest above (or at same y) as the field
        best_q = None
        best_dist = float('inf')
        for q in sorted_qs:
            # Question should be above or at same level as field
            if q.y_position <= field.y + 5:
                dist = field.y - q.y_position
                if dist < best_dist:
                    best_dist = dist
                    best_q = q
        if best_q and best_dist < 300:  # Within ~4 inches
            if field.semantic_key not in best_q.field_keys:
                best_q.field_keys.append(field.semantic_key)


# ---------------------------------------------------------------------------
# Page analysis
# ---------------------------------------------------------------------------

def analyze_page(
    doc: fitz.Document,
    page_num: int,
    page_fields: list[dict[str, Any]],
) -> dict[str, Any]:
    """Analyze a single PDF page: extract text blocks, classify them, associate with fields."""
    text_blocks = extract_text_with_font(doc, page_num)

    section_headers: list[dict[str, Any]] = []
    question_groups: list[QuestionGroup] = []
    conditional_instructions: list[dict[str, Any]] = []
    certification_texts: list[str] = []
    entry_markers: list[dict[str, Any]] = []
    instructions: list[dict[str, Any]] = []

    current_question: QuestionGroup | None = None

    # Sort blocks top-to-bottom for sequential processing
    text_blocks.sort(key=lambda b: (b.y0, b.x0))

    for block in text_blocks:
        block_type = classify_block(block)
        text = block.text.strip()

        if block_type == "section_header":
            m = SECTION_HEADER_RE.match(text)
            header_info = {
                "text": text,
                "sectionNum": int(m.group(1)) if m else None,
                "sectionTitle": m.group(2).strip() if m else text,
                "y": round(block.y0, 1),
                "fontSize": round(block.font_size, 1),
            }
            section_headers.append(header_info)
            # Start a new question context after a header
            current_question = None

        elif block_type == "question":
            current_question = QuestionGroup(
                question_text=text,
                y_position=block.y0,
                block_type="question",
            )
            question_groups.append(current_question)

        elif block_type == "conditional":
            cond = {
                "text": text,
                "y": round(block.y0, 1),
            }
            # Try to extract gate direction (if yes/if no)
            if re.search(r'\byes\b', text, re.IGNORECASE):
                cond["triggerValue"] = "YES"
            elif re.search(r'\bno\b', text, re.IGNORECASE):
                cond["triggerValue"] = "NO"

            conditional_instructions.append(cond)

            # Also attach to current question if active
            if current_question:
                current_question.conditional_instructions.append(cond)

        elif block_type == "certification":
            certification_texts.append(text)

        elif block_type == "entry_marker":
            entry_markers.append({
                "text": text,
                "y": round(block.y0, 1),
            })

        elif block_type == "instruction":
            instructions.append({
                "text": text,
                "y": round(block.y0, 1),
            })
            # Attach instruction to current question
            if current_question and not current_question.instruction_text:
                current_question.instruction_text = text

        elif block_type == "label":
            # Labels are handled via field association below
            pass

    # Build field rects for this page
    field_rects = []
    for f in page_fields:
        rect = f.get("pdfRect")
        if rect and all(k in rect for k in ("x", "y", "width", "height")):
            field_rects.append(FieldRect(
                x=rect["x"], y=rect["y"],
                width=rect["width"], height=rect["height"],
                semantic_key=f["semanticKey"],
                section=f["section"],
            ))

    # Associate fields with questions — section-filtered to prevent cross-section bleed.
    # On pages with multiple sections (e.g. page 5 has sections 1-6), group fields by
    # section and only match questions whose Y-position falls within that section's Y-range.
    from collections import defaultdict
    fields_by_section: dict[str, list[FieldRect]] = defaultdict(list)
    for fr in field_rects:
        fields_by_section[fr.section].append(fr)

    if len(fields_by_section) <= 1:
        # Single section on this page — no filtering needed
        associate_fields_with_questions(question_groups, field_rects)
    else:
        # Multiple sections on this page — filter questions per section
        for section, sec_fields in fields_by_section.items():
            min_y = min(f.y for f in sec_fields) - 30  # 30pt padding above
            max_y = max(f.y + f.height for f in sec_fields) + 10
            sec_questions = [q for q in question_groups if min_y <= q.y_position <= max_y]
            associate_fields_with_questions(sec_questions, sec_fields)

    return {
        "pageNum": page_num + 1,  # 1-based for consistency with registry
        "sectionHeaders": section_headers,
        "questionGroups": [
            {
                "questionText": q.question_text,
                "instructionText": q.instruction_text,
                "conditionalInstructions": q.conditional_instructions,
                "fieldKeys": q.field_keys,
                "yPosition": round(q.y_position, 1),
            }
            for q in question_groups
        ],
        "conditionalInstructions": conditional_instructions,
        "certificationTexts": certification_texts,
        "entryMarkers": entry_markers,
        "instructions": instructions,
        "fieldCount": len(page_fields),
    }


# ---------------------------------------------------------------------------
# Cross-page analysis
# ---------------------------------------------------------------------------

def build_conditional_map(
    pages: list[dict[str, Any]],
    registry: list[dict[str, Any]],
) -> dict[str, dict[str, Any]]:
    """Build a map of gate fields to their conditional question text and routing."""
    # Find all gate fields (fields that have dependsOn pointing to them)
    gate_targets = set()
    for f in registry:
        if f.get("dependsOn"):
            gate_targets.add(f["dependsOn"])

    # Build map from gate field key to info
    cond_map: dict[str, dict[str, Any]] = {}
    for gate_key in sorted(gate_targets):
        gate_field = next((f for f in registry if f["semanticKey"] == gate_key), None)
        if not gate_field:
            continue

        # Find the page containing this gate field
        page_num = gate_field.get("pdfPage", 1)

        # Find question text near this gate field
        question_text = ""
        for page in pages:
            if page["pageNum"] == page_num:
                for qg in page["questionGroups"]:
                    if gate_key in qg.get("fieldKeys", []):
                        question_text = qg["questionText"]
                        break
                break

        # Count affected fields
        affected = [f["semanticKey"] for f in registry if f.get("dependsOn") == gate_key]

        cond_map[gate_key] = {
            "questionText": question_text,
            "label": gate_field.get("label", ""),
            "options": gate_field.get("options", []),
            "section": gate_field.get("section", ""),
            "page": page_num,
            "affectedFieldCount": len(affected),
        }

    return cond_map


def build_repeat_group_boundaries(
    registry: list[dict[str, Any]],
) -> dict[str, dict[str, Any]]:
    """Identify repeat group boundaries and their structure."""
    # Group fields by section + repeatGroup
    groups: dict[str, dict[str, Any]] = {}

    for f in registry:
        rg = f.get("repeatGroup")
        if not rg:
            continue

        section = f["section"]
        key = f"{section}:{rg}"

        if key not in groups:
            groups[key] = {
                "section": section,
                "repeatGroup": rg,
                "maxIndex": 0,
                "fieldsPerEntry": 0,
                "totalFields": 0,
                "sampleFieldKeys": [],
                "indices": set(),
            }

        idx = f.get("repeatIndex", 0)
        groups[key]["indices"].add(idx)
        groups[key]["totalFields"] += 1
        if idx == 0:
            groups[key]["fieldsPerEntry"] += 1
            if len(groups[key]["sampleFieldKeys"]) < 5:
                groups[key]["sampleFieldKeys"].append(f["semanticKey"])

    # Finalize
    result = {}
    for key, info in groups.items():
        info["maxIndex"] = max(info["indices"]) if info["indices"] else 0
        info["maxPdfEntries"] = len(info["indices"])
        del info["indices"]
        result[key] = info

    return result


def build_section_instructions(
    pages: list[dict[str, Any]],
    registry: list[dict[str, Any]],
) -> dict[str, dict[str, Any]]:
    """Extract per-section instruction text and question summaries."""
    # Group registry fields by section
    fields_by_section: dict[str, list[dict[str, Any]]] = {}
    for f in registry:
        sec = f["section"]
        if sec not in fields_by_section:
            fields_by_section[sec] = []
        fields_by_section[sec].append(f)

    section_info: dict[str, dict[str, Any]] = {}

    for sec, fields in sorted(fields_by_section.items()):
        # Find pages that contain this section's fields
        sec_pages = sorted(set(f.get("pdfPage", 1) for f in fields))

        # Collect all question texts and instructions from those pages
        questions = []
        instructions = []
        conditionals = []
        cert_texts = []

        for page in pages:
            if page["pageNum"] in sec_pages:
                for qg in page["questionGroups"]:
                    # Only include questions that have fields in this section
                    sec_fields_in_q = [
                        k for k in qg.get("fieldKeys", [])
                        if any(f["semanticKey"] == k and f["section"] == sec for f in registry)
                    ]
                    if sec_fields_in_q:
                        questions.append({
                            "text": qg["questionText"],
                            "instruction": qg.get("instructionText", ""),
                            "fieldKeys": sec_fields_in_q,
                            "conditionals": qg.get("conditionalInstructions", []),
                        })
                for inst in page.get("instructions", []):
                    instructions.append(inst["text"])
                for cond in page.get("conditionalInstructions", []):
                    conditionals.append(cond)
                cert_texts.extend(page.get("certificationTexts", []))

        section_info[sec] = {
            "pages": sec_pages,
            "fieldCount": len(fields),
            "questions": questions,
            "instructions": instructions[:10],  # Cap at 10
            "conditionalInstructions": conditionals,
            "certificationTexts": cert_texts,
        }

    return section_info


def extract_certification_text(pages: list[dict[str, Any]]) -> dict[str, Any]:
    """Extract certification/signature text from the last pages (section 30)."""
    cert_blocks = []
    for page in pages:
        for text in page.get("certificationTexts", []):
            cert_blocks.append(text)

    # Join nearby certification blocks
    full_text = " ".join(cert_blocks)

    return {
        "fullText": full_text,
        "blocks": cert_blocks,
    }


# ---------------------------------------------------------------------------
# Main analysis
# ---------------------------------------------------------------------------

def run_analysis(
    pdf_path: str,
    registry_path: str,
    output_path: str,
) -> dict[str, Any]:
    """Run full PDF analysis and produce the output JSON."""
    print(f"\n=== SF-86 PDF Page-by-Page Analysis ===\n")
    print(f"PDF:      {pdf_path}")
    print(f"Registry: {registry_path}")

    # Load registry
    registry = json.loads(Path(registry_path).read_text())
    print(f"Loaded {len(registry)} fields from registry")

    # Index fields by page
    fields_by_page: dict[int, list[dict[str, Any]]] = {}
    for f in registry:
        page = f.get("pdfPage", 1)
        if page not in fields_by_page:
            fields_by_page[page] = []
        fields_by_page[page].append(f)

    # Open PDF
    doc = fitz.open(pdf_path)
    total_pages = len(doc)
    print(f"PDF has {total_pages} pages")

    start = time.time()

    # Analyze each page
    pages = []
    for page_num in range(total_pages):
        page_fields = fields_by_page.get(page_num + 1, [])  # Registry uses 1-based pages
        page_data = analyze_page(doc, page_num, page_fields)
        pages.append(page_data)

        if (page_num + 1) % 20 == 0:
            print(f"  Analyzed page {page_num + 1}/{total_pages}")

    doc.close()

    # Cross-page analysis
    print("Building conditional map...")
    conditional_map = build_conditional_map(pages, registry)

    print("Building repeat group boundaries...")
    repeat_boundaries = build_repeat_group_boundaries(registry)

    print("Building section instructions...")
    section_info = build_section_instructions(pages, registry)

    print("Extracting certification text...")
    certification = extract_certification_text(pages)

    elapsed = time.time() - start

    # Assemble output
    output = {
        "metadata": {
            "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "pdfPath": pdf_path,
            "totalPages": total_pages,
            "totalFields": len(registry),
            "analysisTimeSeconds": round(elapsed, 1),
        },
        "pages": pages,
        "conditionalMap": conditional_map,
        "repeatGroupBoundaries": repeat_boundaries,
        "sectionInstructions": section_info,
        "certificationText": certification,
    }

    # Write output
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    Path(output_path).write_text(json.dumps(output, indent=2))

    # Summary
    total_questions = sum(len(p["questionGroups"]) for p in pages)
    total_conditionals = sum(len(p["conditionalInstructions"]) for p in pages)
    total_headers = sum(len(p["sectionHeaders"]) for p in pages)
    total_certs = sum(len(p["certificationTexts"]) for p in pages)

    print(f"\n=== ANALYSIS COMPLETE ({elapsed:.1f}s) ===")
    print(f"Pages analyzed:          {total_pages}")
    print(f"Section headers found:   {total_headers}")
    print(f"Question groups found:   {total_questions}")
    print(f"Conditional instructions:{total_conditionals}")
    print(f"Certification blocks:    {total_certs}")
    print(f"Gate fields mapped:      {len(conditional_map)}")
    print(f"Repeat groups found:     {len(repeat_boundaries)}")
    print(f"\nOutput saved to: {output_path}")

    return output


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    import argparse

    parser = argparse.ArgumentParser(
        description="SF-86 PDF page-by-page analysis for wizard generation"
    )
    parser.add_argument(
        "--pdf", default="/app/templates/sf861.pdf",
        help="Path to SF-86 template PDF",
    )
    parser.add_argument(
        "--registry", default="/app/field-registry.json",
        help="Path to field-registry.json",
    )
    parser.add_argument(
        "--output", default="/app/pdf-analysis.json",
        help="Output JSON path",
    )

    args = parser.parse_args()
    run_analysis(args.pdf, args.registry, args.output)


if __name__ == "__main__":
    main()

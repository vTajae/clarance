"""
Core PDF operations for the SF-86 form system.

Uses PyMuPDF (fitz) to extract, fill, and merge AcroForm PDF documents.
The SF-86 PDF contains 6,197 AcroForm fields across 127 pages. Operations
here are optimized for that scale and complete in sub-second time.

PyMuPDF widget field_type mapping:
    0 = None / Unknown
    1 = Pushbutton
    2 = Checkbox
    3 = RadioButton
    4 = Text
    5 = Listbox
    6 = Combobox
    7 = Signature
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field as dc_field
from pathlib import Path
from typing import Any

import fitz  # PyMuPDF

logger = logging.getLogger("pdf_ops")

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

FIELD_TYPE_LABELS: dict[int, str] = {
    0: "unknown",
    1: "pushbutton",
    2: "checkbox",
    3: "radio",
    4: "text",
    5: "listbox",
    6: "combobox",
    7: "signature",
}

# Checkbox "on" values that PyMuPDF may report
_CHECKBOX_ON = {"Yes", "On", "True", "1"}

# Continuation page layout constants (points; 1pt = 1/72 inch)
_CONT_PAGE_WIDTH = 612.0   # Letter width
_CONT_PAGE_HEIGHT = 792.0  # Letter height
_CONT_MARGIN = 54.0        # 0.75 inch margins
_CONT_HEADER_SIZE = 14.0
_CONT_BODY_SIZE = 10.0
_CONT_LINE_HEIGHT = 14.0


# ---------------------------------------------------------------------------
# Data classes
# ---------------------------------------------------------------------------

@dataclass(frozen=True, slots=True)
class FieldMeta:
    """Complete metadata for a single AcroForm field."""

    field_name: str
    field_type: str
    field_type_id: int
    page: int
    x: float
    y: float
    width: float
    height: float
    field_value: Any = None
    choice_values: list[str] = dc_field(default_factory=list)
    max_length: int | None = None
    field_flags: int = 0
    default_value: str | None = None

    def to_dict(self) -> dict[str, Any]:
        return {
            "field_name": self.field_name,
            "field_type": self.field_type,
            "field_type_id": self.field_type_id,
            "page": self.page,
            "x": round(self.x, 2),
            "y": round(self.y, 2),
            "width": round(self.width, 2),
            "height": round(self.height, 2),
            "field_value": self.field_value,
            "choice_values": self.choice_values,
            "max_length": self.max_length,
            "field_flags": self.field_flags,
            "default_value": self.default_value,
        }


# ---------------------------------------------------------------------------
# Extraction
# ---------------------------------------------------------------------------

def extract_all_fields(pdf_bytes: bytes) -> dict[str, Any]:
    """Extract field values from a PDF byte stream.

    Returns a dict of ``{field_name: value}`` for every field that carries a
    non-empty value. Checkboxes return ``"Yes"`` / ``"No"``. Combobox and
    listbox fields return their selected option string.  Text fields return
    the text content.

    Args:
        pdf_bytes: Raw bytes of the PDF file.

    Returns:
        Dictionary mapping field names to their current values.

    Raises:
        ValueError: If the bytes cannot be opened as a PDF.
    """
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    except Exception as exc:
        raise ValueError(f"Failed to open PDF: {exc}") from exc

    result: dict[str, Any] = {}

    try:
        for page_index in range(doc.page_count):
            page = doc[page_index]
            for widget in page.widgets():
                name = widget.field_name
                if not name:
                    continue

                ft = widget.field_type

                # Checkbox
                if ft == fitz.PDF_WIDGET_TYPE_CHECKBOX:
                    value = widget.field_value
                    result[name] = "Yes" if value in _CHECKBOX_ON else "No"

                # Radio button
                elif ft == fitz.PDF_WIDGET_TYPE_RADIOBUTTON:
                    value = widget.field_value
                    if value and value != "Off":
                        result[name] = value

                # Text
                elif ft == fitz.PDF_WIDGET_TYPE_TEXT:
                    value = widget.field_value
                    if value:
                        result[name] = value

                # Combobox / Listbox
                elif ft in (
                    fitz.PDF_WIDGET_TYPE_COMBOBOX,
                    fitz.PDF_WIDGET_TYPE_LISTBOX,
                ):
                    value = widget.field_value
                    if value:
                        result[name] = value

                # Other types (pushbutton, signature) are skipped
    finally:
        doc.close()

    logger.info("Extracted %d field values from uploaded PDF", len(result))
    return result


def extract_field_metadata(pdf_path: str) -> list[dict[str, Any]]:
    """Extract comprehensive metadata for every AcroForm field in a PDF.

    This is the heavy-duty introspection used to build the field registry.
    For each widget it captures: name, type, page, bounding rect, options,
    max-length, flags, and default value.

    Args:
        pdf_path: Filesystem path to the PDF template.

    Returns:
        List of dicts, one per field, suitable for JSON serialization.

    Raises:
        FileNotFoundError: If *pdf_path* does not exist.
        ValueError: If the file cannot be opened as a PDF.
    """
    path = Path(pdf_path)
    if not path.is_file():
        raise FileNotFoundError(f"Template PDF not found: {pdf_path}")

    try:
        doc = fitz.open(str(path))
    except Exception as exc:
        raise ValueError(f"Failed to open PDF at {pdf_path}: {exc}") from exc

    fields: list[dict[str, Any]] = []

    try:
        for page_index in range(doc.page_count):
            page = doc[page_index]
            for widget in page.widgets():
                name = widget.field_name
                if not name:
                    continue

                ft = widget.field_type
                rect = widget.rect  # fitz.Rect(x0, y0, x1, y1)

                # Extract choice values for combobox / listbox
                choices: list[str] = []
                if ft in (
                    fitz.PDF_WIDGET_TYPE_COMBOBOX,
                    fitz.PDF_WIDGET_TYPE_LISTBOX,
                ):
                    raw = widget.choice_values
                    if raw:
                        # choice_values may be list of strings or list of
                        # (export_value, display_value) tuples
                        for item in raw:
                            if isinstance(item, (list, tuple)):
                                choices.append(str(item[0]))
                            else:
                                choices.append(str(item))

                # Extract radio button choices from the widget's xref
                if ft == fitz.PDF_WIDGET_TYPE_RADIOBUTTON:
                    raw = widget.choice_values
                    if raw:
                        for item in raw:
                            if isinstance(item, (list, tuple)):
                                choices.append(str(item[0]))
                            else:
                                choices.append(str(item))

                # Max length (only meaningful for text fields)
                max_len: int | None = None
                if ft == fitz.PDF_WIDGET_TYPE_TEXT:
                    ml = widget.text_maxlen
                    if ml and ml > 0:
                        max_len = ml

                meta = FieldMeta(
                    field_name=name,
                    field_type=FIELD_TYPE_LABELS.get(ft, "unknown"),
                    field_type_id=ft,
                    page=page_index,
                    x=rect.x0,
                    y=rect.y0,
                    width=rect.x1 - rect.x0,
                    height=rect.y1 - rect.y0,
                    field_value=widget.field_value or None,
                    choice_values=choices,
                    max_length=max_len,
                    field_flags=widget.field_flags,
                    default_value=widget.field_value or None,
                )
                fields.append(meta.to_dict())
    finally:
        doc.close()

    logger.info(
        "Extracted metadata for %d fields from %s", len(fields), pdf_path
    )
    return fields


# ---------------------------------------------------------------------------
# Filling
# ---------------------------------------------------------------------------

def fill_pdf(template_path: str, values: dict[str, str]) -> bytes:
    """Fill AcroForm fields in a PDF template and return the result as bytes.

    Handles text, checkbox, radio, combobox, and listbox fields.  Unknown
    field types are logged and skipped.

    Args:
        template_path: Filesystem path to the PDF template.
        values: Dict mapping field names to their desired string values.
                Checkboxes accept ``"Yes"`` / ``"No"`` (case-insensitive).

    Returns:
        Bytes of the filled PDF.

    Raises:
        FileNotFoundError: If *template_path* does not exist.
        ValueError: If the template cannot be opened.
    """
    path = Path(template_path)
    if not path.is_file():
        raise FileNotFoundError(f"Template PDF not found: {template_path}")

    try:
        doc = fitz.open(str(path))
    except Exception as exc:
        raise ValueError(
            f"Failed to open template PDF: {exc}"
        ) from exc

    fields_set = 0
    fields_skipped = 0

    try:
        for page_index in range(doc.page_count):
            page = doc[page_index]
            for widget in page.widgets():
                name = widget.field_name
                if not name or name not in values:
                    continue

                new_value = values[name]
                ft = widget.field_type

                try:
                    if ft == fitz.PDF_WIDGET_TYPE_TEXT:
                        widget.field_value = new_value
                        widget.update()
                        fields_set += 1

                    elif ft == fitz.PDF_WIDGET_TYPE_CHECKBOX:
                        if new_value.strip().lower() in ("yes", "true", "1", "on"):
                            widget.field_value = "Yes"
                        else:
                            widget.field_value = "Off"
                        widget.update()
                        fields_set += 1

                    elif ft == fitz.PDF_WIDGET_TYPE_RADIOBUTTON:
                        widget.field_value = new_value
                        widget.update()
                        fields_set += 1

                    elif ft in (
                        fitz.PDF_WIDGET_TYPE_COMBOBOX,
                        fitz.PDF_WIDGET_TYPE_LISTBOX,
                    ):
                        widget.field_value = new_value
                        widget.update()
                        fields_set += 1

                    else:
                        logger.debug(
                            "Skipping unsupported field type %d for '%s'",
                            ft,
                            name,
                        )
                        fields_skipped += 1

                except Exception:
                    logger.exception(
                        "Error setting field '%s' to '%s'", name, new_value
                    )
                    fields_skipped += 1

        result = doc.tobytes(deflate=True, garbage=3)
    finally:
        doc.close()

    logger.info(
        "Filled PDF: %d fields set, %d skipped", fields_set, fields_skipped
    )
    return result


# ---------------------------------------------------------------------------
# Continuation pages
# ---------------------------------------------------------------------------

def generate_continuation_page(overflow_data: dict[str, list[dict[str, str]]]) -> bytes:
    """Generate continuation pages for fields that overflow the PDF's slots.

    The SF-86 has a fixed number of repeating slots per section (e.g. 4
    address blocks). When the applicant has more entries, the extras go onto
    government-standard continuation pages.

    Args:
        overflow_data: Dict mapping section names to lists of entry dicts.
            Each entry dict maps label names to their values.
            Example::

                {
                    "Section 11 - Residence": [
                        {"Street": "123 Main St", "City": "Anytown", ...},
                        {"Street": "456 Oak Ave", "City": "Otherplace", ...},
                    ]
                }

    Returns:
        Bytes of a PDF containing the continuation pages.
    """
    doc = fitz.open()

    for section_name, entries in overflow_data.items():
        if not entries:
            continue

        for entry_index, entry in enumerate(entries):
            page = doc.new_page(
                width=_CONT_PAGE_WIDTH, height=_CONT_PAGE_HEIGHT
            )

            # -- Header --
            y_cursor = _CONT_MARGIN
            header_rect = fitz.Rect(
                _CONT_MARGIN,
                y_cursor,
                _CONT_PAGE_WIDTH - _CONT_MARGIN,
                y_cursor + _CONT_HEADER_SIZE + 4,
            )
            page.insert_textbox(
                header_rect,
                "SF-86 Continuation Sheet",
                fontsize=_CONT_HEADER_SIZE,
                fontname="helv",
                align=fitz.TEXT_ALIGN_CENTER,
            )
            y_cursor += _CONT_HEADER_SIZE + 12

            # -- Section label --
            section_rect = fitz.Rect(
                _CONT_MARGIN,
                y_cursor,
                _CONT_PAGE_WIDTH - _CONT_MARGIN,
                y_cursor + _CONT_BODY_SIZE + 4,
            )
            page.insert_textbox(
                section_rect,
                f"{section_name}  (Additional Entry {entry_index + 1})",
                fontsize=_CONT_BODY_SIZE + 1,
                fontname="helvb",
            )
            y_cursor += _CONT_BODY_SIZE + 16

            # -- Separator line --
            page.draw_line(
                fitz.Point(_CONT_MARGIN, y_cursor),
                fitz.Point(_CONT_PAGE_WIDTH - _CONT_MARGIN, y_cursor),
                width=0.5,
            )
            y_cursor += 8

            # -- Entry fields --
            max_label_width = (_CONT_PAGE_WIDTH - 2 * _CONT_MARGIN) * 0.35
            value_x = _CONT_MARGIN + max_label_width + 8

            for label, value in entry.items():
                if y_cursor + _CONT_LINE_HEIGHT * 2 > _CONT_PAGE_HEIGHT - _CONT_MARGIN:
                    # Start a new page if we run out of space
                    page = doc.new_page(
                        width=_CONT_PAGE_WIDTH, height=_CONT_PAGE_HEIGHT
                    )
                    y_cursor = _CONT_MARGIN

                    # Repeat header on new page
                    header_rect = fitz.Rect(
                        _CONT_MARGIN,
                        y_cursor,
                        _CONT_PAGE_WIDTH - _CONT_MARGIN,
                        y_cursor + _CONT_HEADER_SIZE + 4,
                    )
                    page.insert_textbox(
                        header_rect,
                        "SF-86 Continuation Sheet (cont.)",
                        fontsize=_CONT_HEADER_SIZE,
                        fontname="helv",
                        align=fitz.TEXT_ALIGN_CENTER,
                    )
                    y_cursor += _CONT_HEADER_SIZE + 16

                # Label
                label_rect = fitz.Rect(
                    _CONT_MARGIN,
                    y_cursor,
                    _CONT_MARGIN + max_label_width,
                    y_cursor + _CONT_LINE_HEIGHT,
                )
                page.insert_textbox(
                    label_rect,
                    f"{label}:",
                    fontsize=_CONT_BODY_SIZE,
                    fontname="helvb",
                )

                # Value (may wrap across multiple lines)
                value_str = str(value) if value else ""
                available_width = (
                    _CONT_PAGE_WIDTH - _CONT_MARGIN - value_x
                )
                # Estimate number of lines needed
                chars_per_line = max(1, int(available_width / (_CONT_BODY_SIZE * 0.5)))
                num_lines = max(1, (len(value_str) + chars_per_line - 1) // chars_per_line)
                value_height = _CONT_LINE_HEIGHT * num_lines

                value_rect = fitz.Rect(
                    value_x,
                    y_cursor,
                    _CONT_PAGE_WIDTH - _CONT_MARGIN,
                    y_cursor + value_height,
                )
                page.insert_textbox(
                    value_rect,
                    value_str,
                    fontsize=_CONT_BODY_SIZE,
                    fontname="helv",
                )

                y_cursor += value_height + 4

    result = doc.tobytes(deflate=True)
    doc.close()

    logger.info(
        "Generated continuation pages: %d sections, %d total entries",
        len(overflow_data),
        sum(len(v) for v in overflow_data.values()),
    )
    return result


# ---------------------------------------------------------------------------
# Merging
# ---------------------------------------------------------------------------

def merge_pdfs(main_pdf: bytes, continuation: bytes) -> bytes:
    """Merge a main PDF with continuation pages into a single document.

    Args:
        main_pdf: Bytes of the primary filled PDF.
        continuation: Bytes of the continuation-page PDF.

    Returns:
        Bytes of the merged PDF.

    Raises:
        ValueError: If either input cannot be opened as a PDF.
    """
    try:
        main_doc = fitz.open(stream=main_pdf, filetype="pdf")
    except Exception as exc:
        raise ValueError(f"Failed to open main PDF for merge: {exc}") from exc

    try:
        cont_doc = fitz.open(stream=continuation, filetype="pdf")
    except Exception as exc:
        main_doc.close()
        raise ValueError(
            f"Failed to open continuation PDF for merge: {exc}"
        ) from exc

    try:
        main_doc.insert_pdf(cont_doc)
        result = main_doc.tobytes(deflate=True, garbage=3)
    finally:
        cont_doc.close()
        main_doc.close()

    logger.info("Merged PDFs: main + continuation")
    return result

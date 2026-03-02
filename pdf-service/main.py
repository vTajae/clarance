"""
SF-86 PDF Microservice

FastAPI application providing PDF extraction, filling, and continuation-page
generation for the SF-86 (Questionnaire for National Security Positions).

The SF-86 PDF contains 6,197 AcroForm fields across 127 pages. This service
uses PyMuPDF for sub-second field operations at that scale.

Endpoints:
    POST /extract-fields             Extract field values from an uploaded PDF
    POST /fill-pdf                   Fill a template PDF with provided values
    POST /fill-pdf-with-continuation Fill + generate continuation pages
    GET  /field-coordinates/{version} Full field metadata for a template
    GET  /health                      Health check
"""

from __future__ import annotations

import asyncio
import logging
import time
from pathlib import Path
from typing import Any

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel, Field

import pdf_ops

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("sf86_pdf_service")

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

TEMPLATES_DIR = Path(__file__).resolve().parent / "templates"

# Map version slugs to template filenames
VERSION_MAP: dict[str, str] = {
    "sf861": "sf861.pdf",
    "sf862": "sf862.pdf",
}

# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------


class FillPdfRequest(BaseModel):
    """Request body for the fill-pdf endpoint."""

    template_path: str = Field(
        ...,
        description=(
            "Path to the template PDF relative to the templates directory, "
            "or an absolute path. Example: 'sf861.pdf'"
        ),
    )
    field_values: dict[str, str] = Field(
        ...,
        description=(
            "Mapping of AcroForm field names to their desired values. "
            "Checkboxes accept 'Yes'/'No' (case-insensitive)."
        ),
    )


class FillPdfWithContinuationRequest(BaseModel):
    """Request body for fill-pdf-with-continuation."""

    template_path: str = Field(
        ...,
        description="Path to the template PDF (relative or absolute).",
    )
    field_values: dict[str, str] = Field(
        ...,
        description="Mapping of AcroForm field names to values.",
    )
    overflow_data: dict[str, list[dict[str, str]]] = Field(
        default_factory=dict,
        description=(
            "Overflow entries keyed by section name. Each value is a list "
            "of dicts mapping label to value. Example: "
            '{"Section 11 - Residence": [{"Street": "123 Main", ...}]}'
        ),
    )


class ExtractFieldsResponse(BaseModel):
    """Response from the extract-fields endpoint."""

    field_count: int
    fields: dict[str, Any]


class FieldMetadataResponse(BaseModel):
    """Response from the field-coordinates endpoint."""

    version: str
    template: str
    field_count: int
    fields: list[dict[str, Any]]


class HealthResponse(BaseModel):
    """Response from the health endpoint."""

    status: str
    service: str
    templates_available: list[str]


# ---------------------------------------------------------------------------
# Application
# ---------------------------------------------------------------------------

app = FastAPI(
    title="SF-86 PDF Service",
    description=(
        "Microservice for extracting, filling, and generating SF-86 "
        "government form PDFs. Handles 6,197 AcroForm fields across 127 pages."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _resolve_template(template_path: str) -> str:
    """Resolve a template path to an absolute filesystem path.

    Accepts either a bare filename (resolved relative to TEMPLATES_DIR) or an
    absolute path. Raises HTTPException 404 if the file does not exist.
    """
    candidate = Path(template_path)

    # If not absolute, treat as relative to templates directory
    if not candidate.is_absolute():
        candidate = TEMPLATES_DIR / candidate

    resolved = candidate.resolve()

    # Security: ALL paths must resolve within the templates directory
    if not str(resolved).startswith(str(TEMPLATES_DIR.resolve())):
        raise HTTPException(
            status_code=400,
            detail="Template path must resolve within the templates directory.",
        )

    if not resolved.is_file():
        raise HTTPException(
            status_code=404,
            detail=f"Template PDF not found: {resolved.name}",
        )

    return str(resolved)


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@app.post(
    "/extract-fields",
    response_model=ExtractFieldsResponse,
    summary="Extract field values from an uploaded PDF",
    description=(
        "Upload a filled SF-86 PDF and receive a JSON dict of all field "
        "names mapped to their current values."
    ),
)
async def extract_fields(file: UploadFile = File(...)):
    """Accept a PDF upload and return all populated AcroForm field values."""
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Uploaded file must be a PDF.",
        )

    pdf_bytes = await file.read()
    if not pdf_bytes:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty.",
        )

    start = time.perf_counter()
    try:
        fields = await asyncio.to_thread(pdf_ops.extract_all_fields, pdf_bytes)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except Exception as exc:
        logger.exception("Unexpected error during field extraction")
        raise HTTPException(
            status_code=500,
            detail=f"Field extraction failed: {exc}",
        )

    elapsed = time.perf_counter() - start
    logger.info(
        "extract-fields: %d fields in %.3fs from '%s'",
        len(fields),
        elapsed,
        file.filename,
    )

    return ExtractFieldsResponse(field_count=len(fields), fields=fields)


@app.post(
    "/fill-pdf",
    summary="Fill a template PDF with field values",
    description=(
        "Provide a template path and a dict of field values. Returns the "
        "filled PDF as a binary download."
    ),
    responses={
        200: {
            "content": {"application/pdf": {}},
            "description": "Filled PDF document.",
        }
    },
)
async def fill_pdf_endpoint(request: FillPdfRequest):
    """Fill fields in a template PDF and return the result."""
    resolved = _resolve_template(request.template_path)

    if not request.field_values:
        raise HTTPException(
            status_code=400, detail="field_values must not be empty."
        )

    start = time.perf_counter()
    try:
        pdf_bytes = await asyncio.to_thread(
            pdf_ops.fill_pdf, resolved, request.field_values
        )
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except Exception as exc:
        logger.exception("Unexpected error during PDF fill")
        raise HTTPException(
            status_code=500, detail=f"PDF fill failed: {exc}"
        )

    elapsed = time.perf_counter() - start
    logger.info(
        "fill-pdf: %d values applied in %.3fs", len(request.field_values), elapsed
    )

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": "attachment; filename=sf86_filled.pdf"
        },
    )


@app.post(
    "/fill-pdf-with-continuation",
    summary="Fill a template PDF and append continuation pages",
    description=(
        "Fill the main form, then generate continuation pages for any "
        "overflow entries (e.g. more addresses than the form has slots for). "
        "Returns a single merged PDF."
    ),
    responses={
        200: {
            "content": {"application/pdf": {}},
            "description": "Filled PDF with continuation pages appended.",
        }
    },
)
async def fill_pdf_with_continuation(request: FillPdfWithContinuationRequest):
    """Fill fields, generate continuation pages for overflow, merge, return."""
    resolved = _resolve_template(request.template_path)

    if not request.field_values:
        raise HTTPException(
            status_code=400, detail="field_values must not be empty."
        )

    start = time.perf_counter()

    # Step 1: Fill the main PDF
    try:
        main_pdf = await asyncio.to_thread(
            pdf_ops.fill_pdf, resolved, request.field_values
        )
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except Exception as exc:
        logger.exception("Error filling main PDF")
        raise HTTPException(
            status_code=500, detail=f"PDF fill failed: {exc}"
        )

    # Step 2: Generate and merge continuation pages if overflow data exists
    if request.overflow_data:
        try:
            continuation = await asyncio.to_thread(
                pdf_ops.generate_continuation_page, request.overflow_data
            )
            merged = await asyncio.to_thread(
                pdf_ops.merge_pdfs, main_pdf, continuation
            )
        except ValueError as exc:
            raise HTTPException(status_code=422, detail=str(exc))
        except Exception as exc:
            logger.exception("Error generating continuation pages")
            raise HTTPException(
                status_code=500,
                detail=f"Continuation page generation failed: {exc}",
            )
        result_bytes = merged
    else:
        result_bytes = main_pdf

    elapsed = time.perf_counter() - start
    overflow_count = sum(len(v) for v in request.overflow_data.values())
    logger.info(
        "fill-pdf-with-continuation: %d values + %d overflow entries in %.3fs",
        len(request.field_values),
        overflow_count,
        elapsed,
    )

    return Response(
        content=result_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": (
                "attachment; filename=sf86_filled_with_continuation.pdf"
            )
        },
    )


@app.get(
    "/field-coordinates/{version}",
    response_model=FieldMetadataResponse,
    summary="Get full field metadata for a template PDF",
    description=(
        "Extract complete metadata for every AcroForm field in the specified "
        "SF-86 template version. Includes field name, type, page number, "
        "bounding rectangle, choice options, max length, and flags."
    ),
)
async def field_coordinates(version: str):
    """Return comprehensive metadata for all fields in a template PDF.

    Args:
        version: Template version slug. Must be one of: sf861, sf862.
    """
    version_lower = version.lower()
    if version_lower not in VERSION_MAP:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Unknown version '{version}'. "
                f"Supported: {', '.join(VERSION_MAP.keys())}"
            ),
        )

    template_filename = VERSION_MAP[version_lower]
    template_path = TEMPLATES_DIR / template_filename

    if not template_path.is_file():
        raise HTTPException(
            status_code=404,
            detail=(
                f"Template file '{template_filename}' not found in "
                f"templates directory. Place it at: {template_path}"
            ),
        )

    start = time.perf_counter()
    try:
        fields = await asyncio.to_thread(
            pdf_ops.extract_field_metadata, str(template_path)
        )
    except (FileNotFoundError, ValueError) as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except Exception as exc:
        logger.exception("Error extracting field metadata")
        raise HTTPException(
            status_code=500,
            detail=f"Metadata extraction failed: {exc}",
        )

    elapsed = time.perf_counter() - start
    logger.info(
        "field-coordinates/%s: %d fields in %.3fs",
        version_lower,
        len(fields),
        elapsed,
    )

    return FieldMetadataResponse(
        version=version_lower,
        template=template_filename,
        field_count=len(fields),
        fields=fields,
    )


@app.get(
    "/render-page/{version}/{page_num}",
    summary="Render a PDF page as a PNG image",
    description=(
        "Render a specific page from an SF-86 template as a PNG image. "
        "Used for visual field verification. Supports optional DPI parameter."
    ),
    responses={
        200: {
            "content": {"image/png": {}},
            "description": "PNG image of the rendered page.",
        }
    },
)
async def render_page(version: str, page_num: int, dpi: int = 150):
    """Render a single PDF page as a PNG image."""
    dpi = max(50, min(dpi, 600))  # Clamp DPI to safe range
    version_lower = version.lower()
    if version_lower not in VERSION_MAP:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown version '{version}'. Supported: {', '.join(VERSION_MAP.keys())}",
        )

    template_path = TEMPLATES_DIR / VERSION_MAP[version_lower]
    if not template_path.is_file():
        raise HTTPException(status_code=404, detail=f"Template not found: {template_path}")

    import fitz
    doc = fitz.open(str(template_path))
    try:
        if page_num < 0 or page_num >= doc.page_count:
            raise HTTPException(
                status_code=400,
                detail=f"Page {page_num} out of range (0-{doc.page_count - 1})",
            )
        page = doc[page_num]
        zoom = dpi / 72.0
        mat = fitz.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=mat)
        png_bytes = pix.tobytes("png")
    finally:
        doc.close()

    return Response(
        content=png_bytes,
        media_type="image/png",
        headers={"Cache-Control": "public, max-age=86400"},
    )


class RenderFilledPageRequest(BaseModel):
    """Request body for render-filled-page."""

    field_values: dict[str, str] = Field(
        default_factory=dict,
        description="AcroForm field name → value mapping for the fields to fill.",
    )


@app.post(
    "/render-filled-page/{version}/{page_num}",
    summary="Fill fields and render a single page as PNG (live preview)",
    description=(
        "Fills the provided field values into the PDF in memory and renders "
        "the specified page as a PNG image. Fast path for live preview — "
        "never writes the full PDF to bytes."
    ),
    responses={
        200: {
            "content": {"image/png": {}},
            "description": "PNG image of the rendered page with filled values.",
        }
    },
)
async def render_filled_page(
    version: str, page_num: int, body: RenderFilledPageRequest, dpi: int = 72,
):
    """Fill fields in memory and render a single page as PNG."""
    dpi = max(50, min(dpi, 600))  # Clamp DPI to safe range
    version_lower = version.lower()
    if version_lower not in VERSION_MAP:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown version '{version}'. Supported: {', '.join(VERSION_MAP.keys())}",
        )

    template_path = TEMPLATES_DIR / VERSION_MAP[version_lower]
    if not template_path.is_file():
        raise HTTPException(status_code=404, detail=f"Template not found: {template_path}")

    start = time.perf_counter()
    try:
        png_bytes = await asyncio.to_thread(
            pdf_ops.fill_and_render_page,
            str(template_path),
            body.field_values,
            page_num,
            dpi,
        )
    except (FileNotFoundError, ValueError) as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception as exc:
        logger.exception("Error in render-filled-page")
        raise HTTPException(status_code=500, detail=str(exc))

    elapsed = time.perf_counter() - start
    logger.info(
        "render-filled-page/%s/%d: %d values, %.3fs",
        version_lower, page_num, len(body.field_values), elapsed,
    )

    return Response(
        content=png_bytes,
        media_type="image/png",
        headers={"Cache-Control": "no-cache"},
    )


@app.get(
    "/render-crop/{version}/{page_num}",
    summary="Render a cropped region of a PDF page as PNG",
    description=(
        "Render a specific rectangular region of a PDF page as a PNG image. "
        "Coordinates are in PDF units (points). Adds configurable padding around the crop."
    ),
    responses={
        200: {
            "content": {"image/png": {}},
            "description": "Cropped PNG image of the specified region.",
        }
    },
)
async def render_crop(
    version: str,
    page_num: int,
    x: float = 0,
    y: float = 0,
    w: float = 100,
    h: float = 20,
    padding: float = 40,
    dpi: int = 200,
):
    """Render a cropped region of a PDF page, with padding for context."""
    dpi = max(50, min(dpi, 600))  # Clamp DPI to safe range
    version_lower = version.lower()
    if version_lower not in VERSION_MAP:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown version '{version}'.",
        )

    template_path = TEMPLATES_DIR / VERSION_MAP[version_lower]
    if not template_path.is_file():
        raise HTTPException(status_code=404, detail="Template not found.")

    import fitz
    doc = fitz.open(str(template_path))
    try:
        if page_num < 0 or page_num >= doc.page_count:
            raise HTTPException(
                status_code=400,
                detail=f"Page {page_num} out of range.",
            )
        page = doc[page_num]
        page_rect = page.rect

        # Build crop rect with padding, clamped to page bounds
        crop = fitz.Rect(
            max(x - padding, page_rect.x0),
            max(y - padding, page_rect.y0),
            min(x + w + padding, page_rect.x1),
            min(y + h + padding, page_rect.y1),
        )

        zoom = dpi / 72.0
        mat = fitz.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=mat, clip=crop)
        png_bytes = pix.tobytes("png")
    finally:
        doc.close()

    return Response(
        content=png_bytes,
        media_type="image/png",
        headers={"Cache-Control": "public, max-age=86400"},
    )


@app.get(
    "/health",
    response_model=HealthResponse,
    summary="Health check",
    description="Returns service status and available templates.",
)
async def health():
    """Simple health check reporting service status and available templates."""
    available = [
        f.name
        for f in TEMPLATES_DIR.iterdir()
        if f.is_file() and f.suffix.lower() == ".pdf"
    ] if TEMPLATES_DIR.is_dir() else []

    return HealthResponse(
        status="healthy",
        service="sf86-pdf-service",
        templates_available=sorted(available),
    )

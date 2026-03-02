// ---------------------------------------------------------------------------
// Center Panel -- PDF page visualization with field overlays
// ---------------------------------------------------------------------------
// Since fields currently have no pdfRect data, we render all fields on a page
// as a list within the page canvas. When pdfRect data is populated (via the
// Python service), fields will be absolutely positioned on the canvas.
// ---------------------------------------------------------------------------

'use client';

import { useMemo, useRef, useEffect } from 'react';
import type { EditableField } from './types';

// Standard US Letter in PDF units (points): 612 x 792
const PDF_WIDTH = 612;
const PDF_HEIGHT = 792;
// Display scale -- how many CSS pixels per PDF point
const DISPLAY_SCALE = 0.95;
const CANVAS_WIDTH = PDF_WIDTH * DISPLAY_SCALE;
const CANVAS_HEIGHT = PDF_HEIGHT * DISPLAY_SCALE;

function confidenceBorderStyle(c: number): string {
  if (c >= 0.8) return 'border-green-500';
  if (c >= 0.5) return 'border-yellow-500';
  return 'border-red-500';
}

function fieldTypeIcon(type: string): string {
  switch (type) {
    case 'PDFTextField':
      return 'T';
    case 'PDFCheckBox':
      return '\u2611';
    case 'PDFRadioGroup':
      return '\u25C9';
    case 'PDFDropdown':
      return '\u25BE';
    default:
      return '?';
  }
}

interface PdfPageViewerProps {
  fields: EditableField[];
  currentPage: number;
  selectedKey: string | null;
  onPageChange: (page: number) => void;
  onSelectField: (semanticKey: string) => void;
  totalPages: number;
}

export function PdfPageViewer({
  fields,
  currentPage,
  selectedKey,
  onPageChange,
  onSelectField,
  totalPages,
}: PdfPageViewerProps) {
  const pageFields = useMemo(
    () => fields.filter((f) => f.pdfPage === currentPage),
    [fields, currentPage],
  );

  const selectedFieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    selectedFieldRef.current?.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth',
    });
  }, [selectedKey]);

  // Split between positioned fields (have pdfRect) and unpositioned
  const { positioned, unpositioned } = useMemo(() => {
    const pos: EditableField[] = [];
    const unpos: EditableField[] = [];
    for (const f of pageFields) {
      if (f.pdfRect && f.pdfRect.width > 0 && f.pdfRect.height > 0) {
        pos.push(f);
      } else {
        unpos.push(f);
      }
    }
    return { positioned: pos, unpositioned: unpos };
  }, [pageFields]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-gray-100">
      {/* ---- Page navigation ---- */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="rounded border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          Prev
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <label htmlFor="page-input" className="sr-only">
            Page number
          </label>
          <span>Page</span>
          <input
            id="page-input"
            type="number"
            min={1}
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val) && val >= 1 && val <= totalPages) {
                onPageChange(val);
              }
            }}
            className="w-14 rounded border border-gray-300 px-2 py-1 text-center text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <span>of {totalPages}</span>
          <span className="ml-2 text-gray-400">
            ({pageFields.length} field{pageFields.length !== 1 ? 's' : ''} on
            this page)
          </span>
        </div>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="rounded border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          Next
        </button>
      </div>

      {/* ---- Canvas area ---- */}
      <div className="flex flex-1 items-start justify-center overflow-auto p-4">
        <div
          className="relative bg-white shadow-lg"
          style={{
            width: CANVAS_WIDTH,
            minHeight: CANVAS_HEIGHT,
          }}
          role="img"
          aria-label={`PDF page ${currentPage} with ${pageFields.length} fields`}
        >
          {/* Page header */}
          <div className="absolute inset-x-0 top-0 border-b border-gray-200 bg-gray-50 px-4 py-2 text-xs text-gray-500">
            SF-86 -- Page {currentPage}
          </div>

          {/* Positioned fields (when pdfRect data exists) */}
          {positioned.map((field) => {
            const rect = field.pdfRect!;
            const isSelected = field.semanticKey === selectedKey;
            // Convert PDF coords to display coords
            // PDF y-origin is bottom-left; we flip to top-left
            const left = rect.x * DISPLAY_SCALE;
            const top = (PDF_HEIGHT - rect.y - rect.height) * DISPLAY_SCALE;
            const width = rect.width * DISPLAY_SCALE;
            const height = rect.height * DISPLAY_SCALE;

            return (
              <div
                key={field.semanticKey}
                ref={isSelected ? selectedFieldRef : undefined}
                onClick={() => onSelectField(field.semanticKey)}
                className={`absolute cursor-pointer border-2 transition-colors ${
                  isSelected
                    ? 'z-20 border-blue-600 bg-blue-200/40'
                    : `z-10 ${confidenceBorderStyle(field.classificationConfidence)} bg-transparent hover:bg-blue-100/20`
                }`}
                style={{ left, top, width, height }}
                title={`${field.label} (${field.semanticKey})`}
                role="button"
                tabIndex={0}
                aria-label={`Field: ${field.label}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectField(field.semanticKey);
                  }
                }}
              />
            );
          })}

          {/* Unpositioned fields (displayed as list when pdfRect is missing) */}
          {unpositioned.length > 0 && (
            <div className="px-3 pt-10 pb-4">
              <p className="mb-3 text-xs text-gray-400">
                Fields on this page (coordinates not yet extracted -- run the
                Python service to populate pdfRect data):
              </p>
              <div className="space-y-1">
                {unpositioned.map((field) => {
                  const isSelected = field.semanticKey === selectedKey;
                  return (
                    <div
                      key={field.semanticKey}
                      ref={isSelected ? selectedFieldRef : undefined}
                      onClick={() => onSelectField(field.semanticKey)}
                      className={`flex cursor-pointer items-center gap-2 rounded border-l-4 px-2 py-1.5 text-xs transition-colors ${
                        confidenceBorderStyle(
                          field.classificationConfidence,
                        )
                      } ${
                        isSelected
                          ? 'bg-blue-100 ring-2 ring-blue-500'
                          : 'bg-gray-50 hover:bg-blue-50'
                      }`}
                      role="button"
                      tabIndex={0}
                      aria-label={`Field: ${field.label}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectField(field.semanticKey);
                        }
                      }}
                    >
                      <span
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-gray-200 text-[10px] font-bold text-gray-600"
                        aria-hidden="true"
                      >
                        {fieldTypeIcon(field.pdfFieldType)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium text-gray-800">
                          {field.label.length > 50
                            ? field.label.slice(0, 47) + '...'
                            : field.label}
                        </div>
                        <div className="truncate text-gray-400">
                          {field.semanticKey}
                        </div>
                      </div>
                      {field.manuallyVerified && (
                        <svg
                          className="h-3.5 w-3.5 shrink-0 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          aria-label="Verified"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {pageFields.length === 0 && (
            <div className="flex items-center justify-center pt-10" style={{ minHeight: CANVAS_HEIGHT }}>
              <p className="text-sm text-gray-400">
                No fields mapped to page {currentPage}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

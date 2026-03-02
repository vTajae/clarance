'use client';

import { memo, useMemo, useState } from 'react';
import type { SF86Section } from '@/lib/field-registry/types';
import type { FieldDefinition } from '@/lib/field-registry/types';
import { useSectionFields, useRegistry } from '@/lib/field-registry/use-registry';
import { AuditModeContext, ConditionalWrapper } from './conditional-wrapper';
import { CoordinateField } from './coordinate-field';
import { RadioCircle } from './radio-circle';
import { useLivePreview } from './use-live-preview';

/** PDF page dimensions in points (US Letter, 72 DPI). */
const PDF_WIDTH = 612;
const PDF_HEIGHT = 792;

interface PdfPageRendererProps {
  section: SF86Section;
  /** Scale factor: 1.0 = 1pt per px (612px wide). */
  scale?: number;
}

/**
 * Renders a section's fields overlaid on actual PDF page images.
 * Each page is rendered as a background image from the PDF service,
 * with form fields absolutely positioned at their exact PDF coordinates.
 *
 * "Live Preview" mode re-renders the PDF with current field values baked in,
 * so you can see them rendered by PyMuPDF exactly as they'll appear in export.
 */
export function PdfPageRenderer({ section, scale = 1.0 }: PdfPageRendererProps) {
  const fields = useSectionFields(section);
  const registry = useRegistry();
  const [showFields, setShowFields] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [fieldOpacity, setFieldOpacity] = useState(80);
  const [livePreview, setLivePreview] = useState(false);

  // Group fields by page number, including ALL fields on the same pages
  // so the user can edit surrounding fields from other sections too.
  const pageMap = useMemo(() => {
    const map = new Map<number, FieldDefinition[]>();

    // First, determine which pages this section occupies
    const sectionPages = new Set<number>();
    for (const field of fields) {
      if (!field.pdfRect) continue;
      sectionPages.add(field.pdfPage);
    }

    // Then, add ALL fields on those pages (from any section) using the page index
    const seen = new Set<string>();
    for (const page of sectionPages) {
      const pageFields = registry.getByPage(page);
      for (const field of pageFields) {
        if (!field.pdfRect) continue;
        if (seen.has(field.semanticKey)) continue;
        seen.add(field.semanticKey);
        let arr = map.get(page);
        if (!arr) {
          arr = [];
          map.set(page, arr);
        }
        arr.push(field);
      }
    }

    return map;
  }, [fields, registry]);

  const sortedPages = useMemo(
    () => Array.from(pageMap.keys()).sort((a, b) => a - b),
    [pageMap],
  );

  // Compute per-page field stats
  const pageStats = useMemo(() => {
    const stats: Record<number, { total: number; groups: Set<string> }> = {};
    for (const [page, pageFields] of pageMap) {
      const groups = new Set<string>();
      for (const f of pageFields) {
        if (f.repeatGroup) groups.add(`${f.repeatGroup}[${f.repeatIndex}]`);
      }
      stats[page] = { total: pageFields.length, groups };
    }
    return stats;
  }, [pageMap]);

  if (sortedPages.length === 0) {
    return (
      <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
        No fields with PDF coordinates found for section &ldquo;{section}&rdquo;.
      </div>
    );
  }

  const scaledWidth = PDF_WIDTH * scale;
  const scaledHeight = PDF_HEIGHT * scale;

  return (
    <div className="space-y-4">
      {/* Controls bar */}
      <div className="sticky top-0 z-20 flex items-center gap-4 rounded-lg border border-gray-200 bg-white/95 backdrop-blur px-4 py-2 shadow-sm">
        <div className="text-xs font-medium text-gray-700">
          {section}: {fields.length} fields across {sortedPages.length} pages
          {(() => {
            const total = Array.from(pageMap.values()).reduce((s, f) => s + f.length, 0);
            return total > fields.length ? (
              <span className="text-gray-400 ml-1">({total} total on pages)</span>
            ) : null;
          })()}
        </div>
        <div className="flex-1" />
        <label className="flex items-center gap-1.5 text-xs text-gray-600">
          <input
            type="checkbox"
            checked={livePreview}
            onChange={(e) => setLivePreview(e.target.checked)}
            className="accent-red-500"
          />
          Live Preview
        </label>
        <button
          onClick={() => setShowFields(!showFields)}
          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
            showFields
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          Show Fields
        </button>
        <button
          onClick={() => setShowAll(!showAll)}
          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
            showAll
              ? 'bg-amber-500 text-white shadow-sm'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
          title="Bypass conditional logic to reveal all hidden fields (shown at 40% opacity with red dashed outline)"
        >
          Show All
        </button>
        <label className="flex items-center gap-1.5 text-xs text-gray-600">
          Opacity
          <input
            type="range"
            min={10}
            max={100}
            value={fieldOpacity}
            onChange={(e) => setFieldOpacity(Number(e.target.value))}
            className="w-20 h-3 accent-blue-600"
          />
          <span className="w-7 text-right font-mono">{fieldOpacity}%</span>
        </label>
        {/* Legend */}
        <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
          <span className="inline-block w-3 h-3 border-2 border-blue-400 rounded-sm" /> <span className="text-[10px] text-gray-500">text</span>
          <span className="inline-block w-3 h-3 border-2 border-green-400 rounded-sm" /> <span className="text-[10px] text-gray-500">check</span>
          <span className="inline-block w-3 h-3 border-2 border-orange-400 rounded-sm" /> <span className="text-[10px] text-gray-500">radio</span>
          <span className="inline-block w-3 h-3 border-2 border-purple-400 rounded-sm" /> <span className="text-[10px] text-gray-500">select</span>
          <span className="inline-block w-3 h-3 border-2 border-teal-400 rounded-sm" /> <span className="text-[10px] text-gray-500">date</span>
        </div>
      </div>

      {/* Pages */}
      <AuditModeContext.Provider value={showAll}>
        <div className="flex flex-col items-center gap-8">
          {sortedPages.map((pageNum) => {
            const pageFields = pageMap.get(pageNum)!;
            const stats = pageStats[pageNum];

            return (
              <PdfPageFrame
                key={pageNum}
                pageNum={pageNum}
                pageFields={pageFields}
                stats={stats}
                scaledWidth={scaledWidth}
                scaledHeight={scaledHeight}
                scale={scale}
                showFields={showFields}
                fieldOpacity={fieldOpacity}
                livePreview={livePreview}
              />
            );
          })}
        </div>
      </AuditModeContext.Provider>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Per-page frame component (separate so useLivePreview hook can be called per page)
// ---------------------------------------------------------------------------

interface PdfPageFrameProps {
  pageNum: number;
  pageFields: FieldDefinition[];
  stats: { total: number; groups: Set<string> };
  scaledWidth: number;
  scaledHeight: number;
  scale: number;
  showFields: boolean;
  fieldOpacity: number;
  livePreview: boolean;
}

const PdfPageFrame = memo(function PdfPageFrame({
  pageNum,
  pageFields,
  stats,
  scaledWidth,
  scaledHeight,
  scale,
  showFields,
  fieldOpacity,
  livePreview,
}: PdfPageFrameProps) {
  // 0-based page for API calls
  const apiPage = pageNum - 1;

  // Live preview hook — only active when livePreview is toggled on
  const { imageUrl: liveImageUrl, loading: liveLoading } = useLivePreview(
    pageFields,
    pageNum,
    livePreview,
  );

  // Use live-rendered image when available, fall back to static
  const bgSrc = livePreview && liveImageUrl
    ? liveImageUrl
    : `/api/pdf/render-page/sf861/${apiPage}?dpi=72`;

  return (
    <div className="relative">
      {/* Page header */}
      <div className="flex items-baseline gap-3 mb-1">
        <span className="text-xs font-mono font-semibold text-gray-500">
          Page {pageNum}
        </span>
        <span className="text-[10px] text-gray-400">
          {stats.total} fields
          {stats.groups.size > 0 && (
            <> &middot; {stats.groups.size} repeat instance{stats.groups.size > 1 ? 's' : ''}</>
          )}
        </span>
        {livePreview && liveLoading && (
          <span className="text-[10px] text-orange-500 animate-pulse">
            rendering...
          </span>
        )}
        {livePreview && liveImageUrl && !liveLoading && (
          <span className="text-[10px] text-green-600">
            live
          </span>
        )}
      </div>

      {/* Page frame with PDF background */}
      <div
        className="relative shadow-md overflow-hidden outline outline-1 outline-gray-300"
        style={{
          width: scaledWidth,
          height: scaledHeight,
        }}
      >
        {/* PDF page image as background */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bgSrc}
          alt={`PDF page ${pageNum}`}
          width={scaledWidth}
          height={scaledHeight}
          className="absolute inset-0 w-full h-full"
          loading="lazy"
          draggable={false}
        />

        {/* Field overlay layer */}
        {showFields && (
          <div
            className="absolute inset-0"
            style={{ opacity: fieldOpacity / 100 }}
          >
            {pageFields.map((field) => {
              // Radio fields with individual widget positions: render one circle per option
              if (field.uiFieldType === 'radio' && field.radioWidgets) {
                return field.radioWidgets.map((widget, i) => (
                  <ConditionalWrapper key={`${field.semanticKey}-radio-${i}`} field={field}>
                    <div
                      className="absolute"
                      data-field-key={`${field.semanticKey}-radio-${i}`}
                      style={{
                        left: widget.x * scale,
                        top: widget.y * scale,
                        width: widget.width * scale,
                        height: widget.height * scale,
                      }}
                    >
                      <RadioCircle
                        field={field}
                        optionIndex={i}
                        widget={widget}
                      />
                    </div>
                  </ConditionalWrapper>
                ));
              }

              // Standard single-position field
              const rect = field.pdfRect!;
              return (
                <ConditionalWrapper key={field.semanticKey} field={field}>
                  <div
                    className="absolute"
                    data-field-key={field.semanticKey}
                    style={{
                      left: rect.x * scale,
                      top: rect.y * scale,
                      width: rect.width * scale,
                      height: rect.height * scale,
                    }}
                  >
                    <CoordinateField field={field} />
                  </div>
                </ConditionalWrapper>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
});

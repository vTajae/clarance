// ---------------------------------------------------------------------------
// Left Panel -- filterable, sortable field list (300px wide)
// ---------------------------------------------------------------------------

'use client';

import { useMemo, useRef, useEffect, useCallback } from 'react';
import type { EditableField, FilterState, SortMode } from './types';
import type { SF86Section } from '@/lib/field-registry/types';
import { ALL_SECTIONS, SECTION_META } from '@/lib/field-registry/types';

// ---- Confidence helpers ----------------------------------------------------

function confidenceColor(c: number): string {
  if (c >= 0.8) return 'bg-green-100 text-green-800';
  if (c >= 0.5) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
}

function confidenceBorderColor(c: number): string {
  if (c >= 0.8) return 'border-l-green-500';
  if (c >= 0.5) return 'border-l-yellow-500';
  return 'border-l-red-500';
}

// ---- Filter / sort logic ---------------------------------------------------

function matchesFilter(field: EditableField, filter: FilterState): boolean {
  if (filter.section !== 'all' && field.section !== filter.section) return false;

  if (filter.confidence !== 'all') {
    const c = field.classificationConfidence;
    if (filter.confidence === 'high' && c < 0.8) return false;
    if (filter.confidence === 'medium' && (c < 0.5 || c >= 0.8)) return false;
    if (filter.confidence === 'low' && c >= 0.5) return false;
  }

  if (filter.unverifiedOnly && field.manuallyVerified) return false;

  if (filter.search) {
    const q = filter.search.toLowerCase();
    const inLabel = field.label.toLowerCase().includes(q);
    const inKey = field.semanticKey.toLowerCase().includes(q);
    const inPdfName = field.pdfFieldName.toLowerCase().includes(q);
    if (!inLabel && !inKey && !inPdfName) return false;
  }

  return true;
}

function sortFields(
  fields: EditableField[],
  mode: SortMode,
): EditableField[] {
  const sorted = [...fields];
  switch (mode) {
    case 'confidence':
      sorted.sort(
        (a, b) => a.classificationConfidence - b.classificationConfidence,
      );
      break;
    case 'page':
      sorted.sort((a, b) => a.pdfPage - b.pdfPage);
      break;
    case 'section':
      sorted.sort((a, b) => {
        const orderA = SECTION_META[a.section]?.order ?? 99;
        const orderB = SECTION_META[b.section]?.order ?? 99;
        return orderA - orderB;
      });
      break;
  }
  return sorted;
}

// ---- Component -------------------------------------------------------------

interface FieldListPanelProps {
  fields: EditableField[];
  filter: FilterState;
  sortMode: SortMode;
  selectedKey: string | null;
  onFilterChange: (filter: FilterState) => void;
  onSortChange: (mode: SortMode) => void;
  onSelectField: (semanticKey: string) => void;
}

export function FieldListPanel({
  fields,
  filter,
  sortMode,
  selectedKey,
  onFilterChange,
  onSortChange,
  onSelectField,
}: FieldListPanelProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  const visibleFields = useMemo(() => {
    const filtered = fields.filter((f) => matchesFilter(f, filter));
    return sortFields(filtered, sortMode);
  }, [fields, filter, sortMode]);

  // Scroll selected field into view
  useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [selectedKey]);

  const updateFilter = useCallback(
    (partial: Partial<FilterState>) => {
      onFilterChange({ ...filter, ...partial });
    },
    [filter, onFilterChange],
  );

  return (
    <aside
      className="flex w-[300px] shrink-0 flex-col border-r border-gray-200 bg-gray-50"
      aria-label="Field list"
    >
      {/* ---- Filter controls ---- */}
      <div className="space-y-2 border-b border-gray-200 p-3">
        {/* Search */}
        <div>
          <label htmlFor="field-search" className="sr-only">
            Search fields
          </label>
          <input
            id="field-search"
            type="search"
            placeholder="Search label or key..."
            value={filter.search}
            onChange={(e) => updateFilter({ search: e.target.value })}
            className="w-full rounded border border-gray-300 px-2.5 py-1.5 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Section filter */}
        <div>
          <label htmlFor="section-filter" className="sr-only">
            Filter by section
          </label>
          <select
            id="section-filter"
            value={filter.section}
            onChange={(e) =>
              updateFilter({ section: e.target.value as SF86Section | 'all' })
            }
            className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Sections</option>
            {ALL_SECTIONS.map((s) => (
              <option key={s} value={s}>
                {SECTION_META[s]!.title}
              </option>
            ))}
          </select>
        </div>

        {/* Confidence + Sort row */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label htmlFor="confidence-filter" className="sr-only">
              Filter by confidence
            </label>
            <select
              id="confidence-filter"
              value={filter.confidence}
              onChange={(e) =>
                updateFilter({
                  confidence: e.target.value as FilterState['confidence'],
                })
              }
              className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Confidence</option>
              <option value="high">High (&ge; 0.8)</option>
              <option value="medium">Medium (0.5-0.8)</option>
              <option value="low">Low (&lt; 0.5)</option>
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="sort-mode" className="sr-only">
              Sort by
            </label>
            <select
              id="sort-mode"
              value={sortMode}
              onChange={(e) => onSortChange(e.target.value as SortMode)}
              className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="confidence">Sort: Confidence</option>
              <option value="page">Sort: Page</option>
              <option value="section">Sort: Section</option>
            </select>
          </div>
        </div>

        {/* Unverified only toggle */}
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={filter.unverifiedOnly}
            onChange={(e) => updateFilter({ unverifiedOnly: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Show only unverified
        </label>
      </div>

      {/* ---- Count ---- */}
      <div className="border-b border-gray-200 bg-white px-3 py-2 text-xs text-gray-500">
        Showing {visibleFields.length.toLocaleString()} of{' '}
        {fields.length.toLocaleString()} fields
      </div>

      {/* ---- Scrollable list ---- */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto"
        role="listbox"
        aria-label="Fields"
      >
        {visibleFields.length === 0 && (
          <p className="p-4 text-center text-sm text-gray-400">
            No fields match the current filters.
          </p>
        )}
        {visibleFields.map((field) => {
          const isSelected = field.semanticKey === selectedKey;
          return (
            <button
              key={field.semanticKey}
              ref={isSelected ? selectedRef : undefined}
              role="option"
              aria-selected={isSelected}
              onClick={() => onSelectField(field.semanticKey)}
              className={`flex w-full items-start gap-2 border-b border-l-4 border-b-gray-100 px-3 py-2 text-left transition-colors hover:bg-blue-50 ${
                confidenceBorderColor(field.classificationConfidence)
              } ${isSelected ? 'bg-blue-100' : ''}`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
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
                  <span className="truncate text-sm font-medium text-gray-900">
                    {field.label.length > 60
                      ? field.label.slice(0, 57) + '...'
                      : field.label}
                  </span>
                </div>
                <div className="mt-0.5 truncate text-xs text-gray-500">
                  {field.semanticKey}
                </div>
              </div>
              <span
                className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-xs font-medium ${confidenceColor(field.classificationConfidence)}`}
              >
                {(field.classificationConfidence * 100).toFixed(0)}%
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

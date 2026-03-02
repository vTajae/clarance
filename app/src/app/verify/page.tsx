// ---------------------------------------------------------------------------
// /verify -- Field Verification Dashboard
// ---------------------------------------------------------------------------
// Development tool for reviewing and correcting the LLM-generated semantic
// label mappings for the 6,197 SF-86 PDF AcroForm fields.
//
// Three-panel layout:
//   Left (300px)   -- filterable, sortable field list
//   Center (flex)  -- PDF page visualization with field overlays
//   Right (350px)  -- editable detail view for the selected field
// ---------------------------------------------------------------------------

'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRegistry } from './_components/use-registry';
import { StatsBar } from './_components/stats-bar';
import { FieldListPanel } from './_components/field-list-panel';
import { PdfPageViewer } from './_components/pdf-page-viewer';
import { FieldDetailPanel } from './_components/field-detail-panel';
import type {
  EditableField,
  FilterState,
  SortMode,
  StatsData,
} from './_components/types';
import { SECTION_META } from '@/lib/field-registry/types';
import type { SF86Section } from '@/lib/field-registry/types';

// ---- Helpers ---------------------------------------------------------------

function computeStats(fields: EditableField[]): StatsData {
  const total = fields.length;
  const verified = fields.filter((f) => f.manuallyVerified).length;
  const highConfidence = fields.filter(
    (f) => f.classificationConfidence >= 0.8,
  ).length;
  const mediumConfidence = fields.filter(
    (f) =>
      f.classificationConfidence >= 0.5 &&
      f.classificationConfidence < 0.8,
  ).length;
  const lowConfidence = fields.filter(
    (f) => f.classificationConfidence < 0.5,
  ).length;

  // A section is "complete" when all its fields are verified
  const sectionCounts = new Map<SF86Section, { total: number; verified: number }>();
  for (const field of fields) {
    const existing = sectionCounts.get(field.section) ?? {
      total: 0,
      verified: 0,
    };
    existing.total++;
    if (field.manuallyVerified) existing.verified++;
    sectionCounts.set(field.section, existing);
  }
  const sectionsComplete = Array.from(sectionCounts.values()).filter(
    (s) => s.total > 0 && s.verified === s.total,
  ).length;

  return {
    total,
    verified,
    verifiedPct: total > 0 ? (verified / total) * 100 : 0,
    highConfidence,
    mediumConfidence,
    lowConfidence,
    sectionsComplete,
    totalSections: sectionCounts.size,
  };
}

function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ---- Page Component --------------------------------------------------------

export default function VerifyPage() {
  const { fields: rawFields, loading, error } = useRegistry();

  // Mutable field array -- edits are applied here
  const [fields, setFields] = useState<EditableField[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Initialize mutable state from loaded data (once)
  if (rawFields.length > 0 && !initialized) {
    setFields(rawFields.map((f) => ({ ...f })));
    setInitialized(true);
  }

  // --- UI state ---
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(5); // fields start at page 5
  const [filter, setFilter] = useState<FilterState>({
    section: 'all',
    confidence: 'all',
    unverifiedOnly: false,
    search: '',
  });
  const [sortMode, setSortMode] = useState<SortMode>('confidence');

  // Field index by semanticKey for O(1) lookup
  const fieldIndex = useMemo(() => {
    const map = new Map<string, number>();
    fields.forEach((f, i) => map.set(f.semanticKey, i));
    return map;
  }, [fields]);

  const selectedField = useMemo(() => {
    if (!selectedKey) return null;
    const idx = fieldIndex.get(selectedKey);
    return idx !== undefined ? fields[idx] : null;
  }, [selectedKey, fieldIndex, fields]);

  // Total PDF pages
  const totalPages = useMemo(() => {
    if (fields.length === 0) return 136;
    return Math.max(...fields.map((f) => f.pdfPage));
  }, [fields]);

  const stats = useMemo(() => computeStats(fields), [fields]);

  // When a field is selected, navigate to its page
  const handleSelectField = useCallback(
    (semanticKey: string) => {
      setSelectedKey(semanticKey);
      const idx = fieldIndex.get(semanticKey);
      if (idx !== undefined) {
        setCurrentPage(fields[idx].pdfPage);
      }
    },
    [fieldIndex, fields],
  );

  // Save edits to a field
  const handleSaveField = useCallback(
    (updated: EditableField) => {
      const idx = fieldIndex.get(updated.semanticKey);
      if (idx !== undefined) {
        setFields((prev) => {
          const next = [...prev];
          next[idx] = { ...updated };
          return next;
        });
      }
    },
    [fieldIndex],
  );

  // Export updated registry
  const handleExport = useCallback(() => {
    downloadJson(fields, 'field-registry-verified.json');
  }, [fields]);

  // ---- Loading / error states ----

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div
            className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"
            role="status"
            aria-label="Loading"
          />
          <p className="text-sm text-gray-500">
            Loading field registry (6,197 fields)...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h1 className="mb-2 text-lg font-semibold text-red-800">
            Failed to Load Registry
          </h1>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // ---- Main layout ----

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* ---- Top bar ---- */}
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2">
        <h1 className="text-lg font-bold text-gray-900">
          SF-86 Field Verification Dashboard
        </h1>
        <span className="text-xs text-gray-400">Development Tool</span>
      </header>

      {/* ---- Stats bar ---- */}
      <StatsBar stats={stats} />

      {/* ---- Three-panel body ---- */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left -- field list */}
        <FieldListPanel
          fields={fields}
          filter={filter}
          sortMode={sortMode}
          selectedKey={selectedKey}
          onFilterChange={setFilter}
          onSortChange={setSortMode}
          onSelectField={handleSelectField}
        />

        {/* Center -- PDF page viewer */}
        <PdfPageViewer
          fields={fields}
          currentPage={currentPage}
          selectedKey={selectedKey}
          onPageChange={setCurrentPage}
          onSelectField={handleSelectField}
          totalPages={totalPages}
        />

        {/* Right -- field detail editor */}
        <FieldDetailPanel
          field={selectedField}
          onSave={handleSaveField}
          onExport={handleExport}
        />
      </div>
    </div>
  );
}

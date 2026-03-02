// ---------------------------------------------------------------------------
// Right Panel -- editable detail view for the selected field (350px wide)
// ---------------------------------------------------------------------------

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { EditableField } from './types';
import type { UiFieldType } from '@/lib/field-registry/types';
import { SECTION_META } from '@/lib/field-registry/types';

const UI_FIELD_TYPES: UiFieldType[] = [
  'text',
  'textarea',
  'checkbox',
  'radio',
  'select',
  'date',
  'dateRange',
  'phone',
  'telephone',
  'ssn',
  'email',
  'name',
  'location',
  'country',
  'state',
  'height',
  'branch',
  'collection',
  'notApplicable',
  'signature',
];

function confidenceBadge(c: number) {
  if (c >= 0.8)
    return { bg: 'bg-green-100 text-green-800', label: 'High' };
  if (c >= 0.5)
    return { bg: 'bg-yellow-100 text-yellow-800', label: 'Medium' };
  return { bg: 'bg-red-100 text-red-800', label: 'Low' };
}

interface FieldDetailPanelProps {
  field: EditableField | null;
  onSave: (updated: EditableField) => void;
  onExport: () => void;
}

export function FieldDetailPanel({
  field,
  onSave,
  onExport,
}: FieldDetailPanelProps) {
  // Local draft state for editable fields
  const [draft, setDraft] = useState<EditableField | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Reset draft when the selected field changes
  useEffect(() => {
    if (field) {
      setDraft({ ...field });
      setIsDirty(false);
    } else {
      setDraft(null);
      setIsDirty(false);
    }
  }, [field]);

  const updateDraft = useCallback(
    (partial: Partial<EditableField>) => {
      setDraft((prev) => (prev ? { ...prev, ...partial } : null));
      setIsDirty(true);
    },
    [],
  );

  const handleSave = useCallback(() => {
    if (draft) {
      onSave(draft);
      setIsDirty(false);
    }
  }, [draft, onSave]);

  if (!draft) {
    return (
      <aside
        className="flex w-[350px] shrink-0 flex-col items-center justify-center border-l border-gray-200 bg-gray-50 p-6 text-center"
        aria-label="Field details"
      >
        <svg
          className="mb-3 h-12 w-12 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-sm text-gray-400">
          Select a field from the list to view and edit its details.
        </p>
        <button
          onClick={onExport}
          className="mt-6 rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
        >
          Export Updated Registry
        </button>
      </aside>
    );
  }

  const badge = confidenceBadge(draft.classificationConfidence);
  const sectionMeta = SECTION_META[draft.section];

  return (
    <aside
      className="flex w-[350px] shrink-0 flex-col border-l border-gray-200 bg-white"
      aria-label="Field details"
    >
      {/* ---- Header ---- */}
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-900">Field Details</h2>
      </div>

      {/* ---- Scrollable content ---- */}
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {/* PDF Field Name */}
        <DetailRow label="PDF Field Name">
          <code className="break-all rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700">
            {draft.pdfFieldName}
          </code>
        </DetailRow>

        {/* Semantic Key */}
        <DetailRow label="Semantic Key">
          <code className="rounded bg-blue-50 px-1.5 py-0.5 text-xs font-semibold text-blue-700">
            {draft.semanticKey}
          </code>
        </DetailRow>

        {/* Section + Group */}
        <DetailRow label="Section">
          <span className="text-sm text-gray-800">
            {sectionMeta?.title ?? draft.section}
          </span>
          {draft.sectionGroup && (
            <span className="ml-1.5 rounded bg-purple-100 px-1.5 py-0.5 text-xs text-purple-700">
              {draft.sectionGroup}
            </span>
          )}
        </DetailRow>

        {/* Label (editable) */}
        <DetailRow label="Label">
          <textarea
            value={draft.label}
            onChange={(e) => updateDraft({ label: e.target.value })}
            rows={2}
            className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-label="Edit label"
          />
        </DetailRow>

        {/* UI Field Type (editable) */}
        <DetailRow label="UI Field Type">
          <select
            value={draft.uiFieldType}
            onChange={(e) =>
              updateDraft({ uiFieldType: e.target.value as UiFieldType })
            }
            className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-label="Edit UI field type"
          >
            {UI_FIELD_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </DetailRow>

        {/* PDF Field Type (read-only) */}
        <DetailRow label="PDF Field Type">
          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
            {draft.pdfFieldType}
          </span>
        </DetailRow>

        {/* Page number */}
        <DetailRow label="Page">
          <span className="text-sm text-gray-800">{draft.pdfPage}</span>
        </DetailRow>

        {/* Confidence score */}
        <DetailRow label="Confidence">
          <div className="flex items-center gap-2">
            <span
              className={`rounded px-2 py-0.5 text-xs font-semibold ${badge.bg}`}
            >
              {(draft.classificationConfidence * 100).toFixed(1)}% --{' '}
              {badge.label}
            </span>
          </div>
        </DetailRow>

        {/* Required toggle */}
        <DetailRow label="Required">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draft.required}
              onChange={(e) => updateDraft({ required: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">
              {draft.required ? 'Yes' : 'No'}
            </span>
          </label>
        </DetailRow>

        {/* Options list */}
        {draft.options && draft.options.length > 0 && (
          <DetailRow label="Options">
            <div className="max-h-32 overflow-y-auto">
              <ul className="list-inside list-disc text-xs text-gray-700">
                {draft.options.map((opt, i) => (
                  <li key={i} className="truncate">
                    {opt}
                  </li>
                ))}
              </ul>
            </div>
          </DetailRow>
        )}

        {/* Value map */}
        {draft.valueMap && Object.keys(draft.valueMap).length > 0 && (
          <DetailRow label="Value Map">
            <div className="max-h-32 overflow-y-auto rounded bg-gray-50 p-2">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-500">
                    <th className="pr-2 text-left font-medium">UI</th>
                    <th className="text-left font-medium">PDF</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(draft.valueMap).map(([ui, pdf]) => (
                    <tr key={ui}>
                      <td className="truncate pr-2 text-gray-700">{ui}</td>
                      <td className="truncate text-gray-500">{pdf}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DetailRow>
        )}

        {/* Repeat group info */}
        {draft.repeatGroup && (
          <DetailRow label="Repeat Group">
            <span className="text-sm text-gray-800">
              {draft.repeatGroup}
              {draft.repeatIndex !== undefined && ` [${draft.repeatIndex}]`}
              {draft.maxRepeatInPdf !== undefined &&
                ` (max ${draft.maxRepeatInPdf} in PDF)`}
            </span>
          </DetailRow>
        )}

        {/* Depends on */}
        {draft.dependsOn && (
          <DetailRow label="Depends On">
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
              {draft.dependsOn}
            </code>
            {draft.showWhen && (
              <span className="ml-1 text-xs text-gray-400">
                when {draft.showWhen}
              </span>
            )}
          </DetailRow>
        )}

        {/* PDF Rect */}
        {draft.pdfRect && (
          <DetailRow label="PDF Rect">
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
              x:{draft.pdfRect.x.toFixed(1)} y:{draft.pdfRect.y.toFixed(1)} w:
              {draft.pdfRect.width.toFixed(1)} h:
              {draft.pdfRect.height.toFixed(1)}
            </code>
          </DetailRow>
        )}

        {/* Manually Verified checkbox */}
        <DetailRow label="Verified">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draft.manuallyVerified}
              onChange={(e) =>
                updateDraft({ manuallyVerified: e.target.checked })
              }
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="font-medium text-gray-700">
              {draft.manuallyVerified
                ? 'Manually verified'
                : 'Not yet verified'}
            </span>
          </label>
        </DetailRow>
      </div>

      {/* ---- Action buttons ---- */}
      <div className="space-y-2 border-t border-gray-200 px-4 py-3">
        <button
          onClick={handleSave}
          disabled={!isDirty}
          className={`w-full rounded px-4 py-2 text-sm font-medium transition-colors ${
            isDirty
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'cursor-not-allowed bg-gray-200 text-gray-400'
          }`}
        >
          {isDirty ? 'Save Changes' : 'No Changes'}
        </button>
        <button
          onClick={onExport}
          className="w-full rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Export Updated Registry
        </button>
      </div>
    </aside>
  );
}

// ---- Sub-component --------------------------------------------------------

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="mb-1 text-xs font-medium tracking-wide text-gray-500 uppercase">
        {label}
      </dt>
      <dd>{children}</dd>
    </div>
  );
}

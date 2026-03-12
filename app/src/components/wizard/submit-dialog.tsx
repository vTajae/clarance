'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useCrossSectionValidation } from '@/lib/state/hooks/use-cross-section-validation';
import { useExportPdf } from '@/lib/state/hooks/use-export-pdf';
import type { CrossSectionIssue } from '@/lib/validation/cross-section';

interface SubmitDialogProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Modal dialog shown when user clicks "Submit Form".
 * Displays cross-section validation issues, allows PDF export,
 * and warns about outstanding problems before final download.
 */
export function SubmitDialog({ open, onClose }: SubmitDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const issues = useCrossSectionValidation();
  const { exportPdf, status: exportStatus, getCompletionRatio } = useExportPdf();

  const completionPct = Math.round(getCompletionRatio() * 100);
  const errors = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity === 'warning');
  const hasBlockers = errors.length > 0;

  // Sync dialog open/close with the HTML dialog element
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  const handleExport = useCallback(async () => {
    const success = await exportPdf(true); // skip the built-in confirm since we show our own UI
    if (success) {
      onClose();
    }
  }, [exportPdf, onClose]);

  const handleCancel = useCallback((e: React.MouseEvent<HTMLDialogElement>) => {
    // Close when clicking the backdrop (outside the inner container)
    if (e.target === dialogRef.current) {
      onClose();
    }
  }, [onClose]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-[100] m-auto w-full max-w-lg rounded-xl bg-white p-0 shadow-2xl backdrop:bg-black/40"
      onClose={onClose}
      onClick={handleCancel}
    >
      <div className="p-6" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Submit SF-86</h2>
            <p className="mt-1 text-sm text-gray-500">
              Review the status below before exporting your completed form.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Completion gauge */}
        <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium text-gray-700">Form Completion</span>
            <span className={`text-sm font-bold ${completionPct === 100 ? 'text-green-600' : 'text-amber-600'}`}>
              {completionPct}%
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-gray-200 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${completionPct === 100 ? 'bg-green-500' : 'bg-amber-500'}`}
              style={{ width: `${completionPct}%` }}
            />
          </div>
          {completionPct < 100 && (
            <p className="mt-2 text-xs text-amber-600">
              Some fields are still empty. You can still export, but the form will be incomplete.
            </p>
          )}
        </div>

        {/* Cross-section issues */}
        {issues.length > 0 && (
          <div className="mb-4 space-y-3">
            {errors.length > 0 && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <h3 className="text-sm font-semibold text-red-800 mb-1.5">
                  {errors.length} Error{errors.length !== 1 ? 's' : ''}
                </h3>
                <ul className="space-y-1">
                  {errors.map((issue, idx) => (
                    <IssueRow key={idx} issue={issue} />
                  ))}
                </ul>
              </div>
            )}
            {warnings.length > 0 && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <h3 className="text-sm font-semibold text-amber-800 mb-1.5">
                  {warnings.length} Warning{warnings.length !== 1 ? 's' : ''}
                </h3>
                <ul className="space-y-1">
                  {warnings.map((issue, idx) => (
                    <IssueRow key={idx} issue={issue} />
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {issues.length === 0 && completionPct === 100 && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-center">
            <svg className="mx-auto h-8 w-8 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium text-green-800">
              All checks passed. Your form is ready to export.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Go Back
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={exportStatus === 'exporting'}
            className={`
              inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white
              focus:outline-none focus:ring-2 focus:ring-offset-2
              ${hasBlockers
                ? 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500'
                : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
              }
              ${exportStatus === 'exporting' ? 'opacity-70 cursor-wait' : ''}
            `}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {exportStatus === 'exporting'
              ? 'Exporting...'
              : hasBlockers
                ? 'Export Anyway'
                : 'Export PDF'}
          </button>
        </div>
      </div>
    </dialog>
  );
}

function IssueRow({ issue }: { issue: CrossSectionIssue }) {
  return (
    <li className={`text-xs ${issue.severity === 'error' ? 'text-red-700' : 'text-amber-700'}`}>
      {issue.message}
    </li>
  );
}

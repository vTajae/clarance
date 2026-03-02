'use client';

import Link from 'next/link';
import { useAppStore } from '@/lib/state/stores/app-store';
import type { SaveStatus } from '@/lib/state/stores/app-store';

interface TopBarProps {
  submissionId: string;
  onToggleSidebar: () => void;
  onTogglePreview: () => void;
  previewOpen: boolean;
  /** Overall form completion (0-1). */
  completionPercent?: number;
}

const STATUS_MAP: Record<SaveStatus, { label: string; colorClass: string }> = {
  idle: { label: 'Ready', colorClass: 'text-gray-400' },
  saving: { label: 'Saving...', colorClass: 'text-yellow-600' },
  saved: { label: 'All changes saved', colorClass: 'text-green-600' },
  error: { label: 'Save failed', colorClass: 'text-red-500' },
};

export function TopBar({
  submissionId,
  onToggleSidebar,
  onTogglePreview,
  previewOpen,
  completionPercent = 0,
}: TopBarProps) {
  const saveStatus = useAppStore((s) => s.saveStatus);
  const lastSaved = useAppStore((s) => s.lastSaved);

  const pct = Math.round(completionPercent * 100);
  const status = STATUS_MAP[saveStatus];

  return (
    <header className="shrink-0 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: hamburger + title */}
        <div className="flex items-center gap-3">
          {/* Sidebar toggle */}
          <button
            type="button"
            onClick={onToggleSidebar}
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle section sidebar"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-xs font-bold text-white">
              86
            </div>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">SF-86</h1>
          </Link>
        </div>

        {/* Center: progress bar */}
        <div className="hidden sm:flex items-center gap-3 flex-1 max-w-md mx-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-xs font-medium text-gray-600">Progress</span>
              <span className="text-xs font-semibold text-gray-700">{pct}%</span>
            </div>
            <div
              className="h-2 rounded-full bg-gray-200 overflow-hidden"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Form completion: ${pct}%`}
            >
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  pct === 100 ? 'bg-green-500' : 'bg-blue-600'
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Save status */}
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            {/* Status dot */}
            <div
              className={`h-2 w-2 rounded-full ${
                saveStatus === 'saved'
                  ? 'bg-green-400'
                  : saveStatus === 'saving'
                    ? 'bg-yellow-400 animate-pulse'
                    : saveStatus === 'error'
                      ? 'bg-red-400'
                      : 'bg-gray-300'
              }`}
            />
            <span className={`text-xs font-medium ${status.colorClass}`}>
              {status.label}
            </span>
            {lastSaved && (
              <span className="text-xs text-gray-400">
                {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        {/* Right: action buttons */}
        <div className="flex items-center gap-2">
          {/* PDF Preview toggle */}
          <button
            type="button"
            onClick={onTogglePreview}
            className={`
              hidden lg:inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium
              focus:outline-none focus:ring-2 focus:ring-blue-500
              ${
                previewOpen
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }
            `}
            aria-pressed={previewOpen}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            PDF
          </button>

          {/* Export PDF */}
          <Link
            href={`/api/pdf/export?submissionId=${submissionId}`}
            className="
              rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white
              transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
            "
          >
            Export PDF
          </Link>
        </div>
      </div>
    </header>
  );
}

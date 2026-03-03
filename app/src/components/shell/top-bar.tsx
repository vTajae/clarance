'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/state/stores/app-store';
import type { SaveStatus } from '@/lib/state/stores/app-store';
import type { SyncStatus } from '@/lib/persistence/sync-engine';
import { useExportPdf } from '@/lib/state/hooks/use-export-pdf';
import { LayoutModeToggle } from '@/components/wizard/layout-mode-toggle';
import { SECTION_META, SECTION_GROUPS } from '@/lib/field-registry/types';
import type { SF86Section, SF86SectionGroup } from '@/lib/field-registry/types';
import { useWizardNavigation } from '@/lib/wizard/use-wizard-navigation';

const GROUP_LABELS: Record<SF86SectionGroup, string> = {
  identification: 'Identification',
  citizenship: 'Citizenship',
  history: 'History',
  military: 'Military',
  relationships: 'Relationships',
  foreign: 'Foreign',
  financial: 'Financial',
  substance: 'Substance',
  legal: 'Legal',
  psychological: 'Psychological',
  review: 'Review',
};

interface TopBarProps {
  submissionId: string;
  onToggleSidebar: () => void;
  onTogglePreview: () => void;
  previewOpen: boolean;
  /** Overall form completion (0-1). */
  completionPercent?: number;
  /** Server sync status. */
  syncStatus?: SyncStatus;
  /** Number of entries waiting to sync. */
  pendingCount?: number;
}

const STATUS_MAP: Record<SaveStatus, { label: string; colorClass: string }> = {
  idle: { label: 'Ready', colorClass: 'text-gray-400' },
  saving: { label: 'Saving...', colorClass: 'text-yellow-600' },
  saved: { label: 'All changes saved', colorClass: 'text-green-600' },
  error: { label: 'Save failed', colorClass: 'text-red-500' },
};

/** Derive the section group from a section key by checking SECTION_GROUPS. */
function groupForSection(section: SF86Section): SF86SectionGroup {
  for (const [group, sections] of Object.entries(SECTION_GROUPS) as [SF86SectionGroup, SF86Section[]][]) {
    if (sections.includes(section)) return group;
  }
  return 'identification';
}

export function TopBar({
  submissionId,
  onToggleSidebar,
  onTogglePreview,
  previewOpen,
  completionPercent = 0,
  syncStatus,
  pendingCount = 0,
}: TopBarProps) {
  const saveStatus = useAppStore((s) => s.saveStatus);
  const lastSaved = useAppStore((s) => s.lastSaved);
  const storeSection = useAppStore((s) => s.currentSection);
  const storeSectionGroup = useAppStore((s) => s.currentSectionGroup);
  const layoutMode = useAppStore((s) => s.layoutMode);
  const { exportPdf, status: exportStatus } = useExportPdf();
  const { currentStep, currentStepIndex, isReviewMode } = useWizardNavigation();

  // Derive section from URL pathname (always current) to avoid stale store reads
  const pathname = usePathname();
  const urlSection = pathname?.split('/').pop() as SF86Section | undefined;
  const currentSection = (urlSection && SECTION_META[urlSection]) ? urlSection : storeSection;
  const currentSectionGroup = (urlSection && SECTION_META[urlSection]) ? groupForSection(urlSection) : storeSectionGroup;

  const pct = Math.round(completionPercent * 100);
  const status = STATUS_MAP[saveStatus];

  return (
    <header className="shrink-0 border-b border-gray-200 bg-white relative z-50" role="banner">
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
            {syncStatus === 'syncing' && (
              <span className="text-xs text-blue-500 animate-pulse">Syncing...</span>
            )}
            {syncStatus === 'error' && pendingCount > 0 && (
              <span className="text-xs text-orange-500">{pendingCount} pending</span>
            )}
          </div>
        </div>

        {/* Right: layout toggle + export */}
        <div className="flex items-center gap-2">
          {/* Layout mode toggle */}
          <div className="hidden sm:block">
            <LayoutModeToggle />
          </div>

          {/* Export PDF */}
          <button
            type="button"
            onClick={exportPdf}
            disabled={exportStatus === 'exporting'}
            className={`
              rounded-md px-3 py-1.5 text-sm font-medium text-white
              transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
              ${exportStatus === 'error'
                ? 'bg-red-600 hover:bg-red-700'
                : exportStatus === 'exporting'
                  ? 'bg-blue-400 cursor-wait'
                  : 'bg-blue-600 hover:bg-blue-700'
              }
            `}
          >
            {exportStatus === 'exporting'
              ? 'Exporting...'
              : exportStatus === 'error'
                ? 'Export Failed'
                : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* Breadcrumb navigation */}
      {currentSection !== 'ssnPageHeader' && (
        <nav
          className="flex items-center gap-1 px-4 py-1.5 text-xs text-gray-500 border-t border-gray-100 bg-gray-50/50"
          aria-label="Breadcrumb"
        >
          <span>{GROUP_LABELS[currentSectionGroup]}</span>
          <span className="text-gray-300" aria-hidden="true">{' \u203A '}</span>
          <span>{SECTION_META[currentSection]?.title ?? currentSection}</span>
          {layoutMode === 'wizard' && (
            <>
              <span className="text-gray-300" aria-hidden="true">{' \u203A '}</span>
              <span className="text-gray-700 font-medium">
                {isReviewMode
                  ? 'Review'
                  : currentStep
                    ? `Step ${currentStepIndex + 1}: ${currentStep.title}`
                    : 'Step 1'}
              </span>
            </>
          )}
        </nav>
      )}
    </header>
  );
}

'use client';

import { useTimelineValidation } from '@/lib/state/hooks/use-timeline-validation';

interface TimelineCoveragePromptProps {
  section: 'section11' | 'section13A';
  onAddEntry?: () => void;
}

const SECTION_LABELS: Record<string, string> = {
  section11: 'Residency',
  section13A: 'Employment',
};

/**
 * Shows a visual timeline bar with coverage info when the user hasn't
 * covered the full 10-year period required by SF-86.
 */
export function TimelineCoveragePrompt({
  section,
  onAddEntry,
}: TimelineCoveragePromptProps) {
  const validation = useTimelineValidation(section);

  // Don't show if fully covered or no entries yet
  if (validation.isValid || validation.totalCoverageDays === 0) return null;

  const label = SECTION_LABELS[section] ?? section;
  const yearsNeeded = 10;
  const yearsCovered = Math.round((validation.coveragePercent / 100) * yearsNeeded * 10) / 10;

  return (
    <div className="mx-auto w-full max-w-2xl rounded-lg border border-amber-200 bg-amber-50 p-4 mb-4">
      <div className="flex items-start gap-3">
        <svg
          className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-amber-800">
            {label} covers {yearsCovered} of {yearsNeeded} required years
          </h4>

          {/* Coverage bar */}
          <div className="mt-2">
            <div className="h-3 rounded-full bg-amber-200 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(validation.coveragePercent, 100)}%`,
                  background: validation.coveragePercent >= 100
                    ? '#22c55e'
                    : validation.coveragePercent >= 70
                      ? '#eab308'
                      : '#f97316',
                }}
              />
            </div>
            <div className="mt-1 flex justify-between text-xs text-amber-600">
              <span>10 years ago</span>
              <span>{Math.round(validation.coveragePercent)}%</span>
              <span>Present</span>
            </div>
          </div>

          {/* Gap details */}
          {validation.gaps.length > 0 && (
            <div className="mt-3 space-y-1">
              {validation.gaps.slice(0, 3).map((gap, i) => (
                <p key={i} className="text-xs text-amber-700">
                  Gap: {formatDate(gap.gapStart)} &ndash; {formatDate(gap.gapEnd)}
                  {' '}({gap.durationDays} days)
                </p>
              ))}
            </div>
          )}

          {/* Add entry button */}
          {onAddEntry && (
            <button
              type="button"
              onClick={onAddEntry}
              className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700 transition-colors"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Another {label === 'Residency' ? 'Residence' : 'Employer'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

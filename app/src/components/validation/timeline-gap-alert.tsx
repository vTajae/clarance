'use client';

// ---------------------------------------------------------------------------
// Timeline Gap Alert — Shows residency/employment coverage gaps
// ---------------------------------------------------------------------------

interface TimelineGap {
  gapStart: Date;
  gapEnd: Date;
  durationDays: number;
  afterEntry: string;
  beforeEntry: string;
}

interface TimelineGapAlertProps {
  gaps: TimelineGap[];
  coveragePercent: number;
  sectionLabel: string;
  className?: string;
}

/**
 * Displays timeline coverage gaps for 10-year residency/employment histories.
 */
export function TimelineGapAlert({
  gaps,
  coveragePercent,
  sectionLabel,
  className = '',
}: TimelineGapAlertProps) {
  if (gaps.length === 0) return null;

  return (
    <div
      className={`rounded-md border border-amber-200 bg-amber-50 p-4 ${className}`}
      role="alert"
      aria-label={`${gaps.length} gap${gaps.length !== 1 ? 's' : ''} in ${sectionLabel} timeline`}
    >
      <div className="flex items-center gap-2">
        <svg
          className="h-5 w-5 shrink-0 text-amber-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-sm font-semibold text-amber-800">
          {sectionLabel}: {gaps.length} gap{gaps.length !== 1 ? 's' : ''} in 10-year coverage
        </h3>
      </div>

      {/* Coverage bar */}
      <div className="mt-2 ml-7">
        <div className="flex items-center justify-between text-xs text-amber-700 mb-1">
          <span>Coverage</span>
          <span>{coveragePercent}%</span>
        </div>
        <div className="h-2 rounded-full bg-amber-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-amber-500 transition-all"
            style={{ width: `${Math.min(coveragePercent, 100)}%` }}
          />
        </div>
      </div>

      <ul className="mt-3 ml-7 space-y-2">
        {gaps.map((gap, i) => (
          <li key={i} className="text-sm text-amber-700">
            <span className="font-medium">{gap.durationDays} days</span> gap
            {' '}between &ldquo;{gap.afterEntry}&rdquo; and &ldquo;{gap.beforeEntry}&rdquo;
            <span className="text-xs text-amber-500 ml-1">
              ({formatDate(gap.gapStart)} &ndash; {formatDate(gap.gapEnd)})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

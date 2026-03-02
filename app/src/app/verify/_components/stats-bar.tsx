// ---------------------------------------------------------------------------
// Stats Bar -- top-level metrics for the verification dashboard
// ---------------------------------------------------------------------------

'use client';

import type { StatsData } from './types';

interface StatsBarProps {
  stats: StatsData;
}

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-gray-200 bg-white px-4 py-3 text-sm"
      role="region"
      aria-label="Field verification statistics"
    >
      <Stat label="Total Fields" value={stats.total.toLocaleString()} />
      <Stat
        label="Verified"
        value={`${stats.verified.toLocaleString()} (${stats.verifiedPct.toFixed(1)}%)`}
        color={stats.verifiedPct > 50 ? 'text-green-700' : 'text-gray-600'}
      />
      <Stat
        label="High Confidence"
        value={stats.highConfidence.toLocaleString()}
        color="text-green-700"
        dot="bg-green-500"
      />
      <Stat
        label="Medium Confidence"
        value={stats.mediumConfidence.toLocaleString()}
        color="text-yellow-700"
        dot="bg-yellow-500"
      />
      <Stat
        label="Low Confidence"
        value={stats.lowConfidence.toLocaleString()}
        color="text-red-700"
        dot="bg-red-500"
      />
      <Stat
        label="Sections Complete"
        value={`${stats.sectionsComplete} / ${stats.totalSections}`}
      />
    </div>
  );
}

function Stat({
  label,
  value,
  color = 'text-gray-900',
  dot,
}: {
  label: string;
  value: string;
  color?: string;
  dot?: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {dot && (
        <span
          className={`inline-block h-2.5 w-2.5 rounded-full ${dot}`}
          aria-hidden="true"
        />
      )}
      <span className="text-gray-500">{label}:</span>
      <span className={`font-semibold ${color}`}>{value}</span>
    </div>
  );
}

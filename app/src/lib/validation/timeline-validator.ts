/**
 * Timeline gap detection for 10-year residency and employment histories.
 *
 * The SF-86 requires continuous coverage of the past 10 years for
 * residency (Section 11) and employment (Section 13A).
 */

interface TimelineEntry {
  startDate: string; // ISO date string
  endDate: string | null; // null means "present"
  label: string; // For error messages, e.g. "123 Main St" or "Acme Corp"
}

interface TimelineGap {
  gapStart: Date;
  gapEnd: Date;
  durationDays: number;
  afterEntry: string;
  beforeEntry: string;
}

interface TimelineValidationResult {
  isValid: boolean;
  gaps: TimelineGap[];
  totalCoverageDays: number;
  requiredCoverageDays: number;
  coveragePercent: number;
}

const MS_PER_DAY = 86_400_000;
const YEARS_REQUIRED = 10;
const ALLOWABLE_GAP_DAYS = 30; // gaps under 30 days are OK

/**
 * Validates that a set of timeline entries covers the past 10 years
 * with no significant gaps.
 */
export function validateTimeline(
  entries: TimelineEntry[]
): TimelineValidationResult {
  const now = new Date();
  const tenYearsAgo = new Date(now);
  tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - YEARS_REQUIRED);

  const requiredCoverageDays = Math.ceil(
    (now.getTime() - tenYearsAgo.getTime()) / MS_PER_DAY
  );

  if (entries.length === 0) {
    return {
      isValid: false,
      gaps: [
        {
          gapStart: tenYearsAgo,
          gapEnd: now,
          durationDays: requiredCoverageDays,
          afterEntry: "(start of 10-year period)",
          beforeEntry: "(present)",
        },
      ],
      totalCoverageDays: 0,
      requiredCoverageDays,
      coveragePercent: 0,
    };
  }

  // Parse and sort entries by start date
  const parsed = entries
    .map((e) => ({
      start: new Date(e.startDate),
      end: e.endDate ? new Date(e.endDate) : now,
      label: e.label,
    }))
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  // Clamp entries to the 10-year window
  const clamped = parsed
    .map((e) => ({
      start: e.start < tenYearsAgo ? tenYearsAgo : e.start,
      end: e.end > now ? now : e.end,
      label: e.label,
    }))
    .filter((e) => e.end > tenYearsAgo && e.start < now);

  // Find gaps
  const gaps: TimelineGap[] = [];
  let totalCoverageDays = 0;

  // Check gap from 10-year-ago to first entry
  if (clamped.length > 0 && clamped[0].start > tenYearsAgo) {
    const gapDays = Math.ceil(
      (clamped[0].start.getTime() - tenYearsAgo.getTime()) / MS_PER_DAY
    );
    if (gapDays > ALLOWABLE_GAP_DAYS) {
      gaps.push({
        gapStart: tenYearsAgo,
        gapEnd: clamped[0].start,
        durationDays: gapDays,
        afterEntry: "(start of 10-year period)",
        beforeEntry: clamped[0].label,
      });
    }
  }

  // Check gaps between entries
  let latestEnd = clamped.length > 0 ? clamped[0].start : tenYearsAgo;

  for (const entry of clamped) {
    if (entry.start > latestEnd) {
      const gapDays = Math.ceil(
        (entry.start.getTime() - latestEnd.getTime()) / MS_PER_DAY
      );
      if (gapDays > ALLOWABLE_GAP_DAYS) {
        gaps.push({
          gapStart: latestEnd,
          gapEnd: entry.start,
          durationDays: gapDays,
          afterEntry:
            clamped[clamped.indexOf(entry) - 1]?.label || "(unknown)",
          beforeEntry: entry.label,
        });
      }
    }

    const coverageStart = entry.start > latestEnd ? entry.start : latestEnd;
    const coverageEnd = entry.end;
    if (coverageEnd > coverageStart) {
      totalCoverageDays += Math.ceil(
        (coverageEnd.getTime() - coverageStart.getTime()) / MS_PER_DAY
      );
    }

    if (entry.end > latestEnd) {
      latestEnd = entry.end;
    }
  }

  // Check gap from last entry to present
  if (latestEnd < now) {
    const gapDays = Math.ceil(
      (now.getTime() - latestEnd.getTime()) / MS_PER_DAY
    );
    if (gapDays > ALLOWABLE_GAP_DAYS) {
      gaps.push({
        gapStart: latestEnd,
        gapEnd: now,
        durationDays: gapDays,
        afterEntry: clamped[clamped.length - 1]?.label || "(unknown)",
        beforeEntry: "(present)",
      });
    }
  }

  const coveragePercent = Math.min(
    100,
    (totalCoverageDays / requiredCoverageDays) * 100
  );

  return {
    isValid: gaps.length === 0,
    gaps,
    totalCoverageDays,
    requiredCoverageDays,
    coveragePercent: Math.round(coveragePercent * 10) / 10,
  };
}

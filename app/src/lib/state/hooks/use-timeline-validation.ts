'use client';

// ---------------------------------------------------------------------------
// Timeline Gap Detection Hook for Residency / Employment
// ---------------------------------------------------------------------------

import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import type { SF86Section } from '@/lib/field-registry/types';
import { sectionFieldsAtom } from '@/lib/state/atoms/field-atoms';
import { validateTimeline } from '@/lib/validation/timeline-validator';

/**
 * Extracts timeline entries from residency or employment section data
 * and runs gap detection.
 *
 * @param section Must be 'section11' (residency) or 'section13A' (employment).
 */
export function useTimelineValidation(section: 'section11' | 'section13A') {
  const snapshotAtom = useMemo(
    () => sectionFieldsAtom(section as SF86Section),
    [section],
  );
  const snapshot = useAtomValue(snapshotAtom);

  return useMemo(() => {
    // Extract timeline entries from the flat field snapshot.
    // Fields follow the pattern: section.N.startDate, section.N.endDate, section.N.label
    const entries = extractTimelineEntries(snapshot, section);
    return validateTimeline(entries);
  }, [snapshot, section]);
}

interface TimelineEntry {
  startDate: string;
  endDate: string | null;
  label: string;
}

/**
 * Scans field snapshot for date-like keys and groups them into timeline entries.
 */
function extractTimelineEntries(
  snapshot: Record<string, unknown>,
  section: string,
): TimelineEntry[] {
  // Group by repeat index: look for patterns like:
  //   residencyInfo.0.startDate / residencyInfo.0.endDate / residencyInfo.0.address
  //   employment.0.startDate / employment.0.endDate / employment.0.employer
  const instanceMap = new Map<string, { start?: string; end?: string; label?: string }>();

  for (const [key, value] of Object.entries(snapshot)) {
    if (typeof value !== 'string' || !value) continue;

    const lower = key.toLowerCase();

    // Try to extract an instance identifier (e.g., "residencyInfo.2" or "employment.1")
    const instanceMatch = key.match(/^([^.]+\.(\d+))\./);
    if (!instanceMatch) continue;

    const instanceKey = instanceMatch[1];
    let entry = instanceMap.get(instanceKey);
    if (!entry) {
      entry = {};
      instanceMap.set(instanceKey, entry);
    }

    if (lower.includes('startdate') || lower.includes('from_date') || lower.includes('fromdate')) {
      entry.start = value;
    } else if (lower.includes('enddate') || lower.includes('to_date') || lower.includes('todate')) {
      entry.end = value;
    } else if (
      lower.includes('address') ||
      lower.includes('employer') ||
      lower.includes('street') ||
      lower.includes('city') ||
      lower.includes('name')
    ) {
      if (!entry.label) entry.label = value;
    }
  }

  // Also scan for generic date patterns without clear instance grouping
  // e.g., "sect11_from_0", "sect11_to_0"
  for (const [key, value] of Object.entries(snapshot)) {
    if (typeof value !== 'string' || !value) continue;

    const dateMatch = key.match(/(from|start|to|end).*?(\d+)/i);
    if (!dateMatch) continue;

    const idx = dateMatch[2];
    const instanceKey = `${section}.${idx}`;

    if (instanceMap.has(instanceKey)) continue; // already handled above

    let entry = instanceMap.get(instanceKey);
    if (!entry) {
      entry = {};
      instanceMap.set(instanceKey, entry);
    }

    const direction = dateMatch[1].toLowerCase();
    if (direction === 'from' || direction === 'start') {
      entry.start = value;
    } else {
      entry.end = value;
    }
  }

  const entries: TimelineEntry[] = [];
  for (const [instanceKey, entry] of instanceMap) {
    if (!entry.start) continue; // can't create a timeline entry without a start date

    // Validate it's a parseable date
    const startDate = new Date(entry.start);
    if (isNaN(startDate.getTime())) continue;

    entries.push({
      startDate: entry.start,
      endDate: entry.end || null,
      label: entry.label || instanceKey,
    });
  }

  return entries;
}

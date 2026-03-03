'use client';

import { useMemo } from 'react';
import { atom, useAtomValue } from 'jotai';
import type { WizardStep } from '@/lib/wizard/types';
import { useRegistry } from '@/lib/field-registry/use-registry';
import { fieldValueAtomFamily, type FieldValue } from '@/lib/state/atoms/field-atoms';

interface RepeatGroupCardsProps {
  /** All steps belonging to the same repeat group (across indices). */
  steps: WizardStep[];
  /** The repeat group name. */
  groupName: string;
  /** Called when user clicks Edit/Start on an entry. */
  onEditEntry: (stepIndex: number) => void;
}

/**
 * Card-list overview for repeating entries (residences, employers, etc.).
 * Shows a summary card per repeat index with key field values.
 */
export function RepeatGroupCards({
  steps,
  groupName,
  onEditEntry,
}: RepeatGroupCardsProps) {
  // Group steps by repeatIndex
  const entries = useMemo(() => {
    const map = new Map<number, WizardStep[]>();
    for (const step of steps) {
      const idx = step.repeatIndex ?? 0;
      const arr = map.get(idx);
      if (arr) arr.push(step);
      else map.set(idx, [step]);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a - b);
  }, [steps]);

  const displayName = formatGroupName(groupName, steps);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{displayName}</h3>
      <div className="space-y-3">
        {entries.map(([idx, entrySteps]) => (
          <EntryCard
            key={idx}
            repeatIndex={idx}
            steps={entrySteps}
            onEdit={() => {
              // Find the first step of this entry in the original steps array
              const firstStep = entrySteps[0];
              const globalIdx = steps.indexOf(firstStep);
              onEditEntry(globalIdx >= 0 ? globalIdx : 0);
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

interface EntryCardProps {
  repeatIndex: number;
  steps: WizardStep[];
  onEdit: () => void;
}

function EntryCard({ repeatIndex, steps, onEdit }: EntryCardProps) {
  const registry = useRegistry();

  // Derive an entry label from the step title: "Employment 1 - Contact" → "Employment 1"
  const entryLabel = useMemo(() => {
    const firstTitle = steps[0]?.title ?? '';
    const match = firstTitle.match(/^(.+?\s+\d+)/);
    return match ? match[1] : `Entry ${repeatIndex + 1}`;
  }, [steps, repeatIndex]);

  // Collect summary fields from first step
  const summaryKeys = useMemo(() => {
    const keys: string[] = [];
    for (const step of steps) {
      for (const key of step.fieldKeys) {
        const field = registry.getBySemanticKey(key);
        if (!field) continue;
        // Prioritize: address/name/date fields for summary
        const k = field.semanticKey.toLowerCase();
        if (k.includes('address') || k.includes('street') || k.includes('name') ||
            k.includes('city') || k.includes('date') || k.includes('employer') ||
            k.includes('school') || k.includes('from') || k.includes('type')) {
          keys.push(key);
        }
        if (keys.length >= 3) break;
      }
      if (keys.length >= 3) break;
    }
    // If we found nothing, take first 2 text fields
    if (keys.length === 0) {
      for (const step of steps) {
        for (const key of step.fieldKeys) {
          const field = registry.getBySemanticKey(key);
          if (field && (field.uiFieldType === 'text' || field.uiFieldType === 'date')) {
            keys.push(key);
            if (keys.length >= 2) break;
          }
        }
        if (keys.length >= 2) break;
      }
    }
    return keys;
  }, [steps, registry]);

  const fillRatio = useEntryFillRatio(steps, registry);

  return (
    <div className="rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between p-4">
        <div className="flex items-start gap-3 min-w-0">
          <EntryStatusIcon fillRatio={fillRatio} />
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-900">
              {entryLabel}
            </div>
            <SummaryValues keys={summaryKeys} />
          </div>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="ml-3 shrink-0 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <EntryButtonLabel fillRatio={fillRatio} />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function SummaryValues({ keys }: { keys: string[] }) {
  return (
    <div className="mt-0.5 space-y-0.5">
      {keys.map((key) => (
        <SummaryValue key={key} semanticKey={key} />
      ))}
    </div>
  );
}

function SummaryValue({ semanticKey }: { semanticKey: string }) {
  const value = useAtomValue(fieldValueAtomFamily(semanticKey));
  if (!value || value === '') return null;

  return (
    <div className="text-xs text-gray-600 truncate max-w-xs">
      {String(value)}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hook: compute fill ratio for an entry's required fields via a derived atom
// ---------------------------------------------------------------------------

/** Returns true if a field value counts as "filled" (mirrors logic in field-atoms.ts). */
function isFieldFilled(value: FieldValue): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'boolean') return true; // even `false` is a deliberate answer
  if (typeof value === 'number') return true;
  return false;
}

/**
 * Subscribe to all required field values for an entry and compute fill ratio.
 * Returns a number between 0 and 1 (filled / total required).
 * If there are no required fields, returns -1 so callers can distinguish "nothing required".
 */
function useEntryFillRatio(
  steps: WizardStep[],
  registry: ReturnType<typeof useRegistry>,
): number {
  // Collect required field keys across all steps in this entry.
  const requiredKeys = useMemo(() => {
    const keys: string[] = [];
    const seen = new Set<string>();
    for (const step of steps) {
      for (const key of step.fieldKeys) {
        if (seen.has(key)) continue;
        const field = registry.getBySemanticKey(key);
        if (field?.required) {
          seen.add(key);
          keys.push(key);
        }
      }
    }
    return keys;
  }, [steps, registry]);

  // Stable key for memoizing the derived atom (avoids recreating on every render).
  const keysFingerprint = useMemo(() => requiredKeys.join(','), [requiredKeys]);

  // Single derived atom that reads all required field values and computes ratio.
  const fillRatioAtom = useMemo(
    () =>
      atom((get) => {
        if (requiredKeys.length === 0) return -1;
        let filled = 0;
        for (const key of requiredKeys) {
          if (isFieldFilled(get(fieldValueAtomFamily(key)))) filled++;
        }
        return filled / requiredKeys.length;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [keysFingerprint],
  );

  return useAtomValue(fillRatioAtom);
}

// ---------------------------------------------------------------------------

function EntryStatusIcon({ fillRatio }: { fillRatio: number }) {
  // All required fields filled (or no required fields)
  if (fillRatio >= 1 || fillRatio === -1) {
    return (
      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }

  // Some required fields filled
  if (fillRatio > 0) {
    return (
      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
        <div className="h-2 w-2 rounded-full bg-current" />
      </div>
    );
  }

  // No required fields filled
  return (
    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 text-gray-400" />
  );
}

function EntryButtonLabel({ fillRatio }: { fillRatio: number }) {
  return <span>{fillRatio > 0 || fillRatio === -1 ? 'Edit' : 'Start'}</span>;
}

// ---------------------------------------------------------------------------

/** Derive a human-readable group heading from the step titles in the group. */
export function formatGroupName(name: string, steps: WizardStep[]): string {
  // Try to extract the entity type from the first step's title.
  // Titles follow patterns like "Employment 1 - Contact", "Residence 1 - Dates".
  const firstTitle = steps[0]?.title ?? '';
  const match = firstTitle.match(/^(.+?)\s+\d/);
  if (match) {
    const base = match[1].trim();
    // Pluralize simple words
    if (base.endsWith('y') && !/[aeiou]y$/i.test(base)) return base.slice(0, -1) + 'ies';
    if (/(?:s|sh|ch|x|z)$/i.test(base)) return base + 'es';
    return base + 's';
  }

  // Fallback: known semantic names
  if (name === 'residency') return 'Residences';

  // Last resort: clean up the internal name
  const cleaned = name
    .replace(/^section_?/i, '')
    .replace(/_/g, ' ')
    .replace(/(\d+)/g, ' $1 ')
    .trim();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

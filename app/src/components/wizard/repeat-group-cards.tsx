'use client';

import { useMemo, useCallback, useState } from 'react';
import { atom, useAtomValue } from 'jotai';
import type { SF86Section } from '@/lib/field-registry/types';
import type { WizardStep } from '@/lib/wizard/types';
import { useRegistry } from '@/lib/field-registry/use-registry';
import { fieldValueAtomFamily, type FieldValue } from '@/lib/state/atoms/field-atoms';
import {
  getLinkedGroupConfig,
  getEntityEntries,
  getEntityStepRange,
  type LinkedGroupConfig,
} from '@/lib/wizard/linked-group-utils';

interface RepeatGroupCardsProps {
  /** All steps belonging to the same repeat group (across indices). */
  steps: WizardStep[];
  /** The repeat group name. */
  groupName: string;
  /** Called when user clicks Edit/Start on an entry. */
  onEditEntry: (stepIndex: number) => void;
  /** Section key for linked group detection. */
  sectionKey?: SF86Section;
  /** All visible steps (needed for linked group index resolution). */
  allVisibleSteps?: WizardStep[];
}

/**
 * Card-list overview for repeating entries (residences, employers, etc.).
 * Progressive disclosure: shows Entry 1 always, Entry N+1 when Entry N
 * has any field filled. Users can manually add entries via "Add Entry".
 *
 * When a section has linked groups (e.g. section 18 relatives), entries
 * are merged across all sub-groups into unified entity cards.
 */
export function RepeatGroupCards({
  steps,
  groupName,
  onEditEntry,
  sectionKey,
  allVisibleSteps,
}: RepeatGroupCardsProps) {
  // Check for linked group config
  const linkedConfig = useMemo(
    () => (sectionKey ? getLinkedGroupConfig(sectionKey) : null),
    [sectionKey],
  );

  // Group steps by repeatIndex — when linked, merge across all sub-groups
  const entries = useMemo(() => {
    if (linkedConfig && sectionKey && allVisibleSteps) {
      // Use linked group entity entries (merges all sub-groups)
      const entityEntries = getEntityEntries(linkedConfig, sectionKey, allVisibleSteps);
      return entityEntries.map(({ index, steps: entitySteps }) =>
        [index, entitySteps] as [number, WizardStep[]],
      );
    }
    // Default: group by repeatIndex within this single group
    const map = new Map<number, WizardStep[]>();
    for (const step of steps) {
      const idx = step.repeatIndex ?? 0;
      const arr = map.get(idx);
      if (arr) arr.push(step);
      else map.set(idx, [step]);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a - b);
  }, [steps, linkedConfig, sectionKey, allVisibleSteps]);

  // Track manually revealed entries
  const [manuallyRevealed, setManuallyRevealed] = useState(0);

  const handleAddEntry = useCallback(() => {
    setManuallyRevealed((n) => n + 1);
  }, []);

  const displayName = linkedConfig
    ? pluralizeEntity(linkedConfig.entityLabel)
    : formatGroupName(groupName, steps);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{displayName}</h3>
      <div className="space-y-3">
        <ProgressiveEntryList
          entries={entries}
          steps={allVisibleSteps ?? steps}
          manuallyRevealed={manuallyRevealed}
          onEditEntry={onEditEntry}
          onAddEntry={handleAddEntry}
          entityLabel={linkedConfig?.entityLabel}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Progressive entry list — subscribes to field values to determine visibility
// ---------------------------------------------------------------------------

interface ProgressiveEntryListProps {
  entries: [number, WizardStep[]][];
  steps: WizardStep[];
  manuallyRevealed: number;
  onEditEntry: (stepIndex: number) => void;
  onAddEntry: () => void;
  entityLabel?: string;
}

function ProgressiveEntryList({
  entries,
  steps,
  manuallyRevealed,
  onEditEntry,
  onAddEntry,
  entityLabel,
}: ProgressiveEntryListProps) {
  // Collect ALL field keys across ALL entries for a single subscription
  const allFieldKeys = useMemo(() => {
    const keys: string[] = [];
    const seen = new Set<string>();
    for (const [, entrySteps] of entries) {
      for (const step of entrySteps) {
        for (const key of step.fieldKeys) {
          if (!seen.has(key)) {
            seen.add(key);
            keys.push(key);
          }
        }
      }
    }
    return keys;
  }, [entries]);

  const allKeysKey = useMemo(() => allFieldKeys.join(','), [allFieldKeys]);

  // Single atom that checks which entries have any filled field
  const entryFilledAtom = useMemo(
    () =>
      atom((get) => {
        const filledEntries = new Set<number>();
        for (const [idx, entrySteps] of entries) {
          for (const step of entrySteps) {
            for (const key of step.fieldKeys) {
              const val = get(fieldValueAtomFamily(key));
              if (isFieldFilled(val)) {
                filledEntries.add(idx);
                break;
              }
            }
            if (filledEntries.has(idx)) break;
          }
        }
        return filledEntries;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allKeysKey],
  );

  const filledEntries = useAtomValue(entryFilledAtom);

  // Determine which entries to show:
  // - Entry 0 always visible
  // - Entry N visible if Entry N-1 has any filled field OR manually revealed
  const visibleEntries = useMemo(() => {
    const result: [number, WizardStep[]][] = [];
    let revealedByManual = 0;

    for (let i = 0; i < entries.length; i++) {
      const [idx, entrySteps] = entries[i];
      const prevIdx = i > 0 ? entries[i - 1][0] : -1;

      if (i === 0) {
        // Always show first entry
        result.push([idx, entrySteps]);
      } else if (filledEntries.has(prevIdx)) {
        // Previous entry has data, auto-reveal this one
        result.push([idx, entrySteps]);
      } else if (revealedByManual < manuallyRevealed) {
        // Manually revealed
        result.push([idx, entrySteps]);
        revealedByManual++;
      } else {
        // This and all subsequent entries are hidden
        break;
      }
    }
    return result;
  }, [entries, filledEntries, manuallyRevealed]);

  const hasMoreEntries = visibleEntries.length < entries.length;

  return (
    <>
      {visibleEntries.map(([idx, entrySteps]) => (
        <EntryCard
          key={idx}
          repeatIndex={idx}
          steps={entrySteps}
          entityLabel={entityLabel}
          onEdit={() => {
            const firstStep = entrySteps[0];
            const globalIdx = steps.indexOf(firstStep);
            onEditEntry(globalIdx >= 0 ? globalIdx : 0);
          }}
        />
      ))}

      {hasMoreEntries && (
        <button
          type="button"
          onClick={onAddEntry}
          className="
            flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed
            border-gray-300 py-3 text-sm font-medium text-gray-500
            hover:border-blue-400 hover:text-blue-600 transition-colors
          "
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Entry
        </button>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------

interface EntryCardProps {
  repeatIndex: number;
  steps: WizardStep[];
  onEdit: () => void;
  entityLabel?: string;
}

function EntryCard({ repeatIndex, steps, onEdit, entityLabel }: EntryCardProps) {
  const registry = useRegistry();

  // Derive an entry label: use linked entity label if provided, else extract from title
  const entryLabel = useMemo(() => {
    if (entityLabel) return `${entityLabel} ${repeatIndex + 1}`;
    const firstTitle = steps[0]?.title ?? '';
    const match = firstTitle.match(/^(.+?\s+\d+)/);
    return match ? match[1] : `Entry ${repeatIndex + 1}`;
  }, [steps, repeatIndex, entityLabel]);

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
  // All required fields filled
  if (fillRatio >= 1) {
    return (
      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }

  // No required fields (neutral gray circle with dash)
  if (fillRatio === -1) {
    return (
      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400">
        <div className="h-0.5 w-2 bg-current" />
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

/** Pluralize an entity label: "Relative" → "Relatives", "Employment Entry" → "Employment Entries". */
function pluralizeEntity(label: string): string {
  if (label.endsWith('y') && !/[aeiou]y$/i.test(label)) {
    return label.slice(0, -1) + 'ies';
  }
  if (/(?:s|sh|ch|x|z)$/i.test(label)) return label + 'es';
  return label + 's';
}

/** Derive a human-readable group heading from the step titles in the group. */
export function formatGroupName(name: string, steps: WizardStep[]): string {
  // Try to extract the entity type from step titles.
  // Titles follow patterns like "Employment 1 - Contact", "Residence 1 - Dates".
  // The first step may be a gate question, so check all steps.
  for (const step of steps) {
    const title = step.title ?? '';
    const match = title.match(/^(.+?)\s+\d/);
    if (match) {
      const base = match[1].trim();
      // Pluralize simple words
      if (base.endsWith('y') && !/[aeiou]y$/i.test(base)) return base.slice(0, -1) + 'ies';
      if (/(?:s|sh|ch|x|z)$/i.test(base)) return base + 'es';
      return base + 's';
    }
  }

  // Fallback: known semantic names
  if (name === 'residency') return 'Residences';

  // Section-based fallback: map group keys like "section22_1", "section_23_4" to names
  // Extract primary section number (handles section13_5, section_23_4, section22_3_1, etc.)
  const sectionMatch = name.match(/^section_?(\d+)/);
  if (sectionMatch) {
    const secNum = sectionMatch[1];
    const sectionNames: Record<string, string> = {
      '5': 'Other Names', '7': 'Contact Information', '8': 'Passports',
      '9': 'Citizenship', '10': 'Citizenships', '11': 'Residences', '12': 'Schools',
      '13': 'Employment History', '14': 'Selective Service', '15': 'Military Service',
      '16': 'Personal References', '17': 'Relationships', '18': 'Relatives',
      '19': 'Foreign Contacts', '20': 'Foreign Activities',
      '21': 'Psychological Health', '22': 'Police Records', '23': 'Drug Activity',
      '24': 'Alcohol Use', '25': 'Investigations & Clearances', '26': 'Financial Records',
      '27': 'IT Systems', '28': 'Civil Court Actions', '29': 'Associations',
    };
    if (sectionNames[secNum]) return sectionNames[secNum];
  }

  // Last resort: clean up the internal name
  const cleaned = name
    .replace(/^section_?/i, '')
    .replace(/_/g, ' ')
    .replace(/(\d+)/g, ' $1 ')
    .trim();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

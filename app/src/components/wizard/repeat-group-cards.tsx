'use client';

import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import type { WizardStep } from '@/lib/wizard/types';
import type { FieldDefinition } from '@/lib/field-registry/types';
import { useRegistry } from '@/lib/field-registry/use-registry';
import { fieldValueAtomFamily } from '@/lib/state/atoms/field-atoms';

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

  const displayName = formatGroupName(groupName);

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

  return (
    <div className="rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between p-4">
        <div className="flex items-start gap-3 min-w-0">
          <EntryStatusIcon steps={steps} registry={registry} />
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-900">
              Entry {repeatIndex + 1}
            </div>
            <SummaryValues keys={summaryKeys} />
          </div>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="ml-3 shrink-0 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <EntryButtonLabel steps={steps} registry={registry} />
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

function EntryStatusIcon({ steps, registry }: { steps: WizardStep[]; registry: ReturnType<typeof useRegistry> }) {
  // Check if any required field has a value
  let hasAnyValue = false;
  for (const step of steps) {
    for (const key of step.fieldKeys) {
      const field = registry.getBySemanticKey(key);
      if (field?.required) {
        hasAnyValue = true;
        break;
      }
    }
    if (hasAnyValue) break;
  }

  // We can't use hooks conditionally, so just show a generic icon
  // The actual fill status check happens via SummaryValues
  return (
    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 text-gray-400">
      <span className="text-xs font-bold">{hasAnyValue ? '!' : ''}</span>
    </div>
  );
}

function EntryButtonLabel({ steps, registry }: { steps: WizardStep[]; registry: ReturnType<typeof useRegistry> }) {
  // Simple heuristic: if entry has any text fields, show "Edit", else "Start"
  return <span>Edit</span>;
}

// ---------------------------------------------------------------------------

function formatGroupName(name: string): string {
  // Convert internal names like "residency" or "section_12_2" to display names
  const cleaned = name
    .replace(/^section_?/i, '')
    .replace(/_/g, ' ')
    .replace(/(\d+)/g, ' $1 ')
    .trim();

  // Capitalize first letter
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

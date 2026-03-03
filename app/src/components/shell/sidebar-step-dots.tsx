'use client';

// ---------------------------------------------------------------------------
// SidebarStepDots -- Compact step-level progress in the section sidebar
// ---------------------------------------------------------------------------
//
// Shows step completion status under each section link when in wizard mode.
//
// For the ACTIVE section: subscribes to Jotai field value atoms and computes
// per-step completion using computeStepCompletion. Renders individual dots
// (<=12 steps) or a thin progress bar (>12 steps).
//
// For NON-ACTIVE sections: receives a precomputed step count and completed
// count to render a thin progress bar without subscribing to field atoms.
// ---------------------------------------------------------------------------

import { useEffect, useMemo, useState } from 'react';
import { atom, useAtomValue } from 'jotai';

import type { SF86Section } from '@/lib/field-registry/types';
import type { WizardStep, SectionWizardConfig } from '@/lib/wizard/types';
import { useRegistry } from '@/lib/field-registry/use-registry';
import { computeStepCompletion } from '@/lib/wizard/step-utils';
import { fieldValueAtomFamily, type FieldValue } from '@/lib/state/atoms/field-atoms';
import wizardStepsData from '@/lib/wizard/wizard-steps.json';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Threshold: above this many steps, show a progress bar instead of dots. */
const DOT_THRESHOLD = 12;

// ---------------------------------------------------------------------------
// Helper: get wizard config for a section
// ---------------------------------------------------------------------------

const stepsRecord = wizardStepsData as Record<string, SectionWizardConfig>;

function getStepsForSection(section: SF86Section): WizardStep[] {
  return stepsRecord[section]?.steps ?? [];
}

// ---------------------------------------------------------------------------
// Active section dots -- subscribes to Jotai field atoms
// ---------------------------------------------------------------------------

interface ActiveStepDotsProps {
  section: SF86Section;
  currentStepIndex: number;
}

/**
 * For the active section, compute per-step completion by subscribing to
 * all field values across all steps. Uses a single derived atom to batch
 * reads and avoid per-field re-renders.
 */
function ActiveStepDots({ section, currentStepIndex }: ActiveStepDotsProps) {
  // Only render step completion data on the client to avoid hydration
  // mismatches — Jotai atoms are not populated during SSR.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const registry = useRegistry();
  const steps = useMemo(() => getStepsForSection(section), [section]);

  // Collect all unique field keys across all steps for this section.
  const allFieldKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const step of steps) {
      for (const fk of step.fieldKeys) {
        keys.add(fk);
      }
    }
    return Array.from(keys);
  }, [steps]);

  // Stable key for atom memoization.
  const fieldKeysKey = useMemo(() => allFieldKeys.join(','), [allFieldKeys]);

  // Single derived atom that reads all field values for this section's steps.
  const fieldValuesAtom = useMemo(
    () =>
      atom((get) => {
        const values: Record<string, FieldValue> = {};
        for (const key of allFieldKeys) {
          values[key] = get(fieldValueAtomFamily(key));
        }
        return values;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fieldKeysKey],
  );

  const fieldValues = useAtomValue(fieldValuesAtom);

  // Compute per-step completion ratios.
  const stepCompletions = useMemo(() => {
    const getVal = (key: string): FieldValue => fieldValues[key] ?? null;
    return steps.map((step) => computeStepCompletion(step, registry, getVal));
  }, [steps, registry, fieldValues]);

  if (steps.length === 0) return null;

  // Before mount, render a static placeholder to avoid hydration mismatch.
  if (!mounted) {
    if (steps.length > DOT_THRESHOLD) {
      return (
        <div className="mt-1 px-1">
          <div className="h-1 rounded-full bg-gray-200 overflow-hidden" />
          <span className="text-[10px] text-gray-400 mt-0.5 block">
            {steps.length} steps
          </span>
        </div>
      );
    }
    return (
      <div className="mt-1 flex items-center gap-[3px] px-1" role="group">
        {steps.map((step) => (
          <span key={step.id} className="inline-block rounded-full flex-shrink-0 h-1.5 w-1.5 bg-gray-300" />
        ))}
      </div>
    );
  }

  // For many steps, show a compact progress bar.
  if (steps.length > DOT_THRESHOLD) {
    const completedCount = stepCompletions.filter((c) => c >= 1).length;
    const pct = steps.length > 0 ? (completedCount / steps.length) * 100 : 0;

    return (
      <div className="mt-1 px-1" aria-label={`${completedCount} of ${steps.length} steps complete`} suppressHydrationWarning>
        <div className="h-1 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-300"
            style={{ width: `${Math.max(pct, pct > 0 ? 2 : 0)}%` }}
          />
        </div>
        <span className="text-[10px] text-gray-400 mt-0.5 block" suppressHydrationWarning>
          {completedCount}/{steps.length} steps
        </span>
      </div>
    );
  }

  // For few steps, show individual dots.
  return (
    <div
      className="mt-1 flex items-center gap-[3px] px-1"
      role="group"
      aria-label={`Step progress: ${stepCompletions.filter((c) => c >= 1).length} of ${steps.length} complete`}
         >
      {steps.map((step, i) => {
        const completion = stepCompletions[i];
        const isCompleted = completion >= 1;
        const isCurrent = i === currentStepIndex;

        return (
          <span
            key={step.id}
            className={`
              inline-block rounded-full flex-shrink-0
              ${isCurrent
                ? 'h-[7px] w-[7px] border border-blue-600 bg-white'
                : isCompleted
                  ? 'h-1.5 w-1.5 bg-blue-500'
                  : 'h-1.5 w-1.5 bg-gray-300'
              }
            `}
            title={`Step ${i + 1}: ${step.title}${isCompleted ? ' (complete)' : isCurrent ? ' (current)' : ''}`}
          />
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inactive section bar -- no Jotai subscription, just step count
// ---------------------------------------------------------------------------

interface InactiveStepBarProps {
  section: SF86Section;
}

/**
 * For non-active sections, show a thin progress bar without subscribing
 * to individual field atoms. We compute a lightweight step count only.
 */
function InactiveStepBar({ section }: InactiveStepBarProps) {
  const steps = useMemo(() => getStepsForSection(section), [section]);

  if (steps.length <= 1) return null;

  // Without subscribing to field values, we cannot know completion.
  // Show just the step count as a subtle indicator.
  return (
    <div className="mt-0.5 px-1">
      <span className="text-[10px] text-gray-400">
        {steps.length} steps
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Public component -- decides between active/inactive rendering
// ---------------------------------------------------------------------------

interface SidebarStepDotsProps {
  section: SF86Section;
  isActive: boolean;
  currentStepIndex: number;
}

/**
 * Renders step-level progress indicators under a section link in the sidebar.
 *
 * - For the active section: detailed dots or progress bar with Jotai subscriptions.
 * - For inactive sections: lightweight step count label (no subscriptions).
 */
export function SidebarStepDots({
  section,
  isActive,
  currentStepIndex,
}: SidebarStepDotsProps) {
  if (isActive) {
    return <ActiveStepDots section={section} currentStepIndex={currentStepIndex} />;
  }
  return <InactiveStepBar section={section} />;
}

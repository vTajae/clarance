'use client';

// ---------------------------------------------------------------------------
// useWizardNavigation -- Core wizard step navigation hook
// ---------------------------------------------------------------------------
//
// Loads the SectionWizardConfig for the active section, evaluates gate
// conditions to determine which steps are visible, and exposes navigation
// actions that drive the wizard UI.
//
// Gate reactivity strategy:
//   We build a single derived Jotai atom that reads all gate field values
//   for the current section. The atom reference is memoized on the gate key
//   list (which only changes when the section changes). This gives us
//   reactive re-renders whenever any gate value changes, without violating
//   React's rules of hooks.
// ---------------------------------------------------------------------------

import { useMemo, useCallback } from 'react';
import { atom, useAtomValue } from 'jotai';

import { useAppStore } from '@/lib/state/stores/app-store';
import { useRegistry } from '@/lib/field-registry/use-registry';
import { fieldValueAtomFamily, type FieldValue } from '@/lib/state/atoms/field-atoms';
import type { WizardStep, SectionWizardConfig } from './types';
import { filterVisibleSteps, extractGateKeys } from './step-utils';
import wizardStepsData from './wizard-steps.json';

// ---------------------------------------------------------------------------
// Return type
// ---------------------------------------------------------------------------

export interface WizardNavigationState {
  /** Steps visible after gate filtering, in order. */
  visibleSteps: WizardStep[];
  /** The currently active step (null only if section has no steps). */
  currentStep: WizardStep | null;
  /** 0-based index of the current step within visibleSteps. */
  currentStepIndex: number;
  /** Total number of visible steps. */
  totalVisibleSteps: number;
  /** Whether there is a next step available. */
  canGoNext: boolean;
  /** Whether there is a previous step available. */
  canGoPrev: boolean;
  /** Whether the current step is the last visible step. */
  isLastStep: boolean;
  /** Whether the wizard is in end-of-section review mode. */
  isReviewMode: boolean;
  /** All steps for the section (including hidden conditional ones). */
  allSteps: WizardStep[];
  /** The section config for the current section (null if section not found). */
  sectionConfig: SectionWizardConfig | null;

  /** Advance to the next visible step, or enter review if on the last step. */
  nextStep: () => void;
  /** Go to the previous visible step, or exit review if in review mode. */
  prevStep: () => void;
  /** Jump to a specific visible step by index. */
  goToStep: (index: number) => void;
}

// ---------------------------------------------------------------------------
// Hook implementation
// ---------------------------------------------------------------------------

export function useWizardNavigation(): WizardNavigationState {
  const currentSection = useAppStore((s) => s.currentSection);
  const rawStepIndex = useAppStore((s) => s.currentStepIndex);
  const inReviewMode = useAppStore((s) => s.inReviewMode);
  const storeNextStep = useAppStore((s) => s.nextStep);
  const storePrevStep = useAppStore((s) => s.prevStep);
  const storeGoToStep = useAppStore((s) => s.goToStep);
  const storeEnterReview = useAppStore((s) => s.enterReview);
  const storeExitReview = useAppStore((s) => s.exitReview);
  const registry = useRegistry();

  // -------------------------------------------------------------------------
  // 1. Load section config
  // -------------------------------------------------------------------------

  const sectionConfig: SectionWizardConfig | null = useMemo(() => {
    const config = (wizardStepsData as Record<string, SectionWizardConfig>)[currentSection];
    if (config) return config;
    return null;
  }, [currentSection]);

  /**
   * All steps for the section. If the section has no config in the JSON,
   * build a single fallback step containing all fields for the section.
   */
  const allSteps: WizardStep[] = useMemo(() => {
    if (sectionConfig) return sectionConfig.steps;

    // Fallback: create a single "all fields" step for unconfigured sections.
    const sectionFields = registry.getBySection(currentSection);
    if (sectionFields.length === 0) return [];

    return [
      {
        id: `${currentSection}-all`,
        title: 'All Fields',
        guidance: 'Complete all fields in this section.',
        fieldKeys: sectionFields.map((f) => f.semanticKey),
      },
    ];
  }, [sectionConfig, registry, currentSection]);

  // -------------------------------------------------------------------------
  // 2. Collect gate keys and subscribe to their values reactively
  // -------------------------------------------------------------------------

  /**
   * Gate keys are extracted from the static step config. This only changes
   * when the section changes, keeping the derived atom reference stable.
   */
  const gateKeys = useMemo(() => extractGateKeys(allSteps), [allSteps]);

  /**
   * Stable string representation for memoization. Since gateKeys is
   * derived from allSteps (which is memoized on section), this is
   * inherently stable, but we use a join for the useMemo dep.
   */
  const gateKeysKey = useMemo(() => gateKeys.join(','), [gateKeys]);

  /**
   * A single derived atom that reads all gate field values at once.
   * This atom's identity is stable for a given set of gate keys,
   * so useAtomValue subscribes to all gates without hook-count issues.
   */
  const gateValuesAtom = useMemo(
    () =>
      atom((get) => {
        const values: Record<string, FieldValue> = {};
        for (const key of gateKeys) {
          values[key] = get(fieldValueAtomFamily(key));
        }
        return values;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gateKeysKey],
  );

  const gateValues = useAtomValue(gateValuesAtom);

  // -------------------------------------------------------------------------
  // 3. Filter to visible steps
  // -------------------------------------------------------------------------

  const visibleSteps = useMemo(
    () => filterVisibleSteps(allSteps, gateValues, registry),
    [allSteps, gateValues, registry],
  );

  // -------------------------------------------------------------------------
  // 4. Derive navigation state
  // -------------------------------------------------------------------------

  /**
   * Clamp the raw step index from the store to the visible step range.
   * This handles edge cases where a gate changes and the previously
   * selected step becomes hidden.
   */
  const clampedIndex = useMemo(() => {
    if (visibleSteps.length === 0) return 0;
    return Math.min(Math.max(0, rawStepIndex), visibleSteps.length - 1);
  }, [rawStepIndex, visibleSteps.length]);

  const currentStep = visibleSteps[clampedIndex] ?? null;
  const totalVisibleSteps = visibleSteps.length;
  const isLastStep = totalVisibleSteps > 0 && clampedIndex >= totalVisibleSteps - 1;

  // Can advance as long as we are not already in review and have at least one step.
  // On the last step, nextStep() will enter review mode rather than advancing.
  const canGoNext = !inReviewMode && totalVisibleSteps > 0;
  const canGoPrev = inReviewMode || clampedIndex > 0;

  // -------------------------------------------------------------------------
  // 5. Navigation actions
  // -------------------------------------------------------------------------

  /**
   * Advance to the next visible step. If already on the last step,
   * enter the review panel.
   */
  const nextStep = useCallback(() => {
    if (inReviewMode) return; // already in review, nothing to advance to

    if (isLastStep) {
      storeEnterReview();
    } else {
      storeNextStep();
    }
  }, [inReviewMode, isLastStep, storeEnterReview, storeNextStep]);

  /**
   * Go to the previous visible step. If in review mode, exit review
   * and show the last visible step. If on step 0, this is a no-op
   * (section-level back navigation is handled by wizard-controls).
   */
  const prevStep = useCallback(() => {
    if (inReviewMode) {
      storeExitReview();
      // Ensure we land on the last visible step.
      if (visibleSteps.length > 0) {
        storeGoToStep(visibleSteps.length - 1);
      }
      return;
    }

    if (clampedIndex > 0) {
      storePrevStep();
    }
  }, [inReviewMode, clampedIndex, storeExitReview, storePrevStep, storeGoToStep, visibleSteps.length]);

  /**
   * Jump to a specific visible step by index. Clamps to valid range
   * and exits review mode if active.
   */
  const goToStep = useCallback(
    (index: number) => {
      const clamped = Math.min(Math.max(0, index), Math.max(0, totalVisibleSteps - 1));
      storeGoToStep(clamped);
    },
    [totalVisibleSteps, storeGoToStep],
  );

  // -------------------------------------------------------------------------
  // 6. Return
  // -------------------------------------------------------------------------

  return {
    visibleSteps,
    currentStep,
    currentStepIndex: clampedIndex,
    totalVisibleSteps,
    canGoNext,
    canGoPrev,
    isLastStep,
    isReviewMode: inReviewMode,
    allSteps,
    sectionConfig,
    nextStep,
    prevStep,
    goToStep,
  };
}

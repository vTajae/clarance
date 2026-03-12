'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { atom, useAtomValue } from 'jotai';
import { useAppStore } from '@/lib/state/stores/app-store';
import { useWizardNavigation } from '@/lib/wizard/use-wizard-navigation';
import { useRegistry } from '@/lib/field-registry/use-registry';
import { fieldValueAtomFamily, type FieldValue } from '@/lib/state/atoms/field-atoms';
import { computeStepCompletion } from '@/lib/wizard/step-utils';
import {
  ALL_SECTIONS,
  SECTION_META,
  sectionToGroup,
} from '@/lib/field-registry/types';
import type { SF86Section } from '@/lib/field-registry/types';
import { SubmitDialog } from '@/components/wizard/submit-dialog';

interface WizardControlsProps {
  submissionId: string;
}

export function WizardControls({ submissionId }: WizardControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const storeSection = useAppStore((s) => s.currentSection);
  const layoutMode = useAppStore((s) => s.layoutMode);
  const goBack = useAppStore((s) => s.goBack);
  const wizardHistory = useAppStore((s) => s.wizardHistory);
  const storeSaveNow = useAppStore((s) => s.saveNow);
  const registry = useRegistry();

  // Derive section from URL to avoid stale store reads
  const urlSection = pathname?.split('/').pop() as SF86Section | undefined;
  const currentSection = (urlSection && SECTION_META[urlSection]) ? urlSection : storeSection;

  const {
    currentStepIndex,
    totalVisibleSteps,
    isReviewMode,
    canGoNext,
    canGoPrev,
    isLastStep,
    nextStep: wizNextStep,
    prevStep: wizPrevStep,
    currentStep,
    skipToSection,
  } = useWizardNavigation(currentSection);

  // -------------------------------------------------------------------------
  // Submit dialog state (for final section)
  // -------------------------------------------------------------------------
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);

  // -------------------------------------------------------------------------
  // Step validation: track required field completion for the current step
  // -------------------------------------------------------------------------
  const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);

  const requiredKeys = useMemo(() => {
    if (!currentStep) return [];
    return currentStep.fieldKeys.filter((key) => {
      const field = registry.getBySemanticKey(key);
      return field?.required;
    });
  }, [currentStep, registry]);

  const requiredKeysKey = useMemo(() => requiredKeys.join(','), [requiredKeys]);

  const requiredValuesAtom = useMemo(
    () =>
      atom((get) => {
        const values: Record<string, FieldValue> = {};
        for (const key of requiredKeys) {
          values[key] = get(fieldValueAtomFamily(key));
        }
        return values;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [requiredKeysKey],
  );

  const requiredValues = useAtomValue(requiredValuesAtom);

  const stepCompletion = useMemo(() => {
    if (!currentStep) return 1;
    return computeStepCompletion(currentStep, registry, (key) => requiredValues[key] ?? null);
  }, [currentStep, registry, requiredValues]);

  const missingCount = useMemo(() => {
    if (!currentStep) return 0;
    let missing = 0;
    for (const key of requiredKeys) {
      const val = requiredValues[key];
      if (val === null || val === undefined || (typeof val === 'string' && val.trim() === '')) {
        missing++;
      }
    }
    return missing;
  }, [currentStep, requiredKeys, requiredValues]);

  // Gate-only steps (single field = gate field) should not block navigation
  const isGateStep = !!(
    currentStep?.gateFieldKey &&
    !currentStep.isConditionalBlock &&
    currentStep.fieldKeys.length === 1 &&
    currentStep.fieldKeys[0] === currentStep.gateFieldKey
  );

  const sectionIndex = ALL_SECTIONS.indexOf(currentSection);
  const hasPreviousSection = wizardHistory.length > 0 || sectionIndex > 0;
  const hasNextSection = sectionIndex < ALL_SECTIONS.length - 1;
  const isFinalSection = sectionIndex === ALL_SECTIONS.length - 1;

  const currentMeta = SECTION_META[currentSection]!;
  const nextSectionKey = hasNextSection ? ALL_SECTIONS[sectionIndex + 1] : null;

  const navigateToSection = useCallback((section: typeof ALL_SECTIONS[number]) => {
    const group = sectionToGroup(section);
    if (group) {
      router.push(`/${submissionId}/${group}/${section}`);
    }
  }, [submissionId, router]);

  // -- Wizard mode: step-level navigation --
  const isWizardMode = layoutMode === 'wizard';

  const handlePrevious = useCallback(() => {
    if (isWizardMode) {
      // In wizard mode: go to previous step first
      if (canGoPrev) {
        wizPrevStep();
        return;
      }
      // If at step 0, go to previous section
    }

    // Section-level back
    if (wizardHistory.length > 0) {
      goBack();
      const prev = wizardHistory[wizardHistory.length - 1]!;
      navigateToSection(prev);
    } else if (sectionIndex > 0) {
      const prev = ALL_SECTIONS[sectionIndex - 1]!;
      navigateToSection(prev);
    }
  }, [isWizardMode, canGoPrev, wizPrevStep, wizardHistory, goBack, sectionIndex, navigateToSection]);

  const handleNext = useCallback(() => {
    if (isWizardMode) {
      // Auto-skip: gate answered with skip value and no more visible steps
      if (skipToSection) {
        setShowIncompleteWarning(false);
        navigateToSection(skipToSection as SF86Section);
        return;
      }

      // In wizard mode: advance step or enter review
      if (!isReviewMode && (canGoNext || !isLastStep)) {
        // Soft validation: warn on incomplete non-gate steps (first click shows warning, second click advances)
        if (!isGateStep && stepCompletion < 1 && !showIncompleteWarning) {
          setShowIncompleteWarning(true);
          return;
        }
        setShowIncompleteWarning(false);
        wizNextStep();
        return;
      }
      // If in review mode or past last step, advance to next section
    }

    // Section-level advance
    setShowIncompleteWarning(false);
    if (isFinalSection && isReviewMode) {
      // Final section in review mode: open submit dialog
      setSubmitDialogOpen(true);
      return;
    }
    if (nextSectionKey) {
      navigateToSection(nextSectionKey);
    }
  }, [isWizardMode, isReviewMode, canGoNext, isLastStep, wizNextStep, nextSectionKey, navigateToSection, skipToSection, isGateStep, stepCompletion, showIncompleteWarning, isFinalSection]);

  const handleSave = useCallback(() => {
    void storeSaveNow();
  }, [storeSaveNow]);

  // -- Button states --
  const prevDisabled = isWizardMode
    ? !canGoPrev && !hasPreviousSection
    : !hasPreviousSection;

  const nextDisabled = isWizardMode
    ? isReviewMode ? !hasNextSection && !isFinalSection : false
    : !hasNextSection && !isFinalSection;

  const isSubmit = isWizardMode
    ? isReviewMode && isFinalSection
    : isFinalSection;

  const skipSectionTitle = skipToSection
    ? SECTION_META[skipToSection as SF86Section]?.title
    : null;

  const nextLabel = isWizardMode
    ? skipToSection
      ? `Skip to ${skipSectionTitle ?? skipToSection}`
      : isReviewMode
        ? isFinalSection ? 'Submit' : 'Next Section'
        : isLastStep ? 'Review' : 'Next'
    : isFinalSection ? 'Submit' : 'Next';

  // Clear warning when step changes
  const prevStepId = currentStep?.id;
  useEffect(() => {
    setShowIncompleteWarning(false);
  }, [prevStepId]);

  return (
    <div className="sticky bottom-0 border-t border-gray-200 bg-white px-4 py-3 sm:px-6" role="navigation" aria-label="Form navigation">
      {/* Incomplete step warning */}
      {showIncompleteWarning && isWizardMode && missingCount > 0 && (
        <div className="mx-auto mb-2 max-w-3xl rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          <span className="font-medium">{missingCount} required field{missingCount !== 1 ? 's' : ''} incomplete.</span>
          {' '}Click Next again to skip, or fill in the missing fields.
        </div>
      )}
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-2">
        {/* Previous */}
        <button
          type="button"
          onClick={handlePrevious}
          disabled={prevDisabled}
          className={`
            inline-flex items-center gap-1.5 rounded-md border px-4 py-2 text-sm font-medium
            transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
            ${prevDisabled
              ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }
          `}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        {/* Center: save button */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleSave}
            className="
              inline-flex items-center gap-1.5 rounded-md border border-gray-300
              bg-white px-3 py-1.5 text-xs font-medium text-gray-700
              hover:bg-gray-50 transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
            "
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
            Save
          </button>
        </div>

        {/* Next / Review / Submit */}
        <button
          type="button"
          onClick={handleNext}
          disabled={nextDisabled}
          className={`
            inline-flex items-center gap-1.5 rounded-md border px-4 py-2 text-sm font-medium
            transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
            ${nextDisabled
              ? 'border-gray-200 bg-gray-300 text-gray-500 cursor-not-allowed'
              : isSubmit
                ? 'border-green-600 bg-green-600 text-white hover:bg-green-700'
                : 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700'
            }
          `}
        >
          {nextLabel}
          {isSubmit ? (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>

      {/* Submit dialog */}
      <SubmitDialog open={submitDialogOpen} onClose={() => setSubmitDialogOpen(false)} />
    </div>
  );
}

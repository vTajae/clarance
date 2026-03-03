'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useAppStore } from '@/lib/state/stores/app-store';
import { useWizardNavigation } from '@/lib/wizard/use-wizard-navigation';
import {
  ALL_SECTIONS,
  SECTION_META,
  sectionToGroup,
} from '@/lib/field-registry/types';

interface WizardControlsProps {
  submissionId: string;
}

export function WizardControls({ submissionId }: WizardControlsProps) {
  const router = useRouter();
  const currentSection = useAppStore((s) => s.currentSection);
  const layoutMode = useAppStore((s) => s.layoutMode);
  const goBack = useAppStore((s) => s.goBack);
  const wizardHistory = useAppStore((s) => s.wizardHistory);
  const storeSaveNow = useAppStore((s) => s.saveNow);

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
  } = useWizardNavigation();

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
      // In wizard mode: advance step or enter review
      if (!isReviewMode && (canGoNext || !isLastStep)) {
        wizNextStep();
        return;
      }
      // If in review mode or past last step, advance to next section
    }

    // Section-level advance
    if (nextSectionKey) {
      navigateToSection(nextSectionKey);
    }
  }, [isWizardMode, isReviewMode, canGoNext, isLastStep, wizNextStep, nextSectionKey, navigateToSection]);

  const handleSave = useCallback(() => {
    void storeSaveNow();
  }, [storeSaveNow]);

  // -- Display text --
  const showStepInfo = isWizardMode && totalVisibleSteps > 0;
  const centerText = showStepInfo
    ? isReviewMode
      ? `Review · ${currentMeta.title}`
      : `Step ${currentStepIndex + 1} of ${totalVisibleSteps} · ${currentMeta.title}`
    : `${currentMeta.title} (${sectionIndex + 1} of ${ALL_SECTIONS.length})`;

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

  const nextLabel = isWizardMode
    ? isReviewMode
      ? isFinalSection ? 'Submit' : 'Next Section'
      : isLastStep ? 'Review' : 'Next'
    : isFinalSection ? 'Submit' : 'Next';

  return (
    <div className="sticky bottom-0 border-t border-gray-200 bg-white px-4 py-3 sm:px-6" role="navigation" aria-label="Form navigation">
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

        {/* Center: step/section indicator + save */}
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-xs text-gray-500 text-center max-w-md truncate">
            {centerText}
          </span>
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
    </div>
  );
}

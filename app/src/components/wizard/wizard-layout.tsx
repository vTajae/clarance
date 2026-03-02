'use client';

import { useMemo, useRef } from 'react';
import type { SF86Section } from '@/lib/field-registry/types';
import { ALL_SECTIONS, SECTION_META } from '@/lib/field-registry/types';
import { useWizardNavigation } from '@/lib/wizard/use-wizard-navigation';
import { WizardStepCard } from './wizard-step-card';
import { WizardStepIndicator } from './wizard-step-indicator';
import { WizardReviewPanel } from './wizard-review-panel';

interface WizardLayoutProps {
  sectionKey: SF86Section;
}

/**
 * Top-level wizard layout that renders the step indicator, current step card,
 * or review panel depending on navigation state.
 */
export function WizardLayout({ sectionKey }: WizardLayoutProps) {
  const {
    visibleSteps,
    currentStep,
    currentStepIndex,
    isReviewMode,
    goToStep,
  } = useWizardNavigation();

  const prevStepRef = useRef(currentStepIndex);
  const direction = currentStepIndex > prevStepRef.current ? 1 : currentStepIndex < prevStepRef.current ? -1 : 0;
  prevStepRef.current = currentStepIndex;

  // Track completed steps (any step the user has visited past)
  const completedSteps = useMemo(() => {
    const set = new Set<number>();
    for (let i = 0; i < currentStepIndex; i++) {
      set.add(i);
    }
    return set;
  }, [currentStepIndex]);

  // Next section info for review panel
  const currentSectionIndex = ALL_SECTIONS.indexOf(sectionKey);
  const nextSection = currentSectionIndex < ALL_SECTIONS.length - 1
    ? ALL_SECTIONS[currentSectionIndex + 1]
    : null;
  const nextSectionTitle = nextSection
    ? SECTION_META[nextSection]?.title
    : undefined;
  const sectionTitle = SECTION_META[sectionKey]?.title ?? sectionKey;

  const handleStepClick = (index: number) => {
    if (index === -1) {
      // Review mode — handled by indicator
      return;
    }
    goToStep(index);
  };

  if (visibleSteps.length === 0) {
    return (
      <div className="mx-auto max-w-2xl rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
        No wizard steps configured for this section.
      </div>
    );
  }

  return (
    <div className="py-2">
      {/* Step indicator */}
      <WizardStepIndicator
        steps={visibleSteps}
        currentIndex={currentStepIndex}
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
        inReviewMode={isReviewMode}
      />

      {/* Review panel or step card */}
      {isReviewMode ? (
        <WizardReviewPanel
          steps={visibleSteps}
          sectionTitle={sectionTitle}
          nextSectionTitle={nextSectionTitle}
          onEditStep={goToStep}
          onContinue={() => {
            // Navigate to next section — handled by wizard-controls
          }}
        />
      ) : currentStep ? (
        <WizardStepCard step={currentStep} direction={direction} />
      ) : null}
    </div>
  );
}

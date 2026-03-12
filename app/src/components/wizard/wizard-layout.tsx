'use client';

import { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { atom, useAtomValue } from 'jotai';
import type { SF86Section } from '@/lib/field-registry/types';
import { ALL_SECTIONS, SECTION_META, sectionToGroup } from '@/lib/field-registry/types';
import { useRegistry } from '@/lib/field-registry/use-registry';
import { fieldValueAtomFamily, type FieldValue } from '@/lib/state/atoms/field-atoms';
import { useWizardNavigation } from '@/lib/wizard/use-wizard-navigation';
import { computeStepCompletion } from '@/lib/wizard/step-utils';
import type { WizardStep } from '@/lib/wizard/types';
import { WizardStepCard } from './wizard-step-card';
import { WizardStepIndicator } from './wizard-step-indicator';
import { WizardReviewPanel } from './wizard-review-panel';
import { RepeatGroupCards, formatGroupName } from './repeat-group-cards';
import { getLinkedGroupConfig } from '@/lib/wizard/linked-group-utils';
import { TimelineCoveragePrompt } from './timeline-coverage-prompt';
import { SignatureReview } from './signature-review';
import { SubmitDialog } from './submit-dialog';

interface WizardLayoutProps {
  sectionKey: SF86Section;
}

/**
 * Top-level wizard layout that renders the step indicator, current step card,
 * repeat-group card overview, or review panel depending on navigation state.
 */
export function WizardLayout({ sectionKey }: WizardLayoutProps) {
  const router = useRouter();
  const params = useParams();
  const submissionId = params.submissionId as string;

  const {
    visibleSteps,
    currentStep,
    currentStepIndex,
    isReviewMode,
    goToStep,
  } = useWizardNavigation(sectionKey);

  const registry = useRegistry();

  const prevStepRef = useRef(currentStepIndex);
  const direction = currentStepIndex > prevStepRef.current ? 1 : currentStepIndex < prevStepRef.current ? -1 : 0;
  prevStepRef.current = currentStepIndex;

  const reviewPanelRef = useRef<HTMLDivElement>(null);

  // -----------------------------------------------------------------------
  // Data-driven step completion: subscribe to required field values
  // -----------------------------------------------------------------------

  // Collect required field keys across all visible steps for reactive subscription.
  const requiredKeys = useMemo(() => {
    const keys: string[] = [];
    const seen = new Set<string>();
    for (const step of visibleSteps) {
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
  }, [visibleSteps, registry]);

  const requiredKeysKey = useMemo(() => requiredKeys.join(','), [requiredKeys]);

  // Single derived atom that reads all required field values at once.
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

  // Mark a step as completed when all its required fields are filled.
  const completedSteps = useMemo(() => {
    const set = new Set<number>();
    for (let i = 0; i < visibleSteps.length; i++) {
      const ratio = computeStepCompletion(
        visibleSteps[i],
        registry,
        (key) => requiredValues[key] ?? null,
      );
      if (ratio >= 1) set.add(i);
    }
    return set;
  }, [visibleSteps, registry, requiredValues]);

  // Next section info for review panel
  const currentSectionIndex = ALL_SECTIONS.indexOf(sectionKey);
  const nextSection = currentSectionIndex < ALL_SECTIONS.length - 1
    ? ALL_SECTIONS[currentSectionIndex + 1]
    : null;
  const nextSectionTitle = nextSection
    ? SECTION_META[nextSection]?.title
    : undefined;
  const sectionTitle = SECTION_META[sectionKey]?.title ?? sectionKey;

  // -----------------------------------------------------------------------
  // Repeat group detection
  // -----------------------------------------------------------------------

  const repeatInfo = useMemo(() => {
    // A "gate-only" step is one that contains only the gate field (e.g. a YES/NO
    // question). These should render as linear steps, not as repeat entry cards,
    // even when they share a repeatGroup with the entries they control.
    const isGateOnly = (s: WizardStep) =>
      s.gateFieldKey &&
      !s.isConditionalBlock &&
      s.fieldKeys.length === 1 &&
      s.fieldKeys[0] === s.gateFieldKey;

    const repeatSteps = visibleSteps.filter((s) => s.repeatGroup && !isGateOnly(s));
    if (repeatSteps.length === 0) return null;

    // Group by repeatGroup name
    const groups = new Map<string, WizardStep[]>();
    for (const step of repeatSteps) {
      const name = step.repeatGroup!;
      const arr = groups.get(name);
      if (arr) arr.push(step);
      else groups.set(name, [step]);
    }

    // Only show card overview when ALL non-gate visible steps are repeat groups.
    // Mixed sections (gates + repeat entries) need linear navigation so
    // the user answers gate questions before reaching repeat entries.
    const nonGateSteps = visibleSteps.filter((s) => !isGateOnly(s));
    if (repeatSteps.length < nonGateSteps.length) return null;

    // Merge groups that derive the same display name to avoid duplicate headings.
    // e.g. "residency", "section11_2", "section11_3" all display as "Residences".
    // When a linked group config exists, ALL sub-groups merge under the entity label.
    const linkedConfig = getLinkedGroupConfig(sectionKey);
    const linkedNames = linkedConfig
      ? new Set(linkedConfig.groupsBySection[sectionKey] ?? [])
      : null;
    const mergedGroups = new Map<string, { displayName: string; steps: WizardStep[] }>();
    for (const [groupName, groupSteps] of groups) {
      // If this group belongs to a linked entity, use the entity label for all sub-groups
      const displayName = linkedNames && linkedNames.has(groupName)
        ? linkedConfig!.entityLabel + 's'
        : formatGroupName(groupName, groupSteps);
      const existing = mergedGroups.get(displayName);
      if (existing) {
        existing.steps.push(...groupSteps);
      } else {
        mergedGroups.set(displayName, { displayName, steps: [...groupSteps] });
      }
    }

    return { mergedGroups, repeatSteps };
  }, [visibleSteps]);

  // Submit dialog state (section30 final submission)
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const isFinalSection = sectionKey === 'section30';

  const handleSubmit = useCallback(() => {
    setSubmitDialogOpen(true);
  }, []);

  // When section changes, reset to overview
  const [showRepeatOverview, setShowRepeatOverview] = useState(true);
  const prevSectionRef = useRef(sectionKey);
  if (prevSectionRef.current !== sectionKey) {
    prevSectionRef.current = sectionKey;
    setShowRepeatOverview(true);
  }

  // -----------------------------------------------------------------------
  // Handlers
  // -----------------------------------------------------------------------

  const handleStepClick = (index: number) => {
    if (index === -1) return; // Review mode indicator
    setShowRepeatOverview(false);
    goToStep(index);
  };

  const handleContinueToNextSection = useCallback(() => {
    if (nextSection) {
      const group = sectionToGroup(nextSection);
      if (group) {
        router.push(`/${submissionId}/${group}/${nextSection}`);
      }
    }
  }, [nextSection, submissionId, router]);

  const handleRepeatEntryEdit = useCallback((stepIndex: number) => {
    setShowRepeatOverview(false);
    goToStep(stepIndex);
  }, [goToStep]);

  const handleBackToOverview = useCallback(() => {
    setShowRepeatOverview(true);
    goToStep(0);
  }, [goToStep]);

  // Focus review panel and scroll to top when entering review mode
  useEffect(() => {
    if (isReviewMode) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (reviewPanelRef.current) {
        requestAnimationFrame(() => {
          reviewPanelRef.current?.focus({ preventScroll: false });
        });
      }
    }
  }, [isReviewMode]);

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  if (visibleSteps.length === 0) {
    return (
      <div className="mx-auto max-w-2xl rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
        No wizard steps configured for this section.
      </div>
    );
  }

  // Repeat group card overview — no step indicator, just the cards
  if (repeatInfo && showRepeatOverview && !isReviewMode) {
    const isTimelineSection = sectionKey === 'section11' || sectionKey === 'section13A';

    return (
      <div className="py-2 space-y-6">
        {/* Timeline coverage prompt for residency/employment */}
        {isTimelineSection && (
          <TimelineCoveragePrompt
            section={sectionKey as 'section11' | 'section13A'}
          />
        )}
        {Array.from(repeatInfo.mergedGroups.entries()).map(([displayName, { steps: groupSteps }]) => (
          <RepeatGroupCards
            key={displayName}
            steps={groupSteps}
            groupName={displayName}
            sectionKey={sectionKey}
            allVisibleSteps={visibleSteps}
            onEditEntry={(globalIdx) => {
              // RepeatGroupCards passes a global index into allVisibleSteps
              handleRepeatEntryEdit(globalIdx);
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="py-2">
      {/* Back to overview link for repeat sections */}
      {repeatInfo && !isReviewMode && (
        <button
          type="button"
          onClick={handleBackToOverview}
          className="mb-3 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 hover:underline"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to entries
        </button>
      )}

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
        <div ref={reviewPanelRef} tabIndex={-1} className="animate-fadeIn focus:outline-none">
          {/* Section 30: show certification review above the standard review */}
          {sectionKey === 'section30' && <SignatureReview />}
          <WizardReviewPanel
            steps={visibleSteps}
            sectionTitle={sectionTitle}
            nextSectionTitle={nextSectionTitle}
            onEditStep={goToStep}
            onContinue={isFinalSection ? handleSubmit : handleContinueToNextSection}
          />
        </div>
      ) : currentStep ? (
        <WizardStepCard step={currentStep} direction={direction} />
      ) : null}

      {/* Submit dialog for final section */}
      {isFinalSection && (
        <SubmitDialog open={submitDialogOpen} onClose={() => setSubmitDialogOpen(false)} />
      )}
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import type { SF86Section } from '@/lib/field-registry/types';
import { SECTION_META } from '@/lib/field-registry/types';
import { useAppStore } from '@/lib/state/stores/app-store';
import { useAutoSave } from '@/lib/state/hooks/use-auto-save';
import { useHydrateSection } from '@/lib/state/hooks/use-hydrate-section';
import { useSectionValidation } from '@/lib/state/hooks/use-section-validation';
import { useTimelineValidation } from '@/lib/state/hooks/use-timeline-validation';
import { SectionFormRenderer } from './section-form-renderer';
import { ValidationSummary } from '@/components/validation/validation-summary';
import { TimelineGapAlert } from '@/components/validation/timeline-gap-alert';
import { WizardLayout } from '@/components/wizard/wizard-layout';
interface SectionFormLoaderProps {
  submissionId: string;
  sectionKey: SF86Section;
}

const TIMELINE_SECTIONS = new Set<SF86Section>(['section11', 'section13A']);

export function SectionFormLoader({
  submissionId,
  sectionKey,
}: SectionFormLoaderProps) {
  const layoutMode = useAppStore((s) => s.layoutMode);
  const setSubmissionId = useAppStore((s) => s.setSubmissionId);
  const navigateToSection = useAppStore((s) => s.navigateToSection);

  useEffect(() => {
    setSubmissionId(submissionId);
    navigateToSection(sectionKey);
  }, [submissionId, sectionKey, setSubmissionId, navigateToSection]);

  // Load saved data from IndexedDB into Jotai atoms
  const { isLoading, error: loadError } = useHydrateSection(
    submissionId,
    sectionKey,
  );

  // Auto-save: debounced write to IndexedDB when fields change
  useAutoSave(submissionId, sectionKey);

  // Section-level Zod validation
  const { errors: validationErrors } = useSectionValidation(sectionKey);

  // Timeline gap detection (only for residency and employment)
  const isTimelineSection = TIMELINE_SECTIONS.has(sectionKey);
  const timelineSection = isTimelineSection
    ? (sectionKey as 'section11' | 'section13A')
    : 'section11'; // dummy, won't render
  const timelineResult = useTimelineValidation(timelineSection);

  const meta = SECTION_META[sectionKey]!;

  return (
    <div className="space-y-6">
      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-gray-500" role="status">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
          Loading saved data...
        </div>
      )}

      {/* Load error */}
      {loadError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
          {loadError}
        </div>
      )}

      {/* Timeline gap warning (residency / employment only) */}
      {!isLoading && isTimelineSection && timelineResult.gaps.length > 0 && (
        <TimelineGapAlert
          gaps={timelineResult.gaps}
          coveragePercent={timelineResult.coveragePercent}
          sectionLabel={meta.title}
        />
      )}

      {/* Validation errors */}
      {!isLoading && validationErrors.length > 0 && (
        <ValidationSummary errors={validationErrors} />
      )}

      {/* Registry-driven form fields — fade transition on layout mode switch */}
      {!isLoading && layoutMode === 'wizard' && (
        <div key="wizard" className="animate-fadeIn">
          <WizardLayout sectionKey={sectionKey} />
        </div>
      )}
      {!isLoading && layoutMode === 'form' && (
        <div key="form" className="animate-fadeIn">
          <SectionFormRenderer section={sectionKey} layoutMode="flow" />
        </div>
      )}
      {!isLoading && layoutMode === 'pdf' && (
        <div key="pdf" className="animate-fadeIn overflow-x-auto">
          <SectionFormRenderer section={sectionKey} layoutMode="pdf" />
        </div>
      )}
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useAppStore } from '@/lib/state/stores/app-store';
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
  const goBack = useAppStore((s) => s.goBack);
  const wizardHistory = useAppStore((s) => s.wizardHistory);

  const currentIndex = ALL_SECTIONS.indexOf(currentSection);
  const hasPrevious = wizardHistory.length > 0 || currentIndex > 0;
  const hasNext = currentIndex < ALL_SECTIONS.length - 1;
  const isFinal = currentIndex === ALL_SECTIONS.length - 1;

  const currentMeta = SECTION_META[currentSection]!;
  const nextSection = hasNext ? ALL_SECTIONS[currentIndex + 1] : null;

  const handlePrevious = useCallback(() => {
    if (wizardHistory.length > 0) {
      goBack();
      const prev = wizardHistory[wizardHistory.length - 1]!;
      const group = sectionToGroup(prev);
      if (group) {
        router.push(`/${submissionId}/${group}/${prev}`);
      }
    } else if (currentIndex > 0) {
      const prev = ALL_SECTIONS[currentIndex - 1]!;
      const group = sectionToGroup(prev);
      if (group) {
        router.push(`/${submissionId}/${group}/${prev}`);
      }
    }
  }, [wizardHistory, goBack, currentIndex, submissionId, router]);

  const handleNext = useCallback(() => {
    if (nextSection) {
      const group = sectionToGroup(nextSection);
      if (group) {
        router.push(`/${submissionId}/${group}/${nextSection}`);
      }
    }
  }, [nextSection, submissionId, router]);

  const storeSaveNow = useAppStore((s) => s.saveNow);

  const handleSave = useCallback(() => {
    void storeSaveNow();
  }, [storeSaveNow]);

  return (
    <div className="sticky bottom-0 border-t border-gray-200 bg-white px-4 py-3 sm:px-6" role="navigation" aria-label="Form navigation">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-2">
        {/* Previous */}
        <button
          type="button"
          onClick={handlePrevious}
          disabled={!hasPrevious}
          className={`
            inline-flex items-center gap-1.5 rounded-md border px-4 py-2 text-sm font-medium
            transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
            ${
              !hasPrevious
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

        {/* Center: section indicator + save */}
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-xs text-gray-500">
            {currentMeta.title} ({currentIndex + 1} of {ALL_SECTIONS.length})
          </span>
          <button
            type="button"
            onClick={handleSave}
            className="
              inline-flex items-center gap-1.5 rounded-md border border-gray-300
              bg-white px-4 py-2 text-sm font-medium text-gray-700
              hover:bg-gray-50 transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
            "
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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

        {/* Next / Submit */}
        <button
          type="button"
          onClick={handleNext}
          disabled={!hasNext && !isFinal}
          className={`
            inline-flex items-center gap-1.5 rounded-md border px-4 py-2 text-sm font-medium
            transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
            ${
              !hasNext && !isFinal
                ? 'border-gray-200 bg-gray-300 text-gray-500 cursor-not-allowed'
                : isFinal
                  ? 'border-green-600 bg-green-600 text-white hover:bg-green-700'
                  : 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700'
            }
          `}
        >
          {isFinal ? 'Submit' : 'Next'}
          {!isFinal ? (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

'use client';

import { useMemo } from 'react';
import { ALL_SECTIONS, SECTION_META, type SF86Section } from '@/lib/field-registry/types';
import { useSectionValidation } from '@/lib/state/hooks/use-section-validation';

// Certification text extracted from PDF analysis (section 30)
const CERTIFICATION_TEXT =
  'My statements on this form, and on any attachments to it, are true, complete, and correct ' +
  'to the best of my knowledge and belief and are made in good faith. I have carefully read ' +
  'the foregoing instructions to complete this form. I understand that a knowing and willful ' +
  'false statement on this form can be punished by fine or imprisonment or both (18 U.S.C. 1001). ' +
  'I understand that intentionally withholding, misrepresenting, or falsifying information may ' +
  'have a negative effect on my security clearance, employment prospects, or job status, up to ' +
  'and including denial or revocation of my security clearance, or my removal and debarment ' +
  'from Federal service.';

const AUTHORIZATION_TEXT =
  'I authorize the investigation of my background as outlined in this form. ' +
  'I understand the information disclosed pursuant to this authorization for use by the ' +
  'Federal Government may be redisclosed by the Federal Government only as authorized by law.';

// Sections to check for completion (exclude section30 itself and ssnPageHeader)
const REVIEWABLE_SECTIONS = ALL_SECTIONS.filter(
  (s) => s !== 'section30' && s !== ('ssnPageHeader' as SF86Section),
);

/**
 * Section 30 certification review component.
 * Shows legal certification text and a section-by-section completion summary.
 */
export function SignatureReview() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {/* Certification block */}
      <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6">
        <h3 className="text-base font-bold text-blue-900 mb-3">
          Certification Statement
        </h3>
        <p className="text-sm text-blue-800 leading-relaxed">
          {CERTIFICATION_TEXT}
        </p>
        <p className="mt-3 text-sm text-blue-800 leading-relaxed">
          {AUTHORIZATION_TEXT}
        </p>
      </div>

      {/* Section completion summary */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">
          Section Completion Summary
        </h4>
        <div className="space-y-1.5">
          {REVIEWABLE_SECTIONS.map((sec) => (
            <SectionStatusRow key={sec} section={sec} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionStatusRow({ section }: { section: SF86Section }) {
  const { isValid, errors } = useSectionValidation(section);
  const meta = SECTION_META[section];
  const title = meta?.title ?? section;

  return (
    <div className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-gray-50">
      <span className="text-sm text-gray-700 truncate mr-2">
        {title}
      </span>
      <span className="shrink-0">
        {isValid ? (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Complete
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.168 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            {errors.length} issue{errors.length !== 1 ? 's' : ''}
          </span>
        )}
      </span>
    </div>
  );
}

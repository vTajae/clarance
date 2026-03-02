'use client';

// ---------------------------------------------------------------------------
// Cross-Section Validation Hook
// ---------------------------------------------------------------------------

import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { sectionFieldsAtom } from '@/lib/state/atoms/field-atoms';
import { validateCrossSections } from '@/lib/validation/cross-section';
import type { SF86Section } from '@/lib/field-registry/types';

const CROSS_CHECK_SECTIONS: SF86Section[] = [
  'section1',   // Full Name / Personal Info
  'section3',   // Place of Birth
  'section9',   // Citizenship
  'section10',  // Dual/Multiple Citizenship
  'section30',  // Signature & Certification
];

/**
 * Runs cross-section consistency checks on key sections.
 *
 * Only subscribes to the sections that actually participate in
 * cross-checks (section1, section3, section9, section10, section30).
 */
export function useCrossSectionValidation() {
  // Create stable atoms for each section we check
  const personalAtom = useMemo(() => sectionFieldsAtom('section1'), []);
  const birthAtom = useMemo(() => sectionFieldsAtom('section3'), []);
  const citizenshipAtom = useMemo(() => sectionFieldsAtom('section9'), []);
  const dualAtom = useMemo(() => sectionFieldsAtom('section10'), []);
  const sigAtom = useMemo(() => sectionFieldsAtom('section30'), []);

  const personal = useAtomValue(personalAtom);
  const birth = useAtomValue(birthAtom);
  const citizenship = useAtomValue(citizenshipAtom);
  const dual = useAtomValue(dualAtom);
  const sig = useAtomValue(sigAtom);

  return useMemo(() => {
    const allData: Record<string, Record<string, unknown>> = {
      section1: personal,
      section3: birth,
      section9: citizenship,
      section10: dual,
      section30: sig,
    };

    return validateCrossSections(allData);
  }, [personal, birth, citizenship, dual, sig]);
}

export { CROSS_CHECK_SECTIONS };

'use client';

// ---------------------------------------------------------------------------
// Cross-Section Validation Hook
// ---------------------------------------------------------------------------

import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { sectionFieldsAtom } from '@/lib/state/atoms/field-atoms';
import { validateCrossSections } from '@/lib/validation/cross-section';

/**
 * Runs cross-section consistency checks on key sections.
 *
 * Subscribes to sections that participate in cross-checks:
 *   - section1   (applicant name)
 *   - section2   (DOB / age)
 *   - section9   (citizenship)
 *   - section10  (dual citizenship)
 *   - section11  (residence addresses — PO Box / date order)
 *   - section13A (employment addresses — PO Box / date order)
 *   - section16  (references — exclusion)
 *   - section17  (spouse — reference exclusion)
 *   - section18  (relatives — reference exclusion)
 *   - section30  (signature)
 */
export function useCrossSectionValidation() {
  // Create stable atoms for each section we check
  const personalAtom = useMemo(() => sectionFieldsAtom('section1'), []);
  const birthAtom = useMemo(() => sectionFieldsAtom('section2'), []);
  const citizenshipAtom = useMemo(() => sectionFieldsAtom('section9'), []);
  const dualAtom = useMemo(() => sectionFieldsAtom('section10'), []);
  const residenceAtom = useMemo(() => sectionFieldsAtom('section11'), []);
  const employmentAtom = useMemo(() => sectionFieldsAtom('section13A'), []);
  const referencesAtom = useMemo(() => sectionFieldsAtom('section16'), []);
  const spouseAtom = useMemo(() => sectionFieldsAtom('section17'), []);
  const relativesAtom = useMemo(() => sectionFieldsAtom('section18'), []);
  const sigAtom = useMemo(() => sectionFieldsAtom('section30'), []);

  const personal = useAtomValue(personalAtom);
  const birth = useAtomValue(birthAtom);
  const citizenship = useAtomValue(citizenshipAtom);
  const dual = useAtomValue(dualAtom);
  const residence = useAtomValue(residenceAtom);
  const employment = useAtomValue(employmentAtom);
  const references = useAtomValue(referencesAtom);
  const spouse = useAtomValue(spouseAtom);
  const relatives = useAtomValue(relativesAtom);
  const sig = useAtomValue(sigAtom);

  return useMemo(() => {
    const allData: Record<string, Record<string, unknown>> = {
      section1: personal,
      section2: birth,
      section9: citizenship,
      section10: dual,
      section11: residence,
      section13A: employment,
      section16: references,
      section17: spouse,
      section18: relatives,
      section30: sig,
    };

    return validateCrossSections(allData);
  }, [personal, birth, citizenship, dual, residence, employment, references, spouse, relatives, sig]);
}

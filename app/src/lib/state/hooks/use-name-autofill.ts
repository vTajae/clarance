'use client';

import { useEffect } from 'react';
import { useStore } from 'jotai';

import { fieldValueAtomFamily } from '@/lib/state/atoms/field-atoms';
import { loadSectionData } from '@/lib/persistence/indexeddb-client';

/**
 * Section 1 name fields (source of truth).
 */
const NAME_LAST_KEY = 'personalInfo.section1';
const NAME_FIRST_KEY = 'personalInfo.firstName';
const NAME_MIDDLE_KEY = 'personalInfo.middleName';

/**
 * Section 2 date of birth (source of truth).
 */
const DOB_KEY = 'birthInfo.section2';

/**
 * Section 30 signature target fields.
 */
const SIG_NAME_KEY = 'signature.fullNameTypeOrPrintLegibly';
const SIG_NAME_KEY_2 = 'signature.fullNameTypeOrPrintLegibly_2';
const SIG_DOB_KEY = 'signature.dateOfBirthMMdDyYYY';

/**
 * Watches section 1 name atoms and section 2 DOB atom, then propagates
 * to the signature fields in section 30. This mirrors the real SF-86
 * behavior where the signature page repeats name and DOB.
 *
 * Also hydrates from IndexedDB on mount so sync works even if the user
 * hasn't visited section 1/2 in the current session.
 *
 * Mount this hook once in FormShell (or any persistent parent).
 */
export function useNameAutoFill(submissionId: string) {
  const store = useStore();

  useEffect(() => {
    function buildFullName(): string {
      const last = (store.get(fieldValueAtomFamily(NAME_LAST_KEY)) as string) || '';
      const first = (store.get(fieldValueAtomFamily(NAME_FIRST_KEY)) as string) || '';
      const middle = (store.get(fieldValueAtomFamily(NAME_MIDDLE_KEY)) as string) || '';
      return [first, middle, last].filter(Boolean).join(' ').trim();
    }

    function propagateName() {
      const fullName = buildFullName();
      if (fullName) {
        store.set(fieldValueAtomFamily(SIG_NAME_KEY), fullName);
        store.set(fieldValueAtomFamily(SIG_NAME_KEY_2), fullName);
      }
    }

    function propagateDob() {
      const dob = store.get(fieldValueAtomFamily(DOB_KEY));
      if (dob) {
        store.set(fieldValueAtomFamily(SIG_DOB_KEY), dob as string);
      }
    }

    // Hydrate section 1 and 2 from IndexedDB
    Promise.all([
      loadSectionData(submissionId, 'section1'),
      loadSectionData(submissionId, 'section2'),
    ])
      .then(([sec1Row, sec2Row]) => {
        if (sec1Row?.data) {
          for (const key of [NAME_LAST_KEY, NAME_FIRST_KEY, NAME_MIDDLE_KEY]) {
            const saved = sec1Row.data[key];
            if (saved !== undefined && saved !== null) {
              const current = store.get(fieldValueAtomFamily(key));
              if (current === null || current === '') {
                store.set(fieldValueAtomFamily(key), saved as string);
              }
            }
          }
        }
        if (sec2Row?.data) {
          const saved = sec2Row.data[DOB_KEY];
          if (saved !== undefined && saved !== null) {
            const current = store.get(fieldValueAtomFamily(DOB_KEY));
            if (current === null || current === '') {
              store.set(fieldValueAtomFamily(DOB_KEY), saved as string);
            }
          }
        }
        propagateName();
        propagateDob();
      })
      .catch(() => {
        propagateName();
        propagateDob();
      });

    // Subscribe to name changes
    const unsubLast = store.sub(fieldValueAtomFamily(NAME_LAST_KEY), propagateName);
    const unsubFirst = store.sub(fieldValueAtomFamily(NAME_FIRST_KEY), propagateName);
    const unsubMiddle = store.sub(fieldValueAtomFamily(NAME_MIDDLE_KEY), propagateName);
    const unsubDob = store.sub(fieldValueAtomFamily(DOB_KEY), propagateDob);

    return () => {
      unsubLast();
      unsubFirst();
      unsubMiddle();
      unsubDob();
    };
  }, [store, submissionId]);
}

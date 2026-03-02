'use client';

import { useEffect } from 'react';
import { useStore } from 'jotai';

import { fieldValueAtomFamily } from '@/lib/state/atoms/field-atoms';
import { useSectionFields } from '@/lib/field-registry/use-registry';
import type { SF86Section } from '@/lib/field-registry/types';
import { loadSectionData } from '@/lib/persistence/indexeddb-client';

/**
 * The one SSN field the user actually fills in (section 4).
 * All 137 ssnPageHeader fields mirror this value.
 */
const SSN_SOURCE_KEY = 'personalInfo.section4';

/**
 * Watches the section 4 SSN atom and propagates its value to all 137
 * ssnPageHeader SSN fields. This mirrors the real SF-86 PDF behavior
 * where the page-bottom SSN auto-fills from section 4.
 *
 * Also hydrates the section 4 SSN from IndexedDB on mount so that
 * the sync works even when the user hasn't visited section 4 yet
 * in the current session.
 *
 * Mount this hook once in FormShell (or any persistent parent).
 */
export function useSsnAutoFill(submissionId: string) {
  const store = useStore();
  const ssnHeaderFields = useSectionFields('ssnPageHeader' as SF86Section);

  useEffect(() => {
    if (ssnHeaderFields.length === 0) return;

    const headerKeys = ssnHeaderFields.map((f) => f.semanticKey);

    // Propagate the current SSN value to all header atoms
    function propagate() {
      const ssnValue = store.get(fieldValueAtomFamily(SSN_SOURCE_KEY));
      for (const key of headerKeys) {
        store.set(fieldValueAtomFamily(key), ssnValue);
      }
    }

    // Hydrate section 4 SSN from IndexedDB (in case section 4 hasn't been visited)
    loadSectionData(submissionId, 'section4')
      .then((row) => {
        if (row?.data) {
          const saved = row.data[SSN_SOURCE_KEY];
          if (saved !== undefined && saved !== null) {
            const current = store.get(fieldValueAtomFamily(SSN_SOURCE_KEY));
            // Only hydrate if the atom is still empty
            if (current === null || current === '') {
              store.set(fieldValueAtomFamily(SSN_SOURCE_KEY), saved as string);
            }
          }
        }
        // Propagate after hydration attempt
        propagate();
      })
      .catch(() => {
        // IDB might not be available — still propagate whatever's in store
        propagate();
      });

    // Subscribe: whenever section 4 SSN changes, propagate to all headers
    const unsub = store.sub(fieldValueAtomFamily(SSN_SOURCE_KEY), propagate);

    return unsub;
  }, [store, ssnHeaderFields, submissionId]);
}

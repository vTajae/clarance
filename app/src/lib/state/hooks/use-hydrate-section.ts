'use client';

import { useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';

import type { SF86Section } from '@/lib/field-registry/types';
import { hydrateFieldsAtom, type FieldValue } from '@/lib/state/atoms/field-atoms';
import { loadSectionData } from '@/lib/persistence/indexeddb-client';

/**
 * Loads previously saved field data from IndexedDB for a given section
 * and hydrates the Jotai field atoms without marking them as dirty.
 *
 * Should be called once when a section mounts (e.g., in SectionFormLoader).
 *
 * @returns `{ isLoading, error }` for UI feedback.
 */
export function useHydrateSection(
  submissionId: string,
  sectionKey: SF86Section,
): { isLoading: boolean; error: string | null } {
  const hydrateFields = useSetAtom(hydrateFieldsAtom);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      setIsLoading(true);
      setError(null);

      try {
        const row = await loadSectionData(submissionId, sectionKey);

        if (cancelled) return;

        if (row?.data) {
          // Cast the generic Record to our FieldValue type
          const values: Record<string, FieldValue> = {};
          for (const [key, val] of Object.entries(row.data)) {
            if (
              val === null ||
              typeof val === 'string' ||
              typeof val === 'boolean' ||
              typeof val === 'number'
            ) {
              values[key] = val as FieldValue;
            }
          }

          hydrateFields(values);
        }
      } catch (err) {
        if (!cancelled) {
          console.warn(
            `[useHydrateSection] Failed to load section "${sectionKey}" (form will render without saved data):`,
            err,
          );
          // Don't set error state — let the form render empty rather than
          // showing an error for a non-critical IDB failure.
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    hydrate();

    return () => {
      cancelled = true;
    };
  }, [submissionId, sectionKey, hydrateFields]);

  return { isLoading, error };
}

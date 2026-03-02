// ---------------------------------------------------------------------------
// SF-86 State -- useFieldValue Hook
// ---------------------------------------------------------------------------

'use client';

import { useCallback } from 'react';
import { useAtom, useSetAtom } from 'jotai';

import {
  type FieldValue,
  fieldValueAtomFamily,
  markFieldDirtyAtom,
} from '@/lib/state/atoms/field-atoms';

/**
 * Read and write a single field's value by its semantic key.
 *
 * ```tsx
 * function LastNameField() {
 *   const [value, setValue] = useFieldValue('personalInfo.lastName');
 *   return <input value={value ?? ''} onChange={e => setValue(e.target.value)} />;
 * }
 * ```
 *
 * Every call to `setValue` automatically marks the field as dirty so the
 * auto-save system knows which fields need to be persisted.
 *
 * @param semanticKey - Unique identifier from the field registry
 *   (e.g. "personalInfo.lastName").
 * @returns A tuple of `[currentValue, setValue]`, similar to `useState`.
 */
export function useFieldValue(
  semanticKey: string,
): [FieldValue, (next: FieldValue) => void] {
  const [value, setRawValue] = useAtom(fieldValueAtomFamily(semanticKey));
  const markDirty = useSetAtom(markFieldDirtyAtom);

  const setValue = useCallback(
    (next: FieldValue) => {
      setRawValue(next);
      markDirty(semanticKey);
    },
    [setRawValue, markDirty, semanticKey],
  );

  return [value, setValue];
}

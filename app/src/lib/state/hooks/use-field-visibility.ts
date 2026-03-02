'use client';

// ---------------------------------------------------------------------------
// useFieldVisibility — reactive show/hide for conditional fields
// ---------------------------------------------------------------------------

import { useAtomValue } from 'jotai';
import type { FieldDefinition } from '@/lib/field-registry/types';
import { fieldValueAtomFamily } from '@/lib/state/atoms/field-atoms';
import { evaluateShowWhen } from '@/lib/conditional/expression-evaluator';

/**
 * Sentinel key used when a field has no dependency.
 * We always call `useAtomValue` so the hook count is stable across renders
 * (React hooks rules). Reading a single shared atom is effectively free.
 */
const NO_DEP_KEY = '__no_dep__';

/**
 * Returns `true` when the field should be visible.
 *
 * - Fields without `dependsOn` are always visible (zero overhead beyond one
 *   unconditional atom read of the sentinel key).
 * - Fields with `dependsOn` subscribe to exactly ONE parent atom and evaluate
 *   the `showWhen` expression on every parent change.
 *
 * Hook-call count is constant (always 1 `useAtomValue`), satisfying React rules.
 */
export function useFieldVisibility(field: FieldDefinition): boolean {
  const depKey = field.dependsOn ?? NO_DEP_KEY;
  const parentValue = useAtomValue(fieldValueAtomFamily(depKey));

  // No dependency → always visible
  if (!field.dependsOn) return true;

  return evaluateShowWhen(field.showWhen, parentValue);
}

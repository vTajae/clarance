// ---------------------------------------------------------------------------
// SF-86 State -- Jotai Atoms for Field Values & Derived State
// ---------------------------------------------------------------------------
//
// Architecture:
//   - One atom per semantic key (via atomFamily) stores the raw UI value.
//   - A single `fieldMetaAtom` holds the loaded FieldRegistry instance.
//   - Derived atoms compute per-section and overall completion percentages.
//   - `dirtyFieldsAtom` tracks unsaved modifications.
//
// NOTE: `atomFamily` from jotai/utils is deprecated in jotai >=2.x in favour
// of the `jotai-family` package.  We use the built-in version here because it
// is still functional in jotai 2.18 and avoids an extra dependency.  When
// migrating to jotai v3, replace the import with `jotai-family`.
// ---------------------------------------------------------------------------

import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';

import type { FieldRegistry } from '@/lib/field-registry/registry-loader';
import type { SF86Section, SF86SectionGroup } from '@/lib/field-registry/types';
import { SECTION_GROUPS, SECTION_META } from '@/lib/field-registry/types';

// ---------------------------------------------------------------------------
// Primitive value type
// ---------------------------------------------------------------------------

/**
 * The value stored for a single field.  Most fields are strings; checkboxes
 * and branch fields are booleans; height is a number.
 */
export type FieldValue = string | boolean | number | null;

// ---------------------------------------------------------------------------
// Core atoms
// ---------------------------------------------------------------------------

/**
 * An atom family that creates one writable atom per `semanticKey`.
 *
 * Usage:
 * ```ts
 * const lastNameAtom = fieldValueAtomFamily('personalInfo.lastName');
 * ```
 */
export const fieldValueAtomFamily = atomFamily((semanticKey: string) => {
  // Each atom starts as `null` (no value loaded yet).
  return atom<FieldValue>(null);
});

/**
 * Holds the loaded {@link FieldRegistry} instance.
 *
 * Set exactly once during app initialisation after the JSON registry has been
 * fetched and parsed.  All derived atoms read from this.
 */
export const fieldMetaAtom = atom<FieldRegistry | null>(null);

// ---------------------------------------------------------------------------
// Dirty tracking
// ---------------------------------------------------------------------------

/**
 * Set of semantic keys that have been modified since the last save.
 */
export const dirtyFieldsAtom = atom<Set<string>>(new Set<string>());

/**
 * Write-only helper: marks a field as dirty.
 *
 * Typically called from the `useFieldValue` hook after every `setValue`.
 */
export const markFieldDirtyAtom = atom(null, (get, set, semanticKey: string) => {
  const prev = get(dirtyFieldsAtom);
  if (prev.has(semanticKey)) return; // already tracked
  const next = new Set(prev);
  next.add(semanticKey);
  set(dirtyFieldsAtom, next);
});

/**
 * Write-only helper: clears all dirty flags (call after a successful save).
 */
export const clearDirtyFieldsAtom = atom(null, (_get, set) => {
  set(dirtyFieldsAtom, new Set<string>());
});

// ---------------------------------------------------------------------------
// Section-level derived atoms (factory functions)
// ---------------------------------------------------------------------------

/**
 * Creates a read-only atom that returns all field values for a given section.
 *
 * Returns `Record<semanticKey, FieldValue>`.
 */
export function sectionFieldsAtom(section: SF86Section) {
  return atom<Record<string, FieldValue>>((get) => {
    const registry = get(fieldMetaAtom);
    if (!registry) return {};

    const fields = registry.getBySection(section);
    const result: Record<string, FieldValue> = {};
    for (const field of fields) {
      result[field.semanticKey] = get(fieldValueAtomFamily(field.semanticKey));
    }
    return result;
  });
}

/**
 * Creates a read-only atom that computes the completion percentage for a
 * section (filled required fields / total required fields).
 *
 * Returns a number between 0 and 1 (inclusive).
 */
export function sectionCompletionAtom(section: SF86Section) {
  return atom<number>((get) => {
    const registry = get(fieldMetaAtom);
    if (!registry) return 0;

    const required = registry.getRequiredFields(section);
    if (required.length === 0) return 1; // nothing required -> complete

    let filled = 0;
    for (const field of required) {
      const value = get(fieldValueAtomFamily(field.semanticKey));
      if (isFieldFilled(value)) filled++;
    }

    return filled / required.length;
  });
}

/**
 * Creates a read-only atom that computes completion for a section group.
 */
export function sectionGroupCompletionAtom(group: SF86SectionGroup) {
  return atom<number>((get) => {
    const registry = get(fieldMetaAtom);
    if (!registry) return 0;

    const sections = SECTION_GROUPS[group];
    if (!sections || sections.length === 0) return 1;

    let totalRequired = 0;
    let totalFilled = 0;

    for (const section of sections) {
      const required = registry.getRequiredFields(section);
      totalRequired += required.length;
      for (const field of required) {
        const value = get(fieldValueAtomFamily(field.semanticKey));
        if (isFieldFilled(value)) totalFilled++;
      }
    }

    if (totalRequired === 0) return 1;
    return totalFilled / totalRequired;
  });
}

/**
 * Read-only atom returning overall form completion (all 29 sections).
 *
 * Weighted equally by required-field count across the entire form.
 */
export const formCompletionAtom = atom<number>((get) => {
  const registry = get(fieldMetaAtom);
  if (!registry) return 0;

  const allSections = Object.keys(SECTION_META) as SF86Section[];

  let totalRequired = 0;
  let totalFilled = 0;

  for (const section of allSections) {
    const required = registry.getRequiredFields(section);
    totalRequired += required.length;
    for (const field of required) {
      const value = get(fieldValueAtomFamily(field.semanticKey));
      if (isFieldFilled(value)) totalFilled++;
    }
  }

  if (totalRequired === 0) return 1;
  return totalFilled / totalRequired;
});

// ---------------------------------------------------------------------------
// Bulk operations
// ---------------------------------------------------------------------------

/**
 * Write-only atom that hydrates field values in bulk.
 *
 * Accepts a `Record<semanticKey, FieldValue>` (e.g. from a server load or
 * IndexedDB restore) and writes every value into its corresponding atom
 * **without** marking any field as dirty.
 */
export const hydrateFieldsAtom = atom(
  null,
  (_get, set, values: Record<string, FieldValue>) => {
    for (const [semanticKey, value] of Object.entries(values)) {
      set(fieldValueAtomFamily(semanticKey), value);
    }
  },
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Determines whether a field value counts as "filled" for completion tracking. */
function isFieldFilled(value: FieldValue): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'boolean') return true; // even `false` is a deliberate answer
  if (typeof value === 'number') return true;
  return false;
}

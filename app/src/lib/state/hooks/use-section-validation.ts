'use client';

// ---------------------------------------------------------------------------
// Per-Section Zod Validation Hook
// ---------------------------------------------------------------------------

import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import type { SF86Section } from '@/lib/field-registry/types';
import { sectionFieldsAtom } from '@/lib/state/atoms/field-atoms';
import { useSectionFields } from '@/lib/field-registry/use-registry';
import { generateSectionSchema } from '@/lib/validation/schema-generator';
import { evaluateShowWhen } from '@/lib/conditional/expression-evaluator';

export interface FieldError {
  field: string;
  message: string;
}

export interface SectionValidationResult {
  isValid: boolean;
  errors: FieldError[];
  errorsByField: Map<string, string>;
}

/**
 * Validates all field values in a section against the generated Zod schema.
 *
 * Re-runs automatically when any field value changes (via Jotai subscription).
 * Returns a map of field-level errors and an overall validity flag.
 */
export function useSectionValidation(
  section: SF86Section,
): SectionValidationResult {
  const fields = useSectionFields(section);
  const snapshotAtom = useMemo(() => sectionFieldsAtom(section), [section]);
  const snapshot = useAtomValue(snapshotAtom);

  return useMemo(() => {
    if (fields.length === 0) {
      return { isValid: true, errors: [], errorsByField: new Map() };
    }

    // Filter out hidden conditional fields before generating schema
    const visibleFields = fields.filter((field) => {
      if (!field.dependsOn) return true;
      const parentValue = snapshot[field.dependsOn] ?? null;
      return evaluateShowWhen(field.showWhen, parentValue);
    });

    if (visibleFields.length === 0) {
      return { isValid: true, errors: [], errorsByField: new Map() };
    }

    const schema = generateSectionSchema(visibleFields);
    const result = schema.safeParse(snapshot);

    if (result.success) {
      return { isValid: true, errors: [], errorsByField: new Map() };
    }

    const errors: FieldError[] = [];
    const errorsByField = new Map<string, string>();

    for (const issue of result.error.issues) {
      const fieldPath = issue.path.join('.');
      const message = issue.message;
      errors.push({ field: fieldPath, message });
      if (!errorsByField.has(fieldPath)) {
        errorsByField.set(fieldPath, message);
      }
    }

    return { isValid: false, errors, errorsByField };
  }, [fields, snapshot]);
}

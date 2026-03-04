// ---------------------------------------------------------------------------
// Wizard Step Utilities -- Completion, summary, and visibility helpers
// ---------------------------------------------------------------------------
//
// Pure functions that operate on WizardStep data, a FieldRegistry, and
// field values. No React hooks -- safe to call from any context.
// ---------------------------------------------------------------------------

import type { FieldValue } from '@/lib/state/atoms/field-atoms';
import type { FieldRegistry } from '@/lib/field-registry/registry-loader';
import type { WizardStep } from './types';
import { evaluateShowWhen } from '@/lib/conditional/expression-evaluator';

// ---------------------------------------------------------------------------
// Step completion
// ---------------------------------------------------------------------------

/**
 * Compute the completion ratio (0 to 1) for a single wizard step based on
 * how many of its required fields have been filled.
 *
 * - Only considers fields that are marked `required` in the registry.
 * - Conditional fields whose parent gate is not satisfied are excluded.
 * - Returns 1 when the step has no required fields (nothing to complete).
 *
 * @param step           The wizard step to evaluate.
 * @param registry       The field registry for looking up field definitions.
 * @param getFieldValue  Accessor that returns the current value for a semantic key.
 */
export function computeStepCompletion(
  step: WizardStep,
  registry: FieldRegistry,
  getFieldValue: (key: string) => FieldValue,
): number {
  let totalRequired = 0;
  let filled = 0;

  for (const key of step.fieldKeys) {
    const field = registry.getBySemanticKey(key);
    if (!field) continue;
    if (!field.required) continue;

    // Skip conditional fields whose parent condition is not met.
    if (field.dependsOn) {
      const parentValue = getFieldValue(field.dependsOn);
      if (!evaluateShowWhen(field.showWhen, parentValue)) continue;
    }

    totalRequired++;
    const value = getFieldValue(key);
    if (isFieldFilled(value)) {
      filled++;
    }
  }

  if (totalRequired === 0) return 1;
  return filled / totalRequired;
}

// ---------------------------------------------------------------------------
// Summary fields for repeat group cards
// ---------------------------------------------------------------------------

/**
 * Semantic key pattern priorities for summary display. The first match
 * in each category wins. We look for these substrings (case-insensitive)
 * in the semantic key or label.
 */
const SUMMARY_PRIORITIES: Array<{
  category: string;
  patterns: RegExp[];
}> = [
  {
    category: 'name',
    patterns: [
      /\.name\b/i,
      /\.lastName\b/i,
      /\.firstName\b/i,
      /fullName/i,
      /\.employer\b/i,
      /\.schoolName\b/i,
      /\.facilityName\b/i,
      /\.organizationName\b/i,
    ],
  },
  {
    category: 'location',
    patterns: [
      /\.city\b/i,
      /\.address\b/i,
      /\.street\b/i,
      /\.country\b/i,
      /\.state\b/i,
    ],
  },
  {
    category: 'date',
    patterns: [
      /\.dateFrom\b/i,
      /\.startDate\b/i,
      /\.date\b/i,
      /\.fromDate\b/i,
      /\.issueDate\b/i,
    ],
  },
];

/**
 * Pick up to 3 fields from a step that are most useful for a summary
 * card preview (e.g. in a repeat group accordion). Prefers name/identifier
 * fields, then location fields, then date fields.
 *
 * Falls back to the first 3 fields in the step if no priority patterns match.
 *
 * @param step     The wizard step to extract summary fields from.
 * @param registry The field registry for looking up field definitions.
 * @returns        An array of 0-3 semantic keys.
 */
export function getStepSummaryFields(
  step: WizardStep,
  registry: FieldRegistry,
): string[] {
  const result: string[] = [];
  const usedCategories = new Set<string>();

  // First pass: pick one field per priority category.
  for (const { category, patterns } of SUMMARY_PRIORITIES) {
    if (result.length >= 3) break;
    if (usedCategories.has(category)) continue;

    for (const key of step.fieldKeys) {
      const field = registry.getBySemanticKey(key);
      if (!field) continue;

      const matchesKey = patterns.some((p) => p.test(key));
      const matchesLabel = patterns.some((p) => p.test(field.label));

      if (matchesKey || matchesLabel) {
        result.push(key);
        usedCategories.add(category);
        break;
      }
    }
  }

  // Second pass: fill remaining slots with any text/select fields not yet chosen.
  if (result.length < 3) {
    for (const key of step.fieldKeys) {
      if (result.length >= 3) break;
      if (result.includes(key)) continue;

      const field = registry.getBySemanticKey(key);
      if (!field) continue;

      // Prefer text-like fields over checkboxes/radios for summary display.
      const textTypes = new Set([
        'text', 'textarea', 'name', 'email', 'phone', 'telephone',
        'date', 'dateRange', 'select', 'country', 'state', 'location',
      ]);
      if (textTypes.has(field.uiFieldType)) {
        result.push(key);
      }
    }
  }

  // Last resort: take the first N field keys if we still have nothing.
  if (result.length === 0) {
    return step.fieldKeys.slice(0, 3);
  }

  return result;
}

// ---------------------------------------------------------------------------
// Step visibility filtering
// ---------------------------------------------------------------------------

/**
 * Filter a section's steps to only those that should be visible based on
 * the current gate field values.
 *
 * Visibility rules:
 * - Steps without `isConditionalBlock` are always visible (including gate
 *   steps that contain the gate field itself).
 * - Steps with `isConditionalBlock: true` are visible only when the gate
 *   field's value satisfies the `showWhen` expression of the first
 *   conditional field in the step.
 *
 * @param steps       All steps for a section (in order).
 * @param gateValues  Current values of all gate fields, keyed by semantic key.
 * @param registry    The field registry for looking up showWhen expressions.
 * @returns           The subset of steps that should be displayed.
 */
export function filterVisibleSteps(
  steps: WizardStep[],
  gateValues: Record<string, FieldValue>,
  registry: FieldRegistry,
): WizardStep[] {
  return steps.filter((step) => {
    // Non-conditional steps (including gate-containing steps) are always visible.
    if (!step.isConditionalBlock || !step.gateFieldKey) {
      return true;
    }

    // This is a conditional block. Determine whether the gate condition is met
    // by finding the showWhen expression from the first conditional field.
    const gateValue = gateValues[step.gateFieldKey] ?? null;
    const showWhen = findShowWhenForStep(step, registry);

    if (!showWhen) {
      // No showWhen found means we cannot evaluate -- default to visible
      // to avoid hiding content the user needs to see.
      return true;
    }

    if (!evaluateShowWhen(showWhen, gateValue)) return false;

    // Transitive gate cascade: if the gate field itself is conditional
    // (has a parent gate), verify that the parent condition is also met.
    // Example: section 9 — RadioButtonList_15 depends on RadioButtonList_1.
    // When RadioButtonList_1 changes, steps gated by RadioButtonList_15
    // should also hide if RadioButtonList_15's parent condition is unmet.
    const gateField = registry.getBySemanticKey(step.gateFieldKey);
    if (gateField?.dependsOn && gateField.showWhen) {
      const grandparentValue = gateValues[gateField.dependsOn] ?? null;
      if (!evaluateShowWhen(gateField.showWhen, grandparentValue)) return false;
    }

    return true;
  });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Find the `showWhen` expression for a conditional step by looking at the
 * field definitions of the fields in the step. All conditional fields in a
 * step share the same gate, so we just need the first one that has a
 * `dependsOn` + `showWhen` pair.
 */
function findShowWhenForStep(
  step: WizardStep,
  registry: FieldRegistry,
): string | undefined {
  for (const key of step.fieldKeys) {
    const field = registry.getBySemanticKey(key);
    if (field?.dependsOn && field.showWhen) {
      return field.showWhen;
    }
  }
  return undefined;
}

/**
 * Determine whether a field value counts as "filled" for completion tracking.
 *
 * Mirrors the logic in field-atoms.ts but kept local to avoid a circular
 * import (field-atoms imports from jotai which is client-only).
 */
function isFieldFilled(value: FieldValue): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'boolean') return true; // even `false` is a deliberate answer
  if (typeof value === 'number') return true;
  return false;
}

// ---------------------------------------------------------------------------
// Gate key extraction
// ---------------------------------------------------------------------------

/**
 * Extract all unique gate field keys from a list of steps.
 *
 * Used by the navigation hook to know which Jotai atoms to subscribe to
 * for reactivity when gate values change.
 *
 * @param steps  The steps to scan for gate keys.
 * @returns      Deduplicated array of gate semantic keys (stable order).
 */
export function extractGateKeys(
  steps: WizardStep[],
  registry?: FieldRegistry,
): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const step of steps) {
    if (step.gateFieldKey && step.isConditionalBlock && !seen.has(step.gateFieldKey)) {
      seen.add(step.gateFieldKey);
      result.push(step.gateFieldKey);

      // Also subscribe to the gate's parent if it has one (transitive cascade).
      if (registry) {
        const gateField = registry.getBySemanticKey(step.gateFieldKey);
        if (gateField?.dependsOn && !seen.has(gateField.dependsOn)) {
          seen.add(gateField.dependsOn);
          result.push(gateField.dependsOn);
        }
      }
    }
  }

  return result;
}

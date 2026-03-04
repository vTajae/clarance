// ---------------------------------------------------------------------------
// Unit Tests for step-utils.ts
// ---------------------------------------------------------------------------

import { describe, it, expect } from 'vitest';
import {
  computeStepCompletion,
  getStepSummaryFields,
  filterVisibleSteps,
  extractGateKeys,
} from './step-utils';
import type { WizardStep } from './types';
import type { FieldRegistry } from '@/lib/field-registry/registry-loader';
import type { FieldDefinition } from '@/lib/field-registry/types';
import type { FieldValue } from '@/lib/state/atoms/field-atoms';

// ---------------------------------------------------------------------------
// Mock helpers
// ---------------------------------------------------------------------------

function mockRegistry(
  fields: Record<string, Partial<FieldDefinition>>,
): FieldRegistry {
  return {
    getBySemanticKey(key: string) {
      const f = fields[key];
      if (!f) return undefined;
      return {
        pdfFieldName: key,
        pdfObjectRef: '0 0 R',
        pdfFieldType: 'PDFTextField',
        pdfPage: 1,
        semanticKey: key,
        section: 'section1',
        label: key,
        uiFieldType: 'text',
        required: false,
        classificationConfidence: 1,
        manuallyVerified: false,
        ...f,
      } as FieldDefinition;
    },
  } as FieldRegistry;
}

function makeStep(overrides: Partial<WizardStep> = {}): WizardStep {
  return {
    id: 'step-1',
    title: 'Test Step',
    guidance: 'Some guidance',
    fieldKeys: [],
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// computeStepCompletion
// ---------------------------------------------------------------------------

describe('computeStepCompletion', () => {
  it('returns 1 when all required fields are filled', () => {
    const registry = mockRegistry({
      'field.a': { required: true },
      'field.b': { required: true },
    });
    const step = makeStep({ fieldKeys: ['field.a', 'field.b'] });
    const getValue = (key: string): FieldValue => {
      if (key === 'field.a') return 'Alice';
      if (key === 'field.b') return 'Bob';
      return null;
    };

    expect(computeStepCompletion(step, registry, getValue)).toBe(1);
  });

  it('returns 0 when no required fields are filled', () => {
    const registry = mockRegistry({
      'field.a': { required: true },
      'field.b': { required: true },
    });
    const step = makeStep({ fieldKeys: ['field.a', 'field.b'] });
    const getValue = (): FieldValue => null;

    expect(computeStepCompletion(step, registry, getValue)).toBe(0);
  });

  it('returns the correct ratio for partial fill', () => {
    const registry = mockRegistry({
      'field.a': { required: true },
      'field.b': { required: true },
      'field.c': { required: true },
    });
    const step = makeStep({ fieldKeys: ['field.a', 'field.b', 'field.c'] });
    const getValue = (key: string): FieldValue => {
      if (key === 'field.a') return 'filled';
      return null;
    };

    const result = computeStepCompletion(step, registry, getValue);
    expect(result).toBeCloseTo(1 / 3, 5);
  });

  it('returns 1 when no fields are required (nothing to complete)', () => {
    const registry = mockRegistry({
      'field.a': { required: false },
      'field.b': { required: false },
    });
    const step = makeStep({ fieldKeys: ['field.a', 'field.b'] });
    const getValue = (): FieldValue => null;

    expect(computeStepCompletion(step, registry, getValue)).toBe(1);
  });

  it('excludes conditional fields whose gate is not satisfied', () => {
    // gate field "field.gate" has value 'NO', but conditional field
    // requires === 'YES' to be visible, so it is skipped.
    const registry = mockRegistry({
      'field.gate': { required: true, uiFieldType: 'radio' },
      'field.conditional': {
        required: true,
        dependsOn: 'field.gate',
        showWhen: "=== 'YES'",
      },
      'field.always': { required: true },
    });
    const step = makeStep({
      fieldKeys: ['field.gate', 'field.conditional', 'field.always'],
    });
    const getValue = (key: string): FieldValue => {
      if (key === 'field.gate') return 'NO';
      if (key === 'field.always') return 'done';
      return null;
    };

    // field.gate is filled ('NO'), field.conditional is skipped (gate not met),
    // field.always is filled. So 2/2 required visible = 1.
    expect(computeStepCompletion(step, registry, getValue)).toBe(1);
  });

  it('includes conditional fields when their gate is satisfied', () => {
    const registry = mockRegistry({
      'field.gate': { required: true, uiFieldType: 'radio' },
      'field.conditional': {
        required: true,
        dependsOn: 'field.gate',
        showWhen: "=== 'YES'",
      },
    });
    const step = makeStep({
      fieldKeys: ['field.gate', 'field.conditional'],
    });
    const getValue = (key: string): FieldValue => {
      if (key === 'field.gate') return 'YES';
      // conditional field is empty
      return null;
    };

    // gate filled (1), conditional visible but empty (0) -> 1/2
    expect(computeStepCompletion(step, registry, getValue)).toBe(0.5);
  });

  it('skips field keys that are not found in the registry', () => {
    const registry = mockRegistry({
      'field.known': { required: true },
    });
    const step = makeStep({
      fieldKeys: ['field.known', 'field.missing', 'field.ghost'],
    });
    const getValue = (key: string): FieldValue => {
      if (key === 'field.known') return 'present';
      return null;
    };

    // Only field.known is in registry and filled -> 1/1
    expect(computeStepCompletion(step, registry, getValue)).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// getStepSummaryFields
// ---------------------------------------------------------------------------

describe('getStepSummaryFields', () => {
  it('picks a name field via .name pattern in key', () => {
    const registry = mockRegistry({
      'person.name': { uiFieldType: 'text' },
      'person.age': { uiFieldType: 'text' },
      'person.email': { uiFieldType: 'email' },
    });
    const step = makeStep({
      fieldKeys: ['person.age', 'person.name', 'person.email'],
    });

    const result = getStepSummaryFields(step, registry);
    expect(result).toContain('person.name');
  });

  it('picks a location field via .city pattern', () => {
    const registry = mockRegistry({
      'address.city': { uiFieldType: 'text' },
      'address.zip': { uiFieldType: 'text' },
    });
    const step = makeStep({
      fieldKeys: ['address.zip', 'address.city'],
    });

    const result = getStepSummaryFields(step, registry);
    expect(result).toContain('address.city');
  });

  it('picks a date field via .dateFrom pattern', () => {
    const registry = mockRegistry({
      'employment.dateFrom': { uiFieldType: 'date' },
      'employment.employer': { uiFieldType: 'text' },
    });
    const step = makeStep({
      fieldKeys: ['employment.dateFrom', 'employment.employer'],
    });

    const result = getStepSummaryFields(step, registry);
    expect(result).toContain('employment.dateFrom');
  });

  it('falls back to first 3 text-like fields when no priority patterns match', () => {
    const registry = mockRegistry({
      'misc.alpha': { uiFieldType: 'text' },
      'misc.beta': { uiFieldType: 'select' },
      'misc.gamma': { uiFieldType: 'email' },
      'misc.delta': { uiFieldType: 'text' },
    });
    const step = makeStep({
      fieldKeys: ['misc.alpha', 'misc.beta', 'misc.gamma', 'misc.delta'],
    });

    const result = getStepSummaryFields(step, registry);
    // No priority patterns match, so second-pass picks text-like fields
    expect(result).toHaveLength(3);
    expect(result).toEqual(['misc.alpha', 'misc.beta', 'misc.gamma']);
  });

  it('returns first 3 field keys as last resort when step has only non-text fields', () => {
    const registry = mockRegistry({
      'flags.a': { uiFieldType: 'checkbox' },
      'flags.b': { uiFieldType: 'radio' },
      'flags.c': { uiFieldType: 'checkbox' },
      'flags.d': { uiFieldType: 'radio' },
    });
    const step = makeStep({
      fieldKeys: ['flags.a', 'flags.b', 'flags.c', 'flags.d'],
    });

    const result = getStepSummaryFields(step, registry);
    // No priority patterns match, no text-like fields in second pass,
    // so last resort returns first 3 raw fieldKeys.
    expect(result).toEqual(['flags.a', 'flags.b', 'flags.c']);
  });
});

// ---------------------------------------------------------------------------
// filterVisibleSteps
// ---------------------------------------------------------------------------

describe('filterVisibleSteps', () => {
  it('always includes non-conditional steps', () => {
    const registry = mockRegistry({});
    const steps: WizardStep[] = [
      makeStep({ id: 'step-a', isConditionalBlock: false }),
      makeStep({ id: 'step-b' }), // isConditionalBlock defaults to undefined
    ];

    const result = filterVisibleSteps(steps, {}, registry);
    expect(result).toHaveLength(2);
    expect(result.map((s) => s.id)).toEqual(['step-a', 'step-b']);
  });

  it('hides a conditional step when the gate value does not satisfy showWhen', () => {
    const registry = mockRegistry({
      'cond.field': {
        dependsOn: 'gate.radio',
        showWhen: "=== 'YES'",
      },
    });

    const conditionalStep = makeStep({
      id: 'conditional-step',
      isConditionalBlock: true,
      gateFieldKey: 'gate.radio',
      fieldKeys: ['cond.field'],
    });

    const result = filterVisibleSteps(
      [conditionalStep],
      { 'gate.radio': 'NO' },
      registry,
    );
    expect(result).toHaveLength(0);
  });

  it('shows a conditional step when the gate value satisfies showWhen', () => {
    const registry = mockRegistry({
      'cond.field': {
        dependsOn: 'gate.radio',
        showWhen: "=== 'YES'",
      },
    });

    const conditionalStep = makeStep({
      id: 'conditional-step',
      isConditionalBlock: true,
      gateFieldKey: 'gate.radio',
      fieldKeys: ['cond.field'],
    });

    const result = filterVisibleSteps(
      [conditionalStep],
      { 'gate.radio': 'YES' },
      registry,
    );
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('conditional-step');
  });

  it('hides a step when its gate field\'s parent condition is unmet (transitive cascade)', () => {
    // grandparent -> gate -> step
    // grandparent = RadioButtonList_1, gate = RadioButtonList_15
    const registry = mockRegistry({
      'gate.child': {
        dependsOn: 'gate.parent',
        showWhen: "=== '2'",
        uiFieldType: 'radio',
      },
      'cond.field': {
        dependsOn: 'gate.child',
        showWhen: "=== 'YES'",
      },
    });

    const conditionalStep = makeStep({
      id: 'nested-step',
      isConditionalBlock: true,
      gateFieldKey: 'gate.child',
      fieldKeys: ['cond.field'],
    });

    // gate.child says YES (direct condition met), but gate.parent is '3'
    // (parent condition "=== '2'" is NOT met), so step should be hidden
    const result = filterVisibleSteps(
      [conditionalStep],
      { 'gate.child': 'YES', 'gate.parent': '3' },
      registry,
    );
    expect(result).toHaveLength(0);
  });

  it('shows a step when both its gate and the gate\'s parent condition are met', () => {
    const registry = mockRegistry({
      'gate.child': {
        dependsOn: 'gate.parent',
        showWhen: "=== '2'",
        uiFieldType: 'radio',
      },
      'cond.field': {
        dependsOn: 'gate.child',
        showWhen: "=== 'YES'",
      },
    });

    const conditionalStep = makeStep({
      id: 'nested-step',
      isConditionalBlock: true,
      gateFieldKey: 'gate.child',
      fieldKeys: ['cond.field'],
    });

    const result = filterVisibleSteps(
      [conditionalStep],
      { 'gate.child': 'YES', 'gate.parent': '2' },
      registry,
    );
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('nested-step');
  });

  it('shows a step with isConditionalBlock true but no gateFieldKey', () => {
    const registry = mockRegistry({});
    const step = makeStep({
      id: 'no-gate',
      isConditionalBlock: true,
      // gateFieldKey intentionally omitted
    });

    const result = filterVisibleSteps([step], {}, registry);
    expect(result).toHaveLength(1);
  });

  it('defaults to visible when no fields in the step have showWhen', () => {
    const registry = mockRegistry({
      'plain.field': {
        // No dependsOn or showWhen
      },
    });

    const step = makeStep({
      id: 'no-showwhen',
      isConditionalBlock: true,
      gateFieldKey: 'some.gate',
      fieldKeys: ['plain.field'],
    });

    // Even though isConditionalBlock is true and gateFieldKey is set,
    // findShowWhenForStep returns undefined so step defaults to visible.
    const result = filterVisibleSteps(
      [step],
      { 'some.gate': 'NO' },
      registry,
    );
    expect(result).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// extractGateKeys
// ---------------------------------------------------------------------------

describe('extractGateKeys', () => {
  it('extracts gate keys from conditional steps', () => {
    const steps: WizardStep[] = [
      makeStep({ id: 's1', isConditionalBlock: true, gateFieldKey: 'gate.a' }),
      makeStep({ id: 's2', isConditionalBlock: true, gateFieldKey: 'gate.b' }),
    ];

    const result = extractGateKeys(steps);
    expect(result).toEqual(['gate.a', 'gate.b']);
  });

  it('deduplicates keys when the same gate is used by multiple steps', () => {
    const steps: WizardStep[] = [
      makeStep({ id: 's1', isConditionalBlock: true, gateFieldKey: 'gate.shared' }),
      makeStep({ id: 's2', isConditionalBlock: true, gateFieldKey: 'gate.shared' }),
      makeStep({ id: 's3', isConditionalBlock: true, gateFieldKey: 'gate.other' }),
    ];

    const result = extractGateKeys(steps);
    expect(result).toEqual(['gate.shared', 'gate.other']);
  });

  it('skips steps that do not have isConditionalBlock set', () => {
    const steps: WizardStep[] = [
      makeStep({ id: 's1', isConditionalBlock: false, gateFieldKey: 'gate.a' }),
      makeStep({ id: 's2', gateFieldKey: 'gate.b' }), // isConditionalBlock undefined
      makeStep({ id: 's3', isConditionalBlock: true, gateFieldKey: 'gate.c' }),
    ];

    const result = extractGateKeys(steps);
    expect(result).toEqual(['gate.c']);
  });

  it('returns an empty array when there are no conditional steps', () => {
    const steps: WizardStep[] = [
      makeStep({ id: 's1' }),
      makeStep({ id: 's2', gateFieldKey: 'gate.a' }),
    ];

    const result = extractGateKeys(steps);
    expect(result).toEqual([]);
  });

  it('includes grandparent gate keys when registry is provided', () => {
    const registry = mockRegistry({
      'gate.child': {
        dependsOn: 'gate.parent',
        showWhen: "=== '2'",
        uiFieldType: 'radio',
      },
    });

    const steps: WizardStep[] = [
      makeStep({ id: 's1', isConditionalBlock: true, gateFieldKey: 'gate.child' }),
    ];

    const result = extractGateKeys(steps, registry);
    expect(result).toEqual(['gate.child', 'gate.parent']);
  });

  it('deduplicates grandparent keys', () => {
    const registry = mockRegistry({
      'gate.a': {
        dependsOn: 'gate.parent',
        showWhen: "=== '2'",
        uiFieldType: 'radio',
      },
      'gate.b': {
        dependsOn: 'gate.parent',
        showWhen: "=== '3'",
        uiFieldType: 'radio',
      },
    });

    const steps: WizardStep[] = [
      makeStep({ id: 's1', isConditionalBlock: true, gateFieldKey: 'gate.a' }),
      makeStep({ id: 's2', isConditionalBlock: true, gateFieldKey: 'gate.b' }),
    ];

    const result = extractGateKeys(steps, registry);
    // gate.parent inserted after gate.a (its first child), not duplicated for gate.b
    expect(result).toEqual(['gate.a', 'gate.parent', 'gate.b']);
  });
});

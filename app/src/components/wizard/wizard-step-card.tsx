'use client';

import { useEffect, useRef } from 'react';
import type { WizardStep } from '@/lib/wizard/types';
import type { FieldDefinition } from '@/lib/field-registry/types';
import { useRegistry } from '@/lib/field-registry/use-registry';
import { RegistryField } from '@/components/sections/registry-field';
import { ConditionalWrapper } from '@/components/sections/conditional-wrapper';

interface WizardStepCardProps {
  step: WizardStep;
  /** Animate direction: 1 = forward, -1 = backward, 0 = none. */
  direction?: number;
}

/** Classify field width: full-width vs half-width based on type. */
function fieldSpan(field: FieldDefinition): 'full' | 'half' {
  switch (field.uiFieldType) {
    case 'textarea':
    case 'radio':
    case 'checkbox':
    case 'branch':
      return 'full';
    case 'state':
    case 'height':
    case 'ssn':
      return 'half';
    default:
      // Short fields: zip, phone, suffix, etc.
      if (field.maxLength && field.maxLength <= 10) return 'half';
      if (field.semanticKey.includes('zipCode')) return 'half';
      if (field.semanticKey.includes('suffix')) return 'half';
      if (field.semanticKey.includes('isEstimate')) return 'half';
      if (field.semanticKey.includes('isPresent')) return 'half';
      return 'full';
  }
}

/**
 * Renders a single wizard step as a centered card with title, guidance,
 * and the step's fields in a responsive grid.
 */
export function WizardStepCard({ step, direction = 0 }: WizardStepCardProps) {
  const registry = useRegistry();
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-focus first input on step entry
  useEffect(() => {
    if (!containerRef.current) return;
    const timer = setTimeout(() => {
      const firstInput = containerRef.current?.querySelector<HTMLElement>(
        'input:not([type="hidden"]), select, textarea',
      );
      firstInput?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, [step.id]);

  // Resolve field definitions
  const fields = step.fieldKeys
    .map((key) => registry.getBySemanticKey(key))
    .filter((f): f is FieldDefinition => f !== undefined);

  if (fields.length === 0) return null;

  // Build a layout plan: pair up consecutive half-width fields
  const rows: Array<{ fields: FieldDefinition[]; span: 'full' | 'half' }> = [];
  let i = 0;
  while (i < fields.length) {
    const span = fieldSpan(fields[i]);
    if (span === 'half' && i + 1 < fields.length && fieldSpan(fields[i + 1]) === 'half') {
      rows.push({ fields: [fields[i], fields[i + 1]], span: 'half' });
      i += 2;
    } else {
      rows.push({ fields: [fields[i]], span });
      i += 1;
    }
  }

  const animClass =
    direction > 0
      ? 'animate-[slideInRight_200ms_ease-out]'
      : direction < 0
        ? 'animate-[slideInLeft_200ms_ease-out]'
        : '';

  return (
    <div
      ref={containerRef}
      className={`mx-auto w-full max-w-2xl rounded-lg bg-white shadow-sm border border-gray-200 p-8 ${animClass}`}
    >
      {/* Step title */}
      <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>

      {/* Guidance text */}
      {step.guidance && (
        <p className="mt-1 text-sm text-gray-600 leading-relaxed">
          {step.guidance}
        </p>
      )}

      {/* Fields */}
      <div className="mt-6 space-y-4">
        {rows.map((row, ri) => {
          if (row.span === 'half' && row.fields.length === 2) {
            return (
              <div key={row.fields[0].semanticKey} className="grid grid-cols-2 gap-4">
                {row.fields.map((field) => (
                  <ConditionalWrapper key={field.semanticKey} field={field}>
                    <RegistryField field={field} />
                  </ConditionalWrapper>
                ))}
              </div>
            );
          }
          const field = row.fields[0];
          return (
            <ConditionalWrapper key={field.semanticKey} field={field}>
              <RegistryField field={field} />
            </ConditionalWrapper>
          );
        })}
      </div>
    </div>
  );
}

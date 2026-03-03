'use client';

import type { WizardStep } from '@/lib/wizard/types';
import type { FieldDefinition } from '@/lib/field-registry/types';
import { useRegistry } from '@/lib/field-registry/use-registry';
import { useAtomValue } from 'jotai';
import { fieldValueAtomFamily } from '@/lib/state/atoms/field-atoms';

interface WizardReviewPanelProps {
  steps: WizardStep[];
  sectionTitle: string;
  nextSectionTitle?: string;
  onEditStep: (index: number) => void;
  onContinue: () => void;
}

/**
 * End-of-section review panel. Shows all answers grouped by step,
 * flags missing required fields, and allows jumping back to edit.
 */
export function WizardReviewPanel({
  steps,
  sectionTitle,
  nextSectionTitle,
  onEditStep,
  onContinue,
}: WizardReviewPanelProps) {
  const registry = useRegistry();

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Header */}
      <div className="rounded-t-lg bg-blue-600 px-6 py-4">
        <h3 className="text-lg font-semibold text-white">Review: {sectionTitle}</h3>
        <p className="mt-1 text-sm text-blue-100">
          Review your answers below. Click &ldquo;Edit&rdquo; to make changes.
        </p>
      </div>

      {/* Steps review */}
      <div className="divide-y divide-gray-200 rounded-b-lg border border-t-0 border-gray-200 bg-white">
        {steps.map((step, i) => (
          <ReviewStepGroup
            key={step.id}
            step={step}
            stepIndex={i}
            registry={registry}
            onEdit={() => onEditStep(i)}
          />
        ))}
      </div>

      {/* Continue button */}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onContinue}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {nextSectionTitle ? `Continue to ${nextSectionTitle}` : 'Finish'}
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

interface ReviewStepGroupProps {
  step: WizardStep;
  stepIndex: number;
  registry: ReturnType<typeof useRegistry>;
  onEdit: () => void;
}

function ReviewStepGroup({ step, stepIndex, registry, onEdit }: ReviewStepGroupProps) {
  const fields = step.fieldKeys
    .map((key) => registry.getBySemanticKey(key))
    .filter((f): f is FieldDefinition => f !== undefined);

  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-gray-900">
          Step {stepIndex + 1}: {step.title}
        </h4>
        <button
          type="button"
          onClick={onEdit}
          className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
        >
          Edit
        </button>
      </div>
      <dl className="space-y-1.5">
        {fields.map((field) => (
          <ReviewFieldRow key={field.semanticKey} field={field} />
        ))}
      </dl>
    </div>
  );
}

// ---------------------------------------------------------------------------

function ReviewFieldRow({ field }: { field: FieldDefinition }) {
  const value = useAtomValue(fieldValueAtomFamily(field.semanticKey));

  const isEmpty = value === '' || value === null || value === undefined;
  const displayValue = isEmpty
    ? null
    : typeof value === 'boolean'
      ? value ? 'Yes' : 'No'
      : String(value);

  // Truncate label for display
  const label = field.label.length > 60 ? field.label.slice(0, 57) + '...' : field.label;

  return (
    <div className="flex items-start gap-2 text-sm">
      <dt className="w-1/2 text-gray-500 truncate" title={field.label}>
        {label}
      </dt>
      <dd className="w-1/2">
        {displayValue ? (
          <span className="text-gray-900">{displayValue}</span>
        ) : field.required ? (
          <span className="inline-flex items-center gap-1 text-amber-600">
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.168 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            Required
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </dd>
    </div>
  );
}

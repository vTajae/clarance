'use client';

import { type ReactNode, useCallback, useId } from 'react';
import { useFieldValue } from '@/lib/state/hooks/use-field-value';
import type { BaseFieldProps } from '@/lib/types/form';

interface BranchFieldProps extends Omit<BaseFieldProps, 'label'> {
  /** The yes/no question displayed above the radio buttons. */
  question: string;
  /** Content revealed when the answer is "Yes". */
  children: ReactNode;
}

export function BranchField({
  semanticKey,
  question,
  required = false,
  disabled = false,
  helpText,
  error,
  children,
}: BranchFieldProps) {
  const id = useId();
  const [value, setValue] = useFieldValue(semanticKey);

  const handleChange = useCallback(
    (answer: 'Yes' | 'No') => {
      setValue(answer);
    },
    [setValue],
  );

  const currentValue = typeof value === 'string' ? value : '';
  const isYes = currentValue === 'Yes';

  return (
    <fieldset className="mb-6" aria-invalid={!!error}>
      <legend className="block text-sm font-medium text-gray-700 mb-2">
        {question}
        {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
      </legend>

      <div className="flex gap-4" role="radiogroup">
        <button
          type="button"
          role="radio"
          aria-checked={currentValue === 'Yes'}
          onClick={() => handleChange('Yes')}
          disabled={disabled}
          className={`
            px-6 py-2 rounded-md border text-sm font-medium transition-colors
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
            ${
              currentValue === 'Yes'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          Yes
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={currentValue === 'No'}
          onClick={() => handleChange('No')}
          disabled={disabled}
          className={`
            px-6 py-2 rounded-md border text-sm font-medium transition-colors
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
            ${
              currentValue === 'No'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          No
        </button>
      </div>

      {helpText && (
        <p id={`${id}-help`} className="mt-2 text-xs text-gray-500">
          {helpText}
        </p>
      )}

      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}

      {isYes && (
        <div
          className="mt-4 pl-4 border-l-2 border-blue-200"
          role="region"
          aria-label="Additional details"
        >
          {children}
        </div>
      )}
    </fieldset>
  );
}

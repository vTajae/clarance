'use client';

import { useCallback, useId } from 'react';
import { useFieldValue } from '@/lib/state/hooks/use-field-value';
import { DateField } from './DateField';
import type { BaseFieldProps } from '@/lib/types/form';

interface DateRangeFieldProps extends BaseFieldProps {
  /** Show a "Present" checkbox on the "To" date for ongoing periods. */
  showPresent?: boolean;
}

export function DateRangeField({
  semanticKey,
  label,
  required = false,
  disabled = false,
  helpText,
  error,
  showPresent = false,
}: DateRangeFieldProps) {
  const id = useId();
  const [present, setPresent] = useFieldValue(`${semanticKey}.present`);

  const isPresent = present === true;

  const handlePresentChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPresent(e.target.checked);
    },
    [setPresent],
  );

  return (
    <fieldset className="mb-4" aria-invalid={!!error}>
      <legend className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
      </legend>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DateField
          semanticKey={`${semanticKey}.from`}
          label="From"
          required={required}
          disabled={disabled}
          showEstimated
        />

        <div>
          <DateField
            semanticKey={`${semanticKey}.to`}
            label="To"
            required={required && !isPresent}
            disabled={disabled || isPresent}
            showEstimated
          />

          {showPresent && (
            <div className="flex items-center gap-1.5 -mt-2">
              <input
                id={`${id}-present`}
                type="checkbox"
                checked={isPresent}
                onChange={handlePresentChange}
                disabled={disabled}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor={`${id}-present`} className="text-sm text-gray-700">
                Present
              </label>
            </div>
          )}
        </div>
      </div>

      {helpText && (
        <p id={`${id}-help`} className="mt-1 text-xs text-gray-500">
          {helpText}
        </p>
      )}

      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}

'use client';

import { useCallback, useId } from 'react';
import { useFieldValue } from '@/lib/state/hooks/use-field-value';
import type { BaseFieldProps } from '@/lib/types/form';

type CheckboxFieldProps = BaseFieldProps;

export function CheckboxField({
  semanticKey,
  label,
  required = false,
  disabled = false,
  helpText,
  error,
}: CheckboxFieldProps) {
  const id = useId();
  const [value, setValue] = useFieldValue(semanticKey);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.checked);
    },
    [setValue],
  );

  const checked = value === true;

  return (
    <div className="mb-4">
      <div className="flex items-start gap-2">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={
            [helpText ? `${id}-help` : null, error ? `${id}-error` : null]
              .filter(Boolean)
              .join(' ') || undefined
          }
          className={`
            mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600
            focus:ring-2 focus:ring-blue-500
            ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          `}
        />
        <label
          htmlFor={id}
          className={`text-sm font-medium text-gray-700 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {label}
          {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
        </label>
      </div>

      {helpText && (
        <p id={`${id}-help`} className="mt-1 ml-6 text-xs text-gray-500">
          {helpText}
        </p>
      )}

      {error && (
        <p id={`${id}-error`} className="mt-1 ml-6 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

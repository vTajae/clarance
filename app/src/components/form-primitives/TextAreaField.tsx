'use client';

import { useCallback, useId } from 'react';
import { useFieldValue } from '@/lib/state/hooks/use-field-value';
import type { BaseFieldProps } from '@/lib/types/form';

interface TextAreaFieldProps extends BaseFieldProps {
  maxLength?: number;
  rows?: number;
}

export function TextAreaField({
  semanticKey,
  label,
  required = false,
  disabled = false,
  helpText,
  error,
  maxLength,
  rows = 4,
}: TextAreaFieldProps) {
  const id = useId();
  const [value, setValue] = useFieldValue(semanticKey);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
    },
    [setValue],
  );

  const displayValue = typeof value === 'string' ? value : '';
  const remaining = maxLength != null ? maxLength - displayValue.length : null;

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
      </label>

      <textarea
        id={id}
        value={displayValue}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        rows={rows}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={
          [helpText ? `${id}-help` : null, error ? `${id}-error` : null]
            .filter(Boolean)
            .join(' ') || undefined
        }
        className={`
          block w-full rounded-md border px-3 py-2 text-sm resize-y
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          placeholder:text-gray-400
        `}
      />

      <div className="flex justify-between mt-1">
        {helpText ? (
          <p id={`${id}-help`} className="text-xs text-gray-500">
            {helpText}
          </p>
        ) : (
          <span />
        )}
        {remaining != null && (
          <span className={`text-xs ${remaining < 20 ? 'text-red-500' : 'text-gray-400'}`}>
            {remaining} characters remaining
          </span>
        )}
      </div>

      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

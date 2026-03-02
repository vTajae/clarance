'use client';

import { useCallback, useId } from 'react';
import { useFieldValue } from '@/lib/state/hooks/use-field-value';
import type { BaseFieldProps } from '@/lib/types/form';

interface TextFieldProps extends BaseFieldProps {
  maxLength?: number;
  placeholder?: string;
  /** HTML pattern attribute for client-side validation. */
  pattern?: string;
}

export function TextField({
  semanticKey,
  label,
  required = false,
  disabled = false,
  helpText,
  error,
  maxLength,
  placeholder,
  pattern,
}: TextFieldProps) {
  const id = useId();
  const [value, setValue] = useFieldValue(semanticKey);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
    [setValue],
  );

  const displayValue = typeof value === 'string' ? value : '';

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
      </label>

      <input
        id={id}
        type="text"
        value={displayValue}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        placeholder={placeholder}
        pattern={pattern}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={
          [helpText ? `${id}-help` : null, error ? `${id}-error` : null]
            .filter(Boolean)
            .join(' ') || undefined
        }
        className={`
          block w-full rounded-md border px-3 py-2 text-sm
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          placeholder:text-gray-400
        `}
      />

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
    </div>
  );
}

'use client';

import { useCallback, useId } from 'react';
import { useFieldValue } from '@/lib/state/hooks/use-field-value';
import type { BaseFieldProps, FieldOption } from '@/lib/types/form';

interface SelectFieldProps extends BaseFieldProps {
  options: FieldOption[];
  placeholder?: string;
}

export function SelectField({
  semanticKey,
  label,
  required = false,
  disabled = false,
  helpText,
  error,
  options,
  placeholder = '-- Select --',
}: SelectFieldProps) {
  const id = useId();
  const [value, setValue] = useFieldValue(semanticKey);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setValue(e.target.value || null);
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

      <select
        id={id}
        value={displayValue}
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
          block w-full rounded-md border px-3 py-2 text-sm appearance-none
          bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236B7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')]
          bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.25rem_1.25rem] pr-8
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}
          ${!displayValue ? 'text-gray-400' : ''}
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        `}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

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

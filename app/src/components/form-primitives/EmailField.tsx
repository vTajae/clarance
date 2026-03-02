'use client';

import { useCallback, useId } from 'react';
import { useFieldValue } from '@/lib/state/hooks/use-field-value';
import type { BaseFieldProps } from '@/lib/types/form';

interface EmailFieldProps extends BaseFieldProps {
  /** Show an "I don't know" checkbox that clears/disables the email input. */
  showUnknown?: boolean;
}

export function EmailField({
  semanticKey,
  label,
  required = false,
  disabled = false,
  helpText,
  error,
  showUnknown = false,
}: EmailFieldProps) {
  const id = useId();
  const [value, setValue] = useFieldValue(semanticKey);
  const [unknown, setUnknown] = useFieldValue(`${semanticKey}.unknown`);

  const displayValue = typeof value === 'string' ? value : '';
  const isUnknown = unknown === true;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
    [setValue],
  );

  const handleUnknownChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      setUnknown(checked);
      if (checked) setValue(null);
    },
    [setUnknown, setValue],
  );

  const isDisabled = disabled || isUnknown;

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && !isUnknown && (
          <span className="text-red-500 ml-0.5" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <input
        id={id}
        type="email"
        value={displayValue}
        onChange={handleChange}
        disabled={isDisabled}
        required={required && !isUnknown}
        aria-required={required && !isUnknown}
        aria-invalid={!!error}
        aria-describedby={
          [helpText ? `${id}-help` : null, error ? `${id}-error` : null]
            .filter(Boolean)
            .join(' ') || undefined
        }
        placeholder="name@example.com"
        className={`
          block w-full rounded-md border px-3 py-2 text-sm
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${isDisabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          placeholder:text-gray-400
        `}
      />

      {showUnknown && (
        <div className="flex items-center gap-1.5 mt-2">
          <input
            id={`${id}-unknown`}
            type="checkbox"
            checked={isUnknown}
            onChange={handleUnknownChange}
            disabled={disabled}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor={`${id}-unknown`} className="text-sm text-gray-700">
            I don&apos;t know
          </label>
        </div>
      )}

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

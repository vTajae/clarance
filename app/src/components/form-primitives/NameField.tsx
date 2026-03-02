'use client';

import { useCallback, useId } from 'react';
import { useFieldValue } from '@/lib/state/hooks/use-field-value';
import type { BaseFieldProps } from '@/lib/types/form';

const SUFFIX_OPTIONS = ['', 'Jr.', 'Sr.', 'II', 'III', 'IV', 'V', 'Other'];

type NameFieldProps = BaseFieldProps;

export function NameField({
  semanticKey,
  label,
  required = false,
  disabled = false,
  helpText,
  error,
}: NameFieldProps) {
  const id = useId();
  const [lastName, setLastName] = useFieldValue(`${semanticKey}.lastName`);
  const [firstName, setFirstName] = useFieldValue(`${semanticKey}.firstName`);
  const [middleName, setMiddleName] = useFieldValue(`${semanticKey}.middleName`);
  const [suffix, setSuffix] = useFieldValue(`${semanticKey}.suffix`);
  const [noMiddleName, setNoMiddleName] = useFieldValue(`${semanticKey}.noMiddleName`);

  const handleNoMiddleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      setNoMiddleName(checked);
      if (checked) setMiddleName(null);
    },
    [setNoMiddleName, setMiddleName],
  );

  const str = (v: string | boolean | number | null) => (typeof v === 'string' ? v : '');

  const inputClasses = `
    block w-full rounded-md border px-3 py-2 text-sm
    ${error ? 'border-red-500' : 'border-gray-300'}
    ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    placeholder:text-gray-400
  `;

  return (
    <fieldset className="mb-4" aria-invalid={!!error}>
      <legend className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
      </legend>

      <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
        {/* Last Name */}
        <div className="sm:col-span-2">
          <label htmlFor={`${id}-last`} className="block text-xs text-gray-500 mb-0.5">
            Last Name
          </label>
          <input
            id={`${id}-last`}
            type="text"
            value={str(lastName)}
            onChange={(e) => setLastName(e.target.value)}
            disabled={disabled}
            required={required}
            aria-required={required}
            className={inputClasses}
          />
        </div>

        {/* First Name */}
        <div className="sm:col-span-2">
          <label htmlFor={`${id}-first`} className="block text-xs text-gray-500 mb-0.5">
            First Name
          </label>
          <input
            id={`${id}-first`}
            type="text"
            value={str(firstName)}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={disabled}
            required={required}
            aria-required={required}
            className={inputClasses}
          />
        </div>

        {/* Middle Name */}
        <div className="sm:col-span-1">
          <label htmlFor={`${id}-middle`} className="block text-xs text-gray-500 mb-0.5">
            Middle Name
          </label>
          <input
            id={`${id}-middle`}
            type="text"
            value={str(middleName)}
            onChange={(e) => setMiddleName(e.target.value)}
            disabled={disabled || noMiddleName === true}
            className={inputClasses}
          />
          <div className="flex items-center gap-1 mt-1">
            <input
              id={`${id}-no-middle`}
              type="checkbox"
              checked={noMiddleName === true}
              onChange={handleNoMiddleChange}
              disabled={disabled}
              className="h-3 w-3 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor={`${id}-no-middle`} className="text-xs text-gray-500">
              No middle name
            </label>
          </div>
        </div>

        {/* Suffix */}
        <div className="sm:col-span-1">
          <label htmlFor={`${id}-suffix`} className="block text-xs text-gray-500 mb-0.5">
            Suffix
          </label>
          <select
            id={`${id}-suffix`}
            value={str(suffix)}
            onChange={(e) => setSuffix(e.target.value || null)}
            disabled={disabled}
            className={inputClasses}
          >
            {SUFFIX_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s || '-- None --'}
              </option>
            ))}
          </select>
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

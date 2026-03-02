'use client';

import { useCallback, useId } from 'react';
import { useFieldValue } from '@/lib/state/hooks/use-field-value';
import type { BaseFieldProps } from '@/lib/types/form';

type HeightFieldProps = BaseFieldProps;

export function HeightField({
  semanticKey,
  label,
  required = false,
  disabled = false,
  helpText,
  error,
}: HeightFieldProps) {
  const id = useId();
  const [feet, setFeet] = useFieldValue(`${semanticKey}.feet`);
  const [inches, setInches] = useFieldValue(`${semanticKey}.inches`);

  const feetStr =
    typeof feet === 'number' ? String(feet) : typeof feet === 'string' ? feet : '';
  const inchesStr =
    typeof inches === 'number' ? String(inches) : typeof inches === 'string' ? inches : '';

  const handleFeetChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, '');
      const num = raw ? parseInt(raw, 10) : null;
      setFeet(num);
    },
    [setFeet],
  );

  const handleInchesChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, '');
      let num = raw ? parseInt(raw, 10) : null;
      // Clamp inches to 0-11
      if (num !== null && num > 11) num = 11;
      setInches(num);
    },
    [setInches],
  );

  const inputClasses = `
    rounded-md border px-3 py-2 text-sm text-center
    ${error ? 'border-red-500' : 'border-gray-300'}
    ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
  `;

  return (
    <fieldset className="mb-4" aria-invalid={!!error}>
      <legend className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
      </legend>

      <div className="flex items-end gap-2">
        <div className="flex flex-col">
          <label htmlFor={`${id}-feet`} className="text-xs text-gray-500 mb-0.5">
            Feet
          </label>
          <input
            id={`${id}-feet`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={feetStr}
            onChange={handleFeetChange}
            disabled={disabled}
            required={required}
            aria-required={required}
            placeholder="5"
            className={`w-16 ${inputClasses}`}
          />
        </div>

        <span className="pb-2 text-gray-400 font-medium" aria-hidden="true">
          ft
        </span>

        <div className="flex flex-col">
          <label htmlFor={`${id}-inches`} className="text-xs text-gray-500 mb-0.5">
            Inches
          </label>
          <input
            id={`${id}-inches`}
            type="text"
            inputMode="numeric"
            maxLength={2}
            value={inchesStr}
            onChange={handleInchesChange}
            disabled={disabled}
            required={required}
            aria-required={required}
            placeholder="10"
            className={`w-16 ${inputClasses}`}
          />
        </div>

        <span className="pb-2 text-gray-400 font-medium" aria-hidden="true">
          in
        </span>
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

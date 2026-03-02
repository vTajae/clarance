'use client';

import { useCallback, useId } from 'react';
import { useFieldValue } from '@/lib/state/hooks/use-field-value';
import type { BaseFieldProps } from '@/lib/types/form';

type TelephoneFieldProps = BaseFieldProps;

const PHONE_TYPES = ['Domestic', 'International', 'DSN'] as const;
const TIME_OF_DAY = ['Day', 'Night', 'Both'] as const;

export function TelephoneField({
  semanticKey,
  label,
  required = false,
  disabled = false,
  helpText,
  error,
}: TelephoneFieldProps) {
  const id = useId();
  const [number, setNumber] = useFieldValue(`${semanticKey}.number`);
  const [extension, setExtension] = useFieldValue(`${semanticKey}.extension`);
  const [phoneType, setPhoneType] = useFieldValue(`${semanticKey}.type`);
  const [timeOfDay, setTimeOfDay] = useFieldValue(`${semanticKey}.timeOfDay`);

  const str = (v: string | boolean | number | null) => (typeof v === 'string' ? v : '');
  const currentType = str(phoneType) || 'Domestic';
  const currentTod = str(timeOfDay) || 'Day';

  const formatDomestic = useCallback((raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }, []);

  const handleNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      if (currentType === 'Domestic') {
        setNumber(formatDomestic(raw));
      } else {
        setNumber(raw);
      }
    },
    [currentType, formatDomestic, setNumber],
  );

  const inputClasses = `
    rounded-md border px-3 py-2 text-sm
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

      {/* Phone type selector */}
      <div className="flex gap-4 mb-3">
        {PHONE_TYPES.map((type) => {
          const optId = `${id}-type-${type}`;
          return (
            <div key={type} className="flex items-center gap-1.5">
              <input
                id={optId}
                type="radio"
                name={`${semanticKey}-type`}
                value={type}
                checked={currentType === type}
                onChange={() => setPhoneType(type)}
                disabled={disabled}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor={optId} className="text-sm text-gray-700">
                {type}
              </label>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Phone number */}
        <div className="flex-1 min-w-48">
          <label htmlFor={`${id}-number`} className="block text-xs text-gray-500 mb-0.5">
            Number
          </label>
          <input
            id={`${id}-number`}
            type="tel"
            value={str(number)}
            onChange={handleNumberChange}
            disabled={disabled}
            required={required}
            aria-required={required}
            placeholder={
              currentType === 'International'
                ? '+1 234 567 8901'
                : currentType === 'DSN'
                  ? '312-555-1234'
                  : '(555) 555-1234'
            }
            className={`block w-full ${inputClasses}`}
          />
        </div>

        {/* Extension */}
        <div className="w-24">
          <label htmlFor={`${id}-ext`} className="block text-xs text-gray-500 mb-0.5">
            Ext.
          </label>
          <input
            id={`${id}-ext`}
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={str(extension)}
            onChange={(e) => setExtension(e.target.value.replace(/\D/g, ''))}
            disabled={disabled}
            className={`block w-full ${inputClasses}`}
          />
        </div>
      </div>

      {/* Time of day */}
      <div className="flex gap-4 mt-3">
        {TIME_OF_DAY.map((tod) => {
          const todId = `${id}-tod-${tod}`;
          return (
            <div key={tod} className="flex items-center gap-1.5">
              <input
                id={todId}
                type="radio"
                name={`${semanticKey}-tod`}
                value={tod}
                checked={currentTod === tod}
                onChange={() => setTimeOfDay(tod)}
                disabled={disabled}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor={todId} className="text-sm text-gray-700">
                {tod}
              </label>
            </div>
          );
        })}
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
    </fieldset>
  );
}

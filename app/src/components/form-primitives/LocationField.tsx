'use client';

import { useId, useMemo } from 'react';
import { useFieldValue } from '@/lib/state/hooks/use-field-value';
import { US_STATES } from '@/lib/data/states';
import { COUNTRIES } from '@/lib/data/countries';
import type { BaseFieldProps } from '@/lib/types/form';

interface LocationFieldProps extends BaseFieldProps {
  /** Show APO/FPO/DPO option for military addresses. */
  showApoFpo?: boolean;
}

const APO_FPO_OPTIONS = [
  { value: '', label: '-- None --' },
  { value: 'APO', label: 'APO (Army/Air Force Post Office)' },
  { value: 'FPO', label: 'FPO (Fleet Post Office)' },
  { value: 'DPO', label: 'DPO (Diplomatic Post Office)' },
];

export function LocationField({
  semanticKey,
  label,
  required = false,
  disabled = false,
  helpText,
  error,
  showApoFpo = false,
}: LocationFieldProps) {
  const id = useId();
  const [street, setStreet] = useFieldValue(`${semanticKey}.street`);
  const [street2, setStreet2] = useFieldValue(`${semanticKey}.street2`);
  const [city, setCity] = useFieldValue(`${semanticKey}.city`);
  const [state, setState] = useFieldValue(`${semanticKey}.state`);
  const [zipcode, setZipcode] = useFieldValue(`${semanticKey}.zipcode`);
  const [country, setCountry] = useFieldValue(`${semanticKey}.country`);
  const [apoFpo, setApoFpo] = useFieldValue(`${semanticKey}.apoFpo`);

  const str = (v: string | boolean | number | null) => (typeof v === 'string' ? v : '');

  const isUS = useMemo(() => {
    const c = typeof country === 'string' ? country : '';
    return !c || c === 'US';
  }, [country]);

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

      <div className="space-y-3">
        {/* Street Address */}
        <div>
          <label htmlFor={`${id}-street`} className="block text-xs text-gray-500 mb-0.5">
            Street Address
          </label>
          <input
            id={`${id}-street`}
            type="text"
            value={str(street)}
            onChange={(e) => setStreet(e.target.value)}
            disabled={disabled}
            required={required}
            aria-required={required}
            placeholder="123 Main Street"
            className={inputClasses}
          />
        </div>

        {/* Street Line 2 */}
        <div>
          <label htmlFor={`${id}-street2`} className="block text-xs text-gray-500 mb-0.5">
            Street Address Line 2
          </label>
          <input
            id={`${id}-street2`}
            type="text"
            value={str(street2)}
            onChange={(e) => setStreet2(e.target.value)}
            disabled={disabled}
            placeholder="Apt, Suite, Unit, etc."
            className={inputClasses}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
          {/* City */}
          <div className="sm:col-span-2">
            <label htmlFor={`${id}-city`} className="block text-xs text-gray-500 mb-0.5">
              City
            </label>
            <input
              id={`${id}-city`}
              type="text"
              value={str(city)}
              onChange={(e) => setCity(e.target.value)}
              disabled={disabled}
              required={required}
              className={inputClasses}
            />
          </div>

          {/* State (shown when country is US) */}
          {isUS && (
            <div className="sm:col-span-2">
              <label htmlFor={`${id}-state`} className="block text-xs text-gray-500 mb-0.5">
                State
              </label>
              <select
                id={`${id}-state`}
                value={str(state)}
                onChange={(e) => setState(e.target.value || null)}
                disabled={disabled}
                required={required}
                className={inputClasses}
              >
                <option value="">-- Select --</option>
                {US_STATES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* ZIP / Postal Code */}
          <div className="sm:col-span-2">
            <label htmlFor={`${id}-zip`} className="block text-xs text-gray-500 mb-0.5">
              {isUS ? 'ZIP Code' : 'Postal Code'}
            </label>
            <input
              id={`${id}-zip`}
              type="text"
              inputMode="numeric"
              maxLength={isUS ? 10 : 20}
              value={str(zipcode)}
              onChange={(e) => setZipcode(e.target.value)}
              disabled={disabled}
              placeholder={isUS ? '12345' : ''}
              className={inputClasses}
            />
          </div>
        </div>

        {/* Country */}
        <div className="max-w-xs">
          <label htmlFor={`${id}-country`} className="block text-xs text-gray-500 mb-0.5">
            Country
          </label>
          <select
            id={`${id}-country`}
            value={str(country) || 'US'}
            onChange={(e) => setCountry(e.target.value)}
            disabled={disabled}
            className={inputClasses}
          >
            {COUNTRIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* APO/FPO/DPO */}
        {showApoFpo && (
          <div className="max-w-xs">
            <label htmlFor={`${id}-apo`} className="block text-xs text-gray-500 mb-0.5">
              APO/FPO/DPO
            </label>
            <select
              id={`${id}-apo`}
              value={str(apoFpo)}
              onChange={(e) => setApoFpo(e.target.value || null)}
              disabled={disabled}
              className={inputClasses}
            >
              {APO_FPO_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
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

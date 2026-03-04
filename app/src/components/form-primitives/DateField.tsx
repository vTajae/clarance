'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useFieldValue } from '@/lib/state/hooks/use-field-value';
import type { BaseFieldProps } from '@/lib/types/form';

interface DateFieldProps extends BaseFieldProps {
  /** Show an "Estimated" checkbox alongside the date inputs. */
  showEstimated?: boolean;
}

/** Parse an ISO date string into month/day/year parts. */
function parseDateParts(raw: string | null): { month: string; day: string; year: string } {
  if (!raw || typeof raw !== 'string') return { month: '', day: '', year: '' };
  const d = new Date(raw);
  if (isNaN(d.getTime())) return { month: '', day: '', year: '' };
  return {
    month: String(d.getUTCMonth() + 1).padStart(2, '0'),
    day: String(d.getUTCDate()).padStart(2, '0'),
    year: String(d.getUTCFullYear()),
  };
}

/** Build an ISO string from month/day/year, or null if incomplete. */
function buildIso(month: string, day: string, year: string): string | null {
  const m = parseInt(month, 10);
  const d = parseInt(day, 10);
  const y = parseInt(year, 10);
  if (!m || !d || !y || year.length < 4) return null;
  const date = new Date(Date.UTC(y, m - 1, d));
  if (isNaN(date.getTime())) return null;
  return date.toISOString().split('T')[0]!;
}

const MONTHS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

export function DateField({
  semanticKey,
  label,
  required = false,
  disabled = false,
  helpText,
  error,
  showEstimated = false,
}: DateFieldProps) {
  const id = useId();
  const [value, setValue] = useFieldValue(semanticKey);
  const [estimated, setEstimated] = useFieldValue(`${semanticKey}.estimated`);

  // Local state for partial input — prevents snap-back when atom is null
  const [localParts, setLocalParts] = useState(() =>
    parseDateParts(typeof value === 'string' ? value : null),
  );

  // Track whether we're the source of the change to avoid circular updates
  const isLocalChange = useRef(false);

  // Sync atom → local state only on external changes (hydration, import)
  useEffect(() => {
    if (isLocalChange.current) {
      isLocalChange.current = false;
      return;
    }
    const iso = typeof value === 'string' ? value : null;
    const parsed = parseDateParts(iso);
    // Only overwrite local state if the atom has a real value
    // or if all local parts are empty (initial load)
    if (iso || (!localParts.month && !localParts.day && !localParts.year)) {
      setLocalParts(parsed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handlePartChange = useCallback(
    (part: 'month' | 'day' | 'year', raw: string) => {
      setLocalParts((prev) => {
        const next = { ...prev, [part]: raw };
        const built = buildIso(next.month, next.day, next.year);
        if (built) {
          isLocalChange.current = true;
          setValue(built);
        }
        return next;
      });
    },
    [setValue],
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

      <div className="flex items-end gap-2 flex-wrap">
        {/* Month */}
        <div className="flex flex-col">
          <label htmlFor={`${id}-month`} className="text-xs text-gray-500 mb-0.5">
            Month
          </label>
          <select
            id={`${id}-month`}
            value={localParts.month}
            onChange={(e) => handlePartChange('month', e.target.value)}
            disabled={disabled}
            className={`${inputClasses} w-32`}
          >
            <option value="">--</option>
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Day */}
        <div className="flex flex-col">
          <label htmlFor={`${id}-day`} className="text-xs text-gray-500 mb-0.5">
            Day
          </label>
          <input
            id={`${id}-day`}
            type="text"
            inputMode="numeric"
            maxLength={2}
            placeholder="DD"
            value={localParts.day}
            onChange={(e) => handlePartChange('day', e.target.value.replace(/\D/g, ''))}
            disabled={disabled}
            className={`${inputClasses} w-16`}
          />
        </div>

        {/* Year */}
        <div className="flex flex-col">
          <label htmlFor={`${id}-year`} className="text-xs text-gray-500 mb-0.5">
            Year
          </label>
          <input
            id={`${id}-year`}
            type="text"
            inputMode="numeric"
            maxLength={4}
            placeholder="YYYY"
            value={localParts.year}
            onChange={(e) => handlePartChange('year', e.target.value.replace(/\D/g, ''))}
            disabled={disabled}
            className={`${inputClasses} w-20`}
          />
        </div>

        {showEstimated && (
          <div className="flex items-center gap-1.5 pb-0.5">
            <input
              id={`${id}-estimated`}
              type="checkbox"
              checked={estimated === true}
              onChange={(e) => setEstimated(e.target.checked)}
              disabled={disabled}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor={`${id}-estimated`} className="text-xs text-gray-600">
              Estimated
            </label>
          </div>
        )}
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

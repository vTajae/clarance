'use client';

import { useCallback, useId, useRef, useState } from 'react';
import { useFieldValue } from '@/lib/state/hooks/use-field-value';
import type { BaseFieldProps } from '@/lib/types/form';

type SSNFieldProps = BaseFieldProps;

export function SSNField({
  semanticKey,
  label,
  required = false,
  disabled = false,
  helpText,
  error,
}: SSNFieldProps) {
  const id = useId();
  const [value, setValue] = useFieldValue(semanticKey);

  // Split stored digits-only value into 3 segments
  const digits = (typeof value === 'string' ? value : '').replace(/\D/g, '');
  const seg1 = digits.slice(0, 3);
  const seg2 = digits.slice(3, 5);
  const seg3 = digits.slice(5, 9);

  // Visibility toggle
  const [visible, setVisible] = useState(false);

  // Refs for auto-tab
  const ref1 = useRef<HTMLInputElement>(null);
  const ref2 = useRef<HTMLInputElement>(null);
  const ref3 = useRef<HTMLInputElement>(null);

  const updateValue = useCallback(
    (s1: string, s2: string, s3: string) => {
      const combined = `${s1}${s2}${s3}`;
      setValue(combined || null);
    },
    [setValue],
  );

  const handleSeg1 = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, '').slice(0, 3);
      updateValue(raw, seg2, seg3);
      if (raw.length === 3) ref2.current?.focus();
    },
    [seg2, seg3, updateValue],
  );

  const handleSeg2 = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, '').slice(0, 2);
      updateValue(seg1, raw, seg3);
      if (raw.length === 2) ref3.current?.focus();
    },
    [seg1, seg3, updateValue],
  );

  const handleSeg3 = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
      updateValue(seg1, seg2, raw);
    },
    [seg1, seg2, updateValue],
  );

  const handleKeyDown = useCallback(
    (segment: 2 | 3) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && (e.target as HTMLInputElement).value === '') {
        if (segment === 2) ref1.current?.focus();
        if (segment === 3) ref2.current?.focus();
      }
    },
    [],
  );

  const inputClasses = `
    rounded-md border px-3 py-2 text-sm text-center font-mono tracking-wider
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

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {/* Segment 1: XXX */}
          <input
            ref={ref1}
            id={`${id}-1`}
            type={visible ? 'text' : 'password'}
            inputMode="numeric"
            maxLength={3}
            value={seg1}
            onChange={handleSeg1}
            disabled={disabled}
            required={required}
            aria-label="Social Security Number first three digits"
            autoComplete="off"
            className={`w-16 ${inputClasses}`}
          />

          <span className="text-gray-400 font-bold" aria-hidden="true">
            -
          </span>

          {/* Segment 2: XX */}
          <input
            ref={ref2}
            id={`${id}-2`}
            type={visible ? 'text' : 'password'}
            inputMode="numeric"
            maxLength={2}
            value={seg2}
            onChange={handleSeg2}
            onKeyDown={handleKeyDown(2)}
            disabled={disabled}
            aria-label="Social Security Number middle two digits"
            autoComplete="off"
            className={`w-12 ${inputClasses}`}
          />

          <span className="text-gray-400 font-bold" aria-hidden="true">
            -
          </span>

          {/* Segment 3: XXXX */}
          <input
            ref={ref3}
            id={`${id}-3`}
            type={visible ? 'text' : 'password'}
            inputMode="numeric"
            maxLength={4}
            value={seg3}
            onChange={handleSeg3}
            onKeyDown={handleKeyDown(3)}
            disabled={disabled}
            aria-label="Social Security Number last four digits"
            autoComplete="off"
            className={`w-16 ${inputClasses}`}
          />
        </div>

        {/* Show/hide toggle */}
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          disabled={disabled}
          className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
          aria-label={visible ? 'Hide Social Security Number' : 'Show Social Security Number'}
        >
          {visible ? 'Hide' : 'Show'}
        </button>
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

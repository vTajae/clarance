'use client';

import { useCallback, useId } from 'react';
import { useFieldValue } from '@/lib/state/hooks/use-field-value';
import type { BaseFieldProps, FieldOption } from '@/lib/types/form';

interface RadioGroupFieldProps extends BaseFieldProps {
  options: FieldOption[];
}

export function RadioGroupField({
  semanticKey,
  label,
  required = false,
  disabled = false,
  helpText,
  error,
  options,
}: RadioGroupFieldProps) {
  const groupId = useId();
  const [value, setValue] = useFieldValue(semanticKey);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
    [setValue],
  );

  const currentValue = typeof value === 'string' ? value : '';

  return (
    <fieldset className="mb-4" aria-required={required} aria-invalid={!!error}>
      <legend className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
      </legend>

      <div className="space-y-2" role="radiogroup">
        {options.map((option) => {
          const optionId = `${groupId}-${option.value}`;
          return (
            <div key={option.value} className="flex items-center gap-2">
              <input
                id={optionId}
                type="radio"
                name={semanticKey}
                value={option.value}
                checked={currentValue === option.value}
                onChange={handleChange}
                disabled={disabled}
                className={`
                  h-4 w-4 border-gray-300 text-blue-600
                  focus:ring-2 focus:ring-blue-500
                  ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                `}
              />
              <label
                htmlFor={optionId}
                className={`text-sm text-gray-700 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </div>

      {helpText && (
        <p id={`${groupId}-help`} className="mt-1 text-xs text-gray-500">
          {helpText}
        </p>
      )}

      {error && (
        <p id={`${groupId}-error`} className="mt-1 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}

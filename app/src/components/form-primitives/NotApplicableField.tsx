'use client';

import { type ReactNode, useCallback, useId } from 'react';
import { useFieldValue } from '@/lib/state/hooks/use-field-value';

interface NotApplicableFieldProps {
  /**
   * Semantic key for the "does not apply" toggle.
   * Stores a boolean value in the Jotai atom.
   */
  semanticKey: string;
  /** Label for the "Does Not Apply" checkbox. */
  label?: string;
  /** Whether the parent control is disabled. */
  disabled?: boolean;
  /** The wrapped field(s) that are disabled when N/A is checked. */
  children: ReactNode;
}

export function NotApplicableField({
  semanticKey,
  label = 'Does Not Apply',
  disabled = false,
  children,
}: NotApplicableFieldProps) {
  const id = useId();
  const [notApplicable, setNotApplicable] = useFieldValue(semanticKey);

  const isNA = notApplicable === true;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNotApplicable(e.target.checked);
    },
    [setNotApplicable],
  );

  return (
    <div className="mb-4">
      {/* N/A checkbox */}
      <div className="flex items-center gap-2 mb-2">
        <input
          id={id}
          type="checkbox"
          checked={isNA}
          onChange={handleChange}
          disabled={disabled}
          className={`
            h-4 w-4 rounded border-gray-300 text-blue-600
            focus:ring-2 focus:ring-blue-500
            ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          `}
        />
        <label
          htmlFor={id}
          className={`text-sm font-medium text-gray-700 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {label}
        </label>
      </div>

      {/* Wrapped children -- visually muted and non-interactive when N/A */}
      <div
        className={isNA ? 'opacity-40 pointer-events-none select-none' : ''}
        aria-disabled={isNA}
      >
        {children}
      </div>
    </div>
  );
}

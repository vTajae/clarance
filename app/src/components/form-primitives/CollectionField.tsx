'use client';

import { type ReactNode, useCallback, useId, useState } from 'react';
import type { BaseFieldProps } from '@/lib/types/form';

interface CollectionFieldProps extends Omit<BaseFieldProps, 'semanticKey'> {
  /** Base semantic key prefix. Each entry gets `{semanticKey}[{index}]`. */
  semanticKey: string;
  /** Maximum number of entries allowed. */
  maxEntries?: number;
  /** Minimum number of entries (prevents removal below this count). */
  minEntries?: number;
  /**
   * Render function called for each entry.
   * Receives the 0-based index so child fields can construct their own
   * semantic keys (e.g. `{semanticKey}[{index}].lastName`).
   */
  renderEntry: (index: number) => ReactNode;
  /** Label for the add button. */
  addLabel?: string;
}

export function CollectionField({
  semanticKey,
  label,
  required = false,
  disabled = false,
  helpText,
  error,
  maxEntries,
  minEntries = 0,
  renderEntry,
  addLabel = 'Add another entry',
}: CollectionFieldProps) {
  const id = useId();
  const [count, setCount] = useState(Math.max(minEntries, 1));

  const canAdd = maxEntries == null || count < maxEntries;
  const canRemove = count > minEntries;

  const handleAdd = useCallback(() => {
    if (canAdd) setCount((c) => c + 1);
  }, [canAdd]);

  const handleRemove = useCallback(() => {
    if (canRemove) setCount((c) => Math.max(minEntries, c - 1));
  }, [canRemove, minEntries]);

  return (
    <fieldset className="mb-6" aria-invalid={!!error}>
      <legend className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
      </legend>

      {helpText && (
        <p id={`${id}-help`} className="mb-3 text-xs text-gray-500">
          {helpText}
        </p>
      )}

      <div className="space-y-4">
        {Array.from({ length: count }, (_, index) => (
          <div
            key={index}
            className="relative rounded-md border border-gray-200 bg-gray-50 p-4"
          >
            {/* Entry header */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">
                Entry {index + 1}
              </span>
              {canRemove && !disabled && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="text-sm text-red-500 hover:text-red-700 focus:outline-none focus:underline"
                  aria-label={`Remove entry ${index + 1}`}
                >
                  Remove
                </button>
              )}
            </div>

            {/* Entry content */}
            {renderEntry(index)}
          </div>
        ))}
      </div>

      {/* Add button */}
      {canAdd && !disabled && (
        <button
          type="button"
          onClick={handleAdd}
          className="
            mt-3 inline-flex items-center gap-1.5 rounded-md border border-blue-600
            bg-white px-4 py-2 text-sm font-medium text-blue-600
            hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
            transition-colors
          "
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {addLabel}
        </button>
      )}

      {maxEntries != null && (
        <p className="mt-1 text-xs text-gray-400">
          {count} of {maxEntries} entries
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

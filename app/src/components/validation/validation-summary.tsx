'use client';

// ---------------------------------------------------------------------------
// Validation Summary — Shows errors and warnings for a section
// ---------------------------------------------------------------------------

import type { FieldError } from '@/lib/state/hooks/use-section-validation';

interface ValidationSummaryProps {
  errors: FieldError[];
  className?: string;
}

/**
 * Displays a collapsible list of validation errors for the current section.
 * Only renders when there are actual errors.
 */
export function ValidationSummary({ errors, className = '' }: ValidationSummaryProps) {
  if (errors.length === 0) return null;

  return (
    <div
      className={`rounded-md border border-red-200 bg-red-50 p-4 ${className}`}
      role="alert"
      aria-label={`${errors.length} validation error${errors.length !== 1 ? 's' : ''}`}
    >
      <div className="flex items-center gap-2">
        <svg
          className="h-5 w-5 shrink-0 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <h3 className="text-sm font-semibold text-red-800">
          {errors.length} field{errors.length !== 1 ? 's' : ''} need{errors.length === 1 ? 's' : ''} attention
        </h3>
      </div>
      <ul className="mt-2 ml-7 list-disc space-y-1">
        {errors.slice(0, 10).map((err) => (
          <li key={err.field} className="text-sm text-red-700">
            <span className="font-medium">{err.field}</span>: {err.message}
          </li>
        ))}
        {errors.length > 10 && (
          <li className="text-sm text-red-600 italic">
            ...and {errors.length - 10} more
          </li>
        )}
      </ul>
    </div>
  );
}

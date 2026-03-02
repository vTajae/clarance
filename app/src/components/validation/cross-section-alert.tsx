'use client';

// ---------------------------------------------------------------------------
// Cross-Section Alert — Shows consistency issues between sections
// ---------------------------------------------------------------------------

interface CrossSectionIssue {
  severity: 'error' | 'warning';
  message: string;
  sections: string[];
  fields: string[];
}

interface CrossSectionAlertProps {
  issues: CrossSectionIssue[];
  className?: string;
}

/**
 * Displays cross-section consistency warnings/errors.
 * Shown at the top of the form or in the review section.
 */
export function CrossSectionAlert({ issues, className = '' }: CrossSectionAlertProps) {
  if (issues.length === 0) return null;

  const errors = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity === 'warning');

  return (
    <div className={`space-y-3 ${className}`}>
      {errors.length > 0 && (
        <div
          className="rounded-md border border-red-200 bg-red-50 p-4"
          role="alert"
        >
          <h3 className="text-sm font-semibold text-red-800">
            Cross-Section Errors
          </h3>
          <ul className="mt-2 space-y-1">
            {errors.map((issue, i) => (
              <li key={i} className="text-sm text-red-700">
                {issue.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {warnings.length > 0 && (
        <div
          className="rounded-md border border-amber-200 bg-amber-50 p-4"
          role="status"
        >
          <h3 className="text-sm font-semibold text-amber-800">
            Consistency Warnings
          </h3>
          <ul className="mt-2 space-y-1">
            {warnings.map((issue, i) => (
              <li key={i} className="text-sm text-amber-700">
                {issue.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

'use client';

import { createContext, memo, useContext, type ReactNode } from 'react';
import type { FieldDefinition } from '@/lib/field-registry/types';
import { useFieldVisibility } from '@/lib/state/hooks/use-field-visibility';

/**
 * When `true`, ConditionalWrapper renders all children regardless of
 * visibility, with a visual indicator for normally-hidden fields.
 * Used in PDF Layout audit mode to verify field positions.
 */
export const AuditModeContext = createContext(false);

interface ConditionalWrapperProps {
  field: FieldDefinition;
  children: ReactNode;
}

/**
 * Wraps a field component and hides it when `useFieldVisibility` returns false.
 *
 * - Fields without `dependsOn` pass through with zero overhead.
 * - Hidden fields return `null` (no DOM, no tab order, no screen reader).
 * - Revealed fields fade in with a CSS animation.
 * - In audit mode, hidden fields are shown at 40% opacity with a red dashed outline.
 * - Memoised to prevent re-renders from parent field list changes.
 */
function ConditionalWrapperInner({ field, children }: ConditionalWrapperProps) {
  const auditMode = useContext(AuditModeContext);
  const visible = useFieldVisibility(field);

  if (!visible && !auditMode) return null;

  // Audit mode: show hidden fields with a visual indicator
  if (!visible && auditMode) {
    return (
      <div className="opacity-40 outline-dashed outline-1 outline-red-400">
        {children}
      </div>
    );
  }

  // Fields without conditional logic — no wrapper div needed
  if (!field.dependsOn) return <>{children}</>;

  // Conditional fields — wrap with fade-in animation
  return (
    <div className="animate-[fadeIn_200ms_ease-in]">
      {children}
    </div>
  );
}

export const ConditionalWrapper = memo(ConditionalWrapperInner);

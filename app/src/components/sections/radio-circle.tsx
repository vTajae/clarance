'use client';

import { memo, useCallback } from 'react';
import type { FieldDefinition, PdfRect } from '@/lib/field-registry/types';
import { useFieldValue } from '@/lib/state/hooks/use-field-value';

interface RadioCircleProps {
  field: FieldDefinition;
  /** Index into field.options[] for this widget. */
  optionIndex: number;
  widget: PdfRect & { onState: string };
}

/**
 * Renders a single radio circle at its exact PDF widget position.
 * - Selected: filled orange circle
 * - Unselected: empty circle with orange border
 * - Click: sets the Jotai atom to the option label
 * - Tooltip: shows option text, semantic key, and PDF info
 */
function RadioCircleInner({ field, optionIndex, widget }: RadioCircleProps) {
  const { semanticKey, options, label, section, pdfFieldName, pdfPage } = field;
  const [value, setValue] = useFieldValue(semanticKey);

  const optionLabel = options?.[optionIndex] ?? `Option ${optionIndex + 1}`;
  const isSelected = value === optionLabel;

  const onClick = useCallback(() => {
    // Toggle: clicking already-selected deselects (clears value)
    setValue(isSelected ? '' : optionLabel);
  }, [setValue, isSelected, optionLabel]);

  const tooltip = `${optionLabel}\n${semanticKey}\n${label}\n\nPDF: ${pdfFieldName}\nPage: ${pdfPage} | Widget: ${widget.onState}\n[${section}]`;

  return (
    <button
      type="button"
      onClick={onClick}
      title={tooltip}
      className={`block w-full h-full rounded-full border cursor-pointer
        focus:outline-none focus:ring-1 focus:ring-blue-400
        ${isSelected
          ? 'bg-orange-500 border-orange-600'
          : 'bg-white/90 border-orange-400 hover:bg-orange-100'
        }`}
      aria-label={`${label}: ${optionLabel}`}
      aria-checked={isSelected}
      role="radio"
    />
  );
}

export const RadioCircle = memo(RadioCircleInner);

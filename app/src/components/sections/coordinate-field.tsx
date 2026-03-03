'use client';

import { memo, useCallback } from 'react';
import type { FieldDefinition } from '@/lib/field-registry/types';
import { useFieldValue } from '@/lib/state/hooks/use-field-value';

/**
 * Compact, input-only field for PDF coordinate layout mode.
 * Renders just the bare input (no label, no wrapper margin) sized to fill
 * its absolutely-positioned parent container.
 *
 * Uses outline (not border) so the element's box model matches the PDF
 * widget rect exactly — border would shrink the usable text area.
 */
function CoordinateFieldInner({ field }: { field: FieldDefinition }) {
  const { semanticKey, uiFieldType, options, maxLength, label, section, pdfFieldName, repeatGroup, repeatIndex, pdfPage } = field;
  const [value, setValue] = useFieldValue(semanticKey);

  const strValue = value == null ? '' : String(value);
  const boolValue = value === true || value === 'true';

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setValue(e.target.value);
    },
    [setValue],
  );

  const onCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.checked);
    },
    [setValue],
  );

  const outlineClass = getOutlineClass(uiFieldType);

  // Rich tooltip: semantic key, label, PDF field name, repeat info, page
  const repeatInfo = repeatGroup ? `\nGroup: ${repeatGroup}[${repeatIndex}]` : '';
  const tooltip = `${semanticKey}\n${label}\n\nPDF: ${pdfFieldName}\nPage: ${pdfPage} | Type: ${uiFieldType}${repeatInfo}\n[${section}]`;

  // Outline-based styling: no border/padding so text aligns with PDF rendering.
  // font-size 10px ≈ PyMuPDF's auto-sized text in standard SF-86 widgets.
  const baseClass = `block w-full h-full border-0 p-0 ${outlineClass} bg-white/80 text-black focus:outline-none focus:ring-1 focus:ring-blue-400`;
  const textClass = 'text-[10px] leading-[1]';

  switch (uiFieldType) {
    case 'checkbox':
    case 'branch':
    case 'notApplicable':
      return (
        <label
          title={tooltip}
          className="flex items-center justify-center w-full h-full cursor-pointer"
        >
          <input
            type="checkbox"
            checked={boolValue}
            onChange={onCheck}
            className="sr-only peer"
          />
          <div
            className={`w-full h-full outline outline-1 outline-green-400 bg-white/80
              peer-checked:bg-green-500 peer-checked:outline-green-600
              peer-focus:ring-1 peer-focus:ring-blue-400
              flex items-center justify-center`}
          >
            {boolValue && (
              <svg viewBox="0 0 12 12" className="w-[70%] h-[70%] text-white">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            )}
          </div>
        </label>
      );

    case 'radio':
      return (
        <select
          value={strValue}
          onChange={onChange}
          title={tooltip}
          className={`${baseClass} ${textClass}`}
        >
          <option value="" />
          {(options ?? []).map((opt, i) => (
            <option key={i} value={opt}>
              {opt.length > 15 ? opt.slice(0, 13) + '..' : opt}
            </option>
          ))}
        </select>
      );

    case 'select':
    case 'country':
    case 'state':
      return (
        <select
          value={strValue}
          onChange={onChange}
          title={tooltip}
          className={`${baseClass} ${textClass}`}
        >
          <option value="" />
          {(options ?? []).map((opt, i) => (
            <option key={i} value={opt}>
              {opt.length > 20 ? opt.slice(0, 18) + '..' : opt}
            </option>
          ))}
        </select>
      );

    case 'date':
    case 'dateRange':
      return (
        <input
          type="text"
          value={strValue}
          onChange={onChange}
          placeholder="MM/DD/YYYY"
          title={tooltip}
          maxLength={10}
          className={`${baseClass} ${textClass}`}
        />
      );

    case 'textarea':
      return (
        <textarea
          value={strValue}
          onChange={(e) => setValue(e.target.value)}
          title={tooltip}
          maxLength={maxLength}
          className={`${baseClass} ${textClass} resize-none`}
        />
      );

    // text, telephone, phone, ssn, email, name, height, location, signature, collection
    default:
      return (
        <input
          type="text"
          value={strValue}
          onChange={onChange}
          title={tooltip}
          maxLength={maxLength}
          className={`${baseClass} ${textClass}`}
        />
      );
  }
}

/** Outline color by field type (outlines don't affect box model). */
function getOutlineClass(uiFieldType: string): string {
  switch (uiFieldType) {
    case 'checkbox':
    case 'branch':
    case 'notApplicable':
      return 'outline outline-1 outline-green-400';
    case 'radio':
      return 'outline outline-1 outline-orange-400';
    case 'select':
    case 'country':
    case 'state':
      return 'outline outline-1 outline-purple-400';
    case 'date':
    case 'dateRange':
      return 'outline outline-1 outline-teal-400';
    case 'textarea':
      return 'outline outline-1 outline-amber-400';
    default:
      return 'outline outline-1 outline-blue-400';
  }
}

export const CoordinateField = memo(CoordinateFieldInner);

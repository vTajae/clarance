/**
 * Value generators for E2E tests.
 *
 * Produces identity-encoding test values per field type, plus
 * expected PDF value computation (mirrors uiToPdf transforms).
 */

import type { FieldDefinition } from '../../src/lib/field-registry/types';

let _globalIndex = 0;

/** Reset the global field index (call between test profiles). */
export function resetFieldIndex(): void {
  _globalIndex = 0;
}

/**
 * Generate a unique, identity-encoding test value for a field.
 * Each value encodes the section + label + index for traceability.
 */
export function makeTestValue(
  field: FieldDefinition,
  index?: number,
): unknown {
  const idx = index ?? _globalIndex++;
  const ft = field.uiFieldType ?? 'text';
  const sec = field.section ?? 'unknown';
  const label = (field.label ?? '').substring(0, 20).replace(/[^a-zA-Z0-9 ]/g, '');

  switch (ft) {
    case 'text':
    case 'name':
    case 'location':
    case 'signature':
    case 'collection':
    case 'textarea': {
      let val = `${sec}|${label}|#${idx}`;
      if (field.maxLength && val.length > field.maxLength) {
        val = val.substring(0, field.maxLength);
      }
      return val;
    }
    case 'email':
      return `f${idx}@${sec}.test`;
    case 'telephone':
    case 'phone':
      return `+1555${String(idx).padStart(7, '0')}`;
    case 'ssn':
      return `900${String(idx).padStart(6, '0')}`;
    case 'date':
    case 'dateRange': {
      const d = new Date(2000, 0, 1);
      d.setDate(d.getDate() + (idx % 9000));
      return d.toISOString().split('T')[0];
    }
    case 'checkbox':
    case 'branch':
    case 'notApplicable':
      return idx % 2 === 0;
    case 'radio': {
      const opts = field.options ?? [];
      if (opts.length > 0) return opts[idx % opts.length];
      const vm = field.valueMap ?? {};
      const keys = Object.keys(vm);
      if (keys.length > 0) return keys[idx % keys.length];
      return 'YES';
    }
    case 'select':
    case 'country':
    case 'state': {
      const opts = field.options ?? [];
      if (opts.length > 0) return opts[idx % opts.length];
      if (ft === 'country') return 'United States';
      if (ft === 'state') return 'VA';
      return `Option${idx}`;
    }
    case 'height':
      return String(60 + (idx % 20));
    default: {
      let val = `${sec}|${label}|#${idx}`;
      if (field.maxLength && val.length > field.maxLength) {
        val = val.substring(0, field.maxLength);
      }
      return val;
    }
  }
}

/**
 * Compute the expected PDF value for a UI value (mirrors uiToPdf).
 * Used to verify PDF extraction results.
 */
export function computeExpectedPdfValue(
  field: FieldDefinition,
  uiValue: unknown,
): string {
  if (uiValue === '' || uiValue == null) return '';

  const ft = field.uiFieldType ?? 'text';

  switch (ft) {
    case 'date':
    case 'dateRange': {
      const m = String(uiValue).match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (!m) return String(uiValue);
      return `${m[2]}/${m[3]}/${m[1]}`;
    }
    case 'checkbox':
    case 'branch':
    case 'notApplicable':
      return uiValue ? 'Yes' : 'No';
    case 'ssn': {
      const c = String(uiValue).replace(/\D/g, '');
      if (c.length === 9) return `${c.slice(0, 3)}-${c.slice(3, 5)}-${c.slice(5)}`;
      return '';
    }
    case 'telephone':
    case 'phone': {
      const digits = String(uiValue).replace(/\D/g, '');
      const nat =
        digits.length === 11 && digits.startsWith('1')
          ? digits.slice(1)
          : digits;
      return nat.length === 10
        ? `(${nat.slice(0, 3)}) ${nat.slice(3, 6)}-${nat.slice(6)}`
        : nat;
    }
    case 'radio': {
      const vm = field.valueMap ?? {};
      return vm[String(uiValue)] ?? String(uiValue);
    }
    case 'height': {
      const inches = parseInt(String(uiValue), 10);
      if (isNaN(inches)) return String(uiValue);
      const feet = Math.floor(inches / 12);
      const rem = inches % 12;
      return `${feet}'${rem}"`;
    }
    default:
      return String(uiValue);
  }
}

/**
 * Generate test values for all fields in a section.
 * Returns { semanticKey → uiValue } map.
 */
export function makeSectionValues(
  fields: FieldDefinition[],
  startIndex = 0,
): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (let i = 0; i < fields.length; i++) {
    values[fields[i].semanticKey] = makeTestValue(fields[i], startIndex + i);
  }
  return values;
}

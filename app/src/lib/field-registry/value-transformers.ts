// ---------------------------------------------------------------------------
// SF-86 Field Registry -- Value Transformers (PDF <-> UI)
// ---------------------------------------------------------------------------

import type { FieldDefinition } from './types';

// ---------------------------------------------------------------------------
// Date helpers  (PDF: "MM/DD/YYYY"  <->  UI: "YYYY-MM-DD" ISO date string)
// ---------------------------------------------------------------------------

/** Parse a "MM/DD/YYYY" string into an ISO "YYYY-MM-DD" string. */
function pdfDateToIso(pdf: string): string {
  const match = pdf.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return pdf; // pass through if unparseable
  const [, mm, dd, yyyy] = match;
  return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
}

/** Format an ISO "YYYY-MM-DD" string to "MM/DD/YYYY". Validates date components. */
function isoToPdfDate(iso: string): string {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return iso;
  const [, yyyy, mm, dd] = match;
  const m = parseInt(mm, 10);
  const d = parseInt(dd, 10);
  const y = parseInt(yyyy, 10);
  // Basic range validation — reject obviously invalid dates
  if (m < 1 || m > 12 || d < 1 || d > 31 || y < 1900 || y > 2100) return '';
  return `${mm}/${dd}/${yyyy}`;
}

// ---------------------------------------------------------------------------
// Checkbox helpers  (PDF: "Yes"/"No" | "On"/"Off"  <->  UI: boolean)
// ---------------------------------------------------------------------------

const TRUTHY_PDF_VALUES = new Set(['Yes', 'yes', 'YES', 'On', 'on', 'ON', 'True', 'true', '1']);

function pdfCheckboxToBool(pdf: string): boolean {
  return TRUTHY_PDF_VALUES.has(pdf);
}

function boolToPdfCheckbox(val: boolean, field: FieldDefinition): string {
  // If the field has a valueMap, try to honour it for the boolean case
  if (field.valueMap) {
    const trueKey = Object.entries(field.valueMap).find(
      ([, v]) => TRUTHY_PDF_VALUES.has(v),
    );
    const falseKey = Object.entries(field.valueMap).find(
      ([, v]) => !TRUTHY_PDF_VALUES.has(v),
    );
    if (val && trueKey) return trueKey[1];
    if (!val && falseKey) return falseKey[1];
  }
  return val ? 'Yes' : 'No';
}

// ---------------------------------------------------------------------------
// SSN helpers  (PDF: "XXX-XX-XXXX"  <->  UI: "XXXXXXXXX" digits only)
// ---------------------------------------------------------------------------

function pdfSsnToDigits(pdf: string): string {
  return pdf.replace(/\D/g, '');
}

function digitsToPdfSsn(digits: string): string {
  const clean = digits.replace(/\D/g, '');
  if (clean.length !== 9) return ''; // Partial SSNs are invalid — return empty
  return `${clean.slice(0, 3)}-${clean.slice(3, 5)}-${clean.slice(5)}`;
}

// ---------------------------------------------------------------------------
// Phone helpers  (PDF: "(XXX) XXX-XXXX" or "XXX-XXX-XXXX"  <->  UI: "+1XXXXXXXXXX")
// ---------------------------------------------------------------------------

function pdfPhoneToUi(pdf: string): string {
  const digits = pdf.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return digits;
}

function uiPhoneToPdf(ui: string): string {
  const digits = ui.replace(/\D/g, '');
  // Strip leading country code "1" if present for 11-digit numbers
  const national = digits.length === 11 && digits.startsWith('1')
    ? digits.slice(1)
    : digits;
  if (national.length === 10) {
    return `(${national.slice(0, 3)}) ${national.slice(3, 6)}-${national.slice(6)}`;
  }
  // Non-US numbers: return digits as-is (SF-86 international phone fields
  // accept free-form text, so we preserve the number rather than lose it).
  return digits;
}

// ---------------------------------------------------------------------------
// Height helpers  (PDF: "5'10\""  <->  UI: numeric inches e.g. 70)
// ---------------------------------------------------------------------------

function pdfHeightToInches(pdf: string): number | string {
  const match = pdf.match(/(\d+)['']\s*(\d+)/);
  if (!match) return pdf;
  return parseInt(match[1], 10) * 12 + parseInt(match[2], 10);
}

function inchesToPdfHeight(inches: number): string {
  const feet = Math.floor(inches / 12);
  const remaining = inches % 12;
  return `${feet}'${remaining}"`;
}

// ---------------------------------------------------------------------------
// Generic valueMap transformer
// ---------------------------------------------------------------------------

/**
 * Reverse-lookup a PDF value in the field's `valueMap` to find its UI key.
 * Falls back to the raw PDF value if no mapping matches.
 */
function reverseValueMap(
  field: FieldDefinition,
  pdfValue: string,
): string {
  if (!field.valueMap) return pdfValue;
  for (const [uiKey, mappedPdf] of Object.entries(field.valueMap)) {
    if (mappedPdf === pdfValue) return uiKey;
  }
  return pdfValue;
}

/**
 * Forward-lookup a UI value in the field's `valueMap` to find its PDF value.
 * Falls back to the stringified UI value if no mapping matches.
 *
 * Uses exact match first, then a trim+case-insensitive fallback to handle
 * registry options with trailing whitespace (e.g. "YES " vs "YES").
 */
function forwardValueMap(
  field: FieldDefinition,
  uiValue: string,
): string {
  if (!field.valueMap) return uiValue;
  // Exact match (fast path)
  if (field.valueMap[uiValue] !== undefined) return field.valueMap[uiValue];
  // Trim+case-insensitive fallback
  const normalised = uiValue.trim().toLowerCase();
  for (const [key, val] of Object.entries(field.valueMap)) {
    if (key.trim().toLowerCase() === normalised) return val;
  }
  return uiValue;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Convert a raw PDF string value to the UI representation used in Jotai atoms
 * and React Hook Form.
 *
 * The conversion strategy is chosen based on the field's `uiFieldType` and,
 * where applicable, its `valueMap`.
 */
export function pdfToUi(field: FieldDefinition, pdfValue: string): unknown {
  // Empty / null pass-through
  if (pdfValue === '' || pdfValue == null) return '';

  // 1. If a valueMap exists AND the type is not one of the structured types,
  //    use the reverse map first.
  const hasDedicatedTransform = new Set<string>([
    'date',
    'dateRange',
    'checkbox',
    'ssn',
    'phone',
    'telephone',
    'height',
  ]);

  switch (field.uiFieldType) {
    case 'date':
      return pdfDateToIso(pdfValue);

    case 'dateRange': {
      // dateRange fields in the PDF are individual date fields; the UI may
      // combine them, but at the registry level each field is a single date.
      return pdfDateToIso(pdfValue);
    }

    case 'checkbox':
    case 'branch':
      return pdfCheckboxToBool(pdfValue);

    case 'ssn':
      return pdfSsnToDigits(pdfValue);

    case 'phone':
    case 'telephone':
      return pdfPhoneToUi(pdfValue);

    case 'height':
      return pdfHeightToInches(pdfValue);

    default:
      // For radio / select / text / textarea / all others, apply valueMap
      if (field.valueMap && !hasDedicatedTransform.has(field.uiFieldType)) {
        return reverseValueMap(field, pdfValue);
      }
      return pdfValue;
  }
}

/**
 * Convert a UI value back to the raw string expected by the PDF AcroForm.
 *
 * Mirrors {@link pdfToUi} in reverse.
 */
export function uiToPdf(field: FieldDefinition, uiValue: unknown): string {
  if (uiValue === '' || uiValue == null) return '';

  switch (field.uiFieldType) {
    case 'date':
    case 'dateRange':
      return isoToPdfDate(String(uiValue));

    case 'checkbox':
    case 'branch': {
      // Properly coerce string/boolean to boolean.
      // Boolean("false") and Boolean("No") both return true in JS, which is wrong.
      let boolVal: boolean;
      if (typeof uiValue === 'boolean') {
        boolVal = uiValue;
      } else if (typeof uiValue === 'string') {
        const lower = uiValue.toLowerCase();
        boolVal = lower === 'true' || lower === 'yes' || lower === 'on' || lower === '1';
      } else {
        boolVal = !!uiValue;
      }
      return boolToPdfCheckbox(boolVal, field);
    }

    case 'ssn':
      return digitsToPdfSsn(String(uiValue));

    case 'phone':
    case 'telephone':
      return uiPhoneToPdf(String(uiValue));

    case 'height':
      return typeof uiValue === 'number'
        ? inchesToPdfHeight(uiValue)
        : String(uiValue);

    default:
      if (field.valueMap) {
        return forwardValueMap(field, String(uiValue));
      }
      return String(uiValue);
  }
}

// ---------------------------------------------------------------------------
// Standalone utility re-exports (useful for tests or direct use)
// ---------------------------------------------------------------------------

export const dateTransformers = { pdfDateToIso, isoToPdfDate } as const;
export const checkboxTransformers = { pdfCheckboxToBool, boolToPdfCheckbox } as const;
export const ssnTransformers = { pdfSsnToDigits, digitsToPdfSsn } as const;
export const phoneTransformers = { pdfPhoneToUi, uiPhoneToPdf } as const;
export const heightTransformers = { pdfHeightToInches, inchesToPdfHeight } as const;

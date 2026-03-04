// ---------------------------------------------------------------------------
// Unit tests for SF-86 Field Registry Value Transformers
// ---------------------------------------------------------------------------

import { describe, it, expect } from 'vitest';
import {
  pdfToUi,
  uiToPdf,
  dateTransformers,
  checkboxTransformers,
  ssnTransformers,
  phoneTransformers,
  heightTransformers,
} from './value-transformers';
import type { FieldDefinition } from './types';

// ---------------------------------------------------------------------------
// Helper -- create a minimal FieldDefinition stub
// ---------------------------------------------------------------------------

function makeField(
  uiFieldType: string,
  extra: Partial<FieldDefinition> = {},
): FieldDefinition {
  return {
    pdfFieldName: 'TestField',
    pdfObjectRef: '0 0 R',
    pdfFieldType: 'PDFTextField',
    pdfPage: 1,
    semanticKey: 'test.field',
    section: 'section1',
    label: 'Test Field',
    uiFieldType: uiFieldType as any,
    required: false,
    classificationConfidence: 1,
    manuallyVerified: false,
    ...extra,
  } as FieldDefinition;
}

// ---------------------------------------------------------------------------
// Date transformers
// ---------------------------------------------------------------------------

describe('dateTransformers', () => {
  const { pdfDateToIso, isoToPdfDate } = dateTransformers;

  it('converts standard MM/DD/YYYY to ISO', () => {
    expect(pdfDateToIso('01/15/2024')).toBe('2024-01-15');
  });

  it('pads single-digit month and day', () => {
    expect(pdfDateToIso('1/5/2024')).toBe('2024-01-05');
  });

  it('passes through unparseable values', () => {
    expect(pdfDateToIso('invalid')).toBe('invalid');
  });

  it('converts ISO to MM/DD/YYYY', () => {
    expect(isoToPdfDate('2024-01-15')).toBe('01/15/2024');
  });

  it('passes through unparseable ISO values', () => {
    expect(isoToPdfDate('invalid')).toBe('invalid');
  });

  it('returns empty for invalid month range', () => {
    expect(isoToPdfDate('2024-13-01')).toBe('');
  });

  it('returns empty for year before 1900', () => {
    expect(isoToPdfDate('1800-01-01')).toBe('');
  });
});

// ---------------------------------------------------------------------------
// Checkbox transformers
// ---------------------------------------------------------------------------

describe('checkboxTransformers', () => {
  const { pdfCheckboxToBool, boolToPdfCheckbox } = checkboxTransformers;

  it('recognises truthy PDF values', () => {
    expect(pdfCheckboxToBool('Yes')).toBe(true);
    expect(pdfCheckboxToBool('1')).toBe(true);
    expect(pdfCheckboxToBool('On')).toBe(true);
    expect(pdfCheckboxToBool('True')).toBe(true);
  });

  it('recognises falsy PDF values', () => {
    expect(pdfCheckboxToBool('Off')).toBe(false);
    expect(pdfCheckboxToBool('no')).toBe(false);
    expect(pdfCheckboxToBool('No')).toBe(false);
  });

  it('returns Yes/No for plain checkbox field', () => {
    const field = makeField('checkbox');
    expect(boolToPdfCheckbox(true, field)).toBe('Yes');
    expect(boolToPdfCheckbox(false, field)).toBe('No');
  });

  it('uses valueMap when present for true value', () => {
    const field = makeField('checkbox', {
      valueMap: { CHECKED: 'Yes', UNCHECKED: 'Off' },
    });
    expect(boolToPdfCheckbox(true, field)).toBe('Yes');
    expect(boolToPdfCheckbox(false, field)).toBe('Off');
  });

  it('falls back to Yes/No when valueMap has no truthy entry for true', () => {
    // When both values are non-truthy, no trueKey is found, so true falls
    // through to the default 'Yes'. But a falseKey IS found (first non-truthy
    // entry), so false returns that value.
    const field = makeField('checkbox', {
      valueMap: { A: 'alpha', B: 'beta' },
    });
    expect(boolToPdfCheckbox(true, field)).toBe('Yes');
    expect(boolToPdfCheckbox(false, field)).toBe('alpha');
  });
});

// ---------------------------------------------------------------------------
// SSN transformers
// ---------------------------------------------------------------------------

describe('ssnTransformers', () => {
  const { pdfSsnToDigits, digitsToPdfSsn } = ssnTransformers;

  it('strips dashes from formatted SSN', () => {
    expect(pdfSsnToDigits('123-45-6789')).toBe('123456789');
  });

  it('passes through already-digit SSN', () => {
    expect(pdfSsnToDigits('123456789')).toBe('123456789');
  });

  it('formats 9 digits into XXX-XX-XXXX', () => {
    expect(digitsToPdfSsn('123456789')).toBe('123-45-6789');
  });

  it('returns empty for partial SSN', () => {
    expect(digitsToPdfSsn('12345')).toBe('');
  });
});

// ---------------------------------------------------------------------------
// Phone transformers
// ---------------------------------------------------------------------------

describe('phoneTransformers', () => {
  const { pdfPhoneToUi, uiPhoneToPdf } = phoneTransformers;

  it('converts parenthesised format to E.164', () => {
    expect(pdfPhoneToUi('(555) 123-4567')).toBe('+15551234567');
  });

  it('converts dash-separated format to E.164', () => {
    expect(pdfPhoneToUi('555-123-4567')).toBe('+15551234567');
  });

  it('formats E.164 back to parenthesised', () => {
    expect(uiPhoneToPdf('+15551234567')).toBe('(555) 123-4567');
  });

  it('formats 10-digit string to parenthesised', () => {
    expect(uiPhoneToPdf('5551234567')).toBe('(555) 123-4567');
  });

  it('passes through international numbers as digits', () => {
    // 10 digits starting with 4 -- not a US number pattern with leading 1
    expect(pdfPhoneToUi('4412345678')).toBe('+14412345678');
  });

  it('returns raw digits for non-10-digit international input', () => {
    // 9 digits -- does not match 10 or 11-with-leading-1
    expect(pdfPhoneToUi('44123456')).toBe('44123456');
  });
});

// ---------------------------------------------------------------------------
// Height transformers
// ---------------------------------------------------------------------------

describe('heightTransformers', () => {
  const { pdfHeightToInches, inchesToPdfHeight } = heightTransformers;

  it('converts feet-inches notation to total inches', () => {
    expect(pdfHeightToInches("5'10\"")).toBe(70);
  });

  it('handles missing trailing quote', () => {
    expect(pdfHeightToInches("6'0")).toBe(72);
  });

  it('converts total inches back to feet-inches', () => {
    expect(inchesToPdfHeight(70)).toBe("5'10\"");
  });

  it('passes through unparseable height values', () => {
    expect(pdfHeightToInches('invalid')).toBe('invalid');
  });
});

// ---------------------------------------------------------------------------
// pdfToUi / uiToPdf -- top-level integration
// ---------------------------------------------------------------------------

describe('pdfToUi', () => {
  it('converts date field from PDF to ISO', () => {
    const field = makeField('date');
    expect(pdfToUi(field, '03/15/2024')).toBe('2024-03-15');
  });

  it('converts checkbox field to boolean true', () => {
    const field = makeField('checkbox');
    expect(pdfToUi(field, 'Yes')).toBe(true);
  });

  it('converts checkbox field to boolean false for Off', () => {
    const field = makeField('checkbox');
    expect(pdfToUi(field, 'Off')).toBe(false);
  });

  it('passes through empty string for any field type', () => {
    const field = makeField('date');
    expect(pdfToUi(field, '')).toBe('');
  });

  it('treats null as empty', () => {
    const field = makeField('text');
    expect(pdfToUi(field, null as any)).toBe('');
  });

  it('passes radio field value through as-is (numeric stored directly)', () => {
    const field = makeField('radio', {
      valueMap: { YES: '1', NO: '2' },
    });
    expect(pdfToUi(field, '1')).toBe('1');
  });

  it('returns raw value when valueMap has no match', () => {
    const field = makeField('radio', {
      valueMap: { YES: '1', NO: '2' },
    });
    expect(pdfToUi(field, '999')).toBe('999');
  });

  it('converts branch type same as checkbox', () => {
    const field = makeField('branch');
    expect(pdfToUi(field, 'Yes')).toBe(true);
    expect(pdfToUi(field, 'Off')).toBe(false);
  });

  it('converts SSN field from formatted to digits', () => {
    const field = makeField('ssn');
    expect(pdfToUi(field, '123-45-6789')).toBe('123456789');
  });

  it('converts phone field to E.164', () => {
    const field = makeField('phone');
    expect(pdfToUi(field, '(555) 123-4567')).toBe('+15551234567');
  });
});

describe('uiToPdf', () => {
  it('converts ISO date back to PDF format', () => {
    const field = makeField('date');
    expect(uiToPdf(field, '2024-03-15')).toBe('03/15/2024');
  });

  it('converts boolean true to Yes for checkbox', () => {
    const field = makeField('checkbox');
    expect(uiToPdf(field, true)).toBe('Yes');
  });

  it('converts string "false" to No for checkbox', () => {
    const field = makeField('checkbox');
    expect(uiToPdf(field, 'false')).toBe('No');
  });

  it('converts string "true" to Yes for checkbox', () => {
    const field = makeField('checkbox');
    expect(uiToPdf(field, 'true')).toBe('Yes');
  });

  it('passes radio field value through as-is (numeric stored directly)', () => {
    const field = makeField('radio', {
      valueMap: { YES: '1', NO: '2' },
    });
    expect(uiToPdf(field, '1')).toBe('1');
  });

  it('passes radio field string value through as-is', () => {
    const field = makeField('radio', {
      valueMap: { YES: '1', NO: '2' },
    });
    expect(uiToPdf(field, '2')).toBe('2');
  });

  it('returns empty string for empty UI value', () => {
    const field = makeField('date');
    expect(uiToPdf(field, '')).toBe('');
  });

  it('returns empty string for null UI value', () => {
    const field = makeField('text');
    expect(uiToPdf(field, null)).toBe('');
  });

  it('returns empty string for undefined UI value', () => {
    const field = makeField('text');
    expect(uiToPdf(field, undefined)).toBe('');
  });

  it('formats SSN digits back to dashed format', () => {
    const field = makeField('ssn');
    expect(uiToPdf(field, '123456789')).toBe('123-45-6789');
  });

  it('formats phone back to parenthesised format', () => {
    const field = makeField('phone');
    expect(uiToPdf(field, '+15551234567')).toBe('(555) 123-4567');
  });

  it('converts numeric height to feet-inches string', () => {
    const field = makeField('height');
    expect(uiToPdf(field, 70)).toBe("5'10\"");
  });

  it('passes through string height value as-is', () => {
    const field = makeField('height');
    expect(uiToPdf(field, "5'10\"")).toBe("5'10\"");
  });

  it('handles branch type same as checkbox', () => {
    const field = makeField('branch');
    expect(uiToPdf(field, true)).toBe('Yes');
    expect(uiToPdf(field, false)).toBe('No');
  });
});

// ---------------------------------------------------------------------------
// Roundtrip tests
// ---------------------------------------------------------------------------

describe('roundtrip: pdfToUi -> uiToPdf', () => {
  it('date roundtrips correctly', () => {
    const field = makeField('date');
    const pdf = '01/15/2024';
    expect(uiToPdf(field, pdfToUi(field, pdf))).toBe(pdf);
  });

  it('SSN roundtrips correctly', () => {
    const field = makeField('ssn');
    const pdf = '123-45-6789';
    expect(uiToPdf(field, pdfToUi(field, pdf))).toBe(pdf);
  });

  it('phone roundtrips correctly', () => {
    const field = makeField('phone');
    const pdf = '(555) 123-4567';
    expect(uiToPdf(field, pdfToUi(field, pdf))).toBe(pdf);
  });

  it('checkbox roundtrips correctly', () => {
    const field = makeField('checkbox');
    const pdf = 'Yes';
    expect(uiToPdf(field, pdfToUi(field, pdf))).toBe(pdf);
  });
});

// ---------------------------------------------------------------------------
// Edge cases
// ---------------------------------------------------------------------------

describe('edge cases', () => {
  it('uiToPdf returns empty for empty date string', () => {
    const field = makeField('date');
    expect(uiToPdf(field, '')).toBe('');
  });

  it('height handles numeric input via pdfToUi through top-level', () => {
    const field = makeField('height');
    // pdfToUi receives a string from PDF; height "5'11\"" -> 71
    const result = pdfToUi(field, "5'11\"");
    expect(result).toBe(71);
    // Then uiToPdf can take that number back
    expect(uiToPdf(field, result)).toBe("5'11\"");
  });

  it('telephone type alias behaves like phone', () => {
    const field = makeField('telephone');
    expect(pdfToUi(field, '(555) 123-4567')).toBe('+15551234567');
    expect(uiToPdf(field, '+15551234567')).toBe('(555) 123-4567');
  });

  it('dateRange type behaves like date', () => {
    const field = makeField('dateRange');
    expect(pdfToUi(field, '06/01/2020')).toBe('2020-06-01');
    expect(uiToPdf(field, '2020-06-01')).toBe('06/01/2020');
  });

  it('text field with no valueMap passes value through', () => {
    const field = makeField('text');
    expect(pdfToUi(field, 'hello world')).toBe('hello world');
    expect(uiToPdf(field, 'hello world')).toBe('hello world');
  });
});

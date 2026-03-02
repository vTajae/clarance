/**
 * Comprehensive Faker.js round-trip test for all 6,197 SF-86 fields.
 * 
 * Generates realistic fake data for each field type, sends through
 * the Next.js export API (semantic keys → uiToPdf → PDF fill),
 * extracts from the resulting PDF, and compares every value.
 */

import { faker } from '@faker-js/faker';
import { readFileSync, writeFileSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REGISTRY_PATH = join(__dirname, '../app/src/lib/field-registry/field-registry.json');
const NEXTJS_API = 'http://localhost:3000/api/pdf/export';
const PDF_SERVICE = 'http://localhost:8001/extract-fields';

// Deterministic seed for reproducible tests
faker.seed(42);

// Load registry
const registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'));
console.log(`Loaded ${registry.length} field definitions`);

// ─── Generate realistic fake values by field type ───────────────────────────

function generateFakeValue(field) {
  const ft = field.uiFieldType || 'text';
  const maxLen = field.maxLength || 100;

  switch (ft) {
    case 'text': {
      // Generate contextual values based on label
      const label = (field.label || '').toLowerCase();
      let val;
      if (label.includes('last name') || label.includes('surname'))
        val = faker.person.lastName();
      else if (label.includes('first name') || label.includes('given name'))
        val = faker.person.firstName();
      else if (label.includes('middle name'))
        val = faker.person.middleName();
      else if (label.includes('city'))
        val = faker.location.city();
      else if (label.includes('zip') || label.includes('postal'))
        val = faker.location.zipCode('#####');
      else if (label.includes('street') || label.includes('address'))
        val = faker.location.streetAddress();
      else if (label.includes('employer') || label.includes('company'))
        val = faker.company.name();
      else if (label.includes('title') || label.includes('position'))
        val = faker.person.jobTitle();
      else if (label.includes('reason'))
        val = faker.lorem.sentence(5);
      else if (label.includes('description') || label.includes('explain'))
        val = faker.lorem.sentences(2);
      else
        val = faker.lorem.words(3);
      return val.substring(0, maxLen);
    }

    case 'email':
      return faker.internet.email();

    case 'telephone':
      return `+1${faker.string.numeric(10)}`;

    case 'ssn':
      return faker.string.numeric(9);

    case 'date':
      // UI sends ISO YYYY-MM-DD
      return faker.date.between({ from: '1960-01-01', to: '2024-12-31' })
        .toISOString().split('T')[0];

    case 'checkbox':
      return faker.datatype.boolean();

    case 'radio': {
      const opts = field.options || [];
      if (opts.length > 0) return faker.helpers.arrayElement(opts);
      const vm = field.valueMap || {};
      const keys = Object.keys(vm);
      if (keys.length > 0) return faker.helpers.arrayElement(keys);
      return '1';
    }

    case 'select': {
      const opts = field.options || [];
      if (opts.length > 0) return faker.helpers.arrayElement(opts);
      return 'Option1';
    }

    case 'country':
      return faker.helpers.arrayElement([
        'United States', 'Canada', 'United Kingdom', 'Germany', 'France',
        'Japan', 'Australia', 'Mexico', 'Brazil', 'India',
      ]);

    case 'state':
      return faker.location.state();

    default:
      return `test-${ft}`;
  }
}

// Generate values for all fields
const testValues = {};
const expectedPdfValues = {};

for (const field of registry) {
  const val = generateFakeValue(field);
  testValues[field.semanticKey] = val;
  
  // Compute expected PDF value (what uiToPdf should produce)
  const ft = field.uiFieldType || 'text';
  let expected;
  switch (ft) {
    case 'date': {
      const [y, m, d] = String(val).split('-');
      expected = `${m}/${d}/${y}`;
      break;
    }
    case 'checkbox':
      expected = val ? 'Yes' : 'No';
      break;
    case 'ssn': {
      const clean = String(val).replace(/\D/g, '');
      expected = `${clean.slice(0, 3)}-${clean.slice(3, 5)}-${clean.slice(5)}`;
      break;
    }
    case 'telephone': {
      const digits = String(val).replace(/\D/g, '');
      const nat = digits.length === 11 && digits.startsWith('1')
        ? digits.slice(1) : digits;
      expected = nat.length === 10
        ? `(${nat.slice(0, 3)}) ${nat.slice(3, 6)}-${nat.slice(6)}`
        : nat;
      break;
    }
    case 'radio': {
      const vm = field.valueMap || {};
      expected = vm[String(val)] ?? String(val);
      break;
    }
    default:
      expected = String(val);
  }
  expectedPdfValues[field.pdfFieldName] = expected;
}

console.log(`Generated ${Object.keys(testValues).length} fake values`);

// ─── Send to Next.js export API ─────────────────────────────────────────────

console.log('Sending to Next.js export API...');
const exportResp = await fetch(NEXTJS_API, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ values: testValues }),
});

if (!exportResp.ok) {
  const err = await exportResp.text();
  console.error(`Export failed (${exportResp.status}): ${err}`);
  process.exit(1);
}

const pdfBuffer = Buffer.from(await exportResp.arrayBuffer());
console.log(`  Received ${pdfBuffer.length.toLocaleString()} bytes`);

// Save temp PDF
const tmpPath = '/tmp/faker-round-trip.pdf';
writeFileSync(tmpPath, pdfBuffer);

// ─── Extract fields from filled PDF ─────────────────────────────────────────

console.log('Extracting fields from filled PDF...');
const formData = new FormData();
formData.append('file', new Blob([pdfBuffer], { type: 'application/pdf' }), 'test.pdf');

const extractResp = await fetch(PDF_SERVICE, {
  method: 'POST',
  body: formData,
});

const extractData = await extractResp.json();
const extracted = extractData.fields || {};
console.log(`  Extracted ${Object.keys(extracted).length} fields`);

// ─── Compare ────────────────────────────────────────────────────────────────

const results = {};
let totalSent = 0, totalMatched = 0, totalMismatched = 0;

for (const field of registry) {
  const ft = field.uiFieldType || 'text';
  if (!results[ft]) results[ft] = { sent: 0, matched: 0, mismatched: [] };
  
  const expected = expectedPdfValues[field.pdfFieldName] || '';
  const got = String(extracted[field.pdfFieldName] || '').trim();
  
  results[ft].sent++;
  totalSent++;
  
  // Compare (strip trailing whitespace, case-insensitive for edge cases)
  const expTrimmed = expected.trim();
  if (got === expTrimmed || got.toLowerCase() === expTrimmed.toLowerCase()) {
    results[ft].matched++;
    totalMatched++;
  } else {
    results[ft].mismatched.push({
      key: field.semanticKey,
      pdfName: field.pdfFieldName,
      label: field.label,
      expected: expTrimmed,
      got,
    });
    totalMismatched++;
  }
}

// ─── Report ─────────────────────────────────────────────────────────────────

console.log();
console.log('═'.repeat(75));
console.log('FAKER.JS ROUND-TRIP TEST — Realistic Data Through Full Pipeline');
console.log('═'.repeat(75));

for (const ft of Object.keys(results).sort()) {
  const r = results[ft];
  const rate = r.sent > 0 ? (r.matched / r.sent * 100).toFixed(1) : '0.0';
  const mm = r.mismatched.length;
  console.log(`  ${ft.padEnd(12)} ${String(r.sent).padStart(5)} sent  ${String(r.matched).padStart(5)} matched  ${String(mm).padStart(4)} mismatched  ${rate.padStart(6)}%`);
}

const totalRate = totalSent > 0 ? (totalMatched / totalSent * 100).toFixed(1) : '0.0';
console.log('─'.repeat(75));
console.log(`  ${'TOTAL'.padEnd(12)} ${String(totalSent).padStart(5)} sent  ${String(totalMatched).padStart(5)} matched  ${String(totalMismatched).padStart(4)} mismatched  ${totalRate.padStart(6)}%`);
console.log('═'.repeat(75));

// Show mismatches
for (const ft of Object.keys(results).sort()) {
  const mm = results[ft].mismatched;
  if (mm.length > 0) {
    console.log(`\n  Mismatches for ${ft} (${mm.length} total, showing first 5):`);
    for (const m of mm.slice(0, 5)) {
      console.log(`    ${m.key} [${m.label}]`);
      console.log(`      expected: ${JSON.stringify(m.expected)}`);
      console.log(`      got:      ${JSON.stringify(m.got)}`);
    }
  }
}

// Save report
const report = {
  timestamp: new Date().toISOString(),
  seed: 42,
  totalSent, totalMatched, totalMismatched,
  matchRate: parseFloat(totalRate),
  byType: Object.fromEntries(
    Object.entries(results).map(([k, v]) => [k, {
      sent: v.sent, matched: v.matched,
      mismatched: v.mismatched.slice(0, 20),
    }])
  ),
};
const reportPath = join(__dirname, 'faker-round-trip-report.json');
writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`\nReport saved to ${reportPath}`);

// Cleanup
try { unlinkSync(tmpPath); } catch {}

// Exit with code based on results
process.exit(totalMismatched > 0 ? 1 : 0);

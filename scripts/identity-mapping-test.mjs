/**
 * Identity-Encoding Mapping Validation Test
 *
 * Instead of random faker data, each field gets a value that encodes its own identity:
 *   "SEC:personalInfo|KEY:lastName|PDF:TextField11[0]"
 *
 * This means:
 * - If a PDF field contains the RIGHT identity string → mapping is correct
 * - If a PDF field contains the WRONG identity string → we know exactly which
 *   field's value leaked into the wrong place
 * - If a PDF field is empty → the value was lost in the pipeline
 *
 * Tests ALL 6,197 fields through the full Next.js export API pipeline.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REGISTRY_PATH = join(__dirname, '../app/src/lib/field-registry/field-registry.json');
const NEXTJS_API = 'http://localhost:3000/api/pdf/export';
const PDF_SERVICE = 'http://localhost:8001/extract-fields';

// ─── Load registry ──────────────────────────────────────────────────────────

const registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'));
console.log(`Loaded ${registry.length} field definitions`);

// Build lookup maps
const byPdfName = new Map();
const bySemKey = new Map();
for (const f of registry) {
  byPdfName.set(f.pdfFieldName, f);
  bySemKey.set(f.semanticKey, f);
}

// ─── Generate identity-encoding values ──────────────────────────────────────

/**
 * Create a unique value that encodes the field's identity.
 * The value format depends on the field type so it passes validation.
 */
function makeIdentityValue(field, index) {
  const ft = field.uiFieldType || 'text';
  const sec = field.section || 'unknown';
  // Short PDF name for readability (last segment)
  const pdfShort = field.pdfFieldName.split('.').pop() || field.pdfFieldName;
  const label = (field.label || '').substring(0, 30).replace(/[^a-zA-Z0-9 ]/g, '');

  switch (ft) {
    case 'text':
    case 'email':
    case 'country':
    case 'state': {
      // Identity string: "SEC:section|FLD:label|PDF:pdfName|#index"
      let val = `${sec}|${label}|${pdfShort}|#${index}`;
      if (field.maxLength && val.length > field.maxLength) {
        val = val.substring(0, field.maxLength);
      }
      if (ft === 'email') {
        // Must be valid email format — encode identity in local part
        val = `f${index}.${sec}@test.dev`;
      }
      return val;
    }

    case 'telephone':
      // UI sends +1XXXXXXXXXX — encode index in last 7 digits
      // Pad index to 7 digits, prefix with +1555
      return `+1555${String(index).padStart(7, '0')}`;

    case 'ssn':
      // UI sends 9 digits — encode index in digits
      // Use 900XXXXXX pattern (900 prefix + 6-digit index)
      return `900${String(index).padStart(6, '0')}`;

    case 'date':
      // UI sends YYYY-MM-DD — encode index in the date
      // Year 2000 + index/365, month/day from remainder
      const baseDate = new Date(2000, 0, 1);
      baseDate.setDate(baseDate.getDate() + (index % 9000));
      return baseDate.toISOString().split('T')[0];

    case 'checkbox':
      // Alternate true/false based on index parity
      return index % 2 === 0;

    case 'radio': {
      const opts = field.options || [];
      if (opts.length > 0) return opts[index % opts.length];
      const vm = field.valueMap || {};
      const keys = Object.keys(vm);
      if (keys.length > 0) return keys[index % keys.length];
      return '1';
    }

    case 'select': {
      const opts = field.options || [];
      if (opts.length > 0) return opts[index % opts.length];
      return `Option${index}`;
    }

    default:
      return `${sec}|${pdfShort}|#${index}`;
  }
}

// Generate all values
const testValues = {};
const expectedByPdfName = {}; // What we expect to find in each PDF field

let idx = 0;
for (const field of registry) {
  const val = makeIdentityValue(field, idx);
  testValues[field.semanticKey] = val;

  // Compute expected PDF value after uiToPdf transform
  const ft = field.uiFieldType || 'text';
  let expectedPdf;

  switch (ft) {
    case 'date': {
      const [y, m, d] = String(val).split('-');
      expectedPdf = `${m}/${d}/${y}`;
      break;
    }
    case 'checkbox':
      expectedPdf = val ? 'Yes' : 'No';
      break;
    case 'ssn': {
      const c = String(val).replace(/\D/g, '');
      expectedPdf = `${c.slice(0, 3)}-${c.slice(3, 5)}-${c.slice(5)}`;
      break;
    }
    case 'telephone': {
      const digits = String(val).replace(/\D/g, '');
      const nat = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
      expectedPdf = nat.length === 10
        ? `(${nat.slice(0, 3)}) ${nat.slice(3, 6)}-${nat.slice(6)}`
        : nat;
      break;
    }
    case 'radio': {
      const vm = field.valueMap || {};
      expectedPdf = vm[String(val)] ?? String(val);
      break;
    }
    default:
      expectedPdf = String(val);
  }

  expectedByPdfName[field.pdfFieldName] = {
    semanticKey: field.semanticKey,
    section: field.section,
    label: field.label,
    uiFieldType: ft,
    sentUiValue: val,
    expectedPdfValue: expectedPdf,
    index: idx,
  };

  idx++;
}

console.log(`Generated ${Object.keys(testValues).length} identity-encoding values`);

// ─── Export through Next.js API ─────────────────────────────────────────────

console.log('\n[Step 1] Sending ALL values to Next.js /api/pdf/export...');
const t0 = Date.now();

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
const exportTime = ((Date.now() - t0) / 1000).toFixed(1);
console.log(`  Received ${pdfBuffer.length.toLocaleString()} bytes in ${exportTime}s`);

// Save for manual inspection
const outPath = '/tmp/sf86-identity-test.pdf';
writeFileSync(outPath, pdfBuffer);
console.log(`  Saved to ${outPath}`);

// ─── Extract from filled PDF ────────────────────────────────────────────────

console.log('\n[Step 2] Extracting fields from filled PDF...');
const t1 = Date.now();

const formData = new FormData();
formData.append('file', new Blob([pdfBuffer], { type: 'application/pdf' }), 'test.pdf');

const extractResp = await fetch(PDF_SERVICE, {
  method: 'POST',
  body: formData,
});

const extractData = await extractResp.json();
const extracted = extractData.fields || {};
const extractTime = ((Date.now() - t1) / 1000).toFixed(1);
console.log(`  Extracted ${Object.keys(extracted).length} fields in ${extractTime}s`);

// ─── Compare: Identity Verification ─────────────────────────────────────────

console.log('\n[Step 3] Verifying identity mapping for ALL fields...\n');

const correct = [];
const mismatched = [];
const missing = [];
const crossMapped = []; // Value found but belongs to wrong field

for (const [pdfName, info] of Object.entries(expectedByPdfName)) {
  const got = String(extracted[pdfName] || '').trim();
  const expected = info.expectedPdfValue.trim();

  if (!got) {
    missing.push({ pdfName, ...info, got: '' });
    continue;
  }

  // Check exact match (with whitespace normalization)
  if (got === expected || got.toLowerCase() === expected.toLowerCase()) {
    correct.push({ pdfName, ...info });
    continue;
  }

  // Check if the value we got belongs to a DIFFERENT field (cross-mapping)
  let crossSource = null;
  for (const [otherPdf, otherInfo] of Object.entries(expectedByPdfName)) {
    if (otherPdf === pdfName) continue;
    if (got === otherInfo.expectedPdfValue.trim()) {
      crossSource = { fromPdfName: otherPdf, fromKey: otherInfo.semanticKey, fromSection: otherInfo.section };
      break;
    }
  }

  if (crossSource) {
    crossMapped.push({ pdfName, ...info, got, crossSource });
  } else {
    mismatched.push({ pdfName, ...info, got });
  }
}

// ─── Results Report ─────────────────────────────────────────────────────────

const total = Object.keys(expectedByPdfName).length;

console.log('═'.repeat(75));
console.log('IDENTITY MAPPING VERIFICATION — Every Field Has a Unique Fingerprint');
console.log('═'.repeat(75));
console.log(`  Total fields:     ${total}`);
console.log(`  Correct:          ${correct.length}  (${(correct.length/total*100).toFixed(1)}%)`);
console.log(`  Mismatched value: ${mismatched.length}`);
console.log(`  Cross-mapped:     ${crossMapped.length}  (value from wrong field)`);
console.log(`  Missing/empty:    ${missing.length}`);
console.log('═'.repeat(75));

// Breakdown by section
const sectionStats = {};
for (const item of [...correct, ...mismatched, ...crossMapped, ...missing]) {
  const sec = item.section || 'unknown';
  if (!sectionStats[sec]) sectionStats[sec] = { total: 0, correct: 0, mismatched: 0, cross: 0, missing: 0 };
  sectionStats[sec].total++;
}
for (const item of correct) {
  sectionStats[item.section || 'unknown'].correct++;
}
for (const item of mismatched) {
  sectionStats[item.section || 'unknown'].mismatched++;
}
for (const item of crossMapped) {
  sectionStats[item.section || 'unknown'].cross++;
}
for (const item of missing) {
  sectionStats[item.section || 'unknown'].missing++;
}

console.log('\nBy Section:');
console.log(`  ${'Section'.padEnd(28)} ${'Total'.padStart(6)} ${'OK'.padStart(6)} ${'Mis'.padStart(6)} ${'Cross'.padStart(6)} ${'Miss'.padStart(6)}  Rate`);
console.log('  ' + '─'.repeat(73));

for (const [sec, s] of Object.entries(sectionStats).sort((a, b) => a[0].localeCompare(b[0]))) {
  const rate = s.total > 0 ? (s.correct / s.total * 100).toFixed(1) : '0.0';
  console.log(`  ${sec.padEnd(28)} ${String(s.total).padStart(6)} ${String(s.correct).padStart(6)} ${String(s.mismatched).padStart(6)} ${String(s.cross).padStart(6)} ${String(s.missing).padStart(6)}  ${rate}%`);
}

// Show cross-mapping details (most critical errors)
if (crossMapped.length > 0) {
  console.log(`\n${'!'.repeat(75)}`);
  console.log(`CROSS-MAPPING ERRORS (${crossMapped.length}) — Values ended up in wrong PDF fields:`);
  console.log(`${'!'.repeat(75)}`);
  for (const cm of crossMapped.slice(0, 20)) {
    console.log(`\n  PDF Field: ${cm.pdfName}`);
    console.log(`    Expected: ${cm.semanticKey} → "${cm.expectedPdfValue}"`);
    console.log(`    Got:      ${cm.crossSource.fromKey} → "${cm.got}"`);
    console.log(`    Source:   PDF=${cm.crossSource.fromPdfName} Section=${cm.crossSource.fromSection}`);
  }
}

// Show mismatched details
if (mismatched.length > 0) {
  console.log(`\nMISMATCHED VALUES (${mismatched.length}) — showing first 20:`);
  for (const m of mismatched.slice(0, 20)) {
    console.log(`  ${m.semanticKey} [${m.uiFieldType}]`);
    console.log(`    PDF: ${m.pdfName}`);
    console.log(`    Expected: ${JSON.stringify(m.expectedPdfValue)}`);
    console.log(`    Got:      ${JSON.stringify(m.got)}`);
  }
}

// Show missing details
if (missing.length > 0 && missing.length <= 50) {
  console.log(`\nMISSING/EMPTY VALUES (${missing.length}):`);
  for (const m of missing.slice(0, 20)) {
    console.log(`  ${m.semanticKey} [${m.uiFieldType}] → ${m.pdfName}`);
  }
}

// ─── Save full report ───────────────────────────────────────────────────────

const report = {
  timestamp: new Date().toISOString(),
  total,
  correct: correct.length,
  mismatched: mismatched.length,
  crossMapped: crossMapped.length,
  missing: missing.length,
  matchRate: parseFloat((correct.length / total * 100).toFixed(2)),
  sectionStats,
  crossMappedDetails: crossMapped,
  mismatchedDetails: mismatched.slice(0, 100),
  missingDetails: missing.slice(0, 100),
};

const reportPath = join(__dirname, 'identity-mapping-report.json');
writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`\nFull report saved to ${reportPath}`);

process.exit(crossMapped.length + mismatched.length > 0 ? 1 : 0);

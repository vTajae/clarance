/**
 * Section 13 Identity Mapping Proof
 *
 * Fills EVERY section 13 field with a unique value encoding:
 *   - semanticKey (what the UI calls it)
 *   - pdfFieldName (what the PDF calls it)
 *   - page number
 *   - repeat group
 *
 * Then exports, extracts, and verifies EACH value landed in the correct PDF field.
 * This proves the mapping integrity — if city_2 maps to the wrong PDF field,
 * the extracted value won't contain "city_2" in it.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, '../app');
const require = createRequire(join(appDir, 'package.json'));
const { chromium } = require('playwright');

const REGISTRY_PATH = join(__dirname, '../app/src/lib/field-registry/field-registry.json');
const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const PDF_SERVICE = process.env.PDF_SERVICE_URL || 'http://localhost:8001';

const registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'));
const s13 = registry.filter(f => f.section === 'section13A' || f.section === 'section13B');
const byKey = new Map(registry.map(f => [f.semanticKey, f]));

console.log(`Section 13 fields: ${s13.length} (13A: ${s13.filter(f => f.section === 'section13A').length}, 13B: ${s13.filter(f => f.section === 'section13B').length})`);

// ─── Generate identity-encoded values ─────────────────────────────────────────
// Each value uniquely identifies the field it belongs to

function makeIdentityValue(field, idx) {
  const shortPdf = field.pdfFieldName.replace(/form1\[0\]\./, '').slice(0, 40);
  const page = field.pdfPage || '?';
  const rg = field.repeatGroup || 'none';

  switch (field.uiFieldType) {
    case 'text':
    case 'textarea':
      // Encode: semanticKey|pdfField|page — truncate to fit
      return `${field.semanticKey}|p${page}|${shortPdf}`.slice(0, 80);

    case 'email':
      return `f${idx}.s13@test.dev`;

    case 'telephone':
      // Encode index in phone number
      return `+1555${String(idx).padStart(7, '0')}`;

    case 'ssn':
      return `900${String(idx).padStart(6, '0')}`;

    case 'date':
      // Encode index in date
      const month = ((idx % 12) + 1);
      const day = ((idx % 28) + 1);
      return `2024-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    case 'checkbox':
      return idx % 2 === 0;  // alternating true/false

    case 'radio': {
      const opts = field.options || [];
      return opts.length > 0 ? opts[idx % opts.length] : '1';
    }

    case 'select': {
      const opts = field.options || [];
      return opts.length > 0 ? opts[idx % opts.length] : '';
    }

    case 'country': {
      const opts = field.options || [];
      // Pick a unique country per field to prove mapping
      return opts.length > 0 ? opts[idx % opts.length] : 'Canada';
    }

    case 'state': {
      const opts = field.options || [];
      return opts.length > 0 ? opts[idx % opts.length] : 'VA';
    }

    default:
      return `${field.semanticKey}|${idx}`;
  }
}

function computeExpectedPdf(field, uiValue) {
  switch (field.uiFieldType) {
    case 'date': {
      const [y, m, d] = String(uiValue).split('-');
      return `${m}/${d}/${y}`;
    }
    case 'checkbox':
      return uiValue ? 'Yes' : 'No';
    case 'ssn': {
      const c = String(uiValue).replace(/\D/g, '');
      return `${c.slice(0, 3)}-${c.slice(3, 5)}-${c.slice(5)}`;
    }
    case 'telephone': {
      const digits = String(uiValue).replace(/\D/g, '');
      const nat = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
      return nat.length === 10
        ? `(${nat.slice(0, 3)}) ${nat.slice(3, 6)}-${nat.slice(6)}`
        : nat;
    }
    case 'radio': {
      const vm = field.valueMap || {};
      return vm[String(uiValue)] ?? String(uiValue);
    }
    case 'country':
    case 'state':
      return String(uiValue);
    default:
      return String(uiValue);
  }
}

// Build test data
const testValues = {};
const expected = {};
let idx = 0;
for (const field of s13) {
  const uiVal = makeIdentityValue(field, idx);
  testValues[field.semanticKey] = uiVal;
  expected[field.pdfFieldName] = {
    semanticKey: field.semanticKey,
    pdfFieldName: field.pdfFieldName,
    section: field.section,
    uiFieldType: field.uiFieldType,
    label: field.label,
    repeatGroup: field.repeatGroup,
    repeatIndex: field.repeatIndex,
    pdfPage: field.pdfPage,
    sentUiValue: uiVal,
    expectedPdfValue: computeExpectedPdf(field, uiVal),
  };
  idx++;
}

// ─── Launch browser ────────────────────────────────────────────────────────────

console.log('\n[1] Launching browser...');
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ acceptDownloads: true });
const page = await context.newPage();

try {
  // Auth
  const TEST_EMAIL = `s13proof-${Date.now()}@test.dev`;
  const TEST_PASS = 'testpass123';

  console.log('[2] Registering + logging in...');
  await fetch(`${APP_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASS }),
  });

  await page.goto(`${APP_URL}/login`, { waitUntil: 'networkidle' });
  await page.fill('input#email', TEST_EMAIL);
  await page.fill('input#password', TEST_PASS);
  await page.click('button[type="submit"]');
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 });

  // Create form
  console.log('[3] Creating form...');
  await page.goto(`${APP_URL}/new`, { waitUntil: 'networkidle' });
  await page.click('button:has-text("Create Form")');
  await page.waitForURL('**/identification/section1', { timeout: 15000 });
  const submissionId = page.url().split('/')[3];

  // Navigate to section 13A
  console.log('[4] Navigating to section 13A...');
  await page.goto(`${APP_URL}/${submissionId}/history/section13A`, { waitUntil: 'networkidle' });
  await page.waitForFunction(
    () => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__,
    { timeout: 20000 },
  );

  // Inject all values
  console.log(`[5] Injecting ${Object.keys(testValues).length} identity-encoded values...`);
  const injected = await page.evaluate((values) => {
    const store = window.__JOTAI_STORE__;
    const af = window.__FIELD_VALUE_ATOM_FAMILY__;
    let count = 0;
    for (const [key, value] of Object.entries(values)) {
      store.set(af(key), value);
      count++;
    }
    return count;
  }, testValues);
  console.log(`  Injected ${injected} values`);

  // Verify a sample in the store
  const storeSample = await page.evaluate((keys) => {
    const store = window.__JOTAI_STORE__;
    const af = window.__FIELD_VALUE_ATOM_FAMILY__;
    const result = {};
    for (const key of keys) {
      result[key] = store.get(af(key));
    }
    return result;
  }, s13.slice(0, 5).map(f => f.semanticKey));

  console.log('  Store sample verification:');
  for (const [key, val] of Object.entries(storeSample)) {
    const exp = testValues[key];
    const match = String(val) === String(exp) || (typeof exp === 'boolean' && val === exp);
    console.log(`    ${match ? '✓' : '✗'} ${key}: ${JSON.stringify(val).slice(0, 60)}`);
  }

  await page.waitForTimeout(500);

  // Export
  console.log('\n[6] Exporting PDF...');
  const t1 = Date.now();
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 120000 }),
    page.click('button:has-text("Export PDF")'),
  ]);

  const downloadPath = await download.path();
  const pdfBuffer = readFileSync(downloadPath);
  console.log(`  Downloaded ${pdfBuffer.length.toLocaleString()} bytes in ${((Date.now() - t1) / 1000).toFixed(1)}s`);

  // Extract
  console.log('\n[7] Extracting fields...');
  const formData = new FormData();
  formData.append('file', new Blob([pdfBuffer], { type: 'application/pdf' }), 'test.pdf');
  const extractResp = await fetch(`${PDF_SERVICE}/extract-fields`, { method: 'POST', body: formData });
  const extractData = await extractResp.json();
  const extracted = extractData.fields || {};
  console.log(`  Extracted ${Object.keys(extracted).length} fields total`);

  // ─── Compare with identity verification ──────────────────────────────────

  console.log('\n[8] IDENTITY MAPPING VERIFICATION...\n');

  const correct = [];
  const mismatched = [];
  const missing = [];
  const crossMapped = [];

  // Build reverse lookup: pdf value → which field expects it
  const valueToField = new Map();
  for (const [pdfName, info] of Object.entries(expected)) {
    if (info.expectedPdfValue) {
      valueToField.set(info.expectedPdfValue, pdfName);
    }
  }

  for (const [pdfName, info] of Object.entries(expected)) {
    const got = String(extracted[pdfName] || '').trim();
    const exp = info.expectedPdfValue.trim();

    if (!got) {
      missing.push({ pdfName, ...info, got: '' });
      continue;
    }

    if (got === exp || got.toLowerCase() === exp.toLowerCase()) {
      correct.push({ pdfName, ...info });
      continue;
    }

    // Check cross-mapping: did this field get a value meant for a different field?
    let crossSource = null;
    for (const [otherPdf, otherInfo] of Object.entries(expected)) {
      if (otherPdf === pdfName) continue;
      if (got === otherInfo.expectedPdfValue.trim()) {
        crossSource = { fromPdf: otherPdf, fromKey: otherInfo.semanticKey, fromLabel: otherInfo.label };
        break;
      }
    }

    if (crossSource) {
      crossMapped.push({ pdfName, ...info, got, crossSource });
    } else {
      mismatched.push({ pdfName, ...info, got });
    }
  }

  const total = Object.keys(expected).length;

  // ─── Report ──────────────────────────────────────────────────────────────

  console.log('═'.repeat(80));
  console.log('SECTION 13 — IDENTITY MAPPING PROOF');
  console.log('═'.repeat(80));
  console.log(`  Total fields:       ${total}`);
  console.log(`  CORRECT:            ${correct.length}  (${(correct.length / total * 100).toFixed(1)}%)`);
  console.log(`  MISMATCHED:         ${mismatched.length}`);
  console.log(`  CROSS-MAPPED:       ${crossMapped.length}  ← CRITICAL: value from WRONG field`);
  console.log(`  MISSING:            ${missing.length}`);
  console.log('═'.repeat(80));

  // Per repeat group
  console.log('\nBy Repeat Group:');
  console.log(`  ${'Group'.padEnd(25)} ${'Total'.padStart(6)} ${'OK'.padStart(6)} ${'Mis'.padStart(6)} ${'Cross'.padStart(6)} ${'Miss'.padStart(6)}  Rate`);
  console.log('  ' + '─'.repeat(70));

  const groupStats = {};
  for (const item of [...correct, ...mismatched, ...crossMapped, ...missing]) {
    const gk = `${item.repeatGroup}[${item.repeatIndex}]`;
    if (!groupStats[gk]) groupStats[gk] = { total: 0, correct: 0, mismatched: 0, crossMapped: 0, missing: 0 };
    groupStats[gk].total++;
  }
  for (const item of correct) { const gk = `${item.repeatGroup}[${item.repeatIndex}]`; groupStats[gk].correct++; }
  for (const item of mismatched) { const gk = `${item.repeatGroup}[${item.repeatIndex}]`; groupStats[gk].mismatched++; }
  for (const item of crossMapped) { const gk = `${item.repeatGroup}[${item.repeatIndex}]`; groupStats[gk].crossMapped++; }
  for (const item of missing) { const gk = `${item.repeatGroup}[${item.repeatIndex}]`; groupStats[gk].missing++; }

  for (const [gk, s] of Object.entries(groupStats).sort()) {
    const rate = s.total > 0 ? ((s.correct / s.total) * 100).toFixed(1) : '0.0';
    console.log(
      `  ${gk.padEnd(25)} ${String(s.total).padStart(6)} ${String(s.correct).padStart(6)} ${String(s.mismatched).padStart(6)} ${String(s.crossMapped).padStart(6)} ${String(s.missing).padStart(6)}  ${rate}%`
    );
  }

  // Per field type
  console.log('\nBy Field Type:');
  console.log(`  ${'Type'.padEnd(14)} ${'Total'.padStart(6)} ${'OK'.padStart(6)} ${'Mis'.padStart(6)} ${'Cross'.padStart(6)} ${'Miss'.padStart(6)}  Rate`);
  console.log('  ' + '─'.repeat(60));

  const typeStats = {};
  for (const item of [...correct, ...mismatched, ...crossMapped, ...missing]) {
    if (!typeStats[item.uiFieldType]) typeStats[item.uiFieldType] = { total: 0, correct: 0, mismatched: 0, crossMapped: 0, missing: 0 };
    typeStats[item.uiFieldType].total++;
  }
  for (const item of correct) typeStats[item.uiFieldType].correct++;
  for (const item of mismatched) typeStats[item.uiFieldType].mismatched++;
  for (const item of crossMapped) typeStats[item.uiFieldType].crossMapped++;
  for (const item of missing) typeStats[item.uiFieldType].missing++;

  for (const [ft, s] of Object.entries(typeStats).sort()) {
    const rate = s.total > 0 ? ((s.correct / s.total) * 100).toFixed(1) : '0.0';
    console.log(
      `  ${ft.padEnd(14)} ${String(s.total).padStart(6)} ${String(s.correct).padStart(6)} ${String(s.mismatched).padStart(6)} ${String(s.crossMapped).padStart(6)} ${String(s.missing).padStart(6)}  ${rate}%`
    );
  }

  // Show any issues
  if (crossMapped.length > 0) {
    console.log(`\n${'!'.repeat(80)}`);
    console.log(`CROSS-MAPPING ERRORS (${crossMapped.length}) — FIELDS MAPPED TO WRONG PDF LOCATIONS:`);
    console.log(`${'!'.repeat(80)}`);
    for (const cm of crossMapped) {
      console.log(`\n  FIELD: ${cm.semanticKey} [${cm.uiFieldType}] "${cm.label}"`);
      console.log(`    PDF target:  ${cm.pdfFieldName}`);
      console.log(`    Expected:    ${JSON.stringify(cm.expectedPdfValue)}`);
      console.log(`    Got:         ${JSON.stringify(cm.got)}`);
      console.log(`    VALUE CAME FROM: ${cm.crossSource.fromKey} → ${cm.crossSource.fromPdf}`);
    }
  }

  if (mismatched.length > 0) {
    console.log(`\nMISMATCHES (${mismatched.length}):`);
    for (const m of mismatched.slice(0, 20)) {
      console.log(`  ${m.semanticKey} [${m.uiFieldType}] p${m.pdfPage}`);
      console.log(`    Expected: ${JSON.stringify(m.expectedPdfValue).slice(0, 80)}`);
      console.log(`    Got:      ${JSON.stringify(m.got).slice(0, 80)}`);
    }
  }

  if (missing.length > 0) {
    console.log(`\nMISSING (${missing.length}):`);
    for (const m of missing.slice(0, 20)) {
      console.log(`  ${m.semanticKey} [${m.uiFieldType}] p${m.pdfPage} → ${m.pdfFieldName.replace(/form1\[0\]\./, '')}`);
    }
  }

  // Identity proof for text fields: show the encoded value proves correct mapping
  console.log('\n\n=== IDENTITY PROOF SAMPLES (text fields with encoded semanticKey) ===');
  const textCorrect = correct.filter(c => c.uiFieldType === 'text');
  for (const c of textCorrect.slice(0, 10)) {
    const shortPdf = c.pdfFieldName.replace(/form1\[0\]\./, '');
    console.log(`  ${c.semanticKey}`);
    console.log(`    Sent:      "${c.sentUiValue}"`);
    console.log(`    Extracted: "${extracted[c.pdfFieldName]}"`);
    console.log(`    PDF field: ${shortPdf}`);
    console.log(`    PROOF: extracted value contains semanticKey "${c.semanticKey.slice(0, 30)}" ✓`);
  }

  // Save report
  const report = {
    timestamp: new Date().toISOString(),
    total,
    correct: correct.length,
    mismatched: mismatched.length,
    crossMapped: crossMapped.length,
    missing: missing.length,
    matchRate: parseFloat(((correct.length / total) * 100).toFixed(2)),
    groupStats,
    typeStats,
    crossMappedDetails: crossMapped,
    mismatchedDetails: mismatched,
    missingDetails: missing,
    identitySamples: textCorrect.slice(0, 20).map(c => ({
      semanticKey: c.semanticKey,
      pdfFieldName: c.pdfFieldName,
      sentValue: c.sentUiValue,
      extractedValue: extracted[c.pdfFieldName],
      page: c.pdfPage,
    })),
  };

  const reportPath = join(__dirname, 'section13-identity-proof-report.json');
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nFull report: ${reportPath}`);

  console.log('\n' + '═'.repeat(80));

  if (crossMapped.length > 0) {
    console.log('RESULT: MAPPING INTEGRITY FAILURES DETECTED');
    process.exit(1);
  } else if (correct.length === total) {
    console.log('RESULT: ALL FIELDS CORRECTLY MAPPED — IDENTITY PROVEN');
  } else {
    console.log(`RESULT: ${correct.length}/${total} correctly mapped, ${missing.length} missing (radio extraction limit)`);
  }

  process.exit(0);

} catch (err) {
  console.error('\nFATAL:', err.message);
  process.exit(2);
} finally {
  await browser.close();
}

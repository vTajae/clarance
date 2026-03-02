/**
 * Multi-Section Identity Mapping Proof
 *
 * Tests sections 14, 15, and 21 with unique identity-encoded values.
 * Each text field value encodes its semanticKey + pdfFieldName + page number,
 * proving the exact mapping is correct even for duplicate-labeled fields.
 *
 * Usage:
 *   node scripts/section-identity-proof.mjs [section14,section15,section21]
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

// Parse target sections from CLI or default
const targetSections = (process.argv[2] || 'section14,section15,section21').split(',').map(s => s.trim());

const registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'));
const targetFields = registry.filter(f => targetSections.includes(f.section));

console.log(`Target sections: ${targetSections.join(', ')}`);
console.log(`Total fields to test: ${targetFields.length}`);
for (const sec of targetSections) {
  const count = targetFields.filter(f => f.section === sec).length;
  console.log(`  ${sec}: ${count} fields`);
}

// ─── Generate identity-encoded values ─────────────────────────────────────────

function makeIdentityValue(field, idx) {
  const shortPdf = field.pdfFieldName.replace(/form1\[0\]\./, '').slice(0, 40);
  const page = field.pdfPage || '?';

  switch (field.uiFieldType) {
    case 'text':
    case 'textarea':
      return `${field.semanticKey}|p${page}|${shortPdf}`.slice(0, 80);
    case 'email':
      return `f${idx}.test@test.dev`;
    case 'telephone':
      return `+1555${String(idx).padStart(7, '0')}`;
    case 'ssn':
      return `900${String(idx).padStart(6, '0')}`;
    case 'date': {
      const month = ((idx % 12) + 1);
      const day = ((idx % 28) + 1);
      return `2024-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    case 'checkbox':
      return idx % 2 === 0;
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
for (const field of targetFields) {
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

// ─── Browser test ──────────────────────────────────────────────────────────────

console.log('\n[1] Launching browser...');
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ acceptDownloads: true });
const page = await context.newPage();

try {
  const TEST_EMAIL = `proof-${Date.now()}@test.dev`;
  const TEST_PASS = 'testpass123';

  console.log('[2] Registering + logging in...');
  await fetch(`${APP_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASS }),
  });

  await page.goto(`${APP_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.fill('input#email', TEST_EMAIL);
  await page.fill('input#password', TEST_PASS);
  await page.click('button[type="submit"]');
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 30000 });

  console.log('[3] Creating form...');
  await page.goto(`${APP_URL}/new`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.click('button:has-text("Create Form")');
  await page.waitForURL('**/identification/section1', { timeout: 30000 });
  const submissionId = page.url().split('/')[3];

  // Navigate to a section page to get Jotai store loaded
  const sectionRoutes = {
    section1: 'identification/section1',
    section3: 'identification/section3',
    section5: 'identification/section5',
    section6: 'identification/section6',
    section7: 'identification/section7',
    section8: 'citizenship/section8',
    section9: 'citizenship/section9',
    section10: 'citizenship/section10',
    section11: 'history/section11',
    section12: 'history/section12',
    section13A: 'history/section13A',
    section13B: 'history/section13B',
    section13C: 'history/section13C',
    section14: 'military/section14',
    section15: 'military/section15',
    section16: 'relationships/section16',
    section17: 'relationships/section17',
    section18: 'relationships/section18',
    section19: 'foreign/section19',
    section20A: 'foreign/section20A',
    section20B: 'foreign/section20B',
    section20C: 'foreign/section20C',
    section21: 'psychological/section21',
    section22: 'legal/section22',
    section23: 'substance/section23',
    section24: 'substance/section24',
    section25: 'legal/section25',
    section26: 'financial/section26',
    section27: 'review/section27',
    section28: 'legal/section28',
    section29: 'review/section29',
    section30: 'review/section30',
  };

  // Navigate to first target section to get store
  const firstRoute = sectionRoutes[targetSections[0]];
  console.log(`[4] Navigating to ${firstRoute}...`);
  await page.goto(`${APP_URL}/${submissionId}/${firstRoute}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(
    () => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__,
    { timeout: 20000 },
  );

  // Inject ALL values across all target sections
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

  // ─── Compare ─────────────────────────────────────────────────────────────

  console.log('\n[8] IDENTITY MAPPING VERIFICATION...\n');

  const correct = [];
  const mismatched = [];
  const missing = [];
  const crossMapped = [];

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

    // Cross-mapping check
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
  console.log(`IDENTITY MAPPING PROOF — Sections ${targetSections.join(', ')}`);
  console.log('═'.repeat(80));
  console.log(`  Total fields:       ${total}`);
  console.log(`  CORRECT:            ${correct.length}  (${(correct.length / total * 100).toFixed(1)}%)`);
  console.log(`  MISMATCHED:         ${mismatched.length}`);
  console.log(`  CROSS-MAPPED:       ${crossMapped.length}  ← value from WRONG field`);
  console.log(`  MISSING:            ${missing.length}`);
  console.log('═'.repeat(80));

  // Per section
  console.log('\nBy Section:');
  console.log(`  ${'Section'.padEnd(15)} ${'Total'.padStart(6)} ${'OK'.padStart(6)} ${'Mis'.padStart(6)} ${'Cross'.padStart(6)} ${'Miss'.padStart(6)}  Rate`);
  console.log('  ' + '─'.repeat(65));

  for (const sec of targetSections) {
    const secCorrect = correct.filter(c => c.section === sec).length;
    const secMis = mismatched.filter(c => c.section === sec).length;
    const secCross = crossMapped.filter(c => c.section === sec).length;
    const secMiss = missing.filter(c => c.section === sec).length;
    const secTotal = secCorrect + secMis + secCross + secMiss;
    const rate = secTotal > 0 ? ((secCorrect / secTotal) * 100).toFixed(1) : '0.0';
    console.log(
      `  ${sec.padEnd(15)} ${String(secTotal).padStart(6)} ${String(secCorrect).padStart(6)} ${String(secMis).padStart(6)} ${String(secCross).padStart(6)} ${String(secMiss).padStart(6)}  ${rate}%`
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

  // Issues
  if (crossMapped.length > 0) {
    console.log(`\n${'!'.repeat(80)}`);
    console.log(`CROSS-MAPPING ERRORS (${crossMapped.length}):`);
    console.log(`${'!'.repeat(80)}`);
    for (const cm of crossMapped) {
      console.log(`  ${cm.semanticKey} [${cm.uiFieldType}] "${cm.label.slice(0, 40)}"`);
      console.log(`    PDF: ${cm.pdfFieldName.replace(/form1\[0\]\./, '')}`);
      console.log(`    Expected: ${JSON.stringify(cm.expectedPdfValue).slice(0, 60)}`);
      console.log(`    Got:      ${JSON.stringify(cm.got).slice(0, 60)}`);
      console.log(`    CAME FROM: ${cm.crossSource.fromKey}`);
    }
  }

  if (mismatched.length > 0) {
    console.log(`\nMISMATCHES (${mismatched.length}):`);
    for (const m of mismatched.slice(0, 30)) {
      console.log(`  ${m.semanticKey} [${m.uiFieldType}] p${m.pdfPage}`);
      console.log(`    Expected: ${JSON.stringify(m.expectedPdfValue).slice(0, 70)}`);
      console.log(`    Got:      ${JSON.stringify(m.got).slice(0, 70)}`);
    }
  }

  if (missing.length > 0) {
    console.log(`\nMISSING (${missing.length}):`);
    for (const m of missing.slice(0, 30)) {
      console.log(`  ${m.semanticKey} [${m.uiFieldType}] p${m.pdfPage} → ${m.pdfFieldName.replace(/form1\[0\]\./, '')}`);
    }
  }

  // Identity proof samples
  const textCorrect = correct.filter(c => c.uiFieldType === 'text');
  if (textCorrect.length > 0) {
    console.log('\n=== IDENTITY PROOF SAMPLES ===');
    for (const sec of targetSections) {
      const secSamples = textCorrect.filter(c => c.section === sec).slice(0, 5);
      if (secSamples.length === 0) continue;
      console.log(`\n  ${sec}:`);
      for (const c of secSamples) {
        const shortPdf = c.pdfFieldName.replace(/form1\[0\]\./, '');
        console.log(`    ${c.semanticKey}`);
        console.log(`      Sent:      "${c.sentUiValue.slice(0, 70)}"`);
        console.log(`      Extracted: "${String(extracted[c.pdfFieldName]).slice(0, 70)}"`);
        console.log(`      PDF field: ${shortPdf}  ✓ MATCH`);
      }
    }
  }

  // Save report
  const report = {
    timestamp: new Date().toISOString(),
    sections: targetSections,
    total,
    correct: correct.length,
    mismatched: mismatched.length,
    crossMapped: crossMapped.length,
    missing: missing.length,
    matchRate: parseFloat(((correct.length / total) * 100).toFixed(2)),
    typeStats,
    crossMappedDetails: crossMapped,
    mismatchedDetails: mismatched,
    missingDetails: missing,
  };

  const reportPath = join(__dirname, `sections-${targetSections.join('-')}-proof-report.json`);
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nReport: ${reportPath}`);
  console.log('═'.repeat(80));

  if (crossMapped.length > 0) {
    console.log('RESULT: MAPPING INTEGRITY FAILURES DETECTED');
    process.exit(1);
  } else if (correct.length === total) {
    console.log('RESULT: ALL FIELDS CORRECTLY MAPPED — IDENTITY PROVEN');
  } else {
    console.log(`RESULT: ${correct.length}/${total} mapped correctly, ${missing.length} missing`);
  }

  process.exit(0);
} catch (err) {
  console.error('\nFATAL:', err.message);
  console.error(err.stack);
  process.exit(2);
} finally {
  await browser.close();
}

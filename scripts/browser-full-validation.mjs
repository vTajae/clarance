/**
 * Browser E2E Full Validation — ALL 6,197 Fields Through Live Browser
 *
 * Flow:
 *   1. Launch Playwright browser
 *   2. Navigate to app → "Create Form" → form page with Export button
 *   3. Wait for Jotai store to be exposed on window
 *   4. Inject ALL 6,197 field values into Jotai atoms via page.evaluate()
 *   5. Click "Export PDF" → intercept download
 *   6. Send downloaded PDF to extract-fields endpoint
 *   7. Compare every extracted value against expected
 *   8. Print detailed report with per-section breakdown
 *
 * Usage (from project root):
 *   node --import=./scripts/_resolve-playwright.mjs scripts/browser-full-validation.mjs
 *   — OR —
 *   cd app && node ../scripts/browser-full-validation.mjs
 *
 * Requirements:
 *   - Next.js dev server running on localhost:3000
 *   - PDF service running on localhost:8001
 *   - Playwright installed in app/: cd app && npx playwright install chromium
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

// Resolve playwright from app/node_modules regardless of cwd
const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, '../app');
const require = createRequire(join(appDir, 'package.json'));
const { chromium } = require('playwright');

const REGISTRY_PATH = join(__dirname, '../app/src/lib/field-registry/field-registry.json');
const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const PDF_SERVICE = process.env.PDF_SERVICE_URL || 'http://localhost:8001';

// ─── Load registry ──────────────────────────────────────────────────────────

const registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'));
console.log(`Loaded ${registry.length} field definitions`);

const byPdfName = new Map();
const bySemKey = new Map();
for (const f of registry) {
  byPdfName.set(f.pdfFieldName, f);
  bySemKey.set(f.semanticKey, f);
}

// ─── Generate identity-encoding values ──────────────────────────────────────

function makeIdentityValue(field, index) {
  const ft = field.uiFieldType || 'text';
  const sec = field.section || 'unknown';
  const pdfShort = field.pdfFieldName.split('.').pop() || field.pdfFieldName;
  const label = (field.label || '').substring(0, 30).replace(/[^a-zA-Z0-9 ]/g, '');

  switch (ft) {
    case 'text': {
      let val = `${sec}|${label}|${pdfShort}|#${index}`;
      if (field.maxLength && val.length > field.maxLength) {
        val = val.substring(0, field.maxLength);
      }
      return val;
    }

    case 'email':
      return `f${index}.${sec}@test.dev`;

    case 'telephone':
      return `+1555${String(index).padStart(7, '0')}`;

    case 'ssn':
      return `900${String(index).padStart(6, '0')}`;

    case 'date': {
      const baseDate = new Date(2000, 0, 1);
      baseDate.setDate(baseDate.getDate() + (index % 9000));
      return baseDate.toISOString().split('T')[0];
    }

    case 'checkbox':
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

    case 'country': {
      const opts = field.options || [];
      if (opts.length > 0) return opts[index % opts.length];
      return 'United States';
    }

    case 'state': {
      const opts = field.options || [];
      if (opts.length > 0) return opts[index % opts.length];
      return 'VA';
    }

    default:
      return `${sec}|${pdfShort}|#${index}`;
  }
}

// Compute expected PDF value after uiToPdf transform
function computeExpectedPdfValue(field, uiValue) {
  const ft = field.uiFieldType || 'text';

  switch (ft) {
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
    default:
      return String(uiValue);
  }
}

// Generate all values
const testValues = {};
const expectedByPdfName = {};

let idx = 0;
for (const field of registry) {
  const val = makeIdentityValue(field, idx);
  testValues[field.semanticKey] = val;

  expectedByPdfName[field.pdfFieldName] = {
    semanticKey: field.semanticKey,
    section: field.section,
    label: field.label,
    uiFieldType: field.uiFieldType || 'text',
    sentUiValue: val,
    expectedPdfValue: computeExpectedPdfValue(field, val),
    index: idx,
  };

  idx++;
}

console.log(`Generated ${Object.keys(testValues).length} identity-encoding values`);

// ─── Launch browser and drive the app ───────────────────────────────────────

console.log('\n[Step 1] Launching Playwright browser...');
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ acceptDownloads: true });
const page = await context.newPage();

// Collect console errors for debugging
const consoleErrors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});

try {
  // ─── Authenticate ───────────────────────────────────────────────────────
  const TEST_EMAIL = `e2e-${Date.now()}@test.dev`;
  const TEST_PASS = 'e2eTestPass123';

  console.log('[Step 2] Registering test user...');
  // Register via API (if user exists, fall through to login)
  const regResp = await fetch(`${APP_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASS }),
  });
  const regData = await regResp.json().catch(() => ({}));
  if (regResp.ok) {
    console.log(`  Registered: ${TEST_EMAIL}`);
  } else {
    console.log(`  Registration response: ${regResp.status} ${JSON.stringify(regData)}`);
  }

  // Login via the browser UI
  console.log('[Step 3] Logging in via browser...');
  await page.goto(`${APP_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.fill('input#email', TEST_EMAIL);
  await page.fill('input#password', TEST_PASS);
  await page.click('button[type="submit"]');
  // Wait for redirect to home after login
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 });
  console.log(`  Logged in, now at: ${page.url()}`);

  // Navigate to the "New Form" page
  console.log('[Step 4] Navigating to /new...');
  await page.goto(`${APP_URL}/new`, { waitUntil: 'networkidle', timeout: 30000 });

  // Click "Create Form" button → navigates to /{uuid}/identification/section1
  console.log('[Step 5] Clicking "Create Form"...');
  await page.click('button:has-text("Create Form")');
  await page.waitForURL('**/identification/section1', { timeout: 15000 });
  console.log(`  Navigated to: ${page.url()}`);

  // Wait for the Jotai store to be exposed (set by our modified jotai-provider.tsx)
  console.log('[Step 6] Waiting for Jotai store on window...');
  await page.waitForFunction(
    () => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__,
    { timeout: 15000 },
  );
  console.log('  Jotai store found on window');

  // Inject ALL 6,197 values into the Jotai store
  console.log(`[Step 7] Injecting ${Object.keys(testValues).length} values into Jotai store...`);
  const t0 = Date.now();

  const injectResult = await page.evaluate((values) => {
    const store = window.__JOTAI_STORE__;
    const atomFamily = window.__FIELD_VALUE_ATOM_FAMILY__;
    let count = 0;
    let errors = [];
    for (const [key, value] of Object.entries(values)) {
      try {
        store.set(atomFamily(key), value);
        count++;
      } catch (e) {
        errors.push({ key, error: e.message });
      }
    }
    return { count, errors: errors.slice(0, 10) };
  }, testValues);

  // Second pass: activate ALL gate fields so every conditional field becomes visible.
  // Gates are fields referenced by other fields' `dependsOn`. Setting them to 'YES'
  // ensures all showWhen === 'YES' conditionals pass and the export includes them.
  const gateKeys = [...new Set(registry.filter(f => f.dependsOn).map(f => f.dependsOn))];
  const gateOverrides = {};
  for (const gk of gateKeys) {
    const gateDef = bySemKey.get(gk);
    // Match options starting with 'YES' (handles 'YES ', 'YES (Proceed to...)', etc.)
    const yesOption = gateDef?.options?.find(o => o.trim().toUpperCase().startsWith('YES'));
    if (gateDef && yesOption) {
      // Use exact option text for both showWhen (normalise handles case)
      // and valueMap (exact key match)
      gateOverrides[gk] = yesOption;
      testValues[gk] = yesOption;
      expectedByPdfName[gateDef.pdfFieldName] = {
        ...expectedByPdfName[gateDef.pdfFieldName],
        sentUiValue: yesOption,
        expectedPdfValue: computeExpectedPdfValue(gateDef, yesOption),
      };
    }
  }
  console.log(`  Activating ${Object.keys(gateOverrides).length} gate fields → YES...`);
  await page.evaluate((overrides) => {
    const store = window.__JOTAI_STORE__;
    const atomFamily = window.__FIELD_VALUE_ATOM_FAMILY__;
    for (const [key, value] of Object.entries(overrides)) {
      store.set(atomFamily(key), value);
    }
  }, gateOverrides);

  const injectTime = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`  Injected ${injectResult.count} values in ${injectTime}s`);
  if (injectResult.errors.length > 0) {
    console.log(`  Injection errors (first 10):`, injectResult.errors);
  }

  // Small pause to let React render
  await page.waitForTimeout(500);

  // Click "Export PDF" and capture the download
  console.log('[Step 8] Clicking "Export PDF" and waiting for download...');
  const t1 = Date.now();

  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 120000 }),
    page.click('button:has-text("Export PDF")'),
  ]);

  const downloadPath = await download.path();
  const exportTime = ((Date.now() - t1) / 1000).toFixed(1);
  const pdfBuffer = readFileSync(downloadPath);
  console.log(`  Downloaded ${pdfBuffer.length.toLocaleString()} bytes in ${exportTime}s`);

  // Save for manual inspection
  const outPath = '/tmp/sf86-browser-e2e-test.pdf';
  writeFileSync(outPath, pdfBuffer);
  console.log(`  Saved to ${outPath}`);

  // Extract fields from the downloaded PDF
  console.log('\n[Step 9] Extracting fields from filled PDF via PDF service...');
  const t2 = Date.now();

  const formData = new FormData();
  formData.append('file', new Blob([pdfBuffer], { type: 'application/pdf' }), 'test.pdf');

  const extractResp = await fetch(`${PDF_SERVICE}/extract-fields`, {
    method: 'POST',
    body: formData,
  });

  if (!extractResp.ok) {
    const errText = await extractResp.text();
    throw new Error(`Extract failed (${extractResp.status}): ${errText}`);
  }

  const extractData = await extractResp.json();
  const extracted = extractData.fields || {};
  const extractTime = ((Date.now() - t2) / 1000).toFixed(1);
  console.log(`  Extracted ${Object.keys(extracted).length} fields in ${extractTime}s`);

  // ─── Compare: Identity Verification ─────────────────────────────────────

  console.log('\n[Step 10] Verifying identity mapping for ALL fields...\n');

  const correct = [];
  const mismatched = [];
  const missing = [];
  const crossMapped = [];

  for (const [pdfName, info] of Object.entries(expectedByPdfName)) {
    const got = String(extracted[pdfName] || '').trim();
    const expected = info.expectedPdfValue.trim();

    if (!got) {
      missing.push({ pdfName, ...info, got: '' });
      continue;
    }

    // Exact match (with case-insensitive fallback)
    if (got === expected || got.toLowerCase() === expected.toLowerCase()) {
      correct.push({ pdfName, ...info });
      continue;
    }

    // Check for cross-mapping (value from a different field)
    let crossSource = null;
    for (const [otherPdf, otherInfo] of Object.entries(expectedByPdfName)) {
      if (otherPdf === pdfName) continue;
      if (got === otherInfo.expectedPdfValue.trim()) {
        crossSource = {
          fromPdfName: otherPdf,
          fromKey: otherInfo.semanticKey,
          fromSection: otherInfo.section,
        };
        break;
      }
    }

    if (crossSource) {
      crossMapped.push({ pdfName, ...info, got, crossSource });
    } else {
      mismatched.push({ pdfName, ...info, got });
    }
  }

  // ─── Results Report ─────────────────────────────────────────────────────

  const total = Object.keys(expectedByPdfName).length;

  console.log('\n' + '='.repeat(75));
  console.log('BROWSER E2E VALIDATION \u2014 ALL 6,197 FIELDS THROUGH LIVE BROWSER');
  console.log('='.repeat(75));
  console.log(`  Total fields:     ${total}`);
  console.log(`  Correct:          ${correct.length}  (${(correct.length / total * 100).toFixed(1)}%)`);
  console.log(`  Mismatched value: ${mismatched.length}`);
  console.log(`  Cross-mapped:     ${crossMapped.length}  (value from wrong field)`);
  console.log(`  Missing/empty:    ${missing.length}`);
  console.log('='.repeat(75));

  // Breakdown by section
  const sectionStats = {};
  for (const item of [...correct, ...mismatched, ...crossMapped, ...missing]) {
    const sec = item.section || 'unknown';
    if (!sectionStats[sec]) {
      sectionStats[sec] = { total: 0, correct: 0, mismatched: 0, cross: 0, missing: 0 };
    }
    sectionStats[sec].total++;
  }
  for (const item of correct) sectionStats[item.section || 'unknown'].correct++;
  for (const item of mismatched) sectionStats[item.section || 'unknown'].mismatched++;
  for (const item of crossMapped) sectionStats[item.section || 'unknown'].cross++;
  for (const item of missing) sectionStats[item.section || 'unknown'].missing++;

  console.log('\nBy Section:');
  console.log(
    `  ${'Section'.padEnd(28)} ${'Total'.padStart(6)} ${'OK'.padStart(6)} ${'Mis'.padStart(6)} ${'Cross'.padStart(6)} ${'Miss'.padStart(6)}  Rate`,
  );
  console.log('  ' + '\u2500'.repeat(73));

  for (const [sec, s] of Object.entries(sectionStats).sort((a, b) => a[0].localeCompare(b[0]))) {
    const rate = s.total > 0 ? ((s.correct / s.total) * 100).toFixed(1) : '0.0';
    console.log(
      `  ${sec.padEnd(28)} ${String(s.total).padStart(6)} ${String(s.correct).padStart(6)} ${String(s.mismatched).padStart(6)} ${String(s.cross).padStart(6)} ${String(s.missing).padStart(6)}  ${rate}%`,
    );
  }

  // By type
  const typeStats = {};
  for (const item of [...correct, ...mismatched, ...crossMapped, ...missing]) {
    const ft = item.uiFieldType;
    if (!typeStats[ft]) typeStats[ft] = { total: 0, correct: 0, mismatched: 0, cross: 0, missing: 0 };
    typeStats[ft].total++;
  }
  for (const item of correct) typeStats[item.uiFieldType].correct++;
  for (const item of mismatched) typeStats[item.uiFieldType].mismatched++;
  for (const item of crossMapped) typeStats[item.uiFieldType].cross++;
  for (const item of missing) typeStats[item.uiFieldType].missing++;

  console.log('\nBy Field Type:');
  console.log(
    `  ${'Type'.padEnd(16)} ${'Total'.padStart(6)} ${'OK'.padStart(6)} ${'Mis'.padStart(6)} ${'Cross'.padStart(6)} ${'Miss'.padStart(6)}  Rate`,
  );
  console.log('  ' + '\u2500'.repeat(60));

  for (const [ft, s] of Object.entries(typeStats).sort((a, b) => a[0].localeCompare(b[0]))) {
    const rate = s.total > 0 ? ((s.correct / s.total) * 100).toFixed(1) : '0.0';
    console.log(
      `  ${ft.padEnd(16)} ${String(s.total).padStart(6)} ${String(s.correct).padStart(6)} ${String(s.mismatched).padStart(6)} ${String(s.cross).padStart(6)} ${String(s.missing).padStart(6)}  ${rate}%`,
    );
  }

  // Cross-mapping details
  if (crossMapped.length > 0) {
    console.log(`\n${'!'.repeat(75)}`);
    console.log(`CROSS-MAPPING ERRORS (${crossMapped.length}) \u2014 Values ended up in wrong PDF fields:`);
    console.log(`${'!'.repeat(75)}`);
    for (const cm of crossMapped.slice(0, 20)) {
      console.log(`\n  PDF Field: ${cm.pdfName}`);
      console.log(`    Expected: ${cm.semanticKey} \u2192 "${cm.expectedPdfValue}"`);
      console.log(`    Got:      ${cm.crossSource.fromKey} \u2192 "${cm.got}"`);
      console.log(`    Source:   PDF=${cm.crossSource.fromPdfName} Section=${cm.crossSource.fromSection}`);
    }
  }

  // Mismatch details
  if (mismatched.length > 0) {
    console.log(`\nMISMATCHED VALUES (${mismatched.length}) \u2014 showing first 30:`);
    for (const m of mismatched.slice(0, 30)) {
      console.log(`  ${m.semanticKey} [${m.uiFieldType}]`);
      console.log(`    PDF:      ${m.pdfName}`);
      console.log(`    Expected: ${JSON.stringify(m.expectedPdfValue)}`);
      console.log(`    Got:      ${JSON.stringify(m.got)}`);
    }
  }

  // Missing details
  if (missing.length > 0) {
    console.log(`\nMISSING/EMPTY VALUES (${missing.length}):`);
    const byType = {};
    for (const m of missing) {
      const ft = m.uiFieldType;
      byType[ft] = (byType[ft] || 0) + 1;
    }
    console.log('  By type:', byType);
    if (missing.length <= 50) {
      for (const m of missing) {
        console.log(`  ${m.semanticKey} [${m.uiFieldType}] \u2192 ${m.pdfName}`);
      }
    } else {
      console.log('  (showing first 30)');
      for (const m of missing.slice(0, 30)) {
        console.log(`  ${m.semanticKey} [${m.uiFieldType}] \u2192 ${m.pdfName}`);
      }
    }
  }

  // Console errors from the browser
  if (consoleErrors.length > 0) {
    console.log(`\nBrowser console errors (${consoleErrors.length}):`);
    for (const err of consoleErrors.slice(0, 10)) {
      console.log(`  ${err.substring(0, 200)}`);
    }
  }

  console.log('\n' + '='.repeat(75));

  // ─── Save full report ───────────────────────────────────────────────────

  const report = {
    timestamp: new Date().toISOString(),
    method: 'browser-e2e',
    pipeline: 'Jotai atoms \u2192 Export hook \u2192 /api/pdf/export \u2192 uiToPdf \u2192 PDF service \u2192 extract \u2192 compare',
    total,
    correct: correct.length,
    mismatched: mismatched.length,
    crossMapped: crossMapped.length,
    missing: missing.length,
    matchRate: parseFloat(((correct.length / total) * 100).toFixed(2)),
    sectionStats,
    typeStats,
    crossMappedDetails: crossMapped,
    mismatchedDetails: mismatched.slice(0, 100),
    missingDetails: missing.slice(0, 200),
    consoleErrors: consoleErrors.slice(0, 20),
  };

  const reportPath = join(__dirname, 'browser-validation-report.json');
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nFull report saved to ${reportPath}`);

  process.exit(crossMapped.length > 0 ? 1 : 0);
} catch (err) {
  console.error('\nFATAL ERROR:', err.message);
  if (consoleErrors.length > 0) {
    console.error('\nBrowser console errors:');
    for (const e of consoleErrors.slice(0, 5)) console.error(`  ${e.substring(0, 200)}`);
  }
  // Take a screenshot for debugging
  try {
    await page.screenshot({ path: '/tmp/browser-e2e-error.png', fullPage: true });
    console.error('Debug screenshot saved to /tmp/browser-e2e-error.png');
  } catch { /* ignore screenshot errors */ }
  process.exit(2);
} finally {
  await browser.close();
}

/**
 * Browser Interactive E2E Test — Section 13A Deep Validation
 *
 * Tests the FULL UI chain: real DOM interaction → React onChange → Jotai atoms →
 * Export hook → API → uiToPdf → PDF service → extract → compare.
 *
 * Unlike the Jotai injection test, this fills fields through the actual UI
 * components (typing in inputs, clicking radios, selecting dropdowns) to verify
 * the form primitives correctly read/write Jotai state.
 *
 * Focuses on section 13A (1,036 fields, largest section) with a targeted sample
 * of every field type, then does a full export + extraction of ALL injected values.
 *
 * Usage:
 *   node scripts/browser-interactive-section13.mjs
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

// ─── Load registry ──────────────────────────────────────────────────────────

const registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'));
const section13A = registry.filter(f => f.section === 'section13A');
const section13B = registry.filter(f => f.section === 'section13B');
console.log(`Registry: ${registry.length} total, section13A: ${section13A.length}, section13B: ${section13B.length}`);

const byKey = new Map(registry.map(f => [f.semanticKey, f]));

// ─── Test data: realistic values per field type ─────────────────────────────

function makeTestValue(field, i) {
  switch (field.uiFieldType) {
    case 'text':     return `Test-${field.semanticKey.split('.').pop()}-${i}`;
    case 'email':    return `emp${i}@company.test`;
    case 'telephone': return `+12025550${String(i).padStart(3, '0')}`;
    case 'ssn':      return `900${String(i).padStart(6, '0')}`;
    case 'date':     return '2024-06-15';
    case 'checkbox':  return i % 2 === 0;
    case 'radio': {
      const opts = field.options || [];
      return opts.length > 0 ? opts[0] : '1';
    }
    case 'select': {
      const opts = field.options || [];
      return opts.length > 0 ? opts[0] : '';
    }
    case 'country': {
      // Use full country name from registry options (matches PDF value)
      const opts = field.options || [];
      return opts.length > 0 ? opts[i % opts.length] : 'Canada';
    }
    case 'state':    return 'VA'; // State abbreviation — StateField stores value="VA"
    default:         return `val-${i}`;
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
      // These store ISO/abbreviation codes — pass through directly
      return String(uiValue);
    default:
      return String(uiValue);
  }
}

// ─── Select representative fields for UI interaction ────────────────────────

// Pick fields from section13A that cover every type, including deep entries
const interactiveTargets = [];
const typeSeen = {};

const labelSeen = new Set();
for (const f of section13A) {
  const ft = f.uiFieldType;
  const count = typeSeen[ft] || 0;
  // Pick up to 1 of each type for UI interaction to avoid duplicate-label selector issues
  // (fields like state_2, country_2 share the same label — Playwright can't distinguish them)
  const labelKey = `${ft}:${f.label.slice(0, 30)}`;
  if (count < 1 && !labelSeen.has(labelKey)) {
    interactiveTargets.push(f);
    typeSeen[ft] = count + 1;
    labelSeen.add(labelKey);
  }
}

console.log(`\nInteractive UI targets: ${interactiveTargets.length} fields`);
for (const [ft, n] of Object.entries(typeSeen)) {
  console.log(`  ${ft}: ${n}`);
}

// ─── Launch browser ─────────────────────────────────────────────────────────

console.log('\n[1] Launching visible Playwright browser...');
const browser = await chromium.launch({ headless: false, slowMo: 50 });
const context = await browser.newContext({ acceptDownloads: true });
const page = await context.newPage();

const consoleErrors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});

try {
  // ─── Auth ───────────────────────────────────────────────────────────────
  const TEST_EMAIL = `s13-${Date.now()}@test.dev`;
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
  console.log('  Logged in');

  // ─── Create form and navigate to section 13A ───────────────────────────
  console.log('[3] Creating form and navigating to section 13A...');
  await page.goto(`${APP_URL}/new`, { waitUntil: 'networkidle' });
  await page.click('button:has-text("Create Form")');
  await page.waitForURL('**/identification/section1', { timeout: 15000 });

  const formUrl = page.url();
  const submissionId = formUrl.split('/')[3];
  console.log(`  Submission: ${submissionId}`);

  // Navigate directly to section 13A
  await page.goto(`${APP_URL}/${submissionId}/history/section13A`, { waitUntil: 'networkidle' });
  await page.waitForSelector('h2:has-text("Section 13A")', { timeout: 15000 });
  console.log('  Section 13A loaded');

  // Wait for Jotai store
  await page.waitForFunction(
    () => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__,
    { timeout: 15000 },
  );

  // ─── Phase A: UI Interaction for targeted fields ───────────────────────
  console.log('\n[4] Interacting with UI fields in section 13A...');
  const uiFilledKeys = new Set();
  const uiTestValues = {};

  for (let i = 0; i < interactiveTargets.length; i++) {
    const field = interactiveTargets[i];
    const testVal = makeTestValue(field, i);
    uiTestValues[field.semanticKey] = testVal;

    try {
      switch (field.uiFieldType) {
        case 'text': {
          // Find input by scrolling to it and filling
          const input = page.locator(`input[type="text"]`).filter({ has: page.locator(`..`).filter({ hasText: field.label.slice(0, 40) }) }).first();
          if (await input.count() > 0) {
            await input.scrollIntoViewIfNeeded();
            await input.fill(String(testVal));
            uiFilledKeys.add(field.semanticKey);
            console.log(`  [text] ${field.semanticKey}: "${String(testVal).slice(0, 30)}"`);
          }
          break;
        }
        case 'checkbox': {
          const cb = page.locator(`input[type="checkbox"]`).filter({ has: page.locator(`..`).filter({ hasText: field.label.slice(0, 40) }) }).first();
          if (await cb.count() > 0) {
            await cb.scrollIntoViewIfNeeded();
            if (testVal) await cb.check();
            else await cb.uncheck();
            uiFilledKeys.add(field.semanticKey);
            console.log(`  [checkbox] ${field.semanticKey}: ${testVal}`);
          }
          break;
        }
        case 'radio': {
          const firstOpt = (field.options || [])[0];
          if (firstOpt) {
            const radio = page.locator(`input[type="radio"][name="${field.semanticKey}"]`).first();
            if (await radio.count() > 0) {
              await radio.scrollIntoViewIfNeeded();
              await radio.check();
              uiFilledKeys.add(field.semanticKey);
              console.log(`  [radio] ${field.semanticKey}: "${firstOpt}"`);
            }
          }
          break;
        }
        case 'select': {
          const sel = page.locator('select').filter({ has: page.locator(`..`).filter({ hasText: field.label.slice(0, 40) }) }).first();
          if (await sel.count() > 0 && field.options?.[0]) {
            await sel.scrollIntoViewIfNeeded();
            await sel.selectOption(field.options[0]);
            uiFilledKeys.add(field.semanticKey);
            console.log(`  [select] ${field.semanticKey}: "${field.options[0]}"`);
          }
          break;
        }
        case 'country': {
          // Use testVal (from makeTestValue) to stay consistent with expected values
          const sel = page.locator('select').filter({ has: page.locator(`..`).filter({ hasText: field.label.slice(0, 30) }) }).first();
          if (await sel.count() > 0) {
            await sel.scrollIntoViewIfNeeded();
            await sel.selectOption({ value: String(testVal) });
            uiFilledKeys.add(field.semanticKey);
            console.log(`  [country] ${field.semanticKey}: "${testVal}"`);
          }
          break;
        }
        case 'state': {
          const sel = page.locator('select').filter({ has: page.locator(`..`).filter({ hasText: field.label.slice(0, 30) }) }).first();
          if (await sel.count() > 0) {
            await sel.scrollIntoViewIfNeeded();
            await sel.selectOption('VA');
            uiFilledKeys.add(field.semanticKey);
            console.log(`  [state] ${field.semanticKey}: "VA"`);
          }
          break;
        }
        default:
          break;
      }
    } catch (err) {
      console.log(`  [SKIP] ${field.semanticKey} [${field.uiFieldType}]: ${err.message.slice(0, 80)}`);
    }
  }

  console.log(`\n  UI-filled: ${uiFilledKeys.size} of ${interactiveTargets.length} targeted`);

  // ─── Phase B: Verify UI values reached Jotai store ─────────────────────
  console.log('\n[5] Verifying UI values in Jotai store...');
  const storeValues = await page.evaluate((keys) => {
    const store = window.__JOTAI_STORE__;
    const atomFamily = window.__FIELD_VALUE_ATOM_FAMILY__;
    const result = {};
    for (const key of keys) {
      result[key] = store.get(atomFamily(key));
    }
    return result;
  }, [...uiFilledKeys]);

  let storeMatches = 0;
  for (const key of uiFilledKeys) {
    const storeVal = storeValues[key];
    const expected = uiTestValues[key];
    // Handle null ≈ false for checkboxes (null = "never touched", false = "explicitly unchecked")
    const match = String(storeVal) === String(expected) ||
                  (typeof expected === 'boolean' && storeVal === expected) ||
                  (expected === false && (storeVal === null || storeVal === false));
    if (match) {
      storeMatches++;
    } else {
      console.log(`  MISMATCH: ${key} — UI sent: ${JSON.stringify(expected)}, store has: ${JSON.stringify(storeVal)}`);
    }
  }
  console.log(`  Store verification: ${storeMatches}/${uiFilledKeys.size} match`);

  // ─── Phase C: Inject ALL remaining section13A+13B values via Jotai ─────
  console.log('\n[6] Injecting remaining section 13 values via Jotai...');
  const allTestValues = {};
  const allExpected = {};

  let idx = 0;
  for (const field of [...section13A, ...section13B]) {
    if (uiFilledKeys.has(field.semanticKey)) {
      // Use the value already set by UI interaction
      allTestValues[field.semanticKey] = uiTestValues[field.semanticKey];
    } else {
      allTestValues[field.semanticKey] = makeTestValue(field, idx);
    }

    allExpected[field.pdfFieldName] = {
      semanticKey: field.semanticKey,
      section: field.section,
      uiFieldType: field.uiFieldType,
      label: field.label,
      sentUiValue: allTestValues[field.semanticKey],
      expectedPdfValue: computeExpectedPdf(field, allTestValues[field.semanticKey]),
    };
    idx++;
  }

  // Inject non-UI-filled values
  const injectValues = {};
  for (const [key, val] of Object.entries(allTestValues)) {
    if (!uiFilledKeys.has(key)) {
      injectValues[key] = val;
    }
  }

  const injectResult = await page.evaluate((values) => {
    const store = window.__JOTAI_STORE__;
    const atomFamily = window.__FIELD_VALUE_ATOM_FAMILY__;
    let count = 0;
    for (const [key, value] of Object.entries(values)) {
      store.set(atomFamily(key), value);
      count++;
    }
    return count;
  }, injectValues);

  console.log(`  Injected ${injectResult} additional values (${uiFilledKeys.size} from UI)`);
  console.log(`  Total section 13 values: ${Object.keys(allTestValues).length}`);

  await page.waitForTimeout(500);

  // ─── Phase D: Export and extract ───────────────────────────────────────
  console.log('\n[7] Exporting PDF...');
  const t1 = Date.now();

  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 120000 }),
    page.click('button:has-text("Export PDF")'),
  ]);

  const downloadPath = await download.path();
  const pdfBuffer = readFileSync(downloadPath);
  const exportTime = ((Date.now() - t1) / 1000).toFixed(1);
  console.log(`  Downloaded ${pdfBuffer.length.toLocaleString()} bytes in ${exportTime}s`);
  writeFileSync('/tmp/sf86-section13-test.pdf', pdfBuffer);

  // Extract
  console.log('\n[8] Extracting fields from PDF...');
  const formData = new FormData();
  formData.append('file', new Blob([pdfBuffer], { type: 'application/pdf' }), 'test.pdf');

  const extractResp = await fetch(`${PDF_SERVICE}/extract-fields`, {
    method: 'POST',
    body: formData,
  });
  const extractData = await extractResp.json();
  const extracted = extractData.fields || {};
  console.log(`  Extracted ${Object.keys(extracted).length} fields`);

  // ─── Phase E: Compare section 13 fields ────────────────────────────────
  console.log('\n[9] Comparing section 13 fields...\n');

  const correct = [];
  const mismatched = [];
  const missing = [];
  const crossMapped = [];

  for (const [pdfName, info] of Object.entries(allExpected)) {
    const got = String(extracted[pdfName] || '').trim();
    const expected = info.expectedPdfValue.trim();

    if (!got) {
      missing.push({ pdfName, ...info, got: '' });
      continue;
    }

    if (got === expected || got.toLowerCase() === expected.toLowerCase()) {
      correct.push({ pdfName, ...info, source: uiFilledKeys.has(info.semanticKey) ? 'UI' : 'INJECT' });
      continue;
    }

    let crossSource = null;
    for (const [otherPdf, otherInfo] of Object.entries(allExpected)) {
      if (otherPdf === pdfName) continue;
      if (got === otherInfo.expectedPdfValue.trim()) {
        crossSource = { fromPdf: otherPdf, fromKey: otherInfo.semanticKey };
        break;
      }
    }

    if (crossSource) {
      crossMapped.push({ pdfName, ...info, got, crossSource });
    } else {
      mismatched.push({ pdfName, ...info, got });
    }
  }

  const total = Object.keys(allExpected).length;

  console.log('='.repeat(75));
  console.log('SECTION 13 INTERACTIVE BROWSER TEST');
  console.log('='.repeat(75));
  console.log(`  Total fields:       ${total} (13A: ${section13A.length}, 13B: ${section13B.length})`);
  console.log(`  Filled via UI:      ${uiFilledKeys.size}`);
  console.log(`  Filled via Jotai:   ${injectResult}`);
  console.log(`  Correct:            ${correct.length}  (${(correct.length / total * 100).toFixed(1)}%)`);
  console.log(`  Mismatched:         ${mismatched.length}`);
  console.log(`  Cross-mapped:       ${crossMapped.length}`);
  console.log(`  Missing/empty:      ${missing.length}`);
  console.log('='.repeat(75));

  // Show UI-filled results specifically
  const uiCorrect = correct.filter(c => c.source === 'UI');
  const uiMissing = missing.filter(m => uiFilledKeys.has(m.semanticKey));
  const uiMismatch = mismatched.filter(m => uiFilledKeys.has(m.semanticKey));
  console.log(`\n  UI-filled breakdown:`);
  console.log(`    Correct:   ${uiCorrect.length}/${uiFilledKeys.size}`);
  console.log(`    Mismatch:  ${uiMismatch.length}`);
  console.log(`    Missing:   ${uiMissing.length}`);

  // By type
  console.log('\nBy Field Type:');
  console.log(`  ${'Type'.padEnd(14)} ${'Total'.padStart(6)} ${'OK'.padStart(6)} ${'Mis'.padStart(6)} ${'Miss'.padStart(6)}  Rate`);
  console.log('  ' + '\u2500'.repeat(55));

  const typeStats = {};
  for (const item of [...correct, ...mismatched, ...crossMapped, ...missing]) {
    const ft = item.uiFieldType;
    if (!typeStats[ft]) typeStats[ft] = { total: 0, correct: 0, mismatched: 0, missing: 0 };
    typeStats[ft].total++;
  }
  for (const item of correct) typeStats[item.uiFieldType].correct++;
  for (const item of mismatched) typeStats[item.uiFieldType].mismatched++;
  for (const item of missing) typeStats[item.uiFieldType].missing++;

  for (const [ft, s] of Object.entries(typeStats).sort((a, b) => a[0].localeCompare(b[0]))) {
    const rate = s.total > 0 ? ((s.correct / s.total) * 100).toFixed(1) : '0.0';
    console.log(
      `  ${ft.padEnd(14)} ${String(s.total).padStart(6)} ${String(s.correct).padStart(6)} ${String(s.mismatched).padStart(6)} ${String(s.missing).padStart(6)}  ${rate}%`,
    );
  }

  // Detail any failures
  if (mismatched.length > 0) {
    console.log(`\nMISMATCHES (${mismatched.length}):`);
    for (const m of mismatched.slice(0, 20)) {
      console.log(`  ${m.semanticKey} [${m.uiFieldType}]${uiFilledKeys.has(m.semanticKey) ? ' [UI]' : ''}`);
      console.log(`    Expected: ${JSON.stringify(m.expectedPdfValue)}`);
      console.log(`    Got:      ${JSON.stringify(m.got)}`);
    }
  }
  if (missing.length > 0) {
    console.log(`\nMISSING (${missing.length}):`);
    for (const m of missing.slice(0, 20)) {
      console.log(`  ${m.semanticKey} [${m.uiFieldType}]${uiFilledKeys.has(m.semanticKey) ? ' [UI]' : ''}`);
    }
  }

  if (consoleErrors.length > 0) {
    console.log(`\nBrowser errors (${consoleErrors.length}):`);
    for (const e of consoleErrors.slice(0, 10)) console.log(`  ${e.slice(0, 150)}`);
  }

  // Save report
  const report = {
    timestamp: new Date().toISOString(),
    section: 'section13A+13B',
    total,
    uiFilled: uiFilledKeys.size,
    jotaiInjected: injectResult,
    correct: correct.length,
    mismatched: mismatched.length,
    crossMapped: crossMapped.length,
    missing: missing.length,
    matchRate: parseFloat(((correct.length / total) * 100).toFixed(2)),
    uiBreakdown: {
      correct: uiCorrect.length,
      mismatch: uiMismatch.length,
      missing: uiMissing.length,
    },
    typeStats,
    mismatchedDetails: mismatched,
    missingDetails: missing.slice(0, 50),
    consoleErrors: consoleErrors.slice(0, 20),
  };

  const reportPath = join(__dirname, 'section13-interactive-report.json');
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nReport: ${reportPath}`);

  console.log('\n' + '='.repeat(75));
  process.exit(crossMapped.length + mismatched.length > 0 ? 1 : 0);

} catch (err) {
  console.error('\nFATAL:', err.message);
  if (consoleErrors.length > 0) {
    for (const e of consoleErrors.slice(0, 5)) console.error(`  ${e.slice(0, 150)}`);
  }
  try {
    await page.screenshot({ path: '/tmp/section13-error.png', fullPage: true });
    console.error('Screenshot: /tmp/section13-error.png');
  } catch {}
  process.exit(2);
} finally {
  await browser.close();
}

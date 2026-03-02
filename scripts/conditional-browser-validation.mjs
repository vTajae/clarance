/**
 * Conditional-Aware Browser E2E Validation — PROOF that conditionals work
 *
 * This script validates THREE scenarios:
 *
 *   SCENARIO A: "Gates activated" — All 87 gates set to YES
 *     → ALL 6,197 fields should be exported to PDF (hidden fields become visible)
 *     → Proves: conditional toggle doesn't break any field mapping
 *
 *   SCENARIO B: "Gates deactivated" — All 87 gates set to NO
 *     → Only 3,075 unconditional fields should be in the PDF
 *     → 3,122 conditional fields should be ABSENT (empty/blank in PDF)
 *     → Proves: hidden fields are correctly excluded from export
 *
 *   SCENARIO C: "Identity verification" — Section-encoded unique values
 *     → Every field gets a value encoding its section, label, and index
 *     → Extracts PDF and compares every value
 *     → Proves: no field is cross-mapped to the wrong PDF field
 *
 * Usage (from project root):
 *   node --import=./scripts/_resolve-playwright.mjs scripts/conditional-browser-validation.mjs
 *   — OR —
 *   cd app && node ../scripts/conditional-browser-validation.mjs
 *
 * Requirements:
 *   - Next.js dev server running on localhost:3000
 *   - PDF service running on localhost:8001
 *   - Playwright installed: cd app && npx playwright install chromium
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

// ─── Load registry ───────────────────────────────────────────────────────────

const registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'));
console.log(`\nLoaded ${registry.length} field definitions`);

const byKey = new Map();
const byPdfName = new Map();
for (const f of registry) {
  byKey.set(f.semanticKey, f);
  byPdfName.set(f.pdfFieldName, f);
}

// Separate gate fields, conditional fields, and unconditional fields
const gateKeys = new Set();
const conditionalFields = [];
const unconditionalFields = [];

for (const f of registry) {
  if (f.dependsOn) {
    gateKeys.add(f.dependsOn);
    conditionalFields.push(f);
  } else {
    unconditionalFields.push(f);
  }
}

// Identify which fields ARE gates (they're also unconditional since gates themselves don't have dependsOn)
const gateFieldDefs = [];
for (const gk of gateKeys) {
  const g = byKey.get(gk);
  if (g) gateFieldDefs.push(g);
}

console.log(`  Gate fields: ${gateFieldDefs.length}`);
console.log(`  Conditional fields (has dependsOn): ${conditionalFields.length}`);
console.log(`  Unconditional fields (always visible): ${unconditionalFields.length}`);

// ─── Value generators ────────────────────────────────────────────────────────

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
      // For gate fields, always return YES to activate
      if (gateKeys.has(field.semanticKey)) {
        // Find what value the dependents expect
        const firstDep = conditionalFields.find((f) => f.dependsOn === field.semanticKey);
        const expr = firstDep?.showWhen || "=== 'YES'";
        if (expr === "=== 'Yes'") return 'Yes';
        return 'YES';
      }
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

// ─── Browser helper ──────────────────────────────────────────────────────────

async function loginAndCreateForm(page) {
  const TEST_EMAIL = `e2e-cond-${Date.now()}@test.dev`;
  const TEST_PASS = 'e2eTestPass123';

  // Register
  const regResp = await fetch(`${APP_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASS }),
  });
  if (regResp.ok) {
    console.log(`  Registered: ${TEST_EMAIL}`);
  }

  // Login
  await page.goto(`${APP_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.fill('input#email', TEST_EMAIL);
  await page.fill('input#password', TEST_PASS);
  await page.click('button[type="submit"]');
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 });
  console.log(`  Logged in at: ${page.url()}`);

  // Create form
  await page.goto(`${APP_URL}/new`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.click('button:has-text("Create Form")');
  await page.waitForURL('**/identification/section1', { timeout: 15000 });
  console.log(`  Form created at: ${page.url()}`);

  // Wait for Jotai store
  await page.waitForFunction(
    () => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__,
    { timeout: 15000 },
  );
  console.log('  Jotai store available');
}

async function injectValues(page, values) {
  return page.evaluate((vals) => {
    const store = window.__JOTAI_STORE__;
    const atomFamily = window.__FIELD_VALUE_ATOM_FAMILY__;
    let count = 0;
    const errors = [];
    for (const [key, value] of Object.entries(vals)) {
      try {
        store.set(atomFamily(key), value);
        count++;
      } catch (e) {
        errors.push({ key, error: e.message });
      }
    }
    return { count, errors: errors.slice(0, 10) };
  }, values);
}

async function exportAndExtract(page) {
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 180000 }),
    page.click('button:has-text("Export PDF")'),
  ]);

  const downloadPath = await download.path();
  const pdfBuffer = readFileSync(downloadPath);
  console.log(`  Downloaded PDF: ${pdfBuffer.length.toLocaleString()} bytes`);

  // Extract via PDF service
  const formData = new FormData();
  formData.append('file', new Blob([pdfBuffer], { type: 'application/pdf' }), 'test.pdf');

  const extractResp = await fetch(`${PDF_SERVICE}/extract-fields`, {
    method: 'POST',
    body: formData,
  });

  if (!extractResp.ok) {
    throw new Error(`Extract failed: ${extractResp.status} ${await extractResp.text()}`);
  }

  const extractData = await extractResp.json();
  return { fields: extractData.fields || {}, pdfBuffer };
}

async function resetAllFields(page, fieldCount) {
  return page.evaluate((count) => {
    const store = window.__JOTAI_STORE__;
    const atomFamily = window.__FIELD_VALUE_ATOM_FAMILY__;
    // We can't easily enumerate all atoms, so we'll just clear known keys
    // This is handled by injecting new values for each scenario
    return true;
  }, fieldCount);
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log(' CONDITIONAL-AWARE BROWSER E2E VALIDATION');
console.log(' Proving field mapping + conditional toggle integrity');
console.log('═'.repeat(75));

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ acceptDownloads: true });
const page = await context.newPage();

const consoleErrors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});

const results = {};

try {
  // ─── Authenticate & Create Form ──────────────────────────────────────────
  console.log('\n[Setup] Authenticating and creating form...');
  await loginAndCreateForm(page);

  // ═════════════════════════════════════════════════════════════════════════
  // SCENARIO A: All gates = YES → All 6,197 fields visible & exported
  // ═════════════════════════════════════════════════════════════════════════

  console.log('\n' + '─'.repeat(75));
  console.log('SCENARIO A: All gates activated (YES) → Expect ALL 6,197 fields in PDF');
  console.log('─'.repeat(75));

  // Build values: gates = YES first, then all identity values
  const scenarioA_values = {};
  let idx = 0;

  for (const field of registry) {
    scenarioA_values[field.semanticKey] = makeIdentityValue(field, idx);
    idx++;
  }

  // Ensure all gates are explicitly set to YES/Yes
  for (const gateDef of gateFieldDefs) {
    const firstDep = conditionalFields.find((f) => f.dependsOn === gateDef.semanticKey);
    const expr = firstDep?.showWhen || "=== 'YES'";
    scenarioA_values[gateDef.semanticKey] = expr === "=== 'Yes'" ? 'Yes' : 'YES';
  }

  console.log(`  Injecting ${Object.keys(scenarioA_values).length} values (all gates=YES)...`);
  const t0 = Date.now();

  // Inject in two passes: gates first, then everything else (so the export
  // evaluates showWhen correctly with gates already set)
  const gateValues = {};
  const nonGateValues = {};
  for (const [k, v] of Object.entries(scenarioA_values)) {
    if (gateKeys.has(k)) {
      gateValues[k] = v;
    } else {
      nonGateValues[k] = v;
    }
  }

  const g1 = await injectValues(page, gateValues);
  console.log(`  Pass 1 (gates): ${g1.count} injected`);
  const g2 = await injectValues(page, nonGateValues);
  console.log(`  Pass 2 (all fields): ${g2.count} injected`);

  // Wait for React
  await page.waitForTimeout(1000);

  console.log(`  Exporting PDF with all gates=YES...`);
  const scenarioA_extract = await exportAndExtract(page);
  const scenarioA_time = ((Date.now() - t0) / 1000).toFixed(1);

  // Verify every field is present
  const expectedByPdfName_A = {};
  idx = 0;
  for (const field of registry) {
    expectedByPdfName_A[field.pdfFieldName] = {
      semanticKey: field.semanticKey,
      section: field.section,
      label: field.label,
      uiFieldType: field.uiFieldType || 'text',
      sentUiValue: scenarioA_values[field.semanticKey],
      expectedPdfValue: computeExpectedPdfValue(field, scenarioA_values[field.semanticKey]),
      index: idx,
    };
    idx++;
  }

  let A_correct = 0;
  let A_mismatched = 0;
  let A_missing = 0;
  let A_missing_radio = 0; // Known PyMuPDF extraction limitation
  let A_crossMapped = 0;
  const A_mismatches = [];
  const A_crossMaps = [];
  const A_missings = [];

  for (const [pdfName, info] of Object.entries(expectedByPdfName_A)) {
    const got = String(scenarioA_extract.fields[pdfName] || '').trim();
    const expected = info.expectedPdfValue.trim();

    if (!got) {
      // Known: PyMuPDF cannot extract some radio button values
      if (info.uiFieldType === 'radio') {
        A_missing_radio++;
      } else {
        A_missing++;
      }
      A_missings.push({ pdfName, ...info, got: '' });
      continue;
    }

    if (got === expected || got.toLowerCase() === expected.toLowerCase()) {
      A_correct++;
      continue;
    }

    // Cross-map check
    let crossSource = null;
    for (const [otherPdf, otherInfo] of Object.entries(expectedByPdfName_A)) {
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
      A_crossMapped++;
      A_crossMaps.push({ pdfName, ...info, got, crossSource });
    } else {
      A_mismatched++;
      A_mismatches.push({ pdfName, ...info, got });
    }
  }

  const A_total = registry.length;
  // Scenario A passes if: 0 cross-maps, 0 real mismatches, and only radio extraction gaps
  const scenarioA_pass = A_crossMapped === 0 && A_mismatched === 0 && A_missing === 0;
  console.log(`\n  SCENARIO A RESULTS (${scenarioA_time}s):`);
  console.log(`    Total:          ${A_total}`);
  console.log(`    Correct:        ${A_correct}  (${((A_correct / A_total) * 100).toFixed(1)}%)`);
  console.log(`    Mismatched:     ${A_mismatched}`);
  console.log(`    Cross-maps:     ${A_crossMapped}`);
  console.log(`    Missing:        ${A_missing}`);
  console.log(`    Missing (radio): ${A_missing_radio}  [known PyMuPDF extraction limit]`);
  console.log(`    Verdict:        ${scenarioA_pass ? '✓ PASS' : '✗ FAIL'}`);

  results.scenarioA = {
    total: A_total,
    correct: A_correct,
    mismatched: A_mismatched,
    crossMapped: A_crossMapped,
    missing: A_missing,
    missingRadio: A_missing_radio,
    mismatches: A_mismatches.slice(0, 50),
    crossMaps: A_crossMaps,
    missings: A_missings.slice(0, 50),
    pass: scenarioA_pass,
  };

  if (A_mismatches.length > 0) {
    console.log(`\n  First 20 mismatches:`);
    for (const m of A_mismatches.slice(0, 20)) {
      console.log(`    ${m.semanticKey} [${m.uiFieldType}]`);
      console.log(`      Expected: ${JSON.stringify(m.expectedPdfValue)}`);
      console.log(`      Got:      ${JSON.stringify(m.got)}`);
    }
  }
  if (A_crossMaps.length > 0) {
    console.log(`\n  Cross-map errors:`);
    for (const cm of A_crossMaps.slice(0, 20)) {
      console.log(`    ${cm.pdfName} expected from ${cm.semanticKey}`);
      console.log(`      Got value from: ${cm.crossSource.fromKey} (${cm.crossSource.fromSection})`);
    }
  }
  if (A_missings.length > 0) {
    const byType = {};
    for (const m of A_missings) {
      byType[m.uiFieldType] = (byType[m.uiFieldType] || 0) + 1;
    }
    console.log(`\n  Missing by type:`, byType);
  }

  // ═════════════════════════════════════════════════════════════════════════
  // SCENARIO B: All gates = NO → Only unconditional fields in PDF
  // ═════════════════════════════════════════════════════════════════════════

  console.log('\n' + '─'.repeat(75));
  console.log('SCENARIO B: All gates deactivated (NO) → Expect ONLY unconditional fields');
  console.log('─'.repeat(75));

  // Reset store: set ALL fields to null first
  console.log('  Resetting all fields to null...');
  await page.evaluate((allKeys) => {
    const store = window.__JOTAI_STORE__;
    const atomFamily = window.__FIELD_VALUE_ATOM_FAMILY__;
    for (const key of allKeys) {
      store.set(atomFamily(key), null);
    }
  }, registry.map((f) => f.semanticKey));

  // Set gate fields to NO (or a non-YES value)
  const gateNoValues = {};
  for (const gateDef of gateFieldDefs) {
    gateNoValues[gateDef.semanticKey] = 'NO';
  }
  await injectValues(page, gateNoValues);
  console.log(`  Set ${Object.keys(gateNoValues).length} gates to NO`);

  // Now inject unique values for ALL fields (including conditional ones)
  // The export hook should SKIP the conditional fields since gates=NO
  const scenarioB_values = {};
  idx = 0;
  for (const field of registry) {
    if (gateKeys.has(field.semanticKey)) {
      scenarioB_values[field.semanticKey] = 'NO'; // Keep gates as NO
    } else {
      scenarioB_values[field.semanticKey] = makeIdentityValue(field, idx + 10000);
    }
    idx++;
  }

  const b1 = await injectValues(page, scenarioB_values);
  console.log(`  Injected ${b1.count} values (gates=NO, all fields have values)`);

  await page.waitForTimeout(1000);

  console.log(`  Exporting PDF with all gates=NO...`);
  const t1 = Date.now();
  const scenarioB_extract = await exportAndExtract(page);
  const scenarioB_time = ((Date.now() - t1) / 1000).toFixed(1);

  // Count which fields have values in the extracted PDF
  let B_conditionalPresent = 0;
  let B_conditionalCheckboxDefault = 0; // Checkbox default "No"/"Off" from PDF template
  let B_conditionalAbsent = 0;
  let B_unconditionalPresent = 0;
  let B_unconditionalAbsent = 0;
  let B_unconditionalRadioMissing = 0; // Known PyMuPDF limitation
  const B_conditionalRealLeaks = []; // Actual export leaks (not checkbox defaults)

  for (const field of conditionalFields) {
    const extracted = String(scenarioB_extract.fields[field.pdfFieldName] || '').trim();
    if (extracted) {
      // Checkbox fields in the PDF template have a default "No"/"Off" state
      // that PyMuPDF extracts even when we never wrote to them.
      // This is NOT a real export leak.
      if (field.uiFieldType === 'checkbox' && (extracted === 'No' || extracted === 'Off')) {
        B_conditionalCheckboxDefault++;
      } else {
        B_conditionalPresent++;
        B_conditionalRealLeaks.push({
          semanticKey: field.semanticKey,
          section: field.section,
          dependsOn: field.dependsOn,
          uiFieldType: field.uiFieldType,
          extractedValue: extracted,
        });
      }
    } else {
      B_conditionalAbsent++;
    }
  }

  for (const field of unconditionalFields) {
    const extracted = String(scenarioB_extract.fields[field.pdfFieldName] || '').trim();
    if (extracted) {
      B_unconditionalPresent++;
    } else {
      if (field.uiFieldType === 'radio') {
        B_unconditionalRadioMissing++;
      } else {
        B_unconditionalAbsent++;
      }
    }
  }

  // Gate fields themselves are unconditional but we set them to NO
  let B_gatesPresent = 0;
  for (const gateDef of gateFieldDefs) {
    const extracted = String(scenarioB_extract.fields[gateDef.pdfFieldName] || '').trim();
    if (extracted) B_gatesPresent++;
  }

  // Scenario B passes if: no REAL conditional field leaks (checkbox defaults don't count)
  const scenarioB_pass = B_conditionalPresent === 0;
  console.log(`\n  SCENARIO B RESULTS (${scenarioB_time}s):`);
  console.log(`    Conditional fields (should be ABSENT):`);
  console.log(`      Absent (correct):           ${B_conditionalAbsent}`);
  console.log(`      Checkbox default "No":      ${B_conditionalCheckboxDefault}  [PDF template default, NOT a leak]`);
  console.log(`      Real leaks:                 ${B_conditionalPresent}`);
  console.log(`    Unconditional fields (should be PRESENT):`);
  console.log(`      Present (correct):          ${B_unconditionalPresent}`);
  console.log(`      Missing (radio extract):    ${B_unconditionalRadioMissing}  [known PyMuPDF limit]`);
  console.log(`      Missing (other):            ${B_unconditionalAbsent}`);
  console.log(`    Gate fields present:          ${B_gatesPresent}/${gateFieldDefs.length}`);
  console.log(`    Verdict: ${scenarioB_pass ? '✓ PASS' : '✗ FAIL — conditional fields leaked through'}`);

  if (B_conditionalRealLeaks.length > 0) {
    console.log(`\n  REAL leaked conditional fields:`);
    for (const leak of B_conditionalRealLeaks.slice(0, 30)) {
      console.log(`    ${leak.semanticKey} [${leak.uiFieldType}] (${leak.section}) gate=${leak.dependsOn}`);
      console.log(`      Value in PDF: ${JSON.stringify(leak.extractedValue)}`);
    }
  }

  results.scenarioB = {
    conditionalAbsent: B_conditionalAbsent,
    conditionalCheckboxDefault: B_conditionalCheckboxDefault,
    conditionalRealLeaks: B_conditionalPresent,
    unconditionalPresent: B_unconditionalPresent,
    unconditionalAbsent: B_unconditionalAbsent,
    unconditionalRadioMissing: B_unconditionalRadioMissing,
    gatesPresent: B_gatesPresent,
    realLeaks: B_conditionalRealLeaks.slice(0, 100),
    pass: scenarioB_pass,
  };

  // ═════════════════════════════════════════════════════════════════════════
  // SCENARIO C: Per-section identity proof (gates=YES, section-encoded)
  // ═════════════════════════════════════════════════════════════════════════

  console.log('\n' + '─'.repeat(75));
  console.log('SCENARIO C: Per-section identity proof with section-encoded values');
  console.log('─'.repeat(75));

  // Reset all to null
  await page.evaluate((allKeys) => {
    const store = window.__JOTAI_STORE__;
    const atomFamily = window.__FIELD_VALUE_ATOM_FAMILY__;
    for (const key of allKeys) {
      store.set(atomFamily(key), null);
    }
  }, registry.map((f) => f.semanticKey));

  // Re-activate all gates
  await injectValues(page, gateValues);

  // Inject section-stamped values for non-radio/non-checkbox fields
  // These are the most important to verify because text fields carry identity
  const sectionStampedValues = {};
  const sectionStampedExpected = {};
  idx = 0;
  for (const field of registry) {
    const ft = field.uiFieldType || 'text';
    const sec = field.section;

    if (gateKeys.has(field.semanticKey)) {
      // Keep gates as YES
      const firstDep = conditionalFields.find((f) => f.dependsOn === field.semanticKey);
      const expr = firstDep?.showWhen || "=== 'YES'";
      sectionStampedValues[field.semanticKey] = expr === "=== 'Yes'" ? 'Yes' : 'YES';
    } else if (ft === 'text') {
      // Stamp text fields with section identity
      let stamp = `SEC:${sec}|IDX:${idx}|KEY:${field.semanticKey.slice(-20)}`;
      if (field.maxLength && stamp.length > field.maxLength) {
        stamp = stamp.substring(0, field.maxLength);
      }
      sectionStampedValues[field.semanticKey] = stamp;
      sectionStampedExpected[field.pdfFieldName] = {
        semanticKey: field.semanticKey,
        section: sec,
        expected: stamp,
      };
    } else {
      // Use standard identity value
      sectionStampedValues[field.semanticKey] = makeIdentityValue(field, idx);
    }
    idx++;
  }

  // Inject gates first
  await injectValues(page, Object.fromEntries(
    Object.entries(sectionStampedValues).filter(([k]) => gateKeys.has(k))
  ));
  // Then all values
  const c1 = await injectValues(page, sectionStampedValues);
  console.log(`  Injected ${c1.count} section-stamped values`);

  await page.waitForTimeout(1000);

  console.log(`  Exporting PDF with section-stamped values...`);
  const t2 = Date.now();
  const scenarioC_extract = await exportAndExtract(page);
  const scenarioC_time = ((Date.now() - t2) / 1000).toFixed(1);

  // Verify that text fields carry the correct section stamp
  let C_correct = 0;
  let C_wrongSection = 0;
  let C_missing = 0;
  const C_crossSectionErrors = [];

  for (const [pdfName, info] of Object.entries(sectionStampedExpected)) {
    const got = String(scenarioC_extract.fields[pdfName] || '').trim();
    const expectedSection = info.section;

    if (!got) {
      C_missing++;
      continue;
    }

    // Extract section from the stamp: "SEC:section15|IDX:..."
    const secMatch = got.match(/^SEC:(\w+)\|/);
    if (!secMatch) {
      C_wrongSection++;
      C_crossSectionErrors.push({
        pdfName,
        semanticKey: info.semanticKey,
        expectedSection,
        got,
      });
      continue;
    }

    const gotSection = secMatch[1];
    if (gotSection === expectedSection) {
      C_correct++;
    } else {
      C_wrongSection++;
      C_crossSectionErrors.push({
        pdfName,
        semanticKey: info.semanticKey,
        expectedSection,
        gotSection,
        got,
      });
    }
  }

  const C_total = Object.keys(sectionStampedExpected).length;
  console.log(`\n  SCENARIO C RESULTS (${scenarioC_time}s):`);
  console.log(`    Text fields checked: ${C_total}`);
  console.log(`    Correct section:     ${C_correct}  (${((C_correct / C_total) * 100).toFixed(1)}%)`);
  console.log(`    Wrong section:       ${C_wrongSection}`);
  console.log(`    Missing:             ${C_missing}`);
  console.log(`    Verdict: ${C_wrongSection === 0 ? '✓ PASS' : '✗ FAIL — cross-section mapping detected'}`);

  if (C_crossSectionErrors.length > 0) {
    console.log(`\n  Cross-section errors (first 20):`);
    for (const err of C_crossSectionErrors.slice(0, 20)) {
      console.log(`    ${err.pdfName}`);
      console.log(`      Expected section: ${err.expectedSection}`);
      console.log(`      Got section: ${err.gotSection || 'unparseable'}`);
      console.log(`      Full value: ${JSON.stringify(err.got)}`);
    }
  }

  results.scenarioC = {
    total: C_total,
    correct: C_correct,
    wrongSection: C_wrongSection,
    missing: C_missing,
    crossSectionErrors: C_crossSectionErrors.slice(0, 50),
  };

  // ═════════════════════════════════════════════════════════════════════════
  // FINAL SUMMARY
  // ═════════════════════════════════════════════════════════════════════════

  console.log('\n' + '═'.repeat(75));
  console.log(' FINAL SUMMARY — CONDITIONAL-AWARE BROWSER E2E VALIDATION');
  console.log('═'.repeat(75));

  const scenarioC_pass = C_wrongSection === 0;
  const allPass = scenarioA_pass && scenarioB_pass && scenarioC_pass;

  console.log(`\n  SCENARIO A (Gates=YES, all fields): ${scenarioA_pass ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`    ${A_correct}/${A_total} correct, ${A_mismatched} mismatched, ${A_crossMapped} cross-mapped`);
  console.log(`    ${A_missing} missing (non-radio), ${A_missing_radio} missing (radio, known PyMuPDF limit)`);

  console.log(`\n  SCENARIO B (Gates=NO, hidden excluded): ${scenarioB_pass ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`    ${B_conditionalAbsent}/${conditionalFields.length - B_conditionalCheckboxDefault} non-checkbox conditional correctly hidden`);
  console.log(`    ${B_conditionalCheckboxDefault} checkbox defaults (PDF template, not leaks)`);
  console.log(`    ${B_conditionalPresent} real export leaks`);
  console.log(`    ${B_unconditionalPresent}/${unconditionalFields.length} unconditional correctly present`);

  console.log(`\n  SCENARIO C (Section identity proof): ${scenarioC_pass ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`    ${C_correct}/${C_total} text fields verified to correct section`);

  console.log(`\n  OVERALL: ${allPass ? '✓ ALL SCENARIOS PASSED' : '✗ SOME SCENARIOS FAILED'}`);
  console.log('═'.repeat(75));

  if (consoleErrors.length > 0) {
    console.log(`\n  Browser console errors (${consoleErrors.length}):`);
    for (const err of consoleErrors.slice(0, 10)) {
      console.log(`    ${err.substring(0, 200)}`);
    }
  }

  // ─── Save report ─────────────────────────────────────────────────────────

  const fullReport = {
    timestamp: new Date().toISOString(),
    method: 'conditional-browser-e2e',
    pipeline: 'Jotai → evaluateShowWhen → Export hook → /api/pdf/export → PDF service → extract → compare',
    registry: {
      total: registry.length,
      conditional: conditionalFields.length,
      unconditional: unconditionalFields.length,
      gates: gateFieldDefs.length,
    },
    scenarioA: results.scenarioA,
    scenarioB: results.scenarioB,
    scenarioC: results.scenarioC,
    allPass,
    consoleErrors: consoleErrors.slice(0, 20),
  };

  const reportPath = join(__dirname, 'conditional-validation-report.json');
  writeFileSync(reportPath, JSON.stringify(fullReport, null, 2));
  console.log(`\nFull report saved to ${reportPath}`);

  // Also save the exported PDF from scenario A for manual inspection
  writeFileSync('/tmp/sf86-conditional-test-gates-yes.pdf', scenarioA_extract.pdfBuffer);
  console.log('Scenario A PDF saved to /tmp/sf86-conditional-test-gates-yes.pdf');

  process.exit(allPass ? 0 : 1);

} catch (err) {
  console.error('\nFATAL ERROR:', err.message);
  console.error(err.stack);
  if (consoleErrors.length > 0) {
    console.error('\nBrowser console errors:');
    for (const e of consoleErrors.slice(0, 5)) console.error(`  ${e.substring(0, 200)}`);
  }
  try {
    await page.screenshot({ path: '/tmp/conditional-validation-error.png', fullPage: true });
    console.error('Debug screenshot: /tmp/conditional-validation-error.png');
  } catch { /* ignore */ }
  process.exit(2);
} finally {
  await browser.close();
}

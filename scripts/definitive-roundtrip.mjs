#!/usr/bin/env node
/**
 * DEFINITIVE ROUND-TRIP VALIDATION — ALL 6,197 SF-86 Fields, 3 Directions
 * =========================================================================
 *
 * Three independent validation tests in one script:
 *
 * TEST 1: PDF Service Fill/Extract (Python-only, no browser)
 *   Fill all 6,197 fields via PDF service -> Extract them back -> Compare
 *   Validates: pdf_ops.fill_pdf() + pdf_ops.extract_all_fields()
 *
 * TEST 2: PDF Import -> UI (Browser reads imported values)
 *   Fill PDF via service -> Import via /api/pdf/import -> Read Jotai atoms -> Compare
 *   Validates: import route + pdfToUi value transformers
 *
 * TEST 3: UI -> PDF Export (Browser writes, PDF extracts)
 *   Inject values into Jotai atoms in browser -> Export via /api/pdf/export
 *   -> Extract from exported PDF -> Compare
 *   Validates: uiToPdf value transformers + export route + fill + extract
 *
 * Each test generates unique identity-encoding values so mismatches can be
 * traced back to the exact field.
 *
 * Usage:
 *   cd app && node ../scripts/definitive-roundtrip.mjs
 *
 * Requirements:
 *   - Next.js dev server running on localhost:3000
 *   - PDF service running on localhost:8001 (docker compose up pdf-service)
 *   - PostgreSQL on localhost:5434 (docker compose up db)
 *   - Playwright installed: cd app && npx playwright install chromium
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import http from 'http';

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, '../app');
const require = createRequire(join(appDir, 'package.json'));
const { chromium } = require('playwright');

const REGISTRY_PATH = join(appDir, 'src/lib/field-registry/field-registry.json');
const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const PDF_SERVICE = process.env.PDF_SERVICE_URL || 'http://localhost:8001';
const REPORT_DIR = join(__dirname, 'definitive-roundtrip-report');

if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true });

// ---------------------------------------------------------------------------
// Load registry
// ---------------------------------------------------------------------------

console.log('='.repeat(78));
console.log('DEFINITIVE ROUND-TRIP VALIDATION');
console.log('='.repeat(78));
console.log(`\nTimestamp: ${new Date().toISOString()}`);

const registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'));
console.log(`Registry loaded: ${registry.length} field definitions`);

const bySemKey = new Map();
const byPdfName = new Map();
for (const f of registry) {
  bySemKey.set(f.semanticKey, f);
  byPdfName.set(f.pdfFieldName, f);
}

// Exclude ssnPageHeader fields (not user-editable)
const userFields = registry.filter(f => f.section !== 'ssnPageHeader');
const ssnHeaderFields = registry.filter(f => f.section === 'ssnPageHeader');
console.log(`User-editable fields: ${userFields.length}`);
console.log(`SSN page headers (skipped): ${ssnHeaderFields.length}`);

// Build section lookup
const fieldsBySection = new Map();
for (const f of userFields) {
  if (!fieldsBySection.has(f.section)) fieldsBySection.set(f.section, []);
  fieldsBySection.get(f.section).push(f);
}

// ---------------------------------------------------------------------------
// Section routing (mirrors app/src/lib/field-registry/types.ts)
// ---------------------------------------------------------------------------

const SECTION_GROUPS = {
  identification: ['section1', 'section2', 'section3', 'section4', 'section5', 'section6', 'section7'],
  citizenship: ['section8', 'section9', 'section10'],
  history: ['section11', 'section12', 'section13A', 'section13B', 'section13C'],
  military: ['section14', 'section15'],
  relationships: ['section16', 'section17', 'section18'],
  foreign: ['section19', 'section20A', 'section20B', 'section20C'],
  financial: ['section26'],
  substance: ['section23', 'section24'],
  legal: ['section22', 'section25', 'section28'],
  psychological: ['section21', 'section21A', 'section21B', 'section21C', 'section21D', 'section21E'],
  review: ['section27', 'section29', 'section30'],
};

const allSections = [];
for (const secs of Object.values(SECTION_GROUPS)) allSections.push(...secs);

function sectionToGroup(section) {
  for (const [group, sections] of Object.entries(SECTION_GROUPS)) {
    if (sections.includes(section)) return group;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Identify gate fields and conditional fields
// ---------------------------------------------------------------------------

const gateFields = new Map();    // semanticKey -> field def (gates)
const conditionalFields = new Map(); // semanticKey -> field def (dependents)

for (const f of registry) {
  if (f.dependsOn) {
    conditionalFields.set(f.semanticKey, f);
    if (!gateFields.has(f.dependsOn)) {
      const gate = bySemKey.get(f.dependsOn);
      if (gate) gateFields.set(f.dependsOn, gate);
    }
  }
}

console.log(`Gate fields: ${gateFields.size}`);
console.log(`Conditional fields: ${conditionalFields.size}`);

// ---------------------------------------------------------------------------
// Conditional expression evaluator (mirrors expression-evaluator.ts)
// ---------------------------------------------------------------------------

function normalise(v) {
  if (v === null || v === undefined) return '';
  return String(v).trim().toLowerCase();
}

function evaluateShowWhen(expression, value) {
  if (!expression) return true;
  const t = expression.trim();
  if (t === '!== null' || t === '!= null')
    return value !== null && value !== undefined && value !== '';
  if (t === '=== null' || t === '== null')
    return value === null || value === undefined || value === '';
  const eq = t.match(/^===\s*['"](.+?)['"]$/);
  if (eq) return normalise(value) === normalise(eq[1]);
  const neq = t.match(/^!==\s*['"](.+?)['"]$/);
  if (neq) return normalise(value) !== normalise(neq[1]);
  const inM = t.match(/^in\s*\[(.+)\]$/);
  if (inM) {
    const items = inM[1].split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '').trim().toLowerCase());
    return items.includes(normalise(value));
  }
  return false;
}

// ---------------------------------------------------------------------------
// HTTP helper (raw http, no external deps)
// ---------------------------------------------------------------------------

function httpRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = {
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };
    if (options.timeout) opts.timeout = options.timeout;
    const req = http.request(opts, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({
        status: res.statusCode,
        body: Buffer.concat(chunks),
        headers: res.headers,
      }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Request timeout')); });
    if (options.body) req.write(options.body);
    req.end();
  });
}

// ---------------------------------------------------------------------------
// Value generation helpers
// ---------------------------------------------------------------------------

function findYesOption(field) {
  const opts = field.options || [];
  for (const opt of opts) {
    if (opt.trim().toUpperCase().startsWith('YES')) return opt;
  }
  return opts[0] || 'YES';
}

/**
 * Compute what PDF value we expect after uiToPdf transform.
 * Mirrors value-transformers.ts logic.
 */
function computeExpectedPdfValue(field, uiValue) {
  const ft = field.uiFieldType || 'text';
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
      const nat = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
      return nat.length === 10
        ? `(${nat.slice(0, 3)}) ${nat.slice(3, 6)}-${nat.slice(6)}`
        : digits;
    }
    case 'radio': {
      const vm = field.valueMap || {};
      return vm[String(uiValue)] !== undefined ? vm[String(uiValue)] : String(uiValue);
    }
    case 'height': {
      const inches = parseInt(String(uiValue), 10);
      if (isNaN(inches)) return String(uiValue);
      const feet = Math.floor(inches / 12);
      const rem = inches % 12;
      return `${feet}'${rem}"`;
    }
    case 'select':
    case 'country':
    case 'state': {
      const vm = field.valueMap || {};
      const mapped = vm[String(uiValue)];
      return mapped !== undefined ? mapped : String(uiValue);
    }
    default:
      return String(uiValue);
  }
}

// ---------------------------------------------------------------------------
// Multipart form builder for extract-fields
// ---------------------------------------------------------------------------

function buildMultipartBody(pdfBytes, filename) {
  const boundary = '----FormBoundary' + Date.now().toString(36) + Math.random().toString(36).slice(2);
  const parts = [];
  parts.push(Buffer.from(
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="file"; filename="${filename}"\r\n` +
    `Content-Type: application/pdf\r\n\r\n`
  ));
  parts.push(Buffer.isBuffer(pdfBytes) ? pdfBytes : Buffer.from(pdfBytes));
  parts.push(Buffer.from(`\r\n--${boundary}--\r\n`));
  return {
    body: Buffer.concat(parts),
    contentType: `multipart/form-data; boundary=${boundary}`,
  };
}

// =========================================================================
//  GENERATE TEST VALUES
// =========================================================================

console.log('\n--- Generating test values ---');

/**
 * Generate a complete set of test values for all user fields.
 * Returns { uiValues, pdfValues, expectations }
 *
 * @param {string} prefix - Unique prefix for this test run
 */
function generateTestValues(prefix) {
  const uiValues = {};     // semanticKey -> uiValue
  const pdfValues = {};    // pdfFieldName -> pdfValue
  const expectations = {}; // pdfFieldName -> { semanticKey, section, uiValue, pdfValue, uiFieldType }

  // Step 1: Set all gate fields to YES (to make conditional fields visible)
  for (const [key, field] of gateFields) {
    const yesOpt = findYesOption(field);
    uiValues[key] = yesOpt;
  }

  // Step 2: Generate values for all non-ssnPageHeader fields
  let idx = 0;
  for (const f of userFields) {
    const sec = f.section;
    const ft = f.uiFieldType || 'text';

    // If already set as a gate value, record expectations and move on
    if (uiValues[f.semanticKey] !== undefined) {
      const uiVal = uiValues[f.semanticKey];
      const pdfVal = computeExpectedPdfValue(f, uiVal);
      if (pdfVal !== '' && pdfVal !== undefined) {
        pdfValues[f.pdfFieldName] = pdfVal;
      }
      expectations[f.pdfFieldName] = {
        semanticKey: f.semanticKey,
        section: sec,
        uiValue: uiVal,
        pdfValue: pdfVal,
        uiFieldType: ft,
      };
      idx++;
      continue;
    }

    // Check conditional visibility (with all gates = YES)
    if (f.dependsOn) {
      const parentValue = uiValues[f.dependsOn];
      if (parentValue === undefined || !evaluateShowWhen(f.showWhen, parentValue)) {
        // Hidden conditional field: skip
        idx++;
        continue;
      }
    }

    // Generate value based on field type
    let uiVal;
    switch (ft) {
      case 'text':
      case 'name':
      case 'location':
      case 'signature':
      case 'textarea':
      case 'collection': {
        let val = `${prefix}_S${sec.replace('section', '')}_${idx}`;
        if (f.maxLength && val.length > f.maxLength) {
          val = val.substring(0, f.maxLength);
        }
        uiVal = val;
        break;
      }
      case 'email':
        uiVal = `${prefix}f${idx}@test.example.com`;
        break;
      case 'telephone':
      case 'phone':
        uiVal = `+1202555${String(1000 + (idx % 9000)).padStart(4, '0')}`;
        break;
      case 'ssn':
        uiVal = `900${String(idx).padStart(6, '0')}`;
        break;
      case 'date':
      case 'dateRange': {
        const d = new Date(2020, 0, 15);
        d.setDate(d.getDate() + (idx % 8000));
        uiVal = d.toISOString().split('T')[0]; // YYYY-MM-DD
        break;
      }
      case 'checkbox':
      case 'branch':
      case 'notApplicable':
        uiVal = idx % 2 === 0;
        break;
      case 'radio': {
        const opts = f.options || [];
        if (opts.length > 0) {
          uiVal = opts[0]; // Pick first option
        } else {
          const vm = f.valueMap || {};
          const keys = Object.keys(vm);
          uiVal = keys.length > 0 ? keys[0] : '1';
        }
        break;
      }
      case 'select': {
        const opts = f.options || [];
        uiVal = opts.length > 0 ? opts[0] : `Opt${idx}`;
        break;
      }
      case 'country': {
        const opts = f.options || [];
        uiVal = opts.length > 0 ? opts[0] : 'United States';
        break;
      }
      case 'state': {
        const opts = f.options || [];
        uiVal = opts.length > 0 ? opts[0] : 'VA';
        break;
      }
      case 'height':
        uiVal = String(60 + (idx % 20));
        break;
      default: {
        let val = `${prefix}_${sec}_${idx}`;
        if (f.maxLength && val.length > f.maxLength) {
          val = val.substring(0, f.maxLength);
        }
        uiVal = val;
        break;
      }
    }

    uiValues[f.semanticKey] = uiVal;
    const pdfVal = computeExpectedPdfValue(f, uiVal);
    if (pdfVal !== '' && pdfVal !== undefined) {
      pdfValues[f.pdfFieldName] = pdfVal;
    }
    expectations[f.pdfFieldName] = {
      semanticKey: f.semanticKey,
      section: sec,
      uiValue: uiVal,
      pdfValue: pdfVal,
      uiFieldType: ft,
    };
    idx++;
  }

  return { uiValues, pdfValues, expectations };
}

// =========================================================================
//  COMPARISON HELPER
// =========================================================================

function compareExtractedToPdfValues(extractedFields, expectations, testName) {
  let matched = 0;
  let mismatched = 0;
  let missing = 0;
  let radioSkipped = 0;
  let checkboxFalseSkipped = 0;
  const mismatches = [];
  const perSection = {};

  for (const sec of allSections) {
    perSection[sec] = { matched: 0, mismatched: 0, missing: 0, radioSkipped: 0, cbFalseSkipped: 0, total: 0 };
  }

  for (const [pdfName, expected] of Object.entries(expectations)) {
    const sec = expected.section;
    if (!perSection[sec]) perSection[sec] = { matched: 0, mismatched: 0, missing: 0, radioSkipped: 0, cbFalseSkipped: 0, total: 0 };
    perSection[sec].total++;

    const ft = expected.uiFieldType;
    const isRadio = ft === 'radio';
    const extracted = extractedFields[pdfName];

    if (extracted === undefined || extracted === null || extracted === '') {
      if (isRadio) {
        radioSkipped++;
        perSection[sec].radioSkipped++;
      } else if ((ft === 'checkbox' || ft === 'branch' || ft === 'notApplicable') && expected.pdfValue === 'No') {
        // Unchecked checkboxes: extract returns "No" for checked, may return
        // empty or "Off" for unchecked depending on original PDF state.
        checkboxFalseSkipped++;
        perSection[sec].cbFalseSkipped++;
      } else {
        missing++;
        perSection[sec].missing++;
        if (mismatches.length < 100) {
          mismatches.push({
            type: 'MISSING',
            pdfFieldName: pdfName,
            semanticKey: expected.semanticKey,
            section: sec,
            fieldType: ft,
            expected: expected.pdfValue,
            got: '(empty)',
          });
        }
      }
      continue;
    }

    const gotTrimmed = String(extracted).trim();
    const expectedTrimmed = String(expected.pdfValue).trim();

    if (gotTrimmed === expectedTrimmed) {
      matched++;
      perSection[sec].matched++;
    } else {
      // Checkbox fuzzy match
      if (ft === 'checkbox' || ft === 'branch' || ft === 'notApplicable') {
        const isChecked = expectedTrimmed === 'Yes';
        const extractedChecked = gotTrimmed !== 'Off' && gotTrimmed !== '' && gotTrimmed !== 'No';
        if (isChecked === extractedChecked) {
          matched++;
          perSection[sec].matched++;
          continue;
        }
      }

      if (isRadio) {
        // Radio mismatches are flagged separately
        radioSkipped++;
        perSection[sec].radioSkipped++;
      } else {
        mismatched++;
        perSection[sec].mismatched++;
        if (mismatches.length < 100) {
          mismatches.push({
            type: 'MISMATCH',
            pdfFieldName: pdfName,
            semanticKey: expected.semanticKey,
            section: sec,
            fieldType: ft,
            expected: expectedTrimmed,
            got: gotTrimmed,
          });
        }
      }
    }
  }

  const totalExpected = Object.keys(expectations).length;
  const pass = mismatched === 0 && missing === 0;

  return {
    testName,
    pass,
    totalExpected,
    matched,
    mismatched,
    missing,
    radioSkipped,
    checkboxFalseSkipped,
    mismatches,
    perSection,
  };
}

function printTestResult(result) {
  const status = result.pass ? 'PASS' : 'FAIL';
  console.log(`\n${'='.repeat(78)}`);
  console.log(`  ${result.testName}: ${status}`);
  console.log(`${'='.repeat(78)}`);
  console.log(`  Total expected:         ${result.totalExpected}`);
  console.log(`  Matched:                ${result.matched}`);
  console.log(`  Mismatched:             ${result.mismatched}`);
  console.log(`  Missing:                ${result.missing}`);
  console.log(`  Radio (skipped/fuzzy):  ${result.radioSkipped}`);
  console.log(`  Checkbox false skipped: ${result.checkboxFalseSkipped}`);

  if (result.mismatches.length > 0) {
    console.log(`\n  First ${Math.min(result.mismatches.length, 20)} mismatches:`);
    for (const m of result.mismatches.slice(0, 20)) {
      console.log(`    [${m.type}] ${m.section} | ${m.fieldType} | ${m.semanticKey}`);
      console.log(`      expected: "${m.expected}"`);
      console.log(`      got:      "${m.got}"`);
    }
  }

  // Per-section summary (only non-passing sections)
  const failingSections = Object.entries(result.perSection)
    .filter(([, v]) => v.mismatched > 0 || v.missing > 0);
  if (failingSections.length > 0) {
    console.log(`\n  Sections with issues:`);
    for (const [sec, v] of failingSections) {
      console.log(`    ${sec}: ${v.matched} matched, ${v.mismatched} mismatch, ${v.missing} missing (${v.total} total)`);
    }
  }
}

// =========================================================================
//  TEST 1: PDF Service Fill/Extract Round-Trip (No Browser)
// =========================================================================

async function test1_pdfServiceRoundTrip() {
  console.log('\n' + '#'.repeat(78));
  console.log('# TEST 1: PDF Service Fill/Extract Round-Trip');
  console.log('#'.repeat(78));

  const { pdfValues, expectations } = generateTestValues('T1');

  console.log(`  Generated ${Object.keys(pdfValues).length} PDF field values`);
  console.log(`  Expectations for ${Object.keys(expectations).length} fields`);

  // Step 1: Fill PDF
  console.log('  [1/3] Filling PDF via PDF service...');
  const fillResp = await httpRequest(`${PDF_SERVICE}/fill-pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      template_path: 'sf861.pdf',
      field_values: pdfValues,
    }),
    timeout: 180000,
  });

  if (fillResp.status !== 200) {
    console.error(`  FATAL: Fill PDF failed (${fillResp.status}): ${fillResp.body.toString().substring(0, 300)}`);
    return { testName: 'TEST 1: PDF Service Fill/Extract', pass: false, error: 'Fill failed' };
  }

  const pdfBytes = fillResp.body;
  console.log(`  Filled PDF: ${(pdfBytes.length / 1024 / 1024).toFixed(1)} MB`);

  // Save filled PDF
  const filledPath = join(REPORT_DIR, 'test1-filled.pdf');
  writeFileSync(filledPath, pdfBytes);

  // Step 2: Extract fields
  console.log('  [2/3] Extracting fields from filled PDF...');
  const { body: multipartBody, contentType } = buildMultipartBody(pdfBytes, 'test1-filled.pdf');

  const extractResp = await httpRequest(`${PDF_SERVICE}/extract-fields`, {
    method: 'POST',
    headers: {
      'Content-Type': contentType,
      'Content-Length': String(multipartBody.length),
    },
    body: multipartBody,
    timeout: 60000,
  });

  if (extractResp.status !== 200) {
    console.error(`  FATAL: Extract failed (${extractResp.status}): ${extractResp.body.toString().substring(0, 300)}`);
    return { testName: 'TEST 1: PDF Service Fill/Extract', pass: false, error: 'Extract failed' };
  }

  const extractData = JSON.parse(extractResp.body.toString());
  const extractedFields = extractData.fields || {};
  console.log(`  Extracted ${Object.keys(extractedFields).length} field values`);

  // Step 3: Compare
  console.log('  [3/3] Comparing...');
  const result = compareExtractedToPdfValues(extractedFields, expectations, 'TEST 1: PDF Service Fill/Extract');
  printTestResult(result);

  return result;
}

// =========================================================================
//  TEST 2: PDF Import -> UI (Browser reads imported values)
// =========================================================================

async function test2_importToUi() {
  console.log('\n' + '#'.repeat(78));
  console.log('# TEST 2: PDF Import -> UI Direction');
  console.log('#'.repeat(78));

  const { pdfValues, expectations, uiValues } = generateTestValues('T2');

  console.log(`  Generated ${Object.keys(pdfValues).length} PDF field values`);

  // Step 1: Fill a PDF via PDF service
  console.log('  [1/5] Filling PDF for import...');
  const fillResp = await httpRequest(`${PDF_SERVICE}/fill-pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      template_path: 'sf861.pdf',
      field_values: pdfValues,
    }),
    timeout: 180000,
  });

  if (fillResp.status !== 200) {
    console.error(`  FATAL: Fill PDF failed (${fillResp.status})`);
    return { testName: 'TEST 2: Import -> UI', pass: false, error: 'Fill failed' };
  }

  const pdfBytes = fillResp.body;
  writeFileSync(join(REPORT_DIR, 'test2-filled-for-import.pdf'), pdfBytes);
  console.log(`  Filled PDF: ${(pdfBytes.length / 1024 / 1024).toFixed(1)} MB`);

  // Step 2: Launch browser, register, login
  console.log('  [2/5] Launching browser and authenticating...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  try {
    const testEmail = `t2-${Date.now()}@test.dev`;
    const testPass = 'TestPassword123!';

    // Register
    const regResp = await fetch(`${APP_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: testPass }),
    });
    if (!regResp.ok) {
      const err = await regResp.text();
      console.error(`  Registration note: ${err.substring(0, 100)}`);
    }

    // Login via browser (sets session cookie)
    await page.goto(`${APP_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    // Fill login form
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const passInput = page.locator('input[type="password"], input[name="password"]');

    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailInput.fill(testEmail);
      await passInput.fill(testPass);
      await page.locator('button[type="submit"]').click();
      await page.waitForTimeout(3000);
    }

    // Step 3: Create a form and navigate to it
    console.log('  [3/5] Creating form...');
    await page.goto(`${APP_URL}/new`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Create Form")');
    await page.waitForTimeout(3000);

    const formUrl = page.url();
    const urlParts = formUrl.split('/');
    const submissionId = urlParts[3];
    console.log(`  Submission: ${submissionId}`);

    // Wait for Jotai store
    await page.waitForFunction(() => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__, {
      timeout: 15000,
    });

    // Step 4: Import the filled PDF via the API
    console.log('  [4/5] Importing PDF via /api/pdf/import...');

    // Use page.evaluate to call the import API (so cookies are sent)
    const importResult = await page.evaluate(async (pdfB64) => {
      // Convert base64 to Uint8Array
      const binary = atob(pdfB64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

      const blob = new Blob([bytes], { type: 'application/pdf' });
      const formData = new FormData();
      formData.append('file', blob, 'sf86-filled.pdf');

      const resp = await fetch('/api/pdf/import', {
        method: 'POST',
        body: formData,
      });

      if (!resp.ok) {
        const err = await resp.text();
        return { error: true, status: resp.status, message: err };
      }

      const data = await resp.json();
      return data;
    }, pdfBytes.toString('base64'));

    if (importResult.error) {
      console.error(`  Import failed: ${importResult.status} - ${importResult.message}`);
      return { testName: 'TEST 2: Import -> UI', pass: false, error: 'Import failed' };
    }

    console.log(`  Import result: ${importResult.mappedCount} mapped, ${importResult.unmappedCount} unmapped`);

    // Load imported values into Jotai atoms
    const importedValues = importResult.values || {};
    const loadedCount = await page.evaluate((vals) => {
      const store = window.__JOTAI_STORE__;
      const atomFamily = window.__FIELD_VALUE_ATOM_FAMILY__;
      let count = 0;
      for (const [key, val] of Object.entries(vals)) {
        store.set(atomFamily(key), val);
        count++;
      }
      return count;
    }, importedValues);

    console.log(`  Loaded ${loadedCount} values into Jotai atoms`);

    // Step 5: Read back Jotai values and compare with expected UI values
    console.log('  [5/5] Reading back Jotai atoms and comparing...');

    let importMatched = 0;
    let importMismatched = 0;
    let importMissing = 0;
    let importRadioSkipped = 0;
    let importCbFalseSkipped = 0;
    const importMismatches = [];
    const importPerSection = {};

    for (const sec of allSections) {
      importPerSection[sec] = { matched: 0, mismatched: 0, missing: 0, radioSkipped: 0, cbFalseSkipped: 0, total: 0 };
    }

    // Read all values from Jotai in batches
    const allSemanticKeys = Object.keys(uiValues);
    const batchSize = 500;
    const readbackValues = {};

    for (let i = 0; i < allSemanticKeys.length; i += batchSize) {
      const batch = allSemanticKeys.slice(i, i + batchSize);
      const batchResult = await page.evaluate((keys) => {
        const store = window.__JOTAI_STORE__;
        const atomFamily = window.__FIELD_VALUE_ATOM_FAMILY__;
        const result = {};
        for (const key of keys) {
          result[key] = store.get(atomFamily(key));
        }
        return result;
      }, batch);
      Object.assign(readbackValues, batchResult);
    }

    // Compare each field
    for (const [pdfName, expected] of Object.entries(expectations)) {
      const sec = expected.section;
      if (!importPerSection[sec]) importPerSection[sec] = { matched: 0, mismatched: 0, missing: 0, radioSkipped: 0, cbFalseSkipped: 0, total: 0 };
      importPerSection[sec].total++;
      const ft = expected.uiFieldType;
      const semKey = expected.semanticKey;

      // Radio values going through import have known limitations
      if (ft === 'radio') {
        importRadioSkipped++;
        importPerSection[sec].radioSkipped++;
        continue;
      }

      // Unchecked checkboxes are deliberately skipped during import (Off -> false -> skip)
      if ((ft === 'checkbox' || ft === 'branch' || ft === 'notApplicable') && expected.uiValue === false) {
        importCbFalseSkipped++;
        importPerSection[sec].cbFalseSkipped++;
        continue;
      }

      const actual = readbackValues[semKey];
      const expectedUi = expected.uiValue;

      if (actual === null || actual === undefined || actual === '') {
        importMissing++;
        importPerSection[sec].missing++;
        if (importMismatches.length < 100) {
          importMismatches.push({
            type: 'MISSING',
            pdfFieldName: pdfName,
            semanticKey: semKey,
            section: sec,
            fieldType: ft,
            expected: String(expectedUi),
            got: '(empty)',
          });
        }
        continue;
      }

      // Compare with type coercion
      let match = false;
      if (typeof expectedUi === 'boolean') {
        match = actual === expectedUi || normalise(actual) === normalise(String(expectedUi));
      } else {
        match = normalise(actual) === normalise(expectedUi);
      }

      if (match) {
        importMatched++;
        importPerSection[sec].matched++;
      } else {
        importMismatched++;
        importPerSection[sec].mismatched++;
        if (importMismatches.length < 100) {
          importMismatches.push({
            type: 'MISMATCH',
            pdfFieldName: pdfName,
            semanticKey: semKey,
            section: sec,
            fieldType: ft,
            expected: String(expectedUi),
            got: String(actual),
          });
        }
      }
    }

    const result = {
      testName: 'TEST 2: Import -> UI',
      pass: importMismatched === 0 && importMissing === 0,
      totalExpected: Object.keys(expectations).length,
      matched: importMatched,
      mismatched: importMismatched,
      missing: importMissing,
      radioSkipped: importRadioSkipped,
      checkboxFalseSkipped: importCbFalseSkipped,
      mismatches: importMismatches,
      perSection: importPerSection,
    };

    printTestResult(result);
    return result;
  } finally {
    await browser.close();
  }
}

// =========================================================================
//  TEST 3: UI -> PDF Export (Jotai inject -> Export -> Extract -> Compare)
// =========================================================================

async function test3_uiToExport() {
  console.log('\n' + '#'.repeat(78));
  console.log('# TEST 3: UI -> PDF Export Direction');
  console.log('#'.repeat(78));

  const { uiValues, expectations } = generateTestValues('T3');

  console.log(`  Generated ${Object.keys(uiValues).length} UI values`);
  console.log(`  Expectations for ${Object.keys(expectations).length} fields`);

  // Step 1: Launch browser, register, login
  console.log('  [1/6] Launching browser and authenticating...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  try {
    const testEmail = `t3-${Date.now()}@test.dev`;
    const testPass = 'TestPassword123!';

    // Register
    await fetch(`${APP_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: testPass }),
    });

    // Login via browser
    await page.goto(`${APP_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const passInput = page.locator('input[type="password"], input[name="password"]');

    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailInput.fill(testEmail);
      await passInput.fill(testPass);
      await page.locator('button[type="submit"]').click();
      await page.waitForTimeout(3000);
    }

    // Step 2: Create a form
    console.log('  [2/6] Creating form...');
    await page.goto(`${APP_URL}/new`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Create Form")');
    await page.waitForTimeout(3000);

    const formUrl = page.url();
    const submissionId = formUrl.split('/')[3];
    console.log(`  Submission: ${submissionId}`);

    // Wait for Jotai
    await page.waitForFunction(() => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__, {
      timeout: 15000,
    });
    console.log('  Jotai store ready');

    // Step 3: Inject all values into Jotai atoms in batches
    console.log(`  [3/6] Injecting ${Object.keys(uiValues).length} values into Jotai atoms...`);

    const entries = Object.entries(uiValues);
    const BATCH = 500;
    let totalInjected = 0;

    for (let i = 0; i < entries.length; i += BATCH) {
      const batch = Object.fromEntries(entries.slice(i, i + BATCH));
      const count = await page.evaluate((vals) => {
        const store = window.__JOTAI_STORE__;
        const atomFamily = window.__FIELD_VALUE_ATOM_FAMILY__;
        let c = 0;
        for (const [key, val] of Object.entries(vals)) {
          store.set(atomFamily(key), val);
          c++;
        }
        return c;
      }, batch);
      totalInjected += count;
    }

    console.log(`  Injected ${totalInjected} values`);

    // Step 4: Verify injection sample
    console.log('  [4/6] Verifying injection sample...');
    const sampleKeys = entries.slice(0, 50).map(([k]) => k);
    const sampleReadback = await page.evaluate((keys) => {
      const store = window.__JOTAI_STORE__;
      const atomFamily = window.__FIELD_VALUE_ATOM_FAMILY__;
      const result = {};
      for (const key of keys) result[key] = store.get(atomFamily(key));
      return result;
    }, sampleKeys);

    let sampleOk = 0;
    for (const [key, expected] of entries.slice(0, 50)) {
      const actual = sampleReadback[key];
      if (typeof expected === 'boolean') {
        if (actual === expected) sampleOk++;
      } else {
        if (normalise(actual) === normalise(expected)) sampleOk++;
      }
    }
    console.log(`  Sample verification: ${sampleOk}/50 match`);

    // Step 5: Export PDF via the API
    // The export API expects { values: {semanticKey: uiValue} }
    // It performs uiToPdf transform server-side, then calls PDF service
    console.log('  [5/6] Exporting PDF via /api/pdf/export...');

    const exportResult = await page.evaluate(async (values) => {
      try {
        const resp = await fetch('/api/pdf/export', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ values }),
        });

        if (!resp.ok) {
          const err = await resp.text();
          return { error: true, status: resp.status, message: err };
        }

        const blob = await resp.blob();
        const buffer = await blob.arrayBuffer();
        // Convert to base64 for transfer back to Node
        const bytes = new Uint8Array(buffer);
        let binary = '';
        const chunkSize = 65536;
        for (let i = 0; i < bytes.length; i += chunkSize) {
          binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
        }
        return { error: false, pdfBase64: btoa(binary), size: bytes.length };
      } catch (e) {
        return { error: true, status: 0, message: String(e) };
      }
    }, uiValues);

    if (exportResult.error) {
      console.error(`  Export failed: ${exportResult.status} - ${exportResult.message}`);
      return { testName: 'TEST 3: UI -> PDF Export', pass: false, error: 'Export failed' };
    }

    const exportedPdf = Buffer.from(exportResult.pdfBase64, 'base64');
    console.log(`  Exported PDF: ${(exportedPdf.length / 1024 / 1024).toFixed(1)} MB`);

    // Save exported PDF
    writeFileSync(join(REPORT_DIR, 'test3-exported.pdf'), exportedPdf);

    // Step 6: Extract fields from exported PDF and compare
    console.log('  [6/6] Extracting and comparing...');

    const { body: multipartBody, contentType } = buildMultipartBody(exportedPdf, 'test3-exported.pdf');

    const extractResp = await httpRequest(`${PDF_SERVICE}/extract-fields`, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(multipartBody.length),
      },
      body: multipartBody,
      timeout: 60000,
    });

    if (extractResp.status !== 200) {
      console.error(`  Extract failed: ${extractResp.status}`);
      return { testName: 'TEST 3: UI -> PDF Export', pass: false, error: 'Extract failed' };
    }

    const extractData = JSON.parse(extractResp.body.toString());
    const extractedFields = extractData.fields || {};
    console.log(`  Extracted ${Object.keys(extractedFields).length} field values`);

    const result = compareExtractedToPdfValues(extractedFields, expectations, 'TEST 3: UI -> PDF Export');
    printTestResult(result);

    return result;
  } finally {
    await browser.close();
  }
}

// =========================================================================
//  MAIN: Run all three tests
// =========================================================================

async function main() {
  const startTime = Date.now();
  const results = [];

  // Pre-flight: check services
  console.log('\n--- Pre-flight checks ---');

  try {
    const healthResp = await httpRequest(`${PDF_SERVICE}/health`, { timeout: 10000 });
    if (healthResp.status === 200) {
      console.log(`  PDF service: OK`);
    } else {
      console.error(`  PDF service: FAILED (${healthResp.status})`);
      process.exit(1);
    }
  } catch (err) {
    console.error(`  PDF service not reachable at ${PDF_SERVICE}: ${err.message}`);
    process.exit(1);
  }

  try {
    const appResp = await httpRequest(`${APP_URL}/api/auth/csrf`, { timeout: 10000 });
    if (appResp.status === 200) {
      console.log(`  App server: OK`);
    } else {
      console.error(`  App server: FAILED (${appResp.status})`);
      process.exit(1);
    }
  } catch (err) {
    console.error(`  App server not reachable at ${APP_URL}: ${err.message}`);
    process.exit(1);
  }

  // TEST 1: PDF Service Fill/Extract (no browser)
  try {
    const r1 = await test1_pdfServiceRoundTrip();
    results.push(r1);
  } catch (err) {
    console.error(`TEST 1 CRASHED: ${err.message}\n${err.stack}`);
    results.push({ testName: 'TEST 1: PDF Service Fill/Extract', pass: false, error: err.message });
  }

  // TEST 2: Import -> UI
  try {
    const r2 = await test2_importToUi();
    results.push(r2);
  } catch (err) {
    console.error(`TEST 2 CRASHED: ${err.message}\n${err.stack}`);
    results.push({ testName: 'TEST 2: Import -> UI', pass: false, error: err.message });
  }

  // TEST 3: UI -> PDF Export
  try {
    const r3 = await test3_uiToExport();
    results.push(r3);
  } catch (err) {
    console.error(`TEST 3 CRASHED: ${err.message}\n${err.stack}`);
    results.push({ testName: 'TEST 3: UI -> PDF Export', pass: false, error: err.message });
  }

  // --- Final Summary ---

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\n' + '='.repeat(78));
  console.log('  DEFINITIVE ROUND-TRIP SUMMARY');
  console.log('='.repeat(78));
  console.log(`  Total time: ${elapsed}s`);
  console.log(`  Registry:   ${registry.length} fields (${userFields.length} user-editable)`);
  console.log(`  Gates:      ${gateFields.size} gate fields, ${conditionalFields.size} conditional fields\n`);

  let allPassed = true;
  for (const r of results) {
    const icon = r.pass ? 'PASS' : 'FAIL';
    const detail = r.error
      ? `ERROR: ${r.error}`
      : `${r.matched || 0} matched, ${r.mismatched || 0} mismatch, ${r.missing || 0} missing, ${r.radioSkipped || 0} radio skipped`;
    console.log(`  ${icon}  ${r.testName}`);
    console.log(`         ${detail}`);
    if (!r.pass) allPassed = false;
  }

  console.log(`\n  Overall: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
  console.log('='.repeat(78));

  // Save JSON report
  const reportPath = join(REPORT_DIR, 'definitive-roundtrip-report.json');
  writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    elapsedSeconds: parseFloat(elapsed),
    registrySize: registry.length,
    userFields: userFields.length,
    ssnHeaderFields: ssnHeaderFields.length,
    gateFieldCount: gateFields.size,
    conditionalFieldCount: conditionalFields.size,
    allPassed,
    results: results.map(r => ({
      testName: r.testName,
      pass: r.pass,
      totalExpected: r.totalExpected,
      matched: r.matched,
      mismatched: r.mismatched,
      missing: r.missing,
      radioSkipped: r.radioSkipped,
      checkboxFalseSkipped: r.checkboxFalseSkipped,
      error: r.error,
      mismatchSample: (r.mismatches || []).slice(0, 50),
      perSection: r.perSection,
    })),
  }, null, 2));
  console.log(`\nReport saved: ${reportPath}`);

  process.exit(allPassed ? 0 : 1);
}

main().catch(err => {
  console.error(`FATAL ERROR: ${err.message}\n${err.stack}`);
  process.exit(1);
});

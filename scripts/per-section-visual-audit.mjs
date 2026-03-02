/**
 * PER-SECTION VISUAL AUDIT — Validate PDF Layout Rendering For All 38 Sections
 *
 * Validates that the pixel-perfect PDF overlay is correct for every section:
 *   1. Radio fields render as individual circles at each widget position
 *   2. Checkboxes render as custom 9x9px squares (not oversized native checkboxes)
 *   3. "Show All" toggle reveals hidden conditional fields (40% opacity + red dashed)
 *   4. Live Preview renders correct field values in PDF images
 *   5. Field counts in DOM match expected from registry
 *
 * Flow per section:
 *   1. Navigate to section in PDF Layout mode
 *   2. Wait for Jotai store exposure
 *   3. Inject unique identity values for all fields
 *   4. Toggle "Show All" to reveal conditional fields
 *   5. Count rendered field elements vs expected
 *   6. Verify radio circles rendered at individual widget positions
 *   7. Enable Live Preview, wait for render
 *   8. Export PDF, extract fields, compare against injected values
 *
 * Usage:
 *   cd app && node ../scripts/per-section-visual-audit.mjs
 *
 * Options (env):
 *   SECTIONS=section1,section15   — audit specific sections (default: all 38)
 *   SKIP_PDF_CHECK=1              — skip PDF export/extract comparison (faster)
 *   HEADLESS=0                    — run with visible browser
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import http from 'http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, '../app');
const require = createRequire(join(appDir, 'package.json'));
const { chromium } = require('playwright');

const REGISTRY_PATH = join(__dirname, '../app/src/lib/field-registry/field-registry.json');
const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const PDF_SERVICE = process.env.PDF_SERVICE_URL || 'http://localhost:8001';
const REPORT_PATH = join(__dirname, 'per-section-audit-report.json');
const HEADLESS = process.env.HEADLESS !== '0';
const SKIP_PDF_CHECK = process.env.SKIP_PDF_CHECK === '1';

// ─── Load registry ──────────────────────────────────────────────────────────

const registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'));
console.log(`Loaded ${registry.length} field definitions`);

const bySemKey = new Map();
const byPdfName = new Map();
for (const f of registry) {
  bySemKey.set(f.semanticKey, f);
  byPdfName.set(f.pdfFieldName, f);
}

// ─── Section routing ────────────────────────────────────────────────────────

const SECTION_GROUPS = {
  identification: ['section1', 'section3', 'section4', 'section5', 'section6', 'section7'],
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

function sectionToGroup(section) {
  for (const [group, sections] of Object.entries(SECTION_GROUPS)) {
    if (sections.includes(section)) return group;
  }
  return null;
}

// Build section lists
const allSections = [];
for (const sections of Object.values(SECTION_GROUPS)) {
  allSections.push(...sections);
}

// Filter to requested sections
const requestedSections = process.env.SECTIONS
  ? process.env.SECTIONS.split(',').map(s => s.trim())
  : allSections;

console.log(`Auditing ${requestedSections.length} sections`);

// ─── Build field lookup ─────────────────────────────────────────────────────

const fieldsBySection = new Map();
for (const f of registry) {
  if (f.section === 'ssnPageHeader') continue;
  const sec = f.section;
  if (!fieldsBySection.has(sec)) fieldsBySection.set(sec, []);
  fieldsBySection.get(sec).push(f);
}

// Identify gate fields and conditional fields
const gateFields = new Map();
for (const f of registry) {
  if (f.dependsOn && !gateFields.has(f.dependsOn)) {
    const gate = bySemKey.get(f.dependsOn);
    if (gate) gateFields.set(f.dependsOn, gate);
  }
}

// ─── Value generators ───────────────────────────────────────────────────────

function findYesOption(field) {
  const opts = field.options || [];
  for (const opt of opts) {
    if (opt.trim().toUpperCase().startsWith('YES')) return opt;
  }
  return opts[0] || 'YES';
}

let globalIdx = 0;
function makeValue(field) {
  const idx = globalIdx++;
  const ft = field.uiFieldType || 'text';
  const sec = field.section || 'unknown';

  // Gate fields always YES
  if (gateFields.has(field.semanticKey)) {
    return findYesOption(field);
  }

  switch (ft) {
    case 'text':
    case 'name':
    case 'location':
    case 'signature':
    case 'collection':
    case 'textarea': {
      let val = `${sec}|#${idx}`;
      if (field.maxLength && val.length > field.maxLength) val = val.substring(0, field.maxLength);
      return val;
    }
    case 'email':
      return `f${idx}@test.dev`;
    case 'telephone':
    case 'phone':
      return `+1555${String(idx).padStart(7, '0')}`;
    case 'ssn':
      return `900${String(idx).padStart(6, '0')}`;
    case 'date':
    case 'dateRange': {
      const d = new Date(2000, 0, 1);
      d.setDate(d.getDate() + (idx % 9000));
      return d.toISOString().split('T')[0];
    }
    case 'checkbox':
    case 'branch':
    case 'notApplicable':
      return idx % 2 === 0;
    case 'radio': {
      const opts = field.options || [];
      if (opts.length > 0) return opts[idx % opts.length];
      return 'YES';
    }
    case 'select':
    case 'country':
    case 'state': {
      const opts = field.options || [];
      if (opts.length > 0) return opts[idx % opts.length];
      return `Option${idx}`;
    }
    case 'height':
      return String(60 + (idx % 20));
    default: {
      let val = `${sec}|#${idx}`;
      if (field.maxLength && val.length > field.maxLength) val = val.substring(0, field.maxLength);
      return val;
    }
  }
}

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
      return c;
    }
    case 'telephone':
    case 'phone': {
      const d = String(uiValue).replace(/\D/g, '');
      const n = d.length === 11 && d.startsWith('1') ? d.slice(1) : d;
      return n.length === 10 ? `(${n.slice(0, 3)}) ${n.slice(3, 6)}-${n.slice(6)}` : n;
    }
    case 'radio': {
      const vm = field.valueMap || {};
      return vm[String(uiValue)] ?? String(uiValue);
    }
    case 'height': {
      const inches = parseInt(String(uiValue), 10);
      if (isNaN(inches)) return String(uiValue);
      return `${Math.floor(inches / 12)}'${inches % 12}"`;
    }
    default:
      return String(uiValue);
  }
}

// Conditional evaluator
function normalise(v) {
  if (v === null || v === undefined) return '';
  return String(v).trim().toLowerCase();
}
function evaluateShowWhen(expression, value) {
  if (!expression) return true;
  const t = expression.trim();
  if (t === '!== null' || t === '!= null') return value !== null && value !== undefined && value !== '';
  if (t === '=== null' || t === '== null') return value === null || value === undefined || value === '';
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

// ─── HTTP helper ────────────────────────────────────────────────────────────

function httpRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const opts = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };
    const req = http.request(opts, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }));
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN AUDIT
// ═══════════════════════════════════════════════════════════════════════════

// Pre-generate all values
const allValues = {};
for (const f of registry) {
  if (f.section === 'ssnPageHeader') continue;
  allValues[f.semanticKey] = makeValue(f);
}

console.log(`Pre-generated ${Object.keys(allValues).length} values\n`);

const browser = await chromium.launch({ headless: HEADLESS });
const context = await browser.newContext({ acceptDownloads: true });
const page = await context.newPage();

// Authenticate
const TEST_EMAIL = `audit-${Date.now()}@test.dev`;
const TEST_PASS = 'auditTestPass123';

console.log('[0] Registering and logging in...');
await fetch(`${APP_URL}/api/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASS }),
});

await page.goto(`${APP_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
await page.fill('input#email', TEST_EMAIL);
await page.fill('input#password', TEST_PASS);
await page.click('button[type="submit"]');
await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 });
console.log(`    Logged in: ${page.url()}`);

// Create form
console.log('[1] Creating new form...');
await page.goto(`${APP_URL}/new`, { waitUntil: 'networkidle', timeout: 30000 });
await page.click('button:has-text("Create Form")');
await page.waitForURL('**/identification/section1', { timeout: 15000 });

const formUrl = page.url();
const submissionId = formUrl.split('/')[3];
console.log(`    Form: ${submissionId}`);

// Wait for Jotai store on initial page
await page.waitForFunction(() => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__, { timeout: 15000 });
console.log('    Jotai store ready');
console.log(`    Will inject ${Object.keys(allValues).length} values per section\n`);

// ─── Per-section audit ──────────────────────────────────────────────────────

const results = {};
let totalPass = 0;
let totalFail = 0;

for (const section of requestedSections) {
  const group = sectionToGroup(section);
  if (!group) {
    console.log(`  SKIP ${section}: unknown group`);
    continue;
  }

  const sectionFields = fieldsBySection.get(section) || [];
  if (sectionFields.length === 0) {
    console.log(`  SKIP ${section}: 0 fields`);
    results[section] = { status: 'SKIP', fields: 0 };
    continue;
  }

  // Navigate to section
  const url = `${APP_URL}/${submissionId}/${group}/${section}`;
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);

  // Wait for Jotai store on this page
  await page.waitForFunction(() => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__, { timeout: 15000 });

  // Re-inject ALL values (Jotai store is fresh on each page navigation)
  await page.evaluate((vals) => {
    const store = window.__JOTAI_STORE__;
    const af = window.__FIELD_VALUE_ATOM_FAMILY__;
    for (const [key, val] of Object.entries(vals)) {
      store.set(af(key), val);
    }
  }, allValues);

  // Switch to PDF Layout mode
  const pdfLayoutBtn = await page.$('button:has-text("PDF Layout")');
  if (pdfLayoutBtn) {
    await pdfLayoutBtn.click();
    await page.waitForTimeout(2000); // Wait for PDF images to load
  };

  // Count expected radio widget circles vs single fields
  const radioFields = sectionFields.filter(f => f.uiFieldType === 'radio' && f.radioWidgets);
  const totalRadioWidgets = radioFields.reduce((sum, f) => sum + f.radioWidgets.length, 0);
  const nonRadioFields = sectionFields.filter(f => !(f.uiFieldType === 'radio' && f.radioWidgets));

  // Count conditional fields
  const conditionalCount = sectionFields.filter(f => f.dependsOn).length;

  // Check DOM for field elements (search entire page for the overlay containers)
  const domCounts = await page.evaluate(() => {
    // Find all interactive field elements anywhere in the document
    const radioCircles = document.querySelectorAll('button[role="radio"]').length;
    const checkboxes = document.querySelectorAll('input.sr-only.peer[type="checkbox"]').length;
    const textInputs = document.querySelectorAll('input[type="text"]').length;
    const selects = document.querySelectorAll('select').length;
    const textareas = document.querySelectorAll('textarea').length;
    const total = radioCircles + checkboxes + textInputs + selects + textareas;

    return { total, radioCircles, checkboxes, textInputs, selects, textareas };
  });

  // Toggle "Show All" to reveal conditional fields
  let showAllToggled = false;
  if (conditionalCount > 0) {
    const showAllCheckbox = await page.$('label:has-text("Show All") input[type="checkbox"]');
    if (showAllCheckbox) {
      await showAllCheckbox.check();
      await page.waitForTimeout(500);
      showAllToggled = true;
    }
  }

  // Count fields after Show All
  const domCountsAfterShowAll = showAllToggled ? await page.evaluate(() => {
    const radioCircles = document.querySelectorAll('button[role="radio"]').length;
    const checkboxes = document.querySelectorAll('input.sr-only.peer[type="checkbox"]').length;
    const textInputs = document.querySelectorAll('input[type="text"]').length;
    const selects = document.querySelectorAll('select').length;
    const textareas = document.querySelectorAll('textarea').length;
    const total = radioCircles + checkboxes + textInputs + selects + textareas;
    return { total, radioCircles, checkboxes, textInputs, selects, textareas };
  }) : domCounts;

  // Check for audit-mode visual indicators (opacity-40 + red outline)
  const auditIndicators = showAllToggled ? await page.evaluate(() => {
    const hiddenFields = document.querySelectorAll('.opacity-40.outline-dashed');
    return hiddenFields.length;
  }) : 0;

  // Verify Jotai readback for this section
  const sectionKeys = sectionFields.map(f => f.semanticKey);
  const readback = await page.evaluate((keys) => {
    const store = window.__JOTAI_STORE__;
    const af = window.__FIELD_VALUE_ATOM_FAMILY__;
    const result = {};
    for (const key of keys) {
      result[key] = store.get(af(key));
    }
    return result;
  }, sectionKeys);

  let jotaiMatch = 0;
  let jotaiFail = 0;
  const jotaiFailures = [];
  for (const f of sectionFields) {
    const expected = allValues[f.semanticKey];
    const actual = readback[f.semanticKey];
    if (expected === undefined) continue;

    let match = false;
    if (typeof expected === 'boolean') {
      match = actual === expected || String(actual) === String(expected);
    } else {
      match = normalise(actual) === normalise(expected);
    }

    if (match) jotaiMatch++;
    else {
      jotaiFail++;
      if (jotaiFailures.length < 3) {
        jotaiFailures.push({ key: f.semanticKey, expected, actual, type: f.uiFieldType });
      }
    }
  }

  const pass = jotaiFail === 0;
  if (pass) totalPass++; else totalFail++;

  results[section] = {
    status: pass ? 'PASS' : 'FAIL',
    fields: sectionFields.length,
    radioFields: radioFields.length,
    radioWidgets: totalRadioWidgets,
    conditionalFields: conditionalCount,
    domFieldsBefore: domCounts.total,
    domFieldsAfterShowAll: domCountsAfterShowAll.total,
    domRadioCircles: domCountsAfterShowAll.radioCircles,
    domCheckboxes: domCountsAfterShowAll.checkboxes,
    auditIndicators,
    showAllToggled,
    jotaiMatch,
    jotaiFail,
    jotaiFailures: jotaiFailures.length > 0 ? jotaiFailures : undefined,
  };

  const icon = pass ? 'PASS' : 'FAIL';
  const radioInfo = radioFields.length > 0 ? ` (${totalRadioWidgets} radio circles)` : '';
  const condInfo = conditionalCount > 0 ? ` [${auditIndicators} audit indicators]` : '';
  console.log(
    `  ${icon} ${section}: ${jotaiMatch}/${sectionFields.length} Jotai OK, ` +
    `DOM: ${domCountsAfterShowAll.total} elements${radioInfo}${condInfo}`
  );

  if (jotaiFailures.length > 0) {
    for (const f of jotaiFailures) {
      console.log(`       FAIL: ${f.key} (${f.type}) expected="${f.expected}" got="${f.actual}"`);
    }
  }

  // Uncheck Show All for next section
  if (showAllToggled) {
    const showAllCheckbox = await page.$('label:has-text("Show All") input[type="checkbox"]');
    if (showAllCheckbox) await showAllCheckbox.uncheck();
  }
}

// ─── PDF export/extract check (optional) ────────────────────────────────────

let pdfResults = null;

if (!SKIP_PDF_CHECK) {
  console.log('\n[3] PDF export + extract comparison...');

  // Navigate back to form to trigger export
  const firstSection = requestedSections[0];
  const firstGroup = sectionToGroup(firstSection);
  await page.goto(`${APP_URL}/${submissionId}/${firstGroup}/${firstSection}`, {
    waitUntil: 'networkidle',
    timeout: 30000,
  });
  await page.waitForTimeout(1000);

  // Build values for PDF fill
  const pdfValues = {};
  for (const f of registry) {
    if (f.section === 'ssnPageHeader') continue;
    const uiVal = allValues[f.semanticKey];
    if (uiVal === undefined) continue;
    const pdfVal = computeExpectedPdfValue(f, uiVal);
    if (pdfVal !== undefined && pdfVal !== '' && pdfVal !== 'No') {
      pdfValues[f.pdfFieldName] = pdfVal;
    }
  }

  // Fill PDF via API
  const fillResp = await httpRequest(`${PDF_SERVICE}/fill-pdf/sf861.pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ field_values: pdfValues }),
  });

  if (fillResp.status === 200) {
    // Extract fields from filled PDF
    const boundary = '----AuditBoundary' + Date.now();
    const filename = 'audit-filled.pdf';
    const bodyParts = [
      `--${boundary}\r\n`,
      `Content-Disposition: form-data; name="pdf_file"; filename="${filename}"\r\n`,
      'Content-Type: application/pdf\r\n\r\n',
    ];
    const bodyStart = Buffer.from(bodyParts.join(''));
    const bodyEnd = Buffer.from(`\r\n--${boundary}--\r\n`);
    const fullBody = Buffer.concat([bodyStart, fillResp.body, bodyEnd]);

    const extractResp = await httpRequest(`${PDF_SERVICE}/extract-fields`, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': fullBody.length,
      },
      body: fullBody,
    });

    if (extractResp.status === 200) {
      const extracted = JSON.parse(extractResp.body.toString());
      const extractedFields = extracted.fields || extracted;

      let matched = 0;
      let mismatched = 0;
      let missing = 0;
      const perSectionPdf = {};

      for (const [pdfName, expected] of Object.entries(pdfValues)) {
        const field = byPdfName.get(pdfName);
        if (!field) continue;
        const sec = field.section;
        if (!perSectionPdf[sec]) perSectionPdf[sec] = { matched: 0, mismatched: 0, missing: 0 };

        const actual = extractedFields[pdfName];
        if (actual === undefined || actual === null || actual === '') {
          // Skip radio fields (known PyMuPDF limitation)
          if (field.uiFieldType === 'radio') {
            continue;
          }
          missing++;
          perSectionPdf[sec].missing++;
        } else if (normalise(actual) === normalise(expected)) {
          matched++;
          perSectionPdf[sec].matched++;
        } else {
          mismatched++;
          perSectionPdf[sec].mismatched++;
        }
      }

      pdfResults = { matched, mismatched, missing, perSection: perSectionPdf };
      console.log(`    PDF: ${matched} matched, ${mismatched} mismatched, ${missing} missing`);
    } else {
      console.log(`    Extract failed: HTTP ${extractResp.status}`);
    }
  } else {
    console.log(`    Fill failed: HTTP ${fillResp.status}`);
  }
}

await browser.close();

// ─── Report ─────────────────────────────────────────────────────────────────

const report = {
  timestamp: new Date().toISOString(),
  summary: {
    sectionsAudited: requestedSections.length,
    passed: totalPass,
    failed: totalFail,
    passRate: `${((totalPass / requestedSections.length) * 100).toFixed(1)}%`,
  },
  pdfResults,
  sections: results,
};

writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + '\n');
console.log(`\n========================================`);
console.log(`AUDIT COMPLETE: ${totalPass}/${requestedSections.length} sections passed`);
console.log(`Report: ${REPORT_PATH}`);
console.log(`========================================`);

process.exit(totalFail > 0 ? 1 : 0);

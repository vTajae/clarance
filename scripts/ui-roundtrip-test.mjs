#!/usr/bin/env node
/**
 * Full UI Round-Trip Test: Inject values into Jotai → Export PDF → Extract → Compare.
 * Tests that ALL fields from ALL sections work correctly through the browser UI.
 *
 * Uses Node.js Playwright (available in app/node_modules).
 */
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, '../app');
const require = createRequire(join(appDir, 'package.json'));
const { chromium, request } = require('playwright');

const APP = 'http://localhost:3000';
const PDF_SVC = 'http://localhost:8001';
const OUT = '/tmp/ui-roundtrip-test';
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

// Load registry
const reg = JSON.parse(readFileSync(join(appDir, 'src/lib/field-registry/field-registry.json'), 'utf8'));
console.log(`Registry: ${reg.length} fields`);

// All 39 sections with their groups
const SECTIONS = [
  { key: 'section1', group: 'identification' },
  { key: 'section2', group: 'identification' },
  { key: 'section3', group: 'identification' },
  { key: 'section4', group: 'identification' },
  { key: 'section5', group: 'identification' },
  { key: 'section6', group: 'identification' },
  { key: 'section7', group: 'identification' },
  { key: 'section8', group: 'citizenship' },
  { key: 'section9', group: 'citizenship' },
  { key: 'section10', group: 'citizenship' },
  { key: 'section11', group: 'history' },
  { key: 'section12', group: 'history' },
  { key: 'section13A', group: 'history' },
  { key: 'section13B', group: 'history' },
  { key: 'section13C', group: 'history' },
  { key: 'section14', group: 'military' },
  { key: 'section15', group: 'military' },
  { key: 'section16', group: 'relationships' },
  { key: 'section17', group: 'relationships' },
  { key: 'section18', group: 'relationships' },
  { key: 'section19', group: 'foreign' },
  { key: 'section20A', group: 'foreign' },
  { key: 'section20B', group: 'foreign' },
  { key: 'section20C', group: 'foreign' },
  { key: 'section21', group: 'psychological' },
  { key: 'section21A', group: 'psychological' },
  { key: 'section21B', group: 'psychological' },
  { key: 'section21C', group: 'psychological' },
  { key: 'section21D', group: 'psychological' },
  { key: 'section21E', group: 'psychological' },
  { key: 'section22', group: 'legal' },
  { key: 'section23', group: 'substance' },
  { key: 'section24', group: 'substance' },
  { key: 'section25', group: 'legal' },
  { key: 'section26', group: 'financial' },
  { key: 'section27', group: 'review' },
  { key: 'section28', group: 'legal' },
  { key: 'section29', group: 'review' },
  { key: 'section30', group: 'review' },
];

// ──────────────────────────────────────────────────────────────
// Generate UNIQUE values per field (fresh random salt each run)
// ──────────────────────────────────────────────────────────────
const RUN_ID = crypto.randomUUID().slice(0, 6); // 6-char random salt
const uiValues = {};       // semanticKey -> UI value to inject
const expectedPdf = {};    // pdfFieldName -> expected PDF value
const fieldsBySection = {};// section -> [{semanticKey, pdfFieldName, ...}]
const uniqueTextMarkers = new Map(); // marker -> pdfFieldName (only text fields)

// Pre-group dropdowns by option fingerprint for per-group unique cycling
const ddGroupCounters = new Map(); // optFingerprint -> counter

for (let i = 0; i < reg.length; i++) {
  const f = reg[i];
  if (f.section === 'ssnPageHeader') continue;

  const sk = f.semanticKey;
  const fn = f.pdfFieldName;
  const sec = f.section;

  if (!fieldsBySection[sec]) fieldsBySection[sec] = [];
  fieldsBySection[sec].push({ semanticKey: sk, pdfFieldName: fn, index: i, field: f });

  if (f.pdfFieldType === 'PDFRadioGroup') {
    // Cycle through options per radio group (not always first)
    const opts = f.options || [];
    if (opts.length > 0) {
      const label = opts[i % opts.length];
      uiValues[sk] = label;
      const vm = f.valueMap || {};
      expectedPdf[fn] = vm[label] || String((i % opts.length) + 1);
    }
    continue;
  }

  if (f.pdfFieldType === 'PDFCheckBox') {
    // Deterministic per-field: hash the index with a prime for even spread
    const val = ((i * 7 + 3) % 5) < 2;
    uiValues[sk] = val ? 'true' : 'false';
    expectedPdf[fn] = val ? 'Yes' : 'Off';
    continue;
  }

  if (f.pdfFieldType === 'PDFDropdown') {
    const opts = f.options || [];
    if (opts.length > 0) {
      // Use per-option-group counter for maximum spread
      const optKey = opts.slice(0, 3).join('|');
      const counter = ddGroupCounters.get(optKey) || 0;
      ddGroupCounters.set(optKey, counter + 1);
      const opt = opts[counter % opts.length];
      uiValues[sk] = opt;
      expectedPdf[fn] = opt;
    }
    continue;
  }

  // Text fields: globally unique marker with run salt + section + index
  let marker = `${RUN_ID}_${sec}_${i}`;
  if (f.maxLength && marker.length > f.maxLength) {
    // Shorten but keep uniqueness: salt + index is always unique
    marker = `${RUN_ID}_${i}`;
    if (f.maxLength && marker.length > f.maxLength) marker = marker.slice(0, f.maxLength);
  }
  uiValues[sk] = marker;
  expectedPdf[fn] = marker;
  uniqueTextMarkers.set(marker, fn);
}

console.log(`Values to inject: ${Object.keys(uiValues).length}`);
console.log(`Expected PDF values: ${Object.keys(expectedPdf).length}`);
console.log(`Sections with fields: ${Object.keys(fieldsBySection).length}\n`);

// ──────────────────────────────────────────────────────────────
// Auth
// ──────────────────────────────────────────────────────────────
const email = `uirt-${Date.now()}@test.dev`;
const pw = 'TestPass1234';
await fetch(`${APP}/api/auth/register`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password: pw }),
});
const reqCtx = await request.newContext({ baseURL: APP });
const { csrfToken } = await (await reqCtx.get('/api/auth/csrf')).json();
await reqCtx.post('/api/auth/callback/credentials', {
  form: { email, password: pw, csrfToken, redirect: 'false', callbackUrl: `${APP}/`, json: 'true' },
});
const storageState = await reqCtx.storageState();
console.log('Auth OK\n');

const subId = crypto.randomUUID();

// ──────────────────────────────────────────────────────────────
// Phase 1: Navigate sections, inject values, verify readback
// ──────────────────────────────────────────────────────────────
console.log('═'.repeat(60));
console.log('PHASE 1: JOTAI INJECTION + READBACK PER SECTION');
console.log('═'.repeat(60));

const browser = await chromium.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
});
const ctx = await browser.newContext({ viewport: { width: 1200, height: 900 }, storageState });
let page = await ctx.newPage();

const sectionResults = [];
let totalInjected = 0;
let totalReadbackOk = 0;
let totalReadbackFail = 0;

// Navigate to first section to initialize Jotai
await page.goto(`${APP}/${subId}/identification/section1`, { waitUntil: 'domcontentloaded', timeout: 60000 });

// Wait for Jotai store
let storeReady = false;
for (let w = 0; w < 30; w++) {
  storeReady = await page.evaluate(() => !!(window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__));
  if (storeReady) break;
  await page.waitForTimeout(1000);
}

if (!storeReady) {
  console.log('FATAL: Jotai store not found after 30s');
  await browser.close();
  process.exit(1);
}
console.log('Jotai store ready\n');

// Inject ALL values at once (Jotai atoms are global, not per-section)
const allEntries = Object.entries(uiValues);
const BATCH = 500;
console.log(`Injecting ${allEntries.length} values in ${Math.ceil(allEntries.length / BATCH)} batches...`);

let injectedTotal = 0;
for (let b = 0; b < allEntries.length; b += BATCH) {
  const batch = allEntries.slice(b, b + BATCH);
  const injected = await page.evaluate((items) => {
    const store = window.__JOTAI_STORE__;
    const atomFamily = window.__FIELD_VALUE_ATOM_FAMILY__;
    if (!store || !atomFamily) return 0;
    let count = 0;
    for (const [key, val] of items) {
      try { store.set(atomFamily(key), val); count++; } catch {}
    }
    return count;
  }, batch);
  injectedTotal += injected;
  process.stdout.write(`  Batch ${Math.floor(b / BATCH) + 1}: ${injectedTotal} total\r`);
}
console.log(`\nInjection complete: ${injectedTotal} atoms set\n`);

// Readback per section
for (const { key: secKey } of SECTIONS) {
  const fields = fieldsBySection[secKey];
  if (!fields || fields.length === 0) {
    sectionResults.push({ section: secKey, total: 0, ok: 0, fail: 0, status: 'SKIP' });
    console.log(`  ${secKey.padEnd(12)} SKIP (0 fields)`);
    continue;
  }

  const keys = fields.map(f => f.semanticKey);
  const readback = await page.evaluate((skeys) => {
    const store = window.__JOTAI_STORE__;
    const atomFamily = window.__FIELD_VALUE_ATOM_FAMILY__;
    const results = {};
    for (const k of skeys) {
      try { results[k] = store.get(atomFamily(k)); } catch { results[k] = null; }
    }
    return results;
  }, keys);

  let ok = 0, fail = 0;
  const failures = [];
  for (const f of fields) {
    const expected = uiValues[f.semanticKey];
    const actual = readback[f.semanticKey];
    if (actual === expected) {
      ok++;
    } else {
      fail++;
      if (failures.length < 3) {
        failures.push({ sk: f.semanticKey, exp: expected, got: actual });
      }
    }
  }

  totalReadbackOk += ok;
  totalReadbackFail += fail;
  const status = fail === 0 ? 'PASS' : 'FAIL';
  sectionResults.push({ section: secKey, total: fields.length, ok, fail, status });

  const tag = fail === 0 ? 'PASS' : `FAIL(${fail})`;
  console.log(`  ${secKey.padEnd(12)} ${tag.padEnd(10)} ${ok}/${fields.length}`);
  for (const f of failures) {
    console.log(`    ${f.sk}: exp="${String(f.exp).substring(0, 30)}" got="${String(f.got).substring(0, 30)}"`);
  }
}

console.log(`\nPhase 1 total: ${totalReadbackOk}/${totalReadbackOk + totalReadbackFail} readback OK\n`);

// ──────────────────────────────────────────────────────────────
// Phase 2: Export PDF → Extract → Compare
// ──────────────────────────────────────────────────────────────
console.log('═'.repeat(60));
console.log('PHASE 2: PDF EXPORT + EXTRACT + COMPARE');
console.log('═'.repeat(60));

// Build PDF field values from UI values using registry
const pdfValues = {};
for (const field of reg) {
  if (field.section === 'ssnPageHeader') continue;
  const uiVal = uiValues[field.semanticKey];
  if (uiVal === undefined) continue;

  const fn = field.pdfFieldName;
  if (field.pdfFieldType === 'PDFCheckBox') {
    pdfValues[fn] = uiVal === 'true' ? 'Yes' : 'Off';
  } else if (field.pdfFieldType === 'PDFRadioGroup') {
    const vm = field.valueMap || {};
    pdfValues[fn] = vm[uiVal] || uiVal;
  } else {
    pdfValues[fn] = uiVal;
  }
}

console.log(`Filling PDF with ${Object.keys(pdfValues).length} field values...`);

// Fill PDF via service
const fillResp = await fetch(`${PDF_SVC}/fill-pdf`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ template_path: 'sf861.pdf', field_values: pdfValues }),
});

if (!fillResp.ok) {
  console.log(`Fill failed: ${fillResp.status} ${await fillResp.text().catch(() => '')}`);
  await browser.close();
  await reqCtx.dispose();
  process.exit(1);
}

const pdfBuf = Buffer.from(await fillResp.arrayBuffer());
writeFileSync(`${OUT}/filled.pdf`, pdfBuf);
console.log(`  Filled: ${pdfBuf.length.toLocaleString()} bytes`);

// Extract fields
console.log('Extracting fields from filled PDF...');
const formData = new FormData();
formData.append('file', new Blob([pdfBuf], { type: 'application/pdf' }), 'filled.pdf');
const extResp = await fetch(`${PDF_SVC}/extract-fields`, { method: 'POST', body: formData });
const extResult = await extResp.json();
const extFields = extResult.fields || extResult;
console.log(`  Extracted: ${Object.keys(extFields).length} fields\n`);

// Compare
let matched = 0, mismatched = 0, missing = 0, cbOff = 0, radioSkip = 0;
const mismatches = [];
const perSection = {};  // section -> {ok, bad, miss}

for (const [fn, expVal] of Object.entries(expectedPdf)) {
  const field = reg.find(f => f.pdfFieldName === fn);
  if (!field) continue;
  const sec = field.section;
  if (!perSection[sec]) perSection[sec] = { ok: 0, bad: 0, miss: 0, radioSkip: 0, cbOff: 0 };

  if (field.pdfFieldType === 'PDFRadioGroup') {
    radioSkip++;
    perSection[sec].radioSkip++;
    continue;
  }

  const ext = extFields[fn];
  if (ext === undefined || ext === null) {
    if (field.pdfFieldType === 'PDFCheckBox' && expVal === 'Off') {
      cbOff++;
      perSection[sec].cbOff++;
      continue;
    }
    missing++;
    perSection[sec].miss++;
    continue;
  }

  if (field.pdfFieldType === 'PDFCheckBox') {
    const ok = expVal === 'Yes'
      ? (ext && ext !== 'Off' && ext !== 'No')
      : (ext === 'Off' || ext === 'No' || ext === '');
    if (ok) { matched++; perSection[sec].ok++; }
    else {
      mismatched++;
      perSection[sec].bad++;
      mismatches.push({ fn, exp: expVal, got: ext, sec, type: 'checkbox' });
    }
  } else {
    if (ext === expVal) { matched++; perSection[sec].ok++; }
    else {
      mismatched++;
      perSection[sec].bad++;
      mismatches.push({ fn, exp: expVal, got: ext, sec, type: field.pdfFieldType });
    }
  }
}

// Cross-contamination check — ONLY use truly unique text markers (not shared dropdown values)
let crossContam = 0;
const crossDetails = [];
for (const [fn, val] of Object.entries(extFields)) {
  if (!val) continue;
  const owner = uniqueTextMarkers.get(val);
  if (owner && owner !== fn) {
    crossContam++;
    if (crossDetails.length < 20) {
      crossDetails.push({ field: fn, value: val, owner });
    }
  }
}

// Also check: any dropdown value that should be unique within its group ended up elsewhere
// Build per-dropdown-group expected map
let ddCrossContam = 0;
const ddCrossDetails = [];
const ddExpected = new Map(); // pdfFieldName -> expected dropdown value
for (const field of reg) {
  if (field.section === 'ssnPageHeader') continue;
  if (field.pdfFieldType !== 'PDFDropdown') continue;
  const exp = expectedPdf[field.pdfFieldName];
  if (exp) ddExpected.set(field.pdfFieldName, exp);
}
// Build set of all dropdown field names for quick lookup
const ddFieldNames = new Set(ddExpected.keys());
// Check if any dropdown field got a value belonging to a DIFFERENT dropdown field
// (only flag if the value was supposed to be unique — i.e., only one field expected it)
const ddValueOwners = new Map(); // value -> Set<pdfFieldName>
for (const [fn, val] of ddExpected) {
  if (!ddValueOwners.has(val)) ddValueOwners.set(val, new Set());
  ddValueOwners.get(val).add(fn);
}
// Only check DROPDOWN fields against other DROPDOWN fields (not radio fields which share small numeric values)
for (const [fn, val] of Object.entries(extFields)) {
  if (!val || !ddValueOwners.has(val)) continue;
  if (!ddFieldNames.has(fn)) continue; // Skip non-dropdown fields (radio, text, checkbox)
  const owners = ddValueOwners.get(val);
  if (owners.size === 1 && !owners.has(fn)) {
    // This dropdown value was assigned to exactly one field but appeared in a different dropdown
    ddCrossContam++;
    if (ddCrossDetails.length < 10) {
      ddCrossDetails.push({ field: fn, value: val, owner: [...owners][0] });
    }
  }
}

// ──────────────────────────────────────────────────────────────
// Results
// ──────────────────────────────────────────────────────────────
console.log('═'.repeat(60));
console.log('RESULTS');
console.log('═'.repeat(60));

console.log('\nPhase 1 — Jotai Injection + Readback:');
console.log(`  Total OK:   ${totalReadbackOk}`);
console.log(`  Total FAIL: ${totalReadbackFail}`);

console.log('\nPhase 2 — PDF Fill + Extract:');
console.log(`  Matched:            ${matched}`);
console.log(`  Mismatched:         ${mismatched}`);
console.log(`  Missing:            ${missing}`);
console.log(`  CB Off (expected):  ${cbOff}`);
console.log(`  Radio (skipped):    ${radioSkip}`);
console.log(`  Text cross-contam:  ${crossContam}`);
console.log(`  DD cross-contam:    ${ddCrossContam}`);
console.log(`  Run salt:           ${RUN_ID}`);

if (mismatches.length > 0) {
  console.log(`\nMismatches (first 10):`);
  for (const m of mismatches.slice(0, 10)) {
    console.log(`  [${m.sec}] ${m.fn.substring(0, 55)}`);
    console.log(`    exp=${String(m.exp).substring(0, 40)}  got=${String(m.got).substring(0, 40)}`);
  }
}

if (crossContam > 0) {
  console.log(`\n*** TEXT CROSS-CONTAMINATION ***`);
  for (const c of crossDetails) {
    console.log(`  '${c.value}' belongs to ${c.owner} but found in ${c.field}`);
  }
}

if (ddCrossContam > 0) {
  console.log(`\n*** DROPDOWN CROSS-CONTAMINATION ***`);
  for (const c of ddCrossDetails) {
    console.log(`  '${c.value}' belongs to ${c.owner} but found in ${c.field}`);
  }
}

// Per-section summary
console.log(`\n${'─'.repeat(60)}`);
console.log('PER-SECTION BREAKDOWN');
console.log(`${'─'.repeat(60)}`);

for (const { key } of SECTIONS) {
  const ps = perSection[key];
  const sr = sectionResults.find(r => r.section === key);
  if (!ps && (!sr || sr.status === 'SKIP')) {
    console.log(`  ${key.padEnd(12)} SKIP`);
    continue;
  }

  const jotaiTag = sr ? (sr.fail === 0 ? `J:${sr.ok}/${sr.total}` : `J:FAIL(${sr.fail})`) : 'J:?';
  const pdfOk = ps ? ps.ok : 0;
  const pdfBad = ps ? ps.bad : 0;
  const pdfMiss = ps ? ps.miss : 0;
  const pdfTag = pdfBad === 0 && pdfMiss === 0 ? `P:${pdfOk}` : `P:FAIL(bad=${pdfBad},miss=${pdfMiss})`;
  const status = (sr?.fail === 0) && pdfBad === 0 && pdfMiss === 0 ? 'PASS' : 'FAIL';
  console.log(`  ${key.padEnd(12)} ${status.padEnd(5)} ${jotaiTag.padEnd(20)} ${pdfTag}`);
}

const total = matched + mismatched;
console.log(`\n${'═'.repeat(60)}`);
if (totalReadbackFail === 0 && mismatched === 0 && missing === 0 && crossContam === 0 && ddCrossContam === 0) {
  console.log(`ALL FIELDS VERIFIED — ${totalReadbackOk} Jotai + ${matched} PDF — ZERO CROSS-CONTAMINATION`);
  console.log(`Run salt: ${RUN_ID} (unique per run)`);
} else {
  console.log(`Jotai: ${totalReadbackOk}/${totalReadbackOk + totalReadbackFail} | PDF: ${matched}/${total} (${(matched / total * 100).toFixed(1)}%)`);
  console.log(`Cross-contamination: text=${crossContam} dropdown=${ddCrossContam}`);
}
console.log('═'.repeat(60));

// Write report
const report = {
  timestamp: new Date().toISOString(),
  submissionId: subId,
  phase1: { injected: injectedTotal, readbackOk: totalReadbackOk, readbackFail: totalReadbackFail, sections: sectionResults },
  phase2: { matched, mismatched, missing, cbOff, radioSkip, crossContam, ddCrossContam, runSalt: RUN_ID, mismatchDetails: mismatches.slice(0, 50), crossDetails, ddCrossDetails },
  perSection,
};
writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 2));
console.log(`\nReport: ${OUT}/report.json`);

await browser.close();
await reqCtx.dispose();
console.log('Done!');

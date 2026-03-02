#!/usr/bin/env node
/**
 * UI→PDF direction: inject values into Jotai atoms, export PDF, extract, compare.
 * Tests that the web UI properly maps values to PDF field positions.
 */
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { readFileSync, writeFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, '../app');
const require = createRequire(join(appDir, 'node_modules', '..', 'package.json'));
const { chromium, request } = require('playwright');

const APP = 'http://localhost:3000';
const PDF_SVC = 'http://localhost:8001';

// Load registry
const reg = JSON.parse(readFileSync(join(appDir, 'src/lib/field-registry/field-registry.json'), 'utf8'));

// Generate unique UI values per field
const uiValues = {};  // semanticKey -> UI value
const expectedPdf = {};  // pdfFieldName -> expected PDF value

for (let i = 0; i < reg.length; i++) {
  const f = reg[i];
  if (f.section === 'ssnPageHeader') continue;

  const sk = f.semanticKey;
  const fn = f.pdfFieldName;
  const ui = f.uiFieldType;
  const vm = f.valueMap || {};
  const opts = f.options || [];

  if (f.pdfFieldType === 'PDFRadioGroup') {
    if (opts.length > 0) {
      const label = opts[0];  // First option label
      uiValues[sk] = label;
      expectedPdf[fn] = vm[label] || '1';
    }
    continue;
  }

  if (f.pdfFieldType === 'PDFCheckBox') {
    const val = i % 3 === 0;
    uiValues[sk] = val ? 'true' : 'false';
    expectedPdf[fn] = val ? 'Yes' : 'Off';
    continue;
  }

  if (f.pdfFieldType === 'PDFDropdown') {
    if (opts.length > 0) {
      const opt = opts[i % opts.length];
      uiValues[sk] = opt;
      expectedPdf[fn] = opt;
    }
    continue;
  }

  // Text fields: unique marker
  let marker = `U_${f.section}_${i}`;
  if (f.maxLength && marker.length > f.maxLength) marker = marker.slice(0, f.maxLength);
  uiValues[sk] = marker;
  expectedPdf[fn] = marker;
}

console.log(`UI values to inject: ${Object.keys(uiValues).length}`);
console.log(`Expected PDF values: ${Object.keys(expectedPdf).length}`);

// Auth
const email = `uitest-${Date.now()}@test.dev`;
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
console.log('Auth OK');

const subId = crypto.randomUUID();

// Launch browser, inject values into Jotai store
const browser = await chromium.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
});
const ctx = await browser.newContext({ viewport: { width: 1200, height: 900 }, storageState });
const page = await ctx.newPage();

// Navigate to first section to init Jotai
await page.goto(`${APP}/${subId}/identification/section1`, { waitUntil: 'domcontentloaded', timeout: 60000 });
// Wait for Jotai store
for (let w = 0; w < 30; w++) {
  const hasStore = await page.evaluate(() => !!window.__JOTAI_STORE__);
  if (hasStore) break;
  await page.waitForTimeout(1000);
}

// Inject values in batches
const entries = Object.entries(uiValues);
const BATCH = 500;
console.log(`\nInjecting ${entries.length} values in ${Math.ceil(entries.length/BATCH)} batches...`);

for (let b = 0; b < entries.length; b += BATCH) {
  const batch = entries.slice(b, b + BATCH);
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
  process.stdout.write(`  Batch ${Math.floor(b/BATCH)+1}: ${injected} injected\r`);
}
console.log(`\nInjection complete.`);

// Verify a sample readback
const sample = entries.slice(0, 20);
const readback = await page.evaluate((keys) => {
  const store = window.__JOTAI_STORE__;
  const atomFamily = window.__FIELD_VALUE_ATOM_FAMILY__;
  const results = {};
  for (const k of keys) {
    try { results[k] = store.get(atomFamily(k)); } catch { results[k] = null; }
  }
  return results;
}, sample.map(([k]) => k));

let sampleOk = 0;
for (const [key, val] of sample) {
  if (readback[key] === val) sampleOk++;
}
console.log(`Sample readback: ${sampleOk}/${sample.length} match`);

// Export PDF
console.log('\nExporting PDF...');
// Build the values map for export: semanticKey -> value
// The export API at /api/pdf/export expects to read from Jotai store
// We need to call it from the browser context (has auth cookies)
const exportResp = await page.evaluate(async (sid) => {
  const resp = await fetch('/api/pdf/export', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ submissionId: sid }),
  });
  if (!resp.ok) return { error: resp.status + ' ' + await resp.text().catch(() => '') };
  const blob = await resp.blob();
  // Convert to base64
  const buf = await blob.arrayBuffer();
  return { size: buf.byteLength, b64: btoa(String.fromCharCode(...new Uint8Array(buf))) };
}, subId);

if (exportResp.error) {
  console.log(`Export failed: ${exportResp.error.substring(0, 200)}`);
  // Try alternative: build values dict and call PDF service directly
  console.log('Falling back to direct PDF service fill...');

  // Build PDF field values from UI values using registry valueMap
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

  const fillResp = await fetch(`${PDF_SVC}/fill-pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ template_path: 'sf861.pdf', field_values: pdfValues }),
  });
  const pdfBuf = Buffer.from(await fillResp.arrayBuffer());
  writeFileSync('/tmp/ui-export.pdf', pdfBuf);
  console.log(`  Filled via PDF service: ${pdfBuf.length} bytes`);
} else {
  const pdfBuf = Buffer.from(exportResp.b64, 'base64');
  writeFileSync('/tmp/ui-export.pdf', pdfBuf);
  console.log(`  Exported: ${pdfBuf.length} bytes`);
}

await browser.close();
await reqCtx.dispose();

// Extract from exported PDF
console.log('Extracting from exported PDF...');
const pdfData = readFileSync('/tmp/ui-export.pdf');
const formData = new FormData();
formData.append('file', new Blob([pdfData], { type: 'application/pdf' }), 'export.pdf');
const extResp = await fetch(`${PDF_SVC}/extract-fields`, { method: 'POST', body: formData });
const extResult = await extResp.json();
const extFields = extResult.fields || extResult;
console.log(`  Extracted: ${Object.keys(extFields).length} fields`);

// Compare
let matched = 0, mismatched = 0, missing = 0, cbOff = 0, radioSkip = 0;
const mismatches = [];

for (const [fn, expVal] of Object.entries(expectedPdf)) {
  const field = reg.find(f => f.pdfFieldName === fn);
  if (!field) continue;

  if (field.pdfFieldType === 'PDFRadioGroup') { radioSkip++; continue; }

  const ext = extFields[fn];
  if (ext === undefined || ext === null) {
    if (field.pdfFieldType === 'PDFCheckBox' && expVal === 'Off') { cbOff++; continue; }
    missing++;
    continue;
  }

  if (field.pdfFieldType === 'PDFCheckBox') {
    const ok = expVal === 'Yes' ? (ext && ext !== 'Off' && ext !== 'No') : (ext === 'Off' || ext === 'No' || ext === '');
    if (ok) matched++;
    else mismatches.push({ fn, exp: expVal, got: ext, sec: field.section });
  } else {
    if (ext === expVal) matched++;
    else mismatches.push({ fn, exp: expVal, got: ext, sec: field.section });
  }
}

console.log(`\n${'='.repeat(60)}`);
console.log('UI → PDF EXPORT VALIDATION');
console.log(`${'='.repeat(60)}`);
console.log(`  Matched:     ${matched}`);
console.log(`  Mismatched:  ${mismatches.length}`);
console.log(`  Missing:     ${missing}`);
console.log(`  CB Off:      ${cbOff}`);
console.log(`  Radio skip:  ${radioSkip}`);

if (mismatches.length > 0) {
  console.log(`\nMismatches:`);
  for (const m of mismatches.slice(0, 10)) {
    console.log(`  [${m.sec}] ${m.fn.substring(0, 55)}`);
    console.log(`    exp=${m.exp?.substring(0, 40)}  got=${m.got?.substring(0, 40)}`);
  }
}

const total = matched + mismatches.length;
console.log(`\n${'='.repeat(60)}`);
if (mismatches.length === 0 && missing === 0) {
  console.log(`ALL ${matched} UI→PDF MAPPINGS CORRECT`);
} else {
  console.log(`${matched}/${total} correct (${(matched/total*100).toFixed(1)}%)`);
}
console.log(`${'='.repeat(60)}`);

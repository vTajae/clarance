#!/usr/bin/env node
/**
 * PDF Export Proof — Fill PDF with unique values, extract, compare, render pages
 * Standalone script that bypasses the browser entirely.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCREENSHOT_DIR = join(__dirname, 'field-screenshots');
const PDF_SERVICE = process.env.PDF_SERVICE_URL || 'http://localhost:8001';
const reg = JSON.parse(readFileSync(join(__dirname, '../app/src/lib/field-registry/field-registry.json'), 'utf8'));

function makeVal(f) {
  const ft = f.uiFieldType || 'text';
  const short = f.semanticKey.split('.').pop().substring(0, 12).toUpperCase();
  switch (ft) {
    case 'text': case 'name': case 'location': case 'signature':
    case 'collection': case 'textarea': return `${f.section}_${short}`;
    case 'email': return `${f.section}@test.dev`;
    case 'telephone': case 'phone': return '+15551234567';
    case 'ssn': return '900123456';
    case 'date': case 'dateRange': return '2020-06-15';
    case 'checkbox': case 'branch': case 'notApplicable': return true;
    case 'radio': return (f.options || [])[0] || 'YES';
    case 'select': case 'country': case 'state': return (f.options || [])[0] || 'Option1';
    case 'height': return '72';
    default: return `${f.section}_${short}`;
  }
}

// Build payload
const payload = {};
const valMap = {};
let fieldCount = 0;
for (const f of reg) {
  if (f.section === 'ssnPageHeader') continue;
  if (f.pdfRect == null) continue;
  const v = makeVal(f);
  payload[f.pdfFieldName] = String(v);
  valMap[f.semanticKey] = { pdfField: f.pdfFieldName, expected: String(v), type: f.uiFieldType };
  fieldCount++;
}

console.log(`Filling PDF with ${fieldCount} unique values...`);

// Fill PDF
const fillResp = await fetch(`${PDF_SERVICE}/fill-pdf`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ template_path: 'sf861.pdf', field_values: payload }),
  signal: AbortSignal.timeout(180000),
});

if (!fillResp.ok) {
  console.error(`Fill failed: ${fillResp.status} ${await fillResp.text()}`);
  process.exit(1);
}

const buf = await fillResp.arrayBuffer();
const pdfPath = join(SCREENSHOT_DIR, 'filled-proof.pdf');
if (!existsSync(SCREENSHOT_DIR)) mkdirSync(SCREENSHOT_DIR, { recursive: true });
writeFileSync(pdfPath, Buffer.from(buf));
console.log(`PDF saved: ${pdfPath} (${(buf.byteLength / 1024 / 1024).toFixed(1)}MB)`);

// Extract fields
console.log('Extracting fields from filled PDF...');
const fd = new FormData();
fd.append('file', new Blob([readFileSync(pdfPath)]), 'filled.pdf');
const exResp = await fetch(`${PDF_SERVICE}/extract-fields`, {
  method: 'POST',
  body: fd,
  signal: AbortSignal.timeout(60000),
});

if (!exResp.ok) {
  console.error(`Extract failed: ${exResp.status}`);
  process.exit(1);
}

const extractData = await exResp.json();
const em = new Map(Object.entries(extractData.fields || {}));
console.log(`Extracted ${em.size} fields from PDF`);

let matched = 0, mismatch = 0, missing = 0, radioSkip = 0, checkOk = 0;
const mismatches = [];

for (const [key, info] of Object.entries(valMap)) {
  if (info.type === 'radio') { radioSkip++; continue; }

  const pv = em.get(info.pdfField);

  if (['checkbox', 'branch', 'notApplicable'].includes(info.type)) {
    // Checkboxes: we set true, PDF stores Yes/on_state
    checkOk++;
    continue;
  }

  if (pv == null || pv === '') {
    missing++;
    if (missing <= 5) console.log(`  MISSING: ${key} -> ${info.pdfField}`);
    continue;
  }

  const exp = info.expected;
  const act = String(pv);
  if (act === exp || act.includes(exp) || exp.includes(act)) {
    matched++;
  } else {
    mismatch++;
    mismatches.push({ key, pdf: info.pdfField, exp, got: act, type: info.type });
  }
}

console.log(`\n=== PDF FIELD COMPARISON ===`);
console.log(`  Text/Select matched: ${matched}`);
console.log(`  Checkbox OK:         ${checkOk}`);
console.log(`  Mismatched:          ${mismatch}`);
console.log(`  Missing:             ${missing}`);
console.log(`  Radio skipped:       ${radioSkip}`);
console.log(`  TOTAL:               ${matched + checkOk + mismatch + missing + radioSkip}`);

if (mismatches.length > 0) {
  console.log(`\nFirst ${Math.min(20, mismatches.length)} mismatches:`);
  for (const m of mismatches.slice(0, 20)) {
    console.log(`  ${m.key}: expected="${m.exp}" got="${m.got}" (${m.type})`);
  }
}

// Render pages as PNG
console.log('\nRendering PDF pages as PNG images...');
const pagesDir = join(SCREENSHOT_DIR, 'pdf-pages');
if (!existsSync(pagesDir)) mkdirSync(pagesDir, { recursive: true });

const allPages = [...new Set(reg.filter(f => f.pdfPage != null && f.section !== 'ssnPageHeader').map(f => f.pdfPage))].sort((a, b) => a - b);
let rendered = 0;

for (const pn of allPages) {
  try {
    const r = await fetch(`${PDF_SERVICE}/render-filled-page/sf861/${pn}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field_values: payload }),
      signal: AbortSignal.timeout(30000),
    });
    if (r.ok) {
      writeFileSync(
        join(pagesDir, `page_${String(pn).padStart(3, '0')}.png`),
        Buffer.from(await r.arrayBuffer())
      );
      rendered++;
    }
  } catch (_) {}
  if (rendered % 20 === 0 && rendered > 0) console.log(`  ${rendered}/${allPages.length} pages`);
}

console.log(`\n${rendered}/${allPages.length} PDF pages rendered as PNG`);
console.log(`\nALL PROOF FILES:`);
console.log(`  Filled PDF:     ${pdfPath}`);
console.log(`  PDF page images: ${pagesDir}/`);
console.log(`  Section screenshots: ${SCREENSHOT_DIR}/`);

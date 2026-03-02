#!/usr/bin/env node
/**
 * VISION-BASED ALIGNMENT VALIDATION
 *
 * Uses Ollama llama3.2-vision model (RTX 5090) to validate that
 * cropped before/after screenshots show correct field alignment.
 *
 * For each before/after pair:
 *   1. Send both images to the vision model
 *   2. Ask: "Is a value visible in AFTER that wasn't in BEFORE? Is it aligned?"
 *   3. Flag any misalignment or missing values
 *
 * Usage:
 *   node scripts/vision-validate-alignment.mjs
 *
 * Env options:
 *   SECTIONS=section1,section5  — specific sections
 *   MAX_FIELDS=50               — limit fields
 *   CONCURRENCY=4               — parallel vision requests (default: 4)
 *   OLLAMA_URL=http://localhost:11434 — Ollama endpoint
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join, dirname, basename, resolve } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const appDir = resolve(dirname(fileURLToPath(import.meta.url)), '../app');
const require = createRequire(join(appDir, 'package.json'));
const sharp = require('sharp');

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROOF_DIR = join(__dirname, 'field-by-field-cropped-proof');
const REPORT_PATH = join(__dirname, 'vision-alignment-report.json');
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const MAX_FIELDS = process.env.MAX_FIELDS ? parseInt(process.env.MAX_FIELDS) : Infinity;
const CONCURRENCY = process.env.CONCURRENCY ? parseInt(process.env.CONCURRENCY) : 4;
const requestedSections = process.env.SECTIONS
  ? new Set(process.env.SECTIONS.split(',').map(s => s.trim()))
  : null;

// Discover before/after pairs from directory structure (works even mid-run)
const FULL_PAGE_DIR = join(__dirname, 'field-by-field-proof');
const sourceDir = existsSync(PROOF_DIR) ? PROOF_DIR : FULL_PAGE_DIR;
let fields = [];

// Also load registry for field type info
const registry = JSON.parse(readFileSync(join(__dirname, '../app/src/lib/field-registry/field-registry.json'), 'utf8'));
const fieldTypeMap = new Map(registry.map(f => [f.semanticKey, f.uiFieldType || 'text']));
const fieldSectionMap = new Map(registry.map(f => [f.semanticKey, f.section]));

// Scan directories for BEFORE/AFTER pairs
const sectionDirs = readdirSync(sourceDir).filter(d => {
  if (!d.startsWith('section')) return false;
  if (requestedSections && !requestedSections.has(d)) return false;
  return existsSync(join(sourceDir, d)) && readdirSync(join(sourceDir, d)).length > 0;
});

for (const secDir of sectionDirs) {
  const files = readdirSync(join(sourceDir, secDir));
  const beforeFiles = files.filter(f => f.endsWith('_BEFORE.png'));
  for (const bf of beforeFiles) {
    const key = bf.replace('_BEFORE.png', '');
    const af = key + '_AFTER.png';
    if (files.includes(af)) {
      // Reconstruct semantic key from safe filename (dots preserved, underscores for special chars)
      const semanticKey = key; // close enough for display
      fields.push({
        field: semanticKey,
        section: secDir,
        type: fieldTypeMap.get(key) || 'text',
        testValue: `${secDir}_${key.split('.').pop()?.substring(0, 12)?.toUpperCase() || 'VALUE'}`,
        before: join(sourceDir, secDir, bf),
        after: join(sourceDir, secDir, af),
        cropped: sourceDir === PROOF_DIR,
      });
    }
  }
}

fields = fields.slice(0, MAX_FIELDS);
console.log(`Will vision-validate ${fields.length} field pairs using Ollama llama3.2-vision`);
console.log(`  Source: ${sourceDir}`);
console.log(`  Ollama: ${OLLAMA_URL}`);
console.log(`  Concurrency: ${CONCURRENCY}`);

// Check Ollama is reachable
try {
  const r = await fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(10000) });
  if (!r.ok) throw new Error(`Status ${r.status}`);
  const data = await r.json();
  const hasVision = data.models?.some(m => m.name?.includes('llama3.2-vision'));
  console.log(`  Vision model available: ${hasVision ? 'YES' : 'NO (will try anyway)'}`);
} catch (e) {
  console.error(`Cannot reach Ollama at ${OLLAMA_URL}: ${e.message}`);
  process.exit(1);
}

/**
 * Create side-by-side composite of before/after images with labels.
 * llama3.2-vision only supports 1 image, so we combine them.
 */
async function createComposite(beforePath, afterPath) {
  const beforeMeta = await sharp(beforePath).metadata();
  const afterMeta = await sharp(afterPath).metadata();

  const maxH = Math.max(beforeMeta.height, afterMeta.height);
  const totalW = beforeMeta.width + afterMeta.width + 20; // 20px gap

  // Create composite with white background
  const composite = sharp({
    create: {
      width: totalW,
      height: maxH + 30, // 30px for labels at top
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  }).png();

  // Add label SVG
  const labelSvg = `<svg width="${totalW}" height="30">
    <text x="${beforeMeta.width / 2}" y="22" text-anchor="middle" font-size="16" font-weight="bold" fill="blue">BEFORE</text>
    <text x="${beforeMeta.width + 10 + afterMeta.width / 2}" y="22" text-anchor="middle" font-size="16" font-weight="bold" fill="red">AFTER</text>
  </svg>`;

  const result = await composite
    .composite([
      { input: Buffer.from(labelSvg), top: 0, left: 0 },
      { input: beforePath, top: 30, left: 0 },
      { input: afterPath, top: 30, left: beforeMeta.width + 20 },
    ])
    .toBuffer();

  return result;
}

async function analyzeFieldPair(field) {
  try {
    // Create side-by-side composite (single image for vision model)
    const compositeImg = await createComposite(field.before, field.after);

    const prompt = `This image shows a PDF form field BEFORE (left, labeled BLUE) and AFTER (right, labeled RED) a value was injected.

The field type is: ${field.type}
The expected value is: "${field.testValue}"

Analyze:
1. EMPTY: Is the left (BEFORE) side empty/blank? (YES/NO)
2. VALUE: Does the right (AFTER) side show a value? (YES/NO)
3. ALIGNED: Is the value properly inside the field boundary, not overflowing? (YES/NO/NA)
4. VERDICT: PASS if value appeared correctly, FAIL if missing or misaligned

Answer in this exact format:
EMPTY: YES/NO
VALUE: YES/NO
ALIGNED: YES/NO/NA
VERDICT: PASS/FAIL
NOTES: brief observation`;

    const resp = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2-vision:latest',
        prompt,
        images: [compositeImg.toString('base64')],
        stream: false,
        options: { temperature: 0.1, num_predict: 200 },
      }),
      signal: AbortSignal.timeout(60000),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return { ...field, vision: 'error', visionError: `HTTP ${resp.status}: ${text.slice(0, 200)}` };
    }

    const data = await resp.json();
    const response = data.response || '';

    // Parse structured response (handles markdown bold **KEY:** format too)
    const clean = response.replace(/\*\*/g, '');
    const empty = /EMPTY:\s*(YES|NO)/i.exec(clean)?.[1]?.toUpperCase() || 'UNKNOWN';
    const value = /VALUE:\s*(YES|NO)/i.exec(clean)?.[1]?.toUpperCase() || 'UNKNOWN';
    const aligned = /ALIGNED:\s*(YES|NO|NA)/i.exec(clean)?.[1]?.toUpperCase() || 'UNKNOWN';
    const verdict = /VERDICT:\s*(PASS|FAIL)/i.exec(clean)?.[1]?.toUpperCase() || 'UNKNOWN';
    const notes = /NOTES:\s*(.+)/i.exec(clean)?.[1]?.trim() || '';

    return {
      ...field,
      vision: verdict === 'PASS' ? 'pass' : verdict === 'FAIL' ? 'fail' : 'unclear',
      visionDetail: { empty, value, aligned, verdict, notes },
      visionRaw: response.trim(),
    };
  } catch (e) {
    return { ...field, vision: 'error', visionError: e.message };
  }
}

// Process in batches with concurrency
const results = [];
let processed = 0;
let visionPass = 0;
let visionFail = 0;
let visionError = 0;
let visionUnclear = 0;

for (let i = 0; i < fields.length; i += CONCURRENCY) {
  const batch = fields.slice(i, i + CONCURRENCY);
  const batchResults = await Promise.all(batch.map(f => analyzeFieldPair(f)));

  for (const r of batchResults) {
    results.push(r);
    processed++;
    if (r.vision === 'pass') visionPass++;
    else if (r.vision === 'fail') visionFail++;
    else if (r.vision === 'error') visionError++;
    else visionUnclear++;
  }

  if (processed % 20 === 0 || i + CONCURRENCY >= fields.length) {
    console.log(`  [${processed}/${fields.length}] pass=${visionPass} fail=${visionFail} error=${visionError} unclear=${visionUnclear}`);
  }
}

// Save report
const visionReport = {
  timestamp: new Date().toISOString(),
  summary: {
    total: processed,
    pass: visionPass,
    fail: visionFail,
    error: visionError,
    unclear: visionUnclear,
  },
  failures: results.filter(r => r.vision === 'fail'),
  errors: results.filter(r => r.vision === 'error'),
  allResults: results,
};

writeFileSync(REPORT_PATH, JSON.stringify(visionReport, null, 2) + '\n');

console.log(`\n========================================`);
console.log(`VISION ALIGNMENT VALIDATION COMPLETE`);
console.log(`  Total:   ${processed}`);
console.log(`  Pass:    ${visionPass}`);
console.log(`  Fail:    ${visionFail}`);
console.log(`  Error:   ${visionError}`);
console.log(`  Unclear: ${visionUnclear}`);
console.log(`  Report:  ${REPORT_PATH}`);
console.log(`========================================`);

if (visionFail > 0) {
  console.log(`\nFAILED FIELDS:`);
  for (const f of visionReport.failures.slice(0, 30)) {
    console.log(`  ${f.field} (${f.type}) — ${f.visionDetail?.notes || f.visionRaw?.slice(0, 80)}`);
  }
}

process.exit(visionFail > 0 ? 1 : 0);

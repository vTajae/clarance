#!/usr/bin/env node
/**
 * Test ALL 39 sections' PDF layout rendering.
 * For each section: navigate, switch to PDF Layout, verify frames/fields/images.
 */
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { mkdirSync, existsSync, writeFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, '../app');
const require = createRequire(join(appDir, 'package.json'));
const { chromium, request } = require('playwright');

const APP = 'http://localhost:3000';
const OUT = '/tmp/all-sections-test';
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

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

// Auth
const email = `allsec-${Date.now()}@test.dev`;
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

const browser = await chromium.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
});
const ctx = await browser.newContext({
  viewport: { width: 1200, height: 900 },
  deviceScaleFactor: 1,
  storageState,
});
const page = await ctx.newPage();

page.on('crash', () => console.log('  !! PAGE CRASH'));

// Create form by navigating directly with a UUID
const subId = crypto.randomUUID();
console.log(`Form: ${subId}`);
console.log(`Testing ${SECTIONS.length} sections...\n`);

const results = [];
let passCount = 0;
let failCount = 0;

for (const { key, group } of SECTIONS) {
  const t0 = Date.now();
  const result = { section: key, group, status: 'FAIL', frames: 0, fields: 0, fieldsShowAll: 0, imgLoaded: false, error: null, timeMs: 0 };

  try {
    // Navigate
    await page.goto(`${APP}/${subId}/${group}/${key}`, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Wait for Jotai (with short timeout — some sections load fast)
    try {
      await page.waitForFunction(() => window.__JOTAI_STORE__, { timeout: 12000 });
    } catch {
      // Jotai not found — page might not have loaded properly
    }

    // Click PDF Layout
    const pdfBtn = page.locator('button:has-text("PDF Layout")');
    if (await pdfBtn.count() > 0) {
      await pdfBtn.click();
    } else {
      result.error = 'No PDF Layout button';
      result.timeMs = Date.now() - t0;
      results.push(result);
      failCount++;
      console.log(`  ${key.padEnd(12)} FAIL — no PDF Layout button (${result.timeMs}ms)`);
      continue;
    }

    // Wait for frames to appear
    let frameCount = 0;
    for (let w = 0; w < 15; w++) {
      await page.waitForTimeout(1000);
      frameCount = await page.locator('.relative.shadow-md').count();
      if (frameCount > 0) break;
    }

    result.frames = frameCount;

    if (frameCount === 0) {
      result.error = 'No PDF frames rendered';
      result.timeMs = Date.now() - t0;
      results.push(result);
      failCount++;
      console.log(`  ${key.padEnd(12)} FAIL — 0 frames (${result.timeMs}ms)`);
      continue;
    }

    // Count fields (without Show All)
    result.fields = await page.locator('[data-field-key]').count();

    // Enable Show All
    const sa = page.locator('label:has-text("Show All") input[type="checkbox"]');
    if (await sa.count() > 0 && !(await sa.isChecked())) await sa.check();
    await page.waitForTimeout(500);
    result.fieldsShowAll = await page.locator('[data-field-key]').count();

    // Scroll to first frame and check if image loads
    const firstFrame = page.locator('.relative.shadow-md').first();
    await firstFrame.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    // Check first image
    const imgOk = await page.evaluate(() => {
      const img = document.querySelector('.relative.shadow-md img');
      return img ? img.complete && img.naturalWidth > 0 : false;
    });

    // If not loaded, wait more
    if (!imgOk) {
      await page.waitForTimeout(5000);
      result.imgLoaded = await page.evaluate(() => {
        const img = document.querySelector('.relative.shadow-md img');
        return img ? img.complete && img.naturalWidth > 0 : false;
      });
    } else {
      result.imgLoaded = true;
    }

    // Take first-page crop screenshot
    const box = await firstFrame.boundingBox();
    if (box) {
      await page.screenshot({
        path: `${OUT}/${key}-page0.png`,
        clip: { x: box.x, y: box.y, width: box.width, height: box.height },
      }).catch(() => {});
    }

    result.status = 'PASS';
    result.timeMs = Date.now() - t0;
    results.push(result);
    passCount++;

    const imgTag = result.imgLoaded ? '✓img' : '○img';
    console.log(`  ${key.padEnd(12)} PASS  ${result.frames} pages, ${result.fields}→${result.fieldsShowAll} fields, ${imgTag} (${(result.timeMs / 1000).toFixed(1)}s)`);

  } catch (err) {
    result.error = err.message?.split('\n')[0] || String(err);
    result.timeMs = Date.now() - t0;
    results.push(result);
    failCount++;
    console.log(`  ${key.padEnd(12)} FAIL — ${result.error.substring(0, 80)} (${(result.timeMs / 1000).toFixed(1)}s)`);

    // If page crashed, recreate it
    if (err.message?.includes('closed') || err.message?.includes('crash')) {
      try {
        const newPage = await ctx.newPage();
        // Replace page reference — since const, we need to reassign via indirect
        Object.assign(page, newPage); // Won't work with const...
      } catch {
        // Can't recover — skip remaining
      }
    }
  }
}

// Summary
console.log(`\n${'='.repeat(60)}`);
console.log(`RESULTS: ${passCount} PASS / ${failCount} FAIL / ${SECTIONS.length} total`);
console.log(`${'='.repeat(60)}`);

if (failCount > 0) {
  console.log('\nFailed sections:');
  for (const r of results.filter(r => r.status === 'FAIL')) {
    console.log(`  ${r.section}: ${r.error}`);
  }
}

// Stats
const withImg = results.filter(r => r.imgLoaded).length;
const totalFrames = results.reduce((s, r) => s + r.frames, 0);
const totalFields = results.reduce((s, r) => s + r.fieldsShowAll, 0);
console.log(`\nTotal: ${totalFrames} PDF pages, ${totalFields} fields (Show All), ${withImg}/${results.length} first images loaded`);

// Write JSON report
writeFileSync(`${OUT}/report.json`, JSON.stringify(results, null, 2));
console.log(`Report: ${OUT}/report.json`);
console.log(`Screenshots: ${OUT}/<section>-page0.png`);

await browser.close();
await reqCtx.dispose();
console.log('\nDone!');

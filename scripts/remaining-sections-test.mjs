#!/usr/bin/env node
/**
 * Test remaining sections (19, 22-30) that failed in the first run.
 */
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { mkdirSync, existsSync, writeFileSync, readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, '../app');
const require = createRequire(join(appDir, 'package.json'));
const { chromium, request } = require('playwright');

const APP = 'http://localhost:3000';
const OUT = '/tmp/all-sections-test';
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const SECTIONS = [
  { key: 'section19', group: 'foreign' },
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
const email = `rem-${Date.now()}@test.dev`;
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
console.log(`Form: ${subId}\n`);

const results = [];
let passCount = 0;
let failCount = 0;

async function testSection({ key, group }) {
  // Create fresh browser for each section to avoid OOM
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
  page.on('crash', () => console.log(`  !! ${key} PAGE CRASH`));

  const t0 = Date.now();
  const result = { section: key, group, status: 'FAIL', frames: 0, fields: 0, fieldsShowAll: 0, imgLoaded: false, error: null, timeMs: 0 };

  try {
    await page.goto(`${APP}/${subId}/${group}/${key}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    try { await page.waitForFunction(() => window.__JOTAI_STORE__, { timeout: 15000 }); } catch {}

    // Click PDF Layout with longer timeout
    const pdfBtn = page.locator('button:has-text("PDF Layout")');
    if (await pdfBtn.count() > 0) {
      await pdfBtn.click({ timeout: 60000 });
    } else {
      result.error = 'No PDF Layout button';
      throw new Error(result.error);
    }

    // Wait for frames
    let frameCount = 0;
    for (let w = 0; w < 20; w++) {
      await page.waitForTimeout(1000);
      frameCount = await page.locator('.relative.shadow-md').count();
      if (frameCount > 0) break;
    }
    result.frames = frameCount;

    if (frameCount === 0) {
      result.error = 'No PDF frames';
      throw new Error(result.error);
    }

    result.fields = await page.locator('[data-field-key]').count();

    // Show All
    const sa = page.locator('label:has-text("Show All") input[type="checkbox"]');
    if (await sa.count() > 0 && !(await sa.isChecked())) await sa.check();
    await page.waitForTimeout(500);
    result.fieldsShowAll = await page.locator('[data-field-key]').count();

    // Scroll to first frame, wait for image
    const firstFrame = page.locator('.relative.shadow-md').first();
    await firstFrame.scrollIntoViewIfNeeded();
    await page.waitForTimeout(3000);

    result.imgLoaded = await page.evaluate(() => {
      const img = document.querySelector('.relative.shadow-md img');
      return img ? img.complete && img.naturalWidth > 0 : false;
    });

    if (!result.imgLoaded) {
      await page.waitForTimeout(8000);
      result.imgLoaded = await page.evaluate(() => {
        const img = document.querySelector('.relative.shadow-md img');
        return img ? img.complete && img.naturalWidth > 0 : false;
      });
    }

    // Screenshot
    const box = await firstFrame.boundingBox();
    if (box) {
      await page.screenshot({
        path: `${OUT}/${key}-page0.png`,
        clip: { x: box.x, y: box.y, width: box.width, height: box.height },
      }).catch(() => {});
    }

    result.status = 'PASS';
  } catch (err) {
    result.error = result.error || err.message?.split('\n')[0] || String(err);
  }

  result.timeMs = Date.now() - t0;
  await browser.close().catch(() => {});
  return result;
}

for (const sec of SECTIONS) {
  const result = await testSection(sec);
  results.push(result);

  if (result.status === 'PASS') {
    passCount++;
    const imgTag = result.imgLoaded ? '✓img' : '○img';
    console.log(`  ${result.section.padEnd(12)} PASS  ${result.frames} pages, ${result.fields}→${result.fieldsShowAll} fields, ${imgTag} (${(result.timeMs / 1000).toFixed(1)}s)`);
  } else {
    failCount++;
    console.log(`  ${result.section.padEnd(12)} FAIL — ${result.error?.substring(0, 80)} (${(result.timeMs / 1000).toFixed(1)}s)`);
  }
}

console.log(`\n${'='.repeat(60)}`);
console.log(`RESULTS: ${passCount} PASS / ${failCount} FAIL / ${SECTIONS.length} total`);
console.log(`${'='.repeat(60)}`);

if (failCount > 0) {
  console.log('\nFailed:');
  for (const r of results.filter(r => r.status === 'FAIL')) console.log(`  ${r.section}: ${r.error}`);
}

// Merge with existing report
try {
  const existing = JSON.parse(readFileSync(`${OUT}/report.json`, 'utf8'));
  // Replace failed entries with new results
  const merged = existing.map(e => {
    const updated = results.find(r => r.section === e.section);
    return updated || e;
  });
  writeFileSync(`${OUT}/report.json`, JSON.stringify(merged, null, 2));
} catch {
  writeFileSync(`${OUT}/report-remaining.json`, JSON.stringify(results, null, 2));
}

await reqCtx.dispose();
console.log('\nDone!');

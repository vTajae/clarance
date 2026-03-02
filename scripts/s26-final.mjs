#!/usr/bin/env node
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, '../app');
const require = createRequire(join(appDir, 'package.json'));
const { chromium, request } = require('playwright');

const APP = 'http://localhost:3000';
const email = `final-${Date.now()}@test.dev`;
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

page.on('crash', () => console.log('!! PAGE CRASHED'));
page.on('close', () => console.log('!! PAGE CLOSED'));

const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', err => errors.push('PAGE_ERR: ' + err.message));

// Create form
await page.goto(`${APP}/new`, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(3000);
const btn = page.locator('button').filter({ hasText: /create|start/i }).first();
if (await btn.count() > 0) await btn.click();
await page.waitForTimeout(4000);
for (let i = 0; i < 30; i++) { await page.waitForTimeout(500); if (page.url().match(/\/[0-9a-f-]{36}\//)) break; }
const subId = page.url().match(/\/([0-9a-f-]{36})\//)?.[1];
if (!subId) { console.error('No form'); await browser.close(); await reqCtx.dispose(); process.exit(1); }
console.log(`Form: ${subId}`);

// Section 26
console.log('\n=== Section 26 ===');
await page.goto(`${APP}/${subId}/financial/section26`, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(5000);
try { await page.waitForFunction(() => window.__JOTAI_STORE__, { timeout: 10000 }); console.log('Jotai: OK'); } catch { console.log('Jotai: MISSING'); }

// Click PDF Layout
console.log('Clicking PDF Layout...');
const pdfBtn = page.locator('button:has-text("PDF Layout")');
if (await pdfBtn.count() > 0) await pdfBtn.click();

// Wait for render to stabilize
await page.waitForTimeout(2000);
console.log(`After click, URL: ${page.url()}`);

// Check state
const state0 = await page.evaluate(() => ({
  frames: document.querySelectorAll('.relative.shadow-md').length,
  imgs: Array.from(document.querySelectorAll('.relative.shadow-md img')).length,
  fields: document.querySelectorAll('[data-field-key]').length,
}));
console.log(`Frames: ${state0.frames}, Images: ${state0.imgs}, Fields: ${state0.fields}`);

// Wait for images (polling every 2s for up to 40s)
console.log('\nWaiting for images to load (loading=eager, no scrolling)...');
let allLoaded = false;
for (let t = 1; t <= 20; t++) {
  await page.waitForTimeout(2000);
  const sec = t * 2;
  try {
    const imgs = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.relative.shadow-md img')).map(img => ({
        complete: img.complete, w: img.naturalWidth,
      }))
    );
    const loaded = imgs.filter(i => i.complete && i.w > 0).length;
    console.log(`  ${sec}s: ${loaded}/${imgs.length}`);
    if (loaded === imgs.length && imgs.length > 0) { allLoaded = true; break; }
  } catch (e) {
    console.log(`  ${sec}s: ERROR — ${e.message.split('\n')[0]}`);
    break;
  }
}

if (!allLoaded) {
  console.log('Not all images loaded. Testing browser fetch...');
  try {
    const fetchTest = await page.evaluate(async () => {
      const r = await fetch('/api/pdf/render-page/sf861/117?dpi=72');
      return { status: r.status, type: r.headers.get('content-type'), bytes: (await r.arrayBuffer()).byteLength };
    });
    console.log(`Fetch test: ${JSON.stringify(fetchTest)}`);
  } catch (e) {
    console.log(`Fetch test failed: ${e.message.split('\n')[0]}`);
  }
}

// Show All + show fields
const sa = page.locator('label:has-text("Show All") input[type="checkbox"]');
if (await sa.count() > 0 && !(await sa.isChecked())) await sa.check();
const sf = page.locator('label:has-text("Show fields") input[type="checkbox"]');
if (await sf.count() > 0 && !(await sf.isChecked())) await sf.check();

// Set 50% opacity
await page.evaluate(() => {
  const s = document.querySelector('input[type="range"]');
  if (s) {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(s, '50');
    s.dispatchEvent(new Event('input', { bubbles: true }));
    s.dispatchEvent(new Event('change', { bubbles: true }));
  }
});
await page.waitForTimeout(2000);

const finalFields = await page.locator('[data-field-key]').count();
console.log(`\nFields (Show All): ${finalFields}`);

// Screenshots
await page.screenshot({ path: '/tmp/s26-final-full.png', fullPage: true });
console.log('Full: /tmp/s26-final-full.png');

const frameCount = await page.locator('.relative.shadow-md').count();
for (let i = 0; i < Math.min(frameCount, 3); i++) {
  const frame = page.locator('.relative.shadow-md').nth(i);
  await frame.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const box = await frame.boundingBox();
  if (box) {
    await page.screenshot({
      path: `/tmp/s26-p${i}.png`,
      clip: { x: box.x, y: box.y, width: box.width, height: box.height },
    });
    console.log(`Page ${i}: ${box.width.toFixed(0)}x${box.height.toFixed(0)} → /tmp/s26-p${i}.png`);
  }
}

if (errors.length > 0) {
  console.log(`\nConsole errors (${errors.length}):`);
  for (const e of errors.slice(0, 10)) console.log(`  ${e.substring(0, 200)}`);
}

await browser.close();
await reqCtx.dispose();
console.log('\nDone!');

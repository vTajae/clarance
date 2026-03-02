#!/usr/bin/env node
/**
 * Simplified section 26 test — low memory, focused on images.
 */
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, '../app');
const require = createRequire(join(appDir, 'package.json'));
const { chromium, request } = require('playwright');

const APP = 'http://localhost:3000';
const email = `s26s-${Date.now()}@test.dev`;
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

// Low-memory browser settings
const browser = await chromium.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
});
const ctx = await browser.newContext({
  viewport: { width: 1200, height: 900 },
  deviceScaleFactor: 1, // Low DPI to save memory
  storageState,
});
const page = await ctx.newPage();

// Track render-page requests
const renderReqs = new Map();
page.on('request', req => {
  if (req.url().includes('render-page')) {
    renderReqs.set(req.url(), { start: Date.now() });
  }
});
page.on('response', resp => {
  if (resp.url().includes('render-page')) {
    const r = renderReqs.get(resp.url());
    if (r) { r.status = resp.status(); r.elapsed = Date.now() - r.start; }
  }
});
page.on('requestfailed', req => {
  if (req.url().includes('render-page')) {
    const r = renderReqs.get(req.url());
    if (r) { r.error = req.failure()?.errorText; }
  }
});

// Create form
await page.goto(`${APP}/new`, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(3000);
const btn = page.locator('button').filter({ hasText: /create|start/i }).first();
if (await btn.count() > 0) await btn.click();
await page.waitForTimeout(4000);
for (let i = 0; i < 30; i++) { await page.waitForTimeout(500); if (page.url().match(/\/[0-9a-f-]{36}\//)) break; }
const subId = page.url().match(/\/([0-9a-f-]{36})\//)?.[1];
if (!subId) { console.error('No form'); process.exit(1); }
console.log(`Form: ${subId}`);

// Go to section 26
await page.goto(`${APP}/${subId}/financial/section26`, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(5000);
try { await page.waitForFunction(() => window.__JOTAI_STORE__, { timeout: 10000 }); } catch {}

// Click PDF Layout
const pdfBtn = page.locator('button:has-text("PDF Layout")');
if (await pdfBtn.count() > 0) await pdfBtn.click();

// Wait and monitor
for (let t = 0; t < 20; t++) {
  await page.waitForTimeout(2000);
  const sec = (t + 1) * 2;

  const imgs = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.relative.shadow-md img')).map((img, i) => ({
      i, complete: img.complete, natW: img.naturalWidth,
    }))
  );
  const loaded = imgs.filter(i => i.complete && i.natW > 0).length;
  console.log(`${sec}s: ${loaded}/${imgs.length} images loaded`);

  if (loaded === imgs.length && imgs.length > 0) break;

  // At 10s, scroll through all pages
  if (sec === 10 && loaded < imgs.length) {
    const count = await page.locator('.relative.shadow-md').count();
    for (let i = 0; i < count; i++) {
      await page.locator('.relative.shadow-md').nth(i).scrollIntoViewIfNeeded().catch(() => {});
      await page.waitForTimeout(300);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
  }

  // At 20s, try from-browser fetch
  if (sec === 20 && loaded === 0) {
    const fetchTest = await page.evaluate(async () => {
      const r = await fetch('/api/pdf/render-page/sf861/117?dpi=72');
      return { status: r.status, type: r.headers.get('content-type'), size: (await r.blob()).size };
    }).catch(e => ({ error: e.message }));
    console.log(`Browser fetch: ${JSON.stringify(fetchTest)}`);
  }
}

// Network summary
console.log('\nRender-page requests:');
for (const [url, info] of renderReqs) {
  const path = url.substring(url.indexOf('/api/'));
  console.log(`  ${path} → ${info.status ?? 'pending'} ${info.elapsed ? info.elapsed + 'ms' : ''} ${info.error ?? ''}`);
}

await page.screenshot({ path: '/tmp/s26-simple.png', fullPage: true }).catch(() => {});

// Also quickly test section 1 (known working) for comparison
console.log('\n=== Section 1 comparison ===');
await page.goto(`${APP}/${subId}/identification/section1`, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(5000);
try { await page.waitForFunction(() => window.__JOTAI_STORE__, { timeout: 10000 }); } catch {}
const pdfBtn2 = page.locator('button:has-text("PDF Layout")');
if (await pdfBtn2.count() > 0) await pdfBtn2.click();
await page.waitForTimeout(10000);

const s1imgs = await page.evaluate(() =>
  Array.from(document.querySelectorAll('.relative.shadow-md img')).map((img, i) => ({
    i, complete: img.complete, natW: img.naturalWidth,
    src: img.src.substring(img.src.indexOf('/api/')),
  }))
);
console.log(`Section 1: ${s1imgs.filter(i => i.complete && i.natW > 0).length}/${s1imgs.length} images loaded`);
for (const img of s1imgs) console.log(`  [${img.i}] complete=${img.complete} ${img.natW}x${img.natW} ${img.src}`);

await browser.close();
await reqCtx.dispose();
console.log('\nDone!');

#!/usr/bin/env node
/**
 * Focused test: why do section 26 images fail to load?
 */
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, '../app');
const require = createRequire(join(appDir, 'package.json'));
const { chromium, request } = require('playwright');

const APP = 'http://localhost:3000';
const email = `imgdbg-${Date.now()}@test.dev`;
const pw = 'TestPass1234';

// Auth
await fetch(`${APP}/api/auth/register`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password: pw }),
});
const reqCtx = await request.newContext({ baseURL: APP });
const csrfResp = await reqCtx.get('/api/auth/csrf');
const { csrfToken } = await csrfResp.json();
await reqCtx.post('/api/auth/callback/credentials', {
  form: { email, password: pw, csrfToken, redirect: 'false', callbackUrl: `${APP}/`, json: 'true' },
});
const storageState = await reqCtx.storageState();
console.log('Auth OK');

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 1800, height: 1200 }, deviceScaleFactor: 2, storageState });
const page = await ctx.newPage();

// Track network requests for render-page
const renderRequests = [];
page.on('request', req => {
  if (req.url().includes('render-page')) {
    renderRequests.push({ url: req.url(), time: Date.now() });
  }
});
page.on('response', resp => {
  if (resp.url().includes('render-page')) {
    const req = renderRequests.find(r => r.url === resp.url());
    if (req) req.status = resp.status();
    if (req) req.elapsed = Date.now() - req.time;
  }
});

// Create form + go to section 26
await page.goto(`${APP}/new`, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(3000);
const btn = page.locator('button').filter({ hasText: /create|start/i }).first();
if (await btn.count() > 0) await btn.click();
await page.waitForTimeout(4000);
for (let i = 0; i < 30; i++) {
  await page.waitForTimeout(500);
  if (page.url().match(/\/[0-9a-f-]{36}\//)) break;
}
const subId = page.url().match(/\/([0-9a-f-]{36})\//)?.[1];
if (!subId) { console.error('No form'); await browser.close(); await reqCtx.dispose(); process.exit(1); }
console.log(`Form: ${subId}`);

await page.goto(`${APP}/${subId}/financial/section26`, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(5000);
try { await page.waitForFunction(() => window.__JOTAI_STORE__, { timeout: 10000 }); } catch {}

// Switch to PDF Layout
const pdfBtn = page.locator('button:has-text("PDF Layout")');
if (await pdfBtn.count() > 0) { await pdfBtn.click(); }

// Wait longer this time — check every 3s for 45s
console.log('\nMonitoring image loading...');
for (let t = 0; t < 15; t++) {
  await page.waitForTimeout(3000);
  const elapsed = (t + 1) * 3;

  const imgState = await page.evaluate(() => {
    const imgs = document.querySelectorAll('.relative.shadow-md img');
    return Array.from(imgs).map((img, i) => ({
      i, complete: img.complete, natW: img.naturalWidth, natH: img.naturalHeight,
    }));
  });

  const loaded = imgState.filter(img => img.complete && img.natW > 0).length;
  const total = imgState.length;
  console.log(`  ${elapsed}s: ${loaded}/${total} loaded`);

  if (loaded === total && total > 0) {
    console.log('All images loaded!');
    break;
  }

  // After 9s, try scrolling to trigger lazy load
  if (t === 2) {
    console.log('  Scrolling to trigger lazy load...');
    for (let i = 0; i < total; i++) {
      const frame = page.locator('.relative.shadow-md').nth(i);
      await frame.scrollIntoViewIfNeeded().catch(() => {});
      await page.waitForTimeout(200);
    }
    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
  }

  // After 18s, try removing loading=lazy
  if (t === 5 && loaded === 0) {
    console.log('  Removing loading=lazy...');
    await page.evaluate(() => {
      document.querySelectorAll('.relative.shadow-md img').forEach(img => {
        img.removeAttribute('loading');
        // Force reload
        const src = img.src;
        img.src = '';
        img.src = src;
      });
    });
  }

  // After 30s, test fetch from browser directly
  if (t === 9 && loaded === 0) {
    console.log('  Testing fetch from browser...');
    const fetchResult = await page.evaluate(async () => {
      try {
        const r = await fetch('/api/pdf/render-page/sf861/117?dpi=72');
        return { status: r.status, type: r.headers.get('content-type'), size: (await r.blob()).size };
      } catch (e) {
        return { error: e.message };
      }
    });
    console.log(`  Fetch result: ${JSON.stringify(fetchResult)}`);
  }
}

// Network request summary
console.log(`\nNetwork requests for render-page: ${renderRequests.length}`);
for (const r of renderRequests) {
  console.log(`  ${r.url.substring(r.url.indexOf('/api/'))} → ${r.status ?? 'pending'} (${r.elapsed ?? '?'}ms)`);
}

// Final screenshot
const finalImgState = await page.evaluate(() => {
  const imgs = document.querySelectorAll('.relative.shadow-md img');
  return Array.from(imgs).map((img, i) => ({
    i, complete: img.complete, natW: img.naturalWidth, natH: img.naturalHeight,
    src: img.src.substring(img.src.indexOf('/api/')),
  }));
});
console.log('\nFinal image state:');
for (const img of finalImgState) {
  console.log(`  [${img.i}] complete=${img.complete} ${img.natW}x${img.natH} ${img.src}`);
}

await page.screenshot({ path: '/tmp/s26-imgdebug.png', fullPage: true });
console.log('Screenshot: /tmp/s26-imgdebug.png');

await browser.close();
await reqCtx.dispose();
console.log('Done!');

#!/usr/bin/env node
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, '../app');
const require = createRequire(join(appDir, 'package.json'));
const { chromium, request } = require('playwright');

const APP = 'http://localhost:3000';
const email = `stbl-${Date.now()}@test.dev`;
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
  args: [
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--no-zygote',
    '--single-process',
  ],
});
const ctx = await browser.newContext({
  viewport: { width: 1000, height: 800 },
  deviceScaleFactor: 1,
  storageState,
});
const page = await ctx.newPage();

// Track crashes
page.on('crash', () => console.log('PAGE CRASHED'));
page.on('close', () => console.log('PAGE CLOSED'));
browser.on('disconnected', () => console.log('BROWSER DISCONNECTED'));

const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', err => errors.push('PAGE: ' + err.message));

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

// Go to section 26
await page.goto(`${APP}/${subId}/financial/section26`, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(5000);

// Check page health
console.log(`URL: ${page.url()}`);
console.log(`Browser connected: ${browser.isConnected()}`);

try { await page.waitForFunction(() => window.__JOTAI_STORE__, { timeout: 10000 }); console.log('Jotai OK'); } catch { console.log('No Jotai'); }

// PDF Layout
const pdfBtn = page.locator('button:has-text("PDF Layout")');
if (await pdfBtn.count() > 0) await pdfBtn.click();
console.log('Clicked PDF Layout');

// Simple wait and check every second
for (let t = 1; t <= 30; t++) {
  try {
    await page.waitForTimeout(1000);
    if (t % 3 === 0) {
      const count = await page.evaluate(() => {
        const imgs = document.querySelectorAll('.relative.shadow-md img');
        let loaded = 0;
        for (const img of imgs) {
          if (img.complete && img.naturalWidth > 0) loaded++;
        }
        return { total: imgs.length, loaded };
      });
      console.log(`${t}s: ${count.loaded}/${count.total} images, browser=${browser.isConnected()}`);
      if (count.loaded === count.total && count.total > 0) break;
    }
  } catch (e) {
    console.log(`${t}s: ERROR — ${e.message.split('\n')[0]}`);
    break;
  }
}

// Final check
try {
  const finalState = await page.evaluate(() => ({
    frames: document.querySelectorAll('.relative.shadow-md').length,
    fields: document.querySelectorAll('[data-field-key]').length,
    imgs: Array.from(document.querySelectorAll('.relative.shadow-md img')).map((img, i) => ({
      i, complete: img.complete, natW: img.naturalWidth,
    })),
  }));
  console.log(`\nFinal: ${finalState.frames} frames, ${finalState.fields} fields`);
  for (const img of finalState.imgs) {
    console.log(`  img[${img.i}] ${img.complete ? 'loaded' : 'pending'} ${img.natW}px`);
  }

  await page.screenshot({ path: '/tmp/s26-stable.png', fullPage: true });
  console.log('Screenshot: /tmp/s26-stable.png');
} catch (e) {
  console.log(`Final check failed: ${e.message.split('\n')[0]}`);
}

if (errors.length > 0) {
  console.log(`\nConsole errors (${errors.length}):`);
  for (const e of errors.slice(0, 10)) console.log(`  ${e.substring(0, 200)}`);
}

await browser.close().catch(() => {});
await reqCtx.dispose();
console.log('\nDone!');

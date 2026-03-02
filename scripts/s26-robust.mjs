#!/usr/bin/env node
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { mkdirSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, '../app');
const require = createRequire(join(appDir, 'package.json'));
const { chromium, request } = require('playwright');

const APP = 'http://localhost:3000';
const OUT = '/tmp/s26-robust';
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

// Auth
const email = `rob-${Date.now()}@test.dev`;
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

page.on('crash', () => console.log('!! CRASH'));
page.on('close', () => console.log('!! CLOSE'));
page.on('pageerror', err => console.log('!! PAGE_ERR:', err.message.substring(0, 300)));

// Create form — use server API to avoid slow client-side navigation
const { v4: uuidv4 } = await import('uuid').catch(() => ({ v4: () => crypto.randomUUID() }));
const subId = crypto.randomUUID();
console.log(`Form: ${subId}`);

// Navigate directly to section 26
console.log('\n=== Section 26 ===');
await page.goto(`${APP}/${subId}/financial/section26`, { waitUntil: 'domcontentloaded', timeout: 60000 });
console.log(`URL: ${page.url()}`);

// Wait for page to fully render
await page.waitForTimeout(8000);

// Take screenshot of flow mode
await page.screenshot({ path: `${OUT}/flow-mode.png`, fullPage: true, timeout: 60000 });
console.log('Flow mode screenshot saved');

// Check Jotai
try {
  await page.waitForFunction(() => window.__JOTAI_STORE__, { timeout: 15000 });
  console.log('Jotai: OK');
} catch { console.log('Jotai: timeout'); }

// Find and click PDF Layout button
console.log('\nLooking for PDF Layout button...');
const allBtns = await page.locator('button').allTextContents();
console.log(`Buttons on page: ${allBtns.filter(t => t.trim()).join(', ')}`);

const pdfBtn = page.locator('button:has-text("PDF Layout")');
const pdfBtnCount = await pdfBtn.count();
console.log(`PDF Layout buttons found: ${pdfBtnCount}`);

if (pdfBtnCount > 0) {
  await pdfBtn.click();
  console.log('Clicked PDF Layout');

  // Wait for frames to appear (with polling)
  console.log('Waiting for PDF frames to appear...');
  for (let t = 1; t <= 30; t++) {
    await page.waitForTimeout(1000);
    const fc = await page.locator('.relative.shadow-md').count();
    if (fc > 0) {
      console.log(`Frames appeared after ${t}s: ${fc}`);
      break;
    }
    if (t === 30) console.log('No frames after 30s');
  }
}

// Check current state
const state = await page.evaluate(() => ({
  frames: document.querySelectorAll('.relative.shadow-md').length,
  fields: document.querySelectorAll('[data-field-key]').length,
  imgs: Array.from(document.querySelectorAll('.relative.shadow-md img')).length,
  bodyText: document.body.innerText.substring(0, 500),
}));
console.log(`\nFrames: ${state.frames}, Fields: ${state.fields}, Imgs: ${state.imgs}`);

// If no frames, take diagnostic screenshot
if (state.frames === 0) {
  console.log('\n!! NO FRAMES — taking diagnostic screenshot');
  console.log('Body text:', state.bodyText.substring(0, 300));
  await page.screenshot({ path: `${OUT}/no-frames.png`, fullPage: true, timeout: 60000 });
  console.log(`Saved: ${OUT}/no-frames.png`);
} else {
  // Enable controls
  const sa = page.locator('label:has-text("Show All") input[type="checkbox"]');
  if (await sa.count() > 0 && !(await sa.isChecked())) await sa.check();
  const sf = page.locator('label:has-text("Show fields") input[type="checkbox"]');
  if (await sf.count() > 0 && !(await sf.isChecked())) await sf.check();

  await page.evaluate(() => {
    const s = document.querySelector('input[type="range"]');
    if (s) {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(s, '50');
      s.dispatchEvent(new Event('input', { bubbles: true }));
      s.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await page.waitForTimeout(1000);

  // Scroll through each frame
  for (let i = 0; i < state.frames; i++) {
    const frame = page.locator('.relative.shadow-md').nth(i);
    await frame.scrollIntoViewIfNeeded();
    await page.waitForTimeout(3000); // Wait for lazy-loaded image

    const imgOk = await page.evaluate((idx) => {
      const img = document.querySelectorAll('.relative.shadow-md img')[idx];
      if (!img) return null;
      return { complete: img.complete, w: img.naturalWidth, h: img.naturalHeight };
    }, i);

    if (imgOk && (!imgOk.complete || imgOk.w === 0)) {
      // Wait more for this image
      for (let w = 0; w < 10; w++) {
        await page.waitForTimeout(1000);
        const check = await page.evaluate((idx) => {
          const img = document.querySelectorAll('.relative.shadow-md img')[idx];
          return img?.complete && img?.naturalWidth > 0;
        }, i);
        if (check) break;
      }
    }

    const box = await frame.boundingBox();
    if (box) {
      await page.screenshot({
        path: `${OUT}/page${i}.png`,
        clip: { x: box.x, y: box.y, width: box.width, height: box.height },
      });

      const finalImg = await page.evaluate((idx) => {
        const img = document.querySelectorAll('.relative.shadow-md img')[idx];
        return img ? { ok: img.complete && img.naturalWidth > 0, w: img.naturalWidth } : null;
      }, i);
      console.log(`  Page ${i}: ${box.width.toFixed(0)}x${box.height.toFixed(0)} img=${finalImg?.ok ? `${finalImg.w}px` : 'MISSING'}`);
    }
  }

  const finalFields = await page.locator('[data-field-key]').count();
  console.log(`\nTotal fields with Show All: ${finalFields}`);
  console.log(`Crops saved to: ${OUT}/page0.png ... page${state.frames - 1}.png`);
}

await browser.close();
await reqCtx.dispose();
console.log('\nDone!');

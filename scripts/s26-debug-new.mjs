#!/usr/bin/env node
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, '../app');
const require = createRequire(join(appDir, 'package.json'));
const { chromium, request } = require('playwright');

const APP = 'http://localhost:3000';
const email = `debug-${Date.now()}@test.dev`;
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

page.on('crash', () => console.log('!! CRASH at', new Date().toISOString()));
page.on('close', () => console.log('!! CLOSE at', new Date().toISOString()));
page.on('pageerror', err => console.log('!! PAGE_ERROR:', err.message.substring(0, 200)));

// Navigate to /new
console.log('Navigating to /new...');
await page.goto(`${APP}/new`, { waitUntil: 'domcontentloaded', timeout: 30000 });
console.log('At:', page.url());
await page.waitForTimeout(3000);

// Screenshot before click
await page.screenshot({ path: '/tmp/new-before.png' });
console.log('Saved: /tmp/new-before.png');

// Click create
const btn = page.locator('button').filter({ hasText: /create/i }).first();
const btnExists = await btn.count();
console.log(`Create button: ${btnExists > 0 ? 'found' : 'NOT FOUND'}`);

if (btnExists > 0) {
  console.log('Clicking...');
  await btn.click();

  // Monitor URL changes every second
  for (let i = 1; i <= 30; i++) {
    try {
      await page.waitForTimeout(1000);
      const url = page.url();
      console.log(`${i}s: ${url}`);
      if (url.match(/\/[0-9a-f-]{36}\//)) {
        console.log('Form created!');
        const subId = url.match(/\/([0-9a-f-]{36})\//)[1];
        console.log(`SubID: ${subId}`);

        // Now navigate to section 26
        console.log('\n=== Going to Section 26 ===');
        await page.goto(`${APP}/${subId}/financial/section26`, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForTimeout(5000);
        console.log(`At: ${page.url()}`);

        // Click PDF Layout
        const pdfBtn = page.locator('button:has-text("PDF Layout")');
        if (await pdfBtn.count() > 0) {
          await pdfBtn.click();
          console.log('Clicked PDF Layout');
        }

        // Wait for images
        console.log('Waiting for images...');
        for (let t = 1; t <= 15; t++) {
          await page.waitForTimeout(2000);
          const imgs = await page.evaluate(() => {
            const all = document.querySelectorAll('.relative.shadow-md img');
            let loaded = 0;
            for (const img of all) if (img.complete && img.naturalWidth > 0) loaded++;
            return { total: all.length, loaded };
          });
          console.log(`  ${t*2}s: ${imgs.loaded}/${imgs.total} images`);
          if (imgs.loaded === imgs.total && imgs.total > 0) break;
        }

        // Show All
        const sa = page.locator('label:has-text("Show All") input[type="checkbox"]');
        if (await sa.count() > 0 && !(await sa.isChecked())) await sa.check();
        await page.waitForTimeout(2000);

        const fields = await page.locator('[data-field-key]').count();
        console.log(`\nFields: ${fields}`);

        await page.screenshot({ path: '/tmp/s26-result.png', fullPage: true });
        console.log('Screenshot: /tmp/s26-result.png');

        // Crop first page
        const frame = page.locator('.relative.shadow-md').first();
        await frame.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);
        const box = await frame.boundingBox();
        if (box) {
          await page.screenshot({
            path: '/tmp/s26-page0.png',
            clip: { x: box.x, y: box.y, width: box.width, height: box.height },
          });
          console.log(`Page 0: ${box.width.toFixed(0)}x${box.height.toFixed(0)}`);
        }

        break;
      }
      if (url.includes('/login')) {
        console.log('Redirected to login!');
        break;
      }
    } catch (e) {
      console.log(`${i}s: ERROR — ${e.message.split('\n')[0]}`);
      break;
    }
  }
}

await browser.close().catch(() => {});
await reqCtx.dispose();
console.log('\nDone!');

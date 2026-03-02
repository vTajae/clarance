#!/usr/bin/env node
/**
 * Final alignment verification: screenshots at 40% field opacity
 * so both PDF background and overlay elements are visible together.
 */
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { mkdirSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, '../app');
const require = createRequire(join(appDir, 'package.json'));
const { chromium } = require('playwright');

const APP = 'http://localhost:3000';
const OUT = '/tmp/align-verify';
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 1800, height: 1200 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

// Auth
const email = `verify-${Date.now()}@test.dev`;
const pw = 'verify1234';
await fetch(`${APP}/api/auth/register`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password: pw }),
});
await page.goto(`${APP}/login`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(2000);
await page.fill('input#email', email);
await page.fill('input#password', pw);
await page.click('button[type="submit"]');
for (let i = 0; i < 30; i++) { await page.waitForTimeout(500); if (!page.url().includes('/login')) break; }
console.log(`Logged in, at: ${page.url()}`);

// Create form - handle possible button text variations
await page.goto(`${APP}/new`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(4000);

// Try clicking the create form button
const createBtn = page.locator('button').filter({ hasText: /create|start|begin|new/i }).first();
if (await createBtn.count() > 0) {
  console.log(`Found button: ${await createBtn.textContent()}`);
  await createBtn.click();
} else {
  console.log('No create button found, checking page...');
  // Maybe just click the first visible button
  const anyBtn = page.locator('main button').first();
  if (await anyBtn.count() > 0) {
    console.log(`Clicking: ${await anyBtn.textContent()}`);
    await anyBtn.click();
  }
}
await page.waitForTimeout(3000);

// Wait for redirect to section1
for (let i = 0; i < 30; i++) {
  await page.waitForTimeout(500);
  const url = page.url();
  if (url.includes('/identification/section1') || url.match(/\/[0-9a-f-]{36}\//)) break;
}

const url = page.url();
console.log(`At: ${url}`);
const match = url.match(/\/([0-9a-f-]{36})\//);
const subId = match ? match[1] : null;
if (!subId) {
  console.error('Could not extract submission ID');
  await browser.close();
  process.exit(1);
}
console.log(`Form: ${subId}`);

async function setupPdfLayout(opacity = 40) {
  const btn = page.locator('button:has-text("PDF Layout")');
  if (await btn.count() > 0) { await btn.click(); await page.waitForTimeout(2000); }

  // Set opacity
  await page.evaluate((op) => {
    const s = document.querySelector('input[type="range"]');
    if (s) {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(s, String(op));
      s.dispatchEvent(new Event('input', { bubbles: true }));
      s.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, opacity);

  const sa = page.locator('label:has-text("Show All") input[type="checkbox"]');
  if (await sa.count() > 0 && !(await sa.isChecked())) await sa.check();
  const sf = page.locator('label:has-text("Show fields") input[type="checkbox"]');
  if (await sf.count() > 0 && !(await sf.isChecked())) await sf.check();
  await page.waitForTimeout(3000);
  await page.evaluate(async () => {
    const imgs = document.querySelectorAll('.relative.shadow-md img');
    await Promise.all(Array.from(imgs).map(img =>
      img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; })
    ));
  });
  await page.waitForTimeout(1000);
}

async function cropFrameRegion(frameIdx, pdfX, pdfY, pdfW, pdfH, filename) {
  const frame = await page.evaluate((idx) => {
    const frames = document.querySelectorAll('.relative.shadow-md');
    if (idx >= frames.length) return null;
    frames[idx].scrollIntoView({ behavior: 'instant', block: 'start' });
    return true;
  }, frameIdx);
  if (!frame) { console.log(`  Frame ${frameIdx} not found`); return; }
  await page.waitForTimeout(500);

  const f = await page.evaluate((idx) => {
    const frames = document.querySelectorAll('.relative.shadow-md');
    if (idx >= frames.length) return null;
    const r = frames[idx].getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  }, frameIdx);
  if (!f) return;

  const scale = f.w / 612;
  await page.screenshot({
    path: `${OUT}/${filename}`,
    clip: {
      x: Math.max(0, f.x + pdfX * scale),
      y: Math.max(0, f.y + pdfY * scale),
      width: Math.min(pdfW * scale, 1800),
      height: Math.min(pdfH * scale, 1200),
    },
  });
  console.log(`  ${filename}`);
}

// ===== Section 9 — Citizenship radios =====
console.log('\n=== Section 9 (40% opacity — radio alignment) ===');
await page.goto(`${APP}/${subId}/citizenship/section9`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(5000);
try { await page.waitForFunction(() => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__, { timeout: 15000 }); } catch {}
await setupPdfLayout(40);

// Radio area on page 0
await cropFrameRegion(0, 15, 320, 200, 80, 's9-radios-top.png');
await cropFrameRegion(0, 15, 610, 120, 40, 's9-radios-bottom.png');
// Full top of first page
await cropFrameRegion(0, 0, 280, 612, 150, 's9-full-radio-area.png');
// Bottom of page (SSN area)
await cropFrameRegion(0, 0, 700, 612, 92, 's9-page-bottom.png');

// ===== Section 8 — U.S. Passport =====
console.log('\n=== Section 8 (40% opacity — YES/NO radios) ===');
await page.goto(`${APP}/${subId}/citizenship/section8`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(5000);
try { await page.waitForFunction(() => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__, { timeout: 15000 }); } catch {}
await setupPdfLayout(40);

await cropFrameRegion(0, 0, 280, 612, 200, 's8-radio-text-area.png');
await cropFrameRegion(0, 15, 420, 200, 40, 's8-radio-closeup.png');
await cropFrameRegion(0, 0, 700, 612, 92, 's8-page-bottom.png');

// ===== Section 1 — Name + SSN =====
console.log('\n=== Section 1 (40% opacity — text fields + SSN bottom) ===');
await page.goto(`${APP}/${subId}/identification/section1`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(5000);
try { await page.waitForFunction(() => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__, { timeout: 15000 }); } catch {}
await setupPdfLayout(40);

// Text fields at top
await cropFrameRegion(0, 0, 250, 612, 200, 's1-text-fields.png');
// SSN at bottom
await cropFrameRegion(0, 0, 700, 612, 92, 's1-ssn-bottom.png');

// ===== Section 5 — Both radios and checkboxes =====
console.log('\n=== Section 5 (40% opacity — mixed radios + checkboxes) ===');
await page.goto(`${APP}/${subId}/identification/section5`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(5000);
try { await page.waitForFunction(() => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__, { timeout: 15000 }); } catch {}
await setupPdfLayout(40);

await cropFrameRegion(0, 80, 390, 500, 50, 's5-radio-checkbox-row.png');
await cropFrameRegion(0, 280, 400, 200, 30, 's5-radio-closeup.png');
await cropFrameRegion(0, 100, 400, 160, 30, 's5-checkbox-closeup.png');
// Full mixed area
await cropFrameRegion(0, 0, 380, 612, 220, 's5-full-mixed.png');

await browser.close();
console.log(`\nAll verification screenshots in ${OUT}/`);

#!/usr/bin/env node
/**
 * Precise diagnostic: measure radio vs checkbox child-element offset
 * against the container div to find the source of the ~2-3px radio misalignment.
 */
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, '../app');
const require = createRequire(join(appDir, 'package.json'));
const { chromium } = require('playwright');

const APP = 'http://localhost:3000';

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 1800, height: 1200 }, deviceScaleFactor: 3 });
const page = await ctx.newPage();

// Auth
const email = `diag-${Date.now()}@test.dev`;
const pw = 'diagCheck1234';
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

// Create form
await page.goto(`${APP}/new`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(3000);
await page.click('button:has-text("Create Form")');
for (let i = 0; i < 30; i++) { await page.waitForTimeout(500); if (page.url().includes('/identification/section1')) break; }
const subId = page.url().split('/')[3];
console.log(`Form: ${subId}`);

async function setupPdfLayout() {
  const btn = page.locator('button:has-text("PDF Layout")');
  if (await btn.count() > 0) { await btn.click(); await page.waitForTimeout(2000); }
  await page.evaluate(() => {
    const s = document.querySelector('input[type="range"]');
    if (s) {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(s, '100');
      s.dispatchEvent(new Event('input', { bubbles: true }));
      s.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
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

// ========================= Section 9 =========================
console.log('\n=== Section 9 — Citizenship ===');
await page.goto(`${APP}/${subId}/citizenship/section9`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(5000);
try { await page.waitForFunction(() => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__, { timeout: 15000 }); } catch {}
await setupPdfLayout();

const info = await page.evaluate(() => {
  const results = [];
  const fields = document.querySelectorAll('[data-field-key]');
  const frames = document.querySelectorAll('.relative.shadow-md');
  if (frames.length === 0) return { error: 'No frames' };

  const frameRect = frames[0].getBoundingClientRect();
  const img = frames[0].querySelector('img');
  const imgRect = img ? img.getBoundingClientRect() : null;

  const frameInfo = {
    frameX: frameRect.x, frameY: frameRect.y,
    frameW: frameRect.width, frameH: frameRect.height,
    imgX: imgRect?.x, imgY: imgRect?.y,
    imgW: imgRect?.width, imgH: imgRect?.height,
    imgNatW: img?.naturalWidth, imgNatH: img?.naturalHeight,
  };

  for (const el of fields) {
    const key = el.getAttribute('data-field-key');
    const rect = el.getBoundingClientRect();
    // Only fields on first frame
    if (rect.y < frameRect.y - 5 || rect.y > frameRect.y + frameRect.height + 5) continue;

    const isRadio = key.includes('radio');
    const child = el.firstElementChild;
    const childRect = child ? child.getBoundingClientRect() : null;
    const childCS = child ? getComputedStyle(child) : null;

    results.push({
      key: key.substring(0, 70),
      isRadio,
      childTag: child?.tagName || 'none',
      // Container position relative to frame
      relX: rect.x - frameRect.x,
      relY: rect.y - frameRect.y,
      cW: rect.width, cH: rect.height,
      // Child offset from container
      chOffX: childRect ? childRect.x - rect.x : null,
      chOffY: childRect ? childRect.y - rect.y : null,
      chW: childRect?.width, chH: childRect?.height,
      // Child computed styles
      chPadT: childCS?.paddingTop,
      chPadL: childCS?.paddingLeft,
      chMarT: childCS?.marginTop,
      chMarL: childCS?.marginLeft,
      chBorT: childCS?.borderTopWidth,
      chBorL: childCS?.borderLeftWidth,
      chBoxSz: childCS?.boxSizing,
      chDisp: childCS?.display,
    });
  }

  return { frameInfo, fields: results };
});

console.log('\n--- Frame Info ---');
const fi = info.frameInfo;
console.log(`Frame: (${fi.frameX.toFixed(1)}, ${fi.frameY.toFixed(1)}) ${fi.frameW.toFixed(1)}x${fi.frameH.toFixed(1)}`);
console.log(`Image: (${fi.imgX?.toFixed(1)}, ${fi.imgY?.toFixed(1)}) ${fi.imgW?.toFixed(1)}x${fi.imgH?.toFixed(1)}`);
console.log(`Image natural: ${fi.imgNatW}x${fi.imgNatH}`);
console.log(`Frame-Image offset: dx=${((fi.imgX || 0) - fi.frameX).toFixed(3)}, dy=${((fi.imgY || 0) - fi.frameY).toFixed(3)}`);
console.log(`Scale factor: ${(fi.frameW / 612).toFixed(6)}`);

console.log('\n--- Field positions on first page ---');
const header = `${'Key'.padEnd(55)} ${'Type'.padEnd(6)} ${'Tag'.padEnd(8)} ${'relX'.padStart(8)} ${'relY'.padStart(8)} ${'cW'.padStart(6)} ${'cH'.padStart(6)} ${'chOffY'.padStart(8)} ${'chW'.padStart(6)} ${'chH'.padStart(6)} ${'padT'.padStart(6)} ${'marT'.padStart(6)} ${'borT'.padStart(6)} ${'boxSz'.padStart(12)} ${'disp'.padStart(14)}`;
console.log(header);
for (const f of info.fields.slice(0, 25)) {
  const t = f.isRadio ? 'RADIO' : 'OTHER';
  console.log(
    `${f.key.padEnd(55)} ${t.padEnd(6)} ${f.childTag.padEnd(8)} ${f.relX.toFixed(2).padStart(8)} ${f.relY.toFixed(2).padStart(8)} ${f.cW.toFixed(1).padStart(6)} ${f.cH.toFixed(1).padStart(6)} ${(f.chOffY ?? 0).toFixed(3).padStart(8)} ${(f.chW ?? 0).toFixed(1).padStart(6)} ${(f.chH ?? 0).toFixed(1).padStart(6)} ${(f.chPadT || '').padStart(6)} ${(f.chMarT || '').padStart(6)} ${(f.chBorT || '').padStart(6)} ${(f.chBoxSz || '').padStart(12)} ${(f.chDisp || '').padStart(14)}`
  );
}

// Check if radio children have nonzero offset
const radioFields = info.fields.filter(f => f.isRadio);
const otherFields = info.fields.filter(f => !f.isRadio);
console.log(`\n--- Summary ---`);
console.log(`Radio fields: ${radioFields.length}`);
console.log(`Other fields: ${otherFields.length}`);

if (radioFields.length > 0) {
  const avgRadioOffY = radioFields.reduce((s, f) => s + (f.chOffY || 0), 0) / radioFields.length;
  const avgRadioOffX = radioFields.reduce((s, f) => s + (f.chOffX || 0), 0) / radioFields.length;
  console.log(`Avg radio child offset: X=${avgRadioOffX.toFixed(3)}, Y=${avgRadioOffY.toFixed(3)}`);
}
if (otherFields.length > 0) {
  const avgOtherOffY = otherFields.reduce((s, f) => s + (f.chOffY || 0), 0) / otherFields.length;
  const avgOtherOffX = otherFields.reduce((s, f) => s + (f.chOffX || 0), 0) / otherFields.length;
  console.log(`Avg other child offset: X=${avgOtherOffX.toFixed(3)}, Y=${avgOtherOffY.toFixed(3)}`);
}

// Take tight crops of the first radio and first other field
if (radioFields.length > 0) {
  const r = radioFields[0];
  const el = page.locator(`[data-field-key="${r.key}"]`).first();
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const box = await el.boundingBox();
  if (box) {
    await page.screenshot({
      path: '/tmp/diag_s9_radio.png',
      clip: { x: Math.max(0, box.x - 15), y: Math.max(0, box.y - 15), width: box.width + 30, height: box.height + 30 },
    });
    console.log(`\nRadio crop: /tmp/diag_s9_radio.png (${box.width.toFixed(1)}x${box.height.toFixed(1)})`);
  }
}

// Radio pair crop
if (radioFields.length >= 2) {
  const el0 = page.locator(`[data-field-key="${radioFields[0].key}"]`).first();
  const el1 = page.locator(`[data-field-key="${radioFields[1].key}"]`).first();
  await el0.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  const b0 = await el0.boundingBox();
  const b1 = await el1.boundingBox();
  if (b0 && b1) {
    const mx = Math.min(b0.x, b1.x);
    const my = Math.min(b0.y, b1.y);
    const mxr = Math.max(b0.x + b0.width, b1.x + b1.width);
    const myr = Math.max(b0.y + b0.height, b1.y + b1.height);
    await page.screenshot({
      path: '/tmp/diag_s9_radio_pair.png',
      clip: { x: Math.max(0, mx - 20), y: Math.max(0, my - 15), width: mxr - mx + 40, height: myr - my + 30 },
    });
    console.log(`Radio pair crop: /tmp/diag_s9_radio_pair.png`);
  }
}

if (otherFields.length > 0) {
  const o = otherFields[0];
  const el = page.locator(`[data-field-key="${o.key}"]`).first();
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const box = await el.boundingBox();
  if (box) {
    await page.screenshot({
      path: '/tmp/diag_s9_other.png',
      clip: { x: Math.max(0, box.x - 15), y: Math.max(0, box.y - 15), width: box.width + 30, height: box.height + 30 },
    });
    console.log(`Other crop: /tmp/diag_s9_other.png (${box.width.toFixed(1)}x${box.height.toFixed(1)})`);
  }
}

await browser.close();
console.log('\nDone!');

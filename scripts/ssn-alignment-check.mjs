#!/usr/bin/env node
/**
 * SSN page header alignment check: verifies SSN fields at y=739
 * are properly positioned at the bottom of each PDF page.
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
const email = `ssn-${Date.now()}@test.dev`;
const pw = 'ssnCheck1234';
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

await page.goto(`${APP}/new`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(3000);
await page.click('button:has-text("Create Form")');
for (let i = 0; i < 30; i++) { await page.waitForTimeout(500); if (page.url().includes('/identification/section1')) break; }
const subId = page.url().split('/')[3];
console.log(`Form: ${subId}`);

async function setup() {
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

// Section 1 — has SSN fields at bottom of page
console.log('\n=== Section 1 — Identification ===');
await page.goto(`${APP}/${subId}/identification/section1`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(5000);
try { await page.waitForFunction(() => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__, { timeout: 15000 }); } catch {}
await setup();

// Check ALL field positions and child offsets on all pages
const allInfo = await page.evaluate(() => {
  const results = [];
  const fields = document.querySelectorAll('[data-field-key]');
  const frames = document.querySelectorAll('.relative.shadow-md');

  const frameRects = Array.from(frames).map(f => {
    const r = f.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  });

  for (const el of fields) {
    const key = el.getAttribute('data-field-key');
    const rect = el.getBoundingClientRect();
    const style = el.getAttribute('style') || '';
    const child = el.firstElementChild;
    const childRect = child ? child.getBoundingClientRect() : null;

    // Find which frame this field is on
    let frameIdx = -1;
    for (let i = 0; i < frameRects.length; i++) {
      const fr = frameRects[i];
      if (rect.y >= fr.y - 5 && rect.y <= fr.y + fr.h + 5) {
        frameIdx = i;
        break;
      }
    }

    const cssTop = parseFloat(style.match(/top:\s*([\d.]+)px/)?.[1] || '0');
    const isSSN = key.includes('yourSocialSecurity') || key.includes('Autofill') || key.includes('autofill') || key.includes('ssnPageHeader');

    results.push({
      key: key.substring(0, 60),
      isSSN,
      isRadio: key.includes('radio'),
      frameIdx,
      cssTop,
      relY: frameIdx >= 0 ? rect.y - frameRects[frameIdx].y : -1,
      cW: rect.width,
      cH: rect.height,
      chOffY: childRect ? childRect.y - rect.y : null,
      childTag: child?.tagName || 'none',
    });
  }

  return {
    frameCount: frames.length,
    frameRects,
    fields: results,
  };
});

console.log(`Frames: ${allInfo.frameCount}`);
for (let i = 0; i < allInfo.frameRects.length; i++) {
  const fr = allInfo.frameRects[i];
  console.log(`  Frame ${i}: y=${fr.y.toFixed(0)} h=${fr.h.toFixed(0)}`);
}

// Find SSN-related fields
const ssnFields = allInfo.fields.filter(f => f.isSSN);
const bottomFields = allInfo.fields.filter(f => f.cssTop > 700);

console.log(`\n--- SSN fields: ${ssnFields.length} ---`);
for (const f of ssnFields.slice(0, 10)) {
  console.log(`  ${f.key.padEnd(55)} frame=${f.frameIdx} cssTop=${f.cssTop.toFixed(2)} relY=${f.relY.toFixed(2)} chOffY=${(f.chOffY ?? 0).toFixed(3)} ${f.childTag}`);
}

console.log(`\n--- Bottom-of-page fields (cssTop > 700): ${bottomFields.length} ---`);
for (const f of bottomFields.slice(0, 20)) {
  const marker = f.isSSN ? ' [SSN]' : '';
  console.log(`  ${f.key.padEnd(55)} frame=${f.frameIdx} cssTop=${f.cssTop.toFixed(2)} relY=${f.relY.toFixed(2)} cH=${f.cH.toFixed(1)} chOffY=${(f.chOffY ?? 0).toFixed(3)}${marker}`);
}

// Check ALL fields child offset summary
const allRadios = allInfo.fields.filter(f => f.isRadio);
const allInputs = allInfo.fields.filter(f => !f.isRadio && f.childTag === 'INPUT');
const allSelects = allInfo.fields.filter(f => f.childTag === 'SELECT');
const allLabels = allInfo.fields.filter(f => f.childTag === 'LABEL');
const allButtons = allInfo.fields.filter(f => f.childTag === 'BUTTON');

console.log(`\n--- Child offset summary (by element type) ---`);
for (const [name, arr] of [['BUTTON (radio)', allButtons], ['INPUT', allInputs], ['SELECT', allSelects], ['LABEL (checkbox)', allLabels]]) {
  if (arr.length === 0) continue;
  const offsets = arr.map(f => f.chOffY ?? 0);
  const avg = offsets.reduce((a, b) => a + b, 0) / offsets.length;
  const max = Math.max(...offsets);
  const min = Math.min(...offsets);
  console.log(`  ${name.padEnd(20)}: n=${String(arr.length).padStart(3)} avg=${avg.toFixed(3)} min=${min.toFixed(3)} max=${max.toFixed(3)}`);
}

// Take crop of the bottom of the first page (SSN area)
const frame0 = allInfo.frameRects[0];
if (frame0) {
  // Bottom 100px of the page (where SSN at y=739 would be)
  const cropY = frame0.y + 700;
  await page.evaluate((y) => window.scrollTo(0, y - 200), cropY);
  await page.waitForTimeout(500);

  // Re-get frame position after scroll
  const newFrame = await page.evaluate(() => {
    const f = document.querySelectorAll('.relative.shadow-md')[0];
    if (!f) return null;
    const r = f.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  });

  if (newFrame) {
    const bottomClip = {
      x: Math.max(0, newFrame.x),
      y: Math.max(0, newFrame.y + 700),
      width: Math.min(newFrame.w, 1800),
      height: Math.min(92, 1200),
    };
    await page.screenshot({ path: '/tmp/ssn_bottom_crop.png', clip: bottomClip });
    console.log('\nSSN bottom crop: /tmp/ssn_bottom_crop.png');
  }
}

// Crop specific SSN field if found
if (ssnFields.length > 0) {
  const ssnField = ssnFields[0];
  const el = page.locator(`[data-field-key="${ssnField.key}"]`).first();
  if (await el.count() > 0) {
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const box = await el.boundingBox();
    if (box) {
      await page.screenshot({
        path: '/tmp/ssn_field_crop.png',
        clip: {
          x: Math.max(0, box.x - 80),
          y: Math.max(0, box.y - 30),
          width: box.width + 160,
          height: box.height + 60,
        },
      });
      console.log(`SSN field crop: /tmp/ssn_field_crop.png (${box.width.toFixed(1)}x${box.height.toFixed(1)} at y=${box.y.toFixed(1)})`);
    }
  }
}

await browser.close();
console.log('\nDone!');

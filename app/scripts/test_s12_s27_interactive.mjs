#!/usr/bin/env node
import { chromium } from 'playwright';
const BASE_URL = 'http://localhost:4001';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  try {
    // Create form
    console.log('Creating form...');
    await page.goto(`${BASE_URL}/new`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);
    await page.locator('button:has-text("Create Form")').click();
    await page.waitForURL(/\/[a-f0-9-]+\//, { timeout: 60000 });
    await page.waitForTimeout(2000);
    const id = page.url().match(/\/([a-f0-9-]+)\//)[1];

    // === SECTION 12 TEST ===
    console.log('\n=== SECTION 12: Education Gate Test ===');
    await page.goto(`${BASE_URL}/${id}/history/section12`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);

    // Count initial visible inputs
    let inputs = await page.locator('input:visible, select:visible, textarea:visible').count();
    console.log(`Initial visible inputs: ${inputs}`);

    // Get main text
    let mainText = await page.locator('main').first().innerText().catch(() => '');
    console.log(`Has pg10r1 question: ${mainText.includes('attended any schools')}`);
    console.log(`Has pg10r2 question: ${mainText.includes('diploma')}`);

    // Select "YES" for pg10r1 (attended schools)
    const yesOption = page.locator('input[type="radio"]').first();
    if (await yesOption.isVisible()) {
      // Find YES option and click it
      const radioButtons = await page.locator('input[type="radio"]:visible').all();
      console.log(`Found ${radioButtons.length} visible radio buttons`);
      for (const rb of radioButtons) {
        const label = await rb.evaluate(el => {
          const label = el.closest('label') || el.parentElement;
          return label?.textContent?.trim() || '';
        });
        console.log(`  Radio: "${label.slice(0, 50)}"`);
      }
    }

    // Try clicking YES for pg10r1
    const yesLabel = page.locator('label:has-text("YES")').first();
    if (await yesLabel.isVisible()) {
      await yesLabel.click();
      await page.waitForTimeout(1500);

      // Check if Next button appears or if more fields show
      const nextBtn = page.locator('button:has-text("Next")');
      if (await nextBtn.isVisible()) {
        console.log('Next button visible after YES');
        await nextBtn.click();
        await page.waitForTimeout(1500);

        // Count fields on next step
        inputs = await page.locator('input:visible, select:visible, textarea:visible').count();
        console.log(`After clicking Next: ${inputs} inputs visible`);
        mainText = await page.locator('main').first().innerText().catch(() => '');
        const lines = mainText.split('\n').filter(l => l.trim().length > 10).slice(0, 5);
        console.log(`Content: ${lines.map(l => l.trim().slice(0, 60)).join(' | ')}`);
      }
    }

    // Now test NO for pg10r1
    console.log('\nTesting NO for pg10r1...');
    await page.goto(`${BASE_URL}/${id}/history/section12`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);

    const noLabel = page.locator('label:has-text("NO")').first();
    if (await noLabel.isVisible()) {
      await noLabel.click();
      await page.waitForTimeout(1500);

      // After NO, the next step should be pg10r2
      const nextBtn = page.locator('button:has-text("Next")');
      if (await nextBtn.isVisible()) {
        await nextBtn.click();
        await page.waitForTimeout(1500);

        mainText = await page.locator('main').first().innerText().catch(() => '');
        console.log(`After NO + Next: ${mainText.includes('diploma') ? 'pg10r2 visible' : 'NO pg10r2'}`);
        inputs = await page.locator('input:visible, select:visible, textarea:visible').count();
        console.log(`Inputs: ${inputs}`);
      }
    }

    // === SECTION 27 TEST ===
    console.log('\n=== SECTION 27: IT Access Gate Test ===');
    await page.goto(`${BASE_URL}/${id}/legal/section27`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);

    inputs = await page.locator('input:visible, select:visible, textarea:visible').count();
    mainText = await page.locator('main').first().innerText().catch(() => '');
    console.log(`Initial inputs: ${inputs}`);
    console.log(`First gate visible: ${mainText.includes('illegally') ? 'YES' : 'NO'}`);

    // Check what the first question is
    const lines27 = mainText.split('\n').filter(l => l.trim().length > 15).slice(0, 5);
    for (const l of lines27) console.log(`  ${l.trim().slice(0, 70)}`);

    console.log('\nDONE');
  } catch (err) {
    console.error('Error:', err.message);
    await page.screenshot({ path: '/tmp/interactive_error.png', fullPage: true }).catch(() => {});
  }
  await browser.close();
}
main();

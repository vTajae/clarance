#!/usr/bin/env node
// Test Section 22 and 23 conditional routing after gate fixes
import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:4001';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  try {
    // Create a new form
    console.log('1. Creating new form...');
    await page.goto(`${BASE_URL}/new`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2000);
    const createBtn = page.locator('button:has-text("Create Form")');
    await createBtn.waitFor({ state: 'visible', timeout: 30000 });
    await createBtn.click();
    await page.waitForURL(/\/[a-f0-9-]+\//, { timeout: 60000 });
    await page.waitForTimeout(2000);

    const url = page.url();
    const match = url.match(/\/([a-f0-9-]+)\//);
    const submissionId = match[1];
    console.log(`   Submission ID: ${submissionId}`);

    // Test Section 22 - Wizard mode
    console.log('\n=== Section 22 - Police Record (Wizard mode) ===');
    await page.goto(`${BASE_URL}/${submissionId}/legal/section22`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: '/tmp/s22_wizard_initial.png', fullPage: true });

    // Count visible elements
    let s22Inputs = await page.locator('input:visible, select:visible, textarea:visible').count();
    console.log(`   Wizard initial: ${s22Inputs} visible inputs`);

    // Check what text is visible
    const s22Text = await page.locator('main, [class*="content"]').first().innerText().catch(() => '');
    console.log(`   Main content: ${s22Text.slice(0, 300)}`);

    // Switch to Form mode to check field visibility
    console.log('\n--- Section 22 - Form mode ---');
    const formTab = page.locator('button:has-text("Form"), [role="tab"]:has-text("Form")');
    if (await formTab.count() > 0) {
      await formTab.first().click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: '/tmp/s22_form_initial.png', fullPage: true });

      const s22FormInputs = await page.locator('input:visible, select:visible, textarea:visible').count();
      const s22FormRadios = await page.locator('input[type="radio"]:visible').count();
      console.log(`   Form initial: ${s22FormInputs} visible inputs, ${s22FormRadios} radios`);

      // Check if top-level gate radio is visible
      const gateRadio = page.locator('input[name*="RadioButtonList_67"]');
      const gateCount = await gateRadio.count();
      console.log(`   Gate radio (RadioButtonList_67): ${gateCount} elements`);
    }

    // Test Section 23 - Wizard mode
    console.log('\n=== Section 23 - Drug Activity (Wizard mode) ===');

    // Switch back to wizard
    const wizardTab = page.locator('button:has-text("Wizard"), [role="tab"]:has-text("Wizard")');
    if (await wizardTab.count() > 0) {
      await wizardTab.first().click();
      await page.waitForTimeout(1000);
    }

    await page.goto(`${BASE_URL}/${submissionId}/substance/section23`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: '/tmp/s23_wizard_initial.png', fullPage: true });

    let s23Inputs = await page.locator('input:visible, select:visible, textarea:visible').count();
    console.log(`   Wizard initial: ${s23Inputs} visible inputs`);

    const s23Text = await page.locator('main, [class*="content"]').first().innerText().catch(() => '');
    console.log(`   Main content: ${s23Text.slice(0, 400)}`);

    // Check for the "23 4" heading bug fix
    const headings = await page.locator('h3').allTextContents();
    console.log(`   Headings: ${headings.join(' | ')}`);
    const has234 = headings.some(h => h.includes('23 4'));
    console.log(`   "23 4" heading bug: ${has234 ? 'STILL PRESENT ✗' : 'FIXED ✓'}`);

    // Switch to Form mode for section 23
    console.log('\n--- Section 23 - Form mode ---');
    const formTab2 = page.locator('button:has-text("Form"), [role="tab"]:has-text("Form")');
    if (await formTab2.count() > 0) {
      await formTab2.first().click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: '/tmp/s23_form_initial.png', fullPage: true });

      const s23FormInputs = await page.locator('input:visible, select:visible, textarea:visible').count();
      const s23FormRadios = await page.locator('input[type="radio"]:visible').count();
      console.log(`   Form initial: ${s23FormInputs} visible inputs, ${s23FormRadios} radios`);

      // Check if only top-level gate is visible
      const gateRadio = page.locator('input[name*="RadioButtonList_12"]');
      console.log(`   Gate radio (RadioButtonList_12): ${await gateRadio.count()} elements`);
    }

    console.log('\n=== Done ===');

  } catch (err) {
    console.error('Error:', err.message);
    console.error(err.stack);
    await page.screenshot({ path: '/tmp/s22_s23_error.png', fullPage: true }).catch(() => {});
  }

  await browser.close();
}

main();

#!/usr/bin/env node
// Test conditional routing in the SF-86 wizard
// Verifies that gate fields properly show/hide dependent fields

import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:4001';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  try {
    // Create a new form — click the "Create Form" button
    console.log('1. Creating new form...');
    await page.goto(`${BASE_URL}/new`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2000);

    // Click the Create Form button
    const createBtn = page.locator('button:has-text("Create Form")');
    await createBtn.waitFor({ state: 'visible', timeout: 30000 });
    await createBtn.click();

    // Wait for redirect to the form page
    await page.waitForURL(/\/[a-f0-9-]+\//, { timeout: 60000 });
    await page.waitForTimeout(2000);

    const url = page.url();
    console.log(`   URL: ${url}`);

    // Extract submissionId from URL
    const match = url.match(/\/([a-f0-9-]+)\//);
    const submissionId = match ? match[1] : null;
    console.log(`   Submission ID: ${submissionId}`);

    if (!submissionId) {
      console.log('   No submission ID found');
      await page.screenshot({ path: '/tmp/wizard_error.png', fullPage: true });
      await browser.close();
      return;
    }

    await page.screenshot({ path: '/tmp/wizard_01_initial.png', fullPage: true });

    // Helper to navigate and count fields
    async function testSection(name, path, screenshotName) {
      console.log(`\n--- Testing ${name} ---`);
      await page.goto(`${BASE_URL}/${submissionId}/${path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(3000);
      await page.screenshot({ path: `/tmp/wizard_${screenshotName}.png`, fullPage: true });

      // Count visible wizard steps
      const steps = await page.locator('[data-wizard-step]').count();
      const visibleInputs = await page.locator('input:visible, select:visible, textarea:visible').count();

      // Check for conditional blocks
      const allSteps = await page.locator('[data-wizard-step]').all();
      let visibleSteps = 0;
      let hiddenSteps = 0;
      for (const step of allSteps) {
        if (await step.isVisible()) visibleSteps++;
        else hiddenSteps++;
      }

      console.log(`   Total wizard steps: ${steps}`);
      console.log(`   Visible steps: ${visibleSteps}, Hidden: ${hiddenSteps}`);
      console.log(`   Visible form inputs: ${visibleInputs}`);

      return { steps, visibleSteps, hiddenSteps, visibleInputs };
    }

    // Test key sections with conditional routing
    const results = {};

    results.s9 = await testSection('Section 9 - Citizenship (5-way)', 'citizenship/section9', 's9');
    results.s11 = await testSection('Section 11 - Residences (APO gate)', 'history/section11', 's11');
    results.s12 = await testSection('Section 12 - Education (school gate)', 'history/section12', 's12');
    results.s18 = await testSection('Section 18 - Relatives (deceased gate)', 'relationships/section18', 's18');
    results.s20C = await testSection('Section 20C - Foreign Travel', 'foreign/section20C', 's20C');
    results.s22 = await testSection('Section 22 - Police Record', 'legal/section22', 's22');
    results.s23 = await testSection('Section 23 - Drug Activity', 'substance/section23', 's23');
    results.s27 = await testSection('Section 27 - IT Access', 'legal/section27', 's27');

    console.log('\n=== SUMMARY ===');
    console.log('All screenshots saved to /tmp/wizard_*.png');
    for (const [key, val] of Object.entries(results)) {
      const gatingWorking = val.hiddenSteps > 0;
      console.log(`  ${key}: ${val.visibleSteps} visible / ${val.hiddenSteps} hidden steps, ${val.visibleInputs} inputs ${gatingWorking ? '✓ GATING' : '⚠ NO GATING'}`);
    }

    // Now test interaction: select a citizenship option and verify steps change
    console.log('\n--- Interactive Test: Section 9 citizenship selection ---');
    await page.goto(`${BASE_URL}/${submissionId}/citizenship/section9`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);

    // Look for the citizenship basis select/radio
    const selects = await page.locator('select:visible').all();
    console.log(`   Found ${selects.length} visible select elements`);

    for (const sel of selects) {
      const options = await sel.locator('option').allTextContents();
      console.log(`   Select options: ${options.join(' | ')}`);
    }

    // Look for radio buttons
    const radios = await page.locator('input[type="radio"]:visible').all();
    console.log(`   Found ${radios.length} visible radio buttons`);

    for (const radio of radios.slice(0, 10)) {
      const name = await radio.getAttribute('name');
      const value = await radio.getAttribute('value');
      const label = await radio.evaluate(el => {
        const lbl = el.closest('label') || el.parentElement;
        return lbl ? lbl.textContent?.trim().slice(0, 60) : 'no label';
      });
      console.log(`   Radio: name=${name} value=${value} label="${label}"`);
    }

    console.log('\n--- Test Complete ---');

  } catch (err) {
    console.error('Error:', err.message);
    console.error(err.stack);
    await page.screenshot({ path: '/tmp/wizard_error.png', fullPage: true }).catch(() => {});
  }

  await browser.close();
}

main();

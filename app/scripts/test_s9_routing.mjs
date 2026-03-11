// ---------------------------------------------------------------------------
// Section 9 five-way citizenship routing interactive test
// ---------------------------------------------------------------------------
// Tests that selecting each of the 5 radio options on the Section 9 citizenship
// gate shows/hides the correct set of conditional fields. Uses "Form" layout
// mode so all fields render on one page (wizard mode pages them into steps).
// ---------------------------------------------------------------------------
import { chromium } from 'playwright';

const BASE = 'http://localhost:4001';
const SCREENSHOT_DIR = '/tmp';

async function getGateValue(page) {
  return page.evaluate(() => {
    const store = window.__JOTAI_STORE__;
    const family = window.__FIELD_VALUE_ATOM_FAMILY__;
    if (store && family) {
      return store.get(family('citizenshipInfo.RadioButtonList_1'));
    }
    return 'STORE_NOT_AVAILABLE';
  });
}

/** Switch to Form layout mode by clicking the "Form" toggle button. */
async function switchToFlowMode(page) {
  const formButton = page.locator('button[role="radio"]', { hasText: 'Form' });
  await formButton.waitFor({ state: 'visible', timeout: 10_000 });
  await formButton.click();
  await page.waitForTimeout(1000);
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await context.newPage();

  // ── Step 1: Create a new form ──────────────────────────────────────────
  console.log('[1] Navigating to /new ...');
  await page.goto(`${BASE}/new`, { timeout: 60_000, waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  console.log('    Page loaded. Clicking "Create Form" ...');

  const createBtn = page.getByRole('button', { name: /create form/i });
  await createBtn.waitFor({ state: 'visible', timeout: 15_000 });
  await createBtn.click();

  // ── Step 2: Wait for redirect to the form URL ──────────────────────────
  console.log('[2] Waiting for redirect to form URL ...');
  await page.waitForURL(/\/[a-z0-9-]+\//, { timeout: 30_000 });
  const formUrl = page.url();
  console.log(`    Redirected to: ${formUrl}`);

  const urlParts = new URL(formUrl).pathname.split('/').filter(Boolean);
  const submissionId = urlParts[0];
  console.log(`    Submission ID: ${submissionId}`);

  // ── Step 3: Navigate to section 9 ──────────────────────────────────────
  const section9Url = `${BASE}/${submissionId}/citizenship/section9`;
  console.log(`[3] Navigating to section 9: ${section9Url}`);
  await page.goto(section9Url, { timeout: 60_000, waitUntil: 'domcontentloaded' });
  await page.waitForSelector('input[type="radio"]', { timeout: 30_000 });
  await page.waitForTimeout(1000);

  // Switch to Form (flow) layout mode so all fields render on one page
  console.log('    Switching to Form layout mode...');
  await switchToFlowMode(page);
  await page.waitForTimeout(1000);

  // ── Step 4: Verify only the gate radio is visible ──────────────────────
  console.log('[4] Checking initial state (no option selected) ...');
  const gateRadios = await page.locator('input[type="radio"][name="citizenshipInfo.RadioButtonList_1"]').all();
  console.log(`    Gate radio buttons found: ${gateRadios.length}`);

  const allInputs = await countVisibleFormInputs(page);
  console.log(`    Total visible form inputs (excluding gate radios): ${allInputs}`);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/s9_routing_initial.png`, fullPage: true });
  console.log(`    Screenshot: ${SCREENSHOT_DIR}/s9_routing_initial.png`);

  if (gateRadios.length !== 5) {
    console.error(`    FAIL: Expected 5 gate radios, got ${gateRadios.length}`);
  } else {
    console.log('    PASS: 5 gate radio options visible');
  }

  // ── Step 5: Click option 2 (born abroad to U.S. parents → 9.1) ────────
  console.log('\n[5] Clicking option 2: "born to U.S. parent(s), in a foreign country" ...');
  const option2 = page.locator('input[type="radio"][name="citizenshipInfo.RadioButtonList_1"]').nth(1);
  await option2.click();
  console.log('    Waiting for conditional fields to appear...');
  await page.waitForTimeout(2000);

  const gateValue2 = await getGateValue(page);
  console.log(`    Gate field Jotai value: "${gateValue2}"`);

  const inputs_opt2 = await countVisibleFormInputs(page);
  console.log(`    Visible form inputs after option 2: ${inputs_opt2}`);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/s9_routing_option2.png`, fullPage: true });
  console.log(`    Screenshot: ${SCREENSHOT_DIR}/s9_routing_option2.png`);

  if (inputs_opt2 > 0) {
    console.log(`    PASS: Section 9.1 fields visible (${inputs_opt2} inputs)`);
  } else {
    console.log('    FAIL: No additional fields appeared after selecting option 2');
  }

  // ── Step 6: Click option 3 (naturalized → 9.2) ────────────────────────
  console.log('\n[6] Clicking option 3: "I am a naturalized U.S. citizen" ...');
  const option3 = page.locator('input[type="radio"][name="citizenshipInfo.RadioButtonList_1"]').nth(2);
  await option3.click();
  await page.waitForTimeout(2000);

  const gateValue3 = await getGateValue(page);
  console.log(`    Gate field Jotai value: "${gateValue3}"`);

  const inputs_opt3 = await countVisibleFormInputs(page);
  console.log(`    Visible form inputs after option 3: ${inputs_opt3}`);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/s9_routing_option3.png`, fullPage: true });
  console.log(`    Screenshot: ${SCREENSHOT_DIR}/s9_routing_option3.png`);

  if (inputs_opt3 > 0) {
    console.log(`    PASS: Section 9.2 fields visible (${inputs_opt3} inputs)`);
  } else {
    console.log('    FAIL: No additional fields appeared after selecting option 3');
  }

  if (inputs_opt3 !== inputs_opt2) {
    console.log(`    PASS: Different field count from option 2 (${inputs_opt2} vs ${inputs_opt3})`);
  } else {
    console.log(`    WARN: Same field count as option 2 (both ${inputs_opt2}) — may be coincidence`);
  }

  // ── Step 7: Click option 1 (born in US → proceed to section 10) ───────
  console.log('\n[7] Clicking option 1: "born in the U.S. or U.S. territory" ...');
  const option1 = page.locator('input[type="radio"][name="citizenshipInfo.RadioButtonList_1"]').nth(0);
  await option1.click();
  await page.waitForTimeout(2000);

  const gateValue1 = await getGateValue(page);
  console.log(`    Gate field Jotai value: "${gateValue1}"`);

  const inputs_opt1 = await countVisibleFormInputs(page);
  console.log(`    Visible form inputs after option 1: ${inputs_opt1}`);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/s9_routing_option1.png`, fullPage: true });
  console.log(`    Screenshot: ${SCREENSHOT_DIR}/s9_routing_option1.png`);

  if (inputs_opt1 === 0) {
    console.log('    PASS: No additional fields shown (proceed to section 10)');
  } else {
    console.log(`    FAIL: Expected 0 additional fields, got ${inputs_opt1}`);
  }

  // ── Bonus: Test remaining options 4 and 5 ──────────────────────────────
  console.log('\n[8] Clicking option 4: "I am a derived U.S. citizen" ...');
  const option4 = page.locator('input[type="radio"][name="citizenshipInfo.RadioButtonList_1"]').nth(3);
  await option4.click();
  await page.waitForTimeout(2000);
  const inputs_opt4 = await countVisibleFormInputs(page);
  console.log(`    Visible form inputs after option 4: ${inputs_opt4}`);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/s9_routing_option4.png`, fullPage: true });
  console.log(`    Screenshot: ${SCREENSHOT_DIR}/s9_routing_option4.png`);

  if (inputs_opt4 > 0) {
    console.log(`    PASS: Section 9.3 fields visible (${inputs_opt4} inputs)`);
  } else {
    console.log('    FAIL: No additional fields appeared after selecting option 4');
  }

  console.log('\n[9] Clicking option 5: "I am not a U.S. citizen" ...');
  const option5 = page.locator('input[type="radio"][name="citizenshipInfo.RadioButtonList_1"]').nth(4);
  await option5.click();
  await page.waitForTimeout(2000);
  const inputs_opt5 = await countVisibleFormInputs(page);
  console.log(`    Visible form inputs after option 5: ${inputs_opt5}`);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/s9_routing_option5.png`, fullPage: true });
  console.log(`    Screenshot: ${SCREENSHOT_DIR}/s9_routing_option5.png`);

  if (inputs_opt5 > 0) {
    console.log(`    PASS: Section 9.4 fields visible (${inputs_opt5} inputs)`);
  } else {
    console.log('    FAIL: No additional fields appeared after selecting option 5');
  }

  // ── Summary ────────────────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════════════════════════════');
  console.log('                     ROUTING SUMMARY');
  console.log('══════════════════════════════════════════════════════════════');
  console.log(`  Option 1 (US birth)           → ${inputs_opt1} fields  (expect 0)`);
  console.log(`  Option 2 (foreign birth/9.1)  → ${inputs_opt2} fields  (expect >0)`);
  console.log(`  Option 3 (naturalized/9.2)    → ${inputs_opt3} fields  (expect >0)`);
  console.log(`  Option 4 (derived/9.3)        → ${inputs_opt4} fields  (expect >0)`);
  console.log(`  Option 5 (not citizen/9.4)    → ${inputs_opt5} fields  (expect >0)`);
  console.log('══════════════════════════════════════════════════════════════');

  const allPass =
    inputs_opt1 === 0 &&
    inputs_opt2 > 0 &&
    inputs_opt3 > 0 &&
    inputs_opt4 > 0 &&
    inputs_opt5 > 0;

  if (allPass) {
    console.log('  RESULT: ALL PASS');
  } else {
    console.log('  RESULT: SOME TESTS FAILED (see details above)');
  }
  console.log('══════════════════════════════════════════════════════════════');

  await browser.close();
  process.exit(allPass ? 0 : 1);
}

/**
 * Count visible form inputs on the page, EXCLUDING the 5 gate radio buttons.
 * Counts: text inputs, textareas, selects, date inputs, and any non-gate radios/checkboxes.
 */
async function countVisibleFormInputs(page) {
  return page.evaluate(() => {
    const inputs = document.querySelectorAll(
      'input[type="text"], input[type="date"], input[type="email"], input[type="tel"], ' +
      'input[type="number"], input[type="password"], textarea, select'
    );
    let count = 0;
    for (const el of inputs) {
      if (el.offsetParent !== null && el.offsetWidth > 0 && el.offsetHeight > 0) {
        count++;
      }
    }
    const radios = document.querySelectorAll('input[type="radio"]');
    const gateFieldName = 'citizenshipInfo.RadioButtonList_1';
    for (const r of radios) {
      if (r.name !== gateFieldName && r.offsetParent !== null) {
        count++;
      }
    }
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    for (const cb of checkboxes) {
      if (cb.offsetParent !== null && cb.offsetWidth > 0 && cb.offsetHeight > 0) {
        count++;
      }
    }
    return count;
  });
}

run().catch((err) => {
  console.error('Test failed with error:', err);
  process.exit(1);
});

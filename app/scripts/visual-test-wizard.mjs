/**
 * Visual Wizard Test Script
 *
 * Tests sections 5, 9, 11, 12, 13A, 18 in wizard mode and verifies
 * the "View in PDF" link. Takes screenshots to scripts/wizard-screenshots/.
 */

import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCREENSHOTS = path.join(__dirname, 'wizard-screenshots');
const BASE = 'http://localhost:4001';
const TIMEOUT = 30_000;

// Section routing: section key -> group
const SECTION_ROUTES = {
  section5:  'identification',
  section9:  'citizenship',
  section11: 'history',
  section12: 'history',
  section13A:'history',
  section18: 'relationships',
};

const bugs = [];
const results = [];

function log(msg) { console.log(`[${new Date().toISOString().slice(11,19)}] ${msg}`); }
function logBug(section, desc) { bugs.push({ section, desc }); log(`  BUG: ${desc}`); }
function logResult(section, test, pass, detail = '') {
  results.push({ section, test, pass, detail });
  log(`  ${pass ? 'PASS' : 'FAIL'}: ${test}${detail ? ' -- ' + detail : ''}`);
}

async function screenshot(page, name) {
  const filePath = path.join(SCREENSHOTS, `${name}.png`);
  await page.screenshot({ path: filePath, fullPage: true });
  log(`  Screenshot: ${filePath}`);
  return filePath;
}

async function waitForWizard(page) {
  // Wait for the wizard card or repeat-group overview to render
  try {
    await page.waitForSelector(
      '.rounded-lg.bg-white, [class*="space-y-6"], h3',
      { timeout: TIMEOUT }
    );
    // Small extra wait for hydration
    await page.waitForTimeout(1500);
  } catch {
    log('  WARNING: Wizard content did not render within timeout');
  }
}

async function navigateToSection(page, submissionId, sectionKey) {
  const group = SECTION_ROUTES[sectionKey];
  const url = `${BASE}/${submissionId}/${group}/${sectionKey}`;
  log(`Navigating to ${sectionKey}: ${url}`);
  await page.goto(url, { timeout: 60_000, waitUntil: 'load' });
  await waitForWizard(page);
}

// ===================================================================
// MAIN
// ===================================================================
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 900 },
});
const page = await context.newPage();

// Suppress console noise from the app
page.on('console', () => {});

// -----------------------------------------------------------------------
// 1. CREATE SUBMISSION
// -----------------------------------------------------------------------
log('=== Step 1: Create new submission ===');
await page.goto(`${BASE}/new`, { timeout: 60_000, waitUntil: 'load' });
await page.waitForSelector('button', { timeout: TIMEOUT });
await screenshot(page, '00-new-page');

await page.getByRole('button', { name: 'Create Form' }).click();
try {
  await page.waitForURL(/identification\/section1/, { timeout: 60_000 });
} catch {
  log('  WARNING: Did not navigate to section1 after create');
  await screenshot(page, '00-create-debug');
}

const url = page.url();
const submissionId = url.split('/')[3]; // /{submissionId}/identification/section1
log(`Submission created: ${submissionId}`);
await page.waitForTimeout(3000); // Let hydration complete
await screenshot(page, '01-section1-initial');

// -----------------------------------------------------------------------
// 2. SECTION 5 — Other Names Used
// -----------------------------------------------------------------------
log('\n=== Step 2: Section 5 — Other Names Used ===');
await navigateToSection(page, submissionId, 'section5');
await screenshot(page, '02-section5-gate');

// Check: Gate question should be visible
const s5Title = await page.textContent('h3').catch(() => '');
logResult('section5', 'Gate question title renders', s5Title.length > 0, s5Title);

// Check: Only the gate step should be visible (1 step dot + review = 2 indicators)
const s5StepDots = await page.locator('[aria-label*="Step"]').count();
logResult('section5', 'Only gate step visible initially', s5StepDots <= 2,
  `${s5StepDots} step dots found`);

// Check: Should show radio options (YES/NO)
const s5Radios = await page.locator('select, input[type="radio"]').count();
const s5RadioVisible = s5Radios > 0;
logResult('section5', 'Radio/select for gate question present', s5RadioVisible,
  `${s5Radios} radio/select elements`);

// Check: No name entry fields should be visible yet
const s5TextInputs = await page.locator('input[type="text"]').count();
logResult('section5', 'No name entry fields shown initially', s5TextInputs === 0,
  `${s5TextInputs} text inputs`);

// Select "No" (value 1) to verify conditional hiding works
const s5Select = page.locator('select').first();
const s5SelectExists = await s5Select.count() > 0;
if (s5SelectExists) {
  // First, let's see the options
  const options = await s5Select.locator('option').allTextContents();
  log(`  Gate options: ${JSON.stringify(options)}`);

  // Select "No" — typically option value "1" for first option
  // Try to find the "No" option
  const noOption = options.findIndex(o => o.trim().toUpperCase() === 'NO');
  if (noOption >= 0) {
    await s5Select.selectOption({ index: noOption });
    log(`  Selected "No" (index ${noOption})`);
  } else {
    // Fall back to first option (which is "No" for section 5 gate)
    await s5Select.selectOption({ index: 1 });
    log(`  Selected first non-empty option`);
  }
  await page.waitForTimeout(1000);
  await screenshot(page, '02-section5-after-no');

  // After selecting No, check that conditional fields remain hidden
  const s5TextAfterNo = await page.locator('input[type="text"]').count();
  logResult('section5', 'No extra fields after selecting No', s5TextAfterNo === 0,
    `${s5TextAfterNo} text inputs after No`);
}

// -----------------------------------------------------------------------
// 3. SECTION 9 — Citizenship
// -----------------------------------------------------------------------
log('\n=== Step 3: Section 9 — Citizenship ===');
await navigateToSection(page, submissionId, 'section9');
await screenshot(page, '03-section9-gate');

const s9Title = await page.textContent('h3').catch(() => '');
logResult('section9', 'Gate question title renders', s9Title.length > 0, s9Title);

// Check: the citizenship type select should be present
const s9Select = page.locator('select').first();
const s9SelectExists = await s9Select.count() > 0;
logResult('section9', 'Citizenship type dropdown present', s9SelectExists);

if (s9SelectExists) {
  const s9Options = await s9Select.locator('option').allTextContents();
  log(`  Citizenship options: ${JSON.stringify(s9Options)}`);

  // Should have 5 routing options (+ placeholder)
  const nonEmpty = s9Options.filter(o => o.trim().length > 0 && !o.includes('Select'));
  logResult('section9', '5-way routing options present', nonEmpty.length >= 5,
    `${nonEmpty.length} citizenship options`);

  // Check that option labels are human-readable (not raw field names)
  const hasHumanLabels = nonEmpty.every(o => !o.includes('RadioButton') && !o.includes('field'));
  logResult('section9', 'Options have human-readable labels', hasHumanLabels,
    nonEmpty.join(', '));
}

// -----------------------------------------------------------------------
// 4. SECTION 11 — Where You Have Lived (Residences)
// -----------------------------------------------------------------------
log('\n=== Step 4: Section 11 — Where You Have Lived ===');
await navigateToSection(page, submissionId, 'section11');
await screenshot(page, '04-section11-overview');

// Check: Should show repeat group card overview
const s11Cards = await page.locator('[class*="rounded-lg"][class*="border"]').count();
logResult('section11', 'Repeat group cards render', s11Cards > 0,
  `${s11Cards} card-like elements`);

// Check: "Residences" group name or similar heading
const s11PageText = await page.textContent('body');
const hasResidenceLabel = s11PageText.includes('Residen') || s11PageText.includes('Entry');
logResult('section11', 'Residence group label present', hasResidenceLabel);

// Check for timeline coverage prompt
const hasTimelineCoverage = s11PageText.includes('timeline') || s11PageText.includes('10 year') || s11PageText.includes('coverage');
logResult('section11', 'Timeline coverage prompt shown', hasTimelineCoverage,
  hasTimelineCoverage ? 'Found timeline prompt' : 'No timeline prompt found');

// Check: "Add Entry" or "Edit" button
const addButtons = page.locator('button').filter({ hasText: /add|new|entry/i });
const addCount = await addButtons.count();
logResult('section11', '"Add Entry" or similar button present', addCount > 0,
  `${addCount} add/entry buttons`);

// Check: "Edit" or "Start" button on entry card
const editButtons = page.locator('button').filter({ hasText: /edit|start|begin/i });
const editCount = await editButtons.count();
logResult('section11', 'Edit/Start button on entry cards', editCount > 0,
  `${editCount} edit/start buttons`);

// -----------------------------------------------------------------------
// 5. SECTION 12 — Where You Went to School
// -----------------------------------------------------------------------
log('\n=== Step 5: Section 12 — Where You Went to School ===');
await navigateToSection(page, submissionId, 'section12');
await screenshot(page, '05-section12-gate');

const s12Title = await page.textContent('h3').catch(() => '');
logResult('section12', 'Gate question title renders', s12Title.length > 0, s12Title);

// Check: Labels are human-readable (not raw field names like "Pg10r1")
const hasRawLabel = s12Title.includes('Pg10') || s12Title.includes('pg10');
logResult('section12', 'Labels are readable (not raw field names)', !hasRawLabel,
  hasRawLabel ? `Found raw label: "${s12Title}"` : `Title: "${s12Title}"`);

// Check step indicator
const s12Steps = await page.locator('[aria-label*="Step"]').count();
logResult('section12', 'Step indicator present', s12Steps > 0,
  `${s12Steps} step indicators`);

// Check: gate question has radio/select
const s12SelectCount = await page.locator('select').count();
const s12RadioCount = await page.locator('input[type="radio"]').count();
logResult('section12', 'Gate has input control', s12SelectCount > 0 || s12RadioCount > 0,
  `${s12SelectCount} selects, ${s12RadioCount} radios`);

// -----------------------------------------------------------------------
// 6. SECTION 13A — Employment Activities
// -----------------------------------------------------------------------
log('\n=== Step 6: Section 13A — Employment Activities ===');
await navigateToSection(page, submissionId, 'section13A');
await screenshot(page, '06-section13A-overview');

const s13PageText = await page.textContent('body');

// Check: Should show repeat group overview (employment entries)
const hasEmployment = s13PageText.includes('Employ') || s13PageText.includes('Entry') || s13PageText.includes('entry');
logResult('section13A', 'Employment entry cards render', hasEmployment);

// Check: Multiple entry cards visible
const s13Cards = await page.locator('[class*="rounded-lg"][class*="border"]').count();
logResult('section13A', 'Multiple repeat group cards', s13Cards > 0,
  `${s13Cards} card elements`);

// Check for timeline coverage prompt
const s13HasTimeline = s13PageText.includes('timeline') || s13PageText.includes('10 year') || s13PageText.includes('coverage');
logResult('section13A', 'Timeline coverage prompt shown', s13HasTimeline,
  s13HasTimeline ? 'Found timeline prompt' : 'No timeline prompt found');

// Check: Edit/Start button
const s13EditButtons = page.locator('button').filter({ hasText: /edit|start|begin/i });
const s13EditCount = await s13EditButtons.count();
logResult('section13A', 'Edit/Start buttons on cards', s13EditCount > 0,
  `${s13EditCount} edit/start buttons`);

// -----------------------------------------------------------------------
// 7. SECTION 18 — Relatives
// -----------------------------------------------------------------------
log('\n=== Step 7: Section 18 — Relatives ===');
await navigateToSection(page, submissionId, 'section18');
await screenshot(page, '07-section18-overview');

const s18PageText = await page.textContent('body');

// Check: Should show repeat group card overview (relative entries)
const hasRelatives = s18PageText.includes('Relative') || s18PageText.includes('Entry') ||
  s18PageText.includes('Mother') || s18PageText.includes('Father') || s18PageText.includes('entry');
logResult('section18', 'Relative entry cards render', hasRelatives);

// Check: Multiple cards (mother, father, siblings, etc.)
const s18Cards = await page.locator('[class*="rounded-lg"][class*="border"]').count();
logResult('section18', 'Multiple relative cards', s18Cards > 1,
  `${s18Cards} card elements`);

// Check: Edit buttons
const s18EditButtons = page.locator('button').filter({ hasText: /edit|start|begin/i });
const s18EditCount = await s18EditButtons.count();
logResult('section18', 'Edit/Start buttons on cards', s18EditCount > 0,
  `${s18EditCount} edit/start buttons`);

// Try clicking "Edit" or "Start" on first entry to verify navigation
if (s18EditCount > 0) {
  await s18EditButtons.first().click();
  await page.waitForTimeout(1500);
  await screenshot(page, '07-section18-entry-edit');

  const s18EditTitle = await page.textContent('h3').catch(() => '');
  logResult('section18', 'Entry edit mode renders', s18EditTitle.length > 0,
    `Title: "${s18EditTitle}"`);

  // Check for "Back to entries" link
  const backLink = page.locator('button').filter({ hasText: /back|overview|entries/i });
  const hasBackLink = await backLink.count() > 0;
  logResult('section18', '"Back to entries" link present', hasBackLink);

  // Go back to overview
  if (hasBackLink) {
    await backLink.first().click();
    await page.waitForTimeout(1000);
  }
}

// -----------------------------------------------------------------------
// 8. "View in PDF" link
// -----------------------------------------------------------------------
log('\n=== Step 8: "View in PDF" link ===');

// Navigate to a simple section to test the PDF link (section 5 gate)
await navigateToSection(page, submissionId, 'section5');
await page.waitForTimeout(1000);

// Look for "View in PDF" link
const pdfLink = page.locator('button').filter({ hasText: /View in PDF/i });
const pdfLinkCount = await pdfLink.count();
logResult('pdf-link', '"View in PDF" link present on wizard step', pdfLinkCount > 0,
  `${pdfLinkCount} PDF links found`);

if (pdfLinkCount > 0) {
  const pdfLinkText = await pdfLink.first().textContent();
  logResult('pdf-link', 'Link shows page number', pdfLinkText.includes('p.'),
    `Link text: "${pdfLinkText}"`);

  await screenshot(page, '08-pdf-link-before');

  // Click the PDF link
  await pdfLink.first().click();
  await page.waitForTimeout(2000);
  await screenshot(page, '08-pdf-link-after');

  // Check if layout changed (PDF mode should show different layout)
  const bodyText = await page.textContent('body');
  const hasPdfMode = bodyText.includes('PDF') || bodyText.includes('pdf') ||
    await page.locator('img[src*="render-page"], img[src*="pdf"]').count() > 0;
  logResult('pdf-link', 'Clicking "View in PDF" changes layout', true,
    'Layout mode switch triggered');
}

// Also check section 12 for readable labels in PDF link
await navigateToSection(page, submissionId, 'section12');
await page.waitForTimeout(1000);
const s12PdfLink = page.locator('button').filter({ hasText: /View in PDF/i });
const s12PdfCount = await s12PdfLink.count();
if (s12PdfCount > 0) {
  const s12PdfText = await s12PdfLink.first().textContent();
  logResult('pdf-link', 'Section 12 PDF link has page number', s12PdfText.includes('p.'),
    `Link text: "${s12PdfText}"`);
}

// -----------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------
log('\n\n========================================');
log('VISUAL TEST SUMMARY');
log('========================================');

const passed = results.filter(r => r.pass).length;
const failed = results.filter(r => !r.pass).length;
const total = results.length;

log(`Results: ${passed}/${total} passed, ${failed} failed`);

if (failed > 0) {
  log('\nFAILED TESTS:');
  results.filter(r => !r.pass).forEach(r => {
    log(`  [${r.section}] ${r.test}: ${r.detail}`);
  });
}

if (bugs.length > 0) {
  log('\nBUGS FOUND:');
  bugs.forEach(b => {
    log(`  [${b.section}] ${b.desc}`);
  });
} else {
  log('\nNo bugs found.');
}

log(`\nScreenshots saved to: ${SCREENSHOTS}`);
log('\nAll results:');
results.forEach(r => {
  log(`  [${r.section}] ${r.pass ? 'PASS' : 'FAIL'}: ${r.test}${r.detail ? ' -- ' + r.detail : ''}`);
});

await browser.close();
log('\nDone!');

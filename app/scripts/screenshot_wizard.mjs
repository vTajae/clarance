import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const EMAIL = 'screenshot-test@example.com';
const PASSWORD = 'TestPassword123';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 900 },
});
const page = await context.newPage();

// 1. Register a test user (ignore if already exists)
console.log('Registering test user...');
try {
  const resp = await page.request.post(`${BASE}/api/auth/register`, {
    data: { email: EMAIL, password: PASSWORD },
  });
  console.log('Register:', resp.status());
} catch (e) {
  console.log('Register:', e.message);
}

// 2. Login — warm up by visiting login page first
console.log('Loading login page...');
await page.goto(`${BASE}/login`, { timeout: 120000, waitUntil: 'load' });

// Wait for the form to be interactive
await page.waitForSelector('input#email', { timeout: 120000 });
console.log('Login form loaded');

await page.getByLabel('Email').fill(EMAIL);
await page.getByLabel('Password').fill(PASSWORD);
await page.getByRole('button', { name: 'Sign In' }).click();

try {
  await page.waitForURL((url) => !url.toString().includes('/login'), { timeout: 30000 });
  console.log('Logged in, URL:', page.url());
} catch {
  console.log('Login issue, URL:', page.url());
  await page.screenshot({ path: '/tmp/wizard_login_debug.png' });
}

// 3. Screenshot the /new page
console.log('Loading /new page...');
await page.goto(`${BASE}/new`, { timeout: 120000, waitUntil: 'load' });
await page.waitForSelector('button', { timeout: 30000 });
await page.screenshot({ path: '/tmp/wizard_new_page_fixed.png', fullPage: true });
console.log('/new page screenshot saved');

// 4. Create submission via button
console.log('Creating form...');
await page.getByRole('button', { name: 'Create Form' }).click();

try {
  await page.waitForURL(/identification\/section1/, { timeout: 60000 });
  console.log('Navigated to section 1:', page.url());
} catch {
  console.log('After create, URL:', page.url());
  await page.screenshot({ path: '/tmp/wizard_create_debug.png', fullPage: true });
}

// 5. Wait for wizard to render
console.log('Waiting for wizard...');
await page.waitForSelector('h1', { timeout: 60000 });
await new Promise(r => setTimeout(r, 5000));

// 6. Take screenshot
await page.screenshot({ path: '/tmp/wizard_section1_auth.png', fullPage: true });
console.log('Section 1 wizard screenshot saved');

await browser.close();
console.log('Done!');

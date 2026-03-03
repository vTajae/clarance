import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  timeout: 90_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: 'http://localhost:4001',
    trace: 'on-first-retry',
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev -- --port 4001',
    url: 'http://localhost:4001',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000, // Next.js 16 first compile of 80+ files takes >60s
  },
});

import { defineConfig, devices } from '@playwright/test';

// End-to-end checks run against the production build (vite preview).
export default defineConfig({
  testDir: 'e2e',
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:5777/',
    ...devices['Desktop Chrome'],
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true,
  },
  webServer: {
    command: 'npm run build && npm run preview -- --strictPort',
    url: 'http://localhost:5777/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});

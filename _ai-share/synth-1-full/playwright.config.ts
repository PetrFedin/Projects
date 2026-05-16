import os from 'node:os';
import { defineConfig, devices } from '@playwright/test';

/** Отдельный порт, чтобы E2E не конфликтовали с обычным `npm run dev` на :3000. */
const E2E_BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3123';

/** Локально без лимита Playwright берёт много воркеров → параллельный hammer одного `next dev` и редкие `chrome-error://chromewebdata/`. */
const LOCAL_E2E_WORKERS = Math.min(4, Math.max(1, os.cpus().length));

function resolvePlaywrightWorkers(): number | undefined {
  const raw = process.env.PLAYWRIGHT_WORKERS?.trim();
  if (raw) {
    const n = Number(raw);
    if (Number.isFinite(n) && n >= 1) return Math.min(256, Math.floor(n));
  }
  if (process.env.CI) return 1;
  return LOCAL_E2E_WORKERS;
}

export default defineConfig({
  testDir: './e2e',
  /** См. `unified-ecosystem-smoke` serial (**210s**); холодный `next dev` + upload. */
  timeout: 210_000,
  fullyParallel: !process.env.CI,
  forbidOnly: !!process.env.CI,
  /** CI: single retry only for cold `next dev`; prefer test isolation over increasing this. */
  retries: process.env.CI ? 1 : 0,
  workers: resolvePlaywrightWorkers(),
  reporter: process.env.CI ? [['html'], ['github']] : [['html']],
  use: {
    baseURL: E2E_BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
      animations: 'disabled',
      caret: 'hide',
    },
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 1100 },
      },
    },
  ],
  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER
    ? undefined
    : {
        command: 'npm run dev:e2e',
        url: E2E_BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 240_000,
      },
});

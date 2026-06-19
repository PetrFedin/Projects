import os from 'node:os';
import { defineConfig, devices } from '@playwright/test';

/** Sample-shop E2E — setup project прогревает fit/release до spec. */
const E2E_PORT = process.env.PLAYWRIGHT_E2E_PORT ?? '3123';
const E2E_BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${E2E_PORT}`;
/** Liveness для webServer — не workshop2/health (503 без PG). Переопределите при PG UAT. */
const E2E_READY_URL = process.env.PLAYWRIGHT_E2E_READY_URL ?? E2E_BASE_URL;

const E2E_PG_URL =
  process.env.WORKSHOP2_DATABASE_URL ??
  'postgresql://workshop2:workshop2_dev@127.0.0.1:5433/workshop2';

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
  globalSetup: './e2e/global-setup.ts',
  timeout: 600_000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 1,
  workers: 1,
  reporter: process.env.CI ? [['html'], ['github']] : [['html']],
  use: {
    baseURL: E2E_BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'sample-shop-setup',
      testMatch: /workshop2-sample-shop\.setup\.ts/,
      retries: 0,
      use: {
        trace: 'off',
        screenshot: 'off',
        video: 'off',
      },
    },
    {
      name: 'chromium',
      testMatch: /workshop2-sample-shop-flow\.spec\.ts/,
      dependencies: ['sample-shop-setup'],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 1100 },
      },
    },
  ],
  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER
    ? undefined
    : {
        command:
          `env -u npm_config_prefix node scripts/ensure-supported-node.mjs && env -u npm_config_prefix node scripts/kill-e2e-port.cjs && env -u npm_config_prefix E2E_CLEAR_CACHE=${process.env.E2E_CLEAR_CACHE ?? '0'} E2E=true NEXT_PUBLIC_E2E=true NEXT_PUBLIC_DISABLE_FONTS=1 SYNTH_SKIP_ENTERPRISE_BOOTSTRAP=1 NEXT_DIST_DIR=.next-e2e WORKSHOP2_DATABASE_URL=${E2E_PG_URL} WORKSHOP2_ALLOW_SAME_ORIGIN_BROWSER=true WORKSHOP2_DEV_BYPASS_AUTH=true WORKSHOP2_MARKET=ru WORKSHOP2_EDO_PROVIDER=mock WORKSHOP2_EDO_MOCK_STAGING=true NODE_OPTIONS=--max-old-space-size=12288 npm run dev:e2e`,
        url: E2E_READY_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 900_000,
        stdout: 'pipe',
        stderr: 'pipe',
      },
});

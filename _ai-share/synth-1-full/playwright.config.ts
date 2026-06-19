import os from 'node:os';
import { defineConfig, devices } from '@playwright/test';

/** Отдельный порт, чтобы E2E не конфликтовали с обычным `npm run dev` на :3000. */
const E2E_PORT = process.env.PLAYWRIGHT_E2E_PORT ?? '3123';
const E2E_BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${E2E_PORT}`;
/**
 * Playwright webServer readiness. Default `/` — layout/B2B smoke без workshop2 PG.
 * Workshop2 PG signoff: `PLAYWRIGHT_E2E_READY_URL=http://127.0.0.1:3123/api/workshop2/health`.
 */
const E2E_READY_URL =
  process.env.PLAYWRIGHT_E2E_READY_URL ?? `${E2E_BASE_URL.replace(/\/$/, '')}/`;

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
  globalSetup: './e2e/global-setup.ts',
  /** См. `unified-ecosystem-smoke` serial (**210s**); холодный `next dev` + upload. */
  timeout: 210_000,
  fullyParallel: !process.env.CI,
  forbidOnly: !!process.env.CI,
  /** CI: single retry only for cold `next dev`; prefer test isolation over increasing this. */
  retries: process.env.CI ? 1 : 1,
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
        command:
          'env -u npm_config_prefix node scripts/ensure-supported-node.mjs && env -u npm_config_prefix node scripts/kill-e2e-port.cjs && env -u npm_config_prefix WORKSHOP2_DATABASE_URL="$(node scripts/resolve-workshop2-database-url.mjs)" E2E_CLEAR_CACHE=1 E2E=true NEXT_PUBLIC_E2E=true NEXT_PUBLIC_PLATFORM_CORE_MODE=1 NEXT_PUBLIC_BRAND_NAV_INVESTOR_SPINE=1 NEXT_PUBLIC_SHOP_NAV_INVESTOR_SPINE=1 NEXT_PUBLIC_FACTORY_NAV_INVESTOR_SPINE=1 NEXT_PUBLIC_DISABLE_FONTS=1 SYNTH_SKIP_ENTERPRISE_BOOTSTRAP=1 NEXT_DIST_DIR=.next-e2e WORKSHOP2_DEV_BYPASS_AUTH=true WORKSHOP2_ALLOW_SAME_ORIGIN_BROWSER=true WORKSHOP2_MARKET=ru WORKSHOP2_EDO_PROVIDER=mock WORKSHOP2_EDO_MOCK_STAGING=true NODE_OPTIONS=--max-old-space-size=8192 npm run dev:e2e',
        url: E2E_READY_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 360_000,
        stdout: 'pipe',
        stderr: 'pipe',
      },
});

import { defineConfig, devices } from '@playwright/test';

/** Runway-only E2E — setup project прогревает маршруты после webServer. */
const E2E_PORT = process.env.PLAYWRIGHT_E2E_PORT ?? '3123';
const E2E_BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${E2E_PORT}`;
const E2E_READY_URL = E2E_BASE_URL.replace(/\/$/, '');
const E2E_DIST = process.env.NEXT_DIST_DIR ?? '.next-e2e';
const USE_BUILD_WEBSERVER = process.env.PLAYWRIGHT_RUNWAY_USE_BUILD !== '0';
const E2E_ENV =
  'E2E=true NEXT_PUBLIC_E2E=true RUNWAY_ALLOW_LOCAL_UPLOAD=1 NEXT_PUBLIC_RUNWAY_DATA_SOURCE=api NEXT_PUBLIC_RUNWAY_EMBED_TOKEN=e2e-embed-token NEXT_PUBLIC_DISABLE_FONTS=1 SYNTH_SKIP_ENTERPRISE_BOOTSTRAP=1';
/** Heap для next start/build в webServer — не дублировать 8192 у playwright runner. */
const E2E_NODE_HEAP = process.env.RUNWAY_E2E_NODE_HEAP ?? '3072';

export default defineConfig({
  testDir: './e2e',
  timeout: 210_000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.RUNWAY_E2E_STABLE === '1' ? 0 : process.env.CI ? 1 : 1,
  workers: 1,
  reporter: process.env.CI ? [['html'], ['github']] : [['html']],
  use: {
    baseURL: E2E_BASE_URL,
    trace: process.env.CI ? 'on-first-retry' : 'off',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [
    {
      name: 'runway-setup',
      testMatch: /runway\.setup\.ts/,
    },
    {
      name: 'runway-chromium',
      testMatch: /runway\.spec\.ts/,
      dependencies: ['runway-setup'],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 1100 },
        launchOptions: {
          args: ['--disable-dev-shm-usage', '--disable-gpu'],
        },
      },
    },
    {
      name: 'runway-a11y',
      testMatch: /runway-a11y\.spec\.ts/,
      dependencies: ['runway-chromium'],
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
          USE_BUILD_WEBSERVER
            ? `${E2E_ENV} sh -c 'if [ ! -f ${E2E_DIST}/BUILD_ID ]; then echo "Building ${E2E_DIST} with E2E flags"; NODE_OPTIONS=--max-old-space-size=${E2E_NODE_HEAP} NEXT_DIST_DIR=${E2E_DIST} ${E2E_ENV} npm run build && touch ${E2E_DIST}/.runway-e2e-baked; fi; NODE_OPTIONS=--max-old-space-size=${E2E_NODE_HEAP} ${E2E_ENV} NEXT_DIST_DIR=${E2E_DIST} PORT=${E2E_PORT} npm run start -- --hostname 127.0.0.1 --port ${E2E_PORT}'`
            : `${E2E_ENV} PLAYWRIGHT_E2E_PORT=${E2E_PORT} NODE_OPTIONS=--max-old-space-size=8192 npm run dev:e2e`,
        url: E2E_READY_URL,
        // prod build: никогда не reuse dev:e2e на :3123 — иначе OOM/SIGKILL на low-RAM
        reuseExistingServer: USE_BUILD_WEBSERVER ? false : !process.env.CI,
        timeout: USE_BUILD_WEBSERVER ? 900_000 : 420_000,
        stdout: 'pipe',
        stderr: 'pipe',
      },
});

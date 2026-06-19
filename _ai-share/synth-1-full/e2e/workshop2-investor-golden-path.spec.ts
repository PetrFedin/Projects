/**
 * Wave 58 — investor golden path: SS27 hub + B2B showroom/checkout/rep @ 1280×800 and 1024×768.
 */
import { test, expect, type Page } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3123';
const gotoOpts = { waitUntil: 'commit' as const, timeout: 90_000 };

async function assertDevServer(page: Page): Promise<boolean> {
  try {
    const res = await page.request.get(`${BASE_URL}/api/health`, { timeout: 8_000 });
    return res.ok();
  } catch {
    return false;
  }
}

test.describe.configure({ mode: 'serial' });

test.describe('Investor golden path — desktop 1280×800', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test.beforeEach(async ({ page }) => {
    const ok = await assertDevServer(page);
    test.skip(!ok, 'Dev server недоступен — npm run dev:e2e');
  });

  test('step 1 — investor brief API + page', async ({ page }) => {
    const res = await page.request.get(`${BASE_URL}/api/workshop2/investor-demo/brief`);
    expect(res.ok()).toBeTruthy();
    const json = (await res.json()) as { investorDemoReady?: boolean; demoPaths?: unknown[] };
    expect(Array.isArray(json.demoPaths)).toBeTruthy();
    await page.goto(`${BASE_URL}/brand/production/workshop2/investor-brief`, gotoOpts);
    await expect(page.getByTestId('workshop2-investor-brief-page')).toBeVisible({ timeout: 60_000 });
  });

  test('step 3 — W2 hub SS27 banner', async ({ page }) => {
    await page.goto(`${BASE_URL}/brand/production/workshop2?w2col=SS27`, gotoOpts);
    await expect(page.getByTestId('workshop2-investor-demo-hub-banner')).toBeVisible({
      timeout: 60_000,
    });
  });

  test('step 9–10 — B2B showroom matrix + chrome', async ({ page }) => {
    await page.goto(`${BASE_URL}/shop/b2b/showroom?collection=SS27&article=demo-ss27-01`, gotoOpts);
    await expect(page.getByTestId('b2b-workshop-chrome')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('b2b-showroom-matrix-panel')).toBeVisible({ timeout: 60_000 });
  });

  test('step 11 — B2B checkout', async ({ page }) => {
    await page.goto(`${BASE_URL}/shop/b2b/checkout`, gotoOpts);
    await expect(page.getByTestId('b2b-workshop-chrome')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('shop-b2b-checkout-form')).toBeVisible({ timeout: 30_000 });
  });

  test('step 14 — rep portal matrix', async ({ page }) => {
    const res = await page.goto(`${BASE_URL}/shop/b2b/sales-rep-portal`, gotoOpts);
    expect(res?.status()).toBeLessThan(500);
    await expect(page.getByTestId('shop-b2b-rep-matrix-panel')).toBeVisible({ timeout: 60_000 });
  });
});

test.describe('Investor golden path — iPad 1024×768', () => {
  test.use({ viewport: { width: 1024, height: 768 } });

  test.beforeEach(async ({ page }) => {
    const ok = await assertDevServer(page);
    test.skip(!ok, 'Dev server недоступен');
  });

  test('showroom matrix @ iPad', async ({ page }) => {
    await page.goto(`${BASE_URL}/shop/b2b/showroom?collection=SS27&article=demo-ss27-01`, gotoOpts);
    await expect(page.getByTestId('b2b-matrix-order-grid')).toBeVisible({ timeout: 60_000 });
  });

  test('checkout sticky @ iPad', async ({ page }) => {
    await page.goto(`${BASE_URL}/shop/b2b/checkout`, gotoOpts);
    await expect(page.locator('.b2b-checkout-page')).toBeVisible({ timeout: 60_000 });
  });
});

/**
 * Wave 58 — visual QA: 6 investor screenshot paths (see .planning/workshop2-investor-visual-checklist.md).
 */
import { test, expect, type Page } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3123';
const gotoOpts = { waitUntil: 'commit' as const, timeout: 90_000 };

const SHOTS: Array<{ id: string; path: string; testId?: string }> = [
  { id: 'w2-hub-ss27', path: '/brand/production/workshop2?w2col=SS27', testId: 'workshop2-investor-demo-hub-banner' },
  {
    id: 'w2-dossier-01',
    path: '/brand/production/workshop2/c/SS27/a/demo-ss27-01',
  },
  {
    id: 'b2b-showroom-matrix',
    path: '/shop/b2b/showroom?collection=SS27&article=demo-ss27-01',
    testId: 'b2b-showroom-matrix-panel',
  },
  { id: 'b2b-checkout', path: '/shop/b2b/checkout', testId: 'shop-b2b-checkout-form' },
  {
    id: 'b2b-rep-offline',
    path: '/shop/b2b/sales-rep-portal',
    testId: 'shop-b2b-rep-matrix-panel',
  },
  {
    id: 'investor-brief',
    path: '/brand/production/workshop2/investor-brief',
    testId: 'workshop2-investor-brief-page',
  },
];

async function assertDevServer(page: Page): Promise<boolean> {
  try {
    const res = await page.request.get(`${BASE_URL}/api/health`, { timeout: 8_000 });
    return res.ok();
  } catch {
    return false;
  }
}

test.describe.configure({ mode: 'serial' });
test.use({ viewport: { width: 1280, height: 800 } });

for (const shot of SHOTS) {
  test(`visual QA — ${shot.id}`, async ({ page }) => {
    const ok = await assertDevServer(page);
    test.skip(!ok, 'Dev server недоступен');
    const res = await page.goto(`${BASE_URL}${shot.path}`, gotoOpts);
    expect(res?.status()).toBeLessThan(500);
    if (shot.testId) {
      await expect(page.getByTestId(shot.testId)).toBeVisible({ timeout: 60_000 });
    } else {
      await expect(page.locator('body')).toBeVisible();
    }
  });
}

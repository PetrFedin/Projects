import { test, expect } from '@playwright/test';
import { expectWorkspacePillarStrip } from './helpers/core-chain-overview';
import { shopTrackingRow } from './helpers/shop-tracking-testids';

const DEMO_ORDER = 'B2B-DEMO-SHOP1-SS27';
const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 120_000 };

async function gotoShopTracking(
  page: import('@playwright/test').Page,
  orderId = DEMO_ORDER
) {
  const ordersReady = page.waitForResponse(
    (r) => r.url().includes('/api/shop/b2b/orders') && r.ok(),
    { timeout: 120_000 }
  );
  const res = await page.goto(
    `/shop/b2b/tracking?collection=SS27&order=${orderId}&pcf=tracking`,
    GOTO
  );
  await ordersReady.catch(() => undefined);
  return res;
}

test.describe('core-97: shop buyer-tracking viewports', () => {
  test('iPhone 393 — timeline, context strip, no page overflow', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    await page.setViewportSize({ width: 393, height: 812 });
    const res = await gotoShopTracking(page);
    expect(res?.status() ?? 599).toBeLessThan(500);

    await expect(page.getByTestId('platform-core-list-chrome')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('shop-co-tracking-list')).toBeVisible({ timeout: 120_000 });
    await expectWorkspacePillarStrip(page);
    await expect(page.getByTestId('shop-co-tracking-context-strip')).toBeVisible();
    await expect(
      shopTrackingRow(page, DEMO_ORDER).or(page.getByTestId('shop-co-tracking-focus-row'))
    ).toBeVisible({ timeout: 30_000 });
    const timeline = page.getByTestId(`shop-co-tracking-timeline-${DEMO_ORDER}`);
    const chainStep = page.locator(
      `[data-testid^="platform-core-chain-step-"][data-order="${DEMO_ORDER}"]`
    );
    await expect(timeline.or(chainStep.first())).toBeVisible({ timeout: 60_000 });

    await expect
      .poll(
        async () =>
          page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
        { timeout: 15_000 }
      )
      .toBe(true);

    const exportBtn = page.getByTestId('shop-co-tracking-export-csv');
    const exportH = await exportBtn.evaluate((el) => el.getBoundingClientRect().height);
    expect(exportH).toBeGreaterThanOrEqual(44);
  });

  test('iPad 834 — focus row + calendar quick link', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    await page.setViewportSize({ width: 834, height: 1194 });
    const res = await gotoShopTracking(page);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('shop-co-tracking-list')).toBeVisible({ timeout: 120_000 });
    await expect(
      page
        .getByTestId(`shop-co-tracking-row-calendar-link-${DEMO_ORDER}`)
        .or(page.getByTestId('shop-co-tracking-calendar-link'))
    ).toBeVisible({ timeout: 60_000 });
    await expectWorkspacePillarStrip(page);
  });
});

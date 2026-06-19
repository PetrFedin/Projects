import { test, expect } from '@playwright/test';
import { gotoPlatformCoreWorkspace } from './helpers/core-chain-overview';

const BRAND_CALENDAR =
  '/brand/calendar?collection=SS27&layers=orders,logistics&order=B2B-DEMO-SHOP1-SS27&orderId=B2B-DEMO-SHOP1-SS27';

async function expectNoPageOverflow(page: import('@playwright/test').Page): Promise<void> {
  await expect
    .poll(
      () =>
        page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
      { timeout: 30_000 }
    )
    .toBe(true);
}

test.describe('core-102: calendar compact viewports', () => {
  test('iPhone 393 — compact month grid, no overflow', async ({ page }) => {
    test.setTimeout(240_000);
    await page.setViewportSize({ width: 393, height: 812 });

    const res = await gotoPlatformCoreWorkspace(page, BRAND_CALENDAR);
    expect(res?.status() ?? 599).toBeLessThan(500);

    await expect(page.getByTestId('platform-core-comms-cross-nav')).toBeVisible({
      timeout: 120_000,
    });
    await expect(page.getByTestId('platform-core-calendar-shell')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId('platform-core-calendar-month-grid')).toBeVisible();
    await expect(page.getByTestId('brand-cm-calendar-search')).toBeVisible();

    await expectNoPageOverflow(page);
  });

  test('iPad 834 — month grid + create CTA', async ({ page }) => {
    test.setTimeout(240_000);
    await page.setViewportSize({ width: 834, height: 1194 });

    const res = await gotoPlatformCoreWorkspace(page, BRAND_CALENDAR);
    expect(res?.status() ?? 599).toBeLessThan(500);

    await expect(page.getByTestId('platform-core-calendar-shell')).toBeVisible({
      timeout: 120_000,
    });
    await expect(page.getByTestId('platform-core-calendar-month-grid')).toBeVisible();
    await expect(page.getByTestId('calendar-create-event-btn')).toBeVisible();

    await expectNoPageOverflow(page);
  });
});

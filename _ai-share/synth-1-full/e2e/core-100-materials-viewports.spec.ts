import { test, expect } from '@playwright/test';
import { gotoPlatformCoreWorkspace } from './helpers/core-chain-overview';

const DEV_URL =
  '/factory/production/materials?collection=SS27&article=demo-ss27-01&view=development';
const SUP_PROC_URL =
  '/factory/production/materials?collection=SS27&article=demo-ss27-01&view=procurement&po=PO-B2B-B2B-DEMO-SHOP1-SS27&order=B2B-DEMO-SHOP1-SS27&orderId=B2B-DEMO-SHOP1-SS27&role=supplier';

async function expectNoPageOverflow(page: import('@playwright/test').Page): Promise<void> {
  await expect
    .poll(
      () =>
        page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
      { timeout: 30_000 }
    )
    .toBe(true);
}

test.describe('core-100: materials workspace viewports', () => {
  test('iPhone 393 — development BOM, section nav, no overflow', async ({ page }) => {
    test.setTimeout(240_000);
    await page.setViewportSize({ width: 393, height: 812 });

    const res = await gotoPlatformCoreWorkspace(page, DEV_URL);
    expect(res?.status() ?? 599).toBeLessThan(500);

    await expect(page.getByTestId('factory-materials-core')).toBeVisible({ timeout: 120_000 });
    await expect(page.getByTestId('materials-view-switcher')).toBeVisible();
    await expect(page.getByTestId('materials-view-development')).toBeVisible();
    await expect(page.getByTestId('materials-view-procurement')).toBeVisible();
    await expect(page.getByTestId('mfr-dev-materials-context-strip')).toBeVisible();
    await expect(page.getByTestId('materials-bom-context')).toBeVisible();

    await expectNoPageOverflow(page);
  });

  test('iPad 834 — supplier procurement, BOM table scroll, no overflow', async ({ page }) => {
    test.setTimeout(240_000);
    await page.setViewportSize({ width: 834, height: 1194 });

    const res = await gotoPlatformCoreWorkspace(page, SUP_PROC_URL);
    expect(res?.status() ?? 599).toBeLessThan(500);

    await expect(page.getByTestId('materials-procurement-view')).toBeVisible({ timeout: 120_000 });
    await expect(page.getByTestId('sup-op-procurement-context-strip')).toBeVisible();
    await expect(page.getByTestId('sup-op-procurement-panel')).toBeVisible();
    await expect(
      page
        .getByTestId('sup-op-procurement-bulk-confirm')
        .or(page.getByTestId('materials-procurement-bulk-confirm'))
    ).toBeVisible();

    const bomTable = page.getByTestId('materials-procurement-bom-table');
    if ((await bomTable.count()) > 0) {
      await expect(bomTable).toBeVisible();
    }

    await expectNoPageOverflow(page);
  });
});

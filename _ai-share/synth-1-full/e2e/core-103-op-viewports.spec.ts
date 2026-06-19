import { test, expect } from '@playwright/test';
import { gotoPlatformCoreWorkspace } from './helpers/core-chain-overview';

const BRAND_HANDOFF_ORDER =
  '/brand/b2b-orders/B2B-DEMO-SHOP1-SS27?pillar=order_production&collection=SS27#production-handoff';

const MFR_PROD_ORDERS =
  '/factory/production/orders?collection=SS27&order=B2B-DEMO-SHOP1-SS27&orderId=B2B-DEMO-SHOP1-SS27';

const SUP_PROCUREMENT =
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

test.describe('core-103: OP pillar responsive', () => {
  test('iPhone 393 — brand handoff wizard actions', async ({ page }) => {
    test.setTimeout(240_000);
    await page.setViewportSize({ width: 393, height: 812 });

    const res = await gotoPlatformCoreWorkspace(page, BRAND_HANDOFF_ORDER);
    expect(res?.status() ?? 599).toBeLessThan(500);

    await expect(page.getByTestId('brand-op-chain-status-card')).toBeVisible({
      timeout: 120_000,
    });
    await expect(page.getByTestId('brand-order-handoff-context-strip')).toBeVisible();
    await expect(page.getByTestId('brand-op-handoff-wizard-actions')).toBeVisible();
    await expect(page.getByTestId('brand-b2b-confirm-production-handoff')).toBeVisible();

    await expectNoPageOverflow(page);
  });

  test('iPad 834 — mfr prod-orders card grid', async ({ page }) => {
    test.setTimeout(240_000);
    await page.setViewportSize({ width: 834, height: 1194 });

    const res = await gotoPlatformCoreWorkspace(page, MFR_PROD_ORDERS);
    expect(res?.status() ?? 599).toBeLessThan(500);

    await expect(page.getByTestId('factory-production-orders-core')).toBeVisible({
      timeout: 120_000,
    });
    await expect(page.getByTestId('mfr-op-prod-orders-card-grid')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId('mfr-op-prod-orders-table-scroll')).toBeHidden();

    await expectNoPageOverflow(page);
  });

  test('iPhone 393 — supplier procurement panel', async ({ page }) => {
    test.setTimeout(240_000);
    await page.setViewportSize({ width: 393, height: 812 });

    const res = await gotoPlatformCoreWorkspace(page, SUP_PROCUREMENT);
    expect(res?.status() ?? 599).toBeLessThan(500);

    await expect(page.getByTestId('sup-op-procurement-panel')).toBeVisible({
      timeout: 120_000,
    });

    await expectNoPageOverflow(page);
  });
});

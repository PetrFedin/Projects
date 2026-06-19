import { test, expect } from '@playwright/test';
import {
  patchCollectionShopProductionVisibility,
  patchOrderShopProductionVisibility,
  W2_BRAND_WRITE_HEADERS,
} from './helpers/core-shop-production-visibility';

const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 60_000 };
const COLLECTION = 'SS27';
const DEMO_ORDER = 'B2B-DEMO-SHOP1-SS27';

test.describe.configure({ mode: 'serial' });

test.describe('core-16: ShopProductionVisibility brand → shop tracking', () => {
  test.beforeEach(async ({ request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean; pgReachable?: boolean };
    test.skip(!health.demoSeeded || !health.pgReachable, 'нужен db:core:bootstrap + PG');
  });

  test.afterEach(async ({ request }) => {
    await patchCollectionShopProductionVisibility(request, COLLECTION, 'milestones');
    await patchOrderShopProductionVisibility(request, DEMO_ORDER, null);
  });

  test('none: buyer-tracking без production_po и PO id', async ({ page, request }) => {
    await patchCollectionShopProductionVisibility(request, COLLECTION, 'none');

    const res = await page.goto(
      `/shop/b2b/tracking?collection=${COLLECTION}&order=${DEMO_ORDER}`,
      GOTO
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('shop-co-tracking-list')).toBeVisible({ timeout: 60_000 });

    const row = page
      .getByTestId('shop-co-tracking-focus-row')
      .or(page.getByTestId(`shop-co-tracking-row-${DEMO_ORDER}`));
    await expect(row).toBeVisible({ timeout: 30_000 });
    await expect(row.locator('[data-testid="platform-core-chain-step-production_po"]')).toHaveCount(0);
    await expect(row.locator('[data-testid="platform-core-chain-step-materials_supplied"]')).toHaveCount(
      0
    );
    await expect(row.getByText(/ · PO /)).toHaveCount(0);
    await expect(page.getByTestId('shop-co-tracking-order-production-link')).toHaveCount(0);
  });

  test('full: handed-off order показывает production_po / PO при handoff', async ({
    page,
    request,
  }) => {
    const chainRes = await request.get(
      `/api/workshop2/b2b/orders/${DEMO_ORDER}/chain-status`,
      { headers: W2_BRAND_WRITE_HEADERS }
    );
    test.skip(!chainRes.ok(), 'chain-status недоступен');
    const chainJson = (await chainRes.json()) as { chain?: { handedOff?: boolean } };
    test.skip(chainJson.chain?.handedOff !== true, 'нужен handoff seed для full policy e2e');

    await patchCollectionShopProductionVisibility(request, COLLECTION, 'full');

    const res = await page.goto(
      `/shop/b2b/tracking?collection=${COLLECTION}&order=${DEMO_ORDER}`,
      GOTO
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    const row = page
      .getByTestId('shop-co-tracking-focus-row')
      .or(page.getByTestId(`shop-co-tracking-row-${DEMO_ORDER}`));
    await expect(row).toBeVisible({ timeout: 60_000 });
    await expect(row.locator('[data-testid="platform-core-chain-step-production_po"]')).toHaveCount(1);
  });

  test('per-order override: collection full + order none скрывает production_po', async ({
    page,
    request,
  }) => {
    const chainRes = await request.get(
      `/api/workshop2/b2b/orders/${DEMO_ORDER}/chain-status`,
      { headers: W2_BRAND_WRITE_HEADERS }
    );
    test.skip(!chainRes.ok(), 'chain-status недоступен');
    const chainJson = (await chainRes.json()) as { chain?: { handedOff?: boolean } };
    test.skip(chainJson.chain?.handedOff !== true, 'нужен handoff seed');

    await patchCollectionShopProductionVisibility(request, COLLECTION, 'full');
    await patchOrderShopProductionVisibility(request, DEMO_ORDER, 'none');

    const res = await page.goto(
      `/shop/b2b/tracking?collection=${COLLECTION}&order=${DEMO_ORDER}`,
      GOTO
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    const row = page
      .getByTestId('shop-co-tracking-focus-row')
      .or(page.getByTestId(`shop-co-tracking-row-${DEMO_ORDER}`));
    await expect(row).toBeVisible({ timeout: 60_000 });
    await expect(row.locator('[data-testid="platform-core-chain-step-production_po"]')).toHaveCount(0);
  });

  test('brand retailers: panel сохраняет policy в PG', async ({ page, request }) => {
    await patchCollectionShopProductionVisibility(request, COLLECTION, 'logistics');

    const res = await page.goto('/brand/retailers', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('brand-co-shop-production-visibility')).toBeVisible({
      timeout: 60_000,
    });
    await expect(
      page.getByTestId('brand-co-shop-production-visibility-logistics').locator('input')
    ).toBeChecked();
  });
});

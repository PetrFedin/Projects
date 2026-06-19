import { test, expect } from '@playwright/test';
import {
  assertW2RegistryResolvesOrder,
  checkoutPgOrderViaMatrix,
} from './helpers/core-checkout-pg';

const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 60_000 };

/**
 * Clean PG path: новый заказ из checkout (B2B-\\d+), резолв через w2_registry API — без pin B2B-DEMO-*.
 * Требует db:core:bootstrap (SS27 published + showroom), не требует spine INT-* seed.
 */
test.describe.configure({ mode: 'serial' });

test.describe('core-15: clean PG registry (w2_registry)', () => {
  test('health: PG mode flags exposed', async ({ request }) => {
    const res = await request.get('/api/workshop2/platform-core/health');
    expect(res.ok()).toBeTruthy();
    const json = (await res.json()) as {
      ok?: boolean;
      pgReachable?: boolean;
      spineOperationalPgPrimary?: boolean;
      operationalOrdersSource?: string;
    };
    expect(json.ok).toBe(true);
    expect(json.pgReachable).toBe(true);
    expect(typeof json.spineOperationalPgPrimary).toBe('boolean');
    expect(json.operationalOrdersSource).toMatch(/postgres/);
  });

  test('matrix checkout → w2_registry resolves PG order (not B2B-DEMO)', async ({
    page,
    request,
  }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap (SS27 publish)');

    const orderId = await checkoutPgOrderViaMatrix(page);
    await assertW2RegistryResolvesOrder(request, orderId);

    await expect(page.getByTestId('platform-core-order-detail-chrome')).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByTestId('platform-core-context-entity')).not.toContainText('B2B-DEMO');
  });

  test('checkout order appears in shop registry (not B2B-DEMO row only)', async ({
    page,
    request,
  }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = await checkoutPgOrderViaMatrix(page);
    await assertW2RegistryResolvesOrder(request, orderId);

    const res = await page.goto(`/shop/b2b/orders?order=${encodeURIComponent(orderId)}`, GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('shop-co-registry-panel')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('shop-co-registry-focus-row')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('shop-co-registry-focus-row')).toContainText(orderId);
    await expect(
      page.getByTestId('shop-co-registry-focus-row').getByRole('link', { name: orderId })
    ).toBeVisible({ timeout: 15_000 });
  });

  test('shop hub collection_order card uses PG registry order', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const registryRes = await request.get('/api/shop/b2b/orders?buyerId=shop1&collectionId=SS27');
    test.skip(!registryRes.ok(), 'shop orders API недоступен');
    const registryJson = (await registryRes.json()) as {
      ok?: boolean;
      orders?: Array<{ id?: string }>;
    };
    const latestId = registryJson.orders?.[0]?.id?.trim() ?? '';
    test.skip(!latestId, 'нет заказов в PG registry — прогоните checkout test первым');

    const res = await page.goto('/shop/core?pillar=collection_order&collection=SS27', {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('shop-co-cabinet-panel')).toBeVisible({ timeout: 60_000 });
    if (!latestId.startsWith('B2B-DEMO-')) {
      await expect(page.getByTestId('shop-co-cabinet-panel')).not.toContainText('B2B-DEMO');
    }
  });
});

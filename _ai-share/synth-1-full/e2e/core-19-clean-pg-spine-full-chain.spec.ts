import { test, expect } from '@playwright/test';
import {
  PG_CHAIN_STEP_IDS,
  assertW2RegistryResolvesOrder,
  bulkConfirmPgMaterialsViaApi,
  checkoutPgOrderViaMatrix,
  confirmPgOrderViaApi,
  fetchPgChainStatus,
  handoffPgOrderViaApi,
} from './helpers/core-checkout-pg';

/**
 * Clean PG spine 5/5 (без INT-JOOR import): checkout → confirm → handoff → bulk materials → chain.
 * SS27 bootstrap required; inventory_reserved зависит от WMS — не блокирует materials_supplied.
 */
test.describe.configure({ mode: 'serial' });

test.describe('core-19: clean PG spine full chain', () => {
  test('checkout → confirm → handoff → materials → materials_supplied step', async ({
    page,
    request,
  }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap (SS27 publish)');

    const orderId = await checkoutPgOrderViaMatrix(page);
    await assertW2RegistryResolvesOrder(request, orderId);

    await confirmPgOrderViaApi(request, orderId);
    const poId = await handoffPgOrderViaApi(request, orderId);

    await bulkConfirmPgMaterialsViaApi(request, orderId, poId);

    const chain = await fetchPgChainStatus(request, orderId);
    expect(chain.handedOff).toBe(true);
    expect(chain.productionOrderId).toBe(poId);
    expect(chain.steps?.find((s) => s.id === 'shop_sent')?.done).toBe(true);
    expect(chain.steps?.find((s) => s.id === 'brand_confirmed')?.done).toBe(true);
    expect(chain.steps?.find((s) => s.id === 'production_po')?.done).toBe(true);
    expect(chain.steps?.find((s) => s.id === 'materials_supplied')?.done).toBe(true);

    const doneCount =
      chain.steps?.filter(
        (s) => PG_CHAIN_STEP_IDS.includes(s.id as (typeof PG_CHAIN_STEP_IDS)[number]) && s.done
      ).length ?? 0;
    expect(doneCount).toBeGreaterThanOrEqual(4);
  });

  test('shop buyer-tracking row for PG order after handoff', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = await checkoutPgOrderViaMatrix(page);
    await confirmPgOrderViaApi(request, orderId);
    await handoffPgOrderViaApi(request, orderId);

    const res = await page.goto(
      `/shop/b2b/tracking?collection=SS27&order=${encodeURIComponent(orderId)}`,
      { waitUntil: 'domcontentloaded', timeout: 60_000 }
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('shop-co-tracking-list')).toBeVisible({ timeout: 60_000 });
    const row = page
      .getByTestId('shop-co-tracking-focus-row')
      .or(page.getByTestId(`shop-co-tracking-row-${orderId}`))
      .or(page.getByTestId(`platform-core-tracking-${orderId}`));
    await expect(row).toBeVisible({ timeout: 30_000 });
    await expect(row).not.toContainText('B2B-DEMO');
  });
});

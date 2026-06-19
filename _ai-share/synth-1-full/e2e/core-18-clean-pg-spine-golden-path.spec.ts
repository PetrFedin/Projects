import { test, expect } from '@playwright/test';
import {
  PG_CHAIN_STEP_IDS,
  assertW2RegistryResolvesOrder,
  checkoutPgOrderViaMatrix,
  confirmPgOrderViaApi,
  fetchPgChainStatus,
  handoffPgOrderViaApi,
} from './helpers/core-checkout-pg';

const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 60_000 };

/**
 * Clean PG spine: matrix checkout (B2B-\\d+) → brand confirm → handoff → chain PO.
 * Без B2B-DEMO-* и без import INT-JOOR-*.
 */
test.describe.configure({ mode: 'serial' });

test.describe('core-18: clean PG spine golden path', () => {
  test('checkout → confirm → handoff → chain PO (API)', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap (SS27 publish)');

    const orderId = await checkoutPgOrderViaMatrix(page);
    await assertW2RegistryResolvesOrder(request, orderId);

    const afterCheckout = await fetchPgChainStatus(request, orderId);
    expect(afterCheckout.status).toBe('submitted');
    expect(afterCheckout.steps?.find((s) => s.id === 'shop_sent')?.done).toBe(true);
    expect(afterCheckout.steps?.find((s) => s.id === 'brand_confirmed')?.done).toBe(false);

    await confirmPgOrderViaApi(request, orderId);
    const afterConfirm = await fetchPgChainStatus(request, orderId);
    expect(afterConfirm.status).toBe('confirmed');
    expect(afterConfirm.steps?.find((s) => s.id === 'brand_confirmed')?.done).toBe(true);
    expect(afterConfirm.handedOff).toBeFalsy();

    const poId = await handoffPgOrderViaApi(request, orderId);
    const afterHandoff = await fetchPgChainStatus(request, orderId);
    expect(afterHandoff.handedOff).toBe(true);
    expect(afterHandoff.productionOrderId).toBe(poId);
    expect(afterHandoff.steps?.find((s) => s.id === 'production_po')?.done).toBe(true);

    const doneCount =
      afterHandoff.steps?.filter((s) => PG_CHAIN_STEP_IDS.includes(s.id as (typeof PG_CHAIN_STEP_IDS)[number]) && s.done)
        .length ?? 0;
    expect(doneCount).toBeGreaterThanOrEqual(3);
    expect(doneCount).toBeLessThanOrEqual(5);
  });

  test('brand order detail shows chain after clean PG handoff', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = await checkoutPgOrderViaMatrix(page);
    await confirmPgOrderViaApi(request, orderId);
    await handoffPgOrderViaApi(request, orderId);

    const res = await page.goto(
      `/brand/b2b-orders/${encodeURIComponent(orderId)}?collection=SS27`,
      GOTO
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('platform-core-order-detail-chrome')).toBeVisible({
      timeout: 30_000,
    });
    await expect(
      page.getByTestId('brand-co-chain-card').or(page.getByTestId('brand-op-chain-status-card'))
    ).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByTestId('platform-core-context-entity')).not.toContainText('B2B-DEMO');
  });

  test('checkout inventory disclaimer is honest (no reserve at checkout)', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const collectionId = 'SS27';
    const res = await page.goto(`/shop/b2b/matrix?collection=${collectionId}`, GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(
      page.getByTestId('shop-co-matrix-shell').or(page.getByTestId('shop-b2b-matrix-shell'))
    ).toBeVisible({ timeout: 30_000 });

    await page
      .getByTestId('shop-co-matrix-qty-demo-ss27-01-M')
      .or(page.getByTestId('shop-b2b-matrix-qty-demo-ss27-01-M'))
      .fill('6');
    await page
      .getByTestId('shop-co-matrix-to-checkout')
      .or(page.getByTestId('shop-b2b-matrix-to-checkout'))
      .click();
    await expect(page).toHaveURL(/\/shop\/b2b\/checkout/, { timeout: 30_000 });

    const hold = page.getByTestId('shop-co-checkout-inventory-hold').or(
      page.getByTestId('shop-b2b-checkout-inventory-hold')
    );
    await expect(hold).toBeVisible({ timeout: 10_000 });
    await expect(hold).toContainText('не создаётся при оформлении');
  });
});

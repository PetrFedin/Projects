import { test, expect } from '@playwright/test';
import {
  assertOrderSectionCommsAutoThread,
  assertW2RegistryResolvesOrder,
  checkoutPgOrderViaMatrix,
  confirmPgOrderViaApi,
  handoffPgOrderViaApi,
} from './helpers/core-checkout-pg';

const GOTO = { waitUntil: 'commit' as const, timeout: 120_000 };

test.describe.configure({ mode: 'serial' });

/** Wave 30: brand×op minimums (7.0) — production registry filters + cabinet on clean PG. */
test.describe('core-49: brand-op minimums clean PG', () => {
  let orderId = '';

  test('production registry focus + handoff CTA after confirm', async ({ page, request }) => {
    test.setTimeout(240_000);
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    orderId = await checkoutPgOrderViaMatrix(page);
    await confirmPgOrderViaApi(request, orderId);
    await assertW2RegistryResolvesOrder(request, orderId);
    expect(orderId).toMatch(/^B2B-\d+$/);

    const ordersApi = page.waitForResponse(
      (r) => r.url().includes('/api/brand/b2b/orders') && r.ok(),
      { timeout: 60_000 }
    );
    const res = await page.goto(
      `/brand/b2b-orders?pillar=order_production&order=${encodeURIComponent(orderId)}`,
      GOTO
    );
    await ordersApi;
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('brand-op-registry-panel')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('brand-registry-production-context-strip')).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByTestId('brand-op-registry-focus-row')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId(`brand-b2b-order-detail-${orderId}`)).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByTestId(`brand-b2b-order-handoff-${orderId}`)).toBeVisible({
      timeout: 30_000,
    });
  });

  test('after handoff: PO on order detail + registry focus', async ({ page, request }) => {
    test.skip(!orderId, 'depends on setup');
    test.setTimeout(180_000);

    const poId = await handoffPgOrderViaApi(request, orderId);
    expect(poId).toMatch(/^PO-B2B-/);

    const detailRes = await page.goto(
      `/brand/b2b-orders/${encodeURIComponent(orderId)}?pillar=order_production&collection=SS27`,
      GOTO
    );
    expect(detailRes?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('platform-core-order-po-card')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId('platform-core-order-po')).toContainText('PO-B2B-');

    const res = await page.goto(
      `/brand/b2b-orders?pillar=order_production&order=${encodeURIComponent(orderId)}`,
      GOTO
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('brand-op-registry-panel')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('brand-op-registry-focus-row')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId(`brand-b2b-order-detail-${orderId}`)).toBeVisible({
      timeout: 30_000,
    });
  });

  test('brand-op-cabinet chain steps bind to PG order', async ({ page }) => {
    test.skip(!orderId, 'depends on setup');
    test.setTimeout(120_000);

    const res = await page.goto('/brand/core?pillar=order_production&collection=SS27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('brand-op-cabinet-panel')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('brand-op-cabinet-chain-steps')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('brand-op-po-id-badge')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('brand-op-cabinet-registry-link')).toHaveAttribute(
      'href',
      new RegExp(orderId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    );
    await expect(page.getByTestId('platform-core-chain-step-production_po')).toHaveAttribute(
      'data-done',
      'true'
    );
  });

  test('brand-op-registry → order detail chat → section auto-thread', async ({ page }) => {
    test.skip(!orderId, 'depends on setup');
    test.setTimeout(180_000);

    const res = await page.goto(
      `/brand/b2b-orders/${encodeURIComponent(orderId)}?pillar=order_production`,
      GOTO
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('brand-co-detail-chat-link')).toBeVisible({ timeout: 60_000 });

    await assertOrderSectionCommsAutoThread(page, {
      chatTestId: 'brand-co-detail-chat-link',
      expectedSectionId: 'brand-op-registry',
      expectedPillar: 'order_production',
      orderId,
    });
  });

  test('mfr production orders focus row on clean PG', async ({ page }) => {
    test.skip(!orderId, 'depends on setup');
    test.setTimeout(120_000);

    const res = await page.goto(
      `/factory/production/orders?order=${encodeURIComponent(orderId)}`,
      GOTO
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('factory-production-orders-core')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId('factory-production-orders-focus-row')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId('factory-production-orders-focus-row')).toHaveAttribute(
      'data-order',
      orderId
    );
  });
});

import { test, expect } from '@playwright/test';
import {
  checkoutPgOrderViaMatrix,
  confirmPgOrderViaApi,
  handoffPgOrderViaApi,
} from './helpers/core-checkout-pg';

const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 60_000 };

/** Wave 15: clean PG handoff → brand ERP retry UI + API (brand×op). */
test.describe('core-34: clean PG ERP retry after handoff', () => {
  test('brand order detail: ERP retry visible and POST succeeds', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = await checkoutPgOrderViaMatrix(page);
    expect(orderId).toMatch(/^B2B-\d+$/);
    await confirmPgOrderViaApi(request, orderId);
    await handoffPgOrderViaApi(request, orderId);

    const detailRes = await page.goto(
      `/brand/b2b-orders/${encodeURIComponent(orderId)}?pillar=order_production&collection=SS27`,
      GOTO
    );
    expect(detailRes?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('platform-core-order-detail-chrome')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId('brand-op-chain-status-card')).toBeVisible({
      timeout: 60_000,
    });
    const erpRetry = page.getByTestId('brand-b2b-erp-retry');
    await expect(erpRetry).toBeVisible({ timeout: 30_000 });

    const retryRes = await request.post(
      `/api/brand/b2b/orders/${encodeURIComponent(orderId)}/retry-production-erp`,
      { data: {} }
    );
    expect(retryRes.ok()).toBe(true);
    const retryJson = (await retryRes.json()) as { ok?: boolean; productionOrderId?: string };
    expect(retryJson.ok).toBe(true);
    expect(retryJson.productionOrderId).toMatch(/^PO-B2B-/);
  });
});

import { test, expect } from '@playwright/test';
import {
  bulkAckPgHandoffViaApi,
  checkoutPgOrderViaMatrix,
  confirmPgOrderViaApi,
  handoffPgOrderViaApi,
} from './helpers/core-checkout-pg';

const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 90_000 };
const FACTORY_ID = 'fact-1';

/**
 * Wave B P1: ERP UX — honest pending/backoff copy на brand + factory queue.
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-59-erp-retry-ux.spec.ts
 */
test.describe('core-59: ERP retry UX backoff', () => {
  test('brand: pending ERP hint после handoff', async ({ page, request }) => {
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
    await expect(page.getByTestId('brand-op-chain-status-card')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('brand-b2b-erp-pending-hint')).toContainText(
      /очереди цеха/i,
      { timeout: 30_000 }
    );
    await expect(page.getByTestId('brand-b2b-erp-retry')).toBeVisible();
  });

  test('factory: journal ERP alert + backoff hint после bulk ack', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = await checkoutPgOrderViaMatrix(page);
    await confirmPgOrderViaApi(request, orderId);
    await handoffPgOrderViaApi(request, orderId);
    await bulkAckPgHandoffViaApi(request, orderId, FACTORY_ID);

    const res = await page.goto(
      `/factory/production?collection=SS27&factoryId=${encodeURIComponent(FACTORY_ID)}#handoff-queue`,
      GOTO
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('mfr-op-handoff-queue-panel')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('mfr-op-handoff-queue-erp-alert')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId('mfr-op-handoff-queue-erp-alert')).toContainText(/журнал/i);
    const row = page.getByTestId(`factory-handoff-row-${orderId}`);
    await expect(row).toBeVisible({ timeout: 30_000 });
    await expect(row.getByTestId(/^factory-handoff-erp-PO-B2B-/)).toBeVisible();
  });
});

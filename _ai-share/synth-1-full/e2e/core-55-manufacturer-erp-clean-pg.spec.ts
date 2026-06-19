import { test, expect } from '@playwright/test';
import {
  bulkAckPgHandoffViaApi,
  checkoutPgOrderViaMatrix,
  confirmPgOrderViaApi,
  fetchHandoffQueueItemForOrder,
  handoffPgOrderViaApi,
} from './helpers/core-checkout-pg';

const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 60_000 };
const FACTORY_ID = 'fact-1';

test.describe.configure({ mode: 'serial' });

/**
 * Wave B P0: manufacturer ERP retry на чистой PG цепочке (не B2B-DEMO).
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-55-manufacturer-erp-clean-pg.spec.ts
 */
test.describe('core-55: manufacturer ERP clean-PG', () => {
  let orderId = '';
  let productionOrderId = '';

  test('setup: checkout → handoff → factory bulk ack (API)', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    orderId = await checkoutPgOrderViaMatrix(page);
    expect(orderId).toMatch(/^B2B-\d+$/);
    await confirmPgOrderViaApi(request, orderId);
    await handoffPgOrderViaApi(request, orderId);

    const ack = await bulkAckPgHandoffViaApi(request, orderId, FACTORY_ID);
    productionOrderId = ack.productionOrderId;

    await expect
      .poll(async () => {
        const item = await fetchHandoffQueueItemForOrder(request, orderId, FACTORY_ID);
        return item.status;
      })
      .toBe('synced');

    const synced = await fetchHandoffQueueItemForOrder(request, orderId, FACTORY_ID);
    expect(synced.erpExternalId?.startsWith('FACTORY-ACK-') || synced.status === 'error').toBe(
      true
    );
  });

  test('handoff queue: ERP alert + per-row retry UI', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded || !orderId, 'нужен db:core:bootstrap + setup test');

    const res = await page.goto(
      `/factory/production?collection=SS27&factoryId=${FACTORY_ID}#handoff-queue`,
      GOTO
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('mfr-op-handoff-queue-panel')).toBeVisible({ timeout: 60_000 });

    const row = page.getByTestId(`factory-handoff-row-${orderId}`);
    await expect(row).toBeVisible({ timeout: 60_000 });
    await expect(row.getByTestId(`b2b-chain-factory-synced-${orderId}`)).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByTestId('mfr-op-handoff-queue-erp-alert')).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByTestId(`factory-handoff-erp-${productionOrderId}`)).toBeVisible();
    await expect(page.getByTestId(`factory-handoff-erp-retry-${productionOrderId}`)).toBeVisible();

    const retryRes = await request.post(
      '/api/workshop2/factory/production-handoff-queue/retry-erp',
      {
        data: {
          productionOrderId,
          collectionId: 'SS27',
          articleId: 'demo-ss27-01',
          factoryId: FACTORY_ID,
        },
      }
    );
    expect(retryRes.ok()).toBe(true);
    const retryJson = (await retryRes.json()) as { ok?: boolean };
    expect(retryJson.ok).toBe(true);
  });

  test('production orders registry: ERP alert + UI retry', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded || !orderId, 'нужен db:core:bootstrap + setup test');

    const res = await page.goto(
      `/factory/production/orders?order=${encodeURIComponent(orderId)}&factoryId=${FACTORY_ID}`,
      GOTO
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('factory-production-orders-core')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId('factory-production-orders-erp-alert')).toBeVisible({
      timeout: 30_000,
    });
    const retryBtn = page
      .getByTestId('factory-production-orders-erp-alert-retry')
      .or(page.getByTestId('factory-production-orders-bulk-erp-retry'));
    await expect(retryBtn.first()).toBeVisible({ timeout: 30_000 });

    const bulkRetryRes = await request.post(
      '/api/workshop2/factory/production-handoff-queue/bulk-retry-erp',
      {
        data: {
          factoryId: FACTORY_ID,
          items: [
            {
              productionOrderId,
              collectionId: 'SS27',
              articleId: 'demo-ss27-01',
            },
          ],
          actor: 'core-55-e2e',
        },
      }
    );
    expect(bulkRetryRes.ok()).toBe(true);
    const bulkJson = (await bulkRetryRes.json()) as { ok?: boolean };
    expect(bulkJson.ok).toBe(true);
  });
});

import { test, expect } from '@playwright/test';
import {
  checkoutPgOrderViaMatrix,
  confirmPgOrderViaApi,
  fetchPgChainStatus,
  handoffPgOrderViaApi,
} from './helpers/core-checkout-pg';

test.describe.configure({ mode: 'serial' });

/** Wave 24: handoff queue PO in collection calendar, clean PG export, supplier WMS badge. */
test.describe('core-43: clean PG PO calendar + export + sup WMS', () => {
  test('collection calendar lists handoff queue PO for clean PG order', async ({
    page,
    request,
  }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = await checkoutPgOrderViaMatrix(page);
    await confirmPgOrderViaApi(request, orderId);
    await handoffPgOrderViaApi(request, orderId);
    expect(orderId).toMatch(/^B2B-\d+$/);

    await expect
      .poll(
        async () => {
          const res = await request.get(
            '/api/workshop2/platform-core/calendar-events?collectionId=SS27'
          );
          if (!res.ok()) return false;
          const json = (await res.json()) as {
            events?: Array<{ id?: string; b2bOrderId?: string }>;
          };
          return (
            json.events?.some(
              (e) => e.id?.startsWith('b2b-po-queue-') && e.b2bOrderId === orderId
            ) ?? false
          );
        },
        { timeout: 30_000 }
      )
      .toBe(true);
  });

  test('brand registry JSON export includes checkout order id', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = await checkoutPgOrderViaMatrix(page);
    expect(orderId).toMatch(/^B2B-\d+$/);

    const res = await request.get(
      '/api/brand/b2b/orders/export?collectionId=SS27&format=json'
    );
    expect(res.ok()).toBeTruthy();
    expect(res.headers()['x-platform-core-export-kind']).toBe('brand_registry_json');

    const json = (await res.json()) as {
      orders?: Array<{ orderId?: string; spineChannel?: string }>;
    };
    const row = json.orders?.find((o) => o.orderId === orderId);
    expect(row).toBeTruthy();
    expect(row?.orderId).not.toMatch(/B2B-DEMO/);
  });

  test('supplier cabinet WMS badge after brand confirm on clean PG', async ({
    page,
    request,
  }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean; pgReachable?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = await checkoutPgOrderViaMatrix(page);
    await confirmPgOrderViaApi(request, orderId);

    const chain = await fetchPgChainStatus(request, orderId);
    const inventoryStep = chain.steps?.find((s) => s.id === 'inventory_reserved');
    test.skip(!health.pgReachable || !inventoryStep?.done, 'WMS reserve not active on this env');

    await page.goto('/factory/supplier/core?pillar=order_production&collection=SS27', {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });
    await expect(page.getByTestId('sup-op-cabinet-panel')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('sup-op-cabinet-wms-reserve-badge')).toContainText(
      /Резерв WMS|заявка.*резерв|PG/i
    );
  });
});

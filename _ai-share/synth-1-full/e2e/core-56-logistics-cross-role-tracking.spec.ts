import { test, expect } from '@playwright/test';
import {
  bulkAckPgHandoffViaApi,
  checkoutPgOrderViaMatrix,
  confirmPgOrderViaApi,
  handoffPgOrderViaApi,
} from './helpers/core-checkout-pg';

const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 60_000 };

/**
 * Wave B P1: logistics tracking # cross-role (brand PG → shop mirror).
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-56-logistics-cross-role-tracking.spec.ts
 */
test.describe('core-56: logistics cross-role tracking', () => {
  test('brand POST ТТН → shop tracking + order detail видит номер', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = await checkoutPgOrderViaMatrix(page);
    expect(orderId).toMatch(/^B2B-\d+$/);
    await confirmPgOrderViaApi(request, orderId);

    const marker = `TTN-CORE56-${Date.now()}`;
    const postRes = await request.post(
      `/api/workshop2/b2b/orders/${encodeURIComponent(orderId)}/logistics-tracking`,
      { data: { trackingNumber: marker, carrier: 'DHL Express' } }
    );
    expect(postRes.ok()).toBe(true);
    const postJson = (await postRes.json()) as { ok?: boolean; trackingNumber?: string };
    expect(postJson.ok).toBe(true);
    expect(postJson.trackingNumber).toBe(marker);

    const getRes = await request.get(
      `/api/integrations/v1/orders/${encodeURIComponent(orderId)}/tracking`
    );
    expect(getRes.ok()).toBe(true);
    const getJson = (await getRes.json()) as {
      data?: { shipment?: { trackingNumber?: string } };
    };
    expect(getJson.data?.shipment?.trackingNumber).toBe(marker);

    const trackingPage = await page.goto(
      `/shop/b2b/tracking?collection=SS27&order=${encodeURIComponent(orderId)}`,
      GOTO
    );
    expect(trackingPage?.status() ?? 599).toBeLessThan(500);
    const trackingStrip = page.getByTestId(`shop-co-tracking-shipment-${orderId}`);
    await expect(trackingStrip).toBeVisible({ timeout: 60_000 });
    await expect(trackingStrip).toContainText(marker);

    const detailRes = await page.goto(`/shop/b2b/orders/${encodeURIComponent(orderId)}`, GOTO);
    expect(detailRes?.status() ?? 599).toBeLessThan(500);
    const detailStrip = page.getByTestId(`shop-co-tracking-shipment-${orderId}`);
    await expect(detailStrip).toBeVisible({ timeout: 60_000 });
    await expect(detailStrip).toContainText(marker);
  });

  test('factory bulk ack → shop peer mirror «Цех принял»', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = await checkoutPgOrderViaMatrix(page);
    await confirmPgOrderViaApi(request, orderId);
    await handoffPgOrderViaApi(request, orderId);
    await bulkAckPgHandoffViaApi(request, orderId);

    const res = await page.goto(`/shop/b2b/orders/${encodeURIComponent(orderId)}`, GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);

    const mirror = page.getByTestId('shop-co-chain-peer-mirror');
    await expect(mirror).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('shop-co-chain-peer-po-synced')).toBeVisible({ timeout: 30_000 });
  });
});

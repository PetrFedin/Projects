import { test, expect } from '@playwright/test';
import {
  bulkAckPgHandoffViaApi,
  checkoutPgOrderViaMatrix,
  confirmPgOrderViaApi,
  handoffPgOrderViaApi,
} from './helpers/core-checkout-pg';

const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 60_000 };

/**
 * Wave B P1: PO status SSE/poll → second-actor UI без reload.
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-57-po-status-sse-second-actor.spec.ts
 */
test.describe('core-57: PO status SSE second-actor', () => {
  test('brand confirm API → shop mirror live без reload', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = await checkoutPgOrderViaMatrix(page);
    expect(orderId).toMatch(/^B2B-\d+$/);

    const res = await page.goto(`/shop/b2b/orders/${encodeURIComponent(orderId)}`, GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);

    const mirror = page.getByTestId('shop-co-chain-peer-mirror');
    await expect(mirror).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('shop-co-chain-peer-status-summary')).toContainText(
      /ожидает подтверждения/i,
      { timeout: 30_000 }
    );

    await confirmPgOrderViaApi(request, orderId);

    await expect(page.getByTestId('shop-co-chain-peer-status-summary')).toContainText(
      /подтвердил/i,
      { timeout: 45_000 }
    );
    await expect(page.getByTestId('shop-co-chain-peer-po-pending')).toHaveCount(0);
  });

  test('factory bulk ack API → shop mirror «Цех принял» live без reload', async ({
    page,
    request,
  }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = await checkoutPgOrderViaMatrix(page);
    await confirmPgOrderViaApi(request, orderId);
    await handoffPgOrderViaApi(request, orderId);

    const res = await page.goto(`/shop/b2b/orders/${encodeURIComponent(orderId)}`, GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);

    await expect(page.getByTestId('shop-co-chain-peer-mirror')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('shop-co-chain-peer-po-pending')).toBeVisible({
      timeout: 45_000,
    });
    await expect(page.getByTestId('shop-co-chain-peer-po-synced')).toHaveCount(0);

    await bulkAckPgHandoffViaApi(request, orderId);

    await expect(page.getByTestId('shop-co-chain-peer-po-synced')).toBeVisible({
      timeout: 45_000,
    });
    await expect(page.getByTestId('shop-co-chain-peer-po-pending')).toHaveCount(0);
  });
});

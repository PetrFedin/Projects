import { test, expect } from '@playwright/test';
import {
  checkoutPgOrderViaMatrix,
  confirmPgOrderViaApi,
  handoffPgOrderViaApi,
} from './helpers/core-checkout-pg';

test.describe.configure({ mode: 'serial' });

/** Wave 23: mfr handoff shop-floor on clean PG + calendar handoff event. */
test.describe('core-42: clean PG mfr handoff shop-floor', () => {
  test('handoff queue exposes shop-floor bundle for B2B-\\d+ order', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = await checkoutPgOrderViaMatrix(page);
    await confirmPgOrderViaApi(request, orderId);
    await handoffPgOrderViaApi(request, orderId);
    expect(orderId).toMatch(/^B2B-\d+$/);

    const res = await page.goto(
      '/factory/production?collection=SS27#handoff-queue',
      { waitUntil: 'domcontentloaded', timeout: 60_000 }
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('mfr-op-handoff-queue-panel')).toBeVisible({ timeout: 60_000 });

    const bundleLink = page.getByTestId(`mfr-op-handoff-shop-floor-bundle-${orderId}`);
    await expect(bundleLink).toBeVisible({ timeout: 60_000 });
    const href = await bundleLink.getAttribute('href');
    expect(href).toMatch(/shop-floor-bundle/);
    expect(href).not.toMatch(/B2B-DEMO/);

    const bundleRes = await request.get(href!);
    expect(bundleRes.ok()).toBe(true);
    const body = await bundleRes.text();
    expect(body.length).toBeGreaterThan(20);
    expect(body).toMatch(/B2B|shop-floor|article/i);
  });

  test('calendar-events includes handoff event for clean PG order', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = await checkoutPgOrderViaMatrix(page);
    await confirmPgOrderViaApi(request, orderId);
    await handoffPgOrderViaApi(request, orderId);

    await expect
      .poll(
        async () => {
          const res = await request.get(
            `/api/workshop2/platform-core/calendar-events?collectionId=SS27&orderId=${encodeURIComponent(orderId)}`
          );
          if (!res.ok()) return 0;
          const json = (await res.json()) as { events?: unknown[] };
          return json.events?.length ?? 0;
        },
        { timeout: 30_000 }
      )
      .toBeGreaterThanOrEqual(1);
  });
});

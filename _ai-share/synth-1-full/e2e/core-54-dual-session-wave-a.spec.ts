import { test, expect } from '@playwright/test';
import {
  checkoutPgOrderViaMatrix,
  confirmPgOrderViaApi,
  fetchPgContextualMessages,
} from './helpers/core-checkout-pg';
import { expectShopThreadsIncludeOrderPreview } from './helpers/core-dual-session';

const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 90_000 };

/**
 * Wave A P0: dual-session proof (API actors + shop UI mirror без refetch-hack).
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-54-dual-session-wave-a.spec.ts
 */
test.describe('core-54: dual-session wave A', () => {
  test('brand contextual POST → shop threads inbox видит preview', async ({ request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { pgReachable?: boolean; demoSeeded?: boolean };
    test.skip(!health.pgReachable || !health.demoSeeded, 'нужен db:core:bootstrap + PG');

    const orderId = 'B2B-DEMO-SHOP1-SS27';
    const marker = `core54-dual-${Date.now()}`;
    const postRes = await request.post('/api/messages/contextual', {
      data: {
        contextType: 'b2b_order',
        contextId: orderId,
        message: marker,
      },
    });
    expect(postRes.status()).toBe(201);

    const messages = await fetchPgContextualMessages(request, orderId);
    expect(messages.some((m) => m.message === marker)).toBe(true);

    await expectShopThreadsIncludeOrderPreview(request, orderId, marker);
  });

  test('brand confirm API → shop UI peer mirror без общей сессии', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { pgReachable?: boolean; demoSeeded?: boolean };
    test.skip(!health.pgReachable || !health.demoSeeded, 'нужен db:core:bootstrap + PG');

    const orderId = await checkoutPgOrderViaMatrix(page);
    await confirmPgOrderViaApi(request, orderId);

    const res = await page.goto(`/shop/b2b/orders/${encodeURIComponent(orderId)}`, GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);

    const mirror = page.getByTestId('shop-co-chain-peer-mirror');
    await expect(mirror).toBeVisible({ timeout: 60_000 });
    await expect(mirror).toContainText(/подтвердил/i, { timeout: 45_000 });
  });

  test('calendar user-task POST → GET events переживает повторный запрос (PG SoT)', async ({
    request,
  }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { pgReachable?: boolean };
    test.skip(!health.pgReachable, 'нужен PG');

    const marker = `core54-cal-${Date.now()}`;
    const orderId = 'B2B-DEMO-SHOP1-SS27';
    const createRes = await request.post('/api/workshop2/platform-core/calendar-events/user-task', {
      data: {
        collectionId: 'SS27',
        ownerRole: 'brand',
        title: marker,
        startAt: '2026-07-01T10:00',
        endAt: '2026-07-01T11:00',
        orderId,
      },
    });
    expect(createRes.ok()).toBeTruthy();
    const created = (await createRes.json()) as { ok?: boolean; event?: { id?: string } };
    expect(created.ok).toBe(true);
    const eventId = created.event?.id ?? '';
    expect(eventId.length).toBeGreaterThan(0);

    const listOnce = async () => {
      const listRes = await request.get(
        `/api/workshop2/platform-core/calendar-events?collectionId=SS27&orderId=${encodeURIComponent(orderId)}`
      );
      expect(listRes.ok()).toBeTruthy();
      const json = (await listRes.json()) as { events?: Array<{ id?: string; title?: string }> };
      return json.events?.some((e) => e.id === eventId || e.title === marker) ?? false;
    };

    await expect.poll(listOnce, { timeout: 15_000 }).toBe(true);
    await expect.poll(listOnce, { timeout: 5_000 }).toBe(true);
  });
});

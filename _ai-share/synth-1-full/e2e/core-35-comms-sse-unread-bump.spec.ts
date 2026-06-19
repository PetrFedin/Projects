import { test, expect } from '@playwright/test';
import {
  checkoutPgOrderViaMatrix,
  ensurePgContextualThreadViaApi,
} from './helpers/core-checkout-pg';

const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 60_000 };

/** Wave 15: contextual message → registry SSE bump → comms unread badge refresh. */
test.describe('core-35: comms SSE unread bump', () => {
  test('brand comms hub: SSE live badge + unread after contextual ensure', async ({
    page,
    request,
  }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = await checkoutPgOrderViaMatrix(page);
    await ensurePgContextualThreadViaApi(request, orderId, { source: 'registry' });

    await page.goto('/brand/core?pillar=comms&collection=SS27', GOTO);
    await expect(page.getByTestId('comms-pillar-card')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('brand-cm-order-chat-link')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('brand-cm-calendar-link')).toBeVisible({ timeout: 30_000 });
    const unreadBadge = page.getByTestId('comms-pillar-unread-badge');
    await expect(unreadBadge).toBeVisible({ timeout: 30_000 });
  });
});

import { test, expect } from '@playwright/test';
import { gotoRoleCoreCabinet } from './helpers/core-chain-overview';
import { checkoutPgOrderViaMatrix } from './helpers/core-checkout-pg';

const CHECKOUT_RESERVE_COPY =
  'Резерв склада — после подтверждения брендом и передачи в цех.';

const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 90_000 };

/**
 * Wave 44: unified WMS reserve copy + comms inbox Redis hub health.
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-61-wms-reserve-redis.spec.ts
 */
test.describe('core-61: WMS reserve copy + realtime hubs health', () => {
  test('checkout + tracking: единый честный copy про резерв', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    await checkoutPgOrderViaMatrix(page);

    const checkoutRes = await page.goto('/shop/b2b/checkout?collection=SS27', GOTO);
    expect(checkoutRes?.status() ?? 599).toBeLessThan(500);
    const hold = page.getByTestId('shop-co-checkout-inventory-hold');
    await expect(hold).toBeVisible({ timeout: 60_000 });
    await expect(hold).toContainText(CHECKOUT_RESERVE_COPY);

    const trackingRes = await gotoRoleCoreCabinet(
      page,
      '/shop/core?pillar=order_production&collection=SS27'
    );
    expect(trackingRes?.status() ?? 599).toBeLessThan(500);
    const reserveBadge = page.locator('[data-testid^="shop-co-tracking-reserve-"]').first();
    await expect(reserveBadge).toBeVisible({ timeout: 60_000 });
    await expect(reserveBadge).toContainText(/резерв/i);
    await expect(reserveBadge).not.toContainText(/оформлен на checkout/i);
  });

  test('supplier OP: pending WMS = заявка в PG', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const res = await gotoRoleCoreCabinet(
      page,
      '/factory/supplier/core?pillar=order_production&collection=SS27'
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    const badge = page.getByTestId('sup-op-cabinet-wms-reserve-badge');
    await expect(badge).toBeVisible({ timeout: 60_000 });
    const text = (await badge.textContent())?.trim() ?? '';
    expect(text === 'Резерв WMS оформлен' || text.includes('PG')).toBeTruthy();
  });

  test('health API: realtimeHubs включает comms-inbox', async ({ request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    expect(healthRes.ok()).toBeTruthy();
    const health = (await healthRes.json()) as {
      realtimeHubs?: { hubs?: Array<{ id: string }> };
    };
    const ids = (health.realtimeHubs?.hubs ?? []).map((h) => h.id);
    expect(ids).toContain('comms-inbox');
    expect(ids).toContain('b2b-registry');
    expect(ids).toContain('chain-status');
  });
});

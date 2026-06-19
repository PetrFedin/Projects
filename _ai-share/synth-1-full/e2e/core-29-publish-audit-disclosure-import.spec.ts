import { test, expect } from '@playwright/test';
import { checkoutPgOrderViaMatrix } from './helpers/core-checkout-pg';

test.describe.configure({ mode: 'serial' });

/** Wave 9: publish audit log, brand-co disclosure in cabinet, compact spine import, PG operational health. */
test.describe('core-29: publish audit + brand-co disclosure + cabinet import', () => {
  test('publish-audit-log API returns structured response', async ({ request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean; pgReachable?: boolean };
    test.skip(!health.demoSeeded || !health.pgReachable, 'нужен db:core:bootstrap + PG');

    const res = await request.get('/api/workshop2/collections/SS27/publish-audit-log?limit=5');
    expect(res.ok()).toBeTruthy();
    const json = (await res.json()) as {
      ok?: boolean;
      collectionId?: string;
      events?: unknown[];
      messageRu?: string;
    };
    expect(json.ok).toBe(true);
    expect(json.collectionId).toBe('SS27');
    expect(Array.isArray(json.events)).toBe(true);
    expect(json.messageRu).toBeTruthy();
  });

  test('linesheets mounts publish audit log panel', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    await page.goto('/brand/linesheets?collection=SS27', {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });
    await expect(page.getByTestId('brand-sc-linesheets-panel')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('brand-sc-publish-audit-log')).toBeVisible({ timeout: 30_000 });
    await expect(
      page
        .getByTestId('brand-sc-publish-audit-list')
        .or(page.getByTestId('brand-sc-publish-audit-empty'))
    ).toBeVisible();
  });

  test('brand co cabinet: disclosure preview + compact import after PG checkout', async ({
    page,
    request,
  }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = await checkoutPgOrderViaMatrix(page);
    expect(orderId).toMatch(/^B2B-\d+$/);

    await page.goto('/brand/b2b-orders?collection=SS27', {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });
    await expect(page.getByTestId('brand-co-shop-disclosure-preview-strip')).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByTestId('brand-co-registry-import-toolbar')).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByTestId('brand-co-registry-joor-import-btn')).toBeVisible();
    await expect(page.getByTestId('brand-co-cabinet-registry-full-link')).toBeVisible();
  });

  test('health exposes operational postgres spine (e2e bootstrap)', async ({ request }) => {
    const res = await request.get('/api/workshop2/platform-core/health');
    expect(res.ok()).toBeTruthy();
    const json = (await res.json()) as {
      ok?: boolean;
      pgReachable?: boolean;
      operationalOrdersSource?: string;
      spineOperationalPgPrimary?: boolean;
    };
    expect(json.ok).toBe(true);
    expect(json.pgReachable).toBe(true);
    expect(json.operationalOrdersSource).toMatch(/postgres/);
    expect(typeof json.spineOperationalPgPrimary).toBe('boolean');
  });
});

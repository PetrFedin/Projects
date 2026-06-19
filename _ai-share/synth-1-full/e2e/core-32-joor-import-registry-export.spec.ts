import { test, expect } from '@playwright/test';

/** Wave 12: INT JOOR import → brand registry JSON export spineChannel (ADR-002 brand×co). */
test.describe('core-32: joor import → registry export spineChannel', () => {
  test('POST joor import then export JSON row has neutral spineChannel', async ({ request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean; pgReachable?: boolean };
    test.skip(!health.demoSeeded || !health.pgReachable, 'нужен db:core:bootstrap + PG');

    const extId = `core32-joor-${Date.now()}`;
    const importRes = await request.post('/api/integrations/v1/joor/orders/import', {
      data: {
        externalOrderId: extId,
        id: extId,
        status: 'pending',
        customer_name: 'Core32 Shop',
        collectionId: 'SS27',
        lines: [{ sku: 'SS27-M-COAT-01', quantity: 4, unit_price: 42000 }],
      },
    });
    expect(importRes.ok()).toBe(true);
    const imported = (await importRes.json()) as {
      data?: { results?: Array<{ wholesaleOrderId: string }> };
    };
    const wholesaleOrderId = imported.data?.results?.[0]?.wholesaleOrderId;
    expect(wholesaleOrderId).toMatch(/^INT-JOOR-/i);

    const exportRes = await request.get(
      '/api/brand/b2b/orders/export?format=json&collectionId=SS27'
    );
    expect(exportRes.ok()).toBe(true);
    const json = (await exportRes.json()) as {
      orders?: Array<{ orderId?: string; spineChannel?: string }>;
    };
    const row = json.orders?.find((o) => o.orderId === wholesaleOrderId);
    expect(row).toBeTruthy();
    expect(row?.spineChannel).toBe('Партнёрская сеть');
  });

  test('registry toolbar import CTA visible on core path', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const res = await page.goto('/brand/b2b-orders?collection=SS27', {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('brand-co-registry-panel')).toBeVisible({ timeout: 60_000 });
    const toolbar = page
      .getByTestId('brand-co-registry-import-toolbar')
      .or(page.getByTestId('brand-co-cabinet-import-toolbar'));
    await expect(toolbar.first()).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('brand-co-registry-joor-import-btn').first()).toBeVisible();
  });
});

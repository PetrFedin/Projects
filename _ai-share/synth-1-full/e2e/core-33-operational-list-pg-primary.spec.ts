import { test, expect } from '@playwright/test';

/** Wave 13: INT JOOR import → v1 operational list on PG-primary (no file mirror). */
test.describe('core-33: operational list PG-primary INT orders', () => {
  test('POST joor import then v1 list includes INT order', async ({ request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as {
      demoSeeded?: boolean;
      pgReachable?: boolean;
      spineOperationalPgPrimary?: boolean;
    };
    test.skip(
      !health.demoSeeded || !health.pgReachable || !health.spineOperationalPgPrimary,
      'нужен db:core:bootstrap + PG-primary'
    );

    const extId = `core33-joor-${Date.now()}`;
    const importRes = await request.post('/api/integrations/v1/joor/orders/import', {
      data: {
        externalOrderId: extId,
        id: extId,
        status: 'pending',
        customer_name: 'Core33 Shop',
        collectionId: 'SS27',
        lines: [{ sku: 'SS27-M-COAT-01', quantity: 2, unit_price: 38000 }],
      },
    });
    expect(importRes.ok()).toBe(true);
    const imported = (await importRes.json()) as {
      data?: { results?: Array<{ wholesaleOrderId: string }> };
    };
    const wholesaleOrderId = imported.data?.results?.[0]?.wholesaleOrderId;
    expect(wholesaleOrderId).toMatch(/^INT-JOOR-/i);

    const listRes = await request.get('/api/b2b/v1/operational-orders', {
      headers: { 'x-syntha-api-actor-role': 'brand' },
    });
    expect(listRes.ok()).toBe(true);
    const list = (await listRes.json()) as {
      data?: { orders?: Array<{ wholesaleOrderId?: string }> };
    };
    const ids = list.data?.orders?.map((o) => o.wholesaleOrderId) ?? [];
    expect(ids).toContain(wholesaleOrderId);

    const detailRes = await request.get(
      `/api/b2b/v1/operational-orders/${encodeURIComponent(wholesaleOrderId)}`,
      { headers: { 'x-syntha-api-actor-role': 'brand' } }
    );
    expect(detailRes.ok()).toBe(true);
    const detail = (await detailRes.json()) as {
      data?: { order?: { wholesaleOrderId?: string; items?: unknown[] } };
    };
    expect(detail.data?.order?.wholesaleOrderId).toBe(wholesaleOrderId);
    expect((detail.data?.order?.items?.length ?? 0) > 0).toBe(true);
    expect(detail.data?.order?.integration?.sourcePlatform).toBe('joor');
  });
});

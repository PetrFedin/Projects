import { test, expect } from '@playwright/test';

/** Wave C2: NuOrder archive → spine import → brand registry. */
test.describe('Integrations spine NuOrder import', () => {
  test('nuorder import → appears in brand operational list', async ({ request }) => {
    const extId = `e2e-nuorder-${Date.now()}`;
    const importRes = await request.post('/api/integrations/v1/nuorder/orders/import', {
      data: {
        externalOrderId: extId,
        id: extId,
        status: 'pending',
        customer_name: 'NuOrder E2E Shop',
        lines: [{ sku: 'SS27-M-COAT-01', quantity: 4, unit_price: 42000 }],
      },
    });
    expect(importRes.ok()).toBe(true);
    const imported = (await importRes.json()) as {
      data?: { results?: Array<{ wholesaleOrderId: string }> };
    };
    const wholesaleOrderId = imported.data?.results?.[0]?.wholesaleOrderId;
    expect(wholesaleOrderId).toMatch(/^INT-NUORDER-/);

    const listRes = await request.get('/api/b2b/v1/operational-orders', {
      headers: { 'x-syntha-api-actor-role': 'brand' },
    });
    expect(listRes.ok()).toBe(true);
    const list = (await listRes.json()) as {
      data?: { orders?: Array<{ wholesaleOrderId: string; integration?: { sourcePlatform?: string } }> };
    };
    const row = list.data?.orders?.find((o) => o.wholesaleOrderId === wholesaleOrderId);
    expect(row).toBeTruthy();
    expect(row?.integration?.sourcePlatform).toBe('nuorder');
  });
});

/** Wave B1: Centric Approved → eligible gate. */
test.describe('Integrations Centric eligible showroom path', () => {
  test('centric approved import → eligible API true', async ({ request }) => {
    const articleId = `demo-ss27-centric-e2e-${Date.now()}`;
    const importRes = await request.post('/api/integrations/v1/centric/styles/import', {
      data: {
        styleId: `CENTRIC-E2E-${articleId}`,
        articleId,
        collectionId: 'SS27',
        lifecycleState: 'Approved',
      },
    });
    expect(importRes.ok()).toBe(true);

    const gateRes = await request.get(
      `/api/integrations/v1/articles/SS27/${encodeURIComponent(articleId)}/eligible`
    );
    expect(gateRes.ok()).toBe(true);
    const gate = (await gateRes.json()) as {
      data?: { eligibleForCollection?: boolean; sources?: string[] };
    };
    expect(gate.data?.eligibleForCollection).toBe(true);
    expect(gate.data?.sources).toContain('centric_approved');
  });
});

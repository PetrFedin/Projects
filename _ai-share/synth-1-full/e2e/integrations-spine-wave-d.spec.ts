import { test, expect } from '@playwright/test';

test.describe('Integrations spine Wave D (WIP + tracking)', () => {
  test('golden handoff → AIMS WIP → shop tracking API', async ({ request }) => {
    const extId = `wave-d-joor-${Date.now()}`;
    const importRes = await request.post('/api/integrations/v1/joor/orders/import', {
      data: {
        externalOrderId: extId,
        id: extId,
        status: 'pending',
        customer_name: 'Wave D Shop',
        lines: [{ sku: 'SS27-M-COAT-01', quantity: 6, unit_price: 42000 }],
      },
    });
    expect(importRes.ok()).toBe(true);
    const wholesaleOrderId = (
      (await importRes.json()) as { data?: { results?: Array<{ wholesaleOrderId: string }> } }
    ).data?.results?.[0]?.wholesaleOrderId;
    expect(wholesaleOrderId).toBeTruthy();

    await request.post(`/api/brand/b2b/orders/${encodeURIComponent(wholesaleOrderId!)}/confirm-order`, {
      data: {},
    });
    const handoff = await request.post(
      `/api/brand/b2b/orders/${encodeURIComponent(wholesaleOrderId!)}/confirm-production-handoff`,
      { data: {} }
    );
    expect(handoff.ok()).toBe(true);
    const poId = ((await handoff.json()) as { productionOrderId?: string }).productionOrderId;

    const wipRes = await request.post('/api/integrations/v1/aims360/wip/sync', {
      data: { productionOrderId: poId, b2bOrderId: wholesaleOrderId, poStage: 'qc' },
    });
    expect(wipRes.ok()).toBe(true);

    const trackRes = await request.post('/api/integrations/v1/zedonk/tracking/sync', {
      data: {
        wholesaleOrderId,
        trackingNumber: 'WAVE-D-TRACK-1',
        carrier: 'Demo Carrier',
      },
    });
    expect(trackRes.ok()).toBe(true);

    const unified = await request.get(
      `/api/integrations/v1/orders/${encodeURIComponent(wholesaleOrderId!)}/tracking`
    );
    expect(unified.ok()).toBe(true);
    const body = (await unified.json()) as {
      data?: { wip?: { poStage?: string }; shipment?: { trackingNumber?: string } };
    };
    expect(body.data?.wip?.poStage).toBe('qc');
    expect(body.data?.shipment?.trackingNumber).toBe('WAVE-D-TRACK-1');
  });
});

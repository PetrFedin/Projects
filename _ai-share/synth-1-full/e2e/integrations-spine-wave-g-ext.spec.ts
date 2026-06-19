import { test, expect } from '@playwright/test';

test.describe('Integrations spine Wave G ext', () => {
  test('JOOR import → handoff seeds WIP → shipped auto-pulls inbound tracking', async ({
    request,
  }) => {
    const extId = `wave-g-joor-${Date.now()}`;
    const importRes = await request.post('/api/integrations/v1/joor/orders/import', {
      data: {
        externalOrderId: extId,
        id: extId,
        status: 'pending',
        customer_name: 'G Shop',
        lines: [{ sku: 'SS27-M-COAT-01', quantity: 5, unit_price: 42000 }],
      },
    });
    expect(importRes.ok()).toBe(true);
    const wholesaleOrderId = (
      (await importRes.json()) as { data?: { results?: Array<{ wholesaleOrderId: string }> } }
    ).data?.results?.[0]?.wholesaleOrderId;
    expect(wholesaleOrderId).toMatch(/^INT-JOOR-/);

    await request.post(`/api/brand/b2b/orders/${encodeURIComponent(wholesaleOrderId!)}/confirm-order`, {
      data: {},
    });

    await request.post(
      `/api/brand/b2b/orders/${encodeURIComponent(wholesaleOrderId!)}/confirm-production-handoff`,
      { data: {} }
    );

    const wipRes = await request.post('/api/integrations/v1/aims360/wip/sync', {
      data: {
        productionOrderId: `PO-B2B-${wholesaleOrderId}`,
        b2bOrderId: wholesaleOrderId,
        poStage: 'shipped',
      },
    });
    expect(wipRes.ok()).toBe(true);
    const wipBody = (await wipRes.json()) as {
      data?: { autoPull?: { pulled?: boolean; platform?: string } };
    };
    expect(wipBody.data?.autoPull?.pulled).toBe(true);
    expect(wipBody.data?.autoPull?.platform).toBe('joor');

    const trk = await request.get(
      `/api/integrations/v1/orders/${encodeURIComponent(wholesaleOrderId!)}/tracking`
    );
    expect(trk.ok()).toBe(true);
    const trkBody = (await trk.json()) as {
      data?: { shipment?: { trackingNumber?: string; platform?: string } };
    };
    expect(trkBody.data?.shipment?.platform).toBe('joor');
    expect(trkBody.data?.shipment?.trackingNumber).toMatch(/^JOOR-IN-/);

    const joorInbound = await request.post('/api/integrations/v1/joor/tracking/import', {
      data: { wholesaleOrderId },
    });
    expect(joorInbound.ok()).toBe(true);
  });
});

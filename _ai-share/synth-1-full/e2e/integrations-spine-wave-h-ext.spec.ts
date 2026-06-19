import { test, expect } from '@playwright/test';

test.describe('Integrations spine Wave H ext', () => {
  test('shipment webhook → shop tracking mirror for JOOR INT order', async ({ request }) => {
    const extId = `wave-h-joor-${Date.now()}`;
    const importRes = await request.post('/api/integrations/v1/joor/orders/import', {
      data: {
        externalOrderId: extId,
        id: extId,
        status: 'pending',
        customer_name: 'Webhook Shop',
        lines: [{ sku: 'SS27-M-COAT-01', quantity: 4, unit_price: 42000 }],
      },
    });
    expect(importRes.ok()).toBe(true);
    const wholesaleOrderId = (
      (await importRes.json()) as { data?: { results?: Array<{ wholesaleOrderId: string }> } }
    ).data?.results?.[0]?.wholesaleOrderId;
    expect(wholesaleOrderId).toMatch(/^INT-JOOR-/);

    const webhook = await request.post('/api/integrations/v1/webhooks/shipment', {
      data: {
        platform: 'joor',
        wholesaleOrderId,
        trackingNumber: `WH-TRK-${Date.now()}`,
        carrier: 'DHL Express',
        status: 'shipped',
      },
    });
    expect(webhook.ok()).toBe(true);

    const trk = await request.get(
      `/api/integrations/v1/orders/${encodeURIComponent(wholesaleOrderId!)}/tracking`
    );
    expect(trk.ok()).toBe(true);
    const trkBody = (await trk.json()) as {
      data?: { shipment?: { trackingNumber?: string; platform?: string } };
    };
    expect(trkBody.data?.shipment?.platform).toBe('joor');
    expect(trkBody.data?.shipment?.trackingNumber).toContain('WH-TRK');
  });
});

import { test, expect } from '@playwright/test';
import { PLATFORM_CORE_DEMO } from '../src/lib/platform-core-demo-context';

test.describe('Integrations spine Wave D/E (procurement + calendar + BOM)', () => {
  test('RFQ import → procurement API → delivery window → calendar', async ({ request }) => {
    const extId = `wave-de-joor-${Date.now()}`;
    const importRes = await request.post('/api/integrations/v1/joor/orders/import', {
      data: {
        externalOrderId: extId,
        id: extId,
        status: 'pending',
        customer_name: 'Wave DE Shop',
        lines: [{ sku: 'SS27-M-COAT-01', quantity: 4, unit_price: 42000 }],
      },
    });
    expect(importRes.ok()).toBe(true);
    const wholesaleOrderId = (
      (await importRes.json()) as { data?: { results?: Array<{ wholesaleOrderId: string }> } }
    ).data?.results?.[0]?.wholesaleOrderId;
    expect(wholesaleOrderId).toMatch(/^INT-/);

    const rfqRes = await request.post('/api/integrations/v1/centric/rfq/import', {
      data: {
        rfqId: `RFQ-${Date.now()}`,
        styleId: `CENTRIC-${PLATFORM_CORE_DEMO.demoArticleId}`,
        collectionId: PLATFORM_CORE_DEMO.collectionId,
        articleId: PLATFORM_CORE_DEMO.demoArticleId,
        b2bOrderId: wholesaleOrderId,
      },
    });
    expect(rfqRes.ok()).toBe(true);

    const procRes = await request.get(
      `/api/integrations/v1/procurement/${encodeURIComponent(wholesaleOrderId!)}`
    );
    expect(procRes.ok()).toBe(true);
    const proc = (await procRes.json()) as {
      data?: { procurement?: { centricRfq?: { rfqId: string }; isSpineImported?: boolean } };
    };
    expect(proc.data?.procurement?.isSpineImported).toBe(true);
    expect(proc.data?.procurement?.centricRfq?.rfqId).toBeTruthy();

    const deliveryRes = await request.post(
      `/api/integrations/v1/orders/${encodeURIComponent(wholesaleOrderId!)}/delivery-window`,
      { data: { label: '2026-09-15', collectionId: PLATFORM_CORE_DEMO.collectionId } }
    );
    expect(deliveryRes.ok()).toBe(true);

    const calRes = await request.get(
      `/api/workshop2/platform-core/calendar-events?collectionId=${encodeURIComponent(PLATFORM_CORE_DEMO.collectionId)}&orderId=${encodeURIComponent(wholesaleOrderId!)}`
    );
    expect(calRes.ok()).toBe(true);
    const cal = (await calRes.json()) as {
      events?: Array<{ id?: string; kind?: string; b2bOrderId?: string }>;
    };
    expect(
      cal.events?.some(
        (e) => e.kind === 'delivery_window' && e.b2bOrderId === wholesaleOrderId
      )
    ).toBe(true);

    const bomRes = await request.post('/api/integrations/v1/centric/bom/import', {
      data: {
        styleId: `CENTRIC-BOM-${PLATFORM_CORE_DEMO.demoArticleId}`,
        collectionId: PLATFORM_CORE_DEMO.collectionId,
        articleId: PLATFORM_CORE_DEMO.demoArticleId,
        lines: [{ materialName: 'Main fabric SS27', consumption: 1.8 }],
      },
    });
    expect(bomRes.ok()).toBe(true);
    const bom = (await bomRes.json()) as {
      data?: { result?: { synthaLineCount?: number; centricLineCount?: number } };
    };
    expect(bom.data?.result?.centricLineCount).toBe(1);
  });
});

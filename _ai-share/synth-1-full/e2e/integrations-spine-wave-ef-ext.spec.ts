import { test, expect } from '@playwright/test';
import { PLATFORM_CORE_DEMO } from '../src/lib/platform-core-demo-context';

test.describe('Integrations spine Wave E/F ext', () => {
  test('linesheet persist + nuorder inbound tracking import', async ({ request }) => {
    const gen = await request.post('/api/integrations/v1/linesheet/generate', {
      data: { collectionId: PLATFORM_CORE_DEMO.collectionId },
    });
    expect(gen.ok()).toBe(true);
    const genBody = (await gen.json()) as {
      data?: { linesheet?: { linesheetId?: string; articleCount?: number } };
    };
    expect(genBody.data?.linesheet?.linesheetId).toMatch(/^LS-/);

    const getSnap = await request.get(
      `/api/integrations/v1/linesheet/${encodeURIComponent(PLATFORM_CORE_DEMO.collectionId)}`
    );
    expect(getSnap.ok()).toBe(true);
    const snapBody = (await getSnap.json()) as {
      data?: { linesheet?: { linesheetId?: string } | null };
    };
    expect(snapBody.data?.linesheet?.linesheetId).toBe(genBody.data?.linesheet?.linesheetId);

    const extId = `wave-ef-nu-${Date.now()}`;
    const importRes = await request.post('/api/integrations/v1/nuorder/orders/import', {
      data: {
        externalOrderId: extId,
        id: extId,
        status: 'pending',
        customer_name: 'Inbound EF',
        lines: [{ sku: 'SS27-M-COAT-01', quantity: 2, unit_price: 42000 }],
      },
    });
    expect(importRes.ok()).toBe(true);
    const wholesaleOrderId = (
      (await importRes.json()) as { data?: { results?: Array<{ wholesaleOrderId: string }> } }
    ).data?.results?.[0]?.wholesaleOrderId;
    expect(wholesaleOrderId).toMatch(/^INT-NUORDER-/);

    const inbound = await request.post('/api/integrations/v1/nuorder/tracking/import', {
      data: { wholesaleOrderId },
    });
    expect(inbound.ok()).toBe(true);

    const trk = await request.get(
      `/api/integrations/v1/orders/${encodeURIComponent(wholesaleOrderId!)}/tracking`
    );
    expect(trk.ok()).toBe(true);
    const trkBody = (await trk.json()) as {
      data?: { shipment?: { trackingNumber?: string; platform?: string } };
    };
    expect(trkBody.data?.shipment?.platform).toBe('nuorder');
    expect(trkBody.data?.shipment?.trackingNumber).toBeTruthy();

    const queue = await request.get('/api/integrations/v1/allocation/queue?limit=5');
    expect(queue.ok()).toBe(true);
  });
});

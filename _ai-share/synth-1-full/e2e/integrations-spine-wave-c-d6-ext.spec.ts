import { test, expect } from '@playwright/test';
import { PLATFORM_CORE_DEMO } from '../src/lib/platform-core-demo-context';

test.describe('Integrations spine Wave C/D6 ext', () => {
  test('JOOR import → confirm → export + WO + handoff vendor PO', async ({ request }) => {
    const extId = `wave-ext-joor-${Date.now()}`;
    const importRes = await request.post('/api/integrations/v1/joor/orders/import', {
      data: {
        externalOrderId: extId,
        id: extId,
        status: 'pending',
        customer_name: 'Ext Shop',
        lines: [{ sku: 'SS27-M-COAT-01', quantity: 6, unit_price: 42000 }],
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

    const woRes = await request.get(
      `/api/integrations/v1/working-order/${encodeURIComponent(wholesaleOrderId!)}`
    );
    expect(woRes.ok()).toBe(true);
    const wo = (await woRes.json()) as {
      data?: { versions?: unknown[]; export?: { platform?: string } | null };
    };
    expect((wo.data?.versions?.length ?? 0) >= 1).toBe(true);
    expect(wo.data?.export?.platform).toBe('joor');

    const exportRes = await request.post('/api/integrations/v1/joor/orders/export', {
      data: { wholesaleOrderId },
    });
    expect(exportRes.ok()).toBe(true);

    await request.post(
      `/api/brand/b2b/orders/${encodeURIComponent(wholesaleOrderId!)}/confirm-production-handoff`,
      { data: {} }
    );

    const proc = await request.get(
      `/api/integrations/v1/procurement/${encodeURIComponent(wholesaleOrderId!)}`
    );
    expect(proc.ok()).toBe(true);
    const procBody = (await proc.json()) as {
      data?: { procurement?: { vendorPo?: { vendorPoId: string } } };
    };
    expect(procBody.data?.procurement?.vendorPo?.vendorPoId).toBeTruthy();

    const linesheet = await request.post('/api/integrations/v1/linesheet/generate', {
      data: { collectionId: PLATFORM_CORE_DEMO.collectionId },
    });
    expect(linesheet.ok()).toBe(true);

    const consolidated = await request.post('/api/integrations/v1/zedonk/consolidated/import', {
      data: {
        consolidatedId: `CONS-${Date.now()}`,
        brandOrders: [
          { brandId: 'agent-b1', orderId: `z-a-${Date.now()}` },
          { brandId: 'agent-b2', orderId: `z-b-${Date.now()}` },
        ],
      },
    });
    expect(consolidated.ok()).toBe(true);

    const reExport = await request.post('/api/integrations/v1/joor/orders/export', {
      data: { wholesaleOrderId, forceReexport: true },
    });
    expect(reExport.ok()).toBe(true);
    const reBody = (await reExport.json()) as {
      data?: { export?: { externalExportId?: string } };
    };
    expect(reBody.data?.export?.externalExportId).toMatch(/^EXP-/);

    const nuExt = `wave-ext-nu-${Date.now()}`;
    const nuImport = await request.post('/api/integrations/v1/nuorder/orders/import', {
      data: {
        externalOrderId: nuExt,
        id: nuExt,
        status: 'pending',
        customer_name: 'Nu Shop',
        lines: [{ sku: 'SS27-M-COAT-01', quantity: 3, unit_price: 42000 }],
      },
    });
    expect(nuImport.ok()).toBe(true);
    const nuOrderId = (
      (await nuImport.json()) as { data?: { results?: Array<{ wholesaleOrderId: string }> } }
    ).data?.results?.[0]?.wholesaleOrderId;
    expect(nuOrderId).toMatch(/^INT-NUORDER-/);

    const nuShip = await request.post('/api/integrations/v1/nuorder/tracking/sync', {
      data: {
        wholesaleOrderId: nuOrderId,
        trackingNumber: `NU-TRK-${Date.now()}`,
        carrier: 'FedEx',
        status: 'shipped',
      },
    });
    expect(nuShip.ok()).toBe(true);

    const trk = await request.get(
      `/api/integrations/v1/orders/${encodeURIComponent(nuOrderId!)}/tracking`
    );
    expect(trk.ok()).toBe(true);
    const trkBody = (await trk.json()) as {
      data?: { shipment?: { platform?: string; trackingNumber?: string } };
    };
    expect(trkBody.data?.shipment?.platform).toBe('nuorder');
    expect(trkBody.data?.shipment?.trackingNumber).toBeTruthy();
  });
});

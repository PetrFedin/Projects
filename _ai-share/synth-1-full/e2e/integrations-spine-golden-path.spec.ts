/**
 * ADR-002 · extended golden path: import → confirm → handoff → vendor PO ack →
 * materials_supplied → tracking → 5/5 chain steps.
 */
import { test, expect } from '@playwright/test';

const CHAIN_STEP_IDS = [
  'shop_sent',
  'brand_confirmed',
  'inventory_reserved',
  'production_po',
  'materials_supplied',
] as const;

test.describe('Integrations spine golden path (imported wholesale)', () => {
  test('import → confirm → handoff → chain PO', async ({ request }) => {
    const extId = `golden-joor-${Date.now()}`;
    const importRes = await request.post('/api/integrations/v1/joor/orders/import', {
      data: {
        externalOrderId: extId,
        id: extId,
        status: 'pending',
        customer_name: 'Golden Path Shop',
        lines: [{ sku: 'SS27-M-COAT-01', quantity: 10, unit_price: 42000 }],
      },
    });
    expect(importRes.ok()).toBe(true);
    const imported = (await importRes.json()) as {
      data?: { results?: Array<{ wholesaleOrderId: string }> };
    };
    const wholesaleOrderId = imported.data?.results?.[0]?.wholesaleOrderId;
    expect(wholesaleOrderId).toMatch(/^INT-JOOR-/);

    const confirmRes = await request.post(
      `/api/brand/b2b/orders/${encodeURIComponent(wholesaleOrderId!)}/confirm-order`,
      { data: {} }
    );
    expect(confirmRes.ok()).toBe(true);

    const chainAfterConfirm = await request.get(
      `/api/workshop2/b2b/orders/${encodeURIComponent(wholesaleOrderId!)}/chain-status`
    );
    expect(chainAfterConfirm.ok()).toBe(true);
    const chainAfterConfirmJson = (await chainAfterConfirm.json()) as {
      chain?: { steps?: Array<{ id: string; done: boolean }>; inventoryReserved?: boolean };
    };
    const inventoryStep = chainAfterConfirmJson.chain?.steps?.find(
      (s) => s.id === 'inventory_reserved'
    );
    expect(inventoryStep?.done).toBe(true);
    expect(chainAfterConfirmJson.chain?.inventoryReserved).toBe(true);

    const handoffRes = await request.post(
      `/api/brand/b2b/orders/${encodeURIComponent(wholesaleOrderId!)}/confirm-production-handoff`,
      { data: {} }
    );
    expect(handoffRes.ok()).toBe(true);
    const handoffJson = (await handoffRes.json()) as { productionOrderId?: string };
    expect(handoffJson.productionOrderId).toMatch(/^PO-B2B-/);

    const chainRes = await request.get(
      `/api/workshop2/b2b/orders/${encodeURIComponent(wholesaleOrderId!)}/chain-status`
    );
    expect(chainRes.ok()).toBe(true);
    const chain = (await chainRes.json()) as {
      chain?: { handedOff?: boolean; productionOrderId?: string };
    };
    expect(chain.chain?.handedOff).toBe(true);
    expect(chain.chain?.productionOrderId).toBe(handoffJson.productionOrderId);

    const shopList = await request.get('/api/b2b/v1/operational-orders', {
      headers: { 'x-syntha-api-actor-role': 'shop' },
    });
    expect(shopList.ok()).toBe(true);
    const shopJson = (await shopList.json()) as {
      data?: { orders?: Array<{ wholesaleOrderId: string; status: string }> };
    };
    const shopRow = shopJson.data?.orders?.find((o) => o.wholesaleOrderId === wholesaleOrderId);
    expect(shopRow).toBeTruthy();
    expect(shopRow?.status).toBe('confirmed');

    const commsRes = await request.get(
      `/api/messages/contextual?contextType=b2b_order&contextId=${encodeURIComponent(wholesaleOrderId!)}`
    );
    expect(commsRes.ok()).toBe(true);
    const commsJson = (await commsRes.json()) as { messages?: unknown[] };
    expect((commsJson.messages ?? []).length).toBeGreaterThanOrEqual(2);
  });

  test('full spine · vendor PO ack → materials → tracking · 5/5 steps', async ({ request }) => {
    const extId = `golden-full-${Date.now()}`;
    const importRes = await request.post('/api/integrations/v1/joor/orders/import', {
      data: {
        externalOrderId: extId,
        id: extId,
        status: 'pending',
        customer_name: 'Golden Full Chain Shop',
        lines: [{ sku: 'SS27-M-COAT-01', quantity: 8, unit_price: 42000 }],
      },
    });
    expect(importRes.ok()).toBe(true);
    const wholesaleOrderId = (
      (await importRes.json()) as { data?: { results?: Array<{ wholesaleOrderId: string }> } }
    ).data?.results?.[0]?.wholesaleOrderId;
    expect(wholesaleOrderId).toMatch(/^INT-JOOR-/);

    await request.post(
      `/api/brand/b2b/orders/${encodeURIComponent(wholesaleOrderId!)}/confirm-order`,
      { data: {} }
    );
    const handoff = await request.post(
      `/api/brand/b2b/orders/${encodeURIComponent(wholesaleOrderId!)}/confirm-production-handoff`,
      { data: {} }
    );
    expect(handoff.ok()).toBe(true);
    const poId = ((await handoff.json()) as { productionOrderId?: string }).productionOrderId;
    expect(poId).toMatch(/^PO-B2B-/);

    const procBefore = await request.get(
      `/api/integrations/v1/procurement/${encodeURIComponent(wholesaleOrderId!)}`
    );
    expect(procBefore.ok()).toBe(true);
    const vendorPoId = (
      (await procBefore.json()) as {
        data?: { procurement?: { vendorPo?: { vendorPoId: string; status: string } } };
      }
    ).data?.procurement?.vendorPo?.vendorPoId;
    expect(vendorPoId).toBeTruthy();

    const ackRes = await request.patch('/api/integrations/v1/apparel-magic/vendor-po/import', {
      data: { vendorPoId },
    });
    expect(ackRes.ok()).toBe(true);

    const chainAfterAck = await request.get(
      `/api/workshop2/b2b/orders/${encodeURIComponent(wholesaleOrderId!)}/chain-status`
    );
    expect(chainAfterAck.ok()).toBe(true);
    const chainAckJson = (await chainAfterAck.json()) as {
      chain?: {
        materialsSupplied?: boolean;
        steps?: Array<{ id: string; done: boolean }>;
      };
    };
    expect(chainAckJson.chain?.materialsSupplied).toBe(true);
    expect(
      chainAckJson.chain?.steps?.find((s) => s.id === 'materials_supplied')?.done
    ).toBe(true);

    const trackRes = await request.post('/api/integrations/v1/zedonk/tracking/sync', {
      data: {
        wholesaleOrderId,
        trackingNumber: `GOLDEN-TRK-${Date.now()}`,
        carrier: 'Syntha Logistics',
      },
    });
    expect(trackRes.ok()).toBe(true);

    const unifiedTrk = await request.get(
      `/api/integrations/v1/orders/${encodeURIComponent(wholesaleOrderId!)}/tracking`
    );
    expect(unifiedTrk.ok()).toBe(true);
    const trkBody = (await unifiedTrk.json()) as {
      data?: { shipment?: { trackingNumber?: string } };
    };
    expect(trkBody.data?.shipment?.trackingNumber).toBeTruthy();

    const chainFinal = await request.get(
      `/api/workshop2/b2b/orders/${encodeURIComponent(wholesaleOrderId!)}/chain-status`
    );
    const chainFinalJson = (await chainFinal.json()) as {
      chain?: { steps?: Array<{ id: string; done: boolean }> };
    };
    const steps = chainFinalJson.chain?.steps ?? [];
    for (const stepId of CHAIN_STEP_IDS) {
      const step = steps.find((s) => s.id === stepId);
      expect(step, `chain step ${stepId}`).toBeTruthy();
      expect(step?.done, `${stepId} done`).toBe(true);
    }

    const extRefs = await request.get(
      `/api/integrations/v1/external-refs?synthaEntityType=po&synthaEntityId=${encodeURIComponent(wholesaleOrderId!)}`
    );
    expect(extRefs.ok()).toBe(true);

    const commsRes = await request.get(
      `/api/messages/contextual?contextType=b2b_order&contextId=${encodeURIComponent(wholesaleOrderId!)}`
    );
    expect(commsRes.ok()).toBe(true);
    const commsJson = (await commsRes.json()) as { messages?: unknown[] };
    expect((commsJson.messages ?? []).length).toBeGreaterThanOrEqual(2);
  });
});

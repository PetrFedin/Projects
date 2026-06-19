import { test, expect } from '@playwright/test';

/**
 * Wave I · supplier pillar E2E: handoff → vendor PO → ack → materials_supplied in chain.
 */
test.describe('Integrations spine Wave I (supplier procurement)', () => {
  test('handoff seeds vendor PO · supplier ack flips materials_supplied', async ({ request }) => {
    const extId = `wave-i-joor-${Date.now()}`;
    const importRes = await request.post('/api/integrations/v1/joor/orders/import', {
      data: {
        externalOrderId: extId,
        id: extId,
        status: 'pending',
        customer_name: 'Supplier Spine Shop',
        lines: [{ sku: 'SS27-M-COAT-01', quantity: 4, unit_price: 42000 }],
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

    const procBefore = await request.get(
      `/api/integrations/v1/procurement/${encodeURIComponent(wholesaleOrderId!)}`
    );
    expect(procBefore.ok()).toBe(true);
    const procBeforeBody = (await procBefore.json()) as {
      data?: {
        procurement?: {
          vendorPo?: { vendorPoId: string; status: string };
          chainHandedOff?: boolean;
          chainMaterialsSupplied?: boolean;
        };
      };
    };
    expect(procBeforeBody.data?.procurement?.chainHandedOff).toBe(true);
    expect(procBeforeBody.data?.procurement?.vendorPo?.vendorPoId).toBeTruthy();
    expect(procBeforeBody.data?.procurement?.vendorPo?.status).toBe('open');
    expect(procBeforeBody.data?.procurement?.chainMaterialsSupplied).toBe(false);

    const chainBefore = await request.get(
      `/api/workshop2/b2b/orders/${encodeURIComponent(wholesaleOrderId!)}/chain-status`
    );
    expect(chainBefore.ok()).toBe(true);
    const chainBeforeBody = (await chainBefore.json()) as {
      chain?: { materialsSupplied?: boolean; steps?: Array<{ id: string; done: boolean }> };
    };
    expect(chainBeforeBody.chain?.materialsSupplied).toBe(false);
    const materialsStepBefore = chainBeforeBody.chain?.steps?.find((s) => s.id === 'materials_supplied');
    expect(materialsStepBefore?.done).toBe(false);

    const vendorPoId = procBeforeBody.data?.procurement?.vendorPo?.vendorPoId;
    const ackRes = await request.patch('/api/integrations/v1/apparel-magic/vendor-po/import', {
      data: { vendorPoId },
    });
    expect(ackRes.ok()).toBe(true);
    const ackBody = (await ackRes.json()) as {
      data?: { vendorPo?: { status: string; lines?: Array<{ ackQty?: number }> } };
    };
    expect(ackBody.data?.vendorPo?.status).toBe('acknowledged');
    expect(ackBody.data?.vendorPo?.lines?.[0]?.ackQty).toBeGreaterThan(0);

    const procAfter = await request.get(
      `/api/integrations/v1/procurement/${encodeURIComponent(wholesaleOrderId!)}`
    );
    const procAfterBody = (await procAfter.json()) as {
      data?: { procurement?: { chainMaterialsSupplied?: boolean; vendorPo?: { status: string } } };
    };
    expect(procAfterBody.data?.procurement?.vendorPo?.status).toBe('acknowledged');
    expect(procAfterBody.data?.procurement?.chainMaterialsSupplied).toBe(true);

    const chainAfter = await request.get(
      `/api/workshop2/b2b/orders/${encodeURIComponent(wholesaleOrderId!)}/chain-status`
    );
    const chainAfterBody = (await chainAfter.json()) as {
      chain?: { materialsSupplied?: boolean; steps?: Array<{ id: string; done: boolean }> };
    };
    expect(chainAfterBody.chain?.materialsSupplied).toBe(true);
    const materialsStepAfter = chainAfterBody.chain?.steps?.find((s) => s.id === 'materials_supplied');
    expect(materialsStepAfter?.done).toBe(true);
  });
});

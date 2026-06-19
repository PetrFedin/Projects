/**
 * Wave J · collection + order production pillars resolve INT-* active order.
 */
import { test, expect } from '@playwright/test';

test.describe('Integrations spine Wave J (pillar 3/4 INT-* active order)', () => {
  test('import → chain steps shop_sent/brand_confirmed · confirm flips brand_confirmed', async ({
    request,
  }) => {
    const extId = `wave-j-joor-${Date.now()}`;
    const importRes = await request.post('/api/integrations/v1/joor/orders/import', {
      data: {
        externalOrderId: extId,
        id: extId,
        status: 'pending',
        customer_name: 'Pillar J Shop',
        lines: [{ sku: 'SS27-M-COAT-01', quantity: 7, unit_price: 42000 }],
      },
    });
    expect(importRes.ok()).toBe(true);
    const wholesaleOrderId = (
      (await importRes.json()) as { data?: { results?: Array<{ wholesaleOrderId: string }> } }
    ).data?.results?.[0]?.wholesaleOrderId;
    expect(wholesaleOrderId).toMatch(/^INT-JOOR-/);

    const chainBefore = await request.get(
      `/api/workshop2/b2b/orders/${encodeURIComponent(wholesaleOrderId!)}/chain-status`
    );
    expect(chainBefore.ok()).toBe(true);
    const before = (await chainBefore.json()) as {
      chain?: { steps?: Array<{ id: string; done: boolean }> };
    };
    const shopSent = before.chain?.steps?.find((s) => s.id === 'shop_sent');
    const brandConfirmedBefore = before.chain?.steps?.find((s) => s.id === 'brand_confirmed');
    expect(shopSent?.done).toBe(true);
    expect(brandConfirmedBefore?.done).toBe(false);

    await request.post(`/api/brand/b2b/orders/${encodeURIComponent(wholesaleOrderId!)}/confirm-order`, {
      data: {},
    });

    const chainAfter = await request.get(
      `/api/workshop2/b2b/orders/${encodeURIComponent(wholesaleOrderId!)}/chain-status`
    );
    const after = (await chainAfter.json()) as {
      chain?: {
        steps?: Array<{ id: string; done: boolean }>;
        productionOrderId?: string;
        handedOff?: boolean;
      };
    };
    expect(after.chain?.steps?.find((s) => s.id === 'brand_confirmed')?.done).toBe(true);

    await request.post(
      `/api/brand/b2b/orders/${encodeURIComponent(wholesaleOrderId!)}/confirm-production-handoff`,
      { data: {} }
    );

    const chainHandoff = await request.get(
      `/api/workshop2/b2b/orders/${encodeURIComponent(wholesaleOrderId!)}/chain-status`
    );
    const handoffBody = (await chainHandoff.json()) as {
      chain?: {
        handedOff?: boolean;
        productionOrderId?: string;
        steps?: Array<{ id: string; done: boolean }>;
      };
    };
    expect(handoffBody.chain?.handedOff).toBe(true);
    expect(handoffBody.chain?.productionOrderId).toMatch(/^PO-B2B-/);
    expect(handoffBody.chain?.steps?.find((s) => s.id === 'production_po')?.done).toBe(true);

    const opListBrand = await request.get('/api/b2b/v1/operational-orders', {
      headers: { 'x-syntha-api-actor-role': 'brand' },
    });
    expect(opListBrand.ok()).toBe(true);
    const brandRows = (await opListBrand.json()) as {
      data?: { orders?: Array<{ wholesaleOrderId: string }> };
    };
    expect(
      brandRows.data?.orders?.some((o) => o.wholesaleOrderId === wholesaleOrderId)
    ).toBe(true);

    const opListShop = await request.get('/api/b2b/v1/operational-orders', {
      headers: { 'x-syntha-api-actor-role': 'shop' },
    });
    expect(opListShop.ok()).toBe(true);
    const shopRows = (await opListShop.json()) as {
      data?: { orders?: Array<{ wholesaleOrderId: string }> };
    };
    expect(shopRows.data?.orders?.some((o) => o.wholesaleOrderId === wholesaleOrderId)).toBe(true);

    const allocQueue = await request.get('/api/integrations/v1/allocation/queue?limit=5');
    expect(allocQueue.ok()).toBe(true);
    const queueBody = (await allocQueue.json()) as {
      data?: { items?: Array<{ wholesaleOrderId: string }> };
    };
    expect(
      queueBody.data?.items?.some((i) => i.wholesaleOrderId === wholesaleOrderId)
    ).toBe(true);
  });
});

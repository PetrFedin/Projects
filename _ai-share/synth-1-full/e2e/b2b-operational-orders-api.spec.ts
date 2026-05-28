import { test, expect, type APIRequestContext } from '@playwright/test';
import { b2bV1ActorBrandHeaders, b2bV1ActorShopHeaders } from './helpers/b2b-v1-api-headers';

/** После `rm -rf .next` detail-роут может временно отдавать 404, пока не соберётся chunk. */
async function getWhenOk(
  request: APIRequestContext,
  url: string,
  init?: Parameters<APIRequestContext['get']>[1]
) {
  const deadline = Date.now() + 60_000;
  let lastStatus = 0;
  while (Date.now() < deadline) {
    const res = await request.get(url, init);
    lastStatus = res.status();
    if (res.ok()) return res;
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`GET ${url} did not succeed within 60s (last status ${lastStatus})`);
}

/** Пока App Route не собран, Next может отдать HTML 404 вместо JSON из `route.ts`. */
async function getJson404WhenReady(request: APIRequestContext, url: string) {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    const res = await request.get(url);
    if (res.status() !== 404) {
      throw new Error(`Expected 404 for ${url}, got ${res.status()}`);
    }
    const ct = res.headers()['content-type'] ?? '';
    if (ct.includes('json')) return res;
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`GET ${url} did not return JSON 404 within 60s`);
}

test.describe('B2B operational orders API', () => {
  test('GET /api/b2b/operational-orders → jsonOk, meta, непустой список', async ({ request }) => {
    const res = await request.get('/api/b2b/operational-orders');
    expect(res.status()).toBe(200);
    expect(res.headers()['x-request-id']).toBeTruthy();
    const j = (await res.json()) as {
      ok?: boolean;
      data?: { orders?: { order?: string }[] };
      meta?: { requestId?: string; mode?: string };
    };
    expect(j.ok).toBe(true);
    expect(j.meta?.requestId).toBeTruthy();
    expect(['demo', 'prod']).toContain(j.meta?.mode);
    expect(Array.isArray(j.data?.orders)).toBe(true);
    expect(j.data?.orders?.length).toBeGreaterThan(0);
    expect(typeof j.data?.orders?.[0]?.order).toBe('string');
  });

  test('Tenant/Owner filtering: Brand sees only its orders', async ({ request }) => {
    const res = await request.get('/api/b2b/operational-orders', {
      headers: b2bV1ActorBrandHeaders,
    });
    const j = (await res.json()) as { data?: { orders?: { brand?: string }[] } };
    const orders = j.data?.orders || [];
    expect(orders.length).toBeGreaterThan(0);
    orders.forEach((o) => {
      expect(['Syntha', 'A.P.C.', 'Acne Studios']).toContain(o.brand);
    });
  });

  test('Tenant/Owner filtering: Shop sees only its orders', async ({ request }) => {
    const res = await request.get('/api/b2b/operational-orders', {
      headers: b2bV1ActorShopHeaders,
    });
    const j = (await res.json()) as { data?: { orders?: { shop?: string }[] } };
    const orders = j.data?.orders || [];
    expect(orders.length).toBeGreaterThan(0);
    orders.forEach((o) => {
      expect(o.shop).toMatch(/Podium|ЦУМ|Boutique/);
    });
  });

  test('GET /api/b2b/operational-orders/:id → jsonOk + order (id from list)', async ({ request }) => {
    const list = await request.get('/api/b2b/operational-orders');
    expect(list.status()).toBe(200);
    const listJson = (await list.json()) as { data?: { orders?: { order?: string }[] } };
    const firstId = listJson.data?.orders?.[0]?.order;
    expect(firstId).toBeTruthy();
    const res = await getWhenOk(
      request,
      `/api/b2b/operational-orders/${encodeURIComponent(firstId!)}`
    );
    const j = (await res.json()) as { ok?: boolean; data?: { order?: { order?: string } } };
    expect(j.ok).toBe(true);
    expect(j.data?.order?.order).toBe(firstId);
  });

  test('GET /api/b2b/operational-orders/unknown → 404 jsonError', async ({ request }) => {
    const res = await getJson404WhenReady(
      request,
      '/api/b2b/operational-orders/' + encodeURIComponent('__no-such-order__')
    );
    const j = (await res.json()) as { ok?: boolean; error?: { code?: string } };
    expect(j.ok).toBe(false);
    expect(j.error?.code).toBe('NOT_FOUND');
  });

  test('GET /api/b2b/v1/operational-orders → wholesaleOrderId + apiVersion', async ({ request }) => {
    const res = await request.get('/api/b2b/v1/operational-orders', {
      headers: b2bV1ActorBrandHeaders,
    });
    expect(res.ok()).toBeTruthy();
    const j = (await res.json()) as {
      ok?: boolean;
      meta?: { apiVersion?: string };
      data?: { orders?: { wholesaleOrderId?: string }[] };
    };
    expect(j.ok).toBe(true);
    expect(j.meta?.apiVersion).toBe('v1');
    expect(j.data?.orders?.[0]?.wholesaleOrderId).toBeTruthy();
  });

  test('GET /api/b2b/v1/operational-orders/:id → detail DTO (id from list)', async ({ request }) => {
    const list = await request.get('/api/b2b/v1/operational-orders', {
      headers: b2bV1ActorBrandHeaders,
    });
    expect(list.ok()).toBeTruthy();
    const listJson = (await list.json()) as {
      data?: { orders?: { wholesaleOrderId?: string }[] };
    };
    const wid = listJson.data?.orders?.[0]?.wholesaleOrderId;
    expect(wid).toBeTruthy();
    const res = await getWhenOk(
      request,
      `/api/b2b/v1/operational-orders/${encodeURIComponent(wid!)}`,
      { headers: b2bV1ActorBrandHeaders }
    );
    const j = (await res.json()) as {
      ok?: boolean;
      data?: { order?: { wholesaleOrderId?: string } };
    };
    expect(j.data?.order?.wholesaleOrderId).toBe(wid);
  });

  test('PATCH v1 operational-note → сохранение и отражение в GET detail', async ({ request }) => {
    const list = await request.get('/api/b2b/v1/operational-orders', {
      headers: b2bV1ActorBrandHeaders,
    });
    expect(list.ok()).toBeTruthy();
    const listJson = (await list.json()) as {
      data?: { orders?: { wholesaleOrderId?: string }[] };
    };
    const wid = listJson.data?.orders?.[0]?.wholesaleOrderId;
    expect(wid).toBeTruthy();

    const noteText = `e2e-operational-note-${Date.now()}`;
    const idem = `idem-${wid}-${noteText}`;
    const patch = await request.patch(
      `/api/b2b/v1/operational-orders/${encodeURIComponent(wid!)}/operational-note`,
      {
        data: { note: noteText },
        headers: {
          ...b2bV1ActorBrandHeaders,
          'Idempotency-Key': idem,
        },
      }
    );
    expect(patch.status()).toBe(200);
    const patchJson = (await patch.json()) as {
      ok?: boolean;
      data?: { note?: string; wholesaleOrderId?: string };
      meta?: { idempotentReplay?: boolean };
    };
    expect(patchJson.ok).toBe(true);
    expect(patchJson.data?.note).toBe(noteText);
    expect(patchJson.data?.wholesaleOrderId).toBe(wid);
    expect(patchJson.meta?.idempotentReplay).toBe(false);

    const detail = await getWhenOk(
      request,
      `/api/b2b/v1/operational-orders/${encodeURIComponent(wid!)}`,
      { headers: b2bV1ActorBrandHeaders }
    );
    const detailJson = (await detail.json()) as {
      data?: { order?: { orderNotes?: string; wholesaleOrderId?: string } };
    };
    expect(detailJson.data?.order?.wholesaleOrderId).toBe(wid);
    expect(detailJson.data?.order?.orderNotes).toBe(noteText);
  });

  test('PATCH v1 internalNote → отражение в GET detail (internalNotes)', async ({ request }) => {
    const list = await request.get('/api/b2b/v1/operational-orders', {
      headers: b2bV1ActorBrandHeaders,
    });
    expect(list.ok()).toBeTruthy();
    const listJson = (await list.json()) as {
      data?: { orders?: { wholesaleOrderId?: string }[] };
    };
    const wid = listJson.data?.orders?.[0]?.wholesaleOrderId;
    expect(wid).toBeTruthy();

    const internalText = `e2e-internal-note-${Date.now()}`;
    const idem = `idem-internal-${wid}-${internalText}`;
    const patch = await request.patch(
      `/api/b2b/v1/operational-orders/${encodeURIComponent(wid!)}/operational-note`,
      {
        data: { internalNote: internalText },
        headers: {
          ...b2bV1ActorBrandHeaders,
          'Idempotency-Key': idem,
        },
      }
    );
    expect(patch.status()).toBe(200);
    const patchJson = (await patch.json()) as {
      ok?: boolean;
      data?: { internalNote?: string; wholesaleOrderId?: string };
    };
    expect(patchJson.ok).toBe(true);
    expect(patchJson.data?.internalNote).toBe(internalText);
    expect(patchJson.data?.wholesaleOrderId).toBe(wid);

    const detail = await getWhenOk(
      request,
      `/api/b2b/v1/operational-orders/${encodeURIComponent(wid!)}`,
      { headers: b2bV1ActorBrandHeaders }
    );
    const detailJson = (await detail.json()) as {
      data?: { order?: { internalNotes?: string; wholesaleOrderId?: string } };
    };
    expect(detailJson.data?.order?.internalNotes).toBe(internalText);
    expect(detailJson.data?.order?.wholesaleOrderId).toBe(wid);
  });

  test('PATCH v1 status (brand) → GET detail+list (shop) show same status — §5.7 B2B заказ', async ({
    request,
  }) => {
    const listBrand = await request.get('/api/b2b/v1/operational-orders', {
      headers: b2bV1ActorBrandHeaders,
    });
    expect(listBrand.ok()).toBeTruthy();
    const listJson = (await listBrand.json()) as {
      data?: { orders?: { wholesaleOrderId?: string }[] };
    };
    const wid = listJson.data?.orders?.[0]?.wholesaleOrderId;
    expect(wid).toBeTruthy();

    const newStatus = `Подтверждён брендом (e2e ${Date.now()})`;
    const idem = `status-${wid}-${Date.now()}`;
    const patch = await request.patch(
      `/api/b2b/v1/operational-orders/${encodeURIComponent(wid!)}/status`,
      {
        data: { status: newStatus },
        headers: {
          ...b2bV1ActorBrandHeaders,
          'Idempotency-Key': idem,
        },
      }
    );
    expect(patch.ok()).toBeTruthy();
    const patchJson = (await patch.json()) as {
      ok?: boolean;
      data?: { status?: string; wholesaleOrderId?: string };
    };
    expect(patchJson.ok).toBe(true);
    expect(patchJson.data?.status).toBe(newStatus);

    const detailShop = await getWhenOk(
      request,
      `/api/b2b/v1/operational-orders/${encodeURIComponent(wid!)}`,
      { headers: b2bV1ActorShopHeaders }
    );
    const detailShopJson = (await detailShop.json()) as {
      data?: { order?: { status?: string; wholesaleOrderId?: string } };
    };
    expect(detailShopJson.data?.order?.wholesaleOrderId).toBe(wid);
    expect(detailShopJson.data?.order?.status).toBe(newStatus);

    const listShop = await request.get('/api/b2b/v1/operational-orders', {
      headers: b2bV1ActorShopHeaders,
    });
    expect(listShop.ok()).toBeTruthy();
    const listShopJson = (await listShop.json()) as {
      data?: { orders?: { wholesaleOrderId?: string; status?: string }[] };
    };
    const row = listShopJson.data?.orders?.find((o) => o.wholesaleOrderId === wid);
    expect(row?.status).toBe(newStatus);
  });
});

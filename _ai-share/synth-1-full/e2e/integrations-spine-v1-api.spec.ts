import { test, expect, type APIRequestContext } from '@playwright/test';

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

test.describe('Integrations spine v1 API (ADR-002 Wave A/C)', () => {
  test('GET /api/integrations/v1/status → connectors + meta v1', async ({ request }) => {
    const res = await getWhenOk(request, '/api/integrations/v1/status');
    const j = (await res.json()) as {
      ok?: boolean;
      data?: {
        connectors?: Array<{ id: string; platform: string }>;
        hub?: { inboundShipmentWebhookPath?: string };
      };
      meta?: { apiVersion?: string };
    };
    expect(j.ok).toBe(true);
    expect(j.meta?.apiVersion).toBe('v1');
    expect(j.data?.connectors?.some((c) => c.id === 'joor')).toBe(true);
    expect(j.data?.hub?.inboundShipmentWebhookPath).toBe('/api/integrations/v1/webhooks/shipment');
  });

  test('POST joor import → appears in operational-orders v1 with integration meta', async ({
    request,
  }) => {
    const extId = `e2e-joor-${Date.now()}`;
    const importRes = await request.post('/api/integrations/v1/joor/orders/import', {
      data: {
        externalOrderId: extId,
        id: extId,
        status: 'pending',
        customer_name: 'E2E Shop',
        lines: [{ sku: 'SS27-M-COAT-01', quantity: 5, unit_price: 42000 }],
      },
    });
    expect(importRes.ok()).toBe(true);
    const imported = (await importRes.json()) as {
      data?: { results?: Array<{ wholesaleOrderId: string; created: boolean }> };
    };
    const wholesaleOrderId = imported.data?.results?.[0]?.wholesaleOrderId;
    expect(wholesaleOrderId).toBeTruthy();

    const listRes = await getWhenOk(request, '/api/b2b/v1/operational-orders', {
      headers: { 'x-syntha-api-actor-role': 'brand' },
    });
    const list = (await listRes.json()) as {
      data?: {
        orders?: Array<{
          wholesaleOrderId: string;
          integration?: { externalOrderId?: string; sourcePlatform?: string };
        }>;
      };
    };
    const row = list.data?.orders?.find((o) => o.wholesaleOrderId === wholesaleOrderId);
    expect(row).toBeTruthy();
    expect(row?.integration?.externalOrderId).toBe(extId);
    expect(row?.integration?.sourcePlatform).toBe('joor');
  });

  test('GET nuorder inventory → F-NU-ATS demo cells', async ({ request }) => {
    const res = await getWhenOk(request, '/api/integrations/v1/nuorder/inventory');
    const j = (await res.json()) as { data?: { items?: Array<{ sku: string; ats: number }> } };
    expect(j.data?.items?.length).toBeGreaterThan(0);
    expect(j.data?.items?.[0]?.ats).toBeGreaterThan(0);
  });

  test('GET eligible gate for SS27 demo article', async ({ request }) => {
    const res = await getWhenOk(
      request,
      '/api/integrations/v1/articles/SS27/demo-ss27-01/eligible'
    );
    const j = (await res.json()) as {
      data?: { eligibleForCollection?: boolean; reasons?: string[] };
    };
    expect(typeof j.data?.eligibleForCollection).toBe('boolean');
    expect(Array.isArray(j.data?.reasons)).toBe(true);
  });

  test('POST centric style import → eligible when Approved', async ({ request }) => {
    const res = await request.post('/api/integrations/v1/centric/styles/import', {
      data: {
        styleId: 'CENTRIC-E2E-1',
        articleId: 'demo-ss27-e2e-centric',
        lifecycleState: 'Approved',
      },
    });
    expect(res.ok()).toBe(true);
    const gate = await getWhenOk(
      request,
      '/api/integrations/v1/articles/SS27/demo-ss27-e2e-centric/eligible'
    );
    const j = (await gate.json()) as { data?: { eligibleForCollection?: boolean } };
    expect(j.data?.eligibleForCollection).toBe(true);
  });

  test('PATCH v1 confirmed ≡ spine confirm for INT-* (allocation step)', async ({ request }) => {
    const extId = `e2e-patch-confirm-${Date.now()}`;
    const importRes = await request.post('/api/integrations/v1/joor/orders/import', {
      data: {
        externalOrderId: extId,
        id: extId,
        status: 'pending',
        customer_name: 'PATCH Confirm Shop',
        lines: [{ sku: 'SS27-M-COAT-01', quantity: 4, unit_price: 42000 }],
      },
    });
    expect(importRes.ok()).toBe(true);
    const wholesaleOrderId = (
      (await importRes.json()) as { data?: { results?: Array<{ wholesaleOrderId: string }> } }
    ).data?.results?.[0]?.wholesaleOrderId;
    expect(wholesaleOrderId).toMatch(/^INT-JOOR-/);

    const patch = await request.patch(
      `/api/b2b/v1/operational-orders/${encodeURIComponent(wholesaleOrderId!)}/status`,
      {
        data: { status: 'confirmed' },
        headers: {
          'x-syntha-api-actor-role': 'brand',
          'Idempotency-Key': `patch-confirm-${wholesaleOrderId}-${Date.now()}`,
        },
      }
    );
    expect(patch.ok()).toBe(true);
    const patchJson = (await patch.json()) as {
      data?: { spineConfirmed?: boolean; status?: string };
    };
    expect(patchJson.data?.spineConfirmed).toBe(true);

    const chain = await request.get(
      `/api/workshop2/b2b/orders/${encodeURIComponent(wholesaleOrderId!)}/chain-status`
    );
    expect(chain.ok()).toBe(true);
    const chainJson = (await chain.json()) as {
      chain?: { steps?: Array<{ id: string; done: boolean }>; inventoryReserved?: boolean };
    };
    expect(chainJson.chain?.inventoryReserved).toBe(true);
    expect(
      chainJson.chain?.steps?.find((s) => s.id === 'brand_confirmed')?.done
    ).toBe(true);
    expect(
      chainJson.chain?.steps?.find((s) => s.id === 'inventory_reserved')?.done
    ).toBe(true);
  });

  test('import enqueues completed sync-job with lifecycle fields', async ({ request }) => {
    const extId = `e2e-sync-job-${Date.now()}`;
    await request.post('/api/integrations/v1/joor/orders/import', {
      data: {
        externalOrderId: extId,
        id: extId,
        status: 'pending',
        customer_name: 'Sync Job Shop',
        lines: [{ sku: 'SS27-M-COAT-01', quantity: 2, unit_price: 42000 }],
      },
    });
    const jobsRes = await getWhenOk(request, '/api/integrations/v1/sync-jobs?limit=5');
    const jobsJson = (await jobsRes.json()) as {
      data?: {
        jobs?: Array<{
          status: string;
          kind: string;
          startedAt?: string;
          finishedAt?: string;
        }>;
      };
    };
    const job = jobsJson.data?.jobs?.find((j) => j.kind === 'orders_import');
    expect(job?.status).toBe('completed');
    expect(job?.startedAt).toBeTruthy();
    expect(job?.finishedAt).toBeTruthy();
  });

  test('POST sync-jobs process picks up queued jobs', async ({ request }) => {
    const enqueue = await request.post('/api/integrations/v1/sync-jobs', {
      data: { platform: 'syntha', kind: 'working_order' },
    });
    expect(enqueue.ok()).toBe(true);
    const queued = ((await enqueue.json()) as { data?: { job?: { id: string; status: string } } })
      .data?.job;
    expect(queued?.status).toBe('queued');

    const process = await request.post('/api/integrations/v1/sync-jobs', {
      data: { process: true, limit: 5 },
    });
    expect(process.ok()).toBe(true);
    const processed = (await process.json()) as {
      data?: { processed?: Array<{ id: string; status: string }> };
    };
    expect((processed.data?.processed?.length ?? 0) > 0).toBe(true);
    expect(processed.data?.processed?.some((j) => j.id === queued?.id && j.status === 'completed')).toBe(
      true
    );
  });
});

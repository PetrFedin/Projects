import { test, expect, type APIRequestContext } from '@playwright/test';

async function postWhenOk(
  request: APIRequestContext,
  url: string,
  options: Parameters<APIRequestContext['post']>[1]
) {
  const deadline = Date.now() + 60_000;
  let lastStatus = 0;
  while (Date.now() < deadline) {
    const res = await request.post(url, options);
    lastStatus = res.status();
    if (res.ok()) return res;
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`POST ${url} did not succeed within 60s (last status ${lastStatus})`);
}

test.describe('B2B export-order API', () => {
  test('POST platform export and idempotent replay share exportJobId', async ({ request }) => {
    const idem = `e2e-idem-${Date.now()}`;
    const orderIdFirst = `e2e-ord-${Date.now()}-a`;
    const orderIdSecond = `e2e-ord-${Date.now()}-b`;

    const res1 = await postWhenOk(request, '/api/b2b/export-order', {
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idem,
      },
      data: { provider: 'platform', payload: { orderId: orderIdFirst } },
    });
    expect(res1.status()).toBe(200);
    const j1 = (await res1.json()) as { success?: boolean; exportJobId?: string; orderId?: string };
    expect(j1.success).toBe(true);
    expect(j1.exportJobId).toBeTruthy();
    expect(j1.orderId).toBe(orderIdFirst);

    const res2 = await postWhenOk(request, '/api/b2b/export-order', {
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idem,
      },
      data: { provider: 'platform', payload: { orderId: orderIdSecond } },
    });
    expect(res2.status()).toBe(200);
    const j2 = (await res2.json()) as { exportJobId?: string; orderId?: string };
    expect(j2.exportJobId).toBe(j1.exportJobId);
    expect(j2.orderId).toBe(orderIdFirst);
  });

  test('POST export-order/retry after simulateReject can accept', async ({ request }) => {
    const idem = `e2e-retry-${Date.now()}`;
    const orderId = `e2e-retry-ord-${Date.now()}`;

    const res1 = await postWhenOk(request, '/api/b2b/export-order', {
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idem,
      },
      data: { provider: 'platform', payload: { orderId }, simulateReject: true },
    });
    const j1 = (await res1.json()) as { success?: boolean; exportJobId?: string; status?: string };
    expect(j1.success).toBe(false);
    expect(j1.exportJobId).toBeTruthy();

    const res2 = await postWhenOk(request, '/api/b2b/export-order/retry', {
      headers: { 'Content-Type': 'application/json' },
      data: { exportJobId: j1.exportJobId, simulateReject: false },
    });
    const j2 = (await res2.json()) as { success?: boolean; status?: string; orderId?: string };
    expect(j2.success).toBe(true);
    expect(j2.status).toBe('accepted');
    expect(j2.orderId).toBe(orderId);
  });
});

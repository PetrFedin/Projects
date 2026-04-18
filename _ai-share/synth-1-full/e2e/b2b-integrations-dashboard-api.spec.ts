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

test.describe('B2B integrations dashboard API', () => {
  test('GET /api/b2b/integrations/dashboard → integrations + catalog + assembledAt', async ({ request }) => {
    const res = await getWhenOk(request, '/api/b2b/integrations/dashboard');
    expect(res.status()).toBe(200);
    expect(res.headers()['x-request-id']).toBeTruthy();
    const j = (await res.json()) as {
      integrations?: unknown[];
      catalog?: {
        productCount?: number;
        orderCount?: number;
        source?: string;
        catalogSource?: string;
      };
      assembledAt?: string;
    };
    expect(Array.isArray(j.integrations)).toBe(true);
    expect(j.integrations!.length).toBeGreaterThan(0);
    expect(typeof j.catalog?.productCount).toBe('number');
    expect(typeof j.catalog?.orderCount).toBe('number');
    expect(j.catalog?.source).toBe('platform');
    expect(j.catalog?.catalogSource).toBe('inline-products-operational-b2b-list');
    expect(typeof j.assembledAt).toBe('string');
    expect(j.assembledAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  test('GET /api/b2b/integrations/dashboard?brandId=demo → brandId в catalog', async ({ request }) => {
    const res = await getWhenOk(request, '/api/b2b/integrations/dashboard?brandId=demo-brand-e2e');
    expect(res.status()).toBe(200);
    const j = (await res.json()) as { catalog?: { brandId?: string } };
    expect(j.catalog?.brandId).toBe('demo-brand-e2e');
  });
});

import { test, expect, type APIRequestContext } from '@playwright/test';

async function getWhenStatus(
  request: APIRequestContext,
  url: string,
  status: number,
  init?: Parameters<APIRequestContext['get']>[1]
) {
  const deadline = Date.now() + 60_000;
  let last = 0;
  while (Date.now() < deadline) {
    const res = await request.get(url, init);
    last = res.status();
    if (last === status) return res;
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`GET ${url} did not return HTTP ${status} within 60s (last ${last})`);
}

test.describe('Domain events ops health API', () => {
  test('GET /api/ops/domain-events/health requires auth and returns contract payload', async ({
    request,
  }) => {
    const unauthorized = await getWhenStatus(request, '/api/ops/domain-events/health', 401);
    expect(unauthorized.headers()['x-request-id']).toBeTruthy();

    const secret = process.env.DOMAIN_EVENT_HEALTH_SECRET || 'e2e-domain-health-secret';
    const authorized = await getWhenStatus(request, '/api/ops/domain-events/health', 200, {
      headers: {
        authorization: `Bearer ${secret}`,
      },
    });

    expect(authorized.headers()['x-request-id']).toBeTruthy();
    expect(authorized.headers()['x-domain-events-health-contract-version']).toBe('v1');

    const json = (await authorized.json()) as Record<string, unknown>;
    expect(json.contractVersion).toBe('v1');
    expect(typeof json.ok).toBe('boolean');
    expect(typeof json.status).toBe('string');
    expect(typeof json.summaryCode).toBe('string');
    expect(typeof json.summary).toBe('string');
    expect(Array.isArray(json.alerts)).toBe(true);
    expect(Array.isArray(json.degradedReasons)).toBe(true);
    expect(Array.isArray(json.recommendations)).toBe(true);
    expect(typeof json.thresholds).toBe('object');
    expect(typeof json.bus).toBe('object');
    expect(typeof json.outbox).toBe('object');
    expect(typeof json.requestId).toBe('string');
  });
});

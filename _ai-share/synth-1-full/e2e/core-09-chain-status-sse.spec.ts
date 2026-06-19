import { test, expect } from '@playwright/test';

const DEMO_ORDER = 'B2B-DEMO-SHOP1-SS27';

test.describe('core-09: chain-status SSE honesty', () => {
  test('health: chainStatusSseMode и redisConfigured', async ({ request }) => {
    const res = await request.get('/api/workshop2/platform-core/health');
    expect(res.ok()).toBeTruthy();
    const json = (await res.json()) as {
      ok?: boolean;
      coreMode?: boolean;
      redisConfigured?: boolean;
      chainStatusSseMode?: string;
    };
    expect(json.ok).toBe(true);
    expect(json.coreMode).toBe(true);
    expect(typeof json.redisConfigured).toBe('boolean');
    const expectedMode = process.env.REDIS_URL?.trim() ? 'poll+bump+redis' : 'poll+bump';
    expect(json.chainStatusSseMode).toBe(expectedMode);
    expect(json.redisConfigured).toBe(expectedMode === 'poll+bump+redis');
  });

  test('chain-status-stream: SSE заголовок согласован с health', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { chainStatusSseMode?: string; demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap для demo order');

    await page.goto('/platform');

    const streamUrl = `/api/workshop2/b2b/orders/chain-status-stream?orderIds=${encodeURIComponent(DEMO_ORDER)}`;
    const sseHeader = await page.evaluate(async (url) => {
      const ac = new AbortController();
      const timer = window.setTimeout(() => ac.abort(), 10_000);
      try {
        const res = await fetch(url, { signal: ac.signal });
        return {
          ok: res.ok,
          contentType: res.headers.get('content-type'),
          sseMode: res.headers.get('x-platform-core-chain-sse'),
        };
      } catch {
        return null;
      } finally {
        window.clearTimeout(timer);
      }
    }, streamUrl);

    expect(sseHeader?.ok).toBe(true);
    expect(sseHeader?.contentType).toContain('text/event-stream');
    expect(sseHeader?.sseMode).toBe(health.chainStatusSseMode);
  });
});

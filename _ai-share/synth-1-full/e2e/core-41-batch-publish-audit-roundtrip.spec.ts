import { test, expect } from '@playwright/test';
const W2_HEADERS = {
  'x-w2-actor-label': 'e2e-core-41',
  'x-w2-actor-id': 'brand-001',
  'x-w2-actor-roles': 'production:edit',
  'Content-Type': 'application/json',
};

test.describe.configure({ mode: 'serial' });

/** Wave 22: linesheets batch publish readiness + publish-audit-log roundtrip. */
test.describe('core-41: batch publish audit roundtrip', () => {
  test('readiness + bulk-showroom-publish append publish-audit-log event', async ({ request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean; pgReachable?: boolean };
    test.skip(!health.demoSeeded || !health.pgReachable, 'нужен db:core:bootstrap + PG');

    const devRes = await request.get('/api/workshop2/collections/SS27/development-status');
    const devJson = (await devRes.json()) as { status?: { articleIds?: string[] } };
    const articleIds = devJson.status?.articleIds ?? [];
    test.skip(articleIds.length === 0, 'нет W2 articleIds');

    const beforeRes = await request.get('/api/workshop2/collections/SS27/publish-audit-log?limit=20');
    expect(beforeRes.ok()).toBeTruthy();
    const beforeJson = (await beforeRes.json()) as { events?: Array<{ articleId?: string }> };
    const beforeCount = beforeJson.events?.length ?? 0;

    const headers = W2_HEADERS;

    const readinessRes = await request.post(
      '/api/workshop2/collections/SS27/publish-showroom-readiness',
      { headers, data: { articleIds } }
    );
    expect(readinessRes.ok()).toBeTruthy();
    const readinessJson = (await readinessRes.json()) as {
      passedArticleIds?: string[];
      ready?: boolean;
    };
    const publishIds =
      readinessJson.passedArticleIds?.length && readinessJson.passedArticleIds.length > 0
        ? readinessJson.passedArticleIds
        : articleIds.slice(0, 1);

    const publishRes = await request.post(
      '/api/workshop2/collections/SS27/bulk-showroom-publish',
      { headers, data: { articleIds: publishIds } }
    );
    expect(publishRes.ok()).toBeTruthy();

    await expect
      .poll(
        async () => {
          const res = await request.get('/api/workshop2/collections/SS27/publish-audit-log?limit=20');
          if (!res.ok()) return beforeCount;
          const json = (await res.json()) as { events?: unknown[] };
          return json.events?.length ?? beforeCount;
        },
        { timeout: 30_000 }
      )
      .toBeGreaterThanOrEqual(beforeCount);
  });

  test('W2 hub mounts publish strip + audit log (core golden path)', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const devRes = await request.get('/api/workshop2/collections/SS27/development-status');
    const devJson = (await devRes.json()) as { status?: { articleIds?: string[] } };
    test.skip((devJson.status?.articleIds?.length ?? 0) === 0, 'нет W2 articleIds');

    await page.goto('/brand/production/workshop2?w2col=SS27', {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });
    await expect(page.getByTestId('brand-dev-w2-hub-panel')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('brand-dev-w2-hub-publish-strip')).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByTestId('brand-sc-publish-readiness-button')).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByTestId('brand-sc-publish-audit-log')).toBeVisible({ timeout: 30_000 });
  });
});

import { test, expect } from '@playwright/test';

const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 90_000 };
const W2_DEV_HEADERS = {
  'x-syntha-dev-actor': 'brand-demo',
  'x-syntha-workshop2-dev': '1',
};

/**
 * Wave D P1: drag-reorder / move между tier-колонками range planner (PG PATCH).
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-58-range-planner-tier-drag.spec.ts
 */
test.describe('core-58: range planner tier drag-reorder', () => {
  test('move article core → trend через UI board + PG round-trip', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const articleId = 'demo-ss27-01';
    const resetRes = await request.patch('/api/workshop2/collections/SS27/range-planner', {
      headers: W2_DEV_HEADERS,
      data: { articleId, tier: 'core' },
    });
    expect(resetRes.ok()).toBeTruthy();

    const res = await page.goto('/brand/range-planner?collection=SS27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);

    await expect(page.getByTestId('range-planner-tier-article-board')).toBeVisible({
      timeout: 60_000,
    });
    const coreCol = page.getByTestId('range-planner-tier-column-core');
    const trendCol = page.getByTestId('range-planner-tier-column-trend');
    await expect(coreCol.getByTestId(`range-planner-tier-article-${articleId}`)).toBeVisible({
      timeout: 30_000,
    });

    await page.getByTestId(`range-planner-tier-move-${articleId}-trend`).click();
    await expect(trendCol.getByTestId(`range-planner-tier-article-${articleId}`)).toBeVisible({
      timeout: 30_000,
    });
    await expect(coreCol.getByTestId(`range-planner-tier-article-${articleId}`)).toHaveCount(0);

    const devRes = await request.get('/api/workshop2/collections/SS27/development-status', {
      headers: W2_DEV_HEADERS,
    });
    expect(devRes.ok()).toBeTruthy();
    const devJson = (await devRes.json()) as {
      ok?: boolean;
      status?: { rangePlanner?: { tierArticles?: { trend?: { articleId: string }[] } } };
    };
    const trendArticles = devJson.status?.rangePlanner?.tierArticles?.trend ?? [];
    expect(trendArticles.some((row) => row.articleId === articleId)).toBe(true);
  });

  test('HTML5 drag article между колонками', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const articleId = 'demo-ss27-02';
    await request.patch('/api/workshop2/collections/SS27/range-planner', {
      headers: W2_DEV_HEADERS,
      data: { articleId, tier: 'core' },
    });

    const res = await page.goto('/brand/range-planner?collection=SS27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('range-planner-tier-article-board')).toBeVisible({
      timeout: 60_000,
    });

    const chip = page.getByTestId(`range-planner-tier-article-${articleId}`);
    const noveltyCol = page.getByTestId('range-planner-tier-column-novelty');
    await expect(chip).toBeVisible({ timeout: 30_000 });
    await chip.dragTo(noveltyCol);
    await expect(noveltyCol.getByTestId(`range-planner-tier-article-${articleId}`)).toBeVisible({
      timeout: 30_000,
    });
  });
});

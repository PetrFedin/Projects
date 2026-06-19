import { test, expect } from '@playwright/test';
import { checkoutPgOrderViaMatrix } from './helpers/core-checkout-pg';

test.describe.configure({ mode: 'serial' });

/** Hub chain strip, neutral overview labels, linesheets batch publish, bulk import testid. */
test.describe('core-28: hub chain + linesheet batch + cache bust', () => {
  test('hub shows chain flow strip without B2B-DEMO in pillar details', async ({
    page,
    request,
  }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = await checkoutPgOrderViaMatrix(page);

    const overviewRes = await request.get(
      `/api/workshop2/platform-core/chain-overview?collectionId=SS27`
    );
    const overviewJson = (await overviewRes.json()) as {
      overview?: { pillars?: Array<{ id: string; detailRu: string }> };
    };
    const coPillar = overviewJson.overview?.pillars?.find((p) => p.id === 'collection_order');
    expect(coPillar?.detailRu).toBeTruthy();
    expect(coPillar?.detailRu).not.toMatch(/B2B-DEMO/);
    expect(coPillar?.detailRu).toMatch(/SS27|PG|submitted|confirmed/i);

    await page.goto('/platform?collection=SS27', {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });
    await expect(page.getByTestId('platform-core-business-overview')).toHaveCount(0);
    await page.getByTestId('role-block-brand').click();
    await expect(page.getByTestId('platform-core-business-overview')).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByTestId('hub-pillar-collection_order')).toBeVisible();

    expect(orderId).toMatch(/^B2B-\d+$/);
  });

  test('linesheets batch publish panel mounts with readiness controls', async ({
    page,
    request,
  }) => {
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
    await expect(page.getByTestId('brand-sc-publish-readiness-button')).toBeVisible();
  });

  test('W2 hub exposes bulk import entry', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    await page.goto('/brand/production/workshop2?w2col=SS27', {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });
    await expect(page.getByTestId('brand-dev-w2-hub-panel')).toBeVisible({ timeout: 60_000 });
    await page.getByTestId('brand-w2-create-article-btn').scrollIntoViewIfNeeded();
    const bulkBtn = page.getByTestId('brand-w2-bulk-import-btn');
    await expect(bulkBtn.first()).toBeVisible({ timeout: 30_000 });
  });
});

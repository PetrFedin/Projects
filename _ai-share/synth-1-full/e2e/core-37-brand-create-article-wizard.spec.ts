import { test, expect } from '@playwright/test';

const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 60_000 };

/** Wave 20: brand×dev — UI create-article wizard round-trip (PG on golden SS27). */
test.describe('core-37: brand create-article wizard', () => {
  test('W2 dialog creates article and navigates to dossier', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const sku = `E2E-CREATE-${Date.now()}`;

    await page.goto('/brand/production/workshop2?w2col=SS27', GOTO);
    await expect(page.getByTestId('brand-dev-w2-hub-panel')).toBeVisible({ timeout: 60_000 });

    await page.getByTestId('brand-w2-create-article-btn').click();
    await expect(page.getByTestId('brand-w2-create-article-dialog')).toBeVisible({
      timeout: 15_000,
    });

    await page.getByTestId('brand-w2-create-article-sku').fill(sku);
    await page.getByTestId('brand-w2-create-article-name').fill('E2E create article wizard');

    await page.getByTestId('brand-w2-create-article-cat-search').fill('плать');
    const catPick = page.locator('[data-testid="brand-w2-create-article-dialog"] button').filter({
      hasText: /плать/i,
    });
    await expect(catPick.first()).toBeVisible({ timeout: 15_000 });
    await catPick.first().click();

    const navPromise = page.waitForURL(/\/brand\/production\/workshop2\/c\/SS27\/a\//, {
      timeout: 60_000,
    });
    await page.getByTestId('brand-w2-create-article-submit').click();
    await navPromise;

    await expect(page.getByTestId('brand-dev-dossier-panel')).toBeVisible({ timeout: 60_000 });

    const statusRes = await request.get('/api/workshop2/collections/SS27/development-status');
    expect(statusRes.ok()).toBe(true);
    const statusJson = (await statusRes.json()) as {
      ok?: boolean;
      status?: { articleIds?: string[] };
    };
    expect(statusJson.ok).toBe(true);
    expect((statusJson.status?.articleIds ?? []).length).toBeGreaterThan(0);
  });
});

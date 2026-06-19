import { test, expect } from '@playwright/test';

const GOTO = { waitUntil: 'commit' as const, timeout: 120_000 };

/** Wave 28: brand×co PG collections registry + retailers tier from PG. */
test.describe('core-47: PG collections + retailers tier', () => {
  test('PG collections API returns SS27 after bootstrap', async ({ request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const res = await request.get('/api/workshop2/collections');
    expect(res.ok()).toBeTruthy();
    const json = (await res.json()) as {
      ok?: boolean;
      collections?: Array<{ id: string; displayName: string }>;
    };
    expect(json.ok).toBe(true);
    const ids = (json.collections ?? []).map((c) => c.id);
    expect(ids).toContain('SS27');
  });

  test('registry shows PG collections badge and filter includes SS27', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const res = await page.goto('/brand/b2b-orders?collection=SS27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('brand-co-registry-panel')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('brand-co-registry-pg-collections-badge')).toBeVisible({
      timeout: 30_000,
    });
    const filter = page.getByTestId('brand-co-registry-collection-filter');
    await expect(filter).toBeVisible();
    await expect(filter.locator('option[value="SS27"]')).toHaveCount(1);
  });

  test('retailers page shows PG tier badge for active partner', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const summaryRes = await request.get('/api/brand/retailers/b2b-orders-summary');
    const summary = (await summaryRes.json()) as { rows?: Array<{ retailerId: string }> };
    test.skip(!summary.rows?.length, 'нет W2 заказов для tier badge');

    const retailerId = summary.rows![0]!.retailerId;
    const res = await page.goto('/brand/retailers?collection=SS27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('brand-co-retailers-panel')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId(`retailer-tier-badge-${retailerId}`)).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByTestId(`retailer-tier-badge-${retailerId}`)).toHaveAttribute(
      'data-tier-source',
      'pg'
    );
  });
});

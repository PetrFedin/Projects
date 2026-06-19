import { test, expect } from '@playwright/test';

const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 90_000 };

/**
 * Prebook (tier=prebook) — e2e при наличии seed в PG; иначе честный skip.
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-51-prebook-registry.spec.ts
 */
test.describe('core-51: prebook registry when seeded', () => {
  test('brand registry row: badge «Предзаказ» для tier=prebook', async ({ request, page }) => {
    const apiRes = await request.get('/api/brand/b2b/orders?collectionId=SS27');
    test.skip(!apiRes.ok(), 'brand b2b orders API недоступен');
    const json = (await apiRes.json()) as {
      orders?: Array<{ id: string; tier?: string }>;
    };
    const prebook = json.orders?.find((o) => o.tier === 'prebook');
    test.skip(!prebook?.id, 'нет prebook seed в PG — добавьте tier=prebook в bootstrap');

    const res = await page.goto(
      `/brand/b2b-orders?collection=SS27&order=${encodeURIComponent(prebook.id)}`,
      GOTO
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('brand-co-registry-panel')).toBeVisible({ timeout: 90_000 });
    await expect(page.getByTestId(`brand-b2b-order-detail-${prebook.id}`)).toBeVisible({
      timeout: 30_000,
    });
    await expect(
      page.getByTestId('brand-co-registry-focus-row').getByText('Предзаказ', { exact: true })
    ).toBeVisible({ timeout: 15_000 });
  });

  test('brand order detail: prebook badge на карточке', async ({ request, page }) => {
    const apiRes = await request.get('/api/brand/b2b/orders?collectionId=SS27');
    test.skip(!apiRes.ok(), 'brand b2b orders API недоступен');
    const json = (await apiRes.json()) as {
      orders?: Array<{ id: string; tier?: string }>;
    };
    const prebook = json.orders?.find((o) => o.tier === 'prebook');
    test.skip(!prebook?.id, 'нет prebook seed в PG');

    const res = await page.goto(`/brand/b2b-orders/${encodeURIComponent(prebook.id)}`, GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('platform-core-order-detail-chrome')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByText('Предзаказ', { exact: true })).toBeVisible({ timeout: 15_000 });
  });

  test('brand pre-orders URL: redirect на реестр B2B', async ({ page }) => {
    const res = await page.goto('/brand/pre-orders?collection=SS27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page).toHaveURL(/\/brand\/b2b-orders/, { timeout: 90_000 });
    await expect(page.getByTestId('brand-co-registry-panel')).toBeVisible({ timeout: 90_000 });
  });
});

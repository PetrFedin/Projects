import { test, expect } from '@playwright/test';
import { gotoRoleCoreCabinet } from './helpers/core-chain-overview';

const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 60_000 };

test.describe('core-26: brand export PG + FW27 dev + sample audit path', () => {
  test('brand registry PG export API returns CSV', async ({ request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const res = await request.get('/api/brand/b2b/orders/export?collectionId=SS27');
    expect(res.ok()).toBeTruthy();
    expect(res.headers()['content-type']).toContain('text/csv');
    expect(res.headers()['x-platform-core-export-kind']).toBe('brand_registry');
    const body = await res.text();
    expect(body.split('\n')[0]).toContain('productionOrderId');
  });

  test('brand registry UI has Export PG link', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const res = await page.goto('/brand/b2b/orders?collection=SS27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('brand-co-registry-panel')).toBeVisible({ timeout: 60_000 });
    const exportPg = page.getByTestId('brand-co-registry-export-pg');
    if ((await exportPg.count()) > 0) {
      await expect(exportPg).toBeVisible();
      await expect(exportPg).toHaveAttribute('href', /\/api\/brand\/b2b\/orders\/export/);
    }
  });

  test('brand sample unified audit path strip', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const res = await gotoRoleCoreCabinet(page, '/brand/core?pillar=sample_collection&collection=SS27');
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('brand-sc-unified-audit-path')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('brand-sc-audit-path-linesheet')).toBeVisible();
    await expect(page.getByTestId('brand-sc-audit-path-shop-matrix')).toHaveAttribute('href', /collection=SS27/);
  });

  test('FW27 hub shows dev-only investor banner', async ({ page }) => {
    const res = await page.goto('/platform?collection=FW27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('platform-core-fw27-dev-banner')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId('platform-core-fw27-dev-banner-ss27-link')).toHaveAttribute(
      'href',
      /collection=SS27/
    );
  });

  test('FW27 matrix shows dev-only notice when empty', async ({ page }) => {
    const res = await page.goto('/shop/b2b/matrix?collection=FW27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('shop-co-matrix-shell')).toBeVisible({ timeout: 60_000 });
    const notice = page.getByTestId('shop-co-matrix-fw27-dev-notice');
    if ((await notice.count()) > 0) {
      await expect(notice).toContainText(/FW27|dev-only|SS27/i);
    }
  });
});

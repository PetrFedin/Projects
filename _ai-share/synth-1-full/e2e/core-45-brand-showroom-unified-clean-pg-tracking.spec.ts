import { test, expect } from '@playwright/test';

const GOTO = { waitUntil: 'commit' as const, timeout: 120_000 };

/** Wave 26: brand×sample unified audit on full showroom page (cabinet уже в core-26). */
test.describe('core-45: brand showroom unified audit path', () => {
  test('brand full showroom page has unified audit path strip', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const res = await page.goto('/brand/showroom?collection=SS27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('brand-sc-showroom-panel')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('brand-sc-unified-audit-path')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('brand-sc-audit-path-linesheet')).toHaveAttribute(
      'href',
      /collection=SS27/
    );
    await expect(page.getByTestId('brand-sc-audit-path-shop-matrix')).toHaveAttribute(
      'href',
      /\/shop\/b2b\/matrix.*collection=SS27/
    );
    await expect(page.getByTestId('brand-sc-audit-path-shop-showroom')).toHaveAttribute(
      'href',
      /\/shop\/b2b\/showroom.*collection=SS27/
    );
  });
});

import { test, expect } from '@playwright/test';

const gotoOpts = { waitUntil: 'load' as const, timeout: 120_000 };

test.describe('Production', () => {
  test('production page loads', async ({ page }) => {
    await page.goto('/brand/production', gotoOpts);
    await expect(page).toHaveURL(/\/brand\/production/);
    await expect(page).toHaveTitle(/Syntha/i);
  });

  test('production page has content', async ({ page }) => {
    await page.goto('/brand/production', gotoOpts);
    const root = page.getByTestId('brand-production-page');
    await expect(root).toBeVisible({ timeout: 15000 });
    await expect(
      page.getByRole('heading', { name: /Единый производственный хаб/i })
    ).toBeVisible({ timeout: 15000 });
  });
});

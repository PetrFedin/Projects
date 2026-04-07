import { test, expect } from '@playwright/test';

test.describe('Production', () => {
  test('production page loads', async ({ page }) => {
    await page.goto('/brand/production');
    await expect(page).toHaveURL(/\/brand\/production/);
    await expect(page).toHaveTitle(/Syntha/i);
  });

  test('production page has content', async ({ page }) => {
    await page.goto('/brand/production');
    // Either production header or collections tab (page may vary with auth)
    const heading = page.getByRole('heading', { name: /Управление производством/i });
    const collectionsTab = page.getByText('Коллекции').first();
    await expect(heading.or(collectionsTab)).toBeVisible({ timeout: 15000 });
  });
});

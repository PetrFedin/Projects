import { test, expect } from '@playwright/test';

test.describe('Brand Profile', () => {
  test('loads brand page', async ({ page }) => {
    await page.goto('/brand');
    await expect(page).toHaveTitle(/Syntha/i);
  });

  test('shows production link', async ({ page }) => {
    await page.goto('/brand');
    await page.getByRole('link', { name: /production|производств/i }).first().click();
    await expect(page).toHaveURL(/\/brand\/production/);
  });
});

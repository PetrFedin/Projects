import { test, expect } from '@playwright/test';

test.describe('B2B Catalog', () => {
  test('catalog page loads', async ({ page }) => {
    await page.goto('/shop/b2b/catalog');
    await expect(page.locator('h1')).toContainText('B2B Каталог');
  });

  test('search filters products', async ({ page }) => {
    await page.goto('/shop/b2b/catalog');
    await page.fill('input[placeholder*="Поиск"]', 'Midnight');
    await expect(page.locator('text=Платье Midnight')).toBeVisible();
  });
});

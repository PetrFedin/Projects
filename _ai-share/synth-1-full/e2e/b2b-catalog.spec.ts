import { test, expect } from '@playwright/test';

const gotoOpts = { waitUntil: 'load' as const, timeout: 90_000 };

test.describe('B2B Catalog', () => {
  test.describe.configure({ mode: 'serial', timeout: 120_000 });

  /** Один goto: повторная навигация после тяжёлых API-тестов иногда ловит деградированный dev (webpack cache). */
  test('catalog loads and search filters products', async ({ page }) => {
    await page.goto('/shop/b2b/catalog', gotoOpts);
    const root = page.getByTestId('page-shop-b2b-catalog');
    await expect(root).toBeVisible({ timeout: 60_000 });
    await expect(root.getByRole('heading', { name: 'B2B Каталог' }).first()).toBeVisible();
    const search = page.getByTestId('shop-b2b-catalog-search');
    await expect(search).toBeVisible({ timeout: 30_000 });
    await search.fill('Кашемировый');
    await expect(root.getByText('Кашемировый лонгслив').first()).toBeVisible({ timeout: 15_000 });
  });
});

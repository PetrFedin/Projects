import { test, expect } from '@playwright/test';

/**
 * A11y-проверки: наличие заголовков, основных ориентиров и доступных имён у ключевых элементов.
 * Не заменяет полный аудит (axe, ручная проверка), но ловит типичные промахи.
 */

test.describe('Client pages a11y', () => {
  test('client/wardrobe: has h1 and back button has accessible name', async ({ page }) => {
    await page.goto('/client/wardrobe');
    await expect(page.getByRole('heading', { level: 1, name: /digital wardrobe/i })).toBeVisible();
    const backBtn = page.getByRole('link', { name: /назад/i }).first();
    await expect(backBtn).toBeVisible();
  });

  test('client/try-before-you-buy: has h1', async ({ page }) => {
    await page.goto('/client/try-before-you-buy');
    await expect(page.getByRole('heading', { level: 1, name: /try before you buy/i })).toBeVisible();
  });

  test('client/returns: has h1 and meaningful links', async ({ page }) => {
    await page.goto('/client/returns');
    await expect(page.getByRole('heading', { level: 1, name: /возвраты/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /мои заказы/i })).toBeVisible();
  });
});

test.describe('Brand/Shop feature pages a11y', () => {
  test('brand/analytics/phase2: has main heading', async ({ page }) => {
    await page.goto('/brand/analytics/phase2');
    await expect(page.getByRole('heading', { level: 1, name: /analytics phase 2/i })).toBeVisible();
  });

  test('shop/bopis: has h1', async ({ page }) => {
    await page.goto('/shop/bopis');
    await expect(page.getByRole('heading', { level: 1, name: /bopis/i })).toBeVisible();
  });

  test('shop/bnpl: has h1', async ({ page }) => {
    await page.goto('/shop/bnpl');
    await expect(page.getByRole('heading', { level: 1, name: /pos bnpl|рассрочк/i })).toBeVisible();
  });
});

test.describe('Forms and buttons have labels', () => {
  test('client nav: current page link has aria-current', async ({ page }) => {
    await page.goto('/client/wardrobe');
    const nav = page.getByRole('navigation', { name: /клиентское меню/i });
    const currentLink = nav.locator('[aria-current="page"]');
    await expect(currentLink).toBeVisible();
    await expect(currentLink).toContainText(/мой шкаф|wardrobe/i);
  });
});

test.describe('Digital Passport hub a11y', () => {
  test('client/passport: has h1', async ({ page }) => {
    await page.goto('/client/passport');
    await expect(page.getByRole('heading', { level: 1, name: /digital passport|паспорт/i })).toBeVisible();
  });
});

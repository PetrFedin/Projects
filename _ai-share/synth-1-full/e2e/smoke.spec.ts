import { test, expect } from '@playwright/test';

/**
 * Smoke-тесты: ключевые страницы открываются без ошибок и отображают основной контент.
 * Запуск: npm run test:e2e (поднимает dev-сервер и прогоняет тесты).
 */

const SMOKE_ROUTES = [
  { path: '/', name: 'Главная' },
  { path: '/client', name: 'Клиент (дашборд)' },
  { path: '/client/passport', name: 'Digital Passport hub' },
  { path: '/client/wardrobe', name: 'Digital Wardrobe' },
  { path: '/client/try-before-you-buy', name: 'Try Before You Buy' },
  { path: '/client/returns', name: 'Возвраты' },
  { path: '/client/gift-registry', name: 'Список подарков' },
  { path: '/brand', name: 'Brand hub' },
  { path: '/brand/analytics/phase2', name: 'Analytics Phase 2' },
  { path: '/brand/distributor/territory', name: 'Territory Protection' },
  { path: '/brand/marketing/style-me-upsell', name: 'Style-Me Upsell' },
  { path: '/shop', name: 'Shop hub' },
  { path: '/shop/bopis', name: 'BOPIS' },
  { path: '/shop/bnpl', name: 'BNPL' },
  { path: '/shop/endless-aisle', name: 'Endless Aisle' },
  { path: '/shop/ship-from-store', name: 'Ship-from-Store' },
  { path: '/shop/stylist-tablet', name: 'Endless Stylist Tablet' },
  { path: '/shop/inventory/cycle-counting', name: 'Cycle Counting' },
  { path: '/shop/local-inventory-ads', name: 'Local Inventory Ads' },
] as const;

for (const { path, name } of SMOKE_ROUTES) {
  test(`smoke: ${name} (${path})`, async ({ page }) => {
    const res = await page.goto(path, { waitUntil: 'domcontentloaded' });
    expect(res?.status()).toBeLessThan(500);
    await expect(page).toHaveURL(new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
}

test.describe('Client section has nav', () => {
  test('client layout shows ClientNav with main links', async ({ page }) => {
    await page.goto('/client/wardrobe');
    const nav = page.getByRole('navigation', { name: /клиентское меню/i });
    await expect(nav).toBeVisible();
    await expect(nav.getByRole('link', { name: /мой шкаф/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /try before you buy/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /заказы/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /возвраты/i })).toBeVisible();
  });
});

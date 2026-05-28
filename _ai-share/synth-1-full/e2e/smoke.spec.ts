import { test, expect, type Page } from '@playwright/test';
import { ensureDevCabinetLogin, devEmailForCabinetPath } from './helpers/dev-cabinet-login';

/**
 * Smoke-тесты: ключевые страницы открываются без ошибок и отображают основной контент.
 * Запуск: npm run test:e2e (поднимает dev-сервер и прогоняет тесты).
 */

const GOTO_OPTS = { waitUntil: 'domcontentloaded' as const, timeout: 60_000 };

async function openSmokeRoute(page: Page, path: string): Promise<void> {
  if (devEmailForCabinetPath(path)) {
    await ensureDevCabinetLogin(page, path);
  }
  const pattern = new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await page.goto(path, GOTO_OPTS);
      if (page.url().startsWith('chrome-error:')) {
        await new Promise((r) => setTimeout(r, 400));
        continue;
      }
      expect(res?.status() ?? 599).toBeLessThan(500);
      await expect(page).toHaveURL(pattern, { timeout: 25_000 });
      return;
    } catch (e) {
      lastError = e;
      await new Promise((r) => setTimeout(r, 400));
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

/** После goto ждём реальный shell кабинета, не только внешний `<main>` из ClientLayout. */
async function waitForSmokeShell(page: Page, path: string): Promise<void> {
  if (path.startsWith('/client')) {
    await expect(page.locator('[data-client-cabinet-nuorder="true"]')).toBeVisible({
      timeout: 90_000,
    });
    return;
  }
  await expect(page.locator('main').first()).toBeVisible({ timeout: 90_000 });
}

const SMOKE_ROUTES = [
  { path: '/', name: 'Главная' },
  { path: '/client', name: 'Клиент (дашборд)' },
  { path: '/client/me', name: 'Клиент — профиль (me)' },
  { path: '/factory/production', name: 'Factory — производство' },
  { path: '/factory/supplier', name: 'Factory — поставщик' },
  { path: '/client/passport', name: 'Digital Passport hub' },
  { path: '/client/wardrobe', name: 'Digital Wardrobe' },
  { path: '/client/try-before-you-buy', name: 'Try Before You Buy' },
  { path: '/client/returns', name: 'Возвраты' },
  { path: '/client/gift-registry', name: 'Список подарков' },
  { path: '/brand', name: 'Brand hub' },
  { path: '/brand/b2b-orders', name: 'Brand B2B orders registry' },
  { path: '/brand/analytics/phase2', name: 'Analytics Phase 2' },
  { path: '/brand/distributor/territory', name: 'Territory Protection' },
  { path: '/brand/marketing/style-me-upsell', name: 'Style-Me Upsell' },
  { path: '/shop', name: 'Shop hub' },
  { path: '/shop/analytics', name: 'Shop — аналитика розницы' },
  { path: '/shop/analytics/footfall', name: 'Shop — трафик по зонам' },
  { path: '/shop/b2b/margin-analysis', name: 'Shop B2B — хаб маржи' },
  { path: '/shop/b2b/margin-calculator', name: 'Shop B2B — калькулятор маржи' },
  { path: '/shop/b2b/margin-report', name: 'Shop B2B — отчёт по марже' },
  { path: '/shop/b2b/landed-cost', name: 'Shop B2B — landed cost' },
  { path: '/shop/b2b/finance', name: 'Shop B2B — финансы партнёра' },
  { path: '/shop/b2b/payment', name: 'Shop B2B — оплата (JOOR Pay)' },
  { path: '/shop/b2b/documents', name: 'Shop B2B — документы' },
  { path: '/shop/b2b/contracts', name: 'Shop B2B — контракты' },
  { path: '/shop/b2b/delivery-calendar', name: 'Shop B2B — календарь поставок' },
  { path: '/shop/b2b/orders/B2B-0013', name: 'Shop B2B — карточка заказа' },
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
    test.setTimeout(180_000);
    await openSmokeRoute(page, path);
    await waitForSmokeShell(page, path);
  });
}

test.describe('Client section has nav', () => {
  test('client hub sidebar: named navigation and active wardrobe link', async ({ page }) => {
    test.setTimeout(180_000);
    await openSmokeRoute(page, '/client/wardrobe');
    await waitForSmokeShell(page, '/client/wardrobe');
    const nav = page.getByRole('navigation', { name: /клиентское меню/i });
    await expect(nav).toBeVisible({ timeout: 90_000 });
    /** Группа «Гардероб» раскрыта на этом маршруте; подписи — `clientNavGroups` (не старый горизонтальный ClientNav). */
    await expect(nav.getByRole('link', { name: /мой гардероб/i })).toBeVisible();
  });
});

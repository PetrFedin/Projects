import { test, expect } from '@playwright/test';

/**
 * Один сценарий на хаб: страница отвечает без 5xx, есть <main> (layout кабинета).
 * Пути согласованы с docs/UNIFIED_ECOSYSTEM_VERIFICATION и smoke-матрицей.
 */
const CABINET_HUBS = [
  { path: '/admin', name: 'Admin hub' },
  { path: '/shop', name: 'Shop hub' },
  { path: '/brand', name: 'Brand hub' },
  { path: '/client', name: 'Client hub' },
  { path: '/distributor', name: 'Distributor hub' },
  { path: '/factory/production', name: 'Factory — production' },
  { path: '/factory/supplier', name: 'Factory — supplier' },
] as const;

for (const { path, name } of CABINET_HUBS) {
  test(`cabinet hub: ${name} (${path})`, async ({ page }) => {
    test.setTimeout(120_000);
    const res = await page.goto(path, { waitUntil: 'domcontentloaded' });
    expect(res?.status()).toBeLessThan(500);
    await expect(page).toHaveURL(new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    // Layout кабинетов рендерит <main> после Suspense; при первом чанке dev может показывать fallback без main.
    await expect(page.locator('main').first()).toBeVisible({ timeout: 90_000 });
  });
}

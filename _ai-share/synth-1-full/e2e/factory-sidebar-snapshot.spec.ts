import { test, expect } from '@playwright/test';

/**
 * Визуальный регресс сайдбара кабинета производителя (`/factory/production`).
 * Снапшоты хранятся в `e2e/factory-sidebar-snapshot.spec.ts-snapshots/` (по платформе/браузеру).
 * После правок `factory-navigation.ts`, `HubSidebar` или темы — обновить:
 *   npx playwright test e2e/factory-sidebar-snapshot.spec.ts --update-snapshots
 * На другой ОС снимок может отличаться (шрифты); при необходимости закоммитить эталон с CI-runner (Linux) отдельно.
 */
test.describe('Factory manufacturer sidebar (visual regression)', () => {
  test('desktop aside matches snapshot', async ({ page }) => {
    test.setTimeout(120_000);
    const res = await page.goto('/factory/production', { waitUntil: 'domcontentloaded' });
    expect(res?.status()).toBeLessThan(500);

    const sidebar = page.getByTestId('factory-mfr-sidebar');
    await expect(sidebar).toBeVisible({ timeout: 90_000 });

    await expect(sidebar).toHaveScreenshot('factory-mfr-sidebar.png', {
      animations: 'disabled',
      maxDiffPixelRatio: 0.03,
    });
  });
});

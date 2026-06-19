import { test, expect } from '@playwright/test';
import { PLATFORM_CORE_SHOP_B2B_LEGACY_REDIRECTS } from '../src/lib/platform-core-shop-b2b-legacy-redirects';
import { PLATFORM_CORE_BRAND_B2B_LEGACY_REDIRECTS } from '../src/lib/platform-core-brand-b2b-legacy-redirects';
import { PLATFORM_CORE_BRAND_SUPPLIERS_LEGACY_REDIRECT } from '../src/lib/platform-core-brand-suppliers-legacy-redirect';

const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 60_000 };

test.describe('Platform Core legacy redirects', () => {
  for (const rule of PLATFORM_CORE_SHOP_B2B_LEGACY_REDIRECTS) {
    test(`shop: ${rule.testId}`, async ({ page }) => {
      const res = await page.goto(`${rule.path}?collection=SS27`, GOTO);
      expect(res?.status() ?? 599).toBeLessThan(500);
      await expect(page.getByTestId(rule.testId)).toBeVisible({ timeout: 45_000 });
      await expect(page.getByTestId(rule.testId)).toContainText('Перейти');
    });
  }

  test('shop: layout catch-all side-path → tail redirect', async ({ page }) => {
    const res = await page.goto('/shop/b2b/tenders?collection=SS27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('platform-core-b2b-side-path-redirect')).toBeVisible({
      timeout: 45_000,
    });
    await expect(page.getByTestId('platform-core-b2b-side-path-redirect')).toContainText('Перейти');
    await expect(page.locator('body')).not.toContainText('Пошив партии SS26');
  });

  for (const rule of PLATFORM_CORE_BRAND_B2B_LEGACY_REDIRECTS) {
    test(`brand: ${rule.testId}`, async ({ page }) => {
      const res = await page.goto(`${rule.path}?collection=SS27`, GOTO);
      expect(res?.status() ?? 599).toBeLessThan(500);
      await expect(page.getByTestId(rule.testId)).toBeVisible({ timeout: 45_000 });
      await expect(page.getByTestId(rule.testId)).toContainText('Перейти');
    });
  }

  test(`brand: ${PLATFORM_CORE_BRAND_SUPPLIERS_LEGACY_REDIRECT.testId}`, async ({ page }) => {
    const res = await page.goto(`${PLATFORM_CORE_BRAND_SUPPLIERS_LEGACY_REDIRECT.path}?collection=SS27`, GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId(PLATFORM_CORE_BRAND_SUPPLIERS_LEGACY_REDIRECT.testId)).toBeVisible({
      timeout: 45_000,
    });
    await expect(page.getByTestId(PLATFORM_CORE_BRAND_SUPPLIERS_LEGACY_REDIRECT.testId)).toContainText(
      'Перейти'
    );
  });
});

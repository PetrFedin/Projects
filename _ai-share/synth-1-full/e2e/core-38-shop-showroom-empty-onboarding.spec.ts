import { test, expect } from '@playwright/test';
import { gotoRoleCoreCabinet } from './helpers/core-chain-overview';

const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 60_000 };

/** Wave 20: shop×sample — empty showroom onboarding → partners / matrix (не тупик). */
test.describe('core-38: shop showroom empty onboarding', () => {
  test('EMPTY27 showroom: onboarding CTAs to partners and SS27 matrix', async ({ page }) => {
    const res = await page.goto('/shop/b2b/showroom?collection=EMPTY27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('shop-sc-showroom-panel')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('shop-sc-showroom-empty-onboarding')).toBeVisible({
      timeout: 120_000,
    });
    await expect(page.getByTestId('shop-sc-showroom-empty-partners-link')).toHaveAttribute(
      'href',
      /partners/
    );
    await expect(page.getByTestId('shop-sc-showroom-empty-matrix-link')).toHaveAttribute(
      'href',
      /collection=SS27/
    );
    await expect(page.getByTestId('shop-sc-showroom-empty-showroom-link')).toHaveAttribute(
      'href',
      /collection=SS27/
    );
  });

  test('EMPTY27 cabinet mini: empty state visible', async ({ page }) => {
    const res = await gotoRoleCoreCabinet(
      page,
      '/shop/core?collection=EMPTY27&pillar=sample_collection'
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(
      page.getByTestId('shop-sc-cabinet-empty').or(page.getByTestId('shop-showroom-mini-empty'))
    ).toBeVisible({ timeout: 60_000 });
  });

  test('SS27 cabinet mini: partner row + matrix CTA', async ({ page }) => {
    const res = await gotoRoleCoreCabinet(
      page,
      '/shop/core?collection=SS27&pillar=sample_collection'
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    const showroomMini = page
      .getByTestId('shop-sc-cabinet-panel')
      .or(page.getByTestId('shop-showroom-mini'));
    await expect(showroomMini).toBeVisible({ timeout: 60_000 });
    await expect(showroomMini).toContainText('Витрина коллекции', { timeout: 30_000 });
    const partnerRow = showroomMini
      .getByTestId('shop-sc-cabinet-partner')
      .or(showroomMini.getByTestId('shop-showroom-mini-partner'));
    await expect(partnerRow).toBeVisible({ timeout: 90_000 });
    await expect(showroomMini.getByTestId('shop-sc-cabinet-partner-logo')).toBeVisible({
      timeout: 15_000,
    });
    await page.getByTestId('role-pillar-primary-cta').click();
    await expect(page).toHaveURL(/\/shop\/b2b\/showroom.*collection=SS27/, { timeout: 30_000 });
  });
});

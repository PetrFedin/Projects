import { test, expect } from '@playwright/test';

const gotoOpts = { waitUntil: 'load' as const, timeout: 90_000 };

test.describe('B2B create-order platform export UI', () => {
  test('platform export card shows exportJobId after submit', async ({ page }) => {
    await page.goto('/shop/b2b/create-order', gotoOpts);
    await expect(page.getByTestId('page-shop-b2b-create-order')).toBeVisible({ timeout: 90_000 });
    const card = page.getByTestId('shop-b2b-create-order-platform-export');
    await expect(card).toBeVisible({ timeout: 30_000 });
    await card.scrollIntoViewIfNeeded();
    const oid = `ui-e2e-${Date.now()}`;
    await page.getByTestId('shop-b2b-platform-export-order-id').fill(oid);

    const submit = page.getByTestId('shop-b2b-platform-export-submit');
    await expect(submit).toBeEnabled({ timeout: 30_000 });
    const exportResponse = page.waitForResponse(
      (r) => r.url().includes('/api/b2b/export-order') && r.request().method() === 'POST',
      { timeout: 60_000 }
    );
    await submit.click();
    await exportResponse;

    const result = page.getByTestId('shop-b2b-platform-export-result');
    await expect(result).toBeVisible({ timeout: 60_000 });
    await expect(result.getByText(/exportJobId:/)).toBeVisible();
    await expect(result.getByText(new RegExp(oid))).toBeVisible();
    await expect(result.getByText('Готово.')).toBeVisible();
  });
});

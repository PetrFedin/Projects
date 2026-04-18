import { test, expect } from '@playwright/test';

/**
 * Ритейл-кабинет: API статуса учёта и единый переключатель срезов аналитики.
 */
test.describe('Shop ERP sync API + analytics segment strip', () => {
  test('GET /api/shop/erp-sync-status returns JSON with lastSuccessAt', async ({ request }) => {
    const res = await request.get('/api/shop/erp-sync-status');
    expect(res.ok()).toBeTruthy();
    const body = (await res.json()) as Record<string, unknown>;
    expect(typeof body.lastSuccessAt).toBe('string');
    expect(body.lastSuccessAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(typeof body.systemLabel).toBe('string');
    expect(typeof body.pendingInQueue).toBe('number');
    if ('domainOutboxPending' in body && body.domainOutboxPending != null) {
      expect(typeof body.domainOutboxPending).toBe('number');
    }
  });

  test('segment nav visible on retail and B2B analytics URLs', async ({ page }) => {
    await page.goto('/shop/analytics', { waitUntil: 'domcontentloaded', timeout: 90_000 });
    await expect(page.getByTestId('shop-analytics-segment-nav')).toBeVisible({ timeout: 45_000 });
    await expect(page.getByTestId('shop-retail-analytics-footfall-link')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('shop-retail-analytics-margin-hub-link')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('shop-retail-analytics-b2b-link')).toBeVisible({ timeout: 15_000 });

    await page.goto('/shop/analytics/footfall', { waitUntil: 'domcontentloaded', timeout: 90_000 });
    await expect(page.getByTestId('shop-analytics-segment-nav')).toBeVisible({ timeout: 45_000 });
    await expect(page.getByTestId('shop-footfall-retail-analytics-link')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('shop-footfall-b2b-link')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('shop-footfall-margin-hub-link')).toBeVisible({ timeout: 15_000 });

    await page.goto('/shop/b2b/analytics', { waitUntil: 'domcontentloaded', timeout: 90_000 });
    await expect(page.getByTestId('shop-analytics-segment-nav')).toBeVisible({ timeout: 45_000 });
    await expect(page.getByTestId('shop-b2b-analytics-retail-link')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('shop-b2b-analytics-footfall-link')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('b2b-margin-analysis-hub-link')).toBeVisible({ timeout: 15_000 });

    await page.goto('/shop/b2b/order-analytics', { waitUntil: 'domcontentloaded', timeout: 90_000 });
    await expect(page.getByTestId('shop-analytics-segment-nav')).toBeVisible({ timeout: 45_000 });
    await expect(page.getByTestId('shop-b2b-order-analytics-retail-link')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('shop-b2b-order-analytics-footfall-link')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('b2b-margin-analysis-hub-link')).toBeVisible({ timeout: 15_000 });

    await page.goto('/shop/b2b/reports', { waitUntil: 'domcontentloaded', timeout: 90_000 });
    await expect(page.getByTestId('shop-analytics-segment-nav')).toBeVisible({ timeout: 45_000 });
    await expect(page.getByTestId('shop-b2b-reports-retail-link')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('shop-b2b-reports-footfall-link')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('b2b-margin-analysis-hub-link')).toBeVisible({ timeout: 15_000 });

    await page.goto('/shop/b2b/margin-analysis', { waitUntil: 'domcontentloaded', timeout: 90_000 });
    await expect(page.getByTestId('shop-analytics-segment-nav')).toBeVisible({ timeout: 45_000 });
    await expect(page.getByTestId('page-shop-b2b-margin-analysis')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('margin-hub-retail-analytics-link')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('margin-hub-b2b-analytics-link')).toBeVisible({ timeout: 15_000 });

    await page.goto('/shop/b2b/margin-calculator', { waitUntil: 'domcontentloaded', timeout: 90_000 });
    await expect(page.getByTestId('shop-analytics-segment-nav')).toBeVisible({ timeout: 45_000 });
    await expect(page.getByTestId('shop-b2b-margin-calculator-retail-link')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('shop-b2b-margin-calculator-footfall-link')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('b2b-margin-analysis-hub-link')).toBeVisible({ timeout: 15_000 });

    await page.goto('/shop/b2b/margin-report', { waitUntil: 'domcontentloaded', timeout: 90_000 });
    await expect(page.getByTestId('shop-analytics-segment-nav')).toBeVisible({ timeout: 45_000 });
    await expect(page.getByTestId('shop-b2b-margin-report-retail-link')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('shop-b2b-margin-report-footfall-link')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('b2b-margin-analysis-hub-link')).toBeVisible({ timeout: 15_000 });

    await page.goto('/shop/b2b/landed-cost', { waitUntil: 'domcontentloaded', timeout: 90_000 });
    await expect(page.getByTestId('shop-analytics-segment-nav')).toBeVisible({ timeout: 45_000 });
    await expect(page.getByTestId('shop-b2b-landed-cost-retail-link')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('shop-b2b-landed-cost-footfall-link')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('b2b-margin-analysis-hub-link')).toBeVisible({ timeout: 15_000 });

    await page.goto('/shop/b2b/finance', { waitUntil: 'domcontentloaded', timeout: 90_000 });
    await expect(page.getByTestId('shop-analytics-segment-nav')).toBeVisible({ timeout: 45_000 });
    await expect(page.getByTestId('shop-b2b-finance-retail-link')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('shop-b2b-finance-footfall-link')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('b2b-margin-analysis-hub-link')).toBeVisible({ timeout: 15_000 });

    await page.goto('/shop/b2b/payment', { waitUntil: 'domcontentloaded', timeout: 90_000 });
    await expect(page.getByTestId('shop-analytics-segment-nav')).toBeVisible({ timeout: 45_000 });
    await expect(page.getByTestId('shop-b2b-payment-retail-link')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('shop-b2b-payment-footfall-link')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('b2b-margin-analysis-hub-link')).toBeVisible({ timeout: 15_000 });

    await page.goto('/shop/b2b/documents', { waitUntil: 'domcontentloaded', timeout: 90_000 });
    await expect(page.getByTestId('shop-analytics-segment-nav')).toBeVisible({ timeout: 45_000 });
    await expect(page.getByTestId('shop-b2b-documents-retail-link')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('shop-b2b-documents-footfall-link')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('b2b-margin-analysis-hub-link')).toBeVisible({ timeout: 15_000 });

    await page.goto('/shop/b2b/contracts', { waitUntil: 'domcontentloaded', timeout: 90_000 });
    await expect(page.getByTestId('shop-analytics-segment-nav')).toBeVisible({ timeout: 45_000 });
    await expect(page.getByTestId('shop-b2b-contracts-retail-link')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('shop-b2b-contracts-footfall-link')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('b2b-margin-analysis-hub-link')).toBeVisible({ timeout: 15_000 });
  });

  test('operational B2B: ERP strip + cross-links on orders, tracking, claims, replenishment', async ({ page }) => {
    const cases = [
      { path: '/shop/b2b/orders', retail: 'shop-b2b-orders-retail-link', footfall: 'shop-b2b-orders-footfall-link' },
      { path: '/shop/b2b/orders/B2B-0013', retail: 'shop-b2b-order-detail-retail-link', footfall: 'shop-b2b-order-detail-footfall-link' },
      { path: '/shop/b2b/delivery-calendar', retail: 'shop-b2b-delivery-calendar-retail-link', footfall: 'shop-b2b-delivery-calendar-footfall-link' },
      { path: '/shop/b2b/tracking', retail: 'shop-b2b-tracking-retail-link', footfall: 'shop-b2b-tracking-footfall-link' },
      { path: '/shop/b2b/claims', retail: 'shop-b2b-claims-retail-link', footfall: 'shop-b2b-claims-footfall-link' },
      { path: '/shop/b2b/replenishment', retail: 'shop-b2b-replenishment-retail-link', footfall: 'shop-b2b-replenishment-footfall-link' },
    ] as const;
    for (const c of cases) {
      await page.goto(c.path, { waitUntil: 'domcontentloaded', timeout: 90_000 });
      await expect(page.getByTestId('shop-analytics-segment-nav')).toBeVisible({ timeout: 45_000 });
      await expect(page.getByTestId(c.retail)).toBeVisible({ timeout: 15_000 });
      await expect(page.getByTestId(c.footfall)).toBeVisible({ timeout: 15_000 });
      await expect(page.getByTestId('b2b-margin-analysis-hub-link')).toBeVisible({ timeout: 15_000 });
    }
  });
});

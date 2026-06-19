import { test, expect } from '@playwright/test';
import { gotoRoleCoreCabinet } from './helpers/core-chain-overview';
import {
  checkoutPgOrderViaMatrix,
  confirmPgOrderViaApi,
  fetchPgChainStatus,
  handoffPgOrderViaApi,
} from './helpers/core-checkout-pg';
import { patchOrderShopProductionVisibility } from './helpers/core-shop-production-visibility';
import { shopTrackingRow } from './helpers/shop-tracking-testids';

const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 60_000 };

/** Wave 25: EMPTY27 brand×dev onboarding, clean PG disclosure→tracking, mfr calendar auto-thread. */
test.describe('core-44: brand dev empty + disclosure tracking', () => {
  test('EMPTY27 brand dev cabinet: empty onboarding CTAs', async ({ page }) => {
    const res = await gotoRoleCoreCabinet(
      page,
      '/brand/core?pillar=development&collection=EMPTY27'
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('brand-dev-cabinet-panel')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('brand-dev-empty-onboarding')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('brand-dev-empty-create-sku-link')).toHaveAttribute(
      'href',
      /w2col=EMPTY27/
    );
    await expect(page.getByTestId('brand-dev-empty-range-link')).toHaveAttribute(
      'href',
      /collection=EMPTY27/
    );
    await expect(page.getByTestId('brand-dev-empty-ss27-w2-link')).toHaveAttribute(
      'href',
      /w2col=SS27/
    );
  });

  test('EMPTY27 W2 hub: empty onboarding strip', async ({ page }) => {
    const res = await page.goto('/brand/production/workshop2?w2col=EMPTY27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('brand-dev-w2-hub-panel')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('brand-dev-empty-onboarding')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('brand-dev-empty-ss27-range-link')).toHaveAttribute(
      'href',
      /collection=SS27/
    );
  });

  test('EMPTY27 w2create deep link opens create-article dialog', async ({ page }) => {
    const res = await page.goto('/brand/production/workshop2?w2col=EMPTY27&w2create=1', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('brand-dev-w2-hub-panel')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('brand-w2-create-article-dialog')).toBeVisible({
      timeout: 30_000,
    });
  });

  test('clean PG: brand disclosure strip links to shop tracking with chain steps', async ({
    page,
    request,
  }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = await checkoutPgOrderViaMatrix(page);
    await confirmPgOrderViaApi(request, orderId);
    await handoffPgOrderViaApi(request, orderId);
    expect(orderId).toMatch(/^B2B-\d+$/);

    await patchOrderShopProductionVisibility(request, orderId, 'full');

    await expect
      .poll(
        async () => {
          const shopRes = await request.get(
            '/api/shop/b2b/orders?buyerId=shop1&collectionId=SS27'
          );
          if (!shopRes.ok()) return false;
          const shopJson = (await shopRes.json()) as {
            orders?: Array<{ id?: string }>;
          };
          return shopJson.orders?.some((o) => o.id === orderId) ?? false;
        },
        { timeout: 60_000, intervals: [1_000, 2_000, 3_000] }
      )
      .toBe(true);

    const chain = await fetchPgChainStatus(request, orderId);
    expect((chain.steps?.length ?? 0)).toBeGreaterThanOrEqual(1);

    const batchRes = await request.post('/api/workshop2/b2b/orders/chain-status-batch', {
      data: { orderIds: [orderId], buyerView: true },
    });
    expect(batchRes.ok()).toBeTruthy();
    const batchJson = (await batchRes.json()) as {
      chains?: Record<string, { steps?: unknown[] }>;
    };
    expect((batchJson.chains?.[orderId]?.steps?.length ?? 0)).toBeGreaterThanOrEqual(1);

    const brandDetail = await page.goto(
      `/brand/b2b-orders/${encodeURIComponent(orderId)}`,
      GOTO
    );
    expect(brandDetail?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('brand-co-shop-disclosure-preview-strip')).toBeVisible({
      timeout: 30_000,
    });
    const trackingLink = page.getByTestId('brand-co-shop-disclosure-preview-tracking-link');
    await expect(trackingLink).toHaveAttribute('href', new RegExp(orderId));

    const trackingHref = await trackingLink.getAttribute('href');
    expect(trackingHref).toBeTruthy();
    expect(trackingHref).toMatch(new RegExp(orderId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

    await page.goto(trackingHref!, GOTO);
    await expect(page.getByTestId('shop-co-tracking-list')).toBeVisible({ timeout: 60_000 });
    const row = shopTrackingRow(page, orderId).or(page.getByTestId('shop-co-tracking-focus-row'));
    await expect(row).toBeVisible({ timeout: 90_000 });
  });
});

test.describe('core-44: mfr calendar auto-thread', () => {
  test('mfr calendar: create task on clean PG order opens thread link', async ({
    page,
    request,
  }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = await checkoutPgOrderViaMatrix(page);
    const taskTitle = `Mfr E2E ${Date.now()}`;

    const res = await page.goto(
      `/factory/calendar?role=manufacturer&collection=SS27&order=${encodeURIComponent(orderId)}`,
      GOTO
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('mfr-cm-calendar-context-strip')).toBeVisible({
      timeout: 30_000,
    });

    await page.getByTestId('calendar-create-event-btn').click();
    await page.locator('#title').fill(taskTitle);
    await page.getByTestId('calendar-event-save-btn').click();

    await expect(page.locator('[data-testid^="calendar-b2b-event-pc-task-"]').first()).toBeVisible({
      timeout: 30_000,
    });

    const taskEvent = page.locator('[data-testid^="calendar-b2b-event-pc-task-"]', {
      hasText: taskTitle,
    });
    await expect(taskEvent).toBeVisible({ timeout: 30_000 });
    await taskEvent.click();
    await expect(page.getByTestId('calendar-event-thread-link')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('calendar-event-thread-link')).toHaveAttribute(
      'href',
      new RegExp(orderId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    );
  });
});

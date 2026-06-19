import { test, expect } from '@playwright/test';
import {
  gotoRoleCoreCabinet,
  openPlatformHubAuditView,
  openReadinessWorkspaceFromScore,
  waitForChainOverview,
} from './helpers/core-chain-overview';
import { shopTrackingRow, shopTrackingTestId } from './helpers/shop-tracking-testids';

/**
 * Волна C: полные пути FW27 (cross-role) и EMPTY27 (пустая цепочка).
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core
 */
const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 90_000 };

test.describe('Platform Core FW27 & EMPTY27', () => {
  test('EMPTY27: hub — баннер пустой цепочки и честные подписи', async ({ page }) => {
    const res = await page.goto('/platform?collection=EMPTY27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);

    await expect(page.getByTestId('platform-core-empty-chain-banner')).toBeVisible({
      timeout: 90_000,
    });
    await expect(page.getByTestId('platform-core-empty-chain-banner')).toContainText(
      'Пустая цепочка'
    );
    await expect(page.getByTestId('platform-core-empty-chain-banner')).toContainText(
      'Весна–лето 2027'
    );
    await expect(page.getByTestId('platform-core-empty-chain-banner')).not.toContainText('SS27');
    await openPlatformHubAuditView(page);
  });

  test('EMPTY27: shop — столп разработки не в роли (редирект)', async ({ page }) => {
    const res = await gotoRoleCoreCabinet(page, '/shop/core?collection=EMPTY27&pillar=development');
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('role-core-cabinet-shop')).toBeVisible({ timeout: 60_000 });
    await expect(page).toHaveURL(/pillar=sample_collection/, { timeout: 30_000 });
    await expect(page.getByTestId('role-pillar-development')).toHaveCount(0);
  });

  test('brand sample mini: error state с fallback ссылками', async ({ page }) => {
    await page.route('**/api/workshop2/platform-core/pillar-snapshot**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: false }),
      })
    );
    const res = await page.goto(
      '/brand/core?pillar=sample_collection&collection=EMPTY27',
      GOTO
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('role-core-cabinet-brand')).toBeVisible({ timeout: 90_000 });
    await expect(page.getByTestId('brand-sc-cabinet-panel')).toBeVisible({ timeout: 120_000 });
    await expect(
      page
        .getByTestId('brand-sc-cabinet-error')
        .or(page.getByTestId('brand-sample-collection-mini-error'))
    ).toBeVisible({
      timeout: 60_000,
    });
    await expect(
      page
        .getByTestId('brand-sc-cabinet-error-linesheet-link')
        .or(page.getByTestId('brand-sample-collection-mini-error-linesheet'))
    ).toBeVisible({
      timeout: 30_000,
    });
    await expect(
      page
        .getByTestId('brand-sc-cabinet-error-showroom-link')
        .or(page.getByTestId('brand-sample-collection-mini-error-showroom'))
    ).toBeVisible({
      timeout: 30_000,
    });
  });

  test('EMPTY27: shop cabinet — витрина empty state', async ({ page }) => {
    const res = await gotoRoleCoreCabinet(
      page,
      '/shop/core?collection=EMPTY27&pillar=sample_collection'
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(
      page.getByTestId('shop-sc-cabinet-panel').or(page.getByTestId('shop-showroom-mini'))
    ).toBeVisible({ timeout: 60_000 });
    await expect(
      page.getByTestId('shop-sc-cabinet-empty').or(page.getByTestId('shop-showroom-mini-empty'))
    ).toBeVisible({ timeout: 60_000 });
  });

  test('EMPTY27: range planner — честный баннер без mock-tier', async ({ page }) => {
    const res = await page.goto('/brand/range-planner?collection=EMPTY27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('brand-dev-range-panel')).toBeVisible({ timeout: 90_000 });
    await expect(page.getByTestId('range-planner-empty-chain-notice')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId('range-planner-empty-chain-ss27-link')).toBeVisible();
    await expect(page.getByTestId('range-planner-core-demo-notice')).toHaveCount(0);
  });

  test('EMPTY27: оптовые заказы — нет phantom EMPTY27 id', async ({ page }) => {
    const res = await page.goto('/shop/b2b/orders?collection=EMPTY27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('platform-core-list-chrome')).toBeVisible({ timeout: 90_000 });
    await expect(page.getByTestId('page-shop-b2b-orders')).toBeVisible({ timeout: 60_000 });
    await expect(page.locator('body')).not.toContainText('B2B-DEMO-SHOP1-EMPTY27');
  });

  test('EMPTY27: production orders — empty state, без MES SS27', async ({ page }) => {
    const res = await page.goto('/factory/production/orders?collection=EMPTY27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('factory-production-orders-core')).toBeVisible({
      timeout: 90_000,
    });
    await expect(page.getByTestId('factory-production-order-mes-B2B-DEMO-SHOP1-SS27')).toHaveCount(
      0
    );
    await expect(page.getByTestId('factory-production-order-row-B2B-DEMO-SHOP1-SS27')).toHaveCount(
      0
    );
    await expect(page.getByTestId('factory-production-orders-empty-state')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId('factory-production-orders-empty-state')).toContainText(
      'Нет производственных серий'
    );
    await expect(page.getByTestId('factory-production-orders-empty-handoff-link')).toBeVisible();
  });

  test('EMPTY27: manufacturer cabinet order_production — без SS27 в URL', async ({ page }) => {
    const res = await gotoRoleCoreCabinet(
      page,
      '/factory/production/core?collection=EMPTY27&pillar=order_production'
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('role-core-cabinet-manufacturer')).toBeVisible({
      timeout: 60_000,
    });
    const cta = page.getByTestId('role-pillar-primary-cta');
    await expect(cta).toBeVisible({ timeout: 30_000 });
    await cta.click();
    await expect(page).not.toHaveURL(/B2B-DEMO-SHOP1-SS27/, { timeout: 30_000 });
    await expect(page).not.toHaveURL(/demo-ss27-01/, { timeout: 15_000 });
  });

  test('SS27: showroom — hero preview из dossier', async ({ page }) => {
    const res = await page.goto('/shop/b2b/showroom?collection=SS27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(
      page.getByTestId('shop-sc-showroom-panel').or(page.getByTestId('shop-showroom-core'))
    ).toBeVisible({ timeout: 60_000 });
    const hero = page
      .locator('[data-testid^="shop-sc-showroom-hero-"]')
      .or(page.locator('[data-testid^="shop-showroom-hero-"]'))
      .first();
    await expect(hero).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('shop-sc-showroom-checkout-link')).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByTestId('shop-sc-showroom-article-demo-ss27-01')).toBeVisible({
      timeout: 30_000,
    });
  });

  test('FW27: cross-role — linesheets → matrix → factory dossier → supplier', async ({
    page,
  }) => {
    let res = await page.goto('/brand/linesheets?collection=FW27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(
      page
        .getByTestId('brand-sc-linesheets-list')
        .or(page.getByTestId('brand-linesheets-core-list'))
    ).toBeVisible({ timeout: 30_000 });
    await page
      .getByTestId('brand-sc-linesheets-shop-matrix-link')
      .or(page.getByTestId('brand-linesheet-to-shop-matrix'))
      .click();
    await expect(page).toHaveURL(/\/shop\/b2b\/matrix.*collection=FW27/, { timeout: 30_000 });
    await expect(
      page.getByTestId('shop-co-matrix-shell').or(page.getByTestId('shop-b2b-matrix-shell'))
    ).toBeVisible({ timeout: 30_000 });

    res = await page.goto('/shop/b2b/orders/B2B-DEMO-SHOP1-FW27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('platform-core-order-detail-chrome')).toBeVisible({
      timeout: 30_000,
    });

    res = await page.goto('/factory/production/dossier/demo-fw27-01', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(
      page
        .getByTestId('mfr-dev-dossier-panel')
        .or(page.getByTestId('factory-dossier-core-chrome'))
    ).toBeVisible({ timeout: 30_000 });

    res = await gotoRoleCoreCabinet(
      page,
      '/factory/supplier/core?collection=FW27&pillar=development'
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('role-core-cabinet-supplier')).toBeVisible({ timeout: 90_000 });
    await expect(page.getByTestId('supplier-bom-preview-mini')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('supplier-bom-preview-mini-link')).toBeVisible({ timeout: 30_000 });

    res = await gotoRoleCoreCabinet(
      page,
      '/factory/supplier/core?collection=SS27&pillar=order_production'
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(
      page
        .getByTestId('sup-op-cabinet-panel')
        .or(page.getByTestId('supplier-procurement-pillar-card'))
    ).toBeVisible({
      timeout: 30_000,
    });
    await page.getByTestId('role-pillar-primary-cta').click();
    await expect(page).toHaveURL(/view=procurement/, { timeout: 30_000 });
    await expect(page).toHaveURL(/order=B2B-DEMO-SHOP1-SS27|orderId=B2B-DEMO-SHOP1-SS27/);
    await expect(page.getByTestId('materials-procurement-view')).toBeVisible({ timeout: 30_000 });
  });

  test('FW27: tracking deep link + чат с карточки заказа', async ({ page }) => {
    let res = await page.goto('/shop/b2b/orders', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('shop-b2b-order-row-B2B-DEMO-SHOP1-FW27')).toBeVisible({
      timeout: 30_000,
    });
    res = await page.goto('/shop/b2b/orders/B2B-DEMO-SHOP1-FW27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    const chatLink = page.getByTestId('shop-co-detail-chat-link');
    await expect(chatLink).toHaveAttribute('href', /\/shop\/messages\?contextType=b2b_order/);
    const chatHref = await chatLink.getAttribute('href');
    expect(chatHref).toBeTruthy();
    res = await page.goto(chatHref!, GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page).toHaveURL(/contextType=b2b_order.*B2B-DEMO-SHOP1-FW27/, {
      timeout: 30_000,
    });

    res = await page.goto('/shop/b2b/tracking?order=B2B-DEMO-SHOP1-FW27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(
      shopTrackingTestId(page, 'focus-row')
        .or(shopTrackingRow(page, 'B2B-DEMO-SHOP1-FW27'))
    ).toBeVisible({
      timeout: 30_000,
    });
  });

  test('tracking: резерв и шаги цепочки на строке заказа', async ({ page }) => {
    const res = await page.goto('/shop/b2b/tracking', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(
      shopTrackingTestId(page, 'list').or(page.getByTestId('platform-core-shop-tracking-list'))
    ).toBeVisible({
      timeout: 60_000,
    });
    await expect(shopTrackingTestId(page, 'sse-live-badge')).toHaveCount(0);
    await expect(shopTrackingTestId(page, 'poll-badge')).toHaveCount(0);
    const demoReserve = page.getByTestId('shop-co-tracking-reserve-B2B-DEMO-SHOP1-SS27').or(
      page.getByTestId('platform-core-tracking-reserve-B2B-DEMO-SHOP1-SS27')
    );
    await expect(demoReserve).toBeVisible({ timeout: 90_000 });
    await expect(
      page.getByTestId('platform-core-chain-step-production_po').first()
    ).toBeVisible({ timeout: 30_000 });
  });

  test('FW27: range planner — бюджеты из PostgreSQL (не partial)', async ({ page }) => {
    const res = await page.goto('/brand/range-planner?collection=FW27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(
      page.getByTestId('brand-dev-range-panel').or(page.getByTestId('range-planner-core'))
    ).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('range-planner-core-pg-badge')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('range-planner-core-demo-notice')).toHaveCount(0);
    await expect(page.getByTestId('range-planner-core-pg-tier-core')).toHaveText('1');
    await expect(page.getByTestId('range-planner-core-pg-tier-trend')).toHaveText('1');
    await expect(page.getByTestId('range-planner-core-pg-tier-novelty')).toHaveText('1');
  });

  test('FW27: hub readiness matrix — клик в цех разработки', async ({ page }) => {
    const res = await page.goto('/platform?collection=FW27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await openPlatformHubAuditView(page);
    await expect(page.getByTestId('readiness-score-brand-development')).toBeVisible({
      timeout: 60_000,
    });
    await openReadinessWorkspaceFromScore(page, 'brand', 'development');
    await expect(page).toHaveURL(/w2col=FW27/, { timeout: 30_000 });
    await expect(page.getByTestId('platform-core-development-chrome')).toBeVisible({
      timeout: 30_000,
    });
  });
});

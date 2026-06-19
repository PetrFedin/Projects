import { test, expect } from '@playwright/test';

/**
 * Platform Core workspace: pcf tab + wholesale context banner (P0 spine).
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-90-pillar-workspace-pcf.spec.ts
 */
const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 120_000 };
const DEMO_ORDER = 'B2B-DEMO-SHOP1-SS27';

test.describe('pillar workspace pcf navigation', () => {
  test('shop matrix shows core order banner and inspector tab', async ({ page }) => {
    await page.goto(
      `/shop/b2b/matrix?collection=SS27&order=${DEMO_ORDER}&pcf=matrix`,
      GOTO
    );
    await expect(page.getByTestId('platform-wholesale-order-context-banner')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId('pillar-workspace-shop-wholesale-matrix')).toBeVisible();
    await page.getByTestId('shop-matrix-feature-inspector').click();
    await expect(page.getByTestId('shop-matrix-inspector-empty')).toBeVisible({ timeout: 30_000 });
  });

  test('cross-link from matrix preserves wholesale order in URL', async ({ page }) => {
    await page.goto(
      `/shop/b2b/matrix?collection=SS27&order=${DEMO_ORDER}&pcf=matrix`,
      GOTO
    );
    const crossLinks = page.getByTestId('pillar-workspace-shop-wholesale-matrix-cross-links');
    await expect(crossLinks).toBeVisible({ timeout: 60_000 });
    const firstLink = crossLinks.locator('a').first();
    await firstLink.click();
    await page.waitForURL(/order=B2B-DEMO-SHOP1-SS27|orderId=B2B-DEMO-SHOP1-SS27/, {
      timeout: 60_000,
    });
    expect(page.url()).toMatch(/B2B-DEMO-SHOP1-SS27/);
  });

  test('replenishment stock-atp tab loads ledger rows', async ({ page }) => {
    await page.goto(
      `/shop/b2b/replenishment?collection=SS27&order=${DEMO_ORDER}&pcf=stock-atp`,
      GOTO
    );
    await expect(page.getByTestId('shop-replenishment-feature-stock-atp')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId(/shop-replenishment-stock-atp-source-/)).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.locator('[data-testid^="shop-replenishment-stock-row-"]').first()).toBeVisible({
      timeout: 60_000,
    });
  });

  test('shop inventory reconcile tab loads PG ledger rows', async ({ page }) => {
    await page.goto(`/shop/inventory?collection=SS27&order=${DEMO_ORDER}&pcf=reconcile`, GOTO);
    await expect(page.getByTestId('shop-inventory-reconcile-panel')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.locator('[data-testid^="shop-inventory-reconcile-row-"]').first()).toBeVisible({
      timeout: 60_000,
    });
  });

  test('brand agent rep ledger tab loads commission records', async ({ page }) => {
    await page.goto('/brand/distributor/commissions?pcf=ledger', GOTO);
    await expect(page.getByTestId('brand-agent-rep-ledger-panel')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId(/brand-agent-rep-ledger-source-/)).toBeVisible({
      timeout: 60_000,
    });
  });

  test('shop agent rep commission tab shows ledger source badge', async ({ page }) => {
    await page.goto('/shop/b2b/sales-rep-portal?pcf=commission', GOTO);
    await expect(page.getByTestId('shop-agent-rep-commission-panel')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId(/shop-agent-rep-commission-source-/)).toBeVisible({
      timeout: 60_000,
    });
  });

  test('brand CRM segments tab loads PG segment objects', async ({ page }) => {
    await page.goto('/brand/b2b/customer-groups?pcf=segments', GOTO);
    await expect(page.getByTestId('brand-crm-segmentation-segments-panel')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId(/brand-crm-segments-source-/)).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId(/brand-crm-segment-/).first()).toBeVisible({
      timeout: 60_000,
    });
  });

  test('platform partners directory shows PG onboarding panel', async ({ page }) => {
    await page.goto('/platform/b2b/partners?collection=SS27&pcf=directory', GOTO);
    await expect(page.getByTestId('platform-b2b-partners-onboarding-panel')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId(/platform-partners-onboarding-source-/)).toBeVisible({
      timeout: 60_000,
    });
  });

  test('brand production QC gate tab shows source badge', async ({ page }) => {
    await page.goto('/brand/production/operations?pcf=qc-gate&collection=SS27', GOTO);
    await expect(page.getByTestId('brand-production-qc-gate-panel')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId(/brand-qc-gate-source-/)).toBeVisible({
      timeout: 60_000,
    });
  });

  test('factory handoff queue panel shows SSE badge', async ({ page }) => {
    await page.goto('/factory/production?pcf=handoff&collection=SS27', GOTO);
    await expect(page.getByTestId('mfr-op-handoff-queue-panel')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId(/mfr-op-handoff-queue-sse-/)).toBeVisible({
      timeout: 60_000,
    });
  });

  test('shop order comms workspace shows notification center bar', async ({ page }) => {
    await page.goto(
      `/shop/b2b/tracking?collection=SS27&order=${DEMO_ORDER}&pcf=chat`,
      GOTO
    );
    await expect(page.getByTestId('shop-cm-workspace-notification-bar')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId('shop-cm-notification-center')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId(/shop-cm-inbox-sse-/)).toBeVisible({
      timeout: 60_000,
    });
  });

  test('brand centric RFQ tab shows PG quote cards after import', async ({ page }) => {
    const rfqId = `E2E-RFQ-${Date.now()}`;
    const importRes = await page.request.post('/api/integrations/v1/centric/rfq/import', {
      data: {
        rfqId,
        styleId: 'CENTRIC-demo-ss27-01',
        collectionId: 'SS27',
        articleId: 'demo-ss27-01',
        b2bOrderId: DEMO_ORDER,
      },
    });
    expect(importRes.ok()).toBeTruthy();

    await page.goto('/brand/integrations/archive/centric?pcf=rfq', GOTO);
    await expect(page.getByTestId('brand-centric-rfq-quote-cards-panel')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId(/brand-centric-rfq-quotes-source-/)).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId(/brand-centric-rfq-quote-card-/).first()).toBeVisible({
      timeout: 60_000,
    });
  });

  test('brand material passport certs tab loads PG cert rows', async ({ page }) => {
    await page.goto('/brand/merch/fabric-passport?collection=SS27&pcf=certs', GOTO);
    await expect(page.getByTestId('brand-material-passport-certs-panel')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId(/brand-material-passport-certs-source-/)).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId(/brand-material-passport-cert-row-/).first()).toBeVisible({
      timeout: 60_000,
    });
  });

  test('brand pricelist shop-sync tab shows tier sync and role badge', async ({ page }) => {
    await page.goto('/brand/b2b/price-lists?collection=SS27&pcf=shop-sync', GOTO);
    await expect(page.getByTestId('pillar-workspace-brand-pricelist-role-brand')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId('brand-pricelist-shop-sync-panel')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId(/brand-pricelist-tier-sync-source-/)).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId('brand-pricelist-tier-sync-row-retail_b')).toBeVisible({
      timeout: 60_000,
    });
  });

  test('shop landed margin pricelist tab shows synced tier mirror', async ({ page }) => {
    await page.goto(`/shop/b2b/margin-analysis?collection=SS27&order=${DEMO_ORDER}&pcf=pricelist`, GOTO);
    await expect(page.getByTestId('shop-landed-margin-pricelist-panel')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId(/shop-pricelist-tier-sync-source-/)).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId('shop-pricelist-tier-sync-row-retail_b')).toBeVisible({
      timeout: 60_000,
    });
  });

  test('shop matrix without order disables order-scoped cross-links', async ({ page }) => {
    await page.goto('/shop/b2b/matrix?collection=SS27&pcf=matrix', GOTO);
    await expect(page.getByTestId(/shop-co-matrix-tier-pricing-source-/)).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId('shop-co-matrix-cart-tier-standard')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId('platform-wholesale-order-context-cross-link-hint')).toBeVisible({
      timeout: 60_000,
    });
    await expect(
      page.getByTestId('pillar-workspace-shop-wholesale-matrix-cross-links-order-hint')
    ).toBeVisible({ timeout: 60_000 });
    await expect(
      page.getByTestId('pillar-workspace-shop-wholesale-matrix-cross-links-item-0-disabled').first()
    ).toBeVisible({ timeout: 60_000 });
  });

  test('manufacturer entity threads attach TZ on comms workspace', async ({ page }) => {
    await page.goto('/factory/production/messages?collection=SS27&pcf=entities&role=manufacturer', GOTO);
    await expect(page.getByTestId('manufacturer-comms-entity-threads-panel')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId('manufacturer-comms-entity-thread-attach-tz-dossier')).toBeVisible({
      timeout: 60_000,
    });
  });

  test('supplier entity threads attach TZ on comms workspace', async ({ page }) => {
    await page.goto(
      '/factory/supplier/messages?collection=SS27&article=demo-ss27-01&pcf=entities',
      GOTO
    );
    await expect(page.getByTestId('supplier-comms-entity-threads-panel')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId('supplier-comms-entity-thread-attach-tz-bom')).toBeVisible({
      timeout: 60_000,
    });
  });

  test('brand entity threads attach TZ button on comms workspace', async ({ page }) => {
    await page.goto('/brand/messages?collection=SS27&pcf=entities', GOTO);
    await expect(page.getByTestId('brand-comms-entity-threads-panel')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId('brand-comms-entity-thread-attach-tz-bom')).toBeVisible({
      timeout: 60_000,
    });
  });

  test('brand production cut ticket tab loads PG rows', async ({ page }) => {
    await page.goto(
      `/brand/production/operations?collection=SS27&order=${DEMO_ORDER}&pcf=cut-ticket`,
      GOTO
    );
    await expect(page.getByTestId('brand-production-cut-ticket-panel')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId(/brand-cut-ticket-source-/)).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId(/brand-cut-ticket-row-/).first()).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId('brand-cut-ticket-mfr-tab-link')).toBeVisible({
      timeout: 60_000,
    });
  });

  test('manufacturer cut ticket tab mirrors brand PG rows', async ({ page }) => {
    await page.goto(
      `/factory/production/orders?collection=SS27&order=${DEMO_ORDER}&pcf=cut-ticket`,
      GOTO
    );
    await expect(page.getByTestId('manufacturer-production-cut-ticket-panel')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId(/manufacturer-cut-ticket-source-/)).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId(/manufacturer-cut-ticket-row-/).first()).toBeVisible({
      timeout: 60_000,
    });
  });

  test('cross-link click propagates order from brand cut ticket to shop tracking', async ({
    page,
  }) => {
    await page.goto(
      `/brand/production/operations?collection=SS27&order=${DEMO_ORDER}&pcf=cut-ticket`,
      GOTO
    );
    await expect(page.getByTestId('brand-production-cut-ticket-panel')).toBeVisible({
      timeout: 60_000,
    });
    await page.getByRole('link', { name: 'Shop order tracking' }).click();
    await page.waitForURL(/shop\/b2b\/tracking/, { timeout: 60_000 });
    expect(page.url()).toMatch(/B2B-DEMO-SHOP1-SS27/);
  });

  test('brand production operations tab loads PG PO and BOM rows', async ({ page }) => {
    await page.goto(
      `/brand/production/operations?collection=SS27&order=${DEMO_ORDER}&pcf=operations`,
      GOTO
    );
    await expect(page.getByTestId('brand-production-operations-panel')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId(/brand-production-ops-po-source-/)).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId(/brand-production-ops-po-row-/).first()).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId(/brand-production-ops-bom-row-/).first()).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId('brand-production-ops-supplier-bom-link')).toBeVisible({
      timeout: 60_000,
    });
  });

  test('brand production operations push local to spine', async ({ page }) => {
    await page.goto(
      `/brand/production/operations?collection=SS27&order=${DEMO_ORDER}&pcf=operations`,
      GOTO
    );
    await expect(page.getByTestId('brand-production-operations-panel')).toBeVisible({
      timeout: 60_000,
    });
    await page.getByTestId('brand-production-ops-push-spine-btn').click();
    await expect(page.getByTestId('brand-production-ops-sync-msg')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId(/brand-production-ops-po-row-local-po-/)).toBeVisible({
      timeout: 60_000,
    });
  });
});

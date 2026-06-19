import { test, expect } from '@playwright/test';
import { gotoRoleCoreCabinet } from './helpers/core-chain-overview';
import { b2bV1ActorBrandHeaders } from './helpers/b2b-v1-api-headers';

const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 90_000 };
const W2_DEV_HEADERS = {
  'x-syntha-dev-bypass': '1',
  'x-syntha-workshop2-dev': '1',
} as const;

/**
 * P0 gaps: mini checkout, PG-native B2B, TZ export, showroom badges, contextual PG, factory export meta.
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-52-p0-wave-gaps.spec.ts
 */
test.describe('core-52: P0 wave gaps', () => {
  test('brand cabinet mini: checkout deep-link → shop checkout form', async ({ page }) => {
    const res = await page.goto('/brand/core?pillar=sample_collection&collection=SS27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('brand-sc-cabinet-panel')).toBeVisible({ timeout: 60_000 });
    const checkoutLink = page.getByTestId('brand-sc-golden-path-shop-checkout');
    await expect(checkoutLink).toBeVisible({ timeout: 30_000 });
    await expect(checkoutLink).toHaveAttribute('href', /\/shop\/b2b\/checkout\?collection=SS27/);
    const nav = page.waitForURL(/\/shop\/b2b\/checkout/, { timeout: 60_000 });
    await checkoutLink.click();
    await nav;
    await expect(
      page.getByTestId('shop-co-checkout-form').or(page.getByTestId('shop-b2b-checkout-form'))
    ).toBeVisible({ timeout: 60_000 });
  });

  test('shop showroom SS27: hero + partners + eligible badge on article card', async ({ page }) => {
    const res = await page.goto('/shop/b2b/showroom?collection=SS27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('shop-sc-showroom-panel')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('shop-sc-showroom-hero-demo-ss27-01')).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByTestId('shop-sc-showroom-matrix-hub-link')).toBeVisible({
      timeout: 15_000,
    });
    const articleCard = page.getByTestId('shop-sc-showroom-article-demo-ss27-01');
    await expect(articleCard).toBeVisible({ timeout: 30_000 });
    await expect(
      articleCard
        .getByTestId('shop-sc-eligible-demo-ss27-01')
        .or(articleCard.getByTestId('shop-sc-eligible-loading-demo-ss27-01'))
    ).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('shop-sc-matrix-entry-link-demo-ss27-01')).toBeVisible({
      timeout: 15_000,
    });
  });

  test('shop showroom EMPTY27: empty onboarding + partners CTA on full page', async ({ page }) => {
    const res = await page.goto('/shop/b2b/showroom?collection=EMPTY27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('shop-sc-showroom-empty-onboarding')).toBeVisible({
      timeout: 120_000,
    });
    await expect(page.getByTestId('shop-sc-showroom-empty-partners-link')).toHaveAttribute(
      'href',
      /partners/
    );
  });

  test('shop cabinet mini EMPTY27: empty + golden path strip', async ({ page }) => {
    const res = await gotoRoleCoreCabinet(
      page,
      '/shop/core?collection=EMPTY27&pillar=sample_collection'
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(
      page.getByTestId('shop-sc-cabinet-empty').or(page.getByTestId('shop-showroom-mini-empty'))
    ).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('shop-sc-cabinet-golden-path')).toBeVisible({ timeout: 30_000 });
  });

  test('W2 dossier: composition label panel + TZ export status (gate or ZIP)', async ({
    page,
    request,
  }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    test.skip(!healthRes.ok(), 'health API недоступен');

    const res = await page.goto(
      '/brand/production/workshop2/c/SS27/a/demo-ss27-01?w2pane=tz&w2sec=material',
      GOTO
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('brand-dev-dossier-panel')).toBeVisible({ timeout: 60_000 });
    const compositionPanel = page.getByTestId('workshop2-dossier-composition-label-panel');
    await compositionPanel.scrollIntoViewIfNeeded();
    await expect(compositionPanel).toBeVisible({ timeout: 60_000 });

    const exportApi = await request.get(
      '/api/workshop2/articles/SS27/demo-ss27-01/export-tz-bundle',
      { headers: W2_DEV_HEADERS }
    );
    expect([200, 409]).toContain(exportApi.status());

    const exportResponse = page.waitForResponse(
      (r) => r.url().includes('/export-tz-bundle') && r.request().method() === 'GET',
      { timeout: 60_000 }
    );
    await page.getByTestId('brand-w2-tz-export-btn').click();
    const exportRes = await exportResponse;
    expect([200, 409]).toContain(exportRes.status());
    await expect(page.getByTestId('brand-w2-tz-export-btn-status')).toBeVisible({ timeout: 15_000 });
  });

  test('factory dossier: export SKU meta + print TZ button', async ({ page }) => {
    const res = await page.goto('/factory/production/dossier/demo-ss27-01', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(
      page.getByTestId('factory-dossier-core-chrome').or(page.getByTestId('mfr-dev-dossier-panel'))
    ).toBeVisible({ timeout: 60_000 });
    const skuStrip = page.getByTestId('factory-dossier-export-sku');
    await expect(skuStrip).toBeVisible({ timeout: 30_000 });
    await expect(skuStrip).toContainText('SKU в экспорте ТЗ');
    await expect(page.getByTestId('mfr-op-dossier-print-btn')).toBeVisible({ timeout: 30_000 });
  });

  test('PG-primary: native W2 orders in brand + operational APIs', async ({ request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as {
      demoSeeded?: boolean;
      pgReachable?: boolean;
      spineOperationalPgPrimary?: boolean;
      operationalOrdersSource?: string;
    };
    test.skip(!health.demoSeeded || !health.pgReachable, 'нужен db:core:bootstrap + PG');

    const brandRes = await request.get('/api/brand/b2b/orders?collectionId=SS27');
    expect(brandRes.ok()).toBe(true);
    const brandJson = (await brandRes.json()) as { orders?: Array<{ id: string }> };
    expect(brandJson.orders?.some((o) => o.id === 'B2B-DEMO-SHOP1-SS27')).toBe(true);

    if (health.spineOperationalPgPrimary) {
      expect(health.operationalOrdersSource).toMatch(/postgres/);
      const opRes = await request.get('/api/b2b/v1/operational-orders', {
        headers: b2bV1ActorBrandHeaders,
      });
      expect(opRes.ok()).toBe(true);
      const opJson = (await opRes.json()) as {
        data?: { orders?: Array<{ wholesaleOrderId?: string }> };
      };
      const ids = opJson.data?.orders?.map((o) => o.wholesaleOrderId) ?? [];
      expect(ids).toContain('B2B-DEMO-SHOP1-SS27');
    }
  });

  test('contextual chat: POST message round-trips via PG GET', async ({ request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { pgReachable?: boolean };
    test.skip(!health.pgReachable, 'нужен PG');

    const marker = `core52-pg-${Date.now()}`;
    const postRes = await request.post('/api/messages/contextual', {
      data: {
        contextType: 'b2b_order',
        contextId: 'B2B-DEMO-SHOP1-SS27',
        message: marker,
      },
    });
    expect(postRes.status()).toBe(201);

    const getRes = await request.get(
      `/api/messages/contextual?contextType=b2b_order&contextId=${encodeURIComponent('B2B-DEMO-SHOP1-SS27')}`
    );
    expect(getRes.ok()).toBe(true);
    const getJson = (await getRes.json()) as { messages?: Array<{ message: string }> };
    expect(getJson.messages?.some((m) => m.message === marker)).toBe(true);
  });

  test('range planner: tier assign panel or assigned tiers visible', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    test.skip(!healthRes.ok(), 'health API недоступен');

    const res = await page.goto('/brand/range-planner?collection=SS27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('brand-dev-range-panel')).toBeVisible({ timeout: 60_000 });

    const assignPanel = page.getByTestId('range-planner-tier-assign-panel');
    if ((await assignPanel.count()) > 0) {
      await expect(assignPanel).toBeVisible({ timeout: 15_000 });
      const firstRow = page.locator('[data-testid^="range-planner-unassigned-"]').first();
      await expect(firstRow).toBeVisible({ timeout: 15_000 });
      return;
    }

    await expect(page.getByTestId('range-planner-core-pg-tier-core')).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByTestId('range-planner-tier-margin-input-core')).toBeVisible({
      timeout: 15_000,
    });
  });

  test('shop2 buyer: PG registry lists B2B-DEMO-SHOP2-SS27 after bootstrap seed', async ({
    request,
  }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    test.skip(!healthRes.ok(), 'health API недоступен');

    const listRes = await request.get(
      '/api/shop/b2b/orders?buyerId=shop2&collectionId=SS27'
    );
    expect(listRes.ok()).toBe(true);
    const json = (await listRes.json()) as { ok?: boolean; orders?: Array<{ id: string }> };
    expect(json.ok).toBe(true);
    expect(json.orders?.some((o) => o.id === 'B2B-DEMO-SHOP2-SS27')).toBe(true);
  });

  test('brand retailers: PG summary displayNameRu for shop1 and shop2', async ({ request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    test.skip(!healthRes.ok(), 'health API недоступен');

    const res = await request.get('/api/brand/retailers/b2b-orders-summary');
    expect(res.ok()).toBe(true);
    const json = (await res.json()) as {
      ok?: boolean;
      byRetailerId?: Record<string, { displayNameRu?: string }>;
    };
    expect(json.ok).toBe(true);
    expect(json.byRetailerId?.shop1?.displayNameRu).toContain('Москва');
    expect(json.byRetailerId?.shop2?.displayNameRu).toContain('Петербург');
  });

  test('brand showroom SS27: cross-role audit → peer checkout form', async ({ page }) => {
    const res = await page.goto('/brand/showroom?collection=SS27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('brand-sc-unified-audit-path')).toBeVisible({
      timeout: 60_000,
    });
    const checkoutLink = page.getByTestId('brand-sc-showroom-shop-checkout-link');
    await expect(checkoutLink).toHaveAttribute('href', /\/shop\/b2b\/checkout\?collection=SS27/);
    const nav = page.waitForURL(/\/shop\/b2b\/checkout/, { timeout: 60_000 });
    await checkoutLink.click();
    await nav;
    await expect(
      page.getByTestId('shop-co-checkout-form').or(page.getByTestId('shop-b2b-checkout-form'))
    ).toBeVisible({ timeout: 60_000 });
  });

  test('shop matrix SS27: season summary strip links FW27', async ({ page }) => {
    const res = await page.goto('/shop/b2b/matrix?collection=SS27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('shop-co-season-matrix-strip')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId('shop-co-season-matrix-link-SS27')).toBeVisible();
    await expect(page.getByTestId('shop-co-season-matrix-link-FW27')).toHaveAttribute(
      'href',
      /\/shop\/b2b\/matrix\?collection=FW27/
    );
  });

  test('shop showroom SS27: quick-add scrolls to matrix row', async ({ page }) => {
    const res = await page.goto('/shop/b2b/showroom?collection=SS27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('shop-sc-showroom-panel')).toBeVisible({ timeout: 60_000 });
    const quickAdd = page.getByTestId('shop-sc-showroom-matrix-quick-add-demo-ss27-01');
    await expect(quickAdd).toBeVisible({ timeout: 30_000 });
    const nav = page.waitForURL(/\/shop\/b2b\/matrix.*article=demo-ss27-01/, {
      timeout: 60_000,
    });
    await quickAdd.click();
    await nav;
    await expect(page.getByTestId('shop-sc-matrix-entry-panel')).toBeVisible({ timeout: 30_000 });
    await expect(
      page
        .getByTestId('shop-co-matrix-row-demo-ss27-01')
        .or(page.getByTestId('shop-b2b-matrix-row-demo-ss27-01'))
    ).toBeVisible({ timeout: 30_000 });
  });

  test('shop checkout: multi-buyer peer picker visible', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    test.skip(!healthRes.ok(), 'health API недоступен');

    const res = await page.goto('/shop/b2b/checkout?collection=SS27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('shop-co-checkout-buyer-picker')).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByTestId('shop-b2b-buyer-switcher')).toBeVisible({ timeout: 15_000 });
  });

  test('EMPTY27 linesheets: honest empty copy', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    test.skip(!healthRes.ok(), 'health API недоступен');

    const res = await page.goto('/brand/linesheets?collection=EMPTY27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    const emptyCopy = page.getByTestId('brand-sc-linesheets-empty-copy');
    await expect(emptyCopy.or(page.getByTestId('brand-sc-linesheets-list'))).toBeVisible({
      timeout: 60_000,
    });
    if (await emptyCopy.isVisible().catch(() => false)) {
      await expect(emptyCopy).toContainText(/пустой|EMPTY27|SS27/i);
    }
  });

  test('brand registry: invite panel for new retailer', async ({ page }) => {
    const res = await page.goto('/brand/b2b/orders?collection=SS27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('brand-co-registry-invite-generate')).toBeVisible({
      timeout: 60_000,
    });
  });

  test('B2B invoice: schet-offerta.pdf returns jsPDF binary', async ({ request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    test.skip(!healthRes.ok(), 'health API недоступен');

    const pdfRes = await request.get(
      '/api/shop/b2b/orders/B2B-DEMO-SHOP1-SS27/schet-offerta.pdf?format=pdf',
      { headers: { Accept: 'application/pdf' } }
    );
    expect(pdfRes.status()).toBeLessThan(500);
    expect(pdfRes.headers()['content-type']).toContain('application/pdf');
    expect(pdfRes.headers()['x-workshop2-invoice-pipeline']).toBe('jspdf_binary_v1');
    const body = await pdfRes.body();
    expect(body.byteLength).toBeGreaterThan(200);
    expect(body.subarray(0, 4).toString()).toBe('%PDF');
  });
});

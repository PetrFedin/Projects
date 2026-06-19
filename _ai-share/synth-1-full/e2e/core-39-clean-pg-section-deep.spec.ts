import { test, expect } from '@playwright/test';
import { gotoRoleCoreCabinet } from './helpers/core-chain-overview';
import { CORE39_GOTO, setupCleanPgHandoffOrder } from './helpers/core-clean-pg-setup';

/** Wave 23: clean PG section deep — split serial tests (stable vs monolith core-39). */
test.describe.configure({ mode: 'serial' });

let sharedOrderId = '';

test.describe('core-39: clean PG section deep smoke', () => {
  test('setup: checkout→handoff PG order + registry API', async ({ page, request }) => {
    test.setTimeout(180_000);
    sharedOrderId = await setupCleanPgHandoffOrder(page, request);
  });

  test('brand×co + shop×co section pages on PG order', async ({ page }) => {
    test.skip(!sharedOrderId, 'depends on setup');
    test.setTimeout(180_000);
    const orderId = sharedOrderId;

    const brandDetail = await page.goto(
      `/brand/b2b-orders/${encodeURIComponent(orderId)}`,
      CORE39_GOTO
    );
    expect(brandDetail?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('brand-co-detail-panel')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('brand-co-shop-disclosure-preview-strip')).toBeVisible({
      timeout: 30_000,
    });
    expect(page.url()).not.toMatch(/B2B-DEMO/);

    const brandCoCabinet = await gotoRoleCoreCabinet(
      page,
      '/brand/core?pillar=collection_order&collection=SS27'
    );
    expect(brandCoCabinet?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('brand-co-cabinet-panel')).toBeVisible({ timeout: 60_000 });

    const shopDetail = await page.goto(
      `/shop/b2b/orders/${encodeURIComponent(orderId)}#shop-co-buyer-tracking`,
      CORE39_GOTO
    );
    expect(shopDetail?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('shop-co-detail-panel')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('shop-co-detail-context-strip')).toBeVisible({
      timeout: 30_000,
    });

    const shopTracking = await page.goto('/shop/b2b/tracking?collection=SS27', CORE39_GOTO);
    expect(shopTracking?.status() ?? 599).toBeLessThan(500);
    await expect
      .poll(
        async () => {
          const list = page.getByTestId('shop-co-tracking-list');
          const empty = page.getByTestId('platform-core-tracking-empty');
          if ((await list.count()) > 0) return 'list';
          if ((await empty.count()) > 0) return 'empty';
          return '';
        },
        { timeout: 60_000 }
      )
      .not.toBe('');
  });

  test('mfr×dev/op + sup×comms + brand×dev W2 on PG order', async ({ page, request }) => {
    test.skip(!sharedOrderId, 'depends on setup');
    test.setTimeout(180_000);
    const orderId = sharedOrderId;

    const mfrProd = await page.goto('/factory/production?collection=SS27', CORE39_GOTO);
    expect(mfrProd?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('factory-w2-sample-queue')).toBeVisible({ timeout: 60_000 });
    await page.locator('#handoff-queue').scrollIntoViewIfNeeded();
    await expect(page.getByTestId('mfr-op-handoff-queue-panel')).toBeVisible({ timeout: 60_000 });

    const bundleLink = page.getByTestId(`mfr-op-handoff-shop-floor-bundle-${orderId}`);
    if ((await bundleLink.count()) > 0) {
      await expect(bundleLink).toBeVisible({ timeout: 30_000 });
      const href = await bundleLink.getAttribute('href');
      expect(href).toMatch(/shop-floor-bundle/);
      expect(href).toMatch(new RegExp(orderId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    }

    const supComms = await gotoRoleCoreCabinet(
      page,
      '/factory/supplier/core?pillar=comms&collection=SS27'
    );
    expect(supComms?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('comms-pillar-card')).toBeVisible({ timeout: 60_000 });

    const w2Hub = await page.goto('/brand/production/workshop2?w2col=SS27', CORE39_GOTO);
    expect(w2Hub?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('brand-dev-w2-hub-panel')).toBeVisible({ timeout: 60_000 });

    const calRes = await request.get(
      `/api/workshop2/platform-core/calendar-events?collectionId=SS27&orderId=${encodeURIComponent(orderId)}`
    );
    expect(calRes.ok()).toBe(true);
    const calJson = (await calRes.json()) as { events?: Array<{ id: string }> };
    expect((calJson.events?.length ?? 0) >= 1).toBe(true);
  });
});

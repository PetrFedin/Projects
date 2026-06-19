import { test, expect } from '@playwright/test';
import { gotoRoleCoreCabinet } from './helpers/core-chain-overview';
import {
  checkoutPgOrderViaMatrix,
  confirmPgOrderViaApi,
  handoffPgOrderViaApi,
} from './helpers/core-checkout-pg';

test.describe.configure({ mode: 'serial' });

test.describe('core-36: supplier delivery confirm + mfr shop-floor bundle', () => {
  test('supplier comms: delivery confirm → calendar task idempotent', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = await checkoutPgOrderViaMatrix(page);
    await confirmPgOrderViaApi(request, orderId);
    await handoffPgOrderViaApi(request, orderId);

    const res = await gotoRoleCoreCabinet(
      page,
      '/factory/supplier/core?pillar=comms&collection=SS27'
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('sup-cm-material-quote-card')).toBeVisible({ timeout: 60_000 });

    const confirmBtn = page.getByTestId('sup-cm-delivery-confirm-btn');
    if ((await confirmBtn.count()) > 0) {
      await confirmBtn.click();
      await expect(page.getByTestId('sup-cm-quote-materials-confirmed-badge')).toBeVisible({
        timeout: 30_000,
      });
    }

    const postRes = await request.post(
      `/api/workshop2/supplier/b2b-orders/${encodeURIComponent(orderId)}/delivery-confirm`,
      {
        headers: { 'Content-Type': 'application/json' },
        data: {
          collectionId: 'SS27',
          articleId: 'demo-ss27-01',
          confirmedCount: 2,
        },
      }
    );
    expect(postRes.ok()).toBe(true);
    const postJson = (await postRes.json()) as { ok?: boolean; created?: boolean };
    expect(postJson.ok).toBe(true);

    const second = await request.post(
      `/api/workshop2/supplier/b2b-orders/${encodeURIComponent(orderId)}/delivery-confirm`,
      {
        headers: { 'Content-Type': 'application/json' },
        data: {
          collectionId: 'SS27',
          articleId: 'demo-ss27-01',
          confirmedCount: 2,
        },
      }
    );
    expect(second.ok()).toBe(true);
    const secondJson = (await second.json()) as { ok?: boolean; created?: boolean };
    expect(secondJson.ok).toBe(true);
    expect(secondJson.created).toBe(false);

    const calRes = await request.get(
      '/api/workshop2/platform-core/calendar-events?collectionId=SS27&orderId=' +
        encodeURIComponent(orderId)
    );
    expect(calRes.ok()).toBe(true);
    const calJson = (await calRes.json()) as { events?: Array<{ id: string }> };
    expect(calJson.events?.some((e) => e.id === `supplier-delivery-${orderId}`)).toBe(true);
  });

  test('mfr op: shop-floor bundle download link on dossier chrome', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = await checkoutPgOrderViaMatrix(page);
    await confirmPgOrderViaApi(request, orderId);
    await handoffPgOrderViaApi(request, orderId);

    const res = await page.goto(
      '/factory/production?collection=SS27#handoff-queue',
      { waitUntil: 'domcontentloaded', timeout: 60_000 }
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('mfr-op-handoff-queue-panel')).toBeVisible({ timeout: 60_000 });

    const bundleLink = page.getByTestId(`mfr-op-handoff-shop-floor-bundle-${orderId}`);
    await expect(bundleLink).toBeVisible({ timeout: 60_000 });
    const href = await bundleLink.getAttribute('href');
    expect(href).toMatch(/shop-floor-bundle/);
  });
});

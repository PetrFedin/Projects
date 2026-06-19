import { test, expect } from '@playwright/test';
import {
  checkoutPgOrderViaMatrix,
  confirmPgOrderViaApi,
  handoffPgOrderViaApi,
} from './helpers/core-checkout-pg';

const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 60_000 };

test.describe.configure({ mode: 'serial' });

/** Wave 11–12: supplier comms clean PG, peer-insight hub matrix, cross-role comms peers. */
test.describe('core-31: supplier comms + peer-insight + cross-role peers', () => {
  test('supplier comms hub resolves PG order after handoff', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = await checkoutPgOrderViaMatrix(page);
    await confirmPgOrderViaApi(request, orderId);
    await handoffPgOrderViaApi(request, orderId);

    const res = await page.goto('/factory/supplier/core?pillar=comms&collection=SS27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('comms-pillar-card')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('sup-cm-cabinet-thread-strip')).toBeVisible({
      timeout: 60_000,
    });
    const orderChat = page.getByTestId('sup-cm-order-chat-link');
    if ((await orderChat.count()) > 0) {
      await expect(orderChat.first()).toHaveAttribute(
        'href',
        new RegExp(orderId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      );
      await expect(orderChat.first()).not.toHaveAttribute('href', /B2B-DEMO/);
    }
  });

  test('shop peer-insight development pillar mounts insight panel', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    await page.goto('/shop/core?pillar=development&collection=SS27', GOTO);
    await expect(page.getByTestId('role-pillar-development')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId('shop-development-bridge')).toBeVisible({
      timeout: 60_000,
    });
    const peerBadge = page.getByTestId('role-pillar-development-peer-badge');
    if ((await peerBadge.count()) > 0) {
      await expect(peerBadge).toContainText(/контекст/i);
    }
  });

  test('hub readiness matrix: inactive pillars show em dash, no peer legend', async ({
    page,
    request,
  }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    await page.goto('/platform?collection=SS27&views=audit', GOTO);
    await expect(page.getByTestId('platform-core-readiness-matrix')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId('platform-core-readiness-peer-legend')).toHaveCount(0);
    const shopDevScore = page.getByTestId('readiness-score-shop-development');
    await expect(shopDevScore).toBeVisible();
    await expect(shopDevScore).toHaveText('—');
    const brandDevScore = page.getByTestId('readiness-score-brand-development');
    await expect(brandDevScore).not.toHaveText('—');
  });

  test('brand comms cross-role peer links to shop messages on PG order', async ({
    page,
    request,
  }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = await checkoutPgOrderViaMatrix(page);
    await confirmPgOrderViaApi(request, orderId);

    await page.goto('/brand/core?pillar=comms&collection=SS27', GOTO);
    await expect(page.getByTestId('role-pillar-cross-role-comms')).toBeVisible({
      timeout: 60_000,
    });
    const shopPeer = page.getByTestId('cross-role-demo-shop-comms');
    await expect(shopPeer).toBeVisible({ timeout: 30_000 });
    await expect(shopPeer).toHaveAttribute(
      'href',
      new RegExp(orderId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    );
  });

  test('registry export JSON includes spineChannel field', async ({ request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean; pgReachable?: boolean };
    test.skip(!health.demoSeeded || !health.pgReachable, 'нужен db:core:bootstrap + PG');

    const res = await request.get('/api/brand/b2b/orders/export?format=json&collectionId=SS27');
    expect(res.ok()).toBeTruthy();
    const json = (await res.json()) as {
      orders?: Array<{ orderId?: string; spineChannel?: string }>;
    };
    expect(Array.isArray(json.orders)).toBe(true);
    if ((json.orders?.length ?? 0) > 0) {
      expect(json.orders![0]).toHaveProperty('spineChannel');
    }
  });
});

import { test, expect } from '@playwright/test';
import {
  checkoutPgOrderViaMatrix,
  confirmPgOrderViaApi,
  ensurePgContextualThreadViaApi,
  fetchPgContextualMessages,
  handoffPgOrderViaApi,
} from './helpers/core-checkout-pg';

const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 60_000 };

/**
 * Clean PG comms spine: checkout B2B-\\d+ → contextual thread без B2B-DEMO-* → hub comms (4 роли).
 */
test.describe.configure({ mode: 'serial' });

test.describe('core-20: clean PG comms spine', () => {
  test('checkout creates PG contextual thread (GET /api/messages/contextual)', async ({
    page,
    request,
  }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap (SS27 publish)');

    const orderId = await checkoutPgOrderViaMatrix(page);
    expect(orderId).toMatch(/^B2B-\d+$/);

    const messages = await fetchPgContextualMessages(request, orderId);
    expect(messages.length).toBeGreaterThanOrEqual(1);

    const ensure = await ensurePgContextualThreadViaApi(request, orderId);
    expect(ensure.created).toBe(false);
    expect(ensure.messageCount).toBeGreaterThanOrEqual(1);
  });

  test('ensure-b2b-order API accepts pillar/section context', async ({ request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = `B2B-${Date.now()}`;
    const created = await ensurePgContextualThreadViaApi(request, orderId, {
      pillarId: 'collection_order',
      sectionId: 'shop-cm-order-chat',
      source: 'registry',
    });
    expect(created.created).toBe(true);
    expect(created.messageCount).toBe(1);

    const messages = await fetchPgContextualMessages(request, orderId);
    expect(messages.length).toBe(1);
    expect(messages[0]?.message).toMatch(/collection_order/);
  });

  test('shop comms hub resolves clean PG order thread strip', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = await checkoutPgOrderViaMatrix(page);
    await confirmPgOrderViaApi(request, orderId);

    const res = await page.goto('/shop/core?pillar=comms&collection=SS27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('comms-pillar-card')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('shop-cm-cabinet-thread-strip')).toBeVisible({
      timeout: 30_000,
    });
    await expect(
      page.getByTestId('shop-cm-cabinet-thread-list').or(page.getByTestId('shop-cm-cabinet-po-inbox'))
    ).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('shop-cm-order-chat-link')).toHaveAttribute(
      'href',
      new RegExp(orderId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    );
    await expect(page.getByTestId('shop-cm-order-chat-link')).not.toHaveAttribute(
      'href',
      /B2B-DEMO/
    );
  });

  test('brand comms hub after handoff shows PG order (not demo pin)', async ({
    page,
    request,
  }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = await checkoutPgOrderViaMatrix(page);
    await confirmPgOrderViaApi(request, orderId);
    await handoffPgOrderViaApi(request, orderId);

    const res = await page.goto('/brand/core?pillar=comms&collection=SS27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('brand-cm-cabinet-thread-strip')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId('brand-cm-order-chat-link')).toHaveAttribute(
      'href',
      new RegExp(orderId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    );

    const messagesRes = await page.goto(
      `/brand/messages?order=${encodeURIComponent(orderId)}&orderId=${encodeURIComponent(orderId)}`,
      GOTO
    );
    expect(messagesRes?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('platform-core-comms-cross-nav')).toBeVisible({
      timeout: 60_000,
    });
  });

  test('manufacturer comms inbox includes handoff PG order', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = await checkoutPgOrderViaMatrix(page);
    await confirmPgOrderViaApi(request, orderId);
    await handoffPgOrderViaApi(request, orderId);

    const res = await page.goto('/factory/production/core?pillar=comms&collection=SS27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('mfr-cm-cabinet-thread-strip')).toBeVisible({
      timeout: 60_000,
    });
    await expect(
      page.getByTestId('mfr-cm-cabinet-po-inbox').or(page.getByTestId('mfr-cm-cabinet-thread-list'))
    ).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('mfr-cm-order-chat-link')).toHaveAttribute(
      'href',
      new RegExp(orderId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    );
  });
});

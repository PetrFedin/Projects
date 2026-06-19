import { test, expect } from '@playwright/test';
import { checkoutPgOrderViaMatrix, confirmPgOrderViaApi } from './helpers/core-checkout-pg';

const GOTO = { waitUntil: 'commit' as const, timeout: 120_000 };

/** Wave 27: brand×sample linesheet unified path + comms auto-thread from order detail chat. */
test.describe('core-46: linesheet audit + order detail comms thread', () => {
  test('linesheets full page: unified audit path + published sync badge', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const res = await page.goto('/brand/linesheets?collection=SS27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('brand-sc-linesheets-panel')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('brand-sc-unified-audit-path')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('brand-sc-linesheets-published-sync')).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByTestId('brand-sc-publish-audit-log')).toBeVisible({ timeout: 30_000 });
  });

  test('clean PG: brand order detail chat → section auto-thread', async ({ page, request }) => {
    test.setTimeout(240_000);
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = await checkoutPgOrderViaMatrix(page);
    await confirmPgOrderViaApi(request, orderId);
    expect(orderId).toMatch(/^B2B-\d+$/);

    const detailRes = await page.goto(`/brand/b2b-orders/${encodeURIComponent(orderId)}`, GOTO);
    expect(detailRes?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('brand-co-detail-panel')).toBeVisible({ timeout: 60_000 });

    const chat = page.getByTestId('brand-co-detail-chat-link');
    await expect(chat).toBeVisible({ timeout: 30_000 });
    const href = await chat.getAttribute('href');
    expect(href).toContain('pillar=collection_order');
    expect(href).toContain('section=brand-co-detail');
    expect(href).toContain(orderId);

    const messagesRes = await page.goto(href!, GOTO);
    expect(messagesRes?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('comms-section-context-auto-thread')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId('comms-section-context-auto-thread')).toHaveAttribute(
      'data-section-id',
      'brand-co-detail'
    );
  });
});

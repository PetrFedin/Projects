import { test, expect } from '@playwright/test';
import { gotoRoleCoreCabinet } from './helpers/core-chain-overview';
import {
  checkoutPgOrderViaMatrix,
  confirmPgOrderViaApi,
  handoffPgOrderViaApi,
} from './helpers/core-checkout-pg';

const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 60_000 };

test.describe.configure({ mode: 'serial' });

test.describe('core-25: comms notification center + supplier quote', () => {
  test('shop comms notification center loads on clean PG order', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = await checkoutPgOrderViaMatrix(page);
    await confirmPgOrderViaApi(request, orderId);

    const res = await gotoRoleCoreCabinet(page, '/shop/core?pillar=comms&collection=SS27');
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('comms-pillar-card')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('shop-cm-notification-center')).toBeVisible({ timeout: 30_000 });
    await expect(
      page
        .getByTestId('shop-cm-notification-unread-list')
        .or(page.getByTestId('shop-cm-notification-empty'))
    ).toBeVisible({ timeout: 30_000 });
  });

  test('supplier comms quote card after handoff', async ({ page, request }) => {
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
    await expect(page.getByTestId('comms-pillar-card')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('sup-cm-material-quote-card')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('sup-cm-quote-bom-lines')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('sup-cm-quote-send-link')).toHaveAttribute('href', /article=/);
  });

  test('shop sample empty showroom onboarding CTAs', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const res = await gotoRoleCoreCabinet(
      page,
      '/shop/core?pillar=sample_collection&collection=EMPTY27'
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(
      page.getByTestId('shop-sc-cabinet-empty').or(page.getByTestId('shop-showroom-mini-empty'))
    ).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('shop-sc-cabinet-golden-path')).toBeVisible({ timeout: 30_000 });
    await expect(
      page.getByTestId('shop-sc-cabinet-panel').or(page.getByTestId('shop-showroom-mini'))
    ).toBeVisible({ timeout: 30_000 });
  });
});

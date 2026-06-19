import { test, expect } from '@playwright/test';
import { gotoRoleCoreCabinet } from './helpers/core-chain-overview';
import { checkoutPgOrderViaMatrix } from './helpers/core-checkout-pg';

const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 90_000 };

/**
 * Wave 45: dossier decomposition smoke + shop notification prefs + placeholder surfaces.
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-62-wave-d-dossier-prefs.spec.ts
 */
test.describe('core-62: Wave D dossier + comms prefs + placeholders', () => {
  test('brand collaborations: demo disclaimer in core', async ({ page }) => {
    const res = await page.goto('/brand/collaborations', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('platform-core-placeholder-brand-collaborations')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId('platform-core-placeholder-brand-collaborations')).toContainText(
      /Демо/i
    );
  });

  test('shop comms hub: notification prefs compact', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    await checkoutPgOrderViaMatrix(page);

    const res = await gotoRoleCoreCabinet(page, '/shop/core?pillar=comms&collection=SS27');
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('shop-cm-notification-center-compact')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId('shop-cm-notification-prefs-compact')).toBeVisible({
      timeout: 30_000,
    });
    await page.getByTestId('shop-cm-notification-prefs-compact').locator('summary').click();
    await expect(page.getByTestId('shop-cm-notification-pref-order-status')).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByTestId('shop-cm-notification-pref-chat')).toBeVisible();
  });

  test('W2 dossier panel loads after decomposition', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const res = await page.goto(
      '/brand/production/workshop2/c/SS27/a/demo-ss27-01?tab=tz',
      GOTO
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('brand-dev-dossier-panel')).toBeVisible({
      timeout: 120_000,
    });
  });
});

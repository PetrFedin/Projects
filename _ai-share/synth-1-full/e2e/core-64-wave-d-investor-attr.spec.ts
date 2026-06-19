import { test, expect } from '@playwright/test';
import { gotoRoleCoreCabinet } from './helpers/core-chain-overview';

const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 90_000 };

/**
 * Wave 47: investor-summary read-only + attr-comments controller extract.
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-64-wave-d-investor-attr.spec.ts
 */
test.describe('core-64: Wave D investor-summary + dossier attr-comments', () => {
  test('investor-summary: readiness + brief badges (invest path)', async ({ page }) => {
    const res = await page.goto('/brand/production/workshop2/investor-summary', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('workshop2-investor-summary-page')).toBeVisible({
      timeout: 60_000,
    });
    const badges = page.getByTestId('workshop2-investor-summary-badges');
    await expect(badges).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('workshop2-investor-summary-pdf-link')).toBeVisible();
  });

  test('platform hub: investor demo banner скрыт в core mode', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const res = await page.goto('/platform?collection=SS27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('workshop2-investor-demo-hub-banner')).toHaveCount(0);
  });

  test('W2 dossier: panel loads after attr-comments extract', async ({ page, request }) => {
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

import { test, expect } from '@playwright/test';
import { gotoPlatformCoreWorkspace } from './helpers/core-chain-overview';

const DOSSIER_URL = '/factory/production/dossier/demo-ss27-01?collection=SS27';

async function expectNoPageOverflow(page: import('@playwright/test').Page): Promise<void> {
  await expect
    .poll(
      () =>
        page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
      { timeout: 30_000 }
    )
    .toBe(true);
}

test.describe('core-99: factory dossier viewports', () => {
  test('iPhone 393 — panel, context strip, portal toolbar, no overflow', async ({ page }) => {
    test.setTimeout(240_000);
    await page.setViewportSize({ width: 393, height: 812 });

    const res = await gotoPlatformCoreWorkspace(page, DOSSIER_URL);
    expect(res?.status() ?? 599).toBeLessThan(500);

    await expect(
      page
        .getByTestId('mfr-dev-dossier-panel')
        .or(page.getByTestId('factory-dossier-core-chrome'))
    ).toBeVisible({ timeout: 120_000 });
    await expect(page.getByTestId('mfr-dev-dossier-context-strip')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId('mfr-dev-dossier-brand-w2-link')).toBeVisible();
    await expect(page.getByTestId('factory-portal-panel')).toBeVisible();
    await expect(page.getByTestId('factory-portal-status')).toBeVisible();
    await expect(page.getByTestId('factory-portal-view-factory-pack')).toBeVisible();
    await expect(page.getByTestId('mfr-dev-dossier-actions-strip')).toBeVisible();

    await expectNoPageOverflow(page);
  });

  test('iPad 834 — portal doc toggle, actions, no overflow', async ({ page }) => {
    test.setTimeout(240_000);
    await page.setViewportSize({ width: 834, height: 1194 });

    const res = await gotoPlatformCoreWorkspace(page, DOSSIER_URL);
    expect(res?.status() ?? 599).toBeLessThan(500);

    await expect(page.getByTestId('mfr-dev-dossier-panel')).toBeVisible({ timeout: 120_000 });
    await expect(page.getByTestId('mfr-dev-dossier-context-strip')).toBeVisible();
    await expect(page.getByTestId('factory-portal-view-factory-pack')).toBeVisible();
    await expect(page.getByTestId('factory-portal-view-final-tz')).toBeVisible();
    await expect(page.getByTestId('mfr-op-dossier-print-btn')).toBeVisible();

    await expectNoPageOverflow(page);
  });
});

import { test, expect } from '@playwright/test';
import { gotoRoleCoreCabinet } from './helpers/core-chain-overview';

const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 90_000 };

/**
 * Wave 46: dossier persist core-state + brand OP BOM single line + typecheck gate.
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-63-wave-d-persist-typecheck.spec.ts
 */
test.describe('core-63: Wave D persist zone + OP BOM summary', () => {
  test('brand OP hub: BOM + materials в одной строке', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const res = await gotoRoleCoreCabinet(
      page,
      '/brand/core?pillar=order_production&collection=SS27'
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    const bom = page.getByTestId('brand-op-bom-preview-badge');
    await expect(bom).toBeVisible({ timeout: 60_000 });
    const text = (await bom.textContent())?.trim() ?? '';
    expect(text).toMatch(/BOM \d+/);
    await expect(page.getByTestId('brand-op-materials-step-badge')).toHaveCount(0);
  });

  test('W2 dossier: persist zone — panel loads after core-state extract', async ({
    page,
    request,
  }) => {
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

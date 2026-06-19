import { test, expect } from '@playwright/test';
import { gotoRoleCoreCabinet } from './helpers/core-chain-overview';

const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 90_000 };

/**
 * Wave 49: tz signoff zone hook + brand tasks core calendar strip.
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-66-wave-d-tz-signoff-tasks.spec.ts
 */
test.describe('core-66: Wave D tz signoff zone + brand tasks core', () => {
  test('brand tasks: core calendar strip + PG kanban testid', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const res = await gotoRoleCoreCabinet(page, '/brand/tasks');
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('brand-tasks-core-calendar-strip')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId('brand-tasks-kanban-pg')).toBeVisible({ timeout: 60_000 });
  });

  test('W2 dossier: panel after tz signoff zone extract', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const res = await page.goto(
      '/brand/production/workshop2/c/SS27/a/demo-ss27-01?tab=general',
      GOTO
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('brand-dev-dossier-panel')).toBeVisible({
      timeout: 120_000,
    });
  });

  test('decomposition: tz signoff zone hook present', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const panel = fs.readFileSync(
      path.join(process.cwd(), 'src/components/brand/production/Workshop2Phase1DossierPanel.tsx'),
      'utf8'
    );
    expect(panel).toContain('useWorkshop2Phase1DossierTzSignoffZone');
  });
});

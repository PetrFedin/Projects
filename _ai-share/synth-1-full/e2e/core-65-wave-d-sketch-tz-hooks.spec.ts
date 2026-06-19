import { test, expect } from '@playwright/test';
import { gotoRoleCoreCabinet } from './helpers/core-chain-overview';

const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 90_000 };

/**
 * Wave 48: dossier sketch + final TZ wizard hooks + typecheck:ci gate.
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-65-wave-d-sketch-tz-hooks.spec.ts
 */
test.describe('core-65: Wave D sketch/tz hooks + CI typecheck scope', () => {
  test('W2 dossier: panel + sketch workspace after hook extract', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const res = await page.goto(
      '/brand/production/workshop2/c/SS27/a/demo-ss27-01?tab=visuals',
      GOTO
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('brand-dev-dossier-panel')).toBeVisible({
      timeout: 120_000,
    });
  });

  test('brand dev hub: dossier decomposition hooks wired (jest contract)', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const panel = fs.readFileSync(
      path.join(process.cwd(), 'src/components/brand/production/Workshop2Phase1DossierPanel.tsx'),
      'utf8'
    );
    expect(panel).toContain('useWorkshop2Phase1DossierSketchWorkspaceState');
    expect(panel).toContain('useWorkshop2Phase1DossierFinalTzWizardController');
    const tsconfig = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'tsconfig.ci.json'), 'utf8')
    ) as { exclude?: string[] };
    expect(tsconfig.exclude ?? []).toEqual(
      expect.arrayContaining(['**/__tests__/**', '**/*.test.ts'])
    );
  });
});

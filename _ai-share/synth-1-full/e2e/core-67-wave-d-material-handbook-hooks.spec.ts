import { test, expect } from '@playwright/test';
import { gotoRoleCoreCabinet } from './helpers/core-chain-overview';

const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 90_000 };

/**
 * Wave 50: material BOM zone + handbook control + active section rows hooks.
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-67-wave-d-material-handbook-hooks.spec.ts
 */
test.describe('core-67: Wave D material BOM + handbook control hooks', () => {
  test('W2 dossier: panel loads after wave 50 hook extract', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const res = await page.goto(
      '/brand/production/workshop2/c/SS27/a/demo-ss27-01?tab=material',
      GOTO
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('brand-dev-dossier-panel')).toBeVisible({
      timeout: 120_000,
    });
  });

  test('decomposition: wave 50 hooks present in panel + manifest', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const root = path.join(process.cwd(), 'src/components/brand/production');
    const panel = fs.readFileSync(path.join(root, 'Workshop2Phase1DossierPanel.tsx'), 'utf8');
    const manifest = fs.readFileSync(
      path.join(root, 'workshop2-phase1-dossier-panel-decomposition-manifest.ts'),
      'utf8'
    );
    expect(panel).toContain('useWorkshop2Phase1DossierMaterialBomZone');
    expect(panel).toContain('useWorkshop2Phase1DossierHandbookControlZone');
    expect(panel).toContain('useWorkshop2Phase1DossierActiveSectionRows');
    expect(manifest).toContain('use-workshop2-phase1-dossier-material-bom-zone.ts');
    expect(manifest).toContain('use-workshop2-phase1-dossier-handbook-control-zone.ts');
    expect(manifest).toContain('use-workshop2-phase1-dossier-active-section-rows.ts');
  });
});

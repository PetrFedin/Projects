import { test, expect } from '@playwright/test';

/**
 * Wave 67: mat derived + material sketch nav + panel shell zones.
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-84-wave-t-mat-shell-zones.spec.ts
 */
test.describe('core-84: Wave T mat derived + shell zones', () => {
  test('derived mat, sketch nav, shell hooks wired in panel', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const root = path.join(process.cwd(), 'src');
    const panel = fs.readFileSync(
      path.join(root, 'components/brand/production/Workshop2Phase1DossierPanel.tsx'),
      'utf8'
    );
    const manifest = fs.readFileSync(
      path.join(root, 'components/brand/production/workshop2-phase1-dossier-panel-decomposition-manifest.ts'),
      'utf8'
    );

    expect(panel).toContain('useWorkshop2Phase1DossierMatCatalogDerivedZone');
    expect(panel).toContain('useWorkshop2Phase1DossierMaterialSketchNavZone');
    expect(panel).toContain('useWorkshop2Phase1DossierPanelShellZone');
    expect(panel).not.toContain('buildWorkshop2VisualGateItems');
    expect(panel).not.toContain('handleRollbackToDevelopment = ()');
    expect(manifest).toContain('use-workshop2-phase1-dossier-panel-shell-zone.tsx');
  });
});

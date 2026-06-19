import { test, expect } from '@playwright/test';

/**
 * Wave 71: panel tail zone composes section body + layout pipeline.
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-88-wave-x-panel-tail.spec.ts
 */
test.describe('core-88: Wave X panel tail zone', () => {
  test('tail zone + tail bundles wired in orchestrator', async () => {
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

    expect(panel).toContain('useWorkshop2Phase1DossierPanelTailZone');
    expect(panel).toContain('buildWorkshop2Phase1DossierPanelTailInput');
    expect(panel).not.toContain('useWorkshop2Phase1DossierPanelMainLayoutZone(');
    expect(panel).not.toContain('useWorkshop2Phase1DossierSectionBodyInputZone(');
    expect(manifest).toContain('use-workshop2-phase1-dossier-panel-tail-zone.tsx');
    expect(manifest).toContain('workshop2-phase1-dossier-panel-tail-bundles.ts');
  });
});

import { test, expect } from '@playwright/test';

/**
 * Wave 70: section body input bundles + body shell / post-main trail props + tz minimal defer.
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-87-wave-w-props-bundles.spec.ts
 */
test.describe('core-87: Wave W props bundles + tz minimal defer', () => {
  test('bundled props zones wired in orchestrator', async () => {
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

    expect(panel).toContain('useWorkshop2Phase1DossierSectionBodyInputZone');
    expect(panel).toContain('useWorkshop2Phase1DossierBodyShellPropsZone');
    expect(panel).toContain('useWorkshop2Phase1DossierPostMainTrailPropsZone');
    expect(panel).toContain('useWorkshop2Phase1DossierTzMinimalDeferZone');
    expect(panel).not.toContain('useWorkshop2Phase1DossierTzMinimalMode(');
    expect(manifest).toContain('use-workshop2-phase1-dossier-section-body-input-zone.ts');
    expect(manifest).toContain('use-workshop2-phase1-dossier-tz-minimal-defer-zone.ts');
  });
});

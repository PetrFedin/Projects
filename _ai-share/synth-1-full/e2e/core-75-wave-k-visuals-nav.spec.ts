import { test, expect } from '@playwright/test';

/**
 * Wave 58: visuals catalog + nav sections + handbook check state.
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-75-wave-k-visuals-nav.spec.ts
 */
test.describe('core-75: Wave K visuals catalog + nav sections', () => {
  test('visuals catalog zone + nav sections + handbook check state', async () => {
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

    expect(panel).toContain('useWorkshop2Phase1DossierVisualsCatalogZone');
    expect(panel).toContain('useWorkshop2Phase1DossierNavSectionsZone');
    expect(panel).toContain('isWorkshop2Phase1DossierHandbookCheckClean');
    expect(panel).toContain('buildWorkshop2Phase1DossierMaterialMatHint');
    expect(manifest).toContain('use-workshop2-phase1-dossier-visuals-catalog-zone.ts');
    expect(manifest).toContain('use-workshop2-phase1-dossier-nav-sections-zone.ts');
    expect(manifest).toContain('workshop2-phase1-dossier-handbook-check-state.ts');
    expect(panel).not.toContain('visualsCatalogSketchLinksForPins = useMemo');
  });
});

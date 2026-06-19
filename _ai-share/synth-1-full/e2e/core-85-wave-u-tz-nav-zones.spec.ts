import { test, expect } from '@playwright/test';

/**
 * Wave 68: TZ active section + view nav + save draft zones.
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-85-wave-u-tz-nav-zones.spec.ts
 */
test.describe('core-85: Wave U TZ nav + save draft zones', () => {
  test('active section, view nav, save draft hooks wired', async () => {
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

    expect(panel).toContain('useWorkshop2Phase1DossierTzActiveSectionZone');
    expect(panel).toContain('useWorkshop2Phase1DossierViewNavZone');
    expect(panel).toContain('useWorkshop2Phase1DossierSaveDraftZone');
    expect(panel).not.toContain('handleSelectTzSection = useCallback');
    expect(panel).not.toContain('useWorkshop2Phase1DossierNavSectionsZone(');
    expect(panel).toContain('jumpToBrandNotesAttribute');
    expect(manifest).toContain('use-workshop2-phase1-dossier-tz-active-section-zone.ts');
  });
});

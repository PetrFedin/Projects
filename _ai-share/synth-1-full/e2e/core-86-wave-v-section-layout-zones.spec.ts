import { test, expect } from '@playwright/test';

/**
 * Wave 69: section body + main layout zones.
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-86-wave-v-section-layout-zones.spec.ts
 */
test.describe('core-86: Wave V section body + layout zones', () => {
  test('section body and panel main layout hooks wired', async () => {
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

    expect(panel).toContain('useWorkshop2Phase1DossierSectionBodyZone');
    expect(panel).toContain('useWorkshop2Phase1DossierPanelMainLayoutZone');
    expect(panel).toContain('return panelRoot');
    expect(panel).not.toContain('Workshop2Phase1DossierPanelSectionBody');
    expect(panel).not.toContain('Workshop2Phase1DossierPanelBodyShell');
    expect(manifest).toContain('use-workshop2-phase1-dossier-section-body-zone.tsx');
    expect(manifest).toContain('use-workshop2-phase1-dossier-panel-main-layout-zone.tsx');
  });
});

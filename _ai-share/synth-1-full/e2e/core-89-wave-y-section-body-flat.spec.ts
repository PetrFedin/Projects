import { test, expect } from '@playwright/test';

/**
 * Wave 72: flat section body scope → buildWorkshop2Phase1DossierSectionBodyInputBundles.
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-89-wave-y-section-body-flat.spec.ts
 */
test.describe('core-89: Wave Y section body flat scope', () => {
  test('sectionBodyFlat + builder wired in orchestrator', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const root = path.join(process.cwd(), 'src');
    const panel = fs.readFileSync(
      path.join(root, 'components/brand/production/Workshop2Phase1DossierPanel.tsx'),
      'utf8'
    );
    const inputZone = fs.readFileSync(
      path.join(root, 'components/brand/production/use-workshop2-phase1-dossier-section-body-input-zone.ts'),
      'utf8'
    );
    const tailBundles = fs.readFileSync(
      path.join(root, 'components/brand/production/workshop2-phase1-dossier-panel-tail-bundles.ts'),
      'utf8'
    );

    expect(panel).toContain('sectionBodyFlat:');
    expect(panel).not.toContain('sectionBody: {');
    expect(inputZone).toContain('buildWorkshop2Phase1DossierSectionBodyInputBundles');
    expect(inputZone).toContain('Workshop2Phase1DossierSectionBodyFlatScope');
    expect(tailBundles).toContain('buildWorkshop2Phase1DossierSectionBodyInputBundles(sectionBodyFlat)');
  });
});

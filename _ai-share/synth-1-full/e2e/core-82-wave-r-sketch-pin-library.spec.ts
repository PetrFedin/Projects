import { test, expect } from '@playwright/test';

/**
 * Wave 65: sketch pin library zone (snapshots + dossier/org templates).
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-82-wave-r-sketch-pin-library.spec.ts
 */
test.describe('core-82: Wave R sketch pin library zone', () => {
  test('sketch pin library hook wired in panel + manifest', async () => {
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
    const hook = fs.readFileSync(
      path.join(root, 'components/brand/production/use-workshop2-phase1-dossier-sketch-pin-library-zone.ts'),
      'utf8'
    );

    expect(panel).toContain('useWorkshop2Phase1DossierSketchPinLibraryZone');
    expect(panel).not.toContain('appendOrgSketchPinTemplate');
    expect(panel).not.toContain('saveMasterSketchPinTemplate = useCallback');
    expect(manifest).toContain('use-workshop2-phase1-dossier-sketch-pin-library-zone.ts');
    expect(hook).toContain('saveSketchLabelsSnapshot');
    expect(hook).toContain('orgSketchTemplatesList');
  });
});

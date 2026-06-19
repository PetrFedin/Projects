import { test, expect } from '@playwright/test';

/**
 * Wave 66: handbook mutations zone (catalog nav + assignments + SKU/name).
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-83-wave-s-handbook-mutations.spec.ts
 */
test.describe('core-83: Wave S handbook mutations zone', () => {
  test('handbook mutations hook wired; inline catalog nav removed from panel', async () => {
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
      path.join(root, 'components/brand/production/use-workshop2-phase1-dossier-handbook-mutations-zone.ts'),
      'utf8'
    );

    expect(panel).toContain('useWorkshop2Phase1DossierHandbookMutationsZone');
    expect(panel).not.toContain('onSetHandbookParameters = useCallback');
    expect(panel).not.toContain('handbookL1OptionsForAudience');
    expect(manifest).toContain('use-workshop2-phase1-dossier-handbook-mutations-zone.ts');
    expect(hook).toContain('commitSku');
    expect(hook).toContain('patchColor');
  });
});

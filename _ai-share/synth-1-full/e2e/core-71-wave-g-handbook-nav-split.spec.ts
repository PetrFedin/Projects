import { test, expect } from '@playwright/test';

/**
 * Wave 54: handbook-warnings zone + hub-matrix / b2b tabs split + materials tsc.
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-71-wave-g-handbook-nav-split.spec.ts
 */
test.describe('core-71: Wave G handbook warnings + nav split', () => {
  test('handbook warnings hook + hub-matrix role-pillar hrefs + b2b tabs split', async () => {
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
    const hubMatrix = fs.readFileSync(path.join(root, 'lib/platform-core-hub-matrix.ts'), 'utf8');
    const roleHrefs = fs.readFileSync(
      path.join(root, 'lib/platform-core-hub-matrix-role-pillar-hrefs.ts'),
      'utf8'
    );
    const b2bMatrix = fs.readFileSync(path.join(root, 'lib/data/b2b-workspace-matrix.ts'), 'utf8');
    const b2bTabs = fs.readFileSync(path.join(root, 'lib/data/b2b-workspace-matrix-tabs.ts'), 'utf8');
    const materials = fs.readFileSync(
      path.join(root, 'app/factory/production/materials/materials-core.tsx'),
      'utf8'
    );

    expect(panel).toContain('useWorkshop2Phase1DossierHandbookWarningsZone');
    expect(manifest).toContain('use-workshop2-phase1-dossier-handbook-warnings-zone.ts');
    expect(manifest).toContain('workshop2-phase1-dossier-handbook-warnings.ts');
    expect(hubMatrix).toContain('platform-core-hub-matrix-role-pillar-hrefs');
    expect(roleHrefs).toContain('getRolePillarDemoHrefForDemo');
    expect(b2bMatrix).toContain('b2b-workspace-matrix-tabs');
    expect(b2bTabs).toContain('WORKSPACE_TABS');
    expect(materials).toContain('SupplierBomLineInput[]');
    expect(materials).not.toContain('bomLines as readonly SupplierBomLineInput');
  });
});

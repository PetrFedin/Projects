import { test, expect } from '@playwright/test';

/**
 * Wave 55: section-readiness zone + b2b flow split + materials tsc narrow.
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-72-wave-h-section-readiness-flow.spec.ts
 */
test.describe('core-72: Wave H section readiness + b2b flow split', () => {
  test('section readiness zone + b2b flow config split + materials BOM map', async () => {
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
    const b2bMatrix = fs.readFileSync(path.join(root, 'lib/data/b2b-workspace-matrix.ts'), 'utf8');
    const b2bFlow = fs.readFileSync(path.join(root, 'lib/data/b2b-workspace-matrix-flow.ts'), 'utf8');
    const materials = fs.readFileSync(
      path.join(root, 'app/factory/production/materials/materials-core.tsx'),
      'utf8'
    );

    expect(panel).toContain('useWorkshop2Phase1DossierSectionReadinessZone');
    expect(manifest).toContain('use-workshop2-phase1-dossier-section-readiness-zone.ts');
    expect(manifest).toContain('workshop2-phase1-dossier-section-readiness.ts');
    expect(b2bMatrix).toContain('b2b-workspace-matrix-flow');
    expect(b2bFlow).toContain('FLOW_CONFIG');
    expect(b2bFlow).toContain('DIGITAL_WORKSPACE_CONNECTIONS');
    expect(materials).toMatch(/materialName\?\.trim\(\)/);
  });
});

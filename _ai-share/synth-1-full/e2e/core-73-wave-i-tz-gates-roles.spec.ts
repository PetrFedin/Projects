import { test, expect } from '@playwright/test';

/**
 * Wave 56: tz-gates zone + b2b roles split.
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-73-wave-i-tz-gates-roles.spec.ts
 */
test.describe('core-73: Wave I tz gates + b2b roles split', () => {
  test('tz gates zone hook + b2b roles config split', async () => {
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
    const tzGates = fs.readFileSync(
      path.join(root, 'components/brand/production/workshop2-phase1-dossier-tz-gates.ts'),
      'utf8'
    );
    const b2bMatrix = fs.readFileSync(path.join(root, 'lib/data/b2b-workspace-matrix.ts'), 'utf8');
    const b2bRoles = fs.readFileSync(path.join(root, 'lib/data/b2b-workspace-matrix-roles.ts'), 'utf8');

    expect(panel).toContain('useWorkshop2Phase1DossierTzGatesZone');
    expect(manifest).toContain('use-workshop2-phase1-dossier-tz-gates-zone.ts');
    expect(tzGates).toContain('buildWorkshop2Phase1DossierFactorySendHubPreview');
    expect(b2bMatrix).toContain('b2b-workspace-matrix-roles');
    expect(b2bRoles).toContain('ROLE_PERMISSIONS');
    expect(panel).not.toContain('buildWorkshop2TzGateSnapshot(dossier');
  });
});

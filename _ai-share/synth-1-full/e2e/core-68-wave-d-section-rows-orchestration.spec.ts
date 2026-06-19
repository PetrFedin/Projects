import { test, expect } from '@playwright/test';

/**
 * Wave 51: section rows orchestration hook + platform-core tsc fixes.
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-68-wave-d-section-rows-orchestration.spec.ts
 */
test.describe('core-68: Wave D section rows orchestration', () => {
  test('decomposition: orchestration hook + platform-core tsc surfaces', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const src = path.join(process.cwd(), 'src');
    const panel = fs.readFileSync(
      path.join(src, 'components/brand/production/Workshop2Phase1DossierPanel.tsx'),
      'utf8'
    );
    const manifest = fs.readFileSync(
      path.join(src, 'components/brand/production/workshop2-phase1-dossier-panel-decomposition-manifest.ts'),
      'utf8'
    );
    const tracking = fs.readFileSync(
      path.join(src, 'components/platform/PlatformCoreShopB2bTrackingPanel.tsx'),
      'utf8'
    );
    const planner = fs.readFileSync(path.join(src, 'lib/platform-core-planner.ts'), 'utf8');

    expect(panel).toContain('useWorkshop2Phase1DossierSectionRowsOrchestration');
    expect(manifest).toContain('use-workshop2-phase1-dossier-section-rows-orchestration.ts');
    expect(tracking).toContain('B2bChainPhaseBadge');
    expect(planner).toMatch(/techDebtRaw\.map/);
    expect(planner).not.toContain('applyAutoDoneStatus(\n    applyRuntimeOverlay');
  });
});

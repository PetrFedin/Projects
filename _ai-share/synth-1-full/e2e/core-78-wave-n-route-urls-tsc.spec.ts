import { test, expect } from '@playwright/test';

/**
 * Wave 61: route URLs zone + full tsc incremental fixes.
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-78-wave-n-route-urls-tsc.spec.ts
 */
test.describe('core-78: Wave N route urls zone + tsc helpers', () => {
  test('route urls hook wired; sewingPatterns routes exist', async () => {
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
    const routes = fs.readFileSync(path.join(root, 'lib/routes.ts'), 'utf8');

    expect(panel).toContain('useWorkshop2Phase1DossierRouteUrlsZone');
    expect(panel).not.toContain('buildWorkshop2VisualsTzSignoffShareAbsoluteUrl');
    expect(manifest).toContain('use-workshop2-phase1-dossier-route-urls-zone.ts');
    expect(routes).toContain("sewingPatterns: '/client/sewing-patterns'");
    expect(routes).toContain('sewingPatternsPresetEditor');
  });
});

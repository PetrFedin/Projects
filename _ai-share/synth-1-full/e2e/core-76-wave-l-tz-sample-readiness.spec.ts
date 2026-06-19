import { test, expect } from '@playwright/test';

/**
 * Wave 59: TZ digital approval + sample-readiness zone.
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-76-wave-l-tz-sample-readiness.spec.ts
 */
test.describe('core-76: Wave L tz sample readiness zone', () => {
  test('tz sample readiness hook wired; inline signoff block removed', async () => {
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

    expect(panel).toContain('useWorkshop2Phase1DossierTzSampleReadinessZone');
    expect(panel).toContain('tzReadyForSample');
    expect(manifest).toContain('use-workshop2-phase1-dossier-tz-sample-readiness-zone.ts');
    expect(manifest).toContain('workshop2-phase1-dossier-tz-sample-readiness.ts');
    expect(panel).not.toContain('workshopTzSignoffRequiredForRole');
    expect(panel).not.toMatch(/const tzReadyForSample\s*=\s*\n\s*sectionReadiness\.general/);
  });
});

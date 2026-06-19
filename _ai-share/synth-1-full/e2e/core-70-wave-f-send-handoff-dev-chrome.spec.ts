import { test, expect } from '@playwright/test';

/**
 * Wave 53: send-handoff zone + dev chrome golden-path suppress.
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-70-wave-f-send-handoff-dev-chrome.spec.ts
 */
test.describe('core-70: Wave F send-handoff + dev chrome', () => {
  test('dossier send-handoff zone + dev chrome suppress', async () => {
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
    const chrome = fs.readFileSync(path.join(root, 'components/layout/dev-only-chrome.tsx'), 'utf8');
    const planner = fs.readFileSync(path.join(root, 'lib/platform-core-planner.ts'), 'utf8');

    expect(panel).toContain('useWorkshop2Phase1DossierSendHandoffZone');
    expect(manifest).toContain('use-workshop2-phase1-dossier-send-handoff-zone.ts');
    expect(chrome).toMatch(/isPlatformCoreGoldenPath\(pathname\)[\s\S]{0,40}return null/);
    expect(planner).toContain('isDiscoveredTechDebtNoise');
  });
});

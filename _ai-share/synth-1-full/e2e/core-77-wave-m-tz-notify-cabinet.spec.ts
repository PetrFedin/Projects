import { test, expect } from '@playwright/test';

/**
 * Wave 60: TZ notify actions zone + cabinet hub tsc fixes.
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-77-wave-m-tz-notify-cabinet.spec.ts
 */
test.describe('core-77: Wave M tz notify zone + cabinet types', () => {
  test('tz notify hook wired; cabinet hub title row exported', async () => {
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
    const chrome = fs.readFileSync(
      path.join(root, 'components/layout/cabinet-hub-chrome.tsx'),
      'utf8'
    );
    const hubSidebar = fs.readFileSync(
      path.join(root, 'components/hub/HubSidebar.tsx'),
      'utf8'
    );

    expect(panel).toContain('useWorkshop2Phase1DossierTzNotifyActionsZone');
    expect(panel).not.toContain('notifyResponsibleForTzRowAction');
    expect(manifest).toContain('use-workshop2-phase1-dossier-tz-notify-actions-zone.ts');
    expect(chrome).toContain('export type { CabinetHubTitleRowProps }');
    expect(chrome).toContain('showDemoMark');
    expect(hubSidebar).toContain('ReadonlyArray<(typeof SYNTHA_SIDEBAR_CLUSTERS)[number]>');
  });
});

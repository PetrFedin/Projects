import { test, expect } from '@playwright/test';

/**
 * Wave 57: passport partitions + final TZ export zones.
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-74-wave-j-passport-export.spec.ts
 */
test.describe('core-74: Wave J passport partitions + final TZ export', () => {
  test('passport partitions + final tz export zone hooks', async () => {
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
    const partitions = fs.readFileSync(
      path.join(root, 'components/brand/production/workshop2-phase1-dossier-passport-partitions.ts'),
      'utf8'
    );
    const exportZone = fs.readFileSync(
      path.join(root, 'components/brand/production/workshop2-phase1-dossier-final-tz-export.ts'),
      'utf8'
    );

    expect(panel).toContain('useWorkshop2Phase1DossierPassportPartitionsZone');
    expect(panel).toContain('useWorkshop2Phase1DossierFinalTzExportZone');
    expect(manifest).toContain('use-workshop2-phase1-dossier-passport-partitions-zone.ts');
    expect(manifest).toContain('use-workshop2-phase1-dossier-final-tz-export-zone.ts');
    expect(partitions).toContain('buildWorkshop2Phase1DossierPassportPartitions');
    expect(exportZone).toContain('buildWorkshop2Phase1DossierFinalTzAssignmentChain');
    expect(panel).not.toContain('partitionGeneralPassportRows(generalRowsForPassport');
  });
});

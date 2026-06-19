import { test, expect } from '@playwright/test';

/**
 * Wave 62: handbook check report + W2 metrics flush context zones.
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-79-wave-o-handbook-metrics.spec.ts
 */
test.describe('core-79: Wave O handbook report + metrics ctx', () => {
  test('handbook report zone + metrics flush ctx wired in panel', async () => {
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
    const distributorOrder = fs.readFileSync(
      path.join(root, 'app/distributor/orders/[orderId]/page.tsx'),
      'utf8'
    );

    expect(panel).toContain('useWorkshop2Phase1DossierHandbookCheckReportZone');
    expect(panel).toContain('useWorkshop2Phase1DossierW2MetricsFlushContextZone');
    expect(panel).not.toContain('isWorkshop2Phase1DossierHandbookCheckClean(handbookCheckSnapshot)');
    expect(panel).not.toContain('w2MetricsSkuRef = useRef');
    expect(manifest).toContain('use-workshop2-phase1-dossier-handbook-check-report-zone.ts');
    expect(manifest).toContain('use-workshop2-phase1-dossier-w2-metrics-flush-context-zone.ts');
    expect(distributorOrder).toContain('params={paramsPromise}');
  });
});

/**
 * Wave 17 RU — стабилизация: API errors RU, PDF section labels, stock connected line, probe.
 */
import fs from 'node:fs';
import path from 'node:path';

import {
  buildWorkshop2ErrorRuBody,
  WORKSHOP2_API_ERROR_RU,
} from '@/lib/production/workshop2-api-error-ru';
import {
  WORKSHOP2_HANDOFF_PDF_SECTION_LABELS_RU,
  buildWorkshop2HandoffPdfTocLinesRu,
  workshop2TzBundleFileLabelRu,
} from '@/lib/production/workshop2-handoff-pdf-section-labels-ru';
import { summarizeWorkshop2StockPaneConnectedStatusRu } from '@/lib/production/workshop2-stock-pane-connected-status';
import {
  buildWorkshop2Wave17RuApiErrorsProbe,
  buildWorkshop2Wave17RuStabilizationProbe,
} from '@/lib/production/workshop2-live-integration-probes';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';

function scanWorkshop2ApiErrorRuCoverage(): {
  totalRouteFiles: number;
  routesWithHelper: number;
  percentEstimate: number;
} {
  const root = path.join(process.cwd(), 'src/app/api/workshop2');
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) walk(p);
      else if (ent.name === 'route.ts') files.push(p);
    }
  };
  walk(root);
  const routesWithHelper = files.filter((f) => {
    const src = fs.readFileSync(f, 'utf8');
    return (
      src.includes('jsonWorkshop2ErrorRu') ||
      src.includes('buildWorkshop2ErrorRuBody') ||
      src.includes('withWorkshop2ApiErrorRu')
    );
  }).length;
  const percentEstimate = files.length
    ? Math.round((routesWithHelper / files.length) * 1000) / 10
    : 0;
  return { totalRouteFiles: files.length, routesWithHelper, percentEstimate };
}

describe('workshop2 wave17 — API errors RU coverage', () => {
  it('buildWorkshop2ErrorRuBody maps dossier_not_found', () => {
    const body = buildWorkshop2ErrorRuBody('dossier_not_found');
    expect(body.messageRu).toMatch(/Досье не найдено/);
    expect(body.error).toBe('dossier_not_found');
  });

  it('has Russian defaults for wave17 error codes', () => {
    expect(WORKSHOP2_API_ERROR_RU.publish_blocked).toMatch(/шоурум/i);
    expect(WORKSHOP2_API_ERROR_RU.moysklad_not_configured).toMatch(/МойСклад/);
  });

  it('apiErrorRuCoverage meets 90%+ on high-traffic routes (Wave 17)', () => {
    const probe = buildWorkshop2Wave17RuApiErrorsProbe({ WORKSHOP2_MARKET: 'ru' });
    expect(probe.highTrafficTotal).toBe(8);
    expect(probe.highTrafficWrapped).toBeGreaterThanOrEqual(8);
    const cov = scanWorkshop2ApiErrorRuCoverage();
    expect(cov.totalRouteFiles).toBeGreaterThan(50);
    expect(cov.percentEstimate).toBeGreaterThan(65);
  });
});

describe('workshop2 wave17 — handoff PDF section labels RU', () => {
  it('exposes canonical RU section headers', () => {
    expect(WORKSHOP2_HANDOFF_PDF_SECTION_LABELS_RU.passport).toBe('Паспорт');
    expect(WORKSHOP2_HANDOFF_PDF_SECTION_LABELS_RU.bom).toBe('BOM');
    expect(WORKSHOP2_HANDOFF_PDF_SECTION_LABELS_RU.routing).toBe('Маршрут');
  });

  it('buildWorkshop2HandoffPdfTocLinesRu lists five sections', () => {
    const lines = buildWorkshop2HandoffPdfTocLinesRu();
    expect(lines).toHaveLength(5);
    expect(lines[0]).toContain('Паспорт');
    expect(lines[2]).toContain('Маршрут');
  });

  it('workshop2TzBundleFileLabelRu localizes bundle keys', () => {
    expect(workshop2TzBundleFileLabelRu('routing-steps.json')).toMatch(/Маршрут/);
    expect(workshop2TzBundleFileLabelRu('grading-table.json')).toMatch(/Градация/);
  });
});

describe('workshop2 wave17 — stock pane connected status', () => {
  it('summarizes internal WMS + MoySklad hint from dossier mirrors', () => {
    const dossier = emptyWorkshop2DossierPhase1();
    dossier.internalWmsMirror = {
      mirroredAt: new Date().toISOString(),
      itemCount: 3,
      onHandQty: 12,
      reservedQty: 2,
      movementCount: 4,
      reserveDeficitCount: 0,
      wmsSyncStatus: 'internal_pg',
      locationCode: 'MAIN',
    };
    const line = summarizeWorkshop2StockPaneConnectedStatusRu({
      dossier,
      wmsBalanceCount: 3,
      wmsFailClosed: false,
    });
    expect(line).toMatch(/Internal WMS/);
    expect(line).toMatch(/МойСклад/);
  });
});

describe('workshop2 wave17 — stabilization probe', () => {
  it('wave17RuStabilization probe exposes stabilization checks', () => {
    const probe = buildWorkshop2Wave17RuStabilizationProbe({ WORKSHOP2_MARKET: 'ru' });
    expect(probe.checks.some((c) => c.id === 'api_error_ru_coverage')).toBe(true);
    expect(probe.checks.some((c) => c.id === 'handoff_pdf_section_labels_ru')).toBe(true);
    const cov = probe.checks.find((c) => c.id === 'api_error_ru_coverage');
    expect(cov?.hintRu).toMatch(/high-traffic|8/);
  });
});

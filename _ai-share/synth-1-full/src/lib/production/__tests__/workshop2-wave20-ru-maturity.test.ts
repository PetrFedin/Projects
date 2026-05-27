/**
 * Wave 20 RU — maturity probe, API coverage ≥90%, hub contour score (+4 tests).
 */
/** @jest-environment node */

import fs from 'node:fs';
import path from 'node:path';

import {
  buildWorkshop2Wave20RuMaturityProbe,
  scanWorkshop2ApiJsonRoutesRuCoverage,
} from '@/lib/production/workshop2-live-integration-probes';

describe('workshop2 wave20 — scanWorkshop2ApiJsonRoutesRuCoverage', () => {
  it('reports ≥90% JSON routes with RU error handling', () => {
    const scan = scanWorkshop2ApiJsonRoutesRuCoverage();
    expect(scan.jsonRoutesTotal).toBeGreaterThanOrEqual(90);
    expect(scan.ruErrorReady).toBeGreaterThanOrEqual(Math.ceil(scan.jsonRoutesTotal * 0.9));
    expect(scan.coveragePct).toBeGreaterThanOrEqual(90);
  });
});

describe('workshop2 wave20 — buildWorkshop2Wave20RuMaturityProbe', () => {
  it('returns maturityScore 0–100 with wave20 batch wrappers 12/12', () => {
    const probe = buildWorkshop2Wave20RuMaturityProbe({ WORKSHOP2_MARKET: 'ru' });
    expect(probe.maturityScore).toBeGreaterThanOrEqual(0);
    expect(probe.maturityScore).toBeLessThanOrEqual(100);
    expect(probe.wave20Total).toBe(12);
    expect(probe.wave20Wrapped).toBeGreaterThanOrEqual(12);
    expect(probe.apiErrorRuCoveragePct).toBeGreaterThanOrEqual(90);
    expect(probe.checks.some((c) => c.id === 'api_error_ru_coverage_90pct' && c.ok)).toBe(true);
  });

  it('weights UAT auto_pass into maturityScore', () => {
    const probe = buildWorkshop2Wave20RuMaturityProbe({ WORKSHOP2_MARKET: 'ru' });
    expect(probe.uatAutoPassed).toBeGreaterThanOrEqual(8);
    expect(probe.uatAutoPassPct).toBeGreaterThan(0);
    expect(probe.maturityScore).toBeGreaterThanOrEqual(50);
  });

  it('includes B2B parity ✓ count from wave23 matrix in factors', () => {
    const probe = buildWorkshop2Wave20RuMaturityProbe({ WORKSHOP2_MARKET: 'ru' });
    expect(probe.b2bParityTotal).toBeGreaterThanOrEqual(20);
    expect(probe.b2bParityOkCount).toBe(probe.b2bParityTotal);
    expect(probe.b2bParityPct).toBe(100);
    expect(probe.checks.some((c) => c.id === 'b2b_full_parity_wave23_matrix' && c.ok)).toBe(true);
  });
});

describe('workshop2 wave20 — planning deliverables exist', () => {
  it('production checklist and waves 9–20 summary markdown at .planning/', () => {
    const root = process.cwd();
    const checklist = path.join(root, '.planning/workshop2-ru-production-checklist.md');
    const summary = path.join(root, '.planning/workshop2-ru-waves-9-20-summary.md');
    expect(fs.existsSync(checklist)).toBe(true);
    expect(fs.existsSync(summary)).toBe(true);
    expect(fs.readFileSync(checklist, 'utf8')).toMatch(/WORKSHOP2_MARKET=ru/);
    expect(fs.readFileSync(summary, 'utf8')).toMatch(/Wave 20/);
  });
});

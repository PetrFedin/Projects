/**
 * @jest-environment node
 */
import { buildWorkshop2TzPreflightReport, buildWorkshop2TzTraceRows } from '@/lib/production/workshop2-tz-trace';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

function emptyDossier(): Workshop2DossierPhase1 {
  return { schemaVersion: 1, assignments: [] };
}

describe('workshop2-tz-trace', () => {
  it('builds trace rows', () => {
    const rows = buildWorkshop2TzTraceRows(emptyDossier());
    expect(rows.length).toBe(4);
  });

  it('preflight returns issues for empty dossier', () => {
    const report = buildWorkshop2TzPreflightReport(emptyDossier());
    expect(report.ok).toBe(false);
    expect(report.issues.length).toBeGreaterThan(0);
  });

  it('preflight includes section minimum issues with machine-style ids', () => {
    const report = buildWorkshop2TzPreflightReport(emptyDossier());
    const minIssues = report.issues.filter((i) => i.id.startsWith('rule-'));
    expect(minIssues.length).toBeGreaterThan(0);
    expect(minIssues.some((i) => i.severity === 'critical')).toBe(true);
  });
});

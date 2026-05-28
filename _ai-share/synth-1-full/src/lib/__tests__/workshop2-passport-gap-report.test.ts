/**
 * @jest-environment node
 */
import {
  buildWorkshop2PassportAttributeGapReport,
  formatWorkshop2PassportGapReportAsText,
} from '@/lib/production/workshop2-passport-gap-report';
import { findHandbookLeafById } from '@/lib/production/category-handbook-leaves';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

const emptyDossier = (): Workshop2DossierPhase1 =>
  ({ assignments: [], selectedAudienceId: 'x' }) as Workshop2DossierPhase1;

describe('workshop2-passport-gap-report', () => {
  it('builds a report for a real leaf: lines have passportBlock and summary counts', () => {
    const leaf = findHandbookLeafById('catalog-apparel-g0-l0');
    expect(leaf).toBeDefined();
    const d = emptyDossier();
    const r = buildWorkshop2PassportAttributeGapReport(leaf!.leafId, d, '1');
    expect(r.leafId).toBe(leaf!.leafId);
    expect(r.tzPhase).toBe('1');
    expect(Array.isArray(r.linesOnLeaf)).toBe(true);
    expect(r.summary.startRequiredTotal + r.summary.preSampleRequiredTotal).toBeGreaterThanOrEqual(
      0
    );
    for (const l of r.linesOnLeaf) {
      expect(['start', 'preSample']).toContain(l.passportBlock);
    }
  });

  it('formatWorkshop2PassportGapReportAsText includes header and optional missing-from-leaf section', () => {
    const d = emptyDossier();
    const r = buildWorkshop2PassportAttributeGapReport('catalog-apparel-g0-l0', d, '1');
    const text = formatWorkshop2PassportGapReportAsText(r);
    expect(text).toContain('Workshop2 passport gap');
    expect(text).toContain('Summary:');
  });
});

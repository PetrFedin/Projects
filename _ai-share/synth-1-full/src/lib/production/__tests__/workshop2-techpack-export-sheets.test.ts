/**
 * @jest-environment node
 */
import { getHandbookCategoryLeaves } from '@/lib/production/category-handbook-leaves';
import {
  assessWorkshop2TechPackSheetReadiness,
  buildWorkshop2TechPackFactoryDocumentHtml,
  buildWorkshop2TechPackSheetHtml,
  summarizeWorkshop2TechPackExportReadiness,
  WORKSHOP2_TECHPACK_EXPORT_SHEETS,
  W2_TECHPACK_CONSTRUCTION_NOTE_PRESETS,
} from '@/lib/production/workshop2-techpack-export-sheets';
import { buildBrandTechPackExportSession } from '@/lib/production/workshop2-techpack-export-session';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

function emptyDossier(): Workshop2DossierPhase1 {
  return { schemaVersion: 1, assignments: [] };
}

function exportCtx() {
  const leaf = getHandbookCategoryLeaves()[0]!;
  return {
    articleSku: 'SKU-TP',
    articleName: 'Test coat',
    pathLabel: 'L1 / L2',
    l2Name: leaf.l2Name,
    tzPhase: '1' as const,
    categoryLeafId: leaf.leafId,
    measurementsLeaf: leaf,
    preflightOk: false,
    preflightIssueCount: 1,
    sectionSignoffsFull: 0,
    gateLifecycleState: 'draft',
    exportLanguage: 'ru_en' as const,
  };
}

describe('workshop2-techpack-export-sheets', () => {
  it('registers six factory pack sheets', () => {
    expect(WORKSHOP2_TECHPACK_EXPORT_SHEETS).toHaveLength(6);
    expect(WORKSHOP2_TECHPACK_EXPORT_SHEETS.map((s) => s.id)).toEqual([
      'cover',
      'sketch-front',
      'sketch-back',
      'labels-trims',
      'colorways',
      'size-qty',
    ]);
  });

  it('builds cover sheet html with sku', () => {
    const html = buildWorkshop2TechPackSheetHtml('cover', emptyDossier(), exportCtx());
    expect(html).toContain('SKU-TP');
    expect(html).toContain('Factory pack');
  });

  it('builds full factory document with page sections', () => {
    const html = buildWorkshop2TechPackFactoryDocumentHtml(emptyDossier(), exportCtx());
    expect(html).toContain('factory-sheet');
    expect(html).toContain('sheet 1/6');
    expect(html).toContain('sheet 6/6');
  });

  it('summarizes readiness for empty dossier', () => {
    const summary = summarizeWorkshop2TechPackExportReadiness(emptyDossier(), exportCtx());
    expect(summary.sheetsTotal).toBe(6);
    expect(summary.sheetsReady).toBeLessThan(6);
    const cover = assessWorkshop2TechPackSheetReadiness('cover', emptyDossier(), exportCtx());
    expect(cover.ok).toBe(false);
    expect(cover.missingRu).toContain('Sample size');
  });

  it('exposes construction note presets catalog', () => {
    expect(W2_TECHPACK_CONSTRUCTION_NOTE_PRESETS.length).toBeGreaterThanOrEqual(4);
  });
});

describe('workshop2-techpack-export-session', () => {
  it('builds cross-link session with matrix and factory dossier', () => {
    const session = buildBrandTechPackExportSession({
      articleId: 'art-1',
      collectionId: 'SS27',
      sku: 'SKU-1',
    });
    expect(session.sheetsTotal).toBe(6);
    expect(session.matrixQtyHref).toContain('pcf=matrix');
    expect(session.dossierAssignmentHref).toContain('w2sec=assignment');
    expect(session.dossierAssignmentHref).toContain('pcf=factory-pack');
    expect(session.factoryDossierHref).toContain('/factory/production/dossier/');
    expect(session.crossLinks.length).toBeGreaterThanOrEqual(6);
    expect(session.crossLinks.some((l) => l.id === 'matrix-qty')).toBe(true);
    expect(session.crossLinks.some((l) => l.id === 'sketch-comms')).toBe(true);
  });
});

import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import { buildSectionControlPoints } from '../workshop2-phase1-dossier-panel-section-control-points';

const leaf = { pathLabel: 'Cat' } as HandbookCategoryLeaf;

const readinessRow = { done: 0, total: 1, pct: 0, status: '' };
const readiness = {
  general: readinessRow,
  visuals: readinessRow,
  material: readinessRow,
  construction: readinessRow,
  assignment: readinessRow,
  measurements: readinessRow,
  packaging: readinessRow,
  sample_intake: readinessRow,
};

describe('workshop2-phase1-dossier-panel-section-control-points', () => {
  it('general returns passport checklist rows', () => {
    const pts = buildSectionControlPoints('general', {
      dossier: emptyWorkshop2DossierPhase1(),
      currentLeaf: leaf,
      skuDraft: 'sku',
      nameDraft: 'name',
      handbookWarnings: [],
      sectionReadiness: readiness,
      selectedAudienceLabel: 'Women',
      hasAssignmentValue: () => false,
    });
    expect(pts).toHaveLength(8);
    expect(pts.some((p) => p.label.includes('SKU'))).toBe(true);
  });

  it('assignment falls through to empty control points', () => {
    const pts = buildSectionControlPoints('assignment', {
      dossier: emptyWorkshop2DossierPhase1(),
      currentLeaf: leaf,
      skuDraft: '',
      nameDraft: '',
      handbookWarnings: [],
      sectionReadiness: readiness,
      selectedAudienceLabel: '',
      hasAssignmentValue: () => false,
    });
    expect(pts).toEqual([]);
  });
});

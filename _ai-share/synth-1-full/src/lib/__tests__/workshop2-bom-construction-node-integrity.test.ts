/**
 * @jest-environment node
 */
import {
  W2_CNODE_BOM,
  W2_MATERIAL_WITHOUT_NODE,
  collectKnownBomLineRefsFromDossier,
  validateBomConstructionNodeIntegrity,
  validateRegisteredBomRefsHaveConstructionPin,
} from '@/lib/production/workshop2-bom-construction-node-integrity';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

const leaf = 'cat-leaf-1';

function matAssignmentWithLref(lref: string) {
  return {
    assignmentId: 'a-mat',
    kind: 'canonical' as const,
    attributeId: 'mat',
    values: [
      {
        valueId: 'v1',
        valueSource: 'handbook_parameter' as const,
        displayLabel: `Основа ${lref} хлопок`,
        text: '',
      },
    ],
  };
}

function pin(input: {
  annotationId: string;
  linkedAttributeId: string;
  linkedBomLineRef?: string;
  text?: string;
  linkedMaterialNote?: string;
  categoryLeafId?: string;
}) {
  return {
    annotationId: input.annotationId,
    categoryLeafId: input.categoryLeafId ?? leaf,
    xPct: 10,
    yPct: 10,
    text: input.text ?? '',
    linkedAttributeId: input.linkedAttributeId,
    linkedBomLineRef: input.linkedBomLineRef,
    linkedMaterialNote: input.linkedMaterialNote,
  };
}

describe('W2_CNODE_001 MISSING_BOM_REF', () => {
  it('reports when construction pin has no linkedBomLineRef', () => {
    const d = {
      assignments: [matAssignmentWithLref('LREF-TEST-01')],
      bomLineCostingHints: [{ lineRef: 'LREF-TEST-01' }],
      categorySketchAnnotations: [
        pin({
          annotationId: 'e0000000-0000-0000-0000-00000000aa01',
          linkedAttributeId: 'zipperType',
          text: 'Обтачка',
        }),
      ],
    } as Workshop2DossierPhase1;
    const issues = validateBomConstructionNodeIntegrity(d, leaf);
    const hit = issues.find((i) => i.code === W2_CNODE_BOM.MISSING_BOM_REF);
    expect(hit).toBeDefined();
  });
});

describe('W2_CNODE_002 UNKNOWN_BOM_REF', () => {
  it('fails when lineRef is not in dossier registry', () => {
    const d = {
      assignments: [matAssignmentWithLref('LREF-TEST-01')],
      categorySketchAnnotations: [
        pin({
          annotationId: 'e0000000-0000-0000-0000-00000000bb01',
          linkedAttributeId: 'zipperType',
          linkedBomLineRef: 'LREF-OTHER-99',
          text: 'Кант',
        }),
      ],
    } as Workshop2DossierPhase1;
    const issues = validateBomConstructionNodeIntegrity(d, leaf);
    const hit = issues.find((i) => i.code === W2_CNODE_BOM.UNKNOWN_BOM_REF);
    expect(hit).toBeDefined();
    expect(hit?.linkedBomLineRef).toBe('LREF-OTHER-99');
  });
});

describe('W2_CNODE_003 MISSING_PROCESSING', () => {
  it('fails when both pin text and linkedMaterialNote are empty', () => {
    const d = {
      assignments: [matAssignmentWithLref('LREF-TEST-01')],
      categorySketchAnnotations: [
        pin({
          annotationId: 'e0000000-0000-0000-0000-00000000cc01',
          linkedAttributeId: 'zipperType',
          linkedBomLineRef: 'LREF-TEST-01',
          text: '',
        }),
      ],
    } as Workshop2DossierPhase1;
    const issues = validateBomConstructionNodeIntegrity(d, leaf);
    const hit = issues.find((i) => i.code === W2_CNODE_BOM.MISSING_PROCESSING);
    expect(hit).toBeDefined();
  });

  it('passes processing when linkedMaterialNote is set', () => {
    const d = {
      assignments: [matAssignmentWithLref('LREF-TEST-01')],
      categorySketchAnnotations: [
        pin({
          annotationId: 'e0000000-0000-0000-0000-00000000cc02',
          linkedAttributeId: 'zipperType',
          linkedBomLineRef: 'LREF-TEST-01',
          text: '',
          linkedMaterialNote: 'Прокладка 1 см',
        }),
      ],
    } as Workshop2DossierPhase1;
    const issues = validateBomConstructionNodeIntegrity(d, leaf);
    expect(issues.find((i) => i.code === W2_CNODE_BOM.MISSING_PROCESSING)).toBeUndefined();
  });
});

describe('W2_CNODE_004 NO_BOM_REF_REGISTRY', () => {
  it('adds registry warning when construction pins exist but no lineRef sources', () => {
    const d = {
      assignments: [
        {
          assignmentId: 'a-mat',
          kind: 'canonical' as const,
          attributeId: 'mat',
          values: [
            {
              valueId: 'v1',
              valueSource: 'handbook_parameter' as const,
              displayLabel: 'Просто ткань без LREF',
              text: '',
            },
          ],
        },
      ],
      categorySketchAnnotations: [
        pin({
          annotationId: 'e0000000-0000-0000-0000-00000000dd01',
          linkedAttributeId: 'fastener',
          linkedBomLineRef: 'LREF-ANY',
          text: 'Описание',
        }),
      ],
    } as Workshop2DossierPhase1;
    const issues = validateBomConstructionNodeIntegrity(d, leaf);
    expect(issues.some((i) => i.code === W2_CNODE_BOM.NO_BOM_REF_REGISTRY)).toBe(true);
  });
});

describe('collectKnownBomLineRefsFromDossier', () => {
  it('unions hints, delta drafts, and LREF in mat', () => {
    const d = {
      assignments: [matAssignmentWithLref('LREF-FROM-MAT-01')],
      bomLineCostingHints: [{ lineRef: 'LREF-COST-01' }],
      bomLineDeltaDrafts: [
        {
          deltaId: 'd1',
          kind: 'tz_baseline' as const,
          lineRef: 'LREF-DELTA-01',
          field: 'material' as const,
          beforeLabel: '',
          afterLabel: '',
          at: '2026-01-01T00:00:00.000Z',
        },
      ],
    } as Workshop2DossierPhase1;
    const s = collectKnownBomLineRefsFromDossier(d);
    expect(s.has('LREF-COST-01')).toBe(true);
    expect(s.has('LREF-DELTA-01')).toBe(true);
    expect(s.has('LREF-FROM-MAT-01')).toBe(true);
  });
});

describe('no construction pins', () => {
  it('returns no issues', () => {
    const d = { assignments: [matAssignmentWithLref('LREF-TEST-01')] } as Workshop2DossierPhase1;
    expect(validateBomConstructionNodeIntegrity(d, leaf)).toEqual([]);
  });
});

describe('W2_MATERIAL_WITHOUT_NODE (symmetry)', () => {
  it('flags lineRef in dossier registry not linked from any construction pin', () => {
    const d = {
      assignments: [matAssignmentWithLref('LREF-COVERED')],
      bomLineCostingHints: [{ lineRef: 'LREF-COVERED' }, { lineRef: 'LREF-ORPHAN' }],
      categorySketchAnnotations: [
        pin({
          annotationId: 'e0000000-0000-0000-0000-00000000ee01',
          linkedAttributeId: 'zipperType',
          linkedBomLineRef: 'LREF-COVERED',
          text: 'Кант',
        }),
      ],
    } as Workshop2DossierPhase1;
    const issues = validateRegisteredBomRefsHaveConstructionPin(d, leaf);
    expect(issues).toHaveLength(1);
    expect(issues[0].code).toBe(W2_MATERIAL_WITHOUT_NODE);
    expect(issues[0].lineRef).toBe('LREF-ORPHAN');
  });

  it('returns empty when every known ref is covered by a construction pin', () => {
    const d = {
      assignments: [matAssignmentWithLref('LREF-ONLY')],
      categorySketchAnnotations: [
        pin({
          annotationId: 'e0000000-0000-0000-0000-00000000ee02',
          linkedAttributeId: 'zipperType',
          linkedBomLineRef: 'LREF-ONLY',
          text: 'Ок',
        }),
      ],
    } as Workshop2DossierPhase1;
    expect(validateRegisteredBomRefsHaveConstructionPin(d, leaf)).toEqual([]);
  });

  it('ignores when registry is empty', () => {
    const d = {
      assignments: [],
      categorySketchAnnotations: [],
    } as Workshop2DossierPhase1;
    expect(validateRegisteredBomRefsHaveConstructionPin(d, leaf)).toEqual([]);
  });
});

import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  inferVisualReadinessChecklistFromFacts,
  visualReadinessHints,
} from '@/lib/production/workshop2-visual-excellence';
import {
  buildWorkshop2VisualGateItems,
  collectWorkshop2VisualSectionWarnings,
} from '@/lib/production/workshop2-visual-section-warnings';
import { getVisualHandoffQuickSummary } from '@/lib/production/workshop2-visual-handoff-export';
import { getHandbookCategoryLeaves } from '@/lib/production/category-catalog';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

function baseDossier(): Workshop2DossierPhase1 {
  return {
    ...emptyWorkshop2DossierPhase1(),
    designerIntent: { mood: 'test', bullets: ['a'] },
    categorySketchImageDataUrl: 'data:image/png;base64,xx',
    categorySketchAnnotations: [
      {
        annotationId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
        categoryLeafId: 'x',
        xPct: 10,
        yPct: 20,
        text: '1',
      },
    ],
    visualReferences: [
      {
        refId: '11111111-2222-3333-4444-555555555555',
        title: 'R1',
        previewDataUrl: 'data:image/png;base64,yy',
      },
    ],
  };
}

describe('workshop2 visual gate / handoff', () => {
  const sampleLeaf = getHandbookCategoryLeaves()[0] ?? null;

  it('buildWorkshop2VisualGateItems flags missing pieces', () => {
    const d = emptyWorkshop2DossierPhase1();
    const items = buildWorkshop2VisualGateItems(d, sampleLeaf);
    expect(items.some((i) => i.id === 'gate-sketch')).toBe(true);
    expect(items.some((i) => i.id === 'gate-refs')).toBe(true);
    expect(items.some((i) => i.id === 'gate-intent')).toBe(true);
  });

  it('collectWorkshop2VisualSectionWarnings matches gate messages', () => {
    const d = emptyWorkshop2DossierPhase1();
    const w = collectWorkshop2VisualSectionWarnings(d, sampleLeaf);
    const items = buildWorkshop2VisualGateItems(d, sampleLeaf);
    expect(w).toEqual(items.map((x) => x.message));
  });

  it('getVisualHandoffQuickSummary aggregates pins and checklist', () => {
    const d = baseDossier();
    const q = getVisualHandoffQuickSummary(d);
    expect(q.referenceCount).toBe(1);
    expect(q.sketchPinTotal).toBe(1);
    expect(q.sketchHasSubstrate).toBe(true);
    expect(q.intentOrNotesFilled).toBe(true);
    expect(q.checklistTotal).toBeGreaterThan(0);
  });

  it('inferVisualReadinessChecklistFromFacts sets refThreadsResolved when all comments resolved', () => {
    const d: Workshop2DossierPhase1 = {
      ...baseDossier(),
      visualReferences: [
        {
          refId: '11111111-2222-3333-4444-555555555555',
          title: 'R1',
          comments: [
            {
              commentId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
              by: 'u1',
              at: '2026-04-01T10:00:00.000Z',
              text: 'ok',
              resolved: true,
            },
          ],
        },
      ],
    };
    expect(inferVisualReadinessChecklistFromFacts(d).refThreadsResolved).toBe(true);
  });

  it('inferVisualReadinessChecklistFromFacts does not set refThreadsResolved if a comment is open', () => {
    const d: Workshop2DossierPhase1 = {
      ...baseDossier(),
      visualReferences: [
        {
          refId: '11111111-2222-3333-4444-555555555555',
          title: 'R1',
          comments: [
            {
              commentId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
              by: 'u1',
              at: '2026-04-01T10:00:00.000Z',
              text: 'q',
            },
          ],
        },
      ],
    };
    expect(inferVisualReadinessChecklistFromFacts(d).refThreadsResolved).toBeUndefined();
  });

  it('inferVisualReadinessChecklistFromFacts sets floorReferenceReady only with production signoff and snapshot', () => {
    const approved: Workshop2DossierPhase1 = {
      ...baseDossier(),
      categorySketchProductionApproved: { by: 'prod', at: '2026-04-01T11:00:00.000Z' },
    };
    expect(inferVisualReadinessChecklistFromFacts(approved).floorReferenceReady).toBeUndefined();

    const withSnap: Workshop2DossierPhase1 = {
      ...approved,
      sketchLabelSnapshots: [
        {
          snapshotId: 'bbbbbbbb-cccc-dddd-eeee-ffffffffffff',
          at: '2026-04-01T11:01:00.000Z',
          by: 'prod',
        },
      ],
    };
    expect(inferVisualReadinessChecklistFromFacts(withSnap).floorReferenceReady).toBe(true);
  });

  it('visualReadinessHints refThreads counts open comments and appends sketchFloor note', () => {
    const d: Workshop2DossierPhase1 = {
      ...emptyWorkshop2DossierPhase1(),
      visualReadinessChecklist: {},
      visualReferences: [
        {
          refId: '11111111-2222-3333-4444-555555555555',
          title: 'R1',
          comments: [
            {
              commentId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
              by: 'u1',
              at: '2026-04-01T10:00:00.000Z',
              text: 'x',
            },
          ],
        },
      ],
    };
    const h = visualReadinessHints(d);
    expect(h.refThreadsResolved).toMatch(/Решено/);

    const d2: Workshop2DossierPhase1 = {
      ...emptyWorkshop2DossierPhase1(),
      visualReadinessChecklist: {},
      categorySketchAnnotations: [
        {
          annotationId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
          categoryLeafId: 'x',
          xPct: 1,
          yPct: 2,
          text: '1',
        },
      ],
      categorySketchImageDataUrl: 'data:image/png;base64,zz',
    };
    const hf = visualReadinessHints(d2, { sketchFloorInUrl: true });
    expect(hf.floorReferenceReady).toMatch(/sketchFloor=1/);
  });

  it('visualReadinessHints floor: production signoff without snapshot asks for snapshot and sketchFloor', () => {
    const d: Workshop2DossierPhase1 = {
      ...emptyWorkshop2DossierPhase1(),
      visualReadinessChecklist: {},
      categorySketchProductionApproved: { by: 'p', at: '2026-04-01T12:00:00.000Z' },
    };
    const h = visualReadinessHints(d);
    expect(h.floorReferenceReady).toMatch(/снимок/);
    expect(h.floorReferenceReady).toMatch(/sketchFloor=1/);
  });
});

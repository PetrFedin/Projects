import {
  previewWorkshop2ArticleAssemblyMerge,
  assembleWorkshop2ArticleFromTaxonomy,
} from '@/lib/production/workshop2-article-assembler';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  applyWorkshop2ChangeRequestDecision,
  isWorkshop2ChangeRequestPending,
} from '@/lib/production/workshop2-change-request-workflow';
import { evaluateWorkshop2InfoPickMatrixFillGaps } from '@/lib/production/workshop2-infopick-matrix-fill-gaps';
import {
  resolveWorkshop2DossierLayoutFromWorkspaceUrl,
  workshop2DossierLayoutShowsSideAsides,
} from '@/lib/production/workshop2-dossier-layout-mode';
import { buildWorkshop2OverviewModel } from '@/lib/production/workshop2-overview-model';
import { suggestWorkshop2RelatedNextStep } from '@/lib/production/workshop2-related-next-step';
import { buildWorkshop2RelatedSectionsBundle } from '@/lib/production/workshop2-related-sections';

const COAT_LEAF = 'catalog-apparel-g0-l0';

describe('workshop2 wave6 — category merge preview', () => {
  it('does not mutate existing dossier during preview', () => {
    const built = assembleWorkshop2ArticleFromTaxonomy({
      categoryLeafId: COAT_LEAF,
      audienceId: 'men',
      isUnisex: false,
    });
    expect(built).not.toBeNull();
    const scaleBefore = built!.dossier.sampleSizeScaleId;
    const diff = previewWorkshop2ArticleAssemblyMerge(built!.dossier, {
      categoryLeafId: COAT_LEAF,
      audienceId: 'women',
      isUnisex: false,
    });
    expect(built!.dossier.sampleSizeScaleId).toBe(scaleBefore);
    expect(Array.isArray(diff.orphanFilledAttributeIds)).toBe(true);
  });
});

describe('workshop2 wave6 — change requests', () => {
  it('rejects decision on non-pending CR', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      changeRequests: [
        {
          id: 'cr-1',
          description: 'x',
          status: 'approved',
          createdAt: new Date().toISOString(),
        },
      ],
    };
    expect(isWorkshop2ChangeRequestPending('pending')).toBe(true);
    expect(
      applyWorkshop2ChangeRequestDecision({
        dossier,
        changeRequestId: 'cr-1',
        decision: 'rejected',
        decidedBy: 'tech',
      })
    ).toBeNull();
  });

  it('approve writes tzActionLog entry', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      changeRequests: [
        {
          id: 'cr-2',
          description: 'Смена ткани',
          status: 'pending',
          createdAt: new Date().toISOString(),
        },
      ],
    };
    const applied = applyWorkshop2ChangeRequestDecision({
      dossier,
      changeRequestId: 'cr-2',
      decision: 'approved',
      decidedBy: 'lead',
    });
    expect(applied?.changeRequest?.status).toBe('approved');
    expect(applied?.changeRequest?.decidedBy).toBe('lead');
    expect((applied?.dossier.tzActionLog ?? []).length).toBeGreaterThan(0);
  });
});

describe('workshop2 wave6 — overview snapshot', () => {
  it('includes readinessSnapshot from dossier', () => {
    const model = buildWorkshop2OverviewModel({
      dossier: emptyWorkshop2DossierPhase1(),
      leaf: null,
      bundle: null,
    });
    expect(model.readinessSnapshot.source).toBe('dossier_readiness');
    expect(typeof model.readinessSnapshot.tzOverallPct).toBe('number');
  });
});

describe('workshop2 wave6 — related next step', () => {
  it('highlights link when href matches', () => {
    const step = suggestWorkshop2RelatedNextStep({
      collectionId: 'SS27',
      articleUrlSegment: 'a1',
      dossier: emptyWorkshop2DossierPhase1(),
      leaf: null,
      bundle: null,
    });
    if (!step) return;
    const bundle = buildWorkshop2RelatedSectionsBundle({
      collectionId: 'SS27',
      articleUrlSegment: 'a1',
      activeTab: 'tz',
      nextStep: step,
    });
    const hit = bundle.links.find((l) => l.href === step.href);
    expect(hit?.highlight).toBe(true);
  });
});

describe('workshop2 wave6 — layout mode', () => {
  it('dense hides side asides', () => {
    expect(workshop2DossierLayoutShowsSideAsides('dense')).toBe(false);
    expect(workshop2DossierLayoutShowsSideAsides('full')).toBe(true);
  });

  it('parses w2layout=dense', () => {
    expect(resolveWorkshop2DossierLayoutFromWorkspaceUrl('dense')).toBe('dense');
  });
});

describe('workshop2 wave6 — info-pick gaps', () => {
  it('returns null without leaf', () => {
    expect(evaluateWorkshop2InfoPickMatrixFillGaps(emptyWorkshop2DossierPhase1(), '')).toBeNull();
  });
});

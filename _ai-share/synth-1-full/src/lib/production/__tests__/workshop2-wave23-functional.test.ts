/**
 * Wave 23 — push ≥9.0: assembly preview, BOM, grading export, signoff, infopick, pulse.
 */
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  assembleWorkshop2ArticleFromTaxonomy,
  buildWorkshop2ArticleAssemblyPreview,
} from '@/lib/production/workshop2-article-assembler';
import { findHandbookLeafById } from '@/lib/production/category-catalog';
import {
  evaluateWorkshop2AssemblyPreviewMirrorGate,
  persistWorkshop2AssemblyPreviewMirrorToDossier,
} from '@/lib/production/workshop2-assembly-preview-dossier-persist';
import {
  evaluateWorkshop2BomNodesSampleGate,
  persistWorkshop2BomNodesMirrorToDossier,
} from '@/lib/production/workshop2-bom-nodes-dossier-persist';
import {
  evaluateWorkshop2GradingApplyExportGate,
  persistWorkshop2GradingApplyMirrorToDossier,
} from '@/lib/production/workshop2-grading-apply-dossier-persist';
import {
  evaluateWorkshop2AssignmentSignoffMirrorGate,
  persistWorkshop2AssignmentSignoffMirrorToDossier,
} from '@/lib/production/workshop2-assignment-signoff-dossier-persist';
import {
  evaluateWorkshop2InfopickMatrixMirrorGate,
  persistWorkshop2InfopickMatrixMirrorToDossier,
} from '@/lib/production/workshop2-infopick-matrix-dossier-persist';
import {
  evaluateWorkshop2ReadinessPulseSampleGate,
  persistWorkshop2ReadinessPulseMirrorToDossier,
} from '@/lib/production/workshop2-readiness-pulse-dossier-persist';
import { evaluateWorkshop2SampleOrderGate } from '@/lib/production/workshop2-sample-order-gate';
import { evaluateWorkshop2TzExportBundleGate } from '@/lib/production/workshop2-tz-export-bundle-gate';
import { getWorkshop2ReadinessSnapshot } from '@/lib/production/workshop2-readiness-snapshot';

const COAT_LEAF = 'catalog-apparel-g0-l0';

describe('workshop2 wave23 — #13 assembly preview POM rows + mirror', () => {
  it('preview includes pomTemplateRowCount for coat leaf', () => {
    const leaf = findHandbookLeafById(COAT_LEAF);
    expect(leaf).toBeTruthy();
    const preview = buildWorkshop2ArticleAssemblyPreview(
      { audienceId: 'men', categoryLeafId: COAT_LEAF },
      leaf!
    );
    expect(preview.pomTemplateRowCount).toBeGreaterThan(0);
    expect(preview.oneLineRu).toContain('POM:');
  });

  it('integration: assemble writes assemblyPreviewMirror to dossier', () => {
    const built = assembleWorkshop2ArticleFromTaxonomy({
      audienceId: 'men',
      categoryLeafId: COAT_LEAF,
    });
    expect(built?.dossier.assemblyPreviewMirror?.pomTemplateRowCount).toBeGreaterThan(0);
    expect(evaluateWorkshop2AssemblyPreviewMirrorGate(built!.dossier)).toBeNull();
  });
});

describe('workshop2 wave23 — #36 BOM mirror → sample-order blocker', () => {
  it('integration: blocks sample-order when BOM partial', () => {
    const dossier = persistWorkshop2BomNodesMirrorToDossier({
      ...emptyWorkshop2DossierPhase1(),
      productionModel: {
        version: 1,
        nodes: [{ id: 'n1', name: 'Body' }],
        materialLines: [
          { id: 'm1', materialName: 'Wool', percentage: 100, yieldPerUnit: 0, nodeId: 'n1' },
        ],
        trimLines: [],
      },
    });
    expect(evaluateWorkshop2BomNodesSampleGate(dossier)?.id).toBe('bom.nodes.incomplete');
    const gate = evaluateWorkshop2SampleOrderGate({ dossier, categoryLeafId: COAT_LEAF });
    expect(gate.allowed).toBe(false);
  });
});

describe('workshop2 wave23 — #39 grading mirror → export-tz gate', () => {
  it('integration: blocks export when scale set but no grading apply log', () => {
    const dossier = persistWorkshop2GradingApplyMirrorToDossier({
      ...emptyWorkshop2DossierPhase1(),
      sampleSizeScaleId: 'men-apparel-eu',
      gradingRules: [],
    });
    expect(evaluateWorkshop2GradingApplyExportGate(dossier)?.id).toBe('grading.apply.missing');
    const exportGate = evaluateWorkshop2TzExportBundleGate({
      dossier,
      categoryLeafId: COAT_LEAF,
    });
    expect(exportGate.checks.some((c) => c.id === 'grading.apply.missing')).toBe(true);
  });
});

describe('workshop2 wave23 — #44 signoff mirror → sample-order blocker', () => {
  it('integration: blocks when sections not signed (mirror)', () => {
    const dossier = persistWorkshop2AssignmentSignoffMirrorToDossier(emptyWorkshop2DossierPhase1());
    expect(evaluateWorkshop2AssignmentSignoffMirrorGate(dossier)?.severity).toBe('blocker');
    const gate = evaluateWorkshop2SampleOrderGate({ dossier, categoryLeafId: COAT_LEAF });
    expect(gate.readiness.checks.some((c) => c.id === 'assignment.signoff.sections')).toBe(true);
  });
});

describe('workshop2 wave23 — #34 infopick mirror → sample-order blocker', () => {
  it('integration: blocks via mirror when matrix gaps', () => {
    const dossier = persistWorkshop2InfopickMatrixMirrorToDossier(
      emptyWorkshop2DossierPhase1(),
      COAT_LEAF
    );
    expect(evaluateWorkshop2InfopickMatrixMirrorGate(dossier, COAT_LEAF)?.id).toBe(
      'infopick.matrix.required'
    );
  });

  it('fallback: live gaps block without mirror', () => {
    const dossier = emptyWorkshop2DossierPhase1();
    const check = evaluateWorkshop2InfopickMatrixMirrorGate(dossier, COAT_LEAF);
    expect(check?.id).toBe('infopick.matrix.required');
  });
});

describe('workshop2 wave23 — #17 readiness pulse mirror → sample-order', () => {
  it('integration: blocks when preflight blockers in mirror', () => {
    const snapshot = getWorkshop2ReadinessSnapshot({
      dossier: emptyWorkshop2DossierPhase1(),
      leaf: findHandbookLeafById(COAT_LEAF),
    });
    const dossier = persistWorkshop2ReadinessPulseMirrorToDossier(
      emptyWorkshop2DossierPhase1(),
      snapshot
    );
    const check = evaluateWorkshop2ReadinessPulseSampleGate(dossier);
    if (dossier.readinessPulseMirror?.blockerSampleOrder) {
      expect(check?.severity).toBe('blocker');
    } else {
      expect(check === null || check.severity === 'warning').toBe(true);
    }
  });
});

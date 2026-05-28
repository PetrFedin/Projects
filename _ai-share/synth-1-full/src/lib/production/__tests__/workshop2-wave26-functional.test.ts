/**
 * Wave 26 — push ≥9.0: merge/routing/vault 2nd layer, supply bundle, plan T&A, sketch mirror.
 */
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  evaluateWorkshop2CategoryMergeHandoffGate,
  evaluateWorkshop2CategoryMergeSampleGate,
  persistWorkshop2CategoryMergeMirrorToDossier,
} from '@/lib/production/workshop2-category-merge-dossier-persist';
import {
  evaluateWorkshop2ReleaseRoutingHandoffGate,
  evaluateWorkshop2ReleaseRoutingExportGate,
  persistWorkshop2ReleaseRoutingMirrorToDossier,
} from '@/lib/production/workshop2-release-routing-dossier-persist';
import {
  evaluateWorkshop2VaultPanelSampleGate,
  evaluateWorkshop2VaultPanelHandoffGate,
  persistWorkshop2VaultPanelMirrorToDossier,
} from '@/lib/production/workshop2-vault-panel-dossier-persist';
import {
  evaluateWorkshop2SupplyBundleSampleGate,
  persistWorkshop2SupplyBundleMirrorToDossier,
} from '@/lib/production/workshop2-supply-bundle-dossier-persist';
import {
  evaluateWorkshop2PlanTaSampleGate,
  persistWorkshop2PlanTaMirrorToDossier,
} from '@/lib/production/workshop2-plan-ta-dossier-persist';
import {
  evaluateWorkshop2SketchCoverageExportGate,
  evaluateWorkshop2SketchCoverageHandoffGate,
  persistWorkshop2SketchCoverageMirrorToDossier,
} from '@/lib/production/workshop2-sketch-coverage-dossier-persist';
import { evaluateWorkshop2FactoryHandoffCommitGate } from '@/lib/production/workshop2-factory-handoff-commit-gate';
import { evaluateWorkshop2SampleOrderGate } from '@/lib/production/workshop2-sample-order-gate';
import { evaluateWorkshop2TzExportBundleGate } from '@/lib/production/workshop2-tz-export-bundle-gate';
import { persistWorkshop2RoutingStepsFromDossier } from '@/lib/production/workshop2-routing-steps-persist';

const COAT_LEAF = 'catalog-apparel-g0-l0';

describe('workshop2 wave26 — #16 category merge handoff (2nd layer)', () => {
  it('integration: sample-order warning but handoff blocker on orphans', () => {
    const dossier = persistWorkshop2CategoryMergeMirrorToDossier(emptyWorkshop2DossierPhase1(), {
      categoryLeafId: COAT_LEAF,
      mergeDiff: {
        hasChanges: true,
        warningsRu: ['Сироты'],
        orphanFilledAttributeIds: ['orphanAttr1'],
      },
    });
    expect(evaluateWorkshop2CategoryMergeSampleGate(dossier)?.severity).toBe('warning');
    expect(evaluateWorkshop2CategoryMergeHandoffGate(dossier)?.severity).toBe('blocker');
    const commit = evaluateWorkshop2FactoryHandoffCommitGate({
      dossier,
      categoryLeafId: COAT_LEAF,
      vaultFileCount: 2,
    });
    expect(commit.readiness.checks.some((c) => c.id === 'category.merge.orphans')).toBe(true);
  });
});

describe('workshop2 wave26 — #64 release routing handoff (2nd layer)', () => {
  it('integration: empty routing blocks handoff-commit', () => {
    const dossier = persistWorkshop2ReleaseRoutingMirrorToDossier(emptyWorkshop2DossierPhase1());
    expect(evaluateWorkshop2ReleaseRoutingExportGate(dossier)?.severity).toBe('warning');
    expect(evaluateWorkshop2ReleaseRoutingHandoffGate(dossier)?.severity).toBe('blocker');
    const commit = evaluateWorkshop2FactoryHandoffCommitGate({
      dossier,
      categoryLeafId: COAT_LEAF,
      vaultFileCount: 2,
    });
    expect(commit.readiness.checks.some((c) => c.id === 'release.routing.empty')).toBe(true);
  });

  it('integration: persisted routing clears handoff gate', () => {
    const withSteps = persistWorkshop2RoutingStepsFromDossier({
      ...emptyWorkshop2DossierPhase1(),
      smartRoutingSequence: [{ name: 'Раскрой', sash: 10, costPerUnit: 3 }],
    }).dossier;
    const dossier = persistWorkshop2ReleaseRoutingMirrorToDossier(withSteps);
    expect(evaluateWorkshop2ReleaseRoutingHandoffGate(dossier)).toBeNull();
  });
});

describe('workshop2 wave26 — #75 vault sample gate (2nd layer)', () => {
  it('integration: warns sample-order when vault mirror missing', () => {
    expect(evaluateWorkshop2VaultPanelSampleGate(emptyWorkshop2DossierPhase1())?.id).toBe(
      'vault.panel.mirror_missing'
    );
    const gate = evaluateWorkshop2SampleOrderGate({
      dossier: emptyWorkshop2DossierPhase1(),
      categoryLeafId: COAT_LEAF,
    });
    expect(gate.readiness.checks.some((c) => c.id === 'vault.panel.mirror_missing')).toBe(true);
  });

  it('integration: server vault below min warns sample-order', () => {
    const dossier = persistWorkshop2VaultPanelMirrorToDossier(emptyWorkshop2DossierPhase1(), {
      backendMode: 'server',
      vaultDocuments: [],
      s3Configured: true,
    });
    expect(evaluateWorkshop2VaultPanelHandoffGate(dossier)?.severity).toBe('blocker');
    expect(evaluateWorkshop2VaultPanelSampleGate(dossier)?.severity).toBe('warning');
  });
});

describe('workshop2 wave26 — #46 supply bundle mirror → sample-order', () => {
  it('integration: blocks when supply lines unlinked from BOM', () => {
    const dossier = persistWorkshop2SupplyBundleMirrorToDossier(
      {
        ...emptyWorkshop2DossierPhase1(),
        productionModel: {
          version: 1,
          materialLines: [{ id: 'm1', materialName: 'Wool', percentage: 100 }],
          trimLines: [],
        },
      },
      {
        supply: {
          lines: [{ id: 's1', label: 'Unknown fabric', qty: 10, unit: 'm', costPerUnit: 1 }],
        },
      }
    );
    expect(dossier.supplyBundleMirror?.blockerSampleOrder).toBe(true);
    expect(evaluateWorkshop2SupplyBundleSampleGate(dossier)?.id).toBe('supply.bundle.unlinked');
    const gate = evaluateWorkshop2SampleOrderGate({ dossier, categoryLeafId: COAT_LEAF });
    expect(gate.readiness.checks.some((c) => c.id === 'supply.bundle.unlinked')).toBe(true);
  });
});

describe('workshop2 wave26 — #61 plan T&A mirror → sample-order', () => {
  it('integration: warns when plan T&A empty', () => {
    const dossier = persistWorkshop2PlanTaMirrorToDossier(emptyWorkshop2DossierPhase1(), null);
    expect(dossier.planTaMirror?.state).toBe('empty');
    expect(evaluateWorkshop2PlanTaSampleGate(dossier)?.id).toBe('plan.ta.empty');
  });

  it('integration: at_risk milestones warn sample-order', () => {
    const dossier = persistWorkshop2PlanTaMirrorToDossier(
      {
        ...emptyWorkshop2DossierPhase1(),
        taMilestones: [
          {
            id: 'm1',
            title: 'Ткань',
            targetDate: '2020-01-01',
            status: 'pending',
          },
        ],
        taMilestonesPersistedAt: '2026-05-01T10:00:00.000Z',
      },
      null
    );
    expect(dossier.planTaMirror?.state).toBe('at_risk');
    expect(evaluateWorkshop2PlanTaSampleGate(dossier)?.id).toBe('plan.ta.at_risk');
  });
});

describe('workshop2 wave26 — #41 sketch coverage mirror → export + handoff', () => {
  it('integration: empty sketch mirror blocks export-tz', () => {
    const dossier = persistWorkshop2SketchCoverageMirrorToDossier(
      emptyWorkshop2DossierPhase1(),
      COAT_LEAF
    );
    expect(dossier.sketchCoverageMirror?.state).toBe('empty');
    expect(evaluateWorkshop2SketchCoverageExportGate(dossier)?.id).toBe('export.sketch.empty');
    const exportGate = evaluateWorkshop2TzExportBundleGate({
      dossier,
      categoryLeafId: COAT_LEAF,
    });
    expect(exportGate.checks.some((c) => c.id === 'export.sketch.empty')).toBe(true);
  });

  it('integration: handoff uses mirror blocker', () => {
    const dossier = persistWorkshop2SketchCoverageMirrorToDossier(
      emptyWorkshop2DossierPhase1(),
      COAT_LEAF
    );
    expect(evaluateWorkshop2SketchCoverageHandoffGate(dossier, COAT_LEAF)?.severity).toBe(
      'blocker'
    );
  });
});

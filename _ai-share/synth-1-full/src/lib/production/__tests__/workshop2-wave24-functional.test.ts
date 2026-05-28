/**
 * Wave 24 — push ≥9.0: POM, handoff bundle, T&A, release routing, category merge, vault.
 */
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  evaluateWorkshop2PomTableHandoffGate,
  persistWorkshop2PomTableMirrorToDossier,
} from '@/lib/production/workshop2-pom-table-dossier-persist';
import {
  evaluateWorkshop2FactoryHandoffBundleCommitGate,
  persistWorkshop2FactoryHandoffBundleMirrorToDossier,
} from '@/lib/production/workshop2-factory-handoff-bundle-dossier-persist';
import {
  evaluateWorkshop2TaMilestonesSampleGate,
  persistWorkshop2TaMilestonesMirrorToDossier,
} from '@/lib/production/workshop2-ta-milestones-mirror-persist';
import {
  evaluateWorkshop2ReleaseRoutingExportGate,
  persistWorkshop2ReleaseRoutingMirrorToDossier,
} from '@/lib/production/workshop2-release-routing-dossier-persist';
import {
  evaluateWorkshop2CategoryMergeSampleGate,
  persistWorkshop2CategoryMergeMirrorToDossier,
} from '@/lib/production/workshop2-category-merge-dossier-persist';
import {
  evaluateWorkshop2VaultPanelHandoffGate,
  persistWorkshop2VaultPanelMirrorToDossier,
} from '@/lib/production/workshop2-vault-panel-dossier-persist';
import { evaluateWorkshop2FactoryHandoffCommitGate } from '@/lib/production/workshop2-factory-handoff-commit-gate';
import { evaluateWorkshop2SampleOrderGate } from '@/lib/production/workshop2-sample-order-gate';
import { evaluateWorkshop2TzExportBundleGate } from '@/lib/production/workshop2-tz-export-bundle-gate';
import { copyTaMilestonesToDossier } from '@/lib/production/workshop2-ta-milestones-dossier-persist';
import { persistWorkshop2RoutingStepsFromDossier } from '@/lib/production/workshop2-routing-steps-persist';

const COAT_LEAF = 'catalog-apparel-g0-l0';

function dossierWithReadyPom(): ReturnType<typeof emptyWorkshop2DossierPhase1> {
  return {
    ...emptyWorkshop2DossierPhase1(),
    productionModel: {
      version: 1,
      measurements: [{ id: 'm1', name: 'Длина', baseValue: 100, tolerance: 1 }],
      materialLines: [],
      trimLines: [],
      operations: [],
    },
    sampleBasePerSizeDimensions: { M: { Длина: '100' } },
    technologistSignoff: {
      by: 'Tech',
      at: '2026-05-01T10:00:00.000Z',
      signatureDigest: 'sig-pom-wave24',
    },
  };
}

describe('workshop2 wave24 — #38 POM mirror → handoff-commit', () => {
  it('integration: blocks handoff when POM partial (mirror)', () => {
    const dossier = persistWorkshop2PomTableMirrorToDossier(emptyWorkshop2DossierPhase1());
    expect(evaluateWorkshop2PomTableHandoffGate(dossier)?.severity).toBe('blocker');
    const gate = evaluateWorkshop2FactoryHandoffCommitGate({
      dossier,
      categoryLeafId: COAT_LEAF,
      vaultFileCount: 2,
    });
    expect(gate.readiness.checks.some((c) => c.id === 'pom.table.not_ready')).toBe(true);
  });

  it('integration: ready POM mirror clears pom gate', () => {
    const dossier = persistWorkshop2PomTableMirrorToDossier(dossierWithReadyPom());
    expect(dossier.pomTableMirror?.state).toBe('ready');
    expect(evaluateWorkshop2PomTableHandoffGate(dossier)).toBeNull();
  });
});

describe('workshop2 wave24 — #45 handoff bundle mirror → commit gate', () => {
  it('integration: blocks commit when bundle draft', () => {
    const dossier = persistWorkshop2FactoryHandoffBundleMirrorToDossier({
      ...emptyWorkshop2DossierPhase1(),
      techPackFactoryHandoffs: [
        { id: 'h1', brandDispatchedAt: undefined, factoryReceivedAt: undefined },
      ],
    });
    expect(evaluateWorkshop2FactoryHandoffBundleCommitGate(dossier)?.severity).toBe('blocker');
  });

  it('integration: acknowledged bundle passes mirror gate', () => {
    const dossier = persistWorkshop2FactoryHandoffBundleMirrorToDossier({
      ...emptyWorkshop2DossierPhase1(),
      techPackFactoryHandoffs: [
        {
          id: 'h1',
          brandDispatchedAt: '2026-05-01T10:00:00.000Z',
          factoryReceivedAt: '2026-05-02T10:00:00.000Z',
        },
      ],
    });
    expect(dossier.factoryHandoffBundleMirror?.bundleState).toBe('acknowledged');
    expect(evaluateWorkshop2FactoryHandoffBundleCommitGate(dossier)).toBeNull();
  });
});

describe('workshop2 wave24 — #51 T&A milestones mirror → sample-order', () => {
  it('integration: warns when milestones empty', () => {
    const dossier = persistWorkshop2TaMilestonesMirrorToDossier(emptyWorkshop2DossierPhase1());
    expect(evaluateWorkshop2TaMilestonesSampleGate(dossier)?.id).toBe('ta.milestones.empty');
  });

  it('integration: persisted milestones clear mirror gate', () => {
    const base = copyTaMilestonesToDossier({
      dossier: emptyWorkshop2DossierPhase1(),
      milestones: [
        {
          id: 'm1',
          title: 'Заказ ткани',
          targetDate: '2026-06-01',
          status: 'pending',
        },
      ],
    });
    const dossier = persistWorkshop2TaMilestonesMirrorToDossier(base);
    expect(evaluateWorkshop2TaMilestonesSampleGate(dossier)).toBeNull();
    const gate = evaluateWorkshop2SampleOrderGate({ dossier, categoryLeafId: COAT_LEAF });
    expect(gate.readiness.checks.some((c) => c.id === 'ta.milestones.empty')).toBe(false);
  });
});

describe('workshop2 wave24 — #64 release routing mirror → export-tz', () => {
  it('integration: warns export when routing empty', () => {
    const dossier = persistWorkshop2ReleaseRoutingMirrorToDossier(emptyWorkshop2DossierPhase1());
    const check = evaluateWorkshop2ReleaseRoutingExportGate(dossier);
    expect(check?.severity).toBe('warning');
    const exportGate = evaluateWorkshop2TzExportBundleGate({
      dossier,
      categoryLeafId: COAT_LEAF,
    });
    expect(exportGate.checks.some((c) => c.id === 'release.routing.empty')).toBe(true);
  });

  it('integration: persisted routing steps pass mirror gate', () => {
    const withSteps = persistWorkshop2RoutingStepsFromDossier({
      ...emptyWorkshop2DossierPhase1(),
      smartRoutingSequence: [{ name: 'Раскрой', sash: 10, costPerUnit: 3 }],
    }).dossier;
    const dossier = persistWorkshop2ReleaseRoutingMirrorToDossier(withSteps);
    expect(dossier.releaseRoutingMirror?.routingStepCount).toBeGreaterThan(0);
    expect(evaluateWorkshop2ReleaseRoutingExportGate(dossier)).toBeNull();
  });
});

describe('workshop2 wave24 — #16 category merge mirror → sample-order warning', () => {
  it('integration: warns sample-order when orphan attributes after merge', () => {
    const dossier = persistWorkshop2CategoryMergeMirrorToDossier(emptyWorkshop2DossierPhase1(), {
      categoryLeafId: COAT_LEAF,
      mergeDiff: {
        hasChanges: true,
        warningsRu: ['Сироты'],
        orphanFilledAttributeIds: ['orphanAttr1'],
      },
    });
    expect(evaluateWorkshop2CategoryMergeSampleGate(dossier)?.id).toBe('category.merge.orphans');
    const gate = evaluateWorkshop2SampleOrderGate({ dossier, categoryLeafId: COAT_LEAF });
    expect(gate.readiness.checks.some((c) => c.id === 'category.merge.orphans')).toBe(true);
  });
});

describe('workshop2 wave24 — #75 vault panel mirror → handoff', () => {
  it('integration: warns when mirror missing', () => {
    expect(evaluateWorkshop2VaultPanelHandoffGate(emptyWorkshop2DossierPhase1())?.id).toBe(
      'vault.panel.mirror_missing'
    );
  });

  it('integration: server mode blocks handoff below min files', () => {
    const dossier = persistWorkshop2VaultPanelMirrorToDossier(emptyWorkshop2DossierPhase1(), {
      backendMode: 'server',
      vaultDocuments: [],
      s3Configured: true,
    });
    expect(evaluateWorkshop2VaultPanelHandoffGate(dossier)?.severity).toBe('blocker');
  });

  it('integration: enough storage_path clears vault gate', () => {
    const dossier = persistWorkshop2VaultPanelMirrorToDossier(emptyWorkshop2DossierPhase1(), {
      backendMode: 'server',
      vaultDocuments: [
        { id: 'd1', storagePath: 's3://a' },
        { id: 'd2', storagePath: 's3://b' },
      ],
      s3Configured: true,
    });
    expect(dossier.vaultPanelMirror?.handoffVaultOk).toBe(true);
    expect(evaluateWorkshop2VaultPanelHandoffGate(dossier)).toBeNull();
  });
});

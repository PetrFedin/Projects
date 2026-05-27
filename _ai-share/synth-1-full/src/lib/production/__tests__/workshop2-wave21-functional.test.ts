/**
 * Wave 21 — lowest <9 not in waves 14–20: hub rollup, references, backend health,
 * SKU validation, plan PO, supply risk.
 */
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  evaluateWorkshop2HubRollupSampleGate,
  persistWorkshop2HubCollectionRollupMirrorToDossier,
} from '@/lib/production/workshop2-hub-collection-rollup-persist';
import {
  evaluateWorkshop2ReferencesHandoffGate,
  persistWorkshop2ReferencesMirrorToDossier,
} from '@/lib/production/workshop2-references-dossier-persist';
import {
  evaluateWorkshop2BackendHealthSampleGate,
  persistWorkshop2BackendHealthMirrorToDossier,
} from '@/lib/production/workshop2-backend-health-dossier-persist';
import {
  evaluateWorkshop2SkuValidationSampleGate,
  persistWorkshop2ArticleSkuValidationMirrorToDossier,
} from '@/lib/production/workshop2-article-sku-validation-persist';
import {
  evaluateWorkshop2PlanPoSampleGate,
  persistWorkshop2PlanPoBundleSnapshotToDossier,
} from '@/lib/production/workshop2-plan-po-bundle-persist';
import {
  evaluateWorkshop2SupplyRiskSampleGate,
  persistWorkshop2SupplyRiskSnapshotToDossier,
} from '@/lib/production/workshop2-supply-risk-sample-gate';
import { evaluateWorkshop2SampleOrderGate } from '@/lib/production/workshop2-sample-order-gate';
import { evaluateWorkshop2FactoryHandoffCommitGate } from '@/lib/production/workshop2-factory-handoff-commit-gate';

describe('workshop2 wave21 — #1 hub rollup mirror → sample-order gate', () => {
  it('integration: warns when PG ok but zero dossiers', () => {
    const dossier = persistWorkshop2HubCollectionRollupMirrorToDossier(
      emptyWorkshop2DossierPhase1(),
      {
        collectionId: 'SS27',
        metrics: {
          postgres: 'ok',
          counts: {
            collections: 1,
            articles: 2,
            dossiers: 0,
            events: 0,
            sampleOrders: 0,
          },
        },
        collectionCounts: { articles: 2, dossiers: 0, sampleOrders: 0, events: 0 },
        metricsSource: 'pg_primary',
      }
    );
    expect(evaluateWorkshop2HubRollupSampleGate(dossier)?.id).toBe('hub.rollup.no_dossiers');
    const gate = evaluateWorkshop2SampleOrderGate({
      dossier,
      categoryLeafId: 'leaf-1',
    });
    expect(gate.readiness.checks.some((c) => c.id === 'hub.rollup.no_dossiers')).toBe(true);
  });
});

describe('workshop2 wave21 — #6 references mirror → handoff gate', () => {
  it('integration: blocks handoff when PG down', () => {
    const dossier = persistWorkshop2ReferencesMirrorToDossier(emptyWorkshop2DossierPhase1(), {
      postgres: 'down',
      directories: { materials: 'static', colors: 'static' },
    });
    expect(evaluateWorkshop2ReferencesHandoffGate(dossier)?.id).toBe('references.pg_down');
    const gate = evaluateWorkshop2FactoryHandoffCommitGate({
      dossier,
      categoryLeafId: 'leaf-1',
    });
    expect(gate.readiness.checks.some((c) => c.id === 'references.pg_down')).toBe(true);
  });
});

describe('workshop2 wave21 — #7 backend health mirror → sample-order blocker', () => {
  it('integration: blocks sample-order when not server mode', () => {
    const dossier = persistWorkshop2BackendHealthMirrorToDossier(emptyWorkshop2DossierPhase1(), {
      healthOk: false,
      postgres: 'down',
    });
    expect(evaluateWorkshop2BackendHealthSampleGate(dossier)?.id).toBe('backend.health.not_server');
    const gate = evaluateWorkshop2SampleOrderGate({
      dossier,
      categoryLeafId: 'leaf-1',
    });
    expect(gate.allowed).toBe(false);
  });
});

describe('workshop2 wave21 — #12 SKU validation mirror → sample-order blocker', () => {
  it('integration: blocks when PG reports SKU conflict', () => {
    const dossier = persistWorkshop2ArticleSkuValidationMirrorToDossier(
      emptyWorkshop2DossierPhase1(),
      {
        sku: 'SS27-M-COAT-01',
        result: {
          available: false,
          source: 'postgres',
          messageRu: 'SKU занят',
        },
      }
    );
    expect(evaluateWorkshop2SkuValidationSampleGate(dossier)?.id).toBe('article.sku.conflict');
    const gate = evaluateWorkshop2SampleOrderGate({ dossier, categoryLeafId: 'leaf-1' });
    expect(gate.allowed).toBe(false);
  });
});

describe('workshop2 wave21 — #59 plan PO snapshot → sample-order warning', () => {
  it('integration: warns on empty PO lines', () => {
    const dossier = persistWorkshop2PlanPoBundleSnapshotToDossier(emptyWorkshop2DossierPhase1(), {
      purchaseOrders: [],
    });
    expect(evaluateWorkshop2PlanPoSampleGate(dossier)?.id).toBe('plan.po.empty');
  });
});

describe('workshop2 wave21 — #60 supply risk snapshot → sample-order warning', () => {
  it('integration: warns on High risk in dossier', () => {
    const dossier = persistWorkshop2SupplyRiskSnapshotToDossier({
      ...emptyWorkshop2DossierPhase1(),
      productionModel: {
        version: 1,
        materialLines: [
          {
            id: 'm1',
            materialName: 'Silk',
            percentage: 100,
            yieldPerUnit: 1,
          },
        ],
      },
    });
    const withHigh = {
      ...dossier,
      supplyRiskSnapshot: {
        predictedDays: 45,
        riskLevel: 'High' as const,
        rationale: 'Max lead 40d',
        computedAt: new Date().toISOString(),
        source: 'dossier_bom' as const,
      },
    };
    expect(evaluateWorkshop2SupplyRiskSampleGate(withHigh)?.id).toBe('supply.risk.high');
  });

  it('integration: warns when BOM exists but snapshot missing', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      productionModel: {
        version: 1 as const,
        materialLines: [
          {
            id: 'm1',
            materialName: 'Cotton',
            percentage: 100,
            yieldPerUnit: 1,
          },
        ],
      },
    };
    expect(evaluateWorkshop2SupplyRiskSampleGate(dossier)?.id).toBe('supply.risk.snapshot_missing');
  });
});

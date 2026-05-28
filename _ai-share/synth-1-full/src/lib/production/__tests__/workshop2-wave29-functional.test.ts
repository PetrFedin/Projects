/**
 * Wave 29 — push ≥9.0: setup, references, backend health, SKU, SSE, supplier QC mirrors.
 */
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  evaluateWorkshop2SetupHealthSampleGate,
  evaluateWorkshop2SetupHealthHandoffGate,
  persistWorkshop2SetupHealthMirrorToDossier,
} from '@/lib/production/workshop2-setup-health-dossier-persist';
import {
  evaluateWorkshop2ReferencesSampleGate,
  evaluateWorkshop2ReferencesHandoffGate,
  persistWorkshop2ReferencesMirrorToDossier,
} from '@/lib/production/workshop2-references-dossier-persist';
import {
  evaluateWorkshop2BackendHealthSampleGate,
  evaluateWorkshop2BackendHealthHandoffGate,
  persistWorkshop2BackendHealthMirrorToDossier,
} from '@/lib/production/workshop2-backend-health-dossier-persist';
import {
  evaluateWorkshop2SkuValidationSampleGate,
  evaluateWorkshop2SkuValidationHandoffGate,
  persistWorkshop2ArticleSkuValidationMirrorToDossier,
} from '@/lib/production/workshop2-article-sku-validation-persist';
import {
  evaluateWorkshop2SseRealtimeSampleGate,
  evaluateWorkshop2SseRealtimeHandoffGate,
  persistWorkshop2SseRealtimeMirrorToDossier,
} from '@/lib/production/workshop2-sse-realtime-dossier-persist';
import {
  evaluateWorkshop2SupplierQcSampleGate,
  evaluateWorkshop2SupplierQcHandoffGate,
  buildWorkshop2SupplierQcSnapshotFromScorecard,
} from '@/lib/production/workshop2-supplier-qc-dossier-persist';
import { evaluateWorkshop2SampleOrderGate } from '@/lib/production/workshop2-sample-order-gate';
import { evaluateWorkshop2FactoryHandoffCommitGate } from '@/lib/production/workshop2-factory-handoff-commit-gate';

const COAT_LEAF = 'catalog-apparel-g0-l0';

describe('workshop2 wave29 — #5 setup health mirror → sample-order + handoff', () => {
  it('integration: PG down blocks sample-order and handoff', () => {
    const dossier = persistWorkshop2SetupHealthMirrorToDossier(emptyWorkshop2DossierPhase1(), {
      healthOk: false,
      postgres: 'down',
    });
    expect(evaluateWorkshop2SetupHealthSampleGate(dossier)?.severity).toBe('blocker');
    expect(evaluateWorkshop2SetupHealthHandoffGate(dossier)?.severity).toBe('blocker');
  });
});

describe('workshop2 wave29 — #6 references mirror → sample-order + handoff', () => {
  it('integration: PG down blocks sample-order and handoff', () => {
    const dossier = persistWorkshop2ReferencesMirrorToDossier(emptyWorkshop2DossierPhase1(), {
      postgres: 'down',
      directories: {},
    });
    expect(evaluateWorkshop2ReferencesSampleGate(dossier)?.severity).toBe('blocker');
    expect(evaluateWorkshop2ReferencesHandoffGate(dossier)?.severity).toBe('blocker');
  });
});

describe('workshop2 wave29 — #7 backend health mirror → sample-order + handoff', () => {
  it('integration: offline store blocks gates', () => {
    const dossier = persistWorkshop2BackendHealthMirrorToDossier(emptyWorkshop2DossierPhase1(), {
      healthOk: false,
    });
    expect(evaluateWorkshop2BackendHealthSampleGate(dossier)?.severity).toBe('blocker');
    expect(evaluateWorkshop2BackendHealthHandoffGate(dossier)?.severity).toBe('blocker');
  });
});

describe('workshop2 wave29 — #12 SKU validation mirror → sample-order + handoff', () => {
  it('integration: PG conflict blocks gates', () => {
    const dossier = persistWorkshop2ArticleSkuValidationMirrorToDossier(
      emptyWorkshop2DossierPhase1(),
      {
        sku: 'SKU-1',
        result: { available: false, source: 'postgres', messageRu: 'Занят' },
      }
    );
    expect(evaluateWorkshop2SkuValidationSampleGate(dossier)?.severity).toBe('blocker');
    expect(evaluateWorkshop2SkuValidationHandoffGate(dossier)?.severity).toBe('blocker');
  });
});

describe('workshop2 wave29 — #20 SSE realtime mirror → sample-order + handoff', () => {
  it('integration: offline blocks sample-order chain', () => {
    const dossier = persistWorkshop2SseRealtimeMirrorToDossier(emptyWorkshop2DossierPhase1(), {
      transport: 'idle',
      connectionStatus: 'offline',
      localVersion: 1,
      lastServerVersion: 1,
    });
    expect(evaluateWorkshop2SseRealtimeSampleGate(dossier)?.severity).toBe('blocker');
    expect(evaluateWorkshop2SseRealtimeHandoffGate(dossier)?.severity).toBe('blocker');
    const gate = evaluateWorkshop2SampleOrderGate({
      dossier,
      categoryLeafId: COAT_LEAF,
    });
    expect(gate.readiness.checks.some((c) => c.id === 'sse.realtime.offline')).toBe(true);
  });
});

describe('workshop2 wave29 — #70 supplier QC mirror → sample-order + handoff', () => {
  it('integration: critical pass rate blocks gates', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      supplierQcSnapshot: buildWorkshop2SupplierQcSnapshotFromScorecard({
        supplierId: 'sup-x',
        totalBatches: 5,
        passed: 1,
        failed: 4,
        rework: 0,
        passRate: 20,
        defectTypes: [],
        source: 'purchase_orders',
      }),
    };
    expect(evaluateWorkshop2SupplierQcSampleGate(dossier)?.severity).toBe('blocker');
    expect(evaluateWorkshop2SupplierQcHandoffGate(dossier)?.severity).toBe('blocker');
    const commit = evaluateWorkshop2FactoryHandoffCommitGate({
      dossier,
      categoryLeafId: COAT_LEAF,
      vaultFileCount: 1,
    });
    expect(
      commit.readiness.checks.some((c) => c.id === 'qc.supplier.pass_rate_critical_handoff')
    ).toBe(true);
  });
});

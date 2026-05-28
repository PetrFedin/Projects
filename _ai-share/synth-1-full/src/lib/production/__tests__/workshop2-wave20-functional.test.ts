/**
 * Wave 20 — lowest <9 not in waves 14–19: PLM, setup, QC, activity, matchmaker, sustainability.
 */
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  evaluateWorkshop2PlmOutboxHandoffGate,
  persistWorkshop2PlmOutboxAuditToDossier,
} from '@/lib/production/workshop2-plm-outbox-dossier-persist';
import {
  evaluateWorkshop2SetupHealthSampleGate,
  persistWorkshop2SetupHealthMirrorToDossier,
} from '@/lib/production/workshop2-setup-health-dossier-persist';
import {
  evaluateWorkshop2SupplierQcSampleGate,
  buildWorkshop2SupplierQcSnapshotFromScorecard,
} from '@/lib/production/workshop2-supplier-qc-dossier-persist';
import { persistWorkshop2HubActivityMirrorToDossier } from '@/lib/production/workshop2-hub-activity-dossier-persist';
import { evaluateWorkshop2MatchmakerHandoffGate } from '@/lib/production/workshop2-matchmaker-handoff-gate';
import {
  evaluateWorkshop2SustainabilityExportGate,
  persistWorkshop2SustainabilityLcaToDossier,
} from '@/lib/production/workshop2-sustainability-lca-persist';
import { evaluateWorkshop2FactoryHandoffCommitGate } from '@/lib/production/workshop2-factory-handoff-commit-gate';
import { evaluateWorkshop2SampleOrderGate } from '@/lib/production/workshop2-sample-order-gate';
import { evaluateWorkshop2TzExportBundleGate } from '@/lib/production/workshop2-tz-export-bundle-gate';

describe('workshop2 wave20 — #18 PLM outbox audit → handoff gate', () => {
  it('integration: blocks handoff when failed events in dossier audit', () => {
    const dossier = persistWorkshop2PlmOutboxAuditToDossier(emptyWorkshop2DossierPhase1(), {
      pending: 0,
      awaitingAck: 0,
      failed: 2,
      autoAckEnabled: false,
    });
    expect(evaluateWorkshop2PlmOutboxHandoffGate(dossier)?.id).toBe('plm.outbox.failed');
    const gate = evaluateWorkshop2FactoryHandoffCommitGate({
      dossier,
      categoryLeafId: 'leaf-1',
    });
    expect(gate.readiness.checks.some((c) => c.id === 'plm.outbox.failed')).toBe(true);
  });
});

describe('workshop2 wave20 — #5 setup health mirror → sample-order gate', () => {
  it('integration: blocks sample-order when PG down in mirror', () => {
    const dossier = persistWorkshop2SetupHealthMirrorToDossier(emptyWorkshop2DossierPhase1(), {
      healthOk: false,
      postgres: 'down',
    });
    expect(evaluateWorkshop2SetupHealthSampleGate(dossier)?.id).toBe('setup.health.pg_down');
    const gate = evaluateWorkshop2SampleOrderGate({
      dossier,
      categoryLeafId: 'leaf-1',
    });
    expect(gate.allowed).toBe(false);
    expect(gate.readiness.checks.some((c) => c.id === 'setup.health.pg_down')).toBe(true);
  });
});

describe('workshop2 wave20 — #70 supplier QC snapshot → sample-order warning', () => {
  it('integration: warns on low pass rate in dossier snapshot', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      supplierQcSnapshot: buildWorkshop2SupplierQcSnapshotFromScorecard({
        supplierId: 'sup-1',
        totalBatches: 5,
        passed: 1,
        failed: 2,
        rework: 1,
        passRate: 30,
        defectTypes: [{ name: 'PO error', value: 2 }],
        source: 'purchase_orders',
      }),
    };
    expect(evaluateWorkshop2SupplierQcSampleGate(dossier)?.id).toBe('qc.supplier.pass_rate_low');
  });
});

describe('workshop2 wave20 — #8 hub activity mirror', () => {
  it('integration: mirrors server event counts into dossier', () => {
    const dossier = persistWorkshop2HubActivityMirrorToDossier(emptyWorkshop2DossierPhase1(), {
      entries: [
        {
          id: 'srv-1',
          at: '2026-05-20T10:00:00.000Z',
          line: 'DOSSIER_SAVED',
          collectionId: 'SS27',
          articleId: 'a1',
        },
      ],
      lastEventType: 'DOSSIER_SAVED',
    });
    expect(dossier.hubActivityMirror?.serverCount).toBe(1);
    expect(dossier.hubActivityMirror?.state).toBe('merged');
  });
});

describe('workshop2 wave20 — #9 matchmaker handoff gate', () => {
  it('integration: warns when sewing plan without matchmaker result', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      sewingPlan: { partnerId: 'p1', partnerLabel: 'Factory A' },
    };
    expect(evaluateWorkshop2MatchmakerHandoffGate(dossier)?.id).toBe('matchmaker.result.missing');
  });
});

describe('workshop2 wave20 — #53 sustainability LCA → export-tz gate', () => {
  it('integration: warns export ZIP without LCA snapshot', () => {
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
        trimLines: [],
        nodes: [],
        operations: [],
        measurements: [],
      },
    };
    const check = evaluateWorkshop2SustainabilityExportGate({
      dossier,
      collectionId: 'SS27',
      articleId: 'a1',
    });
    expect(check?.id).toBe('sustainability.lca.snapshot_missing');
    const gate = evaluateWorkshop2TzExportBundleGate({
      dossier,
      collectionId: 'SS27',
      articleId: 'a1',
    });
    expect(gate.checks.some((c) => c.id === 'sustainability.lca.snapshot_missing')).toBe(true);
  });

  it('integration: passes export gate after LCA persist', () => {
    const base = {
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
        trimLines: [],
        nodes: [],
        operations: [],
        measurements: [],
      },
    };
    const dossier = persistWorkshop2SustainabilityLcaToDossier(base, {
      collectionId: 'SS27',
      articleId: 'a1',
    });
    expect(
      evaluateWorkshop2SustainabilityExportGate({
        dossier,
        collectionId: 'SS27',
        articleId: 'a1',
      })?.id
    ).not.toBe('sustainability.lca.snapshot_missing');
  });
});

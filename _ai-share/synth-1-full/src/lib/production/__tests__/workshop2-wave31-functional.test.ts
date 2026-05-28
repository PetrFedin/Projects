/**
 * Wave 31 — push ≥9.0: visual refs, fit sessions, plan PO, supply risk, logistics, WMS.
 */
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  evaluateWorkshop2VisualReferencesSampleGate,
  evaluateWorkshop2VisualReferencesHandoffGate,
  persistWorkshop2VisualReferencesMirrorToDossier,
} from '@/lib/production/workshop2-visual-references-dossier-persist';
import {
  evaluateWorkshop2FitSessionsSampleGate,
  evaluateWorkshop2FitSessionsHandoffGate,
  persistWorkshop2FitSessionsMirrorToDossier,
} from '@/lib/production/workshop2-fit-sessions-dossier-persist';
import {
  evaluateWorkshop2PlanPoSampleGate,
  evaluateWorkshop2PlanPoHandoffGate,
  persistWorkshop2PlanPoBundleSnapshotToDossier,
} from '@/lib/production/workshop2-plan-po-bundle-persist';
import {
  evaluateWorkshop2SupplyRiskSampleGate,
  evaluateWorkshop2SupplyRiskHandoffGate,
  persistWorkshop2SupplyRiskSnapshotToDossier,
} from '@/lib/production/workshop2-supply-risk-sample-gate';
import {
  evaluateWorkshop2LogisticsSampleGate,
  evaluateWorkshop2LogisticsHandoffGate,
  persistWorkshop2LogisticsShipmentMirrorToDossier,
} from '@/lib/production/workshop2-logistics-dossier-persist';
import {
  evaluateWorkshop2StockWmsLedgerGate,
  evaluateWorkshop2StockWmsHandoffGate,
  persistWorkshop2StockWmsLedgerToDossier,
} from '@/lib/production/workshop2-stock-wms-ledger-persist';
import { evaluateWorkshop2SampleOrderGate } from '@/lib/production/workshop2-sample-order-gate';
import { evaluateWorkshop2FactoryHandoffCommitGate } from '@/lib/production/workshop2-factory-handoff-commit-gate';
import { evaluateWorkshop2TzExportBundleGate } from '@/lib/production/workshop2-tz-export-bundle-gate';

const COAT_LEAF = 'catalog-apparel-g0-l0';

describe('workshop2 wave31 — #31 visual references mirror → sample + export + handoff', () => {
  it('integration: missing mirror blocks sample-order; empty refs block export', () => {
    const gateMissing = evaluateWorkshop2SampleOrderGate({
      dossier: emptyWorkshop2DossierPhase1(),
      categoryLeafId: COAT_LEAF,
    });
    expect(gateMissing.readiness.checks.some((c) => c.id === 'visual.refs.mirror_missing')).toBe(
      true
    );

    const dossier = persistWorkshop2VisualReferencesMirrorToDossier({
      ...emptyWorkshop2DossierPhase1(),
      visualReferences: [],
    });
    expect(evaluateWorkshop2VisualReferencesSampleGate(dossier)?.id).toBe('visual.refs.not_ready');
    expect(evaluateWorkshop2VisualReferencesHandoffGate(dossier)?.id).toBe(
      'visual.refs.handoff_blocked'
    );
    const exportGate = evaluateWorkshop2TzExportBundleGate({
      dossier,
      categoryLeafId: COAT_LEAF,
    });
    expect(exportGate.checks.some((c) => c.id === 'visual.refs.not_ready')).toBe(true);
  });
});

describe('workshop2 wave31 — #54 fit sessions mirror → handoff blocker', () => {
  it('integration: empty sessions block handoff after mirror persist', () => {
    const dossier = persistWorkshop2FitSessionsMirrorToDossier(emptyWorkshop2DossierPhase1(), []);
    expect(evaluateWorkshop2FitSessionsHandoffGate(dossier)?.id).toBe('fit.sessions.empty_handoff');
    const commit = evaluateWorkshop2FactoryHandoffCommitGate({
      dossier,
      categoryLeafId: COAT_LEAF,
    });
    expect(commit.readiness.checks.some((c) => c.id === 'fit.sessions.empty_handoff')).toBe(true);
  });
});

describe('workshop2 wave31 — #59 plan PO mirror → sample + handoff', () => {
  it('integration: empty plan blocks sample-order and handoff', () => {
    const dossier = persistWorkshop2PlanPoBundleSnapshotToDossier(emptyWorkshop2DossierPhase1(), {
      purchaseOrders: [],
    });
    expect(evaluateWorkshop2PlanPoSampleGate(dossier)?.severity).toBe('blocker');
    expect(evaluateWorkshop2PlanPoHandoffGate(dossier)?.id).toBe('plan.po.empty_handoff');
    const gate = evaluateWorkshop2SampleOrderGate({
      dossier,
      categoryLeafId: COAT_LEAF,
    });
    expect(gate.allowed).toBe(false);
  });
});

describe('workshop2 wave31 — #60 supply risk → sample + handoff with BOM', () => {
  it('integration: BOM without snapshot blocks sample and handoff', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      productionModel: {
        materialLines: [{ nodeId: 'n1', materialId: 'm1', qty: 1 }],
      },
    };
    expect(evaluateWorkshop2SupplyRiskSampleGate(dossier)?.severity).toBe('blocker');
    expect(evaluateWorkshop2SupplyRiskHandoffGate(dossier)?.severity).toBe('blocker');
    const withSnap = persistWorkshop2SupplyRiskSnapshotToDossier(dossier);
    expect(evaluateWorkshop2SupplyRiskSampleGate(withSnap)).toBeNull();
  });
});

describe('workshop2 wave31 — #65 logistics unlinked → handoff blocker', () => {
  it('integration: shipment without sample order blocks handoff', () => {
    const dossier = persistWorkshop2LogisticsShipmentMirrorToDossier(
      emptyWorkshop2DossierPhase1(),
      {
        shipmentCount: 1,
        linkedToSampleOrder: false,
        currentStep: 'transit',
      }
    );
    expect(evaluateWorkshop2LogisticsHandoffGate(dossier)?.id).toBe(
      'logistics.sample_unlinked_handoff'
    );
    expect(evaluateWorkshop2LogisticsSampleGate(dossier)?.id).toBe('logistics.sample_unlinked');
  });
});

describe('workshop2 wave31 — #71 WMS ledger negative → handoff blocker', () => {
  it('integration: negative ledger blocks handoff commit', () => {
    const dossier = persistWorkshop2StockWmsLedgerToDossier(emptyWorkshop2DossierPhase1(), {
      stock: {
        movements: [
          { id: 'm1', kind: 'out', qty: 5, at: new Date().toISOString(), unitCostRub: 1 },
        ],
      },
    });
    expect(dossier.stockWmsLedger?.negativeBalance).toBe(true);
    expect(evaluateWorkshop2StockWmsHandoffGate({ dossier })?.id).toBe(
      'stock.wms.negative_handoff'
    );
    const commit = evaluateWorkshop2FactoryHandoffCommitGate({
      dossier,
      categoryLeafId: COAT_LEAF,
    });
    expect(commit.readiness.checks.some((c) => c.id === 'stock.wms.negative_handoff')).toBe(true);
  });
});

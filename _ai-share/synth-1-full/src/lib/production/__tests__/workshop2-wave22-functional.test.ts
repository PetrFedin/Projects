/**
 * Wave 22 — lowest <9 not in waves 14–21: hub filters, visual refs, smart routing,
 * PO ERP, fit sessions, logistics.
 */
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  evaluateWorkshop2HubFilterSampleGate,
  persistWorkshop2HubFilterMirrorToDossier,
} from '@/lib/production/workshop2-hub-filter-dossier-persist';
import {
  evaluateWorkshop2VisualReferencesExportGate,
  evaluateWorkshop2VisualReferencesHandoffGate,
  persistWorkshop2VisualReferencesMirrorToDossier,
} from '@/lib/production/workshop2-visual-references-dossier-persist';
import {
  evaluateWorkshop2SmartRoutingHandoffGate,
  persistWorkshop2SmartRoutingMirrorToDossier,
} from '@/lib/production/workshop2-smart-routing-dossier-persist';
import {
  evaluateWorkshop2PurchaseOrderErpSampleGate,
  persistWorkshop2PurchaseOrderErpMirrorToDossier,
} from '@/lib/production/workshop2-purchase-order-erp-dossier-persist';
import {
  evaluateWorkshop2FitSessionsSampleGate,
  persistWorkshop2FitSessionsMirrorToDossier,
} from '@/lib/production/workshop2-fit-sessions-dossier-persist';
import {
  evaluateWorkshop2LogisticsSampleGate,
  persistWorkshop2LogisticsShipmentMirrorToDossier,
} from '@/lib/production/workshop2-logistics-dossier-persist';
import { evaluateWorkshop2SampleOrderGate } from '@/lib/production/workshop2-sample-order-gate';
import { evaluateWorkshop2FactoryHandoffCommitGate } from '@/lib/production/workshop2-factory-handoff-commit-gate';
import { evaluateWorkshop2TzExportBundleGate } from '@/lib/production/workshop2-tz-export-bundle-gate';

describe('workshop2 wave22 — #3 hub filter mirror → sample-order gate', () => {
  it('integration: blocks sample-order when TZ below hub filter threshold', () => {
    const dossier = persistWorkshop2HubFilterMirrorToDossier(emptyWorkshop2DossierPhase1(), {
      tzOverallPct: 20,
      goldApproved: false,
      hasSampleOrder: false,
    });
    expect(evaluateWorkshop2HubFilterSampleGate(dossier)?.id).toBe('hub.filter.tz_low');
    const gate = evaluateWorkshop2SampleOrderGate({
      dossier,
      categoryLeafId: 'leaf-1',
    });
    expect(gate.allowed).toBe(false);
    expect(gate.readiness.checks.some((c) => c.id === 'hub.filter.tz_low')).toBe(true);
  });
});

describe('workshop2 wave22 — #31 visual references mirror → export/handoff gates', () => {
  it('integration: blocks TZ ZIP export when visual gate not ready', () => {
    const dossier = persistWorkshop2VisualReferencesMirrorToDossier({
      ...emptyWorkshop2DossierPhase1(),
      visualReferences: [],
    });
    expect(evaluateWorkshop2VisualReferencesExportGate(dossier)?.id).toBe('visual.refs.not_ready');
    const exportGate = evaluateWorkshop2TzExportBundleGate({
      dossier,
      categoryLeafId: 'leaf-1',
    });
    expect(exportGate.allowed).toBe(false);
    expect(exportGate.checks.some((c) => c.id === 'visual.refs.not_ready')).toBe(true);
  });

  it('integration: blocks handoff when visual refs mirror blocks export', () => {
    const dossier = persistWorkshop2VisualReferencesMirrorToDossier({
      ...emptyWorkshop2DossierPhase1(),
      visualReferences: [],
    });
    expect(evaluateWorkshop2VisualReferencesHandoffGate(dossier)?.id).toBe(
      'visual.refs.handoff_blocked'
    );
    const gate = evaluateWorkshop2FactoryHandoffCommitGate({
      dossier,
      categoryLeafId: 'leaf-1',
    });
    expect(gate.readiness.checks.some((c) => c.id === 'visual.refs.handoff_blocked')).toBe(true);
  });
});

describe('workshop2 wave22 — #42 smart routing mirror → handoff-commit gate', () => {
  it('integration: blocks handoff when sewing plan set but routing empty', () => {
    const base = {
      ...emptyWorkshop2DossierPhase1(),
      sewingPlan: { partnerId: 'factory-a', partnerName: 'Factory A' },
      routingSteps: [],
      smartRoutingSequence: [],
    };
    const dossier = persistWorkshop2SmartRoutingMirrorToDossier(base);
    expect(evaluateWorkshop2SmartRoutingHandoffGate(dossier)?.id).toBe('routing.steps.empty');
    const gate = evaluateWorkshop2FactoryHandoffCommitGate({
      dossier,
      categoryLeafId: 'leaf-1',
    });
    expect(gate.readiness.checks.some((c) => c.id === 'routing.steps.empty')).toBe(true);
  });
});

describe('workshop2 wave22 — #47 PO ERP mirror → sample-order gate', () => {
  it('integration: blocks sample-order on fake synced without erpOrderId', () => {
    const prev = process.env.WORKSHOP2_FACTORY_ERP_BASE_URL;
    process.env.WORKSHOP2_FACTORY_ERP_BASE_URL = 'https://erp.test.local';
    const dossier = persistWorkshop2PurchaseOrderErpMirrorToDossier(emptyWorkshop2DossierPhase1(), {
      purchaseOrders: [{ id: 'po-1', status: 'synced', erpExternalId: null }],
      erpConfigured: true,
    });
    if (prev === undefined) delete process.env.WORKSHOP2_FACTORY_ERP_BASE_URL;
    else process.env.WORKSHOP2_FACTORY_ERP_BASE_URL = prev;
    expect(evaluateWorkshop2PurchaseOrderErpSampleGate(dossier)?.id).toBe('po.erp.fake_synced');
    const gate = evaluateWorkshop2SampleOrderGate({
      dossier,
      categoryLeafId: 'leaf-1',
    });
    expect(gate.allowed).toBe(false);
  });
});

describe('workshop2 wave22 — #54 fit sessions mirror → sample-order warning', () => {
  it('integration: warns when no fit sessions in mirror', () => {
    const dossier = persistWorkshop2FitSessionsMirrorToDossier(emptyWorkshop2DossierPhase1(), []);
    expect(evaluateWorkshop2FitSessionsSampleGate(dossier)?.id).toBe('fit.sessions.empty');
    const gate = evaluateWorkshop2SampleOrderGate({
      dossier,
      categoryLeafId: 'leaf-1',
    });
    expect(gate.readiness.checks.some((c) => c.id === 'fit.sessions.empty')).toBe(true);
  });
});

describe('workshop2 wave22 — #65 logistics mirror → sample-order warning', () => {
  it('integration: warns when shipment exists but not linked to sample order', () => {
    const dossier = persistWorkshop2LogisticsShipmentMirrorToDossier(
      emptyWorkshop2DossierPhase1(),
      {
        shipmentCount: 1,
        linkedToSampleOrder: false,
        currentStep: 'in_transit',
        status: 'active',
      }
    );
    expect(evaluateWorkshop2LogisticsSampleGate(dossier)?.id).toBe('logistics.sample_unlinked');
    const gate = evaluateWorkshop2SampleOrderGate({
      dossier,
      categoryLeafId: 'leaf-1',
    });
    expect(gate.readiness.checks.some((c) => c.id === 'logistics.sample_unlinked')).toBe(true);
  });
});

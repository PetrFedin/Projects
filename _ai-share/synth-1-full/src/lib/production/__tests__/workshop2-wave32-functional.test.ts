/**
 * Wave 32 — #67 QC panel, #68 inspector mirrors; ceilings env probes (no fake 9).
 */
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  persistWorkshop2QcPanelMirrorToDossier,
  evaluateWorkshop2QcPanelSampleGate,
  evaluateWorkshop2QcPanelHandoffGate,
} from '@/lib/production/workshop2-qc-panel-dossier-persist';
import {
  persistWorkshop2InspectorReportMirrorToDossier,
  evaluateWorkshop2InspectorReportSampleGate,
  evaluateWorkshop2InspectorReportHandoffGate,
} from '@/lib/production/workshop2-inspector-report-dossier-persist';
import {
  isWorkshop2LiveDppConfigured,
  isWorkshop2LiveErpConfigured,
  isWorkshop2LiveNestingConfigured,
  isWorkshop2LiveShowroomConfigured,
  workshop2LiveIntegrationProbeSummary,
} from '@/lib/production/workshop2-live-integration-probes';
import { evaluateWorkshop2SampleOrderGate } from '@/lib/production/workshop2-sample-order-gate';
import { evaluateWorkshop2FactoryHandoffCommitGate } from '@/lib/production/workshop2-factory-handoff-commit-gate';

const COAT_LEAF = 'catalog-apparel-g0-l0';

describe('workshop2 wave32 — #67 qcPanelMirror gates', () => {
  it('blocks sample-order when mirror missing', () => {
    const gate = evaluateWorkshop2SampleOrderGate({
      dossier: emptyWorkshop2DossierPhase1(),
      categoryLeafId: COAT_LEAF,
    });
    expect(gate.readiness.checks.some((c) => c.id === 'qc.panel.mirror_missing')).toBe(true);
  });

  it('ready mirror passes sample; pending+no inspector blocks handoff', () => {
    const ready = persistWorkshop2QcPanelMirrorToDossier(emptyWorkshop2DossierPhase1(), {
      batchCount: 2,
      pendingBatchCount: 0,
      failedBatchCount: 0,
      hasSampleOrder: true,
      hasInspectorLink: true,
      supplierId: 'sup-1',
      supplierSource: 'purchase_order',
      purchaseOrderCount: 1,
      poConfirmedCount: 1,
      activeSampleOrderId: 'ord-1',
    });
    expect(evaluateWorkshop2QcPanelSampleGate(ready)).toBeNull();
    expect(evaluateWorkshop2QcPanelHandoffGate(ready)).toBeNull();

    const pending = persistWorkshop2QcPanelMirrorToDossier(emptyWorkshop2DossierPhase1(), {
      batchCount: 1,
      pendingBatchCount: 1,
      failedBatchCount: 0,
      hasSampleOrder: true,
      hasInspectorLink: false,
      supplierId: 'sup-1',
      supplierSource: 'purchase_order',
      purchaseOrderCount: 1,
      poConfirmedCount: 0,
    });
    expect(evaluateWorkshop2QcPanelHandoffGate(pending)?.id).toBe('qc.panel.not_ready_handoff');
    const commit = evaluateWorkshop2FactoryHandoffCommitGate({
      dossier: pending,
      categoryLeafId: COAT_LEAF,
    });
    expect(commit.readiness.checks.some((c) => c.id === 'qc.panel.not_ready_handoff')).toBe(true);
  });
});

describe('workshop2 wave32 — #68 inspectorReportMirror fail-closed', () => {
  it('offlineOnly blocks sample and handoff', () => {
    const offline = persistWorkshop2InspectorReportMirrorToDossier(emptyWorkshop2DossierPhase1(), {
      sampleOrderId: 'ord-1',
      totalItems: 5,
      checkedCount: 5,
      requiredDone: 3,
      requiredTotal: 3,
      pgSynced: false,
      saveState: 'error',
    });
    expect(offline.inspectorReportMirror?.offlineOnly).toBe(true);
    expect(evaluateWorkshop2InspectorReportSampleGate(offline)?.id).toBe(
      'qc.inspector.offline_only'
    );
    expect(evaluateWorkshop2InspectorReportHandoffGate(offline)?.id).toBe(
      'qc.inspector.not_ready_handoff'
    );
  });

  it('pgSynced + required complete passes handoff gate', () => {
    const synced = persistWorkshop2InspectorReportMirrorToDossier(emptyWorkshop2DossierPhase1(), {
      sampleOrderId: 'ord-1',
      totalItems: 4,
      checkedCount: 4,
      requiredDone: 2,
      requiredTotal: 2,
      pgSynced: true,
      saveState: 'saved',
    });
    expect(evaluateWorkshop2InspectorReportHandoffGate(synced)).toBeNull();
  });
});

describe('workshop2 wave32 — ceiling env probes (honest, not 9.0)', () => {
  const env = {} as Record<string, string | undefined>;

  beforeEach(() => {
    delete env.WORKSHOP2_FACTORY_ERP_BASE_URL;
    delete env.WORKSHOP2_NESTING_API_URL;
    delete env.WORKSHOP2_DPP_REGISTRY_URL;
    delete env.WORKSHOP2_SHOWROOM_B2B_WEBHOOK_URL;
  });

  it('all false when env unset', () => {
    expect(workshop2LiveIntegrationProbeSummary(env)).toEqual({
      erp: false,
      nesting: false,
      dpp: false,
      showroom: false,
      sustainability: false,
      fit3d: false,
      plmTransport: false,
    });
  });

  it('detects configured integrations without inflating catalog score', () => {
    env.WORKSHOP2_FACTORY_ERP_BASE_URL = 'http://erp.test';
    env.WORKSHOP2_NESTING_API_URL = 'http://nest.test';
    env.WORKSHOP2_DPP_REGISTRY_URL = 'https://dpp.eu';
    env.WORKSHOP2_SHOWROOM_B2B_WEBHOOK_URL = 'https://b2b.test/hook';
    expect(isWorkshop2LiveErpConfigured(env)).toBe(true);
    expect(isWorkshop2LiveNestingConfigured(env)).toBe(true);
    expect(isWorkshop2LiveDppConfigured(env)).toBe(true);
    expect(isWorkshop2LiveShowroomConfigured(env)).toBe(true);
    env.WORKSHOP2_LCA_API_URL = 'https://lca.test';
    env.WORKSHOP2_VAULT_CAD_INGEST_URL = 'https://vault.test';
    env.WORKSHOP2_PLM_WEBHOOK_URL = 'https://plm.test';
    env.WORKSHOP2_PLM_PARTNER_ACK_URL = 'https://plm-ack.test';
    const full = workshop2LiveIntegrationProbeSummary(env);
    expect(full.sustainability).toBe(true);
    expect(full.fit3d).toBe(true);
    expect(full.plmTransport).toBe(true);
  });
});

/**
 * Wave 35 — strict <9 integration: #1 #8 #18 #40 #47 #65
 * PG mirror + server gates + journal-only modes (no banner-only).
 */
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  buildWorkshop2HubCollectionRollupMirror,
  evaluateWorkshop2HubRollupExportGate,
  evaluateWorkshop2HubRollupSampleGate,
} from '@/lib/production/workshop2-hub-collection-rollup-persist';
import {
  buildWorkshop2HubActivityMirrorFromEntries,
  evaluateWorkshop2HubActivityExportGate,
  evaluateWorkshop2HubActivityHandoffGate,
} from '@/lib/production/workshop2-hub-activity-dossier-persist';
import {
  buildWorkshop2PlmOutboxMirrorFromCounts,
  evaluateWorkshop2PlmOutboxExportGate,
} from '@/lib/production/workshop2-plm-outbox-dossier-persist';
import {
  buildWorkshop2CadVaultLinkMirror,
  evaluateWorkshop2CadVaultLinkExportGate,
} from '@/lib/production/workshop2-cad-vault-dossier-persist';
import {
  buildWorkshop2PurchaseOrderErpMirror,
  evaluateWorkshop2PurchaseOrderErpHandoffGate,
} from '@/lib/production/workshop2-purchase-order-erp-dossier-persist';
import {
  buildWorkshop2LogisticsShipmentMirror,
  evaluateWorkshop2LogisticsExportGate,
} from '@/lib/production/workshop2-logistics-dossier-persist';
import { evaluateWorkshop2TzExportBundleGate } from '@/lib/production/workshop2-tz-export-bundle-gate';

describe('workshop2 wave35 integration — #1 hub rollup pg_primary', () => {
  it('serverRollupEnabled when pg_primary collection counts', () => {
    const mirror = buildWorkshop2HubCollectionRollupMirror({
      collectionId: 'ss27',
      metrics: {
        postgres: 'ok',
        counts: { collections: 1, articles: 5, dossiers: 5, events: 10, sampleOrders: 2 },
      },
      collectionCounts: { articles: 3, dossiers: 3, sampleOrders: 1, events: 4 },
      metricsSource: 'pg_primary',
    });
    expect(mirror.serverRollupEnabled).toBe(true);
    expect(mirror.metricsSource).toBe('pg_primary');
    expect(
      evaluateWorkshop2HubRollupSampleGate({
        ...emptyWorkshop2DossierPhase1(),
        hubCollectionRollupMirror: mirror,
      })
    ).toBeNull();
  });

  it('ls_fallback blocks sample-order', () => {
    const mirror = buildWorkshop2HubCollectionRollupMirror({
      collectionId: 'ss27',
      metrics: { postgres: 'ok', counts: null },
      metricsSource: 'ls_fallback',
    });
    expect(
      evaluateWorkshop2HubRollupSampleGate({
        ...emptyWorkshop2DossierPhase1(),
        hubCollectionRollupMirror: mirror,
      })?.severity
    ).toBe('blocker');
  });
});

describe('workshop2 wave35 integration — #8 hub activity pg_audit', () => {
  it('serverWorkflowEnabled on merged PG events', () => {
    const mirror = buildWorkshop2HubActivityMirrorFromEntries(
      [
        {
          id: 'srv-1',
          at: '2026-05-20T10:00:00.000Z',
          line: 'dossier_saved',
          collectionId: 'c',
          articleId: 'a',
        },
      ],
      'dossier_saved'
    );
    expect(mirror.serverAuditMode).toBe('pg_audit');
    expect(mirror.serverWorkflowEnabled).toBe(true);
    expect(
      evaluateWorkshop2HubActivityHandoffGate({
        ...emptyWorkshop2DossierPhase1(),
        hubActivityMirror: mirror,
      })
    ).toBeNull();
  });

  it('local_only blocks sample when entries exist', () => {
    const mirror = buildWorkshop2HubActivityMirrorFromEntries([
      {
        id: 'loc-1',
        at: '2026-05-20T10:00:00.000Z',
        line: 'local',
        collectionId: 'c',
        articleId: 'a',
      },
    ]);
    expect(mirror.serverWorkflowEnabled).toBe(false);
    expect(mirror.blockerSampleOrder).toBe(true);
  });
});

describe('workshop2 wave35 integration — #18 PLM transportKind', () => {
  it('outbox_journal when live transport not configured', () => {
    const mirror = buildWorkshop2PlmOutboxMirrorFromCounts({
      pending: 0,
      awaitingAck: 0,
      failed: 0,
      autoAckEnabled: false,
    });
    expect(mirror.transportKind).toBe('outbox_journal');
    expect(mirror.serverWorkflowEnabled).toBe(true);
    expect(
      evaluateWorkshop2PlmOutboxExportGate({
        ...emptyWorkshop2DossierPhase1(),
        plmOutboxMirror: mirror,
      })
    ).toBeNull();
  });
});

describe('workshop2 wave35 integration — #40 CAD vault ingest path', () => {
  it('vault_cad_ingest when measures ready', () => {
    const mirror = buildWorkshop2CadVaultLinkMirror({
      vaultCadDocs: [
        {
          documentId: 'cad-1',
          storagePath: 's3://x/cad.dxf',
          metadata: {
            kind: 'cad',
            measures: [
              { name: 'A', value: 1 },
              { name: 'B', value: 2 },
              { name: 'C', value: 3 },
            ],
          },
        },
      ],
    });
    expect(mirror.cadIngestPath).toBe('vault_cad_ingest');
    expect(mirror.serverWorkflowEnabled).toBe(true);
  });

  it('export blocks demo_zprj', () => {
    const mirror = buildWorkshop2CadVaultLinkMirror({
      vaultCadDocs: [],
      proprietaryDemoParseActive: true,
    });
    expect(
      evaluateWorkshop2CadVaultLinkExportGate({
        ...emptyWorkshop2DossierPhase1(),
        cadVaultLinkMirror: mirror,
      })?.id
    ).toBe('cad.vault.export_demo_only');
  });
});

describe('workshop2 wave35 integration — #47 PO ERP journal_only', () => {
  it('journal_only allows handoff without fake synced when ERP off', () => {
    const mirror = buildWorkshop2PurchaseOrderErpMirror({
      purchaseOrders: [{ id: 'po-1', status: 'synced', erpExternalId: null }],
      erpConfigured: false,
    });
    expect(mirror.erpSyncMode).toBe('journal_only');
    expect(mirror.blockerHandoff).toBe(false);
    expect(
      evaluateWorkshop2PurchaseOrderErpHandoffGate({
        ...emptyWorkshop2DossierPhase1(),
        purchaseOrderErpMirror: mirror,
      })
    ).toBeNull();
  });
});

describe('workshop2 wave35 integration — #65 logistics journal_only', () => {
  it('journal_only allows linked shipment workflow', () => {
    const mirror = buildWorkshop2LogisticsShipmentMirror({
      shipmentCount: 1,
      linkedToSampleOrder: true,
      currentStep: 'transit',
    });
    expect(mirror.logisticsMode).toBe('journal_only');
    expect(mirror.serverWorkflowEnabled).toBe(true);
    expect(mirror.blockerHandoff).toBe(false);
    expect(
      evaluateWorkshop2LogisticsExportGate({
        ...emptyWorkshop2DossierPhase1(),
        logisticsShipmentMirror: mirror,
      })
    ).toBeNull();
  });

  it('export warns when mirror missing', () => {
    expect(evaluateWorkshop2LogisticsExportGate(emptyWorkshop2DossierPhase1())?.id).toBe(
      'logistics.export_missing'
    );
  });
});

describe('workshop2 wave35 integration — export-tz wave35 gates wired', () => {
  it('includes hub rollup export warning when ls_fallback', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      hubCollectionRollupMirror: buildWorkshop2HubCollectionRollupMirror({
        collectionId: 'c',
        metrics: { postgres: 'ok', counts: null },
        metricsSource: 'ls_fallback',
      }),
    };
    const gate = evaluateWorkshop2TzExportBundleGate({
      dossier,
      collectionId: 'c',
      articleId: 'a',
    });
    expect(gate.checks.some((c) => c.id === 'hub.rollup.export_ls_fallback')).toBe(true);
  });

  it('includes activity export warning without pg_audit', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      hubActivityMirror: buildWorkshop2HubActivityMirrorFromEntries([]),
    };
    const gate = evaluateWorkshop2TzExportBundleGate({
      dossier,
      collectionId: 'c',
      articleId: 'a',
    });
    expect(gate.checks.some((c) => c.id === 'hub.activity.export_no_pg_audit')).toBe(true);
  });
});

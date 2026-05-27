/**
 * Wave 30 — push ≥9.0: hub filter preset, R&D lifecycle, CAD vault, smart routing demo guard,
 * PO ERP handoff, AQL persist gates; ceilings: live-integration labels (no mock-as-success).
 */
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  evaluateWorkshop2HubFilterSampleGate,
  persistWorkshop2HubFilterMirrorToDossier,
} from '@/lib/production/workshop2-hub-filter-dossier-persist';
import {
  evaluateWorkshop2RndLifecycleSampleGate,
  evaluateWorkshop2RndLifecycleHandoffGate,
  persistWorkshop2RndLifecycleMirrorToDossier,
} from '@/lib/production/workshop2-rnd-lifecycle-dossier-persist';
import {
  evaluateWorkshop2CadVaultLinkSampleGate,
  evaluateWorkshop2CadVaultLinkHandoffGate,
  persistWorkshop2CadVaultLinkMirrorToDossier,
} from '@/lib/production/workshop2-cad-vault-dossier-persist';
import {
  evaluateWorkshop2SmartRoutingSampleGate,
  persistWorkshop2SmartRoutingMirrorToDossier,
} from '@/lib/production/workshop2-smart-routing-dossier-persist';
import {
  evaluateWorkshop2PurchaseOrderErpHandoffGate,
  persistWorkshop2PurchaseOrderErpMirrorToDossier,
} from '@/lib/production/workshop2-purchase-order-erp-dossier-persist';
import {
  evaluateWorkshop2QcAqlSampleGate,
  evaluateWorkshop2QcAqlHandoffGate,
  persistWorkshop2QcAqlRecordToDossier,
} from '@/lib/production/workshop2-qc-aql-dossier-persist';
import { evaluateWorkshop2SampleOrderGate } from '@/lib/production/workshop2-sample-order-gate';
import { evaluateWorkshop2FactoryHandoffCommitGate } from '@/lib/production/workshop2-factory-handoff-commit-gate';
import { WORKSHOP2_LIVE_INTEGRATION_LABELS } from '@/lib/production/workshop2-integration-live-required';
import { formatWorkshop2PlmOutboxBadge } from '@/lib/production/workshop2-plm-outbox-badge';
import { evaluateWorkshop2DppExportGate } from '@/lib/production/workshop2-dpp-export-gate';
import { evaluateWorkshop2NestingExportGate } from '@/lib/production/workshop2-nesting-export-gate';

const COAT_LEAF = 'catalog-apparel-g0-l0';

describe('workshop2 wave30 — #3 hub filter preset in PG mirror', () => {
  it('integration: preset fields mirrored; TZ gate unchanged', () => {
    const dossier = persistWorkshop2HubFilterMirrorToDossier(emptyWorkshop2DossierPhase1(), {
      tzOverallPct: 50,
      goldApproved: true,
      hasSampleOrder: false,
      preset: {
        savedAt: new Date().toISOString(),
        search: 'coat',
        tagFilter: ['gold'],
        articleFilter: '',
        catL1: 'apparel',
        catL2: '',
        catL3: '',
        advanced: { minTzPct: 40, goldApprovedOnly: true },
      },
    });
    expect(dossier.hubFilterMirror?.presetActive).toBe(true);
    expect(dossier.hubFilterMirror?.presetMinTzPct).toBe(40);
    expect(evaluateWorkshop2HubFilterSampleGate(dossier)).toBeNull();
  });
});

describe('workshop2 wave30 — #19 R&D lifecycle mirror → sample + handoff', () => {
  it('integration: rework_requested blocks sample-order and handoff', () => {
    const dossier = persistWorkshop2RndLifecycleMirrorToDossier({
      ...emptyWorkshop2DossierPhase1(),
      lifecycleState: 'rework_requested',
    });
    expect(evaluateWorkshop2RndLifecycleSampleGate(dossier)?.id).toBe('rnd.lifecycle.rework');
    expect(evaluateWorkshop2RndLifecycleHandoffGate(dossier)?.id).toBe('rnd.lifecycle.not_ready');
    const gate = evaluateWorkshop2SampleOrderGate({ dossier, categoryLeafId: COAT_LEAF });
    expect(gate.readiness.checks.some((c) => c.id === 'rnd.lifecycle.rework')).toBe(true);
  });
});

describe('workshop2 wave30 — #40 CAD vault link (not demo zprj)', () => {
  it('integration: demo-only CAD blocks sample-order and handoff', () => {
    const dossier = persistWorkshop2CadVaultLinkMirrorToDossier(emptyWorkshop2DossierPhase1(), {
      vaultCadDocs: [],
      proprietaryDemoParseActive: true,
    });
    expect(dossier.cadVaultLinkMirror?.proprietaryDemoOnly).toBe(true);
    expect(evaluateWorkshop2CadVaultLinkSampleGate(dossier)?.id).toBe('cad.vault.demo_only');
    expect(evaluateWorkshop2CadVaultLinkHandoffGate(dossier)?.id).toBe(
      'cad.vault.demo_only_handoff'
    );
  });

  it('integration: vault CAD with storagePath passes when measures ok', () => {
    const dossier = persistWorkshop2CadVaultLinkMirrorToDossier(emptyWorkshop2DossierPhase1(), {
      vaultCadDocs: [
        {
          documentId: 'cad-1',
          storagePath: 'vault/cad/pattern.dxf',
          metadata: {
            kind: 'cad',
            measures: [{ label: 'Длина по спинке', valueCm: 72 }],
          },
        },
      ],
      proprietaryDemoParseActive: false,
    });
    expect(dossier.cadVaultLinkMirror?.vaultCadCount).toBe(1);
    expect(evaluateWorkshop2CadVaultLinkSampleGate(dossier)).toBeNull();
  });
});

describe('workshop2 wave30 — #42 smart routing DEMO blocked in production', () => {
  const prevEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = prevEnv;
    delete process.env.WORKSHOP2_SMART_ROUTING_DEMO;
  });

  it('integration: demo template blocks sample-order when NODE_ENV=production', () => {
    process.env.NODE_ENV = 'production';
    delete process.env.WORKSHOP2_SMART_ROUTING_DEMO;
    const base = {
      ...emptyWorkshop2DossierPhase1(),
      smartRoutingFromDemo: true,
      smartRoutingSequence: [{ opCode: 'SEW', opNameRu: 'Шитьё', sashMin: 10 }],
    };
    const dossier = persistWorkshop2SmartRoutingMirrorToDossier(base);
    expect(dossier.smartRoutingMirror?.demoBlockedInProd).toBe(true);
    expect(evaluateWorkshop2SmartRoutingSampleGate(dossier)?.id).toBe('routing.demo_blocked');
  });
});

describe('workshop2 wave30 — #47 PO ERP handoff fake synced', () => {
  it('integration: handoff blocked on synced without erpOrderId', () => {
    const prev = process.env.WORKSHOP2_FACTORY_ERP_BASE_URL;
    process.env.WORKSHOP2_FACTORY_ERP_BASE_URL = 'https://erp.test.local';
    const dossier = persistWorkshop2PurchaseOrderErpMirrorToDossier(emptyWorkshop2DossierPhase1(), {
      purchaseOrders: [{ id: 'po-1', status: 'synced', erpExternalId: null }],
      erpConfigured: true,
    });
    if (prev === undefined) delete process.env.WORKSHOP2_FACTORY_ERP_BASE_URL;
    else process.env.WORKSHOP2_FACTORY_ERP_BASE_URL = prev;
    expect(evaluateWorkshop2PurchaseOrderErpHandoffGate(dossier)?.id).toBe(
      'po.erp.fake_synced_handoff'
    );
    const commit = evaluateWorkshop2FactoryHandoffCommitGate({
      dossier,
      categoryLeafId: COAT_LEAF,
    });
    expect(commit.readiness.checks.some((c) => c.id === 'po.erp.fake_synced_handoff')).toBe(true);
  });
});

describe('workshop2 wave30 — #69 AQL persist → dossier gates', () => {
  it('integration: fail AQL blocks sample-order and handoff', () => {
    const dossier = persistWorkshop2QcAqlRecordToDossier(emptyWorkshop2DossierPhase1(), {
      orderQty: 1000,
      qtySource: 'manual',
      aqlLevel: 'II',
      sampleSize: 80,
      criticalFound: 0,
      majorFound: 5,
      minorFound: 10,
      majorRejectLimit: 2,
      minorRejectLimit: 5,
      isFail: true,
    });
    expect(dossier.qcAqlMirror?.isFail).toBe(true);
    expect(evaluateWorkshop2QcAqlSampleGate(dossier)?.id).toBe('qc.aql.fail');
    expect(evaluateWorkshop2QcAqlHandoffGate(dossier)?.id).toBe('qc.aql.fail_handoff');
  });
});

describe('workshop2 wave30 — integration ceilings (honest labels, gates unchanged)', () => {
  it('live labels expose «Требуется live» for all ceiling kinds', () => {
    expect(WORKSHOP2_LIVE_INTEGRATION_LABELS.dpp).toMatch(/Требуется live/i);
    expect(WORKSHOP2_LIVE_INTEGRATION_LABELS.nesting).toMatch(/Требуется live/i);
    expect(WORKSHOP2_LIVE_INTEGRATION_LABELS.plmTransport).toMatch(/Требуется live/i);
  });

  it('PLM badge title includes live hint when auto-ACK off', () => {
    const badge = formatWorkshop2PlmOutboxBadge({
      pending: 1,
      awaitingAck: 0,
      autoAckEnabled: false,
    });
    expect(badge.titleRu).toMatch(/Требуется live/i);
  });

  it('DPP export still blocks without composition (not inflated to 9)', () => {
    const gate = evaluateWorkshop2DppExportGate({
      dossier: emptyWorkshop2DossierPhase1(),
      collectionId: 'c1',
      articleId: 'a1',
    });
    expect(gate?.severity).toBe('blocker');
  });

  it('nesting TZ export gate still requires fabric width on sample order', () => {
    const gate = evaluateWorkshop2NestingExportGate({
      hasActiveSampleOrder: true,
      nesting: {},
    });
    expect(gate?.id).toBe('export.nesting.fabric_width');
    expect(gate?.severity).toBe('blocker');
  });
});

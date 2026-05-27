/**
 * Wave 3 horizontal integration tests.
 */
jest.mock('@/lib/server/workshop2-pg-pool', () => ({
  isWorkshop2PostgresEnabled: () => false,
}));

jest.mock('@/lib/server/workshop2-dossier-repository', () => ({
  ensureWorkshop2PgSchema: jest.fn(),
}));

import { postWorkshop2PurchaseOrderToErpOnCreate } from '@/lib/server/workshop2-purchase-order-erp-create';
import {
  clearWorkshop2PurchaseOrdersMemoryForTests,
  createWorkshop2PurchaseOrder,
} from '@/lib/server/workshop2-purchase-order-repository';
import { resolveErpOrderIdFromResponse } from '@/lib/server/workshop2-factory-erp-repository';
import { recordWorkshop2PurchaseOrderErpCreateAttemptInDossier } from '@/lib/production/workshop2-purchase-order-erp-dossier-persist';
import { verifyWorkshop2PlmInboundWebhook } from '@/lib/production/workshop2-plm-inbound-verify';
import { processWorkshop2PlmOutboxWithRetry } from '@/lib/server/workshop2-plm-runtime';
import {
  buildWorkshop2NestingPomPayload,
  callWorkshop2NestingSimulationStub,
} from '@/lib/production/workshop2-nesting-request';
import { resolveWorkshop2LcaStagingUrl } from '@/lib/production/workshop2-sustainability-staging';
import { validateWorkshop2VaultGlbUpload } from '@/lib/production/workshop2-fit3d-vault-gate';
import {
  requestWorkshop2EdoSignoff,
  evaluateWorkshop2EdoSignoffHandoffGate,
  resolveWorkshop2EdoProvider,
} from '@/lib/production/workshop2-edo-signoff';
import {
  appendWorkshop2CutTicket,
  evaluateWorkshop2CutTicketBulkPoGate,
  isWorkshop2CutTicketGateEnabled,
} from '@/lib/production/workshop2-supply-ops-dossier-persist';
import { compareWorkshop2VaultRevisions } from '@/lib/production/workshop2-vault-compare';
import { searchWorkshop2VaultDocuments } from '@/lib/production/workshop2-vault-search';
import { syncWorkshop2ColorMasterLabDipLinks } from '@/lib/production/workshop2-color-master-lab-dip-link';
import { evaluateWorkshop2B2bCreditHold } from '@/lib/production/workshop2-b2b-credit-hold';
import {
  buildWorkshop2SmartRoutingRulesUrlHint,
  describeWorkshop2SmartRoutingEngineTiers,
} from '@/lib/production/workshop2-smart-routing-rules-url';
import { buildWorkshop2Wave3HorizontalProbes } from '@/lib/production/workshop2-live-integration-probes';
import { isWorkshop2DomainEventType } from '@/lib/production/workshop2-domain-event-types';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';

describe('workshop2 wave3 — ERP PO create POST', () => {
  beforeEach(() => {
    clearWorkshop2PurchaseOrdersMemoryForTests();
    delete process.env.WORKSHOP2_FACTORY_ERP_BASE_URL;
  });

  it('journal_only without ERP env', async () => {
    const po = await createWorkshop2PurchaseOrder({
      collectionId: 'c1',
      articleId: 'a1',
      qty: 10,
    });
    const attempt = await postWorkshop2PurchaseOrderToErpOnCreate({
      collectionId: 'c1',
      articleId: 'a1',
      purchaseOrder: po,
    });
    expect(attempt.mode).toBe('journal_only');
    expect(attempt.ok).toBe(false);
    expect(attempt.purchaseOrder.status).toBe('draft');
  });

  it('sets erpExternalId only on 2xx + valid body', async () => {
    process.env.WORKSHOP2_FACTORY_ERP_BASE_URL = 'https://erp.partner.test';
    const po = await createWorkshop2PurchaseOrder({
      collectionId: 'c1',
      articleId: 'a1',
      qty: 5,
    });
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ erpOrderId: 'ERP-W3-1' }),
    }) as typeof fetch;

    const attempt = await postWorkshop2PurchaseOrderToErpOnCreate({
      collectionId: 'c1',
      articleId: 'a1',
      purchaseOrder: po,
    });
    expect(attempt.ok).toBe(true);
    expect(attempt.erpExternalId).toBe('ERP-W3-1');
    expect(attempt.purchaseOrder.erpExternalId).toBe('ERP-W3-1');
    expect(resolveErpOrderIdFromResponse({ erpOrderId: 'ERP-W3-1' })).toBe('ERP-W3-1');
  });

  it('records journal fallback in dossier mirror', () => {
    const dossier = recordWorkshop2PurchaseOrderErpCreateAttemptInDossier(
      emptyWorkshop2DossierPhase1(),
      {
        purchaseOrders: [{ id: 'po-1', status: 'error', lastError: 'erp_http_500' }],
        erpConfigured: true,
        attempt: { outcome: 'failed', error: 'erp_http_500' },
      }
    );
    expect(dossier.purchaseOrderErpMirror?.lastCreateErpAttempt?.outcome).toBe('failed');
  });
});

describe('workshop2 wave3 — PLM inbound + outbox retry', () => {
  it('rejects inbound webhook without secret in production', () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    delete process.env.WORKSHOP2_PLM_WEBHOOK_SECRET;
    delete process.env.WORKSHOP2_PLM_INBOUND_VERIFY_BYPASS;
    const v = verifyWorkshop2PlmInboundWebhook({ headers: {}, rawBody: '{}' });
    expect(v.ok).toBe(false);
    process.env.NODE_ENV = prev;
  });

  it('process outbox with retry returns partnerAckAllowed flag', async () => {
    const r = await processWorkshop2PlmOutboxWithRetry({ limit: 1 });
    expect(typeof r.partnerAckAllowed).toBe('boolean');
  });
});

describe('workshop2 wave3 — nesting POM body + LCA feed URL', () => {
  it('includes pom measurements in nesting payload builder', () => {
    const pom = buildWorkshop2NestingPomPayload({
      schemaVersion: 1,
      assignments: [],
      productionModel: {
        version: 1,
        nodes: [],
        materialLines: [],
        trimLines: [],
        operations: [],
        measurements: [{ label: 'Ширина полотна', valueCm: 150, code: 'fabric_w' }],
      },
    });
    expect(pom.measurements.length).toBeGreaterThan(0);
  });

  it('resolves WORKSHOP2_LCA_FEED_URL', () => {
    expect(resolveWorkshop2LcaStagingUrl({ WORKSHOP2_LCA_FEED_URL: 'https://lca.test/feed' })).toBe(
      'https://lca.test/feed'
    );
  });

  it('nesting external call sends pom in body', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ estimatedYieldPct: 88 }),
    });
    await callWorkshop2NestingSimulationStub({
      collectionId: 'c',
      articleId: 'a',
      sampleOrderId: 's1',
      nesting: { fabricWidthCm: 150 },
      dossier: emptyWorkshop2DossierPhase1(),
      env: { WORKSHOP2_NESTING_API_URL: 'https://nest.test' },
      fetchImpl: fetchMock as unknown as typeof fetch,
    });
    const body = JSON.parse(String((fetchMock.mock.calls[0]?.[1] as RequestInit)?.body));
    expect(body.pom).toBeDefined();
  });
});

describe('workshop2 wave3 — Fit3D glb upload validation', () => {
  it('blocks non-glb uploads', () => {
    expect(validateWorkshop2VaultGlbUpload({ fileName: 'model.pdf' }).ok).toBe(false);
    expect(validateWorkshop2VaultGlbUpload({ fileName: 'fit.glb', sizeBytes: 1024 }).ok).toBe(true);
  });
});

describe('workshop2 wave3 — EDO signoff mock dev only', () => {
  it('mock signs in development', async () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    process.env.WORKSHOP2_EDO_PROVIDER = 'mock';
    const r = await requestWorkshop2EdoSignoff({
      dossier: emptyWorkshop2DossierPhase1(),
      collectionId: 'c',
      articleId: 'a',
      actor: 'test',
    });
    expect(r.ok).toBe(true);
    expect(r.mirror.edoStatus).toBe('signed');
    process.env.NODE_ENV = prev;
  });

  it('handoff gate when edo required', () => {
    process.env.WORKSHOP2_EDO_SIGNOFF_REQUIRED = 'true';
    process.env.WORKSHOP2_EDO_PROVIDER = 'kontur';
    expect(resolveWorkshop2EdoProvider()).toBe('kontur');
    const gate = evaluateWorkshop2EdoSignoffHandoffGate(emptyWorkshop2DossierPhase1());
    expect(gate?.severity).toBe('blocker');
    delete process.env.WORKSHOP2_EDO_SIGNOFF_REQUIRED;
  });
});

describe('workshop2 wave3 — supply ops cut ticket gate', () => {
  it('blocks bulk PO when flag set and no cut tickets', () => {
    process.env.WORKSHOP2_CUT_TICKET_REQUIRED = 'true';
    expect(isWorkshop2CutTicketGateEnabled()).toBe(true);
    const gate = evaluateWorkshop2CutTicketBulkPoGate(emptyWorkshop2DossierPhase1());
    expect(gate?.id).toBe('supply.cut_ticket.required');
    const withTicket = appendWorkshop2CutTicket(emptyWorkshop2DossierPhase1(), {
      ticketNo: 'CT-1',
      qty: 100,
      status: 'draft',
    });
    expect(evaluateWorkshop2CutTicketBulkPoGate(withTicket)).toBeNull();
    delete process.env.WORKSHOP2_CUT_TICKET_REQUIRED;
  });
});

describe('workshop2 wave3 — vault compare/search + color master', () => {
  it('compares vault revision hashes', () => {
    const cmp = compareWorkshop2VaultRevisions({
      left: { id: 'a', title: 'v1.pdf', metadata: { pageCount: 2 } },
      right: { id: 'b', title: 'v2.pdf', metadata: { pageCount: 3 } },
    });
    expect(cmp.sameFileHash).toBe(false);
    expect(cmp.pageCountDelta).toBe(1);
  });

  it('searches vault by filename', () => {
    const hits = searchWorkshop2VaultDocuments({
      dossier: {
        ...emptyWorkshop2DossierPhase1(),
        vaultDocuments: [
          { id: 'd1', type: 'pdf', title: 'TechPack SS27.pdf', uploadedAt: '2026-01-01' },
        ],
      },
      query: 'techpack',
    });
    expect(hits.length).toBe(1);
  });

  it('syncs color master lab dip links', () => {
    const { links } = syncWorkshop2ColorMasterLabDipLinks({
      ...emptyWorkshop2DossierPhase1(),
      assignments: [{ kind: 'canonical', attributeId: 'color', values: [{ text: 'Navy' }] }],
      colorLabDipStatuses: { navy: 'pending' },
    });
    expect(links.some((l) => l.colorwayLabel === 'Navy')).toBe(true);
  });
});

describe('workshop2 wave3 — B2B credit + smart routing + probes', () => {
  it('blocks checkout when credit exceeded', () => {
    process.env.WORKSHOP2_B2B_CREDIT_HOLD = 'true';
    const r = evaluateWorkshop2B2bCreditHold({
      territoryId: 'RU-MOW',
      orderTotalRub: 200_000,
    });
    expect(r.allowed).toBe(false);
    delete process.env.WORKSHOP2_B2B_CREDIT_HOLD;
  });

  it('documents smart routing tiers', () => {
    expect(describeWorkshop2SmartRoutingEngineTiers().some((t) => t.tier === 'rules_url')).toBe(
      true
    );
    process.env.WORKSHOP2_SMART_ROUTING_RULES_URL = 'https://rules.test/v1';
    expect(buildWorkshop2SmartRoutingRulesUrlHint()).toMatch(/rules_url|Rules URL/);
    delete process.env.WORKSHOP2_SMART_ROUTING_RULES_URL;
  });

  it('wave3Horizontal probes expose integration flags', () => {
    process.env.WORKSHOP2_SLACK_WEBHOOK_URL = 'https://hooks.slack.test/abc';
    const probes = buildWorkshop2Wave3HorizontalProbes();
    expect(probes.slackBridge.configured).toBe(true);
    expect(probes.vaultIndex.configured).toBe(true);
    delete process.env.WORKSHOP2_SLACK_WEBHOOK_URL;
  });

  it('registers supply domain event types', () => {
    expect(isWorkshop2DomainEventType('supply.cut_ticket.created')).toBe(true);
  });
});

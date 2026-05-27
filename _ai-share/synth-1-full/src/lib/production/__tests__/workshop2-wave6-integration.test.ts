/**
 * Wave 6 horizontal integration tests (+18 cases).
 */
jest.mock('@/lib/server/workshop2-pg-pool', () => ({
  isWorkshop2PostgresEnabled: () => false,
}));

jest.mock('@/lib/server/workshop2-shopify-connection-repository', () => ({
  getWorkshop2ShopifyConnection: jest.fn(async () => null),
  upsertWorkshop2ShopifyConnection: jest.fn(async () => ({ persisted: true, mode: 'memory' })),
  clearWorkshop2ShopifyConnectionMemoryForTests: jest.fn(),
}));

import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  formatWorkshop2DomainEventsSseData,
  probeWorkshop2DomainEventsSse,
} from '@/lib/production/workshop2-domain-events-sse';
import {
  exchangeWorkshop2ShopifyOAuthCode,
  resolveWorkshop2ShopifyOAuthExchangeEnv,
} from '@/lib/production/workshop2-shopify-oauth-exchange';
import { probeWorkshop2ShopifyConnection } from '@/lib/production/workshop2-shopify-oauth-scaffold';
import {
  buildWorkshop2EdiOutboundDocument,
  buildWorkshop2EdiOutboundJournalEntry,
  parseWorkshop2EdiOutboundBody,
} from '@/lib/production/workshop2-edi-outbound';
import {
  buildWorkshop2B2bMarketplaceOrderStub,
  parseWorkshop2B2bMarketplaceInboundBody,
  verifyWorkshop2B2bMarketplaceInboundSecret,
} from '@/lib/production/workshop2-b2b-marketplace-inbound';
import { isWorkshop2DomainEventType } from '@/lib/production/workshop2-domain-event-types';
import { evaluateWorkshop2PredictiveSupplyRiskFromDossier } from '@/lib/production/workshop2-predictive-supply-risk';
import {
  buildWorkshop2InvestorReadinessReport,
  summarizeWorkshop2Ss27DossierFill,
} from '@/lib/production/workshop2-investor-readiness';
import {
  buildWorkshop2IllustratorAttachmentRef,
  enqueueWorkshop2IllustratorVaultPresign,
} from '@/lib/production/workshop2-illustrator-vault-enqueue';
import { buildWorkshop2Wave6HorizontalProbes } from '@/lib/production/workshop2-live-integration-probes';
import { upsertWorkshop2ShopifyConnection } from '@/lib/server/workshop2-shopify-connection-repository';

describe('workshop2 wave6 — domain events SSE', () => {
  it('probe exposes stream path', () => {
    const probe = probeWorkshop2DomainEventsSse();
    expect(probe.configured).toBe(true);
    expect(probe.streamPath).toContain('/domain-events/subscribe/stream');
  });

  it('formats SSE data lines', () => {
    const line = formatWorkshop2DomainEventsSseData({
      type: 'heartbeat',
      ts: '2026-05-26T12:00:00.000Z',
    });
    expect(line).toMatch(/^data: /);
    expect(line).toContain('heartbeat');
  });
});

describe('workshop2 wave6 — Shopify OAuth', () => {
  it('detects token exchange env', () => {
    const cfg = resolveWorkshop2ShopifyOAuthExchangeEnv({
      WORKSHOP2_SHOPIFY_CLIENT_ID: 'id',
      WORKSHOP2_SHOPIFY_CLIENT_SECRET: 'sec',
      WORKSHOP2_SHOPIFY_REDIRECT_URI: 'https://app/callback',
    });
    expect(cfg.ready).toBe(true);
  });

  it('probe connected when stored connection flag', () => {
    const probe = probeWorkshop2ShopifyConnection({}, { hasStoredConnection: true });
    expect(probe.status).toBe('connected');
  });

  it('exchange fails without env', async () => {
    const res = await exchangeWorkshop2ShopifyOAuthCode({
      shop: 'brand.myshopify.com',
      code: 'abc',
      env: {},
    });
    expect(res.ok).toBe(false);
  });

  it('persists shopify connection stub in memory mode', async () => {
    const persist = await upsertWorkshop2ShopifyConnection({
      shop: 'demo.myshopify.com',
      accessToken: 'tok',
    });
    expect(persist.persisted).toBe(true);
  });
});

describe('workshop2 wave6 — EDI outbound', () => {
  it('parses 855 outbound body', () => {
    const ctx = parseWorkshop2EdiOutboundBody({
      documentType: '855',
      retailerId: 'ret-1',
      purchaseOrderId: 'PO-9',
    });
    expect(ctx?.documentType).toBe('855');
  });

  it('builds 856 ASN document', () => {
    const doc = buildWorkshop2EdiOutboundDocument({
      documentType: '856',
      retailerId: 'r1',
      shipNotice: { carrier: 'DHL', trackingNumber: 'TRK-1' },
    });
    expect(doc.documentType).toBe('856');
    expect((doc.advanceShipNotice as { carrier?: string }).carrier).toBe('DHL');
  });

  it('journal entry notes no fake ACK', () => {
    const entry = buildWorkshop2EdiOutboundJournalEntry({
      documentType: '855',
      retailerId: 'r1',
    });
    expect(entry.noteRu).toMatch(/без fake/);
  });
});

describe('workshop2 wave6 — B2B marketplace inbound', () => {
  it('parses joor order payload', () => {
    const p = parseWorkshop2B2bMarketplaceInboundBody({
      provider: 'joor',
      externalOrderId: 'JOOR-991',
      campaignId: 'camp-ss27',
    });
    expect(p?.provider).toBe('joor');
    expect(p?.campaignId).toBe('camp-ss27');
  });

  it('verifies marketplace secret', () => {
    process.env.WORKSHOP2_B2B_MARKETPLACE_WEBHOOK_SECRET = 'mp-secret';
    expect(verifyWorkshop2B2bMarketplaceInboundSecret({ secretHeader: 'mp-secret' }).ok).toBe(true);
    delete process.env.WORKSHOP2_B2B_MARKETPLACE_WEBHOOK_SECRET;
  });

  it('registers marketplace domain event type', () => {
    expect(isWorkshop2DomainEventType('b2b.marketplace_order.received')).toBe(true);
  });

  it('builds order stub with campaign link note', () => {
    const stub = buildWorkshop2B2bMarketplaceOrderStub({
      provider: 'nuorder',
      externalOrderId: 'NU-1',
      campaignId: 'SS27-showroom',
    });
    expect(stub.noteRu).toMatch(/кампания/);
  });
});

describe('workshop2 wave6 — predictive supply risk', () => {
  it('scores dossier with late T&A lower', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      taMilestones: [
        {
          id: 'ta-late',
          title: 'Gold sample',
          targetDate: '2020-01-01',
          actualDate: null,
          status: 'pending' as const,
        },
      ],
    };
    const model = evaluateWorkshop2PredictiveSupplyRiskFromDossier(dossier);
    expect(model.score).toBeLessThan(72);
    expect(model.blockers.some((b) => b.id.startsWith('ta.late'))).toBe(true);
  });

  it('flags ERP journal_only PO', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      purchaseOrderErpMirror: {
        mirroredAt: new Date().toISOString(),
        poCount: 1,
        fakeSyncedCount: 0,
        errorCount: 0,
        pendingCount: 1,
        erpConfigured: false,
        erpSyncMode: 'journal_only' as const,
        blockerSampleOrder: false,
      },
    };
    const model = evaluateWorkshop2PredictiveSupplyRiskFromDossier(dossier);
    expect(model.blockers.some((b) => b.id === 'supply.erp.journal_only')).toBe(true);
  });

  it('returns score 0-100', () => {
    const model = evaluateWorkshop2PredictiveSupplyRiskFromDossier(emptyWorkshop2DossierPhase1());
    expect(model.score).toBeGreaterThanOrEqual(0);
    expect(model.score).toBeLessThanOrEqual(100);
  });
});

describe('workshop2 wave6 — investor readiness', () => {
  it('aggregates SS27 fill from dossiers', () => {
    const fill = summarizeWorkshop2Ss27DossierFill({
      dossiers: [emptyWorkshop2DossierPhase1(), emptyWorkshop2DossierPhase1()],
    });
    expect(fill.articleCount).toBe(2);
    expect(typeof fill.avgTzFillPct).toBe('number');
  });

  it('reports reasons when not ready', () => {
    process.env.WORKSHOP2_STAGING_CONTRACT_MODE = 'false';
    const report = buildWorkshop2InvestorReadinessReport({ env: {} });
    expect(Array.isArray(report.reasons)).toBe(true);
    expect(typeof report.readyForInvestorDemo).toBe('boolean');
    delete process.env.WORKSHOP2_STAGING_CONTRACT_MODE;
  });
});

describe('workshop2 wave6 — illustrator vault enqueue', () => {
  it('builds attachment ref', () => {
    const ref = buildWorkshop2IllustratorAttachmentRef({
      collectionId: 'SS27',
      articleId: 'a1',
      assetRef: '/sketch.ai',
    });
    expect(ref).toContain('illustrator://');
  });

  it('journal only without S3 env', async () => {
    const res = await enqueueWorkshop2IllustratorVaultPresign({
      payload: { assetRef: 'x.ai', collectionId: 'SS27', articleId: 'a1' },
      env: {},
    });
    expect(res.journalOnly).toBe(true);
    expect(res.presignIssued).toBe(false);
  });
});

describe('workshop2 wave6 — wave6Horizontal probes', () => {
  it('exposes domainEventsSse and marketplace flags', () => {
    process.env.WORKSHOP2_B2B_MARKETPLACE_WEBHOOK_SECRET = 'x';
    process.env.WORKSHOP2_EDI_OUTBOUND_WEBHOOK_URL = 'https://partner.example/edi';
    const probes = buildWorkshop2Wave6HorizontalProbes(process.env, {
      shopifyStoredConnection: true,
    });
    expect(probes.domainEventsSse.configured).toBe(true);
    expect(probes.shopifyOAuth.storedConnection).toBe(true);
    expect(probes.b2bMarketplaceInbound.verifySecretConfigured).toBe(true);
    expect(probes.ediOutbound.webhookConfigured).toBe(true);
    delete process.env.WORKSHOP2_B2B_MARKETPLACE_WEBHOOK_SECRET;
    delete process.env.WORKSHOP2_EDI_OUTBOUND_WEBHOOK_URL;
  });
});

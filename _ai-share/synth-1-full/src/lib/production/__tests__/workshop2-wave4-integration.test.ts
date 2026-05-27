/**
 * Wave 4 horizontal integration tests.
 */
jest.mock('@/lib/server/workshop2-pg-pool', () => ({
  isWorkshop2PostgresEnabled: () => false,
}));

import { collectWorkshop2SupplyOpsCreatedEvents } from '@/lib/production/workshop2-supply-ops-domain-events';
import {
  appendWorkshop2CutTicket,
  appendWorkshop2FabricRoll,
  appendWorkshop2GarmentDyeOp,
} from '@/lib/production/workshop2-supply-ops-dossier-persist';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import { isWorkshop2DomainEventType } from '@/lib/production/workshop2-domain-event-types';
import {
  buildWorkshop2SmartRoutingEngineTierHintRu,
  resolveWorkshop2SmartRoutingEngineTierForUi,
} from '@/lib/production/workshop2-smart-routing-engine-tier-ui';
import { persistWorkshop2SmartRoutingMirrorToDossier } from '@/lib/production/workshop2-smart-routing-dossier-persist';
import { evaluateWorkshop2B2bCreditHold } from '@/lib/production/workshop2-b2b-credit-hold';
import { isWorkshop2PgOnlyMode } from '@/lib/production/workshop2-hub-pg-only-policy';
import { shouldWorkshop2HubSkipLocalPrimaryWrite } from '@/lib/production/workshop2-hub-dossier-map';
import {
  evaluateWorkshop2BulkHandoffForArticle,
  summarizeWorkshop2BulkHandoff,
} from '@/lib/production/workshop2-bulk-handoff';
import {
  calculateWorkshop2B2bCommission,
  listWorkshop2B2bCommissionsForRep,
} from '@/lib/production/workshop2-b2b-commission';
import {
  buildWorkshop2EdiJournalEntry,
  parseWorkshop2EdiInboundBody,
} from '@/lib/production/workshop2-edi-types';
import { verifyWorkshop2EdiInboundWebhook } from '@/lib/production/workshop2-edi-inbound-verify';
import {
  buildWorkshop2ShopifyOAuthAuthorizeUrl,
  probeWorkshop2ShopifyConnection,
} from '@/lib/production/workshop2-shopify-oauth-scaffold';
import { summarizeWorkshop2HubIntegrationProbesOneLiner } from '@/lib/production/workshop2-hub-integration-probes-banner';
import {
  classifyWorkshop2CalendarEventRole,
  filterWorkshop2BrandCalendarByRole,
} from '@/lib/production/workshop2-brand-calendar-role-filter';
import {
  countWorkshop2ContextualChatUnread,
  writeWorkshop2ContextualChatLastReadAt,
} from '@/lib/production/workshop2-contextual-chat-unread';
import { summarizeWorkshop2HubArticlesListStatus } from '@/lib/production/workshop2-hub-articles-list-status';
import { buildWorkshop2Wave4HorizontalProbes } from '@/lib/production/workshop2-live-integration-probes';

describe('workshop2 wave4 — supply domain events', () => {
  it('collects cut ticket created event on diff', () => {
    const prev = emptyWorkshop2DossierPhase1();
    const next = appendWorkshop2CutTicket(prev, { ticketNo: 'CT-1', qty: 10, status: 'draft' });
    const events = collectWorkshop2SupplyOpsCreatedEvents({
      collectionId: 'SS27',
      articleId: 'a1',
      previous: prev,
      next,
    });
    expect(events).toHaveLength(1);
    expect(events[0]?.type).toBe('supply.cut_ticket.created');
  });

  it('collects fabric roll and garment dye events', () => {
    let d = emptyWorkshop2DossierPhase1();
    d = appendWorkshop2FabricRoll(d, {
      rollLot: 'RL-1',
      status: 'available',
    });
    d = appendWorkshop2GarmentDyeOp(d, {
      colorwayLabel: 'Navy',
      process: 'reactive',
      status: 'planned',
    });
    const events = collectWorkshop2SupplyOpsCreatedEvents({
      collectionId: 'c',
      articleId: 'a',
      previous: emptyWorkshop2DossierPhase1(),
      next: d,
    });
    expect(events.map((e) => e.type)).toEqual([
      'supply.fabric_roll.created',
      'supply.garment_dye.created',
    ]);
  });

  it('registers all supply event types', () => {
    expect(isWorkshop2DomainEventType('supply.fabric_roll.created')).toBe(true);
    expect(isWorkshop2DomainEventType('supply.garment_dye.created')).toBe(true);
  });
});

describe('workshop2 wave4 — smart routing engineTier UI', () => {
  it('maps rules_url mirror to external tier hint', () => {
    process.env.WORKSHOP2_SMART_ROUTING_RULES_URL = 'https://rules.test/v1';
    const dossier = persistWorkshop2SmartRoutingMirrorToDossier({
      ...emptyWorkshop2DossierPhase1(),
      smartRoutingSequence: [{ id: '1', category: 'A', name: 'Op', equipment: 'M', sash: 1 }],
    });
    expect(resolveWorkshop2SmartRoutingEngineTierForUi(dossier)).toBe('external');
    expect(buildWorkshop2SmartRoutingEngineTierHintRu(dossier)).toMatch(
      /engineTier: External rules/
    );
    delete process.env.WORKSHOP2_SMART_ROUTING_RULES_URL;
  });
});

describe('workshop2 wave4 — B2B credit hold checkout', () => {
  it('blocks when credit exceeded with flag', () => {
    process.env.WORKSHOP2_B2B_CREDIT_HOLD = 'true';
    const r = evaluateWorkshop2B2bCreditHold({ territoryId: 'RU-MOW', orderTotalRub: 200_000 });
    expect(r.allowed).toBe(false);
    expect(r.gate?.id).toBe('b2b.credit.exceeded');
    delete process.env.WORKSHOP2_B2B_CREDIT_HOLD;
  });
});

describe('workshop2 wave4 — PG-only mode', () => {
  it('detects WORKSHOP2_PG_ONLY server flag', () => {
    process.env.WORKSHOP2_PG_ONLY = 'true';
    expect(isWorkshop2PgOnlyMode()).toBe(true);
    expect(shouldWorkshop2HubSkipLocalPrimaryWrite()).toBe(true);
    delete process.env.WORKSHOP2_PG_ONLY;
  });

  it('wave4Horizontal probe exposes pgOnlyMode', () => {
    process.env.WORKSHOP2_PG_ONLY = 'true';
    const probes = buildWorkshop2Wave4HorizontalProbes();
    expect(probes.pgOnlyMode.enabled).toBe(true);
    delete process.env.WORKSHOP2_PG_ONLY;
  });
});

describe('workshop2 wave4 — bulk handoff', () => {
  it('blocks when dossier missing', () => {
    const r = evaluateWorkshop2BulkHandoffForArticle({
      collectionId: 'SS27',
      articleId: 'x',
      dossier: null,
    });
    expect(r.passed).toBe(false);
  });

  it('summarizes passed and blocked articles', () => {
    const summary = summarizeWorkshop2BulkHandoff({
      collectionId: 'SS27',
      results: [
        { articleId: 'a1', passed: true, reasons: [], checks: [] },
        { articleId: 'a2', passed: false, reasons: ['block'], checks: [] },
      ],
    });
    expect(summary.passed).toBe(1);
    expect(summary.blocked).toHaveLength(1);
  });

  it('hub list status enables bulk handoff when ready', () => {
    const status = summarizeWorkshop2HubArticlesListStatus({
      visibleArticleCount: 3,
      withoutDossierCount: 0,
      lowTzPctCount: 0,
    });
    expect(status.bulkHandoffAvailable).toBe(true);
  });
});

describe('workshop2 wave4 — commission stub', () => {
  it('calculates commission pct from order total', () => {
    const line = calculateWorkshop2B2bCommission({
      orderId: 'O-1',
      repId: 'rep-anna',
      orderTotalRub: 100_000,
      commissionPct: 5,
    });
    expect(line.commissionRub).toBe(5000);
  });

  it('lists demo commissions for rep', () => {
    const summary = listWorkshop2B2bCommissionsForRep({ repId: 'rep-anna' });
    expect(summary.orderCount).toBeGreaterThan(0);
    expect(summary.totalCommissionRub).toBeGreaterThan(0);
  });
});

describe('workshop2 wave4 — EDI inbound scaffold', () => {
  it('parses 850 payload', () => {
    const payload = parseWorkshop2EdiInboundBody({
      documentType: '850',
      retailerId: 'ret-1',
      purchaseOrderId: 'PO-1',
    });
    expect(payload?.documentType).toBe('850');
    const entry = buildWorkshop2EdiJournalEntry(payload!);
    expect(entry.status).toBe('journal_only');
  });

  it('rejects invalid document type', () => {
    expect(parseWorkshop2EdiInboundBody({ documentType: '999' })).toBeNull();
  });

  it('verify secret when configured', () => {
    process.env.WORKSHOP2_EDI_WEBHOOK_SECRET = 's3cret';
    const bad = verifyWorkshop2EdiInboundWebhook({ secretHeader: 'wrong' });
    expect(bad.ok).toBe(false);
    const ok = verifyWorkshop2EdiInboundWebhook({ secretHeader: 's3cret' });
    expect(ok.ok).toBe(true);
    delete process.env.WORKSHOP2_EDI_WEBHOOK_SECRET;
  });
});

describe('workshop2 wave4 — Shopify OAuth scaffold', () => {
  it('probe returns not_connected without token', () => {
    const probe = probeWorkshop2ShopifyConnection({});
    expect(probe.status).toBe('not_connected');
  });

  it('authorize url null without client id', () => {
    const built = buildWorkshop2ShopifyOAuthAuthorizeUrl({
      shop: 'brand.myshopify.com',
      state: 'st',
      env: {},
    });
    expect(built.url).toBeNull();
  });
});

describe('workshop2 wave4 — UX polish helpers', () => {
  it('integration probes one-liner includes wave4 flags', () => {
    const line = summarizeWorkshop2HubIntegrationProbesOneLiner({
      readyForInvestorDemo: false,
      wave4Horizontal: {
        pgOnlyMode: { enabled: true, serverFlag: true, clientFlag: false },
        bulkHandoff: { configured: true },
        ediInbound: { configured: true, verifySecretConfigured: true },
        shopifyOAuth: { configured: false, status: 'not_connected' },
        b2bCommission: { configured: true, defaultPct: 5 },
        supplyDomainEvents: { registered: true },
      },
    });
    expect(line).toMatch(/PG-only/);
  });

  it('calendar role filter classifies supply events', () => {
    const role = classifyWorkshop2CalendarEventRole({
      id: '1',
      ownerId: 'w2',
      ownerRole: 'brand',
      ownerName: 'W2',
      calendarId: 'workshop2',
      title: 'Cut ticket due',
      layer: 'production',
      visibility: 'internal',
      type: 'event',
      startAt: '2026-05-26T09:00:00.000Z',
      endAt: '2026-05-26T18:00:00.000Z',
      participants: [],
    });
    expect(role).toBe('supply');
    const filtered = filterWorkshop2BrandCalendarByRole(
      [
        {
          id: '1',
          ownerId: 'w2',
          ownerRole: 'brand',
          ownerName: 'W2',
          calendarId: 'workshop2',
          title: 'Showroom publish',
          layer: 'production',
          visibility: 'internal',
          type: 'event',
          startAt: '2026-05-26T09:00:00.000Z',
          endAt: '2026-05-26T18:00:00.000Z',
          participants: [],
        },
      ],
      'b2b'
    );
    expect(filtered).toHaveLength(1);
  });

  it('contextual chat unread count respects last read', () => {
    writeWorkshop2ContextualChatLastReadAt('SS27:a1', '2026-05-26T10:00:00.000Z');
    const n = countWorkshop2ContextualChatUnread(
      [
        {
          id: '1',
          contextType: 'workshop2_article',
          contextId: 'SS27:a1',
          message: 'old',
          createdAt: '2026-05-26T09:00:00.000Z',
          sender: 'sys',
        },
        {
          id: '2',
          contextType: 'workshop2_article',
          contextId: 'SS27:a1',
          message: 'new',
          createdAt: '2026-05-26T11:00:00.000Z',
          sender: 'sys',
        },
      ],
      '2026-05-26T10:00:00.000Z'
    );
    expect(n).toBe(1);
  });
});

describe('workshop2 wave4 — wave4Horizontal probes', () => {
  it('exposes edi and commission flags', () => {
    process.env.WORKSHOP2_EDI_WEBHOOK_SECRET = 'x';
    const probes = buildWorkshop2Wave4HorizontalProbes();
    expect(probes.ediInbound.configured).toBe(true);
    expect(probes.b2bCommission.configured).toBe(true);
    expect(probes.supplyDomainEvents.registered).toBe(true);
    delete process.env.WORKSHOP2_EDI_WEBHOOK_SECRET;
  });
});

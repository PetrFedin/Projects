/**
 * Wave 5 horizontal integration tests (+15 cases).
 */
jest.mock('@/lib/server/workshop2-pg-pool', () => ({
  isWorkshop2PostgresEnabled: () => false,
}));

import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  shouldWorkshop2PgOnlySkipFileFallback,
  shouldWorkshop2PgOnlyPreferServerRead,
  summarizeWorkshop2PgOnlyReadPolicyHintRu,
  isWorkshop2PgOnlyMode,
} from '@/lib/production/workshop2-hub-pg-only-policy';
import {
  parseWorkshop2MesQcIngestBody,
  verifyWorkshop2MesQcWebhookSecret,
  applyWorkshop2MesQcDefectToDossier,
  formatWorkshop2MesQcChatMessageRu,
} from '@/lib/production/workshop2-mes-qc-ingest';
import {
  mapWorkshop2MoySkladStockToWmsHints,
  buildWorkshop2MoySkladImportSummary,
  resolveWorkshop2MoySkladConfig,
} from '@/lib/production/workshop2-moysklad-wms-adapter';
import { aggregateWorkshop2NetworkAnalytics } from '@/lib/production/workshop2-network-analytics';
import {
  evaluateWorkshop2ShowroomPublishGateForDossier,
  isWorkshop2AutoShowroomPublishEnabled,
  WORKSHOP2_SHOWROOM_PUBLISH_GATE_SCOPE,
} from '@/lib/production/workshop2-auto-showroom-publish';
import {
  parseWorkshop2IllustratorWebhookBody,
  buildWorkshop2IllustratorWebhookJournalEntry,
  verifyWorkshop2IllustratorWebhookSecret,
} from '@/lib/production/workshop2-illustrator-webhook';
import {
  buildWorkshop2EdiJournalEntry,
  parseWorkshop2EdiInboundBody,
} from '@/lib/production/workshop2-edi-types';
import { calculateWorkshop2B2bCommission } from '@/lib/production/workshop2-b2b-commission';
import { isWorkshop2DomainEventType } from '@/lib/production/workshop2-domain-event-types';
import { buildWorkshop2Wave5HorizontalProbes } from '@/lib/production/workshop2-live-integration-probes';

describe('workshop2 wave5 — PG-only read policy', () => {
  it('skips file fallback when PG_ONLY', () => {
    process.env.WORKSHOP2_PG_ONLY = 'true';
    expect(shouldWorkshop2PgOnlySkipFileFallback()).toBe(true);
    expect(shouldWorkshop2PgOnlyPreferServerRead('contextual_messages')).toBe(true);
    expect(shouldWorkshop2PgOnlyPreferServerRead('brand_calendar')).toBe(true);
    expect(summarizeWorkshop2PgOnlyReadPolicyHintRu('brand_calendar')).toMatch(/PostgreSQL/);
    delete process.env.WORKSHOP2_PG_ONLY;
  });

  it('allows file fallback when PG_ONLY off', () => {
    delete process.env.WORKSHOP2_PG_ONLY;
    expect(shouldWorkshop2PgOnlySkipFileFallback()).toBe(false);
    expect(isWorkshop2PgOnlyMode()).toBe(false);
  });
});

describe('workshop2 wave5 — EDI + commission persist helpers', () => {
  it('builds EDI journal entry', () => {
    const payload = parseWorkshop2EdiInboundBody({ documentType: '856', retailerId: 'r1' });
    const entry = buildWorkshop2EdiJournalEntry(payload!);
    expect(entry.documentType).toBe('856');
  });

  it('calculates commission line', () => {
    const line = calculateWorkshop2B2bCommission({
      repId: 'rep-a',
      orderId: 'O-99',
      orderTotalRub: 200_000,
    });
    expect(line.commissionRub).toBe(10_000);
  });
});

describe('workshop2 wave5 — MES QC ingest', () => {
  it('parses defect payload', () => {
    const d = parseWorkshop2MesQcIngestBody({
      defectCode: 'STAIN',
      severity: 'major',
      batchId: 'B1',
    });
    expect(d?.defectCode).toBe('STAIN');
    expect(d?.severity).toBe('major');
  });

  it('verifies MES QC secret', () => {
    process.env.WORKSHOP2_MES_QC_WEBHOOK_SECRET = 'mes-secret';
    expect(verifyWorkshop2MesQcWebhookSecret({ secretHeader: 'mes-secret' }).ok).toBe(true);
    expect(verifyWorkshop2MesQcWebhookSecret({ secretHeader: 'bad' }).ok).toBe(false);
    delete process.env.WORKSHOP2_MES_QC_WEBHOOK_SECRET;
  });

  it('mirrors defect into dossier QC panel', () => {
    const next = applyWorkshop2MesQcDefectToDossier({
      dossier: emptyWorkshop2DossierPhase1(),
      defect: { defectCode: 'STAIN', severity: 'major', batchId: 'B1' },
    });
    expect(next.qcPanelMirror?.batchCount).toBe(1);
    expect(next.qcAqlInspectionLog?.length).toBe(1);
  });

  it('formats chat message in Russian', () => {
    expect(
      formatWorkshop2MesQcChatMessageRu({ defectCode: 'STAIN', defectLabel: 'Пятно' })
    ).toMatch(/MES QC/);
  });

  it('registers qc.mes_defect.ingested event type', () => {
    expect(isWorkshop2DomainEventType('qc.mes_defect.ingested')).toBe(true);
  });
});

describe('workshop2 wave5 — MoySklad WMS adapter', () => {
  it('detects MoySklad token config', () => {
    const cfg = resolveWorkshop2MoySkladConfig({ MOYSKLAD_TOKEN: 'tok' });
    expect(cfg.configured).toBe(true);
  });

  it('maps stock rows to reserve hints', () => {
    const hints = mapWorkshop2MoySkladStockToWmsHints({
      stockRows: [{ externalId: 'ms-1', name: 'Cotton fabric', quantity: 100, reserve: 10 }],
      supplyLines: [{ id: 'sl-1', label: 'Cotton fabric', qty: 50, unit: 'м' }],
    });
    expect(hints[0]?.importStatus).toBe('mapped');
    expect(hints[0]?.reserveHint).toBe(50);
  });

  it('builds honest summary without fake GRN on fetch fail', () => {
    const summary = buildWorkshop2MoySkladImportSummary({
      fetchOk: false,
      httpStatus: 401,
      mappedHints: [],
      collectionId: 'SS27',
      articleId: 'a1',
      dryRun: false,
    });
    expect(summary.ok).toBe(false);
    expect(summary.messageRu).toMatch(/без fake GRN/);
  });
});

describe('workshop2 wave5 — network analytics', () => {
  it('aggregates blocked articles and showroom publishes', () => {
    const snap = aggregateWorkshop2NetworkAnalytics({
      domainEvents: [
        {
          id: '1',
          type: 'dossier.gate_blocked',
          collectionId: 'SS27',
          articleId: 'a1',
          payload: {},
          createdAt: '2026-05-26T10:00:00.000Z',
        },
        {
          id: '2',
          type: 'showroom.published',
          collectionId: 'SS27',
          articleId: 'a2',
          payload: {},
          createdAt: '2026-05-26T11:00:00.000Z',
        },
        {
          id: '3',
          type: 'sample_order.status_changed',
          collectionId: 'SS27',
          articleId: 'a3',
          payload: { status: 'in_transit', orderId: 'so-1' },
          createdAt: '2026-05-26T12:00:00.000Z',
        },
      ],
      calendarEvents: [
        {
          id: 'c1',
          collectionId: 'SS27',
          articleId: 'a1',
          sourceKind: 'tna_milestone',
          title: 'Gate',
          startAt: '2026-05-26T09:00:00.000Z',
          endAt: '2026-05-26T18:00:00.000Z',
          isBlocker: true,
        },
      ],
    });
    expect(snap.articlesBlocked).toBe(1);
    expect(snap.showroomPublishedCount).toBe(1);
    expect(snap.samplesInTransit).toBe(1);
    expect(snap.calendarBlockerCount).toBe(1);
  });
});

describe('workshop2 wave5 — auto showroom publish', () => {
  it('detects AUTO_SHOWROOM flag', () => {
    process.env.WORKSHOP2_AUTO_SHOWROOM_PUBLISH = 'true';
    expect(isWorkshop2AutoShowroomPublishEnabled()).toBe(true);
    delete process.env.WORKSHOP2_AUTO_SHOWROOM_PUBLISH;
  });

  it('evaluates showroom_publish gate scope constant', () => {
    expect(WORKSHOP2_SHOWROOM_PUBLISH_GATE_SCOPE).toBe('showroom_publish');
  });

  it('passes gate when b2b draft valid', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      b2bIntegrationDraft: {
        wholesalePrice: '100',
        msrp: '200',
        moq: '10',
        startDate: '2026-06-01',
        endDate: '2026-06-30',
      },
    };
    const r = evaluateWorkshop2ShowroomPublishGateForDossier({
      dossier,
      collectionId: 'SS27',
      articleId: 'a1',
    });
    expect(r.passed).toBe(true);
  });
});

describe('workshop2 wave5 — Illustrator webhook', () => {
  it('parses asset ref payload', () => {
    const p = parseWorkshop2IllustratorWebhookBody({
      assetRef: '/vault/sketch.ai',
      collectionId: 'SS27',
      articleId: 'a1',
    });
    expect(p?.assetRef).toContain('sketch');
  });

  it('builds journal entry with presign enqueue flag', () => {
    const entry = buildWorkshop2IllustratorWebhookJournalEntry({
      assetRef: 'ref-1',
      collectionId: 'SS27',
      articleId: 'a1',
    });
    expect(entry.presignEnqueued).toBe(true);
    expect(entry.status).toBe('journal_only');
  });

  it('verify illustrator secret', () => {
    process.env.WORKSHOP2_ILLUSTRATOR_WEBHOOK_SECRET = 'ill-secret';
    expect(verifyWorkshop2IllustratorWebhookSecret({ secretHeader: 'ill-secret' }).ok).toBe(true);
    delete process.env.WORKSHOP2_ILLUSTRATOR_WEBHOOK_SECRET;
  });
});

describe('workshop2 wave5 — wave5Horizontal probes', () => {
  it('exposes mes, moysklad, auto showroom flags', () => {
    process.env.WORKSHOP2_MES_QC_WEBHOOK_SECRET = 'x';
    process.env.WORKSHOP2_AUTO_SHOWROOM_PUBLISH = 'true';
    process.env.WORKSHOP2_PG_ONLY = 'true';
    const probes = buildWorkshop2Wave5HorizontalProbes();
    expect(probes.mesQcIngest.configured).toBe(true);
    expect(probes.autoShowroomPublish.enabled).toBe(true);
    expect(probes.pgOnlyReadPolicy.contextualMessages).toBe(true);
    delete process.env.WORKSHOP2_MES_QC_WEBHOOK_SECRET;
    delete process.env.WORKSHOP2_AUTO_SHOWROOM_PUBLISH;
    delete process.env.WORKSHOP2_PG_ONLY;
  });
});

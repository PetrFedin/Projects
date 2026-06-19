/**
 * Wave 1 horizontal integration: domain events, calendar sync, linesheet, chat persist.
 */
import { buildWorkshop2BrandCalendarEventsFromDossier } from '@/lib/production/workshop2-brand-calendar-sync';
import { buildWorkshop2ShowroomLinesheetPayload } from '@/lib/production/workshop2-showroom-linesheet-payload';
import {
  WORKSHOP2_DOMAIN_EVENT_TYPES,
  workshop2ArticleContextId,
} from '@/lib/production/workshop2-domain-event-types';
import { evaluateWorkshop2PendingChangeRequestHandoffGate } from '@/lib/production/workshop2-pending-change-requests';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  clearWorkshop2ContextualMessagesMemoryForTests,
  listWorkshop2ContextualMessages,
  sanitizeContextualMessageText,
} from '@/lib/server/workshop2-contextual-messages-repository';
import {
  clearWorkshop2DomainEventOutboxMemoryForTests,
  enqueueWorkshop2DomainEvent,
} from '@/lib/server/workshop2-domain-events';

describe('workshop2 wave1 — domain event types', () => {
  it('declares cross-module event kinds', () => {
    expect(WORKSHOP2_DOMAIN_EVENT_TYPES).toEqual(
      expect.arrayContaining([
        'dossier.gate_blocked',
        'dossier.gate_passed',
        'showroom.published',
        'change_request.approved',
        'sample_order.status_changed',
      ])
    );
  });
});

describe('workshop2 wave1 — calendar sync', () => {
  it('maps taMilestones and gate blockers', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      taMilestones: [
        {
          id: 'ta-1',
          title: 'Золотой эталон — QC',
          targetDate: '2026-06-01',
          actualDate: null,
          status: 'pending' as const,
        },
        {
          id: 'ta-2',
          title: 'Handoff в цех',
          targetDate: '2026-06-15',
          actualDate: null,
          status: 'pending' as const,
        },
      ],
    };
    const events = buildWorkshop2BrandCalendarEventsFromDossier({
      collectionId: 'demo-ss27',
      articleId: 'demo-ss27-01',
      dossier,
      sampleOrderDueDate: '2026-05-20',
    });
    expect(events.some((e) => e.sourceKind === 'ta_milestone')).toBe(true);
    expect(events.some((e) => e.blockerKind === 'gold')).toBe(true);
    expect(events.some((e) => e.blockerKind === 'handoff')).toBe(true);
    expect(events.some((e) => e.blockerKind === 'sample_deadline')).toBe(true);
  });
});

describe('workshop2 wave1 — linesheet payload', () => {
  it('builds MOQ/prices/sizes from dossier', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      gradingSizes: ['S', 'M', 'L'],
      b2bIntegrationDraft: { wholesalePrice: '120', msrp: '299', moq: '12' },
    };
    const payload = buildWorkshop2ShowroomLinesheetPayload({
      collectionId: 'c1',
      articleId: 'a1',
      dossier,
      campaign: {
        collectionId: 'c1',
        articleId: 'a1',
        published: true,
        campaignName: 'SS27',
        wholesalePrice: 99,
        msrp: 249,
        moq: 24,
        updatedAt: new Date().toISOString(),
      },
    });
    expect(payload.wholesalePrice).toBe(99);
    expect(payload.msrp).toBe(249);
    expect(payload.moq).toBe(24);
    expect(payload.sizes).toEqual(['S', 'M', 'L']);
    expect(payload.published).toBe(true);
  });
});

describe('workshop2 wave1 — domain events + chat mirror', () => {
  const prevDb = process.env.WORKSHOP2_DATABASE_URL;

  beforeEach(() => {
    delete process.env.WORKSHOP2_DATABASE_URL;
    delete process.env.WORKSHOP2_DOSSIER_DATABASE_URL;
    clearWorkshop2DomainEventOutboxMemoryForTests();
    clearWorkshop2ContextualMessagesMemoryForTests();
  });

  afterEach(() => {
    if (prevDb) process.env.WORKSHOP2_DATABASE_URL = prevDb;
    else delete process.env.WORKSHOP2_DATABASE_URL;
  });

  it('enqueue dispatches system chat message', async () => {
    await enqueueWorkshop2DomainEvent({
      type: 'dossier.gate_blocked',
      collectionId: 'c1',
      articleId: 'a1',
      payload: { gateScope: 'sample_order', messageRu: 'CR открыт' },
    });
    const ctx = workshop2ArticleContextId('c1', 'a1');
    const messages = await listWorkshop2ContextualMessages({
      contextType: 'workshop2_article',
      contextId: ctx,
    });
    expect(messages.length).toBe(1);
    expect(messages[0]?.isSystem).toBe(true);
    expect(messages[0]?.message).toContain('Gate заблокирован');
  });
});

describe('workshop2 wave1 — CR handoff blocking', () => {
  it('blocks handoff when pending CR exist', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      changeRequests: [
        {
          id: 'cr-pending-1',
          description: 'Change fabric',
          status: 'pending' as const,
          createdAt: new Date().toISOString(),
          createdBy: 'tech',
        },
      ],
    };
    const gate = evaluateWorkshop2PendingChangeRequestHandoffGate(dossier);
    expect(gate?.severity).toBe('blocker');
  });
});

describe('workshop2 wave1 — contextual sanitize', () => {
  it('escapes angle brackets', () => {
    expect(sanitizeContextualMessageText('<script>')).toBe('&lt;script&gt;');
  });
});

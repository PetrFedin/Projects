import {
  buildWorkshop2HubOnboardingChecklist,
  computeWorkshop2HubOnboardingProgressPct,
} from '@/lib/production/workshop2-hub-onboarding-progress';
import {
  mapWorkshop2ServerEventToActivityEntry,
  mergeWorkshop2HubActivitySources,
} from '@/lib/production/workshop2-hub-activity-merge';
import { formatWorkshop2PlmOutboxBadge } from '@/lib/production/workshop2-plm-outbox-badge';
import {
  buildRndStatusTitleExtras,
  resolveRndArticleStatus,
} from '@/lib/production/workshop2-rnd-state-machine';
import {
  buildWorkshop2OperationalTzBridge,
  workshop2OperationalTabToTzW2Sec,
} from '@/lib/production/workshop2-article-operational-tz-bridge';
import { evaluateWorkshop2OperationalTzLock } from '@/lib/production/workshop2-operational-tz-lock';
import {
  countWorkshop2VisualRefOpenDiscussions,
  evaluateWorkshop2VisualReferencesReadiness,
} from '@/lib/production/workshop2-visual-references-readiness';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';

describe('workshop2 wave4 — hub onboarding', () => {
  it('role checklist tracks pg, article, workspace without inflating progress', () => {
    const items = buildWorkshop2HubOnboardingChecklist({
      role: 'technologist',
      pgStatus: 'ok',
      hasArticle: true,
      openedWorkspace: false,
    });
    expect(items).toHaveLength(3);
    expect(computeWorkshop2HubOnboardingProgressPct(items)).toBe(67);
  });
});

describe('workshop2 wave4 — hub activity merge', () => {
  it('merges server dossier events with local log and dedups by id', () => {
    const server = [
      {
        id: 'e1',
        collectionId: 'SS27',
        articleId: 'a1',
        eventType: 'dossier_saved',
        createdAt: '2026-05-19T10:00:00.000Z',
        createdBy: 'tech@brand',
      },
    ];
    const local = [
      {
        id: 'local-1',
        at: '2026-05-19T09:00:00.000Z',
        line: 'Создан артикул',
        collectionId: 'SS27',
        articleId: 'a1',
      },
    ];
    const merged = mergeWorkshop2HubActivitySources(local, server, { a1: 'W2-001' });
    expect(merged).toHaveLength(2);
    expect(merged[0]?.id).toBe('srv-e1');
    expect(mapWorkshop2ServerEventToActivityEntry(server[0]!, 'W2-001').line).toContain('W2-001');
  });
});

describe('workshop2 wave4 — PLM outbox badge', () => {
  it('splits pending vs awaiting ACK and surfaces auto-ack hint', () => {
    const badge = formatWorkshop2PlmOutboxBadge({
      pending: 2,
      awaitingAck: 1,
      autoAckEnabled: true,
    });
    expect(badge.tone).toBe('pending');
    expect(badge.showProcessButton).toBe(true);
    expect(badge.labelRu).toContain('очередь');
    expect(badge.labelRu).toContain('ACK');
  });

  it('shows OK when queue empty', () => {
    const badge = formatWorkshop2PlmOutboxBadge({ pending: 0, awaitingAck: 0 });
    expect(badge.tone).toBe('ok');
    expect(badge.showProcessButton).toBe(false);
    expect(badge.showRetryFailedButton).toBe(false);
  });
});

describe('workshop2 wave4 — R&D lifecycle', () => {
  it('elevates to PRODUCTION_READY when ERP synced and gold approved', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      lifecycleState: 'in_development' as const,
      assignments: [{ attributeId: 'sku', values: [{ text: 'W2-1' }] }],
    };
    const status = resolveRndArticleStatus(
      dossier,
      { fitGold: { goldApproved: true, fitComments: [] } } as never,
      { factoryErpSyncStatus: 'synced', factoryErpOrderId: 'ERP-42' }
    );
    expect(status).toBe('PRODUCTION_READY');
    expect(
      buildRndStatusTitleExtras({ factoryErpSyncStatus: 'synced', factoryErpOrderId: 'ERP-42' })
    ).toBe('ERP: ERP-42');
  });
});

describe('workshop2 wave4 — operational TZ ribbon', () => {
  it('maps supply tab to material w2sec', () => {
    expect(workshop2OperationalTabToTzW2Sec('supply')).toBe('material');
  });

  it('locks TZ link when dossier missing', () => {
    const lock = evaluateWorkshop2OperationalTzLock({
      tab: 'fit',
      dossier: null,
      leaf: { leafId: 'catalog-apparel-g0-l0' } as never,
    });
    expect(lock.locked).toBe(true);
  });

  it('bridge reports contract line when dossier loaded', () => {
    const bridge = buildWorkshop2OperationalTzBridge('supply', emptyWorkshop2DossierPhase1(), null);
    expect(bridge.contractLine).toContain('материалы');
    expect(bridge.overallLine).toMatch(/Готовность ТЗ|critical path/);
  });
});

describe('workshop2 wave4 — visual references readiness', () => {
  it('blocks when open discussions remain', () => {
    const n = countWorkshop2VisualRefOpenDiscussions({
      visualReferences: [
        {
          refId: 'r1',
          title: 'Ref',
          comments: [{ id: 'c1', at: '2026-01-01', author: 'a', text: 'x', resolved: false }],
        },
      ],
    });
    expect(n).toBe(1);
    const r = evaluateWorkshop2VisualReferencesReadiness({
      visualReferences: [
        {
          refId: 'r1',
          title: 'Ref',
          previewDataUrl: 'data:image/png;base64,abc',
          mimeType: 'image/png',
          comments: [{ id: 'c1', at: '2026-01-01', author: 'a', text: 'x', resolved: false }],
        },
      ],
    });
    expect(r.readyForVisualGate).toBe(false);
    expect(r.blockerRu).toContain('обсужден');
  });

  it('ready when media ref and canon photo + sketch set', () => {
    const r = evaluateWorkshop2VisualReferencesReadiness({
      visualReferences: [
        {
          refId: 'r1',
          title: 'Ref',
          previewDataUrl: 'data:image/png;base64,abc',
          mimeType: 'image/png',
        },
      ],
      canonicalMainPhotoRefId: 'r1',
      canonicalMainSketchTarget: { kind: 'master' },
    });
    expect(r.readyForVisualGate).toBe(true);
    expect(r.blockerRu).toBeUndefined();
  });
});

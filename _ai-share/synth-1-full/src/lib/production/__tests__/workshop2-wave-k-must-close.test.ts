/**
 * Wave K — hub drift (mocked PG), inspector flush, fit floor meta, probe flags, ERP messages.
 */
import fs from 'fs';
import path from 'path';
import {
  evaluateWorkshop2HubInventoryMirrorPersistOutcome,
  summarizeWorkshop2HubInventoryDriftBatch,
  summarizeWorkshop2HubPgOnlyBanner,
} from '@/lib/production/workshop2-hub-pg-only-policy';
import {
  enqueueWorkshop2InspectorOfflinePut,
  flushWorkshop2InspectorOfflineQueue,
  resetWorkshop2InspectorOfflineQueueForTests,
  workshop2InspectorOfflineQueueDepth,
} from '@/lib/production/workshop2-inspector-offline-queue';
import { buildWorkshop2FitPanelMeta } from '@/lib/production/workshop2-ux-phase1-helpers';
import { summarizeWorkshop2FloorMesChip } from '@/lib/production/workshop2-floor-mes';
import {
  buildWorkshop2StructuredIntegrationProbeSummary,
  isWorkshop2IntegrationUrlProductionLive,
  resolveWorkshop2IntegrationProbeFlags,
} from '@/lib/production/workshop2-live-integration-probes';
import { recordWorkshop2PlmWebhookReceipt } from '@/lib/production/workshop2-plm-transport-journal';
import { buildWorkshop2PlmWebhookPartnerAckShape } from '@/lib/production/workshop2-live-plm-webhook-contract';
import {
  emptyWorkshop2DossierPhase1,
  workshop2Phase1DossierStorageKey,
} from '@/lib/production/workshop2-phase1-dossier-storage';
import { stampWorkshop2HubPgOverlayOnDossier } from '@/lib/production/workshop2-hub-inventory-pg-overlay';
import {
  WORKSHOP2_SURFACE_BANNER_INLINE_HINT_CLASS,
  WORKSHOP2_SURFACE_BANNER_OUTLINE_ACTION_CLASS,
} from '@/lib/production/workshop2-surface-banner-tokens';
import {
  runWorkshop2FactoryErpSync,
  clearWorkshop2FactoryErpMemoryForTests,
  resolveWorkshop2FactoryErpBaseUrl,
} from '@/lib/server/workshop2-factory-erp-repository';

const ROOT = path.join(process.cwd(), 'src/components/brand/production');

describe('workshop2 wave-k — must close', () => {
  beforeEach(() => {
    resetWorkshop2InspectorOfflineQueueForTests();
    clearWorkshop2FactoryErpMemoryForTests();
    delete process.env.WORKSHOP2_FACTORY_ERP_BASE_URL;
    delete process.env.WORKSHOP2_NESTING_API_URL;
    delete process.env.WORKSHOP2_DPP_REGISTRY_URL;
    delete process.env.WORKSHOP2_VAULT_CAD_INGEST_URL;
  });

  describe('SS27 #6 — hub PG drift (mocked fetch outcome)', () => {
    it('inventory mirror persist fail-closed when PG PUT returns 503', () => {
      const out = evaluateWorkshop2HubInventoryMirrorPersistOutcome({
        backendStatus: 'server',
        apiOk: false,
        apiReason: 'postgres_disabled',
      });
      expect(out.ok).toBe(false);
      expect(out.silentLocalSuccess).toBe(false);
      expect(out.httpStatusHint).toBe(503);
    });

    it('inventory mirror persist fail-closed on server without silent LS (409)', () => {
      const out = evaluateWorkshop2HubInventoryMirrorPersistOutcome({
        backendStatus: 'server',
        apiOk: false,
        apiReason: 'pg_unavailable',
      });
      expect(out.httpStatusHint).toBe(409);
    });

    it('drift batch detects overlay mismatch for hub banner copy', () => {
      const key = workshop2Phase1DossierStorageKey('SS27', 'demo-ss27-01');
      const local = {
        ...stampWorkshop2HubPgOverlayOnDossier(emptyWorkshop2DossierPhase1(), {
          collectionId: 'SS27',
          articleId: 'demo-ss27-01',
          serverVersion: 1,
        }),
        hubPgOverlayAt: '2026-05-20T10:00:00.000Z',
      };
      const merged = {
        ...stampWorkshop2HubPgOverlayOnDossier(emptyWorkshop2DossierPhase1(), {
          collectionId: 'SS27',
          articleId: 'demo-ss27-01',
          serverVersion: 3,
        }),
        hubPgOverlayAt: '2026-05-21T12:00:00.000Z',
      };
      const batch = summarizeWorkshop2HubInventoryDriftBatch({
        localMap: { [key]: local },
        mergedMap: { [key]: merged },
        articles: [{ collectionId: 'SS27', articleId: 'demo-ss27-01' }],
      });
      expect(batch.driftCount).toBe(1);
      const banner = summarizeWorkshop2HubPgOnlyBanner({
        backendStatus: 'server',
        inventoryDriftCount: batch.driftCount,
      });
      expect(banner?.messageRu).toMatch(/Drift inventory/);
      expect(banner?.messageRu).not.toMatch(/→ PG/);
    });

    it('hub onboarding mirror driftDetected surfaces in banner path', () => {
      const banner = summarizeWorkshop2HubPgOnlyBanner({
        backendStatus: 'server',
        onboardingDrift: true,
      });
      expect(banner?.messageRu).toMatch(/Drift онбординга/);
      expect(banner?.messageRu).not.toMatch(/→ PG/);
    });
  });

  describe('SS27 #7 — inspector flush with mocked save (PG PUT)', () => {
    it('online recovery flushes queue via mocked fetch/save and clears depth', async () => {
      enqueueWorkshop2InspectorOfflinePut({
        collectionId: 'SS27',
        articleId: 'demo-ss27-01',
        sampleOrderId: 'ord-wave-k',
        checkedItemIds: ['zipper', 'seam'],
      });
      expect(workshop2InspectorOfflineQueueDepth()).toBe(1);

      const save = jest.fn().mockResolvedValue({
        ok: true,
        report: {
          sampleOrderId: 'ord-wave-k',
          collectionId: 'SS27',
          articleId: 'demo-ss27-01',
          checkedItemIds: ['zipper', 'seam'],
          updatedAt: '2026-05-22T12:00:00.000Z',
        },
      });

      const result = await flushWorkshop2InspectorOfflineQueue({ save });
      expect(save).toHaveBeenCalledTimes(1);
      expect(save.mock.calls[0][0]).toMatchObject({
        collectionId: 'SS27',
        articleId: 'demo-ss27-01',
        sampleOrderId: 'ord-wave-k',
      });
      expect(result.flushed).toBe(1);
      expect(result.failed).toBe(0);
      expect(workshop2InspectorOfflineQueueDepth()).toBe(0);
    });

    it('503 from PG keeps queue depth (no fake saved)', async () => {
      enqueueWorkshop2InspectorOfflinePut({
        collectionId: 'SS27',
        articleId: 'demo-ss27-01',
        sampleOrderId: 'ord-fail',
        checkedItemIds: ['a'],
      });
      const save = jest.fn().mockResolvedValue({ ok: false, status: 503 });
      const result = await flushWorkshop2InspectorOfflineQueue({ save });
      expect(result.flushed).toBe(0);
      expect(result.failed).toBe(1);
      expect(workshop2InspectorOfflineQueueDepth()).toBe(1);
    });
  });

  describe('SS27 #8 — fit panel floor chip meta', () => {
    it('buildWorkshop2FitPanelMeta includes Floor chip label in readiness DOM string', () => {
      const floor = summarizeWorkshop2FloorMesChip({
        configured: true,
        pollState: 'synced',
      });
      const meta = buildWorkshop2FitPanelMeta({
        fitSessions: { state: 'ready', hintRu: 'Сессии OK', sessionCount: 1 },
        floorChipLabelRu: floor.labelRu,
      });
      expect(meta.readiness).toContain('Floor: synced');
      expect(meta.readiness).toMatch(/^Floor:/);
    });
  });

  describe('Wave K — semantic tokens grading/movement', () => {
    it('grading and movement panels import shared banner tokens', () => {
      const grading = fs.readFileSync(path.join(ROOT, 'Workshop2GradingMatrixPanel.tsx'), 'utf8');
      const movement = fs.readFileSync(
        path.join(ROOT, 'Workshop2SampleGoodsMovementPanel.tsx'),
        'utf8'
      );
      expect(grading).toMatch(/WORKSHOP2_SURFACE_BANNER_OUTLINE_ACTION_CLASS/);
      expect(movement).toMatch(/WORKSHOP2_SURFACE_BANNER_INLINE_HINT_CLASS/);
      expect(WORKSHOP2_SURFACE_BANNER_OUTLINE_ACTION_CLASS).toContain('amber');
      expect(WORKSHOP2_SURFACE_BANNER_INLINE_HINT_CLASS).toContain('amber');
    });
  });

  describe('Wave K — PLM webhook dossier mirror (memory PG store)', () => {
    it('webhook receipt persists plmTransportJournalMirror without fake partnerAck', () => {
      const dossier = emptyWorkshop2DossierPhase1();
      const next = recordWorkshop2PlmWebhookReceipt({
        dossier,
        actor: 'wave-k-test',
        eventId: 'evt-k-1',
        payloadPreview: { source: 'test' },
      });
      expect(next.plmTransportJournalMirror?.journal?.length).toBeGreaterThan(0);
      const shape = buildWorkshop2PlmWebhookPartnerAckShape({
        dossier: next,
        eventId: 'evt-k-1',
      });
      expect(shape.partnerAckRecorded).toBe(false);
      expect(shape.webhookReceiptRecorded).toBe(true);
      expect(shape.hintRu).toMatch(/fail-closed|partnerAck/i);
    });
  });

  describe('Wave K — factory ERP error messages', () => {
    it('not_configured when base URL unset', async () => {
      expect(resolveWorkshop2FactoryErpBaseUrl()).toBeUndefined();
      const state = await runWorkshop2FactoryErpSync({
        collectionId: 'SS27',
        articleId: 'demo-ss27-01',
      });
      expect(state.syncStatus).toBe('not_configured');
    });

    it('502 path when ERP POST returns 500 (mocked fetch)', async () => {
      process.env.WORKSHOP2_FACTORY_ERP_BASE_URL = 'http://127.0.0.1:4099';
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: 'server_error' }),
      }) as unknown as typeof fetch;

      const state = await runWorkshop2FactoryErpSync({
        collectionId: 'SS27',
        articleId: 'demo-ss27-01',
      });
      expect(state.syncStatus).toBe('error');
      expect(state.lastError).toBeTruthy();
    });
  });

  describe('Wave K — probe configured vs live flags', () => {
    it('localhost URL → configured true, live false', () => {
      const env = {
        WORKSHOP2_NESTING_API_URL: 'http://127.0.0.1:4099/nest',
        WORKSHOP2_DPP_REGISTRY_URL: 'http://localhost:4099/dpp',
        WORKSHOP2_VAULT_CAD_INGEST_URL: 'https://vault.prod.example/dpp',
      };
      const flags = buildWorkshop2StructuredIntegrationProbeSummary(env);
      expect(flags.nesting).toEqual({ configured: true, live: false });
      expect(flags.dpp).toEqual({ configured: true, live: false });
      expect(flags.fit3d).toEqual({ configured: true, live: true });
      expect(isWorkshop2IntegrationUrlProductionLive('https://erp.partner.io')).toBe(true);
      expect(isWorkshop2IntegrationUrlProductionLive('http://127.0.0.1:4099')).toBe(false);
    });

    it('resolveWorkshop2IntegrationProbeFlags when unset', () => {
      expect(
        resolveWorkshop2IntegrationProbeFlags({
          configured: false,
          env: {},
          envKeys: ['WORKSHOP2_NESTING_API_URL'],
        })
      ).toEqual({ configured: false, live: false });
    });
  });

  it('QC panel user-visible copy has no Inspector → PG', () => {
    const qc = fs.readFileSync(path.join(ROOT, 'workshop2-article-workspace-qc-panel.tsx'), 'utf8');
    expect(qc).not.toMatch(/Inspector → PG/);
    expect(qc).toMatch(/сохраните отчёт в досье/);
  });
});

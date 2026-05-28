/**
 * Wave E — investor-grade depth: fail-closed PG, live ERP contract, honest metrics.
 */
import { evaluateWorkshop2HubOnboardingBrowserFinish } from '@/lib/production/workshop2-hub-onboarding-fail-closed';
import {
  resolveWorkshop2InspectorSaveOutcome,
  shouldCacheWorkshop2InspectorChecksLocally,
} from '@/lib/production/workshop2-inspector-pg-fail-closed';
import {
  appendWorkshop2LiveErpPostJournal,
  evaluateWorkshop2LiveErpPostResponse,
} from '@/lib/production/workshop2-live-erp-e2e-contract';
import {
  summarizeWorkshop2FactoryErpPgMirror,
  summarizeWorkshop2HubOnboardingPgMirror,
  summarizeWorkshop2InspectorPgMirror,
} from '@/lib/production/workshop2-operational-pg-mirror-status';
import { attemptWorkshop2FactoryErpStaging } from '@/lib/production/workshop2-factory-erp-staging';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import type { Workshop2CeilingFetchFn } from '@/lib/production/workshop2-ceiling-staging-core';

describe('workshop2 wave E — investor depth', () => {
  describe('inspector PG fail-closed (#68)', () => {
    it('503 → queue + LS cache allowed', () => {
      const outcome = resolveWorkshop2InspectorSaveOutcome({
        saveOk: false,
        status: 503,
        online: true,
        pendingQueueDepth: 0,
      });
      expect(outcome.kind).toBe('queued_offline');
      expect(outcome.cacheLocally).toBe(true);
      expect(outcome.saveState).toBe('error');
      expect(
        shouldCacheWorkshop2InspectorChecksLocally({ saveOk: false, status: 503, online: true })
      ).toBe(true);
    });

    it('409 → no LS cache (conflict, not offline)', () => {
      const outcome = resolveWorkshop2InspectorSaveOutcome({
        saveOk: false,
        status: 409,
        online: true,
      });
      expect(outcome.kind).toBe('pg_failed');
      expect(outcome.cacheLocally).toBe(false);
      expect(outcome.hintRu).toMatch(/409/);
    });

    it('200 ok → pg_saved, no cache', () => {
      const outcome = resolveWorkshop2InspectorSaveOutcome({ saveOk: true });
      expect(outcome.kind).toBe('pg_saved');
      expect(outcome.cacheLocally).toBe(false);
    });
  });

  describe('hub onboarding fail-closed (#4)', () => {
    it('offline backend → explicit LS-only warning', () => {
      const fin = evaluateWorkshop2HubOnboardingBrowserFinish({ backendStatus: 'offline' });
      expect(fin.allowBrowserCache).toBe(true);
      expect(fin.blocksSampleUntilPgMirror).toBe(true);
      expect(fin.warningRu).toMatch(/offline/i);
    });

    it('server online → PG mirror required for sample', () => {
      const fin = evaluateWorkshop2HubOnboardingBrowserFinish({
        backendStatus: 'server',
        pgReferencesOk: true,
      });
      expect(fin.warningRu).toMatch(/hub_onboarding_mirror/);
      expect(fin.blocksSampleUntilPgMirror).toBe(true);
    });
  });

  describe('operational PG mirror chips', () => {
    it('inspector offlineOnly → rose tone', () => {
      const chip = summarizeWorkshop2InspectorPgMirror({
        inspectorReportMirror: {
          mirroredAt: '2026-05-21T00:00:00.000Z',
          sampleOrderId: 'so-1',
          totalItems: 5,
          checkedCount: 3,
          requiredDone: 2,
          requiredTotal: 4,
          pgSynced: false,
          offlineOnly: true,
          reportState: 'at_risk',
          blockerSampleOrder: true,
          blockerHandoff: true,
        },
      });
      expect(chip.tone).toBe('rose');
      expect(chip.label).toMatch(/offline/i);
    });

    it('ERP with erpOrderId → emerald', () => {
      const chip = summarizeWorkshop2FactoryErpPgMirror({
        dossier: {
          ...emptyWorkshop2DossierPhase1(),
          factoryErpSync: { syncStatus: 'synced', erpOrderId: 'ERP-LIVE-42' },
        },
        syncStatus: 'synced',
        erpOrderId: 'ERP-LIVE-42',
      });
      expect(chip.tone).toBe('emerald');
      expect(chip.label).toContain('ERP-LIVE-42');
    });

    it('hub drift → amber', () => {
      const chip = summarizeWorkshop2HubOnboardingPgMirror({
        hubOnboardingMirror: {
          mirroredAt: '2026-05-21T00:00:00.000Z',
          done: true,
          workspaceOpened: true,
          role: 'designer',
          source: 'dossier',
          driftDetected: true,
          pgPrimary: true,
          blockerSampleOrder: false,
          hintRu: 'Drift test',
        },
      });
      expect(chip.tone).toBe('amber');
      expect(chip.label).toMatch(/drift/i);
    });
  });

  describe('live ERP E2E contract (#66)', () => {
    it('2xx + erpOrderId → success outcome', () => {
      const outcome = evaluateWorkshop2LiveErpPostResponse({
        httpStatus: 201,
        json: { erpOrderId: 'PO-ERP-9001' },
      });
      expect(outcome.ok).toBe(true);
      if (outcome.ok) expect(outcome.erpOrderId).toBe('PO-ERP-9001');
    });

    it('2xx without id → fail-closed', () => {
      const outcome = evaluateWorkshop2LiveErpPostResponse({
        httpStatus: 200,
        json: { status: 'accepted' },
      });
      expect(outcome.ok).toBe(false);
      if (!outcome.ok) expect(outcome.error).toBe('erp_missing_order_id');
    });

    it('live POST success → journal entry in dossier mirror', () => {
      const outcome = evaluateWorkshop2LiveErpPostResponse({
        httpStatus: 200,
        json: { externalId: 'EXT-77' },
      });
      expect(outcome.ok).toBe(true);
      if (!outcome.ok) return;
      const next = appendWorkshop2LiveErpPostJournal({
        dossier: emptyWorkshop2DossierPhase1(),
        actor: 'wave-e-test',
        outcome,
        baseUrl: 'https://erp.example.com',
      });
      expect(next.factoryErpStagingMirror?.erpOrderIdAckInPg).toBe(true);
      expect(next.factoryErpStagingMirror?.partnerAckId).toBe('EXT-77');
      expect(next.factoryErpStagingMirror?.stagingContractMode).toBe(false);
      expect(next.factoryErpStagingMirror?.journal.at(-1)?.event).toBe('erp_live_post');
      expect(next.factoryErpSync?.syncStatus).toBe('synced');
    });

    it('ERP staging without URL → fail-closed journal skip', async () => {
      const res = await attemptWorkshop2FactoryErpStaging({
        dossier: emptyWorkshop2DossierPhase1(),
        purchaseOrders: [],
        erpConfigured: false,
        actor: 'wave-e',
        collectionId: 'SS27',
        articleId: 'demo-ss27-01',
        env: {},
      });
      expect(res.ok).toBe(false);
      expect(res.skipped).toBe(true);
      expect(res.dossier.factoryErpStagingMirror?.hintRu).toMatch(/не задан/i);
    });

    it('ERP staging with mock fetch → journal ACK (contract mode)', async () => {
      const mockFetch: Workshop2CeilingFetchFn = (async () =>
        ({
          ok: true,
          status: 200,
          json: async () => ({ erpOrderId: 'ERP-WAVE-E-1' }),
        }) as Response) as Workshop2CeilingFetchFn;

      const res = await attemptWorkshop2FactoryErpStaging({
        dossier: emptyWorkshop2DossierPhase1(),
        purchaseOrders: [],
        erpConfigured: true,
        actor: 'wave-e',
        collectionId: 'SS27',
        articleId: 'demo-ss27-01',
        env: {
          WORKSHOP2_FACTORY_ERP_BASE_URL: 'http://127.0.0.1:18766',
          WORKSHOP2_STAGING_CONTRACT_MODE: 'true',
        },
        fetchImpl: mockFetch,
      });
      expect(res.ok).toBe(true);
      expect(res.dossier.factoryErpStagingMirror?.partnerAckId).toBe('ERP-WAVE-E-1');
    });
  });
});

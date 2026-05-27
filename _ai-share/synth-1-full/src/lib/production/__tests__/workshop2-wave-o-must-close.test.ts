/** @jest-environment node */

/**
 * Wave O — hub PG gate, LS read-on-miss chip, readyForInvestorDemo, inspector flush без PG.
 */

import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';
import { evaluateWorkshop2HubOnboardingPgGate } from '@/lib/production/workshop2-hub-onboarding-fail-closed';
import {
  mergeWorkshop2HubDossierMapFromApi,
  summarizeWorkshop2HubLsReadOnMiss,
} from '@/lib/production/workshop2-hub-dossier-map';
import {
  workshop2DossierHonestyFieldsFromApi,
  workshop2DossierStoreModeMessageRu,
} from '@/lib/production/workshop2-dossier-store-mode';
import {
  buildWorkshop2StructuredIntegrationProbeSummary,
  workshop2ReadyForInvestorDemo,
} from '@/lib/production/workshop2-live-integration-probes';
import {
  enqueueWorkshop2InspectorOfflinePut,
  flushWorkshop2InspectorOfflineQueue,
  resetWorkshop2InspectorOfflineQueueForTests,
  workshop2InspectorOfflineQueueDepth,
} from '@/lib/production/workshop2-inspector-offline-queue';
import { resolveWorkshop2InspectorSaveOutcome } from '@/lib/production/workshop2-inspector-pg-fail-closed';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import { PUT as inspectorPut } from '@/app/api/workshop2/articles/[collectionId]/[articleId]/inspector-report/[orderId]/route';
import { GET as integrationProbesGet } from '@/app/api/workshop2/integration-probes/route';

jest.mock('@/lib/production/workshop2-api-client', () => ({
  loadWorkshop2DossierFromApi: jest.fn(),
  buildWorkshop2ApiRequestHeaders: jest.fn(() => ({})),
}));

jest.mock('@/lib/server/workshop2-pg-pool', () => ({
  isWorkshop2PostgresEnabled: jest.fn(() => false),
}));

jest.mock('@/lib/server/workshop2-inspector-report-repository', () => ({
  putWorkshop2InspectorReport: jest.fn(),
  getWorkshop2InspectorReport: jest.fn(),
}));

jest.mock('@/lib/server/workshop2-route-auth', () => ({
  guardWorkshop2Route: jest.fn(async () => ({ actorId: 'o-test' })),
  WORKSHOP2_READ_ROLES: [],
  WORKSHOP2_WRITE_ROLES: [],
}));

import { loadWorkshop2DossierFromApi } from '@/lib/production/workshop2-api-client';
import { isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';

const mockLoadDossier = loadWorkshop2DossierFromApi as jest.MockedFunction<
  typeof loadWorkshop2DossierFromApi
>;
const mockPgEnabled = isWorkshop2PostgresEnabled as jest.MockedFunction<
  typeof isWorkshop2PostgresEnabled
>;

describe('workshop2 wave-o — must close', () => {
  beforeEach(() => {
    resetWorkshop2InspectorOfflineQueueForTests();
    mockLoadDossier.mockReset();
    mockPgEnabled.mockReturnValue(false);
  });

  describe('hub onboarding PG gate (sample creation blocked)', () => {
    it('pg disabled → blocksSampleCreation + explicit copy', () => {
      const gate = evaluateWorkshop2HubOnboardingPgGate({ pgStatus: 'disabled' });
      expect(gate.blocksSampleCreation).toBe(true);
      expect(gate.gateCopyRu).toMatch(/sample-order заблокированы/i);
      expect(gate.gateCopyRu).toMatch(/workshop2-pg-bootstrap/);
    });

    it('pg ok → sample creation allowed', () => {
      const gate = evaluateWorkshop2HubOnboardingPgGate({ pgStatus: 'ok' });
      expect(gate.blocksSampleCreation).toBe(false);
    });
  });

  describe('hub LS read-on-miss dual-write chip', () => {
    it('merge tracks API miss with local cache', async () => {
      const local = {
        'SS27::demo-ss27-01': emptyWorkshop2DossierPhase1(),
      };
      mockLoadDossier.mockResolvedValue({ ok: false, reason: 'network_or_server_error' });
      const outcome = await mergeWorkshop2HubDossierMapFromApi(local, [
        { collectionId: 'SS27', articleId: 'demo-ss27-01' },
      ]);
      expect(outcome.lsFallbackStorageKeys).toContain('SS27::demo-ss27-01');
      const chip = summarizeWorkshop2HubLsReadOnMiss({
        lsFallbackStorageKeys: outcome.lsFallbackStorageKeys,
      });
      expect(chip?.labelRu).toMatch(/LS cache/);
      expect(chip?.hintRu).toMatch(/read-on-miss/);
    });
  });

  describe('readyForInvestorDemo (not allLive fake)', () => {
    it('empty env → honest disabled → ready', () => {
      expect(workshop2ReadyForInvestorDemo({})).toBe(true);
      const flags = buildWorkshop2StructuredIntegrationProbeSummary({});
      expect(Object.values(flags).every((f) => !f.configured)).toBe(true);
    });

    it('localhost configured → not ready without staging contract (global market)', () => {
      expect(
        workshop2ReadyForInvestorDemo({
          WORKSHOP2_MARKET: 'global',
          WORKSHOP2_NESTING_API_URL: 'http://127.0.0.1:4099/nest',
        })
      ).toBe(false);
    });

    it('prod URLs → ready', () => {
      expect(
        workshop2ReadyForInvestorDemo({
          WORKSHOP2_NESTING_API_URL: 'https://nesting.partner.example/v1',
          WORKSHOP2_DPP_REGISTRY_URL: 'https://dpp.eu.example/registry',
          WORKSHOP2_VAULT_CAD_INGEST_URL: 'https://vault.partner.example/ingest',
          WORKSHOP2_FACTORY_ERP_BASE_URL: 'https://erp.factory.example',
          WORKSHOP2_PLM_WEBHOOK_URL: 'https://plm.partner.example/hook',
          WORKSHOP2_PLM_PARTNER_ACK_URL: 'https://plm.partner.example/ack',
          WORKSHOP2_LCA_API_URL: 'https://lca.partner.example',
          WORKSHOP2_SHOWROOM_B2B_WEBHOOK_URL: 'https://b2b.partner.example/hook',
        })
      ).toBe(true);
    });

    it('/integration-probes exposes readyForInvestorDemo', async () => {
      const res = await integrationProbesGet();
      const json = await res.json();
      expect(typeof json.readyForInvestorDemo).toBe('boolean');
      expect(json.allLive).toBe(false);
    });
  });

  describe('inspector flush without PG (#7)', () => {
    it('PUT route fail-closed 503 when postgres disabled', async () => {
      mockPgEnabled.mockReturnValue(false);
      const req = new NextRequest(
        'http://localhost/api/workshop2/articles/SS27/demo-ss27-01/inspector-report/ord-o-1',
        {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ checkedItemIds: ['zipper'] }),
        }
      );
      const res = await inspectorPut(req, {
        params: Promise.resolve({
          collectionId: 'SS27',
          articleId: 'demo-ss27-01',
          orderId: 'ord-o-1',
        }),
      });
      expect(res.status).toBe(503);
      const json = await res.json();
      expect(json.ok).toBe(false);
      expect(json.messageRu).toMatch(/fail-closed|PostgreSQL/i);
    });

    it('503 save outcome queues offline — no fake saved', () => {
      const outcome = resolveWorkshop2InspectorSaveOutcome({
        saveOk: false,
        status: 503,
        online: true,
        pendingQueueDepth: 0,
      });
      expect(outcome.kind).toBe('queued_offline');
      expect(outcome.cacheLocally).toBe(true);
      expect(outcome.saveState).toBe('error');
    });

    it('flush with mocked save clears queue on PG recovery', async () => {
      enqueueWorkshop2InspectorOfflinePut({
        collectionId: 'SS27',
        articleId: 'demo-ss27-01',
        sampleOrderId: 'ord-o-flush',
        checkedItemIds: ['seam'],
      });
      expect(workshop2InspectorOfflineQueueDepth()).toBe(1);
      const save = jest.fn().mockResolvedValue({
        ok: true,
        report: {
          sampleOrderId: 'ord-o-flush',
          collectionId: 'SS27',
          articleId: 'demo-ss27-01',
          checkedItemIds: ['seam'],
          updatedAt: '2026-05-23T12:00:00.000Z',
        },
      });
      const result = await flushWorkshop2InspectorOfflineQueue({ save });
      expect(result.flushed).toBe(1);
      expect(workshop2InspectorOfflineQueueDepth()).toBe(0);
    });
  });

  describe('file-store persist paths use workshop2-dossier-store-mode', () => {
    it('workshop2DossierHonestyFieldsFromApi for file_persist', () => {
      const fields = workshop2DossierHonestyFieldsFromApi({
        ok: true,
        storeMode: 'server_file_persist',
        messageRu: workshop2DossierStoreModeMessageRu('server_file_persist'),
      });
      expect(fields.filePersistOnly).toBe(true);
      expect(fields.pgPrimary).toBe(false);
      expect(fields.messageRu).toMatch(/PostgreSQL недоступен/);
    });

    it('wave19–32 persist clients import store-mode helper', () => {
      const dir = path.join(process.cwd(), 'src/lib/production');
      const files = fs
        .readdirSync(dir)
        .filter((f) => /^workshop2-wave(19|2[0-4]|2[7-9]|3[0-2])-persist-client\.ts$/.test(f));
      expect(files.length).toBeGreaterThanOrEqual(12);
      for (const file of files) {
        const src = fs.readFileSync(path.join(dir, file), 'utf8');
        expect(src).toMatch(/workshop2-dossier-store-mode/);
        expect(src).toMatch(/workshop2DossierHonestyFieldsFromApi/);
      }
    });
  });
});

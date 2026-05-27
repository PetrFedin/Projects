/** @jest-environment node */

/**
 * Wave P/Q — critical path file-store E2E (без PG): demo dossiers, hub batch, sample gate,
 * ceilings (ERP/PLM/nesting), inspector PG-first read path, TZ export/handoff gates.
 */

import { NextRequest } from 'next/server';
import { GET as dossierGet } from '@/app/api/workshop2/articles/[collectionId]/[articleId]/dossier/route';
import { POST as batchPost } from '@/app/api/workshop2/articles/dossiers/batch/route';
import { GET as handoffGet } from '@/app/api/workshop2/articles/[collectionId]/[articleId]/handoff-readiness/route';
import { POST as sampleOrderPost } from '@/app/api/workshop2/articles/[collectionId]/[articleId]/sample-order/route';
import {
  GET as erpGet,
  POST as erpPost,
} from '@/app/api/workshop2/articles/[collectionId]/[articleId]/factory-erp/route';
import { POST as nestingPost } from '@/app/api/workshop2/articles/[collectionId]/[articleId]/nesting/simulate/route';
import { POST as plmWebhookPost } from '@/app/api/workshop2/plm/webhook-receipt/route';
import { GET as inspectorGet } from '@/app/api/workshop2/articles/[collectionId]/[articleId]/inspector-report/[orderId]/route';
import { GET as tzExportGet } from '@/app/api/workshop2/articles/[collectionId]/[articleId]/export-tz-bundle/route';
import { GET as handoffPdfGet } from '@/app/api/workshop2/articles/[collectionId]/[articleId]/handoff-pdf/route';
import { POST as wmsReservePost } from '@/app/api/workshop2/articles/[collectionId]/[articleId]/wms/reserve-sample/route';
import {
  buildWorkshop2FileStoreDemoDossier,
  isWorkshop2FileStoreDemoArticle,
} from '@/lib/production/workshop2-file-store-demo-bootstrap';
import { validateWorkshop2PlmWebhookPayload } from '@/lib/production/workshop2-plm-webhook-payload-schema';
import { resolveWorkshop2InspectorReadPath } from '@/lib/production/workshop2-inspector-read-path';
import { buildWorkshop2SampleOrderFileModeHonesty } from '@/lib/production/workshop2-sample-order-file-mode-honesty';
import {
  parseWorkshop2ArticlePaneParam,
  resolveWorkshop2ArticlePaneScrollHash,
} from '@/lib/production/workshop2-url';
import { isWorkshop2NestingProductionMode } from '@/lib/production/workshop2-nesting-prod-guard';
import { evaluateWorkshop2FactoryHandoffCommitGate } from '@/lib/production/workshop2-factory-handoff-commit-gate';
import { evaluateWorkshop2TzExportBundleGate } from '@/lib/production/workshop2-tz-export-bundle-gate';
import { evaluateWorkshop2HandoffPdfExportGate } from '@/lib/production/workshop2-handoff-pdf-export-gate';
import { syncWorkshop2SupplyLinesFromDossierBom } from '@/lib/production/workshop2-supply-sync-from-bom';
import { persistWorkshop2SupplyBundleMirrorToDossier } from '@/lib/production/workshop2-supply-bundle-dossier-persist';
import { buildWorkshop2SupplyBomSyncHonesty } from '@/lib/production/workshop2-supply-bom-sync-honesty';
import { buildWorkshop2WmsFileModeHonesty } from '@/lib/production/workshop2-wms-file-mode-honesty';
import { applyWorkshop2ArticleCommit } from '@/lib/production/local-collection-inventory';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import { clearWorkshop2FactoryErpMemoryForTests } from '@/lib/server/workshop2-factory-erp-repository';

jest.mock('@/lib/server/workshop2-pg-pool', () => ({
  isWorkshop2PostgresEnabled: jest.fn(() => false),
  getWorkshop2PgPool: jest.fn(),
}));

jest.mock('@/lib/server/workshop2-phase1-dossier-server-store', () => {
  const actual = jest.requireActual('@/lib/server/workshop2-phase1-dossier-server-store');
  return {
    ...actual,
    getWorkshop2ServerDossierStoreMode: jest.fn(() => 'server_file_persist'),
  };
});

jest.mock('@/lib/server/workshop2-dossier-repository', () => ({
  listWorkshop2VaultDocumentsFromPg: jest.fn(async () => []),
}));

jest.mock('@/lib/server/workshop2-sample-order-repository', () => ({
  listWorkshop2SampleOrders: jest.fn(async () => []),
  createWorkshop2SampleOrder: jest.fn(async (input: Record<string, unknown>) => ({
    id: 'so-file-p-1',
    status: 'draft',
    movementStatus: 'pending',
    movementLog: [],
    createdAt: new Date().toISOString(),
    ...input,
  })),
}));

jest.mock('@/lib/server/workshop2-factory-erp-repository', () => {
  const actual = jest.requireActual('@/lib/server/workshop2-factory-erp-repository');
  return {
    ...actual,
    getWorkshop2FactoryErpState: jest.fn(),
    runWorkshop2FactoryErpSync: jest.fn(),
  };
});

import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import {
  getWorkshop2FactoryErpState,
  runWorkshop2FactoryErpSync,
} from '@/lib/server/workshop2-factory-erp-repository';
import { isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';

const W2_HEADERS = {
  'content-type': 'application/json',
  'x-w2-actor-id': 'wave-p',
  'x-w2-actor-label': 'Wave P',
  'x-w2-actor-roles': 'production:edit',
};

function routeCtx(cid: string, aid: string) {
  return { params: Promise.resolve({ collectionId: cid, articleId: aid }) };
}

describe('workshop2 file-store e2e (Wave P, PG off)', () => {
  const mockErpState = getWorkshop2FactoryErpState as jest.MockedFunction<
    typeof getWorkshop2FactoryErpState
  >;
  const mockErpSync = runWorkshop2FactoryErpSync as jest.MockedFunction<
    typeof runWorkshop2FactoryErpSync
  >;
  const mockPg = isWorkshop2PostgresEnabled as jest.MockedFunction<
    typeof isWorkshop2PostgresEnabled
  >;

  beforeEach(() => {
    mockPg.mockReturnValue(false);
    process.env.WORKSHOP2_TRUST_ACTOR_HEADERS = '1';
    delete process.env.WORKSHOP2_FACTORY_ERP_BASE_URL;
    delete process.env.WORKSHOP2_NESTING_API_URL;
    mockErpState.mockReset();
    mockErpSync.mockReset();
  });

  describe('demo dossier bootstrap', () => {
    it('demo-ss27-01/02 recognized and build non-empty dossier', () => {
      expect(isWorkshop2FileStoreDemoArticle('SS27', { id: 'demo-ss27-01' })).toBe(true);
      expect(isWorkshop2FileStoreDemoArticle('SS27', { id: 'demo-ss27-02' })).toBe(true);
      const d1 = buildWorkshop2FileStoreDemoDossier({
        collectionId: 'SS27',
        articleId: 'demo-ss27-01',
      });
      const d2 = buildWorkshop2FileStoreDemoDossier({
        collectionId: 'SS27',
        articleId: 'demo-ss27-02',
      });
      expect(d1?.assignments.length).toBeGreaterThan(0);
      expect(d2?.assignments.length).toBeGreaterThan(0);
    });

    it('GET dossier auto-seeds demo-ss27-01 → 200 + server_file_persist', async () => {
      const res = await dossierGet(
        new NextRequest('http://localhost/api/workshop2/articles/SS27/demo-ss27-01/dossier', {
          headers: W2_HEADERS,
        }),
        routeCtx('SS27', 'demo-ss27-01')
      );
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.ok).toBe(true);
      expect(json.storeMode).toBe('server_file_persist');
      expect(json.dossier.assignments.length).toBeGreaterThan(0);
    });

    it('hub batch readiness finds both demo articles', async () => {
      const req = new NextRequest('http://localhost/api/workshop2/articles/dossiers/batch', {
        method: 'POST',
        headers: W2_HEADERS,
        body: JSON.stringify({
          items: [
            { collectionId: 'SS27', articleId: 'demo-ss27-01' },
            { collectionId: 'SS27', articleId: 'demo-ss27-02' },
          ],
        }),
      });
      const res = await batchPost(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.postgres).toBe(false);
      expect(json.items).toHaveLength(2);
      expect(json.items.every((i: { found: boolean }) => i.found)).toBe(true);
    });
  });

  describe('sample-order gate file mode honesty', () => {
    it('handoff-readiness GET → 200 for demo-ss27-01', async () => {
      const res = await handoffGet(
        new NextRequest(
          'http://localhost/api/workshop2/articles/SS27/demo-ss27-01/handoff-readiness',
          { headers: W2_HEADERS }
        ),
        routeCtx('SS27', 'demo-ss27-01')
      );
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.ok).toBe(true);
      expect(typeof json.allowed).toBe('boolean');
      expect(Array.isArray(json.checks)).toBe(true);
    });

    it('sample-order POST includes filePersistOnly honesty fields', async () => {
      await getWorkshop2ServerDossierRecord('SS27', 'demo-ss27-01');
      const req = new NextRequest(
        'http://localhost/api/workshop2/articles/SS27/demo-ss27-01/sample-order',
        {
          method: 'POST',
          headers: W2_HEADERS,
          body: JSON.stringify({ quantity: 1, createdBy: 'Wave P' }),
        }
      );
      const res = await sampleOrderPost(req, routeCtx('SS27', 'demo-ss27-01'));
      expect([201, 409]).toContain(res.status);
      const json = await res.json();
      expect(json.filePersistOnly).toBe(true);
      expect(json.pgPrimary).toBe(false);
      expect(json.storeMode).toBe('server_file_persist');
      if (res.status === 201) {
        expect(json.messageRu).toMatch(/file-store|PG bootstrap/i);
      } else {
        expect(json.messageRu).toMatch(/handoff|заблокирован/i);
      }
    });

    it('buildWorkshop2SampleOrderFileModeHonesty copy', () => {
      const h = buildWorkshop2SampleOrderFileModeHonesty({
        storeMode: 'server_file_persist',
        allowed: true,
      });
      expect(h.filePersistOnly).toBe(true);
      expect(h.successMessageRu).toMatch(/file-store/i);
    });
  });

  describe('live ceilings (real code, no mock expansion)', () => {
    it('ERP GET not_configured → structured checks', async () => {
      mockErpState.mockResolvedValue({
        syncStatus: 'not_configured',
        baseUrlConfigured: false,
        collectionId: 'SS27',
        articleId: 'demo-ss27-01',
      });
      const res = await erpGet(
        new NextRequest('http://localhost/api/workshop2/articles/SS27/demo-ss27-01/factory-erp', {
          headers: W2_HEADERS,
        }),
        routeCtx('SS27', 'demo-ss27-01')
      );
      const json = await res.json();
      expect(json.checks.baseUrlConfigured).toBe(false);
      expect(json.checks.erpOrderIdPresent).toBe(false);
      expect(json.messageRu).toMatch(/WORKSHOP2_FACTORY_ERP_BASE_URL/);
    });

    it('ERP POST not_configured → 503 + checks', async () => {
      mockErpSync.mockResolvedValue({
        syncStatus: 'not_configured',
        baseUrlConfigured: false,
      } as never);
      const res = await erpPost(
        new NextRequest('http://localhost/api/workshop2/articles/SS27/demo-ss27-01/factory-erp', {
          method: 'POST',
          headers: W2_HEADERS,
          body: '{}',
        }),
        routeCtx('SS27', 'demo-ss27-01')
      );
      expect(res.status).toBe(503);
      const json = await res.json();
      expect(json.checks.livePostAttempted).toBe(false);
    });

    it('PLM webhook schema validation + journal persist to file store', async () => {
      const bad = validateWorkshop2PlmWebhookPayload({ collectionId: 'SS27' });
      expect(bad.ok).toBe(false);

      await getWorkshop2ServerDossierRecord('SS27', 'demo-ss27-01');
      const req = new NextRequest('http://localhost/api/workshop2/plm/webhook-receipt', {
        method: 'POST',
        headers: W2_HEADERS,
        body: JSON.stringify({
          collectionId: 'SS27',
          articleId: 'demo-ss27-01',
          eventId: 'evt-wave-p',
          payload: { source: 'plm-partner' },
        }),
      });
      const res = await plmWebhookPost(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.partnerAckRecorded).toBe(false);
      expect(json.storeMode).toBe('server_file_persist');
      expect(
        json.mirror?.journal?.some((j: { event: string }) => j.event === 'webhook_receipt')
      ).toBe(true);
    });

    it('nesting production requires URL — fail-closed', async () => {
      const prev = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      expect(isWorkshop2NestingProductionMode()).toBe(true);

      await getWorkshop2ServerDossierRecord('SS27', 'demo-ss27-02');
      const req = new NextRequest(
        'http://localhost/api/workshop2/articles/SS27/demo-ss27-02/nesting/simulate',
        {
          method: 'POST',
          headers: W2_HEADERS,
          body: JSON.stringify({ sampleOrderId: 'so-p-nest', nesting: { fabricWidthCm: 150 } }),
        }
      );
      const res = await nestingPost(req, routeCtx('SS27', 'demo-ss27-02'));
      const json = await res.json();
      expect(json.messageRu).toMatch(/NESTING_API_URL|heuristic/i);
      process.env.NODE_ENV = prev;
    });
  });

  describe('inspector PG-first read path', () => {
    it('resolveWorkshop2InspectorReadPath blocks LS when pgPrimary', () => {
      const out = resolveWorkshop2InspectorReadPath({ pgEnabled: true, report: null });
      expect(out.pgPrimary).toBe(true);
      expect(out.allowLocalStorageFallback).toBe(false);
    });

    it('GET inspector-report returns readPath metadata', async () => {
      const res = await inspectorGet(
        new NextRequest(
          'http://localhost/api/workshop2/articles/SS27/demo-ss27-01/inspector-report/ord-p-1',
          { headers: W2_HEADERS }
        ),
        {
          params: Promise.resolve({
            collectionId: 'SS27',
            articleId: 'demo-ss27-01',
            orderId: 'ord-p-1',
          }),
        }
      );
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.readPath.pgPrimary).toBe(false);
      expect(json.readPath.allowLocalStorageFallback).toBe(true);
    });

    it('readPath hintRu present when PG off', async () => {
      const res = await inspectorGet(
        new NextRequest(
          'http://localhost/api/workshop2/articles/SS27/demo-ss27-01/inspector-report/ord-p-2',
          { headers: W2_HEADERS }
        ),
        {
          params: Promise.resolve({
            collectionId: 'SS27',
            articleId: 'demo-ss27-01',
            orderId: 'ord-p-2',
          }),
        }
      );
      const json = await res.json();
      expect(json.readPath.hintRu).toMatch(/PG|offline|file-store/i);
    });
  });

  describe('w2pane navigation (all SS27 tabs)', () => {
    const panes = [
      'overview',
      'tz',
      'supply',
      'fit',
      'plan',
      'release',
      'qc',
      'stock',
      'vault',
      'documents',
      'sample',
      'nesting',
    ] as const;

    it.each(panes)('parseWorkshop2ArticlePaneParam(%s) valid', (pane) => {
      const parsed = parseWorkshop2ArticlePaneParam(pane);
      expect(parsed).not.toBeNull();
      if (pane === 'documents') {
        expect(parsed).toBe('vault');
      }
      if (pane === 'sample' || pane === 'nesting') {
        expect(parsed).toBe('plan');
      }
    });

    it('legacy sample/nesting deep-link scroll hashes', () => {
      expect(resolveWorkshop2ArticlePaneScrollHash('sample')).toBe('w2article-section-plan-po');
      expect(resolveWorkshop2ArticlePaneScrollHash('nesting')).toBe('w2article-section-plan-nest');
    });
  });

  describe('Wave Q — TZ export + handoff gates (file mode)', () => {
    it('GET export-tz-bundle on demo-ss27-01 returns gate or zip (not 404/500)', async () => {
      await getWorkshop2ServerDossierRecord('SS27', 'demo-ss27-01');
      const res = await tzExportGet(
        new NextRequest(
          'http://localhost/api/workshop2/articles/SS27/demo-ss27-01/export-tz-bundle',
          { headers: W2_HEADERS }
        ),
        routeCtx('SS27', 'demo-ss27-01')
      );
      expect([200, 409]).toContain(res.status);
      if (res.status === 409) {
        const json = await res.json();
        expect(json.error).toBe('export_tz_bundle_blocked');
        expect(Array.isArray(json.checks)).toBe(true);
      } else {
        expect(res.headers.get('content-type')).toMatch(/zip|octet-stream/i);
      }
    });

    it('evaluateWorkshop2TzExportBundleGate on demo dossier returns structured checks', async () => {
      const record = await getWorkshop2ServerDossierRecord('SS27', 'demo-ss27-01');
      expect(record).toBeTruthy();
      const gate = evaluateWorkshop2TzExportBundleGate({
        dossier: record!.dossier,
        collectionId: 'SS27',
        articleId: 'demo-ss27-01',
      });
      expect(typeof gate.allowed).toBe('boolean');
      expect(Array.isArray(gate.checks)).toBe(true);
    });

    it('GET handoff-pdf gate on demo-ss27-01 → 200 or 409 with checks', async () => {
      const res = await handoffPdfGet(
        new NextRequest('http://localhost/api/workshop2/articles/SS27/demo-ss27-01/handoff-pdf', {
          headers: W2_HEADERS,
        }),
        routeCtx('SS27', 'demo-ss27-01')
      );
      expect([200, 409]).toContain(res.status);
      const json = await res.json();
      if (res.status === 409) {
        expect(json.error).toBe('handoff_pdf_blocked');
        expect(Array.isArray(json.checks)).toBe(true);
      } else {
        expect(json.ok).toBe(true);
        expect(json.allowed).toBe(true);
      }
    });

    it('factory handoff commit gate on demo dossier returns readiness checks', async () => {
      const record = await getWorkshop2ServerDossierRecord('SS27', 'demo-ss27-01');
      const gate = evaluateWorkshop2FactoryHandoffCommitGate({
        dossier: record!.dossier,
        vaultFileCount: 0,
      });
      expect(typeof gate.allowed).toBe('boolean');
      expect(gate.readiness.checks.length).toBeGreaterThan(0);
    });

    it('handoff PDF export gate on empty dossier is blocked', () => {
      const gate = evaluateWorkshop2HandoffPdfExportGate({
        dossier: emptyWorkshop2DossierPhase1(),
        categoryLeaf: null,
      });
      expect(gate.allowed).toBe(false);
    });
  });

  describe('Wave Q — BOM↔supply sync honesty (file persist)', () => {
    it('sync + mirror persist supplyBomSyncAt on file-store', () => {
      const dossier = {
        ...emptyWorkshop2DossierPhase1(),
        productionModel: {
          version: 1 as const,
          nodes: [{ id: 'body', label: 'Корпус', status: 'draft' as const }],
          materialLines: [
            {
              id: 'ml-q',
              nodeId: 'body',
              materialName: 'Wave Q cotton',
              role: 'main' as const,
              isPrimary: true,
            },
          ],
          trimLines: [],
          measurements: [],
        },
      };
      const synced = syncWorkshop2SupplyLinesFromDossierBom({ dossier, supply: { lines: [] } });
      const next = persistWorkshop2SupplyBundleMirrorToDossier(dossier, {
        supply: synced.supply,
        supplyBomSyncAt: synced.supplyBomSyncAt,
      });
      expect(next.supplyBundleMirror?.supplyBomSyncAt).toBe(synced.supplyBomSyncAt);
      const honesty = buildWorkshop2SupplyBomSyncHonesty({
        dossier: next,
        storeMode: 'server_file_persist',
        supplyBomSyncAt: synced.supplyBomSyncAt,
      });
      expect(honesty.filePersistOnly).toBe(true);
      expect(honesty.supplyBomSyncAt).toBeTruthy();
      expect(honesty.messageRu).toMatch(/file-store|синхронизирован/i);
    });
  });

  describe('Wave Q — ERP dossier mirror on live POST success', () => {
    beforeEach(() => {
      clearWorkshop2FactoryErpMemoryForTests();
      process.env.WORKSHOP2_FACTORY_ERP_BASE_URL = 'http://127.0.0.1:18766';
    });

    afterEach(() => {
      delete process.env.WORKSHOP2_FACTORY_ERP_BASE_URL;
      clearWorkshop2FactoryErpMemoryForTests();
    });

    it('ERP POST synced → dossierMirror with erpOrderId (mocked sync)', async () => {
      await getWorkshop2ServerDossierRecord('SS27', 'demo-ss27-01');
      mockErpSync.mockResolvedValue({
        syncStatus: 'synced',
        baseUrlConfigured: true,
        erpOrderId: 'ERP-WAVE-Q-001',
        collectionId: 'SS27',
        articleId: 'demo-ss27-01',
      });

      const res = await erpPost(
        new NextRequest('http://localhost/api/workshop2/articles/SS27/demo-ss27-01/factory-erp', {
          method: 'POST',
          headers: W2_HEADERS,
          body: '{}',
        }),
        routeCtx('SS27', 'demo-ss27-01')
      );
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.checks.erpOrderIdPresent).toBe(true);
      expect(json.dossierMirror?.erpOrderId).toBe('ERP-WAVE-Q-001');
      expect(json.dossierMirror?.factoryErpSync?.erpOrderId).toBe('ERP-WAVE-Q-001');
      expect(json.filePersistOnly).toBe(true);
    });
  });

  describe('Wave Q — WMS file-mode reserve honesty', () => {
    it('503 when internal WMS disabled includes honesty fields', async () => {
      delete process.env.WORKSHOP2_INTERNAL_WMS;
      const res = await wmsReservePost(
        new NextRequest(
          'http://localhost/api/workshop2/articles/SS27/demo-ss27-01/wms/reserve-sample',
          { method: 'POST', headers: W2_HEADERS, body: '{}' }
        ),
        routeCtx('SS27', 'demo-ss27-01')
      );
      expect(res.status).toBe(503);
      const json = await res.json();
      expect(json.error).toBe('internal_wms_disabled');
      expect(json.wmsSyncStatus).toBe('disabled');
      expect(json.messageRu).toMatch(/WORKSHOP2_INTERNAL_WMS|503/i);
    });

    it('buildWorkshop2WmsFileModeHonesty memory simulation copy', () => {
      const honesty = buildWorkshop2WmsFileModeHonesty({
        storeMode: 'server_file_persist',
        internalWmsEnabled: true,
        reserveOk: true,
        mirror: {
          mirroredAt: new Date().toISOString(),
          itemCount: 2,
          onHandQty: 10,
          reservedQty: 3,
          movementCount: 1,
          reserveDeficitCount: 0,
          wmsSyncStatus: 'memory_fallback',
          locationCode: 'WORKSHOP2-WH',
        },
      });
      expect(honesty.filePersistOnly).toBe(true);
      expect(honesty.wmsSyncStatus).toBe('memory_fallback');
      expect(honesty.messageRu).toMatch(/memory simulation|file-store/i);
    });
  });

  describe('Wave Q — create article from hub (local inventory persist)', () => {
    it('applyWorkshop2ArticleCommit returns newArticleId for new SKU', () => {
      const inv = {
        v: 1 as const,
        articlesByCollection: { SS27: [] },
        userCollections: [],
        archivedUserCollections: [],
        collectionCovers: {},
        archivedSystemCollectionIds: [],
      };
      const r = applyWorkshop2ArticleCommit(
        inv,
        'SS27',
        {
          kind: 'new',
          sku: 'WAVE-Q-001',
          categoryLeafId: 'catalog-apparel-g0-l0',
          audienceId: 'women',
          isUnisex: false,
          name: 'Wave Q test article',
        },
        'Wave Q'
      );
      expect(r.ok).toBe(true);
      expect(r.newArticleId).toBeTruthy();
    });
  });
});

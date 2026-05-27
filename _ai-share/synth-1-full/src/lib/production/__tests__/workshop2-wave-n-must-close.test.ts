/** @jest-environment node */

/**
 * Wave N — file-store honesty, integration 503 messages, chunk guard, (w2-enterprise) audit.
 */

import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
  evaluateWorkshop2DossierSaveHonesty,
  isWorkshop2FilePersistStoreMode,
  workshop2DossierStoreModeMessageRu,
} from '@/lib/production/workshop2-dossier-store-mode';
import {
  formatWorkshop2PersistToastDescription,
  formatWorkshop2PersistToastTitle,
} from '@/lib/production/workshop2-persist-toast-messages';
import { evaluateWorkshop2DppRegistryWriteHonesty } from '@/lib/production/workshop2-dpp-registry-write-honesty';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import { POST as erpPost } from '@/app/api/workshop2/articles/[collectionId]/[articleId]/factory-erp/route';
import { POST as nestingPost } from '@/app/api/workshop2/articles/[collectionId]/[articleId]/nesting/simulate/route';
import { POST as dppPost } from '@/app/api/workshop2/articles/[collectionId]/[articleId]/dpp/registry-staging/route';
import { POST as plmWebhookPost } from '@/app/api/workshop2/plm/webhook-receipt/route';

jest.mock('@/lib/server/workshop2-phase1-dossier-server-store', () => ({
  getWorkshop2ServerDossierRecord: jest.fn(),
  putWorkshop2ServerDossierRecord: jest.fn(),
  getWorkshop2ServerDossierStoreMode: jest.fn(() => 'server_file_persist'),
}));

jest.mock('@/lib/server/workshop2-factory-erp-repository', () => ({
  runWorkshop2FactoryErpSync: jest.fn(),
  getWorkshop2FactoryErpState: jest.fn(),
}));

import {
  getWorkshop2ServerDossierRecord,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';
import { runWorkshop2FactoryErpSync } from '@/lib/server/workshop2-factory-erp-repository';

const W2_APP = path.join(process.cwd(), 'src/app/brand/production/workshop2');
const W2_ENTERPRISE = path.join(W2_APP, '(w2-enterprise)');

function listTsxTsFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listTsxTsFiles(full));
    else if (/\.(tsx?|jsx?)$/.test(entry.name)) out.push(full);
  }
  return out;
}

describe('workshop2 wave-n — must close', () => {
  const mockGetRecord = getWorkshop2ServerDossierRecord as jest.MockedFunction<
    typeof getWorkshop2ServerDossierRecord
  >;
  const mockPutRecord = putWorkshop2ServerDossierRecord as jest.MockedFunction<
    typeof putWorkshop2ServerDossierRecord
  >;
  const mockErpSync = runWorkshop2FactoryErpSync as jest.MockedFunction<
    typeof runWorkshop2FactoryErpSync
  >;

  beforeEach(() => {
    mockGetRecord.mockReset();
    mockPutRecord.mockReset();
    mockErpSync.mockReset();
    process.env.WORKSHOP2_TRUST_ACTOR_HEADERS = '1';
  });

  describe('file-store fallback honesty (#8)', () => {
    it('server_file_persist → not silent success', () => {
      const out = evaluateWorkshop2DossierSaveHonesty({
        apiOk: true,
        storeMode: 'server_file_persist',
      });
      expect(out.ok).toBe(true);
      expect(out.filePersistOnly).toBe(true);
      expect(out.pgPrimary).toBe(false);
      expect(out.silentSuccess).toBe(false);
      expect(out.toastTitleRu).toMatch(/Файловый сервер/);
    });

    it('server_postgres → pgPrimary', () => {
      const out = evaluateWorkshop2DossierSaveHonesty({
        apiOk: true,
        storeMode: 'server_postgres',
      });
      expect(out.pgPrimary).toBe(true);
      expect(out.filePersistOnly).toBe(false);
    });

    it('persist toast title differs for file_persist', () => {
      expect(
        formatWorkshop2PersistToastTitle({
          scopeLabelRu: 'Снабжение',
          ok: true,
          filePersistOnly: true,
        })
      ).toMatch(/файловый сервер/i);
      expect(
        formatWorkshop2PersistToastDescription({
          mirrorField: 'supplyBundleMirror',
          ok: true,
          filePersistOnly: true,
          messageRu: workshop2DossierStoreModeMessageRu('server_file_persist'),
        })
      ).toMatch(/PostgreSQL недоступен/);
    });

    it('isWorkshop2FilePersistStoreMode helper', () => {
      expect(isWorkshop2FilePersistStoreMode('server_file_persist')).toBe(true);
      expect(isWorkshop2FilePersistStoreMode('server_postgres')).toBe(false);
    });
  });

  describe('integration routes — honest 503 messageRu (#12)', () => {
    it('ERP POST not_configured → 503 + messageRu', async () => {
      mockErpSync.mockResolvedValue({
        syncStatus: 'not_configured',
        baseUrlConfigured: false,
        erpOrderId: undefined,
        lastError: undefined,
      } as never);

      const req = new NextRequest(
        'http://localhost/api/workshop2/articles/SS27/demo-ss27-01/factory-erp',
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-w2-actor-id': 'n-test',
            'x-w2-actor-label': 'Wave N',
            'x-w2-actor-roles': 'production:edit',
          },
          body: JSON.stringify({}),
        }
      );
      const res = await erpPost(req, {
        params: Promise.resolve({ collectionId: 'SS27', articleId: 'demo-ss27-01' }),
      });
      expect(res.status).toBe(503);
      const json = await res.json();
      expect(json.messageRu).toMatch(/WORKSHOP2_FACTORY_ERP_BASE_URL/);
      expect(json.ok).toBe(false);
    });

    it('nesting simulate without URL → messageRu in body', async () => {
      delete process.env.WORKSHOP2_NESTING_API_URL;
      const dossier = emptyWorkshop2DossierPhase1();
      mockGetRecord.mockResolvedValue({
        dossier,
        version: 1,
        collectionId: 'SS27',
        articleId: 'demo-ss27-02',
      });
      mockPutRecord.mockResolvedValue({
        ok: true,
        record: { dossier, version: 2, collectionId: 'SS27', articleId: 'demo-ss27-02' },
      });

      const req = new NextRequest(
        'http://localhost/api/workshop2/articles/SS27/demo-ss27-02/nesting/simulate',
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-w2-actor-id': 'n-test',
            'x-w2-actor-label': 'Wave N',
            'x-w2-actor-roles': 'production:edit',
          },
          body: JSON.stringify({ sampleOrderId: 'so-n-1', nesting: {} }),
        }
      );
      const res = await nestingPost(req, {
        params: Promise.resolve({ collectionId: 'SS27', articleId: 'demo-ss27-02' }),
      });
      const json = await res.json();
      expect(json.messageRu).toMatch(/NESTING_API_URL|heuristic|Nesting/i);
    });

    it('DPP registry staging without live URL → 503 honesty', async () => {
      const dossier = emptyWorkshop2DossierPhase1();
      mockGetRecord.mockResolvedValue({
        dossier,
        version: 1,
        collectionId: 'SS27',
        articleId: 'demo-ss27-01',
      });
      mockPutRecord.mockResolvedValue({
        ok: true,
        record: { dossier, version: 2, collectionId: 'SS27', articleId: 'demo-ss27-01' },
      });

      const honesty = evaluateWorkshop2DppRegistryWriteHonesty({
        dossier,
        collectionId: 'SS27',
        articleId: 'demo-ss27-01',
        env: {},
      });
      expect(honesty.httpStatusHint).toBe(503);
      expect(honesty.messageRu).toMatch(/WORKSHOP2_DPP_REGISTRY_URL/);

      const req = new NextRequest(
        'http://localhost/api/workshop2/articles/SS27/demo-ss27-01/dpp/registry-staging',
        {
          method: 'POST',
          headers: {
            'x-w2-actor-id': 'n-test',
            'x-w2-actor-label': 'Wave N',
            'x-w2-actor-roles': 'production:edit',
          },
        }
      );
      const res = await dppPost(req, {
        params: Promise.resolve({ collectionId: 'SS27', articleId: 'demo-ss27-01' }),
      });
      expect(res.status).toBe(503);
      const json = await res.json();
      expect(json.messageRu).toMatch(/DPP registry|WORKSHOP2_DPP_REGISTRY_URL/);
      expect(json.ok).toBe(false);
    });

    it('PLM webhook receipt → partnerAckRecorded false + noteRu', async () => {
      const dossier = emptyWorkshop2DossierPhase1();
      mockGetRecord.mockResolvedValue({
        dossier,
        version: 1,
        collectionId: 'SS27',
        articleId: 'demo-ss27-01',
      });
      mockPutRecord.mockResolvedValue({
        ok: true,
        record: { dossier, version: 2, collectionId: 'SS27', articleId: 'demo-ss27-01' },
      });

      const req = new NextRequest('http://localhost/api/workshop2/plm/webhook-receipt', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-w2-actor-id': 'n-test',
          'x-w2-actor-label': 'Wave N',
          'x-w2-actor-roles': 'production:edit',
        },
        body: JSON.stringify({
          collectionId: 'SS27',
          articleId: 'demo-ss27-01',
          eventId: 'evt-wave-n',
        }),
      });
      const res = await plmWebhookPost(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.partnerAckRecorded).toBe(false);
      expect(json.noteRu).toMatch(/fail-closed|partnerAck|ACK/i);
    });
  });

  describe('(w2-enterprise) runtime risks (#11)', () => {
    const enterpriseFiles = listTsxTsFiles(W2_ENTERPRISE);

    it('no firebase direct imports in enterprise routes', () => {
      for (const file of enterpriseFiles) {
        const src = fs.readFileSync(file, 'utf8');
        expect(src).not.toMatch(/from ['"]@\/lib\/firebase\/config['"]/);
        expect(src).not.toMatch(/initializeApp\(/);
      }
    });

    it('chunk boundary + prefetch module exists (Wave N #14)', () => {
      const src = fs.readFileSync(
        path.join(
          process.cwd(),
          'src/components/brand/production/workshop2-tab-panel-chunk-boundary.tsx'
        ),
        'utf8'
      );
      expect(src).toMatch(/Workshop2TabPanelChunkBoundary/);
      expect(src).toMatch(/prefetchWorkshop2ArticleTabChunks/);
    });

    it('tab panels use dynamic import for plan/release', () => {
      const src = fs.readFileSync(
        path.join(
          process.cwd(),
          'src/components/brand/production/Workshop2ArticleWorkspaceTabPanels.tsx'
        ),
        'utf8'
      );
      expect(src).toMatch(/dynamic\(/);
      expect(src).toMatch(/Workshop2TabPanelChunkBoundary/);
    });
  });
});

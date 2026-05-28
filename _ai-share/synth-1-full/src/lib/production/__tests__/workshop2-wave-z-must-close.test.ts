/** @jest-environment node */

/**
 * Wave Z — catalog #41–79 wire registries, score_prod honesty, MoySklad 501,
 * vault full-text honesty, demo-ss27-01 E2E critical path (file-store).
 */

import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';
import { initialOrderItems } from '@/lib/order-data';
import { GET as dossierGet } from '@/app/api/workshop2/articles/[collectionId]/[articleId]/dossier/route';
import { POST as sampleOrderPost } from '@/app/api/workshop2/articles/[collectionId]/[articleId]/sample-order/route';
import { GET as exportTzGet } from '@/app/api/workshop2/articles/[collectionId]/[articleId]/export-tz-bundle/route';
import { POST as moySkladImportPost } from '@/app/api/workshop2/articles/[collectionId]/[articleId]/wms/import-moysklad/route';
import {
  verifyWorkshop2CatalogItems41To60Wire,
  WORKSHOP2_CATALOG_ITEMS_41_60_WIRE,
} from '@/lib/production/workshop2-catalog-items-41-60-wire';
import {
  verifyWorkshop2CatalogItems61To79Wire,
  WORKSHOP2_CATALOG_ITEMS_61_79_WIRE,
} from '@/lib/production/workshop2-catalog-items-61-79-wire';
import {
  WORKSHOP2_CATALOG_WIRE_HONESTY,
  assertWorkshop2CatalogWireEntriesAreStructuralOnly,
} from '@/lib/production/workshop2-catalog-wire-score-honesty';
import { WORKSHOP2_CATALOG_ITEMS_1_20_WIRE } from '@/lib/production/workshop2-catalog-items-1-20-wire';
import { WORKSHOP2_CATALOG_ITEMS_21_40_WIRE } from '@/lib/production/workshop2-catalog-items-21-40-wire';
import {
  WORKSHOP2_HUB_ARTICLE_FILTER_ALL,
  filterWorkshop2HubEntries,
} from '@/lib/production/workshop2-hub-filter';
import { summarizeWorkshop2DocumentsIndexStatus } from '@/lib/production/workshop2-documents-index-status';
import { buildWorkshop2CeilingProductionDepthReport } from '@/lib/production/workshop2-production-depth-rating';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import { clearWorkshop2SampleOrdersMemoryForTests } from '@/lib/server/workshop2-sample-order-repository';

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
  ensureWorkshop2PgSchema: jest.fn(),
}));

import { isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';

const ROOT = process.cwd();
const W2_HEADERS = {
  'content-type': 'application/json',
  'x-w2-actor-id': 'wave-z',
  'x-w2-actor-label': 'Wave Z',
  'x-w2-actor-roles': 'production:edit,production:read',
};

function routeCtx(cid: string, aid: string, orderId?: string) {
  return {
    params: Promise.resolve(
      orderId
        ? { collectionId: cid, articleId: aid, orderId }
        : { collectionId: cid, articleId: aid }
    ),
  };
}

describe('workshop2 wave-z must-close', () => {
  beforeEach(() => {
    (isWorkshop2PostgresEnabled as jest.Mock).mockReturnValue(false);
    process.env.WORKSHOP2_TRUST_ACTOR_HEADERS = '1';
    delete process.env.ERP_MOYSKLAD_URL;
    delete process.env.ERP_MOYSKLAD_TOKEN;
    clearWorkshop2SampleOrdersMemoryForTests();
  });

  it('catalog items #41–60 have API + UI wire (no gaps)', () => {
    expect(WORKSHOP2_CATALOG_ITEMS_41_60_WIRE).toHaveLength(20);
    const gaps = verifyWorkshop2CatalogItems41To60Wire();
    expect(gaps).toEqual([]);
  });

  it('catalog items #61–79 have API + UI wire (no gaps)', () => {
    expect(WORKSHOP2_CATALOG_ITEMS_61_79_WIRE).toHaveLength(19);
    const gaps = verifyWorkshop2CatalogItems61To79Wire();
    expect(gaps).toEqual([]);
  });

  it('catalog wire registries are structural-only — do not inflate score_prod', () => {
    expect(WORKSHOP2_CATALOG_WIRE_HONESTY.wireTestsAffectScoreProd).toBe(false);
    expect(
      fs.existsSync(path.join(ROOT, WORKSHOP2_CATALOG_WIRE_HONESTY.scoreProdSourceModule))
    ).toBe(true);
    for (const entries of [
      WORKSHOP2_CATALOG_ITEMS_1_20_WIRE,
      WORKSHOP2_CATALOG_ITEMS_21_40_WIRE,
      WORKSHOP2_CATALOG_ITEMS_41_60_WIRE,
      WORKSHOP2_CATALOG_ITEMS_61_79_WIRE,
    ]) {
      const verdict = assertWorkshop2CatalogWireEntriesAreStructuralOnly(entries);
      expect(verdict.ok).toBe(true);
    }
    const emptyDepth = buildWorkshop2CeilingProductionDepthReport({
      dossier: emptyWorkshop2DossierPhase1(),
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      env: { WORKSHOP2_STAGING_CONTRACT_MODE: 'false', NODE_ENV: 'test' },
    });
    expect(emptyDepth.prodAtOrAbove9).toBeLessThan(6);
  });

  it('MoySklad import returns 501 when not configured (catalog #71 ceiling)', async () => {
    await getWorkshop2ServerDossierRecord('SS27', 'demo-ss27-01');
    const res = await moySkladImportPost(
      new NextRequest(
        'http://localhost/api/workshop2/articles/SS27/demo-ss27-01/wms/import-moysklad',
        { method: 'POST', headers: W2_HEADERS, body: JSON.stringify({ dryRun: true }) }
      ),
      routeCtx('SS27', 'demo-ss27-01')
    );
    expect(res.status).toBe(501);
    const json = await res.json();
    expect(json.error).toBe('moysklad_not_configured');
    expect(json.messageRu).toMatch(/не блокирует заказ образца/i);
  });

  it('vault documents index honestly reports fullTextSearchAvailable=false (#77)', () => {
    const status = summarizeWorkshop2DocumentsIndexStatus({
      collectionId: 'SS27',
      articleUrlSegment: 'demo-ss27-01',
      vaultDocuments: [],
    });
    expect(status.fullTextSearchAvailable).toBe(false);
    const idx = fs.readFileSync(
      path.join(ROOT, 'src/lib/production/workshop2-documents-index-status.ts'),
      'utf8'
    );
    expect(idx).toMatch(/fullTextSearchAvailable:\s*false/);
  });

  it('demo-ss27-01 E2E file-store: hub → workspace dossier → sample-order → export-tz', async () => {
    const ss27Row = initialOrderItems.find((r) => r.id === 'demo-ss27-01');
    expect(ss27Row).toBeDefined();

    const hubEntries = filterWorkshop2HubEntries(
      [
        {
          collectionId: 'SS27',
          collectionName: 'SS27',
          row: {
            id: ss27Row!.id,
            sku: ss27Row!.sku,
            name: ss27Row!.name,
            season: ss27Row!.season,
            workshopTags: ['SS27'],
          },
        },
      ],
      {
        search: 'SS27',
        tagFilter: new Set(),
        articleFilter: WORKSHOP2_HUB_ARTICLE_FILTER_ALL,
        catL1: '',
        catL2: '',
        catL3: '',
      }
    );
    expect(hubEntries).toHaveLength(1);
    expect(hubEntries[0]?.row.id).toBe('demo-ss27-01');

    const workspacePage = fs.readFileSync(
      path.join(
        ROOT,
        'src/app/brand/production/workshop2/(w2-enterprise)/c/[collectionId]/a/[articleId]/page.tsx'
      ),
      'utf8'
    );
    expect(workspacePage).toMatch(/Workshop2ArticleWorkspace/);

    const dossierRes = await dossierGet(
      new NextRequest('http://localhost/api/workshop2/articles/SS27/demo-ss27-01/dossier', {
        headers: W2_HEADERS,
      }),
      routeCtx('SS27', 'demo-ss27-01')
    );
    expect(dossierRes.status).toBe(200);
    const dossierJson = await dossierRes.json();
    expect(dossierJson.ok).toBe(true);
    expect(dossierJson.articleId).toBe('demo-ss27-01');
    expect(dossierJson.dossier).toBeDefined();

    const sampleRes = await sampleOrderPost(
      new NextRequest('http://localhost/api/workshop2/articles/SS27/demo-ss27-01/sample-order', {
        method: 'POST',
        headers: W2_HEADERS,
        body: JSON.stringify({ quantity: 1, createdBy: 'Wave Z E2E' }),
      }),
      routeCtx('SS27', 'demo-ss27-01')
    );
    expect([201, 409]).toContain(sampleRes.status);
    expect(sampleRes.status).not.toBe(500);

    const exportRes = await exportTzGet(
      new NextRequest(
        'http://localhost/api/workshop2/articles/SS27/demo-ss27-01/export-tz-bundle',
        { headers: W2_HEADERS }
      ),
      routeCtx('SS27', 'demo-ss27-01')
    );
    expect([200, 409]).toContain(exportRes.status);
    expect(exportRes.status).not.toBe(500);
    if (exportRes.status === 409) {
      const blocked = await exportRes.json();
      expect(blocked.error).toBe('export_tz_bundle_blocked');
      expect(Array.isArray(blocked.checks)).toBe(true);
    } else {
      expect(exportRes.headers.get('Content-Type')).toMatch(/zip/i);
    }
  });
});

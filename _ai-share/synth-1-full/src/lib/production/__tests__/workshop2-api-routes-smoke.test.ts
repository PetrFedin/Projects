/** @jest-environment node */

/**
 * Wave R/S — smoke всех ключевых /api/workshop2/* на demo-ss27-01 (status ≠ 500).
 */

import { NextRequest } from 'next/server';
import { GET as healthGet } from '@/app/api/workshop2/health/route';
import { GET as integrationProbesGet } from '@/app/api/workshop2/integration-probes/route';
import {
  GET as dossierGet,
  PUT as dossierPut,
} from '@/app/api/workshop2/articles/[collectionId]/[articleId]/dossier/route';
import { GET as handoffReadinessGet } from '@/app/api/workshop2/articles/[collectionId]/[articleId]/handoff-readiness/route';
import {
  GET as sampleOrderGet,
  POST as sampleOrderPost,
} from '@/app/api/workshop2/articles/[collectionId]/[articleId]/sample-order/route';
import {
  GET as factoryErpGet,
  POST as factoryErpPost,
} from '@/app/api/workshop2/articles/[collectionId]/[articleId]/factory-erp/route';
import { GET as wmsBalancesGet } from '@/app/api/workshop2/articles/[collectionId]/[articleId]/wms/balances/route';
import { GET as exportTzGet } from '@/app/api/workshop2/articles/[collectionId]/[articleId]/export-tz-bundle/route';
import { GET as handoffPdfGet } from '@/app/api/workshop2/articles/[collectionId]/[articleId]/handoff-pdf/route';
import { GET as inspectorGet } from '@/app/api/workshop2/articles/[collectionId]/[articleId]/inspector-report/[orderId]/route';
import { GET as vaultGet } from '@/app/api/workshop2/articles/[collectionId]/[articleId]/vault/route';
import {
  GET as purchaseOrdersGet,
  POST as purchaseOrdersPost,
} from '@/app/api/workshop2/articles/[collectionId]/[articleId]/purchase-orders/route';
import { POST as purchaseOrdersSyncPost } from '@/app/api/workshop2/articles/[collectionId]/[articleId]/purchase-orders/sync-erp/route';
import { POST as grnPost } from '@/app/api/workshop2/articles/[collectionId]/[articleId]/wms/grn-receipt/route';
import { POST as wmsReservePost } from '@/app/api/workshop2/articles/[collectionId]/[articleId]/wms/reserve-sample/route';
import { POST as dppStagingPost } from '@/app/api/workshop2/articles/[collectionId]/[articleId]/dpp/registry-staging/route';
import { POST as sustainabilityStagingPost } from '@/app/api/workshop2/articles/[collectionId]/[articleId]/sustainability/lca-staging/route';
import { POST as nestingSimulatePost } from '@/app/api/workshop2/articles/[collectionId]/[articleId]/nesting/simulate/route';
import { GET as eventsGet } from '@/app/api/workshop2/articles/[collectionId]/[articleId]/events/route';
import { GET as suppliersGet } from '@/app/api/workshop2/references/suppliers/route';
import {
  GET as sampleMaterialGet,
  POST as sampleMaterialPost,
} from '@/app/api/workshop2/articles/[collectionId]/[articleId]/sample-material-request/route';
import { GET as skuAvailabilityGet } from '@/app/api/workshop2/articles/sku-availability/route';
import { POST as factoryErpStagingPost } from '@/app/api/workshop2/articles/[collectionId]/[articleId]/factory-erp/staging/route';
import { GET as referencesStatusGet } from '@/app/api/workshop2/references/status/route';
import { GET as plmOutboxStatusGet } from '@/app/api/workshop2/plm-outbox/status/route';
import { POST as batchPost } from '@/app/api/workshop2/articles/dossiers/batch/route';

jest.mock('@/lib/server/workshop2-pg-pool', () => ({
  isWorkshop2PostgresEnabled: jest.fn(() => false),
  getWorkshop2PgPool: jest.fn(),
}));

jest.mock('@/lib/server/workshop2-dossier-repository', () => ({
  listWorkshop2VaultDocumentsFromPg: jest.fn(async () => []),
  ensureWorkshop2PgSchema: jest.fn(),
}));

jest.mock('@/lib/server/workshop2-sample-order-repository', () => ({
  listWorkshop2SampleOrders: jest.fn(async () => []),
  isWorkshop2SampleOrderMemoryStoreAllowed: jest.fn(() => true),
  createWorkshop2SampleOrder: jest.fn(async (input: Record<string, unknown>) => ({
    id: 'so-smoke-1',
    status: 'draft',
    movementStatus: 'pending',
    movementLog: [],
    createdAt: new Date().toISOString(),
    ...input,
  })),
}));

jest.mock('@/lib/server/workshop2-factory-erp-repository', () => ({
  getWorkshop2FactoryErpState: jest.fn(async () => ({
    syncStatus: 'not_configured',
    baseUrlConfigured: false,
    collectionId: 'SS27',
    articleId: 'demo-ss27-01',
  })),
  resolveWorkshop2FactoryErpBaseUrl: jest.fn(() => ''),
  runWorkshop2FactoryErpSync: jest.fn(async () => ({
    syncStatus: 'not_configured',
    baseUrlConfigured: false,
  })),
}));

const CID = 'SS27';
const AID = 'demo-ss27-01';
const W2_HEADERS = {
  'content-type': 'application/json',
  'x-w2-actor-id': 'wave-r-smoke',
  'x-w2-actor-label': 'Wave R Smoke',
  'x-w2-actor-roles': 'production:edit,production:read',
};

function articleCtx(orderId?: string) {
  return {
    params: Promise.resolve(
      orderId
        ? { collectionId: CID, articleId: AID, orderId }
        : { collectionId: CID, articleId: AID }
    ),
  };
}

type SmokeCase = {
  name: string;
  run: () => Promise<Response>;
  allowed: number[];
};

describe('workshop2 API routes smoke (Wave R/S, demo-ss27-01)', () => {
  beforeEach(() => {
    process.env.WORKSHOP2_TRUST_ACTOR_HEADERS = '1';
    delete process.env.WORKSHOP2_INTERNAL_WMS;
    delete process.env.WORKSHOP2_FACTORY_ERP_BASE_URL;
  });

  const cases: SmokeCase[] = [
    {
      name: 'GET /health',
      run: () => healthGet(new NextRequest('http://localhost/api/workshop2/health')),
      allowed: [200],
    },
    {
      name: 'GET /integration-probes',
      run: () =>
        integrationProbesGet(
          new NextRequest('http://localhost/api/workshop2/integration-probes', {
            headers: W2_HEADERS,
          })
        ),
      allowed: [200],
    },
    {
      name: 'GET /articles/.../dossier',
      run: () =>
        dossierGet(
          new NextRequest(`http://localhost/api/workshop2/articles/${CID}/${AID}/dossier`, {
            headers: W2_HEADERS,
          }),
          articleCtx()
        ),
      allowed: [200],
    },
    {
      name: 'GET /handoff-readiness',
      run: () =>
        handoffReadinessGet(
          new NextRequest(
            `http://localhost/api/workshop2/articles/${CID}/${AID}/handoff-readiness`,
            { headers: W2_HEADERS }
          ),
          articleCtx()
        ),
      allowed: [200],
    },
    {
      name: 'GET /sample-order',
      run: () =>
        sampleOrderGet(
          new NextRequest(`http://localhost/api/workshop2/articles/${CID}/${AID}/sample-order`, {
            headers: W2_HEADERS,
          }),
          articleCtx()
        ),
      allowed: [200],
    },
    {
      name: 'POST /sample-order',
      run: () =>
        sampleOrderPost(
          new NextRequest(`http://localhost/api/workshop2/articles/${CID}/${AID}/sample-order`, {
            method: 'POST',
            headers: W2_HEADERS,
            body: JSON.stringify({ quantity: 1 }),
          }),
          articleCtx()
        ),
      allowed: [201, 409],
    },
    {
      name: 'GET /factory-erp',
      run: () =>
        factoryErpGet(
          new NextRequest(`http://localhost/api/workshop2/articles/${CID}/${AID}/factory-erp`, {
            headers: W2_HEADERS,
          }),
          articleCtx()
        ),
      allowed: [200],
    },
    {
      name: 'GET /wms/balances',
      run: () =>
        wmsBalancesGet(
          new NextRequest(`http://localhost/api/workshop2/articles/${CID}/${AID}/wms/balances`, {
            headers: W2_HEADERS,
          }),
          articleCtx()
        ),
      allowed: [200, 503],
    },
    {
      name: 'GET /export-tz-bundle',
      run: () =>
        exportTzGet(
          new NextRequest(
            `http://localhost/api/workshop2/articles/${CID}/${AID}/export-tz-bundle`,
            { headers: W2_HEADERS }
          ),
          articleCtx()
        ),
      allowed: [200, 409],
    },
    {
      name: 'GET /handoff-pdf',
      run: () =>
        handoffPdfGet(
          new NextRequest(`http://localhost/api/workshop2/articles/${CID}/${AID}/handoff-pdf`, {
            headers: W2_HEADERS,
          }),
          articleCtx()
        ),
      allowed: [200, 409],
    },
    {
      name: 'GET /inspector-report/[orderId]',
      run: () =>
        inspectorGet(
          new NextRequest(
            `http://localhost/api/workshop2/articles/${CID}/${AID}/inspector-report/so-smoke-1`,
            { headers: W2_HEADERS }
          ),
          articleCtx('so-smoke-1')
        ),
      allowed: [200, 404],
    },
    {
      name: 'GET /vault',
      run: () =>
        vaultGet(
          new NextRequest(`http://localhost/api/workshop2/articles/${CID}/${AID}/vault`, {
            headers: W2_HEADERS,
          }),
          articleCtx()
        ),
      allowed: [200, 503],
    },
    {
      name: 'GET /purchase-orders',
      run: () =>
        purchaseOrdersGet(
          new NextRequest(`http://localhost/api/workshop2/articles/${CID}/${AID}/purchase-orders`, {
            headers: W2_HEADERS,
          }),
          articleCtx()
        ),
      allowed: [200],
    },
    {
      name: 'GET /references/status',
      run: () =>
        referencesStatusGet(
          new NextRequest('http://localhost/api/workshop2/references/status', {
            headers: W2_HEADERS,
          })
        ),
      allowed: [200],
    },
    {
      name: 'GET /plm-outbox/status',
      run: () =>
        plmOutboxStatusGet(
          new NextRequest('http://localhost/api/workshop2/plm-outbox/status', {
            headers: W2_HEADERS,
          })
        ),
      allowed: [200, 503],
    },
    {
      name: 'POST /articles/dossiers/batch',
      run: () =>
        batchPost(
          new NextRequest('http://localhost/api/workshop2/articles/dossiers/batch', {
            method: 'POST',
            headers: W2_HEADERS,
            body: JSON.stringify({ items: [{ collectionId: CID, articleId: AID }] }),
          })
        ),
      allowed: [200],
    },
    {
      name: 'GET /events',
      run: () =>
        eventsGet(
          new NextRequest(`http://localhost/api/workshop2/articles/${CID}/${AID}/events?limit=5`, {
            headers: W2_HEADERS,
          }),
          articleCtx()
        ),
      allowed: [200],
    },
    {
      name: 'GET /references/suppliers',
      run: () =>
        suppliersGet(
          new NextRequest('http://localhost/api/workshop2/references/suppliers', {
            headers: W2_HEADERS,
          })
        ),
      allowed: [200],
    },
    {
      name: 'GET /sample-material-request',
      run: () =>
        sampleMaterialGet(
          new NextRequest(
            `http://localhost/api/workshop2/articles/${CID}/${AID}/sample-material-request`,
            { headers: W2_HEADERS }
          ),
          articleCtx()
        ),
      allowed: [200],
    },
    {
      name: 'POST /sample-material-request',
      run: () =>
        sampleMaterialPost(
          new NextRequest(
            `http://localhost/api/workshop2/articles/${CID}/${AID}/sample-material-request`,
            {
              method: 'POST',
              headers: W2_HEADERS,
              body: JSON.stringify({ lines: [] }),
            }
          ),
          articleCtx()
        ),
      allowed: [200, 201, 400, 409],
    },
    {
      name: 'GET /articles/sku-availability',
      run: () =>
        skuAvailabilityGet(
          new NextRequest(
            `http://localhost/api/workshop2/articles/sku-availability?collectionId=${CID}&articleId=${AID}`,
            { headers: W2_HEADERS }
          )
        ),
      allowed: [200, 400],
    },
    {
      name: 'POST /wms/grn-receipt',
      run: () =>
        grnPost(
          new NextRequest(`http://localhost/api/workshop2/articles/${CID}/${AID}/wms/grn-receipt`, {
            method: 'POST',
            headers: W2_HEADERS,
            body: JSON.stringify({ supplyLineId: 'line-smoke', qty: 1 }),
          }),
          articleCtx()
        ),
      allowed: [200, 400, 503],
    },
    {
      name: 'POST /wms/reserve-sample',
      run: () =>
        wmsReservePost(
          new NextRequest(
            `http://localhost/api/workshop2/articles/${CID}/${AID}/wms/reserve-sample`,
            { method: 'POST', headers: W2_HEADERS, body: '{}' }
          ),
          articleCtx()
        ),
      allowed: [200, 400, 503],
    },
    {
      name: 'POST /dpp/registry-staging',
      run: () =>
        dppStagingPost(
          new NextRequest(
            `http://localhost/api/workshop2/articles/${CID}/${AID}/dpp/registry-staging`,
            { method: 'POST', headers: W2_HEADERS }
          ),
          articleCtx()
        ),
      allowed: [200, 409, 503],
    },
    {
      name: 'POST /sustainability/lca-staging',
      run: () =>
        sustainabilityStagingPost(
          new NextRequest(
            `http://localhost/api/workshop2/articles/${CID}/${AID}/sustainability/lca-staging`,
            { method: 'POST', headers: W2_HEADERS }
          ),
          articleCtx()
        ),
      allowed: [200, 409, 503],
    },
    {
      name: 'POST /nesting/simulate',
      run: () =>
        nestingSimulatePost(
          new NextRequest(
            `http://localhost/api/workshop2/articles/${CID}/${AID}/nesting/simulate`,
            {
              method: 'POST',
              headers: W2_HEADERS,
              body: JSON.stringify({ sampleOrderId: 'so-smoke-nest', nesting: {} }),
            }
          ),
          articleCtx()
        ),
      allowed: [200, 400, 409, 502, 503],
    },
    {
      name: 'POST /purchase-orders/sync-erp',
      run: () =>
        purchaseOrdersSyncPost(
          new NextRequest(
            `http://localhost/api/workshop2/articles/${CID}/${AID}/purchase-orders/sync-erp`,
            { method: 'POST', headers: W2_HEADERS, body: '{}' }
          ),
          articleCtx()
        ),
      allowed: [200],
    },
    {
      name: 'POST /purchase-orders',
      run: () =>
        purchaseOrdersPost(
          new NextRequest(`http://localhost/api/workshop2/articles/${CID}/${AID}/purchase-orders`, {
            method: 'POST',
            headers: W2_HEADERS,
            body: JSON.stringify({ source: 'requisitions' }),
          }),
          articleCtx()
        ),
      allowed: [200, 201, 400, 409],
    },
    {
      name: 'POST /factory-erp',
      run: () =>
        factoryErpPost(
          new NextRequest(`http://localhost/api/workshop2/articles/${CID}/${AID}/factory-erp`, {
            method: 'POST',
            headers: W2_HEADERS,
            body: '{}',
          }),
          articleCtx()
        ),
      allowed: [200, 400, 503],
    },
    {
      name: 'POST /factory-erp/staging',
      run: () =>
        factoryErpStagingPost(
          new NextRequest(
            `http://localhost/api/workshop2/articles/${CID}/${AID}/factory-erp/staging`,
            { method: 'POST', headers: W2_HEADERS }
          ),
          articleCtx()
        ),
      allowed: [200, 409, 503],
    },
  ];

  it.each(cases.map((c) => [c.name, c]))('%s — not 500', async (_name, c) => {
    const res = await c.run();
    expect(res.status).not.toBe(500);
    expect(c.allowed).toContain(res.status);
  });

  it('PUT dossier without body → 400 (not 500)', async () => {
    await dossierGet(
      new NextRequest(`http://localhost/api/workshop2/articles/${CID}/${AID}/dossier`, {
        headers: W2_HEADERS,
      }),
      articleCtx()
    );
    const res = await dossierPut(
      new NextRequest(`http://localhost/api/workshop2/articles/${CID}/${AID}/dossier`, {
        method: 'PUT',
        headers: W2_HEADERS,
        body: 'not-json',
      }),
      articleCtx()
    );
    expect(res.status).not.toBe(500);
    expect([400, 415]).toContain(res.status);
  });
});

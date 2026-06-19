/** @jest-environment node */

/**
 * Wave X — catalog #1–20 wire, smart routing gate UI, sustainability/DPP honesty,
 * WMS memory journal round-trip, dev auth bypass, smoke script, lca-staging 503.
 */

import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';
import { POST as lcaStagingPost } from '@/app/api/workshop2/articles/[collectionId]/[articleId]/sustainability/lca-staging/route';
import { POST as wmsReservePost } from '@/app/api/workshop2/articles/[collectionId]/[articleId]/wms/reserve-sample/route';
import { POST as movementPost } from '@/app/api/workshop2/articles/[collectionId]/[articleId]/sample-order/[orderId]/movement/route';
import {
  verifyWorkshop2CatalogItems1To20Wire,
  WORKSHOP2_CATALOG_ITEMS_1_20_WIRE,
} from '@/lib/production/workshop2-catalog-items-1-20-wire';
import {
  collectWorkshop2SmartRoutingGateChecks,
  workshop2SmartRoutingGateBlocked,
} from '@/lib/production/workshop2-smart-routing-gate-checks';
import {
  summarizeWorkshop2CarbonRollupPersistHonesty,
  evaluateWorkshop2CarbonRollupPersistHonestyGate,
} from '@/lib/production/workshop2-sustainability-carbon-rollup-honesty';
import { appendWorkshop2InternalWmsMemoryJournal } from '@/lib/production/workshop2-internal-wms-memory-journal';
import { buildWorkshop2DevBypassRequestHeaders } from '@/lib/server/workshop2-dev-auth-bypass';
import { workshop2DevBypassAuthEnabled } from '@/lib/server/workshop2-api-auth';
import { buildWorkshop2FileStoreDemoDossier } from '@/lib/production/workshop2-file-store-demo-bootstrap';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import { persistWorkshop2ArticleSkuValidationMirrorToDossier } from '@/lib/production/workshop2-article-sku-validation-persist';
import {
  getWorkshop2ServerDossierRecord,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';
import { createWorkshop2SampleOrder } from '@/lib/server/workshop2-sample-order-repository';
import { ensureWorkshop2ProductionModel } from '@/lib/production/workshop2-production-model-from-dossier';
import { resetWorkshop2WmsMemoryForTests } from '@/lib/server/workshop2-wms-repository';

const ROOT = path.join(process.cwd(), 'src/components/brand/production');

const W2_HEADERS = {
  'content-type': 'application/json',
  'x-w2-actor-id': 'wave-x',
  'x-w2-actor-label': 'Wave X',
  'x-w2-actor-roles': 'production:edit,production:read',
};

function routeCtx(cid: string, aid: string, orderId?: string) {
  return orderId
    ? { params: Promise.resolve({ collectionId: cid, articleId: aid, orderId }) }
    : { params: Promise.resolve({ collectionId: cid, articleId: aid }) };
}

describe('workshop2 wave-x must-close', () => {
  const prevEnv = { ...process.env };

  beforeEach(() => {
    process.env.WORKSHOP2_TRUST_ACTOR_HEADERS = '1';
    delete process.env.WORKSHOP2_LCA_API_URL;
    delete process.env.WORKSHOP2_DATABASE_URL;
    resetWorkshop2WmsMemoryForTests();
  });

  afterEach(() => {
    process.env = { ...prevEnv };
    resetWorkshop2WmsMemoryForTests();
  });

  it('catalog items #1–20 have API + UI wire (no gaps)', () => {
    expect(WORKSHOP2_CATALOG_ITEMS_1_20_WIRE).toHaveLength(20);
    const gaps = verifyWorkshop2CatalogItems1To20Wire();
    expect(gaps).toEqual([]);
  });

  it('create dialog wires skuAvailabilityResult into commit (catalog #12)', () => {
    const dlg = fs.readFileSync(path.join(ROOT, 'Workshop2CreateArticleDialog.tsx'), 'utf8');
    expect(dlg).toMatch(/skuAvailabilityResult/);
    const provider = fs.readFileSync(
      path.join(
        process.cwd(),
        'src/app/brand/production/workshop2/workshop2-local-state-provider.tsx'
      ),
      'utf8'
    );
    expect(provider).toMatch(/persistWorkshop2ArticleSkuValidationMirrorToDossier/);
    const dossier = persistWorkshop2ArticleSkuValidationMirrorToDossier(
      emptyWorkshop2DossierPhase1(),
      {
        sku: 'SS27-TEST',
        result: { available: true, source: 'pg_disabled' },
      }
    );
    expect(dossier.articleSkuValidationMirror?.sku).toBe('SS27-TEST');
  });

  it('smart routing demo_template blocked in production + gate checks UI', () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    delete process.env.WORKSHOP2_SMART_ROUTING_DEMO;
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      smartRoutingFromDemo: true,
      smartRoutingSequence: [{ id: '1', category: 'M', name: 'Op', equipment: 'M', sash: 1 }],
    };
    const checks = collectWorkshop2SmartRoutingGateChecks({ dossier });
    expect(workshop2SmartRoutingGateBlocked(checks)).toBe(true);
    process.env.NODE_ENV = prev;
    const panel = fs.readFileSync(path.join(ROOT, 'Workshop2SmartRoutingPanel.tsx'), 'utf8');
    expect(panel).toMatch(/workshop2-smart-routing-gate-checks/);
    expect(panel).toMatch(/collectWorkshop2SmartRoutingGateChecks/);
    expect(panel).toMatch(/isWorkshop2SmartRoutingDemoAllowed/);
    expect(panel).toMatch(/Workshop2GateChecksBlock/);
    // Regression: bare `testId = …` after component caused ReferenceError at module eval.
    expect(panel).not.toMatch(/\}\s*\n\s*testId\s*=/);
  });

  it('carbon rollup persist honesty warns when not in PG mirror', () => {
    const dossier = buildWorkshop2FileStoreDemoDossier({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
    })!;
    const honesty = summarizeWorkshop2CarbonRollupPersistHonesty({
      dossier,
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
    });
    expect(honesty.computed).toBe(true);
    if (!dossier.sustainabilityCarbonRollupMirror) {
      expect(honesty.persisted).toBe(false);
      expect(honesty.hintRu).toMatch(/PG|persist/i);
    }
    const gate = evaluateWorkshop2CarbonRollupPersistHonestyGate({
      dossier,
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
    });
    if (!dossier.sustainabilityCarbonRollupMirror) {
      expect(gate?.id).toBe('sustainability.carbon.not_persisted');
    }
    const sust = fs.readFileSync(path.join(ROOT, 'Workshop2SustainabilityPanel.tsx'), 'utf8');
    expect(sust).toMatch(/summarizeWorkshop2CarbonRollupPersistHonesty/);
  });

  it('LCA staging API returns 503 when registry URL not configured (UI parity)', async () => {
    await getWorkshop2ServerDossierRecord('SS27', 'demo-ss27-01');
    const res = await lcaStagingPost(
      new NextRequest(
        'http://localhost/api/workshop2/articles/SS27/demo-ss27-01/sustainability/lca-staging',
        { method: 'POST', headers: W2_HEADERS, body: '{}' }
      ),
      routeCtx('SS27', 'demo-ss27-01')
    );
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.messageRu).toMatch(/LCA|WORKSHOP2_LCA|registry|staging/i);
    const sust = fs.readFileSync(path.join(ROOT, 'Workshop2SustainabilityPanel.tsx'), 'utf8');
    expect(sust).toMatch(/json\.messageRu/);
  });

  it('WMS reserve/release memory journal round-trip in file-store', async () => {
    process.env.WORKSHOP2_INTERNAL_WMS = 'true';
    await getWorkshop2ServerDossierRecord('SS27', 'demo-ss27-01');
    const record = await getWorkshop2ServerDossierRecord('SS27', 'demo-ss27-01');
    expect(record).not.toBeNull();
    const model = ensureWorkshop2ProductionModel(record!.dossier);
    model.materialLines.push({
      id: 'mat-x',
      nodeId: 'body',
      role: 'main',
      materialName: 'Хлопок Wave X',
      yieldPerUnit: 2,
      yieldUnit: 'м',
      isPrimary: true,
    });
    await putWorkshop2ServerDossierRecord({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      dossier: { ...record!.dossier, productionModel: model },
      updatedBy: 'wave-x',
      txMeta: { eventType: 'workshop2_wms_test_seed' },
    });

    const order = await createWorkshop2SampleOrder({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      status: 'sent',
      movementStatus: 'in_transit',
    });

    const reserve = await wmsReservePost(
      new NextRequest(
        'http://localhost/api/workshop2/articles/SS27/demo-ss27-01/wms/reserve-sample',
        {
          method: 'POST',
          headers: W2_HEADERS,
          body: JSON.stringify({ sampleOrderId: order.id }),
        }
      ),
      routeCtx('SS27', 'demo-ss27-01')
    );
    expect(reserve.status).toBe(200);
    const reserveJson = await reserve.json();
    expect(reserveJson.wmsSyncStatus).toBe('memory_fallback');

    const afterReserve = await getWorkshop2ServerDossierRecord('SS27', 'demo-ss27-01');
    expect(
      afterReserve?.dossier.internalWmsMirror?.memoryJournal?.some((e) => e.kind === 'reserve')
    ).toBe(true);

    const move = await movementPost(
      new NextRequest(
        `http://localhost/api/workshop2/articles/SS27/demo-ss27-01/sample-order/${order.id}/movement`,
        {
          method: 'POST',
          headers: W2_HEADERS,
          body: JSON.stringify({ target: 'received', strictIntake: false }),
        }
      ),
      routeCtx('SS27', 'demo-ss27-01', order.id)
    );
    expect(move.status).toBe(200);
    const moveJson = await move.json();
    expect(moveJson.wmsRelease?.filePersistOnly).toBe(true);

    const afterRelease = await getWorkshop2ServerDossierRecord('SS27', 'demo-ss27-01');
    const journal = afterRelease?.dossier.internalWmsMirror?.memoryJournal ?? [];
    expect(journal.some((e) => e.kind === 'reserve')).toBe(true);
    expect(journal.some((e) => e.kind === 'release')).toBe(true);
  });

  it('appendWorkshop2InternalWmsMemoryJournal caps at 24 entries', () => {
    let dossier = emptyWorkshop2DossierPhase1();
    for (let i = 0; i < 30; i++) {
      dossier = appendWorkshop2InternalWmsMemoryJournal(dossier, {
        kind: 'sync',
        messageRu: `entry-${i}`,
      });
    }
    expect(dossier.internalWmsMirror?.memoryJournal?.length).toBeLessThanOrEqual(24);
  });

  it('dev auth bypass middleware injects actor headers (never production)', () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    process.env.WORKSHOP2_DEV_BYPASS_AUTH = 'true';
    expect(workshop2DevBypassAuthEnabled()).toBe(true);
    const req = new NextRequest('http://localhost/api/workshop2/health');
    const headers = buildWorkshop2DevBypassRequestHeaders(req);
    expect(headers?.get('x-w2-actor-id')).toBe('dev-bypass');
    process.env.NODE_ENV = 'production';
    expect(buildWorkshop2DevBypassRequestHeaders(req)).toBeNull();
    process.env.NODE_ENV = prev;
    const mw = fs.readFileSync(path.join(process.cwd(), 'src/middleware.ts'), 'utf8');
    expect(mw).toMatch(/buildWorkshop2DevBypassRequestHeaders/);
  });

  it('smoke script covers critical curls with exit codes', () => {
    const smoke = fs.readFileSync(
      path.join(process.cwd(), 'scripts/workshop2-smoke-test.sh'),
      'utf8'
    );
    for (const route of [
      '\\$\\{API\\}/health',
      '\\$\\{API\\}/references/status',
      '/dossier',
      '/events',
      '/handoff-readiness',
      '/sample-order',
      '/wms/reserve-sample',
    ]) {
      expect(smoke).toMatch(new RegExp(route));
    }
    expect(smoke).toMatch(/SMOKE_FAIL/);
    expect(smoke).toMatch(/curl_step/);
  });
});

/** @jest-environment node */

/**
 * Wave L — WMS reserve/release API contract (memory path; PG migration when DATABASE_URL set).
 */
import { NextRequest } from 'next/server';
import {
  resetWorkshop2WmsMemoryForTests,
  upsertWorkshop2WmsItem,
  recordWorkshop2WmsMovement,
} from '@/lib/server/workshop2-wms-repository';
import { releaseWorkshop2WmsOnMovementReceived } from '@/lib/server/workshop2-internal-wms-server';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import { ensureWorkshop2ProductionModel } from '@/lib/production/workshop2-production-model-from-dossier';
import { POST as reserveSamplePost } from '@/app/api/workshop2/articles/[collectionId]/[articleId]/wms/reserve-sample/route';

jest.mock('@/lib/server/workshop2-phase1-dossier-server-store', () => ({
  getWorkshop2ServerDossierRecord: jest.fn(),
  putWorkshop2ServerDossierRecord: jest.fn(),
  getWorkshop2ServerDossierStoreMode: jest.fn(() => 'server_file_persist'),
}));

import {
  getWorkshop2ServerDossierRecord,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';

const mockGetRecord = getWorkshop2ServerDossierRecord as jest.MockedFunction<
  typeof getWorkshop2ServerDossierRecord
>;
const mockPutRecord = putWorkshop2ServerDossierRecord as jest.MockedFunction<
  typeof putWorkshop2ServerDossierRecord
>;

describe('workshop2 WMS API contract (Wave L)', () => {
  const prevEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...prevEnv,
      WORKSHOP2_INTERNAL_WMS: 'true',
      WORKSHOP2_TRUST_ACTOR_HEADERS: '1',
    };
    delete process.env.WORKSHOP2_DATABASE_URL;
    resetWorkshop2WmsMemoryForTests();
    mockGetRecord.mockReset();
    mockPutRecord.mockReset();
  });

  afterAll(() => {
    process.env = prevEnv;
    resetWorkshop2WmsMemoryForTests();
  });

  it('reserve-sample route: 503 when internal WMS disabled', async () => {
    delete process.env.WORKSHOP2_INTERNAL_WMS;
    const req = new NextRequest(
      'http://localhost/api/workshop2/articles/SS27/demo/wms/reserve-sample',
      {
        method: 'POST',
        headers: {
          'x-w2-actor-id': 'test',
          'x-w2-actor-label': 'WMS Test',
          'x-w2-actor-roles': 'production:edit',
        },
        body: JSON.stringify({ sampleOrderId: 'so-1' }),
      }
    );
    const res = await reserveSamplePost(req, {
      params: Promise.resolve({ collectionId: 'SS27', articleId: 'demo' }),
    });
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.error).toBe('internal_wms_disabled');
    expect(json.wmsSyncStatus).toBe('disabled');
    expect(json.messageRu).toMatch(/WORKSHOP2_INTERNAL_WMS|503/i);
  });

  it('reserve-sample route: 200 contract with balances + warningDeficit', async () => {
    const dossier = emptyWorkshop2DossierPhase1();
    const model = ensureWorkshop2ProductionModel(dossier);
    model.materialLines.push({
      id: 'm-api',
      nodeId: 'body',
      role: 'main',
      materialName: 'API cotton',
      yieldPerUnit: 5,
      yieldUnit: 'м',
      isPrimary: true,
    });
    dossier.productionModel = model;

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

    const req = new NextRequest(
      'http://localhost/api/workshop2/articles/SS27/demo-ss27-01/wms/reserve-sample',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-w2-actor-id': 'wms-test',
          'x-w2-actor-label': 'WMS Test',
          'x-w2-actor-roles': 'production:edit',
        },
        body: JSON.stringify({ sampleOrderId: 'so-api-1', actor: 'wms-test' }),
      }
    );

    const res = await reserveSamplePost(req, {
      params: Promise.resolve({ collectionId: 'SS27', articleId: 'demo-ss27-01' }),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.reservedLines).toBeGreaterThan(0);
    expect(typeof json.warningDeficit).toBe('boolean');
    expect(Array.isArray(json.balances)).toBe(true);
    expect(json.mirror?.wmsSyncStatus).toBeTruthy();
    expect(json.filePersistOnly).toBe(true);
    expect(json.messageRu).toMatch(/memory simulation|file-store|WMS/i);
  });

  it('release path: idempotent releaseWorkshop2WmsOnMovementReceived', async () => {
    const item = await upsertWorkshop2WmsItem({
      collectionId: 'SS27',
      sku: 'rel-api',
      label: 'Release API',
      unit: 'шт',
    });
    await recordWorkshop2WmsMovement({
      collectionId: 'SS27',
      articleId: 'demo-ss27-02',
      kind: 'reserve',
      qty: 2,
      itemId: item.id,
      actor: 'test',
      note: 'sample-order:so-rel-api',
    });

    const first = await releaseWorkshop2WmsOnMovementReceived({
      collectionId: 'SS27',
      articleId: 'demo-ss27-02',
      sampleOrderId: 'so-rel-api',
    });
    expect(first.ok).toBe(true);
    expect(first.releasedLines).toBeGreaterThan(0);

    const second = await releaseWorkshop2WmsOnMovementReceived({
      collectionId: 'SS27',
      articleId: 'demo-ss27-02',
      sampleOrderId: 'so-rel-api',
    });
    expect(second.releasedLines).toBe(0);
  });
});

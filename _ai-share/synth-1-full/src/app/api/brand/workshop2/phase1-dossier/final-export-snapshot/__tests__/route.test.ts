/**
 * @jest-environment node
 */
import { GET, POST } from '@/app/api/brand/workshop2/phase1-dossier/final-export-snapshot/route';
import {
  __clearWorkshop2ServerDossierStoreForTests,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';

describe('POST /api/brand/workshop2/phase1-dossier/final-export-snapshot', () => {
  beforeEach(async () => {
    await __clearWorkshop2ServerDossierStoreForTests();
  });

  it('creates immutable export snapshot and stores it in dossier', async () => {
    await putWorkshop2ServerDossierRecord({
      collectionId: 'c1',
      articleId: 'a1',
      dossier: { assignments: [] } as never,
    });
    const req = new Request(
      'http://localhost/api/brand/workshop2/phase1-dossier/final-export-snapshot',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          collectionId: 'c1',
          articleId: 'a1',
          actorLabel: 'Export Bot',
        }),
      }
    );
    const res = await POST(req as never);
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      ok: boolean;
      snapshotId?: string;
      dossier?: { finalExportSnapshots?: Array<{ snapshotId?: string }> };
    };
    expect(json.ok).toBe(true);
    expect(typeof json.snapshotId).toBe('string');
    expect(json.dossier?.finalExportSnapshots?.[0]?.snapshotId).toBe(json.snapshotId);
  });

  it('lists snapshot metas via GET', async () => {
    await putWorkshop2ServerDossierRecord({
      collectionId: 'c1',
      articleId: 'a1',
      dossier: { assignments: [] } as never,
    });
    const postReq = new Request(
      'http://localhost/api/brand/workshop2/phase1-dossier/final-export-snapshot',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          collectionId: 'c1',
          articleId: 'a1',
          actorLabel: 'Export Bot',
        }),
      }
    );
    await POST(postReq as never);
    const getReq = new Request(
      'http://localhost/api/brand/workshop2/phase1-dossier/final-export-snapshot?collectionId=c1&articleId=a1&limit=5'
    );
    const res = await GET(getReq as never);
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      ok: boolean;
      snapshots?: Array<{ snapshotId?: string; createdBy?: string }>;
    };
    expect(json.ok).toBe(true);
    expect(json.snapshots?.length).toBeGreaterThan(0);
    expect(typeof json.snapshots?.[0]?.snapshotId).toBe('string');
    expect(json.snapshots?.[0]?.createdBy).toBe('Export Bot');
  });
});

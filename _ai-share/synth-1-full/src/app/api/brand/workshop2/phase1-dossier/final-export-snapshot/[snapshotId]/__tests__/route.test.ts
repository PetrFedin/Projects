/**
 * @jest-environment node
 */
import { POST as createSnapshot } from '@/app/api/brand/workshop2/phase1-dossier/final-export-snapshot/route';
import { GET as getOne } from '@/app/api/brand/workshop2/phase1-dossier/final-export-snapshot/[snapshotId]/route';
import {
  __clearWorkshop2ServerDossierStoreForTests,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';

describe('GET /api/brand/workshop2/phase1-dossier/final-export-snapshot/[snapshotId]', () => {
  beforeEach(async () => {
    await __clearWorkshop2ServerDossierStoreForTests();
  });

  it('returns one snapshot meta by id', async () => {
    await putWorkshop2ServerDossierRecord({
      collectionId: 'c1',
      articleId: 'a1',
      dossier: { assignments: [] } as never,
    });
    const createPost = new Request(
      'http://localhost/api/brand/workshop2/phase1-dossier/final-export-snapshot',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ collectionId: 'c1', articleId: 'a1', actorLabel: 'Export Bot' }),
      }
    );
    const postRes = await createSnapshot(createPost as never);
    const postJson = (await postRes.json()) as { snapshotId: string };

    const req = new Request(
      `http://localhost/api/brand/workshop2/phase1-dossier/final-export-snapshot/${postJson.snapshotId}?collectionId=c1&articleId=a1`
    );
    const res = await getOne(req as never, {
      params: Promise.resolve({ snapshotId: postJson.snapshotId }),
    });
    expect(res.status).toBe(200);
    const json = (await res.json()) as { ok: boolean; snapshot?: { snapshotId?: string } };
    expect(json.ok).toBe(true);
    expect(json.snapshot?.snapshotId).toBe(postJson.snapshotId);
  });
});

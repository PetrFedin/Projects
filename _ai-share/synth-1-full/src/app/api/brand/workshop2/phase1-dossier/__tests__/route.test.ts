/**
 * @jest-environment node
 */
import { GET, POST } from '@/app/api/brand/workshop2/phase1-dossier/route';
import {
  __clearWorkshop2ServerDossierStoreForTests,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';

describe('/api/brand/workshop2/phase1-dossier', () => {
  beforeEach(async () => {
    await __clearWorkshop2ServerDossierStoreForTests();
  });

  it('GET returns 400 when ids are omitted', async () => {
    const res = await GET(
      new Request('http://localhost/api/brand/workshop2/phase1-dossier') as never
    );
    expect(res.status).toBe(400);
    const json = (await res.json()) as { error: string };
    expect(json.error).toContain('Missing');
  });

  it('POST upserts dossier via query params', async () => {
    const req = new Request(
      'http://localhost/api/brand/workshop2/phase1-dossier?collectionId=c1&articleId=a1',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ assignments: [] }),
      }
    );
    const res = await POST(req as never);
    expect(res.status).toBe(200);
    const json = (await res.json()) as { success: boolean };
    expect(json.success).toBe(true);
  });

  it('POST rejects invalid payload', async () => {
    const req = new Request(
      'http://localhost/api/brand/workshop2/phase1-dossier?collectionId=c1&articleId=a1',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ noAssignments: true }),
      }
    );
    const res = await POST(req as never);
    expect(res.status).toBe(400);
    const json = (await res.json()) as { error: string };
    expect(json.error).toBe('Invalid dossier payload');
  });

  it('GET returns saved server dossier by ids', async () => {
    await putWorkshop2ServerDossierRecord({
      collectionId: 'c2',
      articleId: 'a2',
      dossier: { assignments: [] } as never,
    });

    const getRes = await GET(
      new Request(
        'http://localhost/api/brand/workshop2/phase1-dossier?collectionId=c2&articleId=a2'
      ) as never
    );
    expect(getRes.status).toBe(200);
    const json = (await getRes.json()) as { assignments?: unknown[] };
    expect(Array.isArray(json.assignments)).toBe(true);
  });

  it('POST returns version conflict via store on optimistic lock mismatch', async () => {
    await putWorkshop2ServerDossierRecord({
      collectionId: 'c3',
      articleId: 'a3',
      dossier: { assignments: [] } as never,
    });

    const result = await putWorkshop2ServerDossierRecord({
      collectionId: 'c3',
      articleId: 'a3',
      baseVersion: 0,
      dossier: { assignments: [] } as never,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('version_conflict');
      expect(result.currentVersion).toBe(1);
    }
  });
});

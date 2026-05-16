/**
 * @jest-environment node
 */
import { GET, POST, PUT } from '@/app/api/brand/workshop2/phase1-dossier/route';
import { __clearWorkshop2ServerDossierStoreForTests } from '@/lib/server/workshop2-phase1-dossier-server-store';

describe('/api/brand/workshop2/phase1-dossier', () => {
  beforeEach(async () => {
    await __clearWorkshop2ServerDossierStoreForTests();
  });

  it('GET returns read contract hint when ids are omitted', async () => {
    const res = await GET(new Request('http://localhost/api/brand/workshop2/phase1-dossier') as never);
    expect(res.status).toBe(200);
    const json = (await res.json()) as { mode: string; message: string };
    expect(json.mode).toBe('server_file_persist');
    expect(json.message).toContain('collectionId');
  });

  it('PUT writes dossier and increments version', async () => {
    const req = new Request('http://localhost/api/brand/workshop2/phase1-dossier', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        collectionId: 'c1',
        articleId: 'a1',
        dossier: { assignments: [] },
      }),
    });
    const res = await PUT(req as never);
    expect(res.status).toBe(200);
    const json = (await res.json()) as { ok: boolean; version: number };
    expect(json.ok).toBe(true);
    expect(json.version).toBe(1);

    const req2 = new Request('http://localhost/api/brand/workshop2/phase1-dossier', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        collectionId: 'c1',
        articleId: 'a1',
        baseVersion: 1,
        dossier: { assignments: [] },
      }),
    });
    const res2 = await PUT(req2 as never);
    expect(res2.status).toBe(200);
    const json2 = (await res2.json()) as { version: number };
    expect(json2.version).toBe(2);
  });

  it('POST validates dossier and returns gate/preflight', async () => {
    const req = new Request('http://localhost/api/brand/workshop2/phase1-dossier', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ assignments: [] }),
    });
    const res = await POST(req as never);
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      ok: boolean;
      mode: string;
      gate?: { state?: string; sectionMinimumErrors?: unknown };
      preflight?: { ok?: boolean; issues?: unknown[] };
    };
    expect(json.ok).toBe(true);
    expect(json.mode).toBe('server_validate_only');
    expect(typeof json.gate?.state).toBe('string');
    expect(json.gate?.sectionMinimumErrors).toBeDefined();
    expect(typeof json.preflight?.ok).toBe('boolean');
    expect(Array.isArray(json.preflight?.issues)).toBe(true);
  });

  it('POST rejects invalid payload', async () => {
    const req = new Request('http://localhost/api/brand/workshop2/phase1-dossier', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ noAssignments: true }),
    });
    const res = await POST(req as never);
    expect(res.status).toBe(400);
    const json = (await res.json()) as { error: string };
    expect(json.error).toBe('invalid_dossier_assignments');
  });

  it('GET returns saved server dossier by ids', async () => {
    const putReq = new Request('http://localhost/api/brand/workshop2/phase1-dossier', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        collectionId: 'c2',
        articleId: 'a2',
        dossier: { assignments: [] },
      }),
    });
    await PUT(putReq as never);

    const getRes = await GET(
      new Request(
        'http://localhost/api/brand/workshop2/phase1-dossier?collectionId=c2&articleId=a2'
      ) as never
    );
    expect(getRes.status).toBe(200);
    const json = (await getRes.json()) as { ok: boolean; version: number; dossier?: { assignments?: unknown[] } };
    expect(json.ok).toBe(true);
    expect(json.version).toBe(1);
    expect(Array.isArray(json.dossier?.assignments)).toBe(true);
  });

  it('PUT returns 409 on optimistic lock mismatch', async () => {
    const putReq1 = new Request('http://localhost/api/brand/workshop2/phase1-dossier', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        collectionId: 'c3',
        articleId: 'a3',
        dossier: { assignments: [] },
      }),
    });
    await PUT(putReq1 as never);

    const putReq2 = new Request('http://localhost/api/brand/workshop2/phase1-dossier', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        collectionId: 'c3',
        articleId: 'a3',
        baseVersion: 0,
        dossier: { assignments: [] },
      }),
    });
    const res = await PUT(putReq2 as never);
    expect(res.status).toBe(409);
    const json = (await res.json()) as { error: string; currentVersion: number };
    expect(json.error).toBe('version_conflict');
    expect(json.currentVersion).toBe(1);
  });
});

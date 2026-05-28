/**
 * @jest-environment node
 */
import { GET } from '@/app/api/brand/workshop2/phase1-dossier/versions/route';
import {
  __clearWorkshop2ServerDossierStoreForTests,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';

describe('GET /api/brand/workshop2/phase1-dossier/versions', () => {
  beforeEach(async () => {
    await __clearWorkshop2ServerDossierStoreForTests();
  });

  it('returns version history for dossier', async () => {
    await putWorkshop2ServerDossierRecord({
      collectionId: 'c1',
      articleId: 'a1',
      dossier: { assignments: [], updatedBy: 'U1', updatedAt: '2026-04-28T10:00:00.000Z' } as never,
    });
    await putWorkshop2ServerDossierRecord({
      collectionId: 'c1',
      articleId: 'a1',
      baseVersion: 1,
      dossier: { assignments: [], updatedBy: 'U2', updatedAt: '2026-04-28T10:05:00.000Z' } as never,
      txMeta: {
        eventType: 'dossier_put',
      },
    });
    const req = new Request(
      'http://localhost/api/brand/workshop2/phase1-dossier/versions?collectionId=c1&articleId=a1&limit=10',
      {
        headers: {
          'x-w2-actor-id': 'aud-1',
          'x-w2-actor-label': 'Auditor',
          'x-w2-actor-roles': 'w2:versions_read',
        },
      }
    );
    const res = await GET(req as never);
    expect(res.status).toBe(200);
    const json = (await res.json()) as { ok: boolean; versions?: Array<{ version?: number }> };
    expect(json.ok).toBe(true);
    expect((json.versions ?? []).length).toBeGreaterThan(0);
    expect(json.versions?.[0]?.version).toBe(2);
  });
});

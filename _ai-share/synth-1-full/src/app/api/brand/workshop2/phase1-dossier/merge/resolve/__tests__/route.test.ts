/**
 * @jest-environment node
 */
import { POST } from '@/app/api/brand/workshop2/phase1-dossier/merge/resolve/route';
import {
  __clearWorkshop2ServerDossierStoreForTests,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';

describe('POST /api/brand/workshop2/phase1-dossier/merge/resolve', () => {
  beforeEach(async () => {
    await __clearWorkshop2ServerDossierStoreForTests();
  });

  it('applies explicit field resolutions and returns manual merge report', async () => {
    await putWorkshop2ServerDossierRecord({
      collectionId: 'c1',
      articleId: 'a1',
      dossier: { assignments: [], collaborationMergeNote: 'server' } as never,
    });
    const req = new Request('http://localhost/api/brand/workshop2/phase1-dossier/merge/resolve', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        collectionId: 'c1',
        articleId: 'a1',
        actorLabel: 'QA Resolver',
        localDossier: { assignments: [], collaborationMergeNote: 'local' },
        resolutions: { collaborationMergeNote: 'local' },
      }),
    });
    const res = await POST(req as never);
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      ok: boolean;
      dossier?: { collaborationMergeNote?: string };
      mergeReport?: { mode?: string; resolvedBy?: string };
    };
    expect(json.ok).toBe(true);
    expect(json.dossier?.collaborationMergeNote).toBe('local');
    expect(json.mergeReport?.mode).toBe('manual');
    expect(json.mergeReport?.resolvedBy).toBe('QA Resolver');
  });
});

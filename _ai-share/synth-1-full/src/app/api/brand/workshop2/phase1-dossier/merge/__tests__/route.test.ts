/**
 * @jest-environment node
 */
import { POST } from '@/app/api/brand/workshop2/phase1-dossier/merge/route';
import {
  __clearWorkshop2ServerDossierStoreForTests,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';

describe('POST /api/brand/workshop2/phase1-dossier/merge', () => {
  beforeEach(async () => {
    await __clearWorkshop2ServerDossierStoreForTests();
  });

  it('merges local dossier into server version and bumps version', async () => {
    await putWorkshop2ServerDossierRecord({
      collectionId: 'c1',
      articleId: 'a1',
      dossier: { assignments: [], collaborationMergeNote: 'server' } as never,
    });
    const req = new Request('http://localhost/api/brand/workshop2/phase1-dossier/merge', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        collectionId: 'c1',
        articleId: 'a1',
        localDossier: { assignments: [], collaborationMergeNote: 'local' },
      }),
    });
    const res = await POST(req as never);
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      ok: boolean;
      version: number;
      dossier?: { collaborationMergeNote?: string };
    };
    expect(json.ok).toBe(true);
    expect(json.version).toBe(2);
    expect(json.dossier?.collaborationMergeNote).toBe('local');
  });

  it('returns merge report with manual review for critical conflicts', async () => {
    await putWorkshop2ServerDossierRecord({
      collectionId: 'c2',
      articleId: 'a2',
      dossier: {
        assignments: [],
        tzSignatoryBindings: { designerDisplayLabel: 'Server' },
      } as never,
    });
    const req = new Request('http://localhost/api/brand/workshop2/phase1-dossier/merge', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        collectionId: 'c2',
        articleId: 'a2',
        localDossier: { assignments: [], tzSignatoryBindings: { designerDisplayLabel: 'Local' } },
      }),
    });
    const res = await POST(req as never);
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      ok: boolean;
      mergeReport?: { manualReviewRequired?: boolean; criticalConflicts?: string[] };
    };
    expect(json.ok).toBe(true);
    expect(json.mergeReport?.manualReviewRequired).toBe(true);
    expect(json.mergeReport?.criticalConflicts).toContain('tzSignatoryBindings');
  });
});

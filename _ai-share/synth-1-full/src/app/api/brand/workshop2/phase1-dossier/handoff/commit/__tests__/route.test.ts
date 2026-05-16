/**
 * @jest-environment node
 */
jest.mock('@/lib/production/workshop2-tz-gates', () => ({
  buildWorkshop2TzGateSnapshot: () => ({
    sectionMinimumErrors: { material: [], construction: [] },
  }),
}));
jest.mock('@/lib/production/workshop2-tz-trace', () => ({
  buildWorkshop2TzPreflightReport: () => ({ ok: true, issues: [] }),
}));

import { POST } from '@/app/api/brand/workshop2/phase1-dossier/handoff/commit/route';
import {
  __clearWorkshop2ServerDossierStoreForTests,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';

describe('POST /api/brand/workshop2/phase1-dossier/handoff/commit', () => {
  beforeEach(async () => {
    await __clearWorkshop2ServerDossierStoreForTests();
  });

  it('commits handoff row atomically on server', async () => {
    await putWorkshop2ServerDossierRecord({
      collectionId: 'c1',
      articleId: 'a1',
      dossier: {
        assignments: [],
        techPackAttachments: [{ attachmentId: 'att-1', fileName: 'A.pdf' }],
      } as never,
    });
    const req = new Request('http://localhost/api/brand/workshop2/phase1-dossier/handoff/commit', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        collectionId: 'c1',
        articleId: 'a1',
        actorLabel: 'Иван Иванов',
        revisionLabel: 'R1',
        channel: 'zip_download',
        attachmentIds: ['att-1'],
        brandDispatched: { at: '2026-04-28T11:00:00.000Z', by: 'Brand · Иван' },
        factoryReceived: { at: '2026-04-28T11:10:00.000Z', by: 'Factory · Пётр' },
      }),
    });
    const res = await POST(req as never);
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      ok: boolean;
      dossier?: { techPackFactoryHandoffs?: unknown[]; lifecycleState?: string; revisions?: unknown[] };
    };
    expect(json.ok).toBe(true);
    expect(Array.isArray(json.dossier?.techPackFactoryHandoffs)).toBe(true);
    expect(json.dossier?.techPackFactoryHandoffs?.length).toBe(1);
    expect(json.dossier?.lifecycleState).toBe('sent_to_production');
    expect(Array.isArray(json.dossier?.revisions)).toBe(true);
  });
});

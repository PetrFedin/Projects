/**
 * @jest-environment node
 */
import { GET } from '@/app/api/brand/workshop2/phase1-dossier/events/route';
import {
  __clearWorkshop2ServerDossierStoreForTests,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';
import { buildWorkshop2Ss27MenCoat01FullTzDemoDossier } from '@/lib/production/workshop2-ss27-demo-full-tz-dossier';

describe('GET /api/brand/workshop2/phase1-dossier/events', () => {
  beforeEach(async () => {
    await __clearWorkshop2ServerDossierStoreForTests();
  });

  it('returns audit events for dossier', async () => {
    const seeded = buildWorkshop2Ss27MenCoat01FullTzDemoDossier(null, 'System Seed');
    seeded.tzSignatoryBindings = {
      ...seeded.tzSignatoryBindings,
      designerDisplayLabel: 'Designer A',
      technologistDisplayLabel: 'Tech A',
    };
    seeded.sectionSignoffs = {};
    await putWorkshop2ServerDossierRecord({
      collectionId: 'c1',
      articleId: 'a1',
      dossier: seeded,
    });
    await putWorkshop2ServerDossierRecord({
      collectionId: 'c1',
      articleId: 'a1',
      dossier: {
        ...seeded,
        updatedAt: new Date().toISOString(),
        updatedBy: 'Designer A',
        tzActionLog: [
          {
            entryId: 'ev-1',
            at: new Date().toISOString(),
            by: 'Designer A',
            action: { type: 'section_signoff', section: 'general', role: 'brand', set: true },
          },
        ],
      },
      baseVersion: 1,
      txMeta: {
        eventType: 'section_signoff_commit',
        eventPayload: { actorLabel: 'Designer A', section: 'general', role: 'brand' },
      },
    });

    const req = new Request(
      'http://localhost/api/brand/workshop2/phase1-dossier/events?collectionId=c1&articleId=a1&limit=20',
      {
        headers: {
          'x-w2-actor-id': 'aud-1',
          'x-w2-actor-label': 'Auditor',
          'x-w2-actor-roles': 'w2:events_read',
        },
      }
    );
    const res = await GET(req as never);
    expect(res.status).toBe(200);
    const json = (await res.json()) as { ok: boolean; events?: Array<{ eventType?: string }> };
    expect(json.ok).toBe(true);
    expect((json.events ?? []).length).toBeGreaterThan(0);
  });
});

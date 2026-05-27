/**
 * @jest-environment node
 */
jest.mock('@/lib/production/workshop2-tz-gates', () => ({
  buildWorkshop2TzGateSnapshot: () => ({
    sectionMinimumErrors: { material: [], construction: [] },
  }),
}));

import { POST } from '@/app/api/brand/workshop2/phase1-dossier/tz-global-signoff/commit/route';
import {
  __clearWorkshop2ServerDossierStoreForTests,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';
import { buildWorkshop2Ss27MenCoat01FullTzDemoDossier } from '@/lib/production/workshop2-ss27-demo-full-tz-dossier';

describe('POST /api/brand/workshop2/phase1-dossier/tz-global-signoff/commit', () => {
  beforeEach(async () => {
    await __clearWorkshop2ServerDossierStoreForTests();
  });

  it('commits designer global signoff atomically', async () => {
    const seeded = buildWorkshop2Ss27MenCoat01FullTzDemoDossier(null, 'System Seed');
    await putWorkshop2ServerDossierRecord({
      collectionId: 'c1',
      articleId: 'a1',
      dossier: {
        ...seeded,
        tzSignatoryBindings: {
          designerDisplayLabel: 'Иван Иванов',
          technologistDisplayLabel: 'Тех Техов',
          managerDisplayLabel: 'Менеджер Петров',
        },
      } as never,
    });
    const req = new Request(
      'http://localhost/api/brand/workshop2/phase1-dossier/tz-global-signoff/commit',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          collectionId: 'c1',
          articleId: 'a1',
          articleSku: 'SKU-1',
          rowKey: 'designer',
          signerLabel: 'Иван Иванов',
          signerOrganization: 'Demo Brand',
        }),
      }
    );
    const res = await POST(req as never);
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      ok: boolean;
      dossier?: { designerSignoff?: { by?: string } };
    };
    expect(json.ok).toBe(true);
    expect(json.dossier?.designerSignoff?.by).toBe('Иван Иванов');
  });

  it('rejects technologist signoff when early stages disabled', async () => {
    const seeded = buildWorkshop2Ss27MenCoat01FullTzDemoDossier(null, 'System Seed');
    await putWorkshop2ServerDossierRecord({
      collectionId: 'c2',
      articleId: 'a2',
      dossier: {
        ...seeded,
        tzSignatoryBindings: {
          technologistDisplayLabel: 'Тех Техов',
          technologistSignStages: { tz: false },
        },
      } as never,
    });
    const req = new Request(
      'http://localhost/api/brand/workshop2/phase1-dossier/tz-global-signoff/commit',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          collectionId: 'c2',
          articleId: 'a2',
          articleSku: 'SKU-2',
          rowKey: 'technologist',
          signerLabel: 'Тех Техов',
          signerOrganization: 'Demo Brand',
        }),
      }
    );
    const res = await POST(req as never);
    expect(res.status).toBe(409);
    const json = (await res.json()) as { error: string };
    expect(json.error).toBe('technologist_early_stages_required');
  });
});

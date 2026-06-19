/**
 * @jest-environment node
 */
import { POST } from '@/app/api/brand/workshop2/phase1-dossier/section-signoff/commit/route';
import {
  __clearWorkshop2ServerDossierStoreForTests,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';
import { buildWorkshop2Ss27MenCoat01FullTzDemoDossier } from '@/lib/production/workshop2-ss27-demo-full-tz-dossier';
import { buildWorkshop2TzGateSnapshot } from '@/lib/production/workshop2-tz-gates';

describe('POST /api/brand/workshop2/phase1-dossier/section-signoff/commit', () => {
  beforeEach(async () => {
    await __clearWorkshop2ServerDossierStoreForTests();
  });

  it('commits section signoff atomically on server', async () => {
    const seeded = buildWorkshop2Ss27MenCoat01FullTzDemoDossier(null, 'System Seed');
    const leafId = seeded.categoryLeafId ?? 'catalog-apparel-g0-l0';
    const gate = buildWorkshop2TzGateSnapshot(seeded, { activeCategoryLeafId: leafId });
    const signableSection = (['general', 'material', 'construction'] as const).find(
      (s) => (gate.sectionMinimumErrors[s] ?? []).length === 0
    );
    const section = signableSection ?? 'general';
    await putWorkshop2ServerDossierRecord({
      collectionId: 'c1',
      articleId: 'a1',
      dossier: {
        ...seeded,
        tzSignatoryBindings: {
          designerDisplayLabel: 'Иван Иванов',
          technologistDisplayLabel: 'Тех Техов',
        },
      } as never,
    });
    const req = new Request(
      'http://localhost/api/brand/workshop2/phase1-dossier/section-signoff/commit',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          collectionId: 'c1',
          articleId: 'a1',
          section,
          role: 'brand',
          signerLabel: 'Иван Иванов',
          signerOrganization: 'Demo Brand',
          articleSku: 'SKU-1',
        }),
      }
    );
    const res = await POST(req as never);
    if (!signableSection) {
      expect(res.status).toBe(409);
      const blocked = (await res.json()) as { error?: string };
      expect(blocked.error).toBe('section_gate_blocked');
      return;
    }
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      ok: boolean;
      version: number;
      dossier?: { sectionSignoffs?: any };
    };
    expect(json.ok).toBe(true);
    expect(json.version).toBe(2);
    expect(json.dossier?.sectionSignoffs?.[section]?.brand?.by).toBe('Иван Иванов');
  });

  it('rejects signoff when signer does not match designated assignee', async () => {
    await putWorkshop2ServerDossierRecord({
      collectionId: 'c2',
      articleId: 'a2',
      dossier: {
        assignments: [],
        tzSignatoryBindings: {
          designerDisplayLabel: 'Мария Петрова',
          technologistDisplayLabel: 'Тех Техов',
        },
      } as never,
    });
    const req = new Request(
      'http://localhost/api/brand/workshop2/phase1-dossier/section-signoff/commit',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          collectionId: 'c2',
          articleId: 'a2',
          section: 'general',
          role: 'brand',
          signerLabel: 'Иван Иванов',
          signerOrganization: 'Demo Brand',
          articleSku: 'SKU-2',
        }),
      }
    );
    const res = await POST(req as never);
    expect(res.status).toBe(409);
    const json = (await res.json()) as { error: string };
    expect(json.error).toBe('signer_not_allowed_brand');
  });
});

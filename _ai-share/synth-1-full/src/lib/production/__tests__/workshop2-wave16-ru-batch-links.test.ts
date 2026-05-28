/**
 * Wave 16 RU — batch compliance pack, B2C shop link, credit hold, hub-summary, API errors (+8 tests).
 */
jest.mock('@/lib/production/workshop2-composition-label-pdf-export', () => ({
  buildCompositionLabelDraftPdfBuffer: jest.fn(() => Buffer.from('%PDF-stub')),
  downloadCompositionLabelDraftPdf: jest.fn(),
}));

import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  buildWorkshop2RuCollectionCompliancePackZip,
  WORKSHOP2_RU_COLLECTION_COMPLIANCE_PACK_MAX,
} from '@/lib/server/workshop2-ru-compliance-pack';
import {
  buildWorkshop2B2cShopProductHref,
  resolveWorkshop2B2cProductSlugFromDossier,
} from '@/lib/production/workshop2-b2c-dpp-linkage';
import { evaluateWorkshop2B2bCreditHold } from '@/lib/production/workshop2-b2b-credit-hold';
import {
  buildWorkshop2ErrorRuBody,
  WORKSHOP2_API_ERROR_RU,
} from '@/lib/production/workshop2-api-error-ru';
import { workshop2HubSummaryCacheKey } from '@/lib/production/workshop2-hub-summary';
import { buildWorkshop2Wave16RuBatchLinksProbe } from '@/lib/production/workshop2-live-integration-probes';

describe('workshop2 wave16 — collection compliance pack', () => {
  it('bundles nested per-article zips', async () => {
    const dossier = emptyWorkshop2DossierPhase1();
    dossier.passportProductionBrief = { gtin: '4601234567890' };
    const { buffer, manifest, articleCount } = await buildWorkshop2RuCollectionCompliancePackZip({
      collectionId: 'SS27',
      articles: [
        {
          articleId: 'demo-ss27-01',
          dossier,
          version: 1,
          updatedAt: new Date().toISOString(),
        },
        {
          articleId: 'demo-ss27-02',
          dossier,
          version: 1,
          updatedAt: new Date().toISOString(),
        },
      ],
    });
    expect(buffer.length).toBeGreaterThan(200);
    expect(articleCount).toBe(2);
    expect(manifest.some((m) => m.startsWith('articles/w2-ru-compliance-'))).toBe(true);
  });

  it('exposes honest max 20 limit constant', () => {
    expect(WORKSHOP2_RU_COLLECTION_COMPLIANCE_PACK_MAX).toBe(20);
  });
});

describe('workshop2 wave16 — B2C shop linkage', () => {
  it('builds PDP href from passport slug', () => {
    const dossier = emptyWorkshop2DossierPhase1();
    dossier.passportProductionBrief = { b2cProductSlug: 'ss27-m-coat-01' };
    const slug = resolveWorkshop2B2cProductSlugFromDossier(dossier);
    expect(slug).toBe('ss27-m-coat-01');
    expect(buildWorkshop2B2cShopProductHref(slug!)).toBe('/products/ss27-m-coat-01');
  });
});

describe('workshop2 wave16 — distributor credit hold', () => {
  it('blocks when order exceeds RU-MOW demo limit', () => {
    const prev = process.env.WORKSHOP2_B2B_CREDIT_HOLD;
    process.env.WORKSHOP2_B2B_CREDIT_HOLD = 'true';
    const r = evaluateWorkshop2B2bCreditHold({ territoryId: 'RU-MOW', orderTotalRub: 500_000 });
    expect(r.allowed).toBe(false);
    expect(r.gate?.id).toBe('b2b.credit.exceeded');
    if (prev === undefined) delete process.env.WORKSHOP2_B2B_CREDIT_HOLD;
    else process.env.WORKSHOP2_B2B_CREDIT_HOLD = prev;
  });
});

describe('workshop2 wave16 — API errors RU', () => {
  it('buildWorkshop2ErrorRuBody localizes gate codes', () => {
    const body = buildWorkshop2ErrorRuBody('handoff_not_ready');
    expect(body.messageRu).toMatch(/Handoff/);
    expect(body.error).toBe('handoff_not_ready');
  });

  it('has Russian defaults for common API codes', () => {
    expect(WORKSHOP2_API_ERROR_RU.version_conflict).toMatch(/Конфликт версий/);
    expect(WORKSHOP2_API_ERROR_RU.too_many_articles).toMatch(/лимит/i);
  });
});

describe('workshop2 wave16 — hub-summary memo key', () => {
  it('builds stable cache key per collection + article set', () => {
    const k1 = workshop2HubSummaryCacheKey('SS27', ['b', 'a']);
    const k2 = workshop2HubSummaryCacheKey('SS27', ['a', 'b']);
    expect(k1).toBe(k2);
    expect(k1).toContain('w2-hub-summary:SS27');
  });

  it('wave16 probe exposes 8 batch/link checks', () => {
    const probe = buildWorkshop2Wave16RuBatchLinksProbe({ WORKSHOP2_MARKET: 'ru' });
    expect(probe.checks.length).toBeGreaterThanOrEqual(8);
    expect(probe.checks.some((c) => c.id === 'collection_compliance_pack_zip')).toBe(true);
    expect(probe.checks.some((c) => c.id === 'wave16_ru_batch_links_probe')).toBe(true);
  });
});

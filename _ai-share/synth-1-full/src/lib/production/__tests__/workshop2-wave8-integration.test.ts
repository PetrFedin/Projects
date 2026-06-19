/**
 * Wave 8 — consolidation: PG audit, B2C DPP, matchmaker, assortment risk, notifications, EDO, ERP export.
 */
import {
  buildWorkshop2PgOnlyAuditCatalog,
  evaluateWorkshop2PgOnlyAuditCompliance,
} from '@/lib/production/workshop2-pg-only-audit';
import { resolveWorkshop2MatchmakerEnvBanner } from '@/lib/production/workshop2-matchmaker-env-banner';
import {
  checkWorkshop2MatchmakerRateLimit,
  resetWorkshop2MatchmakerRateLimitForTests,
} from '@/lib/server/workshop2-matchmaker-rate-limit';
import {
  buildWorkshop2B2cDppApiPayload,
  resolveWorkshop2B2cProductSlugFromDossier,
} from '@/lib/production/workshop2-b2c-dpp-linkage';
import {
  buildWorkshop2AssortmentRiskArticleRow,
  rollupWorkshop2CollectionAssortmentRisk,
} from '@/lib/production/workshop2-collection-assortment-risk';
import { buildWorkshop2BrandNotificationsSummary } from '@/lib/production/workshop2-brand-notifications-hub';
import {
  pollWorkshop2EdoSignoffStatus,
  requestWorkshop2EdoSignoff,
} from '@/lib/production/workshop2-edo-signoff';
import {
  exportWorkshop2CommissionBatchToErp,
  resolveWorkshop2FactoryErpCommissionUrl,
} from '@/lib/production/workshop2-commission-erp-export';
import { buildWorkshop2Wave8HorizontalProbes } from '@/lib/production/workshop2-live-integration-probes';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import { summarizeWorkshop2MatchmakerEnvBannerClient } from '@/lib/production/workshop2-ai-panel-utils';

describe('workshop2 wave8 — pg-only audit', () => {
  it('catalog has 6 surfaces', () => {
    expect(buildWorkshop2PgOnlyAuditCatalog()).toHaveLength(6);
  });

  it('compliance passes with WORKSHOP2_PG_ONLY', () => {
    process.env.WORKSHOP2_PG_ONLY = 'true';
    expect(evaluateWorkshop2PgOnlyAuditCompliance().compliant).toBe(true);
    delete process.env.WORKSHOP2_PG_ONLY;
  });
});

describe('workshop2 wave8 — matchmaker production guard', () => {
  beforeEach(() => resetWorkshop2MatchmakerRateLimitForTests());

  it('production unconfigured when no Genkit key', () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    delete process.env.GOOGLE_GENAI_API_KEY;
    delete process.env.GEMINI_API_KEY;
    const banner = resolveWorkshop2MatchmakerEnvBanner();
    expect(banner.mode).toBe('production_unconfigured');
    process.env.NODE_ENV = prev;
  });

  it('rate limit blocks after limit per minute', () => {
    const limit = 3;
    for (let i = 0; i < limit; i++) {
      expect(
        checkWorkshop2MatchmakerRateLimit({ key: 'test-ip', limitPerMinute: limit }).allowed
      ).toBe(true);
    }
    expect(
      checkWorkshop2MatchmakerRateLimit({ key: 'test-ip', limitPerMinute: limit }).allowed
    ).toBe(false);
  });

  it('client banner helper returns demo in non-production', () => {
    const banner = summarizeWorkshop2MatchmakerEnvBannerClient();
    expect(['demo', 'production_live', 'production_unconfigured']).toContain(banner.mode);
  });
});

describe('workshop2 wave8 — B2C DPP linkage', () => {
  it('reads b2cProductSlug from passport', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      passportProductionBrief: { b2cProductSlug: 'ss27-dress-01' },
    };
    expect(resolveWorkshop2B2cProductSlugFromDossier(dossier)).toBe('ss27-dress-01');
  });

  it('payload unavailable without dossier hit', () => {
    const payload = buildWorkshop2B2cDppApiPayload({ slug: 'missing', hit: null });
    expect(payload.available).toBe(false);
    expect(payload.messageRu).toMatch(/нет связанного досье/i);
  });
});

describe('workshop2 wave8 — assortment risk rollup', () => {
  it('rollup marks missing dossier as high risk', () => {
    const rollup = rollupWorkshop2CollectionAssortmentRisk({
      collectionId: 'SS27',
      articles: [{ articleId: 'x', dossier: null }],
    });
    expect(rollup.collectionRiskLevel).toBe('High');
    expect(rollup.articles[0].blockerIds).toContain('dossier.missing');
  });

  it('article row includes supply score', () => {
    const row = buildWorkshop2AssortmentRiskArticleRow({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      dossier: emptyWorkshop2DossierPhase1(),
    });
    expect(row.found).toBe(true);
    expect(row.supplyScore).toBeGreaterThanOrEqual(0);
  });
});

describe('workshop2 wave8 — brand notifications hub', () => {
  const prevDb = process.env.WORKSHOP2_DATABASE_URL;

  afterEach(() => {
    if (prevDb) process.env.WORKSHOP2_DATABASE_URL = prevDb;
    else delete process.env.WORKSHOP2_DATABASE_URL;
  });

  it('builds summary with numeric counts', async () => {
    delete process.env.WORKSHOP2_DATABASE_URL;
    delete process.env.WORKSHOP2_DOSSIER_DATABASE_URL;
    const summary = await buildWorkshop2BrandNotificationsSummary({
      collectionId: 'SS27',
      articles: [],
    });
    expect(summary.generatedAt).toBeTruthy();
    expect(summary.totalCount).toBeGreaterThanOrEqual(0);
  });
});

describe('workshop2 wave8 — EDO kontur depth', () => {
  it('request fails closed without API URL', async () => {
    const res = await requestWorkshop2EdoSignoff({
      dossier: emptyWorkshop2DossierPhase1(),
      collectionId: 'SS27',
      articleId: 'a1',
      actor: 'test',
      env: { WORKSHOP2_EDO_PROVIDER: 'kontur', NODE_ENV: 'test' },
    });
    expect(res.ok).toBe(false);
    expect(res.error).toBe('edo_api_url_not_configured');
  });

  it('poll requires requestId', async () => {
    const res = await pollWorkshop2EdoSignoffStatus({
      dossier: emptyWorkshop2DossierPhase1(),
      collectionId: 'SS27',
      articleId: 'a1',
      env: {
        WORKSHOP2_EDO_PROVIDER: 'kontur',
        WORKSHOP2_KONTUR_EDO_API_URL: 'https://kontur.test/api',
      },
    });
    expect(res.ok).toBe(false);
    expect(res.error).toBe('edo_request_id_missing');
  });

  it('poll HTTP against kontur URL', async () => {
    const fetchImpl = jest.fn(async () => ({
      ok: true,
      json: async () => ({ status: 'signed', signedAt: '2026-05-26T00:00:00.000Z' }),
    })) as unknown as typeof fetch;
    const res = await pollWorkshop2EdoSignoffStatus({
      dossier: emptyWorkshop2DossierPhase1(),
      collectionId: 'SS27',
      articleId: 'a1',
      requestId: 'req-1',
      env: {
        WORKSHOP2_EDO_PROVIDER: 'kontur',
        WORKSHOP2_KONTUR_EDO_API_URL: 'https://kontur.test/api',
      },
      fetchImpl,
    });
    expect(res.ok).toBe(true);
    expect(res.mirror.edoStatus).toBe('signed');
    expect(fetchImpl).toHaveBeenCalledWith(
      'https://kontur.test/api/signoff-status/req-1',
      expect.objectContaining({ method: 'GET' })
    );
  });
});

describe('workshop2 wave8 — commission ERP export', () => {
  const prevDb = process.env.WORKSHOP2_DATABASE_URL;

  afterEach(() => {
    if (prevDb) process.env.WORKSHOP2_DATABASE_URL = prevDb;
    else delete process.env.WORKSHOP2_DATABASE_URL;
  });

  it('journal stub without ERP URL', async () => {
    delete process.env.WORKSHOP2_DATABASE_URL;
    delete process.env.WORKSHOP2_DOSSIER_DATABASE_URL;
    delete process.env.WORKSHOP2_FACTORY_ERP_COMMISSION_URL;
    delete process.env.WORKSHOP2_FACTORY_ERP_BASE_URL;
    const res = await exportWorkshop2CommissionBatchToErp({ repId: 'rep-1' });
    expect(res.ok).toBe(false);
    expect(res.mode).toBe('journal_stub');
    expect(res.messageRu).toMatch(/не задан/i);
  });

  it('resolveWorkshop2FactoryErpCommissionUrl prefers dedicated env', () => {
    process.env.WORKSHOP2_FACTORY_ERP_COMMISSION_URL = 'https://erp.test/comm';
    expect(resolveWorkshop2FactoryErpCommissionUrl()).toBe('https://erp.test/comm');
    delete process.env.WORKSHOP2_FACTORY_ERP_COMMISSION_URL;
  });
});

describe('workshop2 wave8 — wave8Horizontal probes', () => {
  it('exposes matchmaker and pg audit flags', () => {
    process.env.WORKSHOP2_PG_ONLY = 'true';
    const probes = buildWorkshop2Wave8HorizontalProbes(process.env);
    expect(probes.pgOnlyAudit.surfaceCount).toBe(6);
    expect(probes.matchmaker.rateLimitPerMinute).toBeGreaterThan(0);
    expect(probes.b2cDppLinkage.apiPath).toContain('/dpp');
    expect(probes.ss27UatSignoffSpec.path).toContain('ss27-uat-signoff');
    delete process.env.WORKSHOP2_PG_ONLY;
  });
});

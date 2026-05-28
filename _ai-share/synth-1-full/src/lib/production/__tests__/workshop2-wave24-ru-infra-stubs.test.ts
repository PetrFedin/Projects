/**
 * Wave 24 RU infra — ЭДО pilot, ЧЗ prod URL, MES E2E, PG staging (+12 tests).
 */
import fs from 'node:fs';
import path from 'node:path';

import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  evaluateWorkshop2EdoSignoffHandoffGate,
  requestWorkshop2EdoSignoff,
} from '@/lib/production/workshop2-edo-signoff';
import {
  resolveWorkshop2EdoAssignmentCta,
  WORKSHOP2_EDO_PROVIDER_CABINET_URLS,
} from '@/lib/production/workshop2-edo-assignment-cta';
import {
  attemptWorkshop2MarkingHonestSignHttpPost,
  isWorkshop2MarkingApiConfigured,
} from '@/lib/production/workshop2-marking-honest-sign';
import { evaluateWorkshop2RuMarkingSampleOrderGate } from '@/lib/production/workshop2-marking-sample-order-gate';
import { evaluateWorkshop2SampleOrderGate } from '@/lib/production/workshop2-sample-order-gate';
import { buildWorkshop2Wave24RuInfraProbe } from '@/lib/production/workshop2-live-integration-probes';
import { summarizeWorkshop2HubPgOnlyBanner } from '@/lib/production/workshop2-hub-pg-only-policy';
import { evaluateWorkshop2B2bCreditHold } from '@/lib/production/workshop2-b2b-credit-hold';

describe('workshop2 wave24 — edo assignment CTA', () => {
  it('mock mode → Подписать (демо)', () => {
    const cta = resolveWorkshop2EdoAssignmentCta({
      env: { WORKSHOP2_EDO_PROVIDER: 'mock', NODE_ENV: 'development' },
    });
    expect(cta.mode).toBe('mock_demo');
    expect(cta.primaryLabelRu).toBe('Подписать (демо)');
    expect(cta.pollAfterSend).toBe(false);
  });

  it('kontur with URL → Отправить в ЭДО + poll', () => {
    const cta = resolveWorkshop2EdoAssignmentCta({
      env: {
        WORKSHOP2_EDO_PROVIDER: 'kontur',
        WORKSHOP2_KONTUR_DIADOC_URL: 'https://diadoc-api.test',
      },
    });
    expect(cta.mode).toBe('send_edo');
    expect(cta.primaryLabelRu).toBe('Отправить в ЭДО');
    expect(cta.pollAfterSend).toBe(true);
    expect(cta.cabinetUrl).toBe(WORKSHOP2_EDO_PROVIDER_CABINET_URLS.kontur);
  });

  it('mock edo sign unblocks handoff gate', async () => {
    const dossier = emptyWorkshop2DossierPhase1();
    const res = await requestWorkshop2EdoSignoff({
      dossier,
      collectionId: 'SS27',
      articleId: 'demo',
      actor: 'test',
      env: {
        WORKSHOP2_EDO_PROVIDER: 'mock',
        WORKSHOP2_EDO_SIGNOFF_REQUIRED: 'true',
        NODE_ENV: 'development',
      },
    });
    expect(res.ok).toBe(true);
    expect(res.mirror.edoStatus).toBe('signed');
    expect(
      evaluateWorkshop2EdoSignoffHandoffGate(res.dossier, {
        WORKSHOP2_EDO_SIGNOFF_REQUIRED: 'true',
        WORKSHOP2_EDO_PROVIDER: 'mock',
      })
    ).toBeNull();
  });
});

describe('workshop2 wave24 — marking honest sign', () => {
  it('HTTP 2xx saves crptOrderId from body.id only', async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: 'crpt-order-99' }),
    });
    const res = await attemptWorkshop2MarkingHonestSignHttpPost({
      apiUrl: 'https://marking.test/register',
      payload: {
        gtin: '4600000000000',
        markingOrderId: 'mark-journal-local',
        collectionId: 'SS27',
        articleId: 'demo',
      },
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    expect(res.ok).toBe(true);
    expect(res.crptOrderId).toBe('crpt-order-99');
  });

  it('marking API configured probe', () => {
    expect(isWorkshop2MarkingApiConfigured({ WORKSHOP2_MARKING_API_URL: 'https://x' })).toBe(true);
    expect(isWorkshop2MarkingApiConfigured({})).toBe(false);
  });

  it('sample-order gate blocks markingRequired without gtin or order id (RU)', () => {
    process.env.WORKSHOP2_MARKET = 'ru';
    const dossier = emptyWorkshop2DossierPhase1();
    dossier.passportProductionBrief = { markingRequired: true };
    const gate = evaluateWorkshop2RuMarkingSampleOrderGate(dossier);
    expect(gate?.severity).toBe('blocker');
    expect(evaluateWorkshop2SampleOrderGate({ dossier, vaultFileCount: 5 }).allowed).toBe(false);
  });

  it('sample-order gate allows markingOrderId without gtin', () => {
    process.env.WORKSHOP2_MARKET = 'ru';
    const dossier = emptyWorkshop2DossierPhase1();
    dossier.passportProductionBrief = { markingRequired: true };
    dossier.markingHonestSignMirror = {
      mirroredAt: new Date().toISOString(),
      markingRequired: true,
      gtin: null,
      markingOrderId: 'crpt-1',
      status: 'journal_only',
      journalOnly: true,
    };
    expect(evaluateWorkshop2RuMarkingSampleOrderGate(dossier)).toBeNull();
  });
});

describe('workshop2 wave24 — infra probes & scripts', () => {
  it('wave24RuInfra probe includes edo and mes checks', () => {
    const probe = buildWorkshop2Wave24RuInfraProbe({
      WORKSHOP2_MARKET: 'ru',
      WORKSHOP2_EDO_PROVIDER: 'mock',
    });
    expect(probe.checks.some((c) => c.id === 'edo_assignment_cta_modes')).toBe(true);
    expect(probe.checks.some((c) => c.id === 'mes_floor_e2e')).toBe(true);
    expect(probe.checks.some((c) => c.id === 'b2b_credit_dashboard')).toBe(true);
  });

  it('mes mock server script exists with floor sample-status', () => {
    const script = path.join(process.cwd(), 'scripts/workshop2-mes-mock-server.mjs');
    expect(fs.existsSync(script)).toBe(true);
    expect(fs.readFileSync(script, 'utf8')).toMatch(/floor\/sample-status/);
  });

  it('pg staging up mjs globs workshop2 migrations 007+', () => {
    const script = path.join(process.cwd(), 'scripts/workshop2-pg-staging-up.mjs');
    expect(fs.existsSync(script)).toBe(true);
    expect(fs.readFileSync(script, 'utf8')).toMatch(/listWorkshop2StagingMigrations/);
    expect(fs.readFileSync(script, 'utf8')).toMatch(/WORKSHOP2_PG_ONLY=true/);
  });

  it('hub PG_ONLY banner links to setup', () => {
    const banner = summarizeWorkshop2HubPgOnlyBanner({
      backendStatus: 'local_only',
      pgOnlyMode: true,
      postgresConfigured: false,
    });
    expect(banner?.messageRu).toMatch(/PostgreSQL/);
    expect(banner?.setupHref).toBe('/brand/production/workshop2/setup');
  });

  it('credit hold evaluates territory hold', () => {
    const hold = evaluateWorkshop2B2bCreditHold({
      territoryId: 'RU-MOW',
      orderTotalRub: 200_000,
      env: { WORKSHOP2_B2B_CREDIT_HOLD: 'true' },
    });
    expect(hold.allowed).toBe(false);
    expect(hold.exceeded).toBe(true);
  });

  it('brand credit page route file exists', () => {
    expect(fs.existsSync(path.join(process.cwd(), 'src/app/brand/b2b/credit/page.tsx'))).toBe(true);
  });
});

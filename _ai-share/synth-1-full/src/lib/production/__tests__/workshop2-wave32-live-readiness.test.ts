/**
 * Wave 32 — live readiness (+12): E2E signoff, Kontur EDO, ЧЗ prod, MES/PG CI, multi-brand cart.
 */
import fs from 'node:fs';
import path from 'node:path';

import { findHandbookLeafById } from '@/lib/production/category-catalog';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  buildWorkshop2KonturDiadocDocumentRequest,
  buildWorkshop2KonturEdoNotConfiguredResponse,
  buildWorkshop2KonturEdoSetupWizardSteps,
  mapWorkshop2KonturDiadocStatusToRu,
  pollWorkshop2KonturDiadocSignoffStatus,
  postWorkshop2KonturDiadocSignoffRequest,
  resolveWorkshop2KonturEdoConfigured,
} from '@/lib/production/workshop2-edo-kontur-client';
import {
  buildWorkshop2MarkingJournalEventPayload,
  resolveWorkshop2MarkingUiStatusRu,
  isWorkshop2MarkingRegisteredForSampleGate,
  attemptWorkshop2MarkingHonestSignHttpPostWithRetry,
} from '@/lib/production/workshop2-marking-honest-sign';
import { evaluateWorkshop2RuMarkingSampleOrderGate } from '@/lib/production/workshop2-marking-sample-order-gate';
import { buildWorkshop2Ss27MenCoat01FullTzDemoDossier } from '@/lib/production/workshop2-ss27-demo-full-tz-dossier';
import {
  clearWorkshop2B2bCartMemoryForTests,
  evaluateWorkshop2B2bCartMixedBrandGate,
  getWorkshop2B2bCartSession,
  upsertWorkshop2B2bCartLine,
} from '@/lib/production/workshop2-b2b-wave23-parity';
import { buildWorkshop2Wave32LiveReadinessProbe } from '@/lib/production/workshop2-live-integration-probes';

const root = process.cwd();
const LEAF = findHandbookLeafById('catalog-apparel-g0-l0-m-outerwear-l2-coats-l3-parka');

describe('wave32 — e2e signoff pipeline artifacts', () => {
  it('ss27 signoff full spec exists', () => {
    expect(fs.existsSync(path.join(root, 'e2e/workshop2-ss27-signoff-full.spec.ts'))).toBe(true);
  });

  it('package.json exposes test:e2e:ru-signoff', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')) as {
      scripts: Record<string, string>;
    };
    expect(pkg.scripts['test:e2e:ru-signoff']).toMatch(/workshop2-ss27-signoff-full/);
  });
});

describe('wave32 — kontur edo client', () => {
  it('503 when URL missing (fail-closed)', () => {
    const resp = buildWorkshop2KonturEdoNotConfiguredResponse();
    expect(resp.status).toBe(503);
    expect(resp.body.code).toBe('kontur_edo_not_configured');
    expect(resp.body.setupPath).toMatch(/setup#kontur-edo/);
  });

  it('maps Diadoc poll statuses to RU states', () => {
    expect(mapWorkshop2KonturDiadocStatusToRu('Signed')).toBe('signed');
    expect(mapWorkshop2KonturDiadocStatusToRu('WaitingForRecipientSignature')).toBe('pending');
    expect(mapWorkshop2KonturDiadocStatusToRu('Declined')).toBe('rejected');
  });

  it('POST document request shape for Diadoc pattern', async () => {
    const doc = buildWorkshop2KonturDiadocDocumentRequest({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      actor: 'test',
    });
    expect(doc.documentType).toBe('gold_sample_signoff');
    const fetchMock = jest.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ requestId: 'req-1', status: 'pending' }),
    }));
    const result = await postWorkshop2KonturDiadocSignoffRequest({
      env: { WORKSHOP2_KONTUR_DIADOC_URL: 'https://diadoc.test/api' },
      document: doc,
      fetchImpl: fetchMock as unknown as typeof fetch,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.requestId).toBe('req-1');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://diadoc.test/api/signoff-request',
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('setup wizard steps for Kontur env checklist', () => {
    const steps = buildWorkshop2KonturEdoSetupWizardSteps({
      WORKSHOP2_EDO_PROVIDER: 'kontur',
    });
    expect(steps.map((s) => s.id)).toEqual([
      'provider',
      'diadoc_url',
      'health_probe',
      'human_signoff',
    ]);
    expect(steps[0]?.done).toBe(true);
  });

  it('poll fail-closed without URL', async () => {
    expect(resolveWorkshop2KonturEdoConfigured({}).configured).toBe(false);
    const poll = await pollWorkshop2KonturDiadocSignoffStatus({
      requestId: 'x',
      env: {},
    });
    expect(poll.ok).toBe(false);
    if (!poll.ok) expect(poll.notConfigured).toBe(true);
  });
});

describe('wave32 — marking prod path', () => {
  it('uiStatusRu state machine', () => {
    expect(
      resolveWorkshop2MarkingUiStatusRu({ apiConfigured: false, mirrorStatus: 'journal_only' })
    ).toBe('csv_only');
    expect(
      resolveWorkshop2MarkingUiStatusRu({
        apiConfigured: true,
        mirrorStatus: 'pending_external',
        httpOk: true,
      })
    ).toBe('pending_api');
    expect(
      resolveWorkshop2MarkingUiStatusRu({
        apiConfigured: true,
        crptOrderId: 'crpt-99',
      })
    ).toBe('registered');
  });

  it('HTTP retry once on failure', async () => {
    let calls = 0;
    const fetchMock = jest.fn(async () => {
      calls += 1;
      return {
        ok: false,
        status: 502,
        json: async () => ({}),
      };
    });
    const result = await attemptWorkshop2MarkingHonestSignHttpPostWithRetry({
      apiUrl: 'https://marking.test/register',
      payload: {
        gtin: '4600000000000',
        markingOrderId: 'mark-journal-1',
        collectionId: 'SS27',
        articleId: 'a1',
      },
      fetchImpl: fetchMock as unknown as typeof fetch,
    });
    expect(result.retried).toBe(true);
    expect(calls).toBe(2);
    expect(result.ok).toBe(false);
  });

  it('journal event payload for PG dossier_events', () => {
    const payload = buildWorkshop2MarkingJournalEventPayload({
      collectionId: 'SS27',
      articleId: 'a1',
      gtin: '4600000000000',
      markingOrderId: 'mark-1',
      uiStatusRu: 'pending_api',
      actor: 'test',
    });
    expect(payload.uiStatusRu).toBe('pending_api');
    expect(payload.journalAt).toBeTruthy();
  });

  it('sample-order gate passes with gtin OR registered', () => {
    const leaf = LEAF ?? null;
    const withGtin = buildWorkshop2Ss27MenCoat01FullTzDemoDossier(leaf, 'w32-gtin');
    withGtin.passportProductionBrief = {
      ...withGtin.passportProductionBrief,
      markingRequired: true,
      gtin: '4600000000000',
    };
    expect(evaluateWorkshop2RuMarkingSampleOrderGate(withGtin)).toBeNull();

    const registered = {
      ...emptyWorkshop2DossierPhase1(),
      passportProductionBrief: { markingRequired: true },
      markingHonestSignMirror: {
        mirroredAt: new Date().toISOString(),
        markingRequired: true,
        gtin: null,
        markingOrderId: 'crpt-1',
        status: 'registered' as const,
        journalOnly: false,
        hintRu: 'ok',
      },
    };
    expect(isWorkshop2MarkingRegisteredForSampleGate(registered)).toBe(true);
    expect(evaluateWorkshop2RuMarkingSampleOrderGate(registered)).toBeNull();

    const blocked = {
      ...emptyWorkshop2DossierPhase1(),
      passportProductionBrief: { markingRequired: true },
    };
    expect(evaluateWorkshop2RuMarkingSampleOrderGate(blocked)?.severity).toBe('blocker');
  });
});

describe('wave32 — b2b multi-brand cart', () => {
  beforeEach(() => clearWorkshop2B2bCartMemoryForTests());

  it('checkout rejects mixed brands with 409 message RU', () => {
    upsertWorkshop2B2bCartLine({
      sessionId: 'mix-1',
      line: {
        collectionId: 'SS27',
        articleId: 'a1',
        brandId: 'brand-a',
        colorCode: 'BLK',
        size: 'M',
        qty: 1,
        wholesalePriceRub: 1000,
      },
    });
    upsertWorkshop2B2bCartLine({
      sessionId: 'mix-1',
      line: {
        collectionId: 'SS27',
        articleId: 'a2',
        brandId: 'brand-b',
        colorCode: 'WHT',
        size: 'L',
        qty: 1,
        wholesalePriceRub: 2000,
      },
    });
    const session = getWorkshop2B2bCartSession('mix-1')!;
    const gate = evaluateWorkshop2B2bCartMixedBrandGate({ session });
    expect(gate.allowed).toBe(false);
    if (!gate.allowed) {
      expect(gate.messageRu).toMatch(/оформите отдельно/i);
      expect(gate.brandIds).toEqual(expect.arrayContaining(['brand-a', 'brand-b']));
    }
  });
});

describe('wave32 — CI harness scripts', () => {
  it('mes e2e ci script exists', () => {
    const script = path.join(root, 'scripts/workshop2-mes-e2e-ci.sh');
    expect(fs.existsSync(script)).toBe(true);
    const src = fs.readFileSync(script, 'utf8');
    expect(src).toMatch(/workshop2-mes-mock-server/);
    expect(src).toMatch(/workshop2-wave-c2-floor-mes-contract/);
  });

  it('pg-only ci gate script exists', () => {
    const script = path.join(root, 'scripts/ci-workshop2-pg-only-gate.sh');
    expect(fs.existsSync(script)).toBe(true);
    const src = fs.readFileSync(script, 'utf8');
    expect(src).toMatch(/workshop2-pg-staging-up/);
    expect(src).toMatch(/workshop2-pg-only-verify/);
    expect(src).toMatch(/exit 1/);
  });
});

describe('wave32 — wave32LiveReadiness probe', () => {
  it('probe aggregates wave32 checks', () => {
    const probe = buildWorkshop2Wave32LiveReadinessProbe({ WORKSHOP2_MARKET: 'ru' });
    expect(typeof probe.wave32LiveReadiness).toBe('number');
    expect(probe.checks.some((c) => c.id === 'e2e_ss27_signoff_full_spec')).toBe(true);
    expect(probe.checks.some((c) => c.id === 'kontur_edo_client')).toBe(true);
    expect(probe.wave32LiveReadiness).toBeGreaterThanOrEqual(6);
  });
});

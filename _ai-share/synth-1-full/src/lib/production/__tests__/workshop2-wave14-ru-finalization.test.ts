/**
 * Wave 14 RU — финализация витрины, gates RU, UAT SS27 (10 tests).
 */
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  evaluateWorkshop2BulkShowroomPublishForArticle,
  evaluateWorkshop2CollectionShowroomPublishReadiness,
} from '@/lib/production/workshop2-bulk-showroom-publish';
import {
  localizeWorkshop2GateCheck,
  mapWorkshop2GateReasonCodeToRu,
  WORKSHOP2_GATE_REASON_RU,
} from '@/lib/production/workshop2-gate-messages-ru';
import { parseWorkshop2ApiGateChecksFromJson } from '@/lib/production/workshop2-api-gate-messages';
import {
  applyWorkshop2RuMainTabOrderOnce,
  WORKSHOP2_RU_TAB_ORDER_DEFAULT,
  WORKSHOP2_RU_TAB_ORDER_STORAGE_KEY,
  W2_ARTICLE_MAIN_TAB_STRIP,
} from '@/lib/production/workshop-article-main-tab-labels';
import { buildWorkshop2Wave14RuFinalizationProbe } from '@/lib/production/workshop2-live-integration-probes';
import { autoCheckWorkshop2Ss27UatItems } from '@/lib/production/workshop2-ss27-uat-checklist-api';
import { buildWorkshop2Ss27MenCoat01FullTzDemoDossier } from '@/lib/production/workshop2-ss27-demo-full-tz-dossier';
import { findHandbookLeafById } from '@/lib/production/category-handbook-leaves';
import { formatWorkshop2RubCurrency } from '@/lib/production/workshop2-rub-currency';

describe('workshop2 wave14 — showroom readiness', () => {
  it('blocks bulk publish when wholesale missing', () => {
    const d = emptyWorkshop2DossierPhase1();
    d.b2bIntegrationDraft = { campaignId: 'SS27-demo' };
    const result = evaluateWorkshop2BulkShowroomPublishForArticle({
      articleId: 'demo-ss27-01',
      dossier: d,
    });
    expect(result.passed).toBe(false);
    expect(result.reasons.length).toBeGreaterThan(0);
  });

  it('collection readiness returns ready/blocked shape', async () => {
    const d = emptyWorkshop2DossierPhase1();
    d.b2bIntegrationDraft = {
      wholesalePrice: 12000,
      msrp: 24000,
      moq: 10,
      startDate: '2026-06-01',
      endDate: '2026-08-31',
    };
    const readiness = await evaluateWorkshop2CollectionShowroomPublishReadiness({
      articleIds: ['a1', 'a2'],
      resolveArticle: async (articleId) => ({
        articleId,
        dossier: articleId === 'a1' ? d : null,
      }),
    });
    expect(readiness.ready).toBe(false);
    // Wave 21: a1 также блокируется gate разработки (sample-order), не только showroom поля.
    expect(readiness.blocked.length).toBeGreaterThanOrEqual(1);
    expect(readiness.passedArticleIds).toEqual([]);
  });
});

describe('workshop2 wave14 — gate messages RU', () => {
  it('maps showroom gate codes to Russian', () => {
    expect(mapWorkshop2GateReasonCodeToRu('showroom.moq.invalid')).toMatch(/MOQ/);
    expect(WORKSHOP2_GATE_REASON_RU['handoff_not_ready']).toMatch(/Handoff/);
  });

  it('localizes raw code messageRu in API parse', () => {
    const checks = parseWorkshop2ApiGateChecksFromJson({
      checks: [{ id: 'handoff_not_ready', severity: 'blocker', messageRu: 'handoff_not_ready' }],
    });
    expect(checks[0]?.messageRu).toMatch(/Handoff/);
  });

  it('localizeWorkshop2GateCheck preserves good messageRu', () => {
    const out = localizeWorkshop2GateCheck({
      id: 'tz.overall.min',
      severity: 'blocker',
      messageRu: 'Готовность ТЗ 50% ниже порога 70%.',
    });
    expect(out.messageRu).toMatch(/50%/);
  });
});

describe('workshop2 wave14 — RU tab order', () => {
  it('applies default order once to localStorage', () => {
    const storage = {
      data: {} as Record<string, string>,
      getItem(k: string) {
        return this.data[k] ?? null;
      },
      setItem(k: string, v: string) {
        this.data[k] = v;
      },
    };
    const ordered = applyWorkshop2RuMainTabOrderOnce(W2_ARTICLE_MAIN_TAB_STRIP, storage);
    expect(ordered[0]?.id).toBe('tz');
    expect(ordered[1]?.id).toBe('plan');
    expect(storage.getItem(WORKSHOP2_RU_TAB_ORDER_STORAGE_KEY)).toBe(
      WORKSHOP2_RU_TAB_ORDER_DEFAULT.join(',')
    );
  });
});

describe('workshop2 wave14 — SS27 UAT auto-check extras', () => {
  it('auto-passes edo signed + gtin on demo dossier', () => {
    const leaf = findHandbookLeafById('catalog-apparel-g0-l0');
    const dossier = buildWorkshop2Ss27MenCoat01FullTzDemoDossier(leaf, 'test');
    const items = autoCheckWorkshop2Ss27UatItems({
      items: [
        {
          id: 's7',
          step: 7,
          titleRu: 'Inspector',
          passCriteriaRu: '',
          status: 'manual',
          autoChecked: false,
        },
        {
          id: 's12',
          step: 12,
          titleRu: 'GTIN',
          passCriteriaRu: '',
          status: 'manual',
          autoChecked: false,
        },
      ],
      dossiers: [dossier],
      env: { WORKSHOP2_MARKET: 'ru' },
    });
    expect(items.find((i) => i.step === 7)?.status).toBe('auto_pass');
    expect(items.find((i) => i.step === 12)?.status).toBe('auto_pass');
  });
});

describe('workshop2 wave14 — connectivity probe', () => {
  it('exposes wave14RuShowroomReadiness with ≥10 checks', () => {
    const probe = buildWorkshop2Wave14RuFinalizationProbe({ WORKSHOP2_MARKET: 'ru' });
    expect(probe.checks.length).toBeGreaterThanOrEqual(10);
    expect(probe.checks.every((c) => c.ok)).toBe(true);
    expect(probe.checks.some((c) => c.id === 'publish_showroom_readiness_api')).toBe(true);
  });
});

describe('workshop2 wave14 — B2B matrix rub helper', () => {
  it('formats matrix totals via workshop2-rub-currency', () => {
    expect(formatWorkshop2RubCurrency(1_250_000)).toMatch(/₽/);
  });
});

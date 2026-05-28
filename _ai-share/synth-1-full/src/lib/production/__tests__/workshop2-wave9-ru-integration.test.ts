/**
 * Wave 9 RU — market profile, ЭДО, маркировка, 1С, ЮKassa, B2B ₽, wave9RuHorizontal probes.
 */
import {
  getWorkshop2MarketProfile,
  isWorkshop2IntegrationEnabledForMarket,
  listWorkshop2GlobalOnlyIntegrationIds,
  listWorkshop2RuIntegrationIds,
} from '@/lib/production/workshop2-market-profile';
import {
  registerWorkshop2MarkingOrderJournal,
  probeWorkshop2MarkingHonestSign,
} from '@/lib/production/workshop2-marking-honest-sign';
import {
  buildWorkshop2Erp1cExportPayload,
  exportWorkshop2Erp1cJournal,
  probeWorkshop2Erp1c,
} from '@/lib/production/workshop2-erp-1c-stub';
import { probeWorkshop2Yukassa } from '@/lib/production/workshop2-yukassa-stub';
import {
  buildWorkshop2RfLogisticsDocTemplate,
  listWorkshop2RfLogisticsDocKinds,
} from '@/lib/production/workshop2-rf-logistics-docs';
import {
  formatWorkshop2RubAmount,
  resolveWorkshop2B2bVatRate,
  filterWorkshop2TerritoriesForMarket,
  buildWorkshop2B2bOrderStubTotals,
  isWorkshop2RuTerritoryId,
} from '@/lib/production/workshop2-b2b-checkout-rub';
import {
  workshop2EdoStatusLabelRu,
  evaluateWorkshop2EdoSignoffHandoffGate,
  buildWorkshop2EdoSignoffMirror,
} from '@/lib/production/workshop2-edo-signoff';
import {
  buildWorkshop2IntegrationCeilingProbes,
  buildWorkshop2Wave9RuHorizontalProbes,
  workshop2ReadyForInvestorDemo,
} from '@/lib/production/workshop2-live-integration-probes';
import { buildWorkshop2InvestorReadinessReport } from '@/lib/production/workshop2-investor-readiness';
import { summarizeWorkshop2HubIntegrationProbesOneLiner } from '@/lib/production/workshop2-hub-integration-probes-banner';
import {
  autoCheckWorkshop2Ss27UatItems,
  parseWorkshop2Ss27UatChecklistMarkdown,
} from '@/lib/production/workshop2-ss27-uat-checklist-api';
import { buildWorkshop2Ss27MenCoat01FullTzDemoDossier } from '@/lib/production/workshop2-ss27-demo-full-tz-dossier';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import { isWorkshop2ShowVendorBiddingEnabled } from '@/lib/production/workshop2-show-heuristic-risk';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';

const LEAF = {
  id: 'coat',
  labelRu: 'Пальто',
  audienceId: 'men',
  l1Name: 'Одежда',
} as HandbookCategoryLeaf;

describe('workshop2 wave9 — market profile', () => {
  afterEach(() => {
    delete process.env.WORKSHOP2_MARKET;
  });

  it('defaults to ru', () => {
    delete process.env.WORKSHOP2_MARKET;
    expect(getWorkshop2MarketProfile({})).toBe('ru');
  });

  it('global enables joor, ru disables', () => {
    expect(isWorkshop2IntegrationEnabledForMarket('joor', { WORKSHOP2_MARKET: 'global' })).toBe(
      true
    );
    expect(isWorkshop2IntegrationEnabledForMarket('joor', { WORKSHOP2_MARKET: 'ru' })).toBe(false);
    expect(isWorkshop2IntegrationEnabledForMarket('shopify', { WORKSHOP2_MARKET: 'ru' })).toBe(
      false
    );
    expect(isWorkshop2IntegrationEnabledForMarket('teams', { WORKSHOP2_MARKET: 'ru' })).toBe(false);
  });

  it('lists global-only and ru integration ids', () => {
    expect(listWorkshop2GlobalOnlyIntegrationIds()).toContain('eu_dpp_registry');
    expect(listWorkshop2RuIntegrationIds()).toContain('edo_kontur');
    expect(listWorkshop2RuIntegrationIds()).toContain('marking_honest_sign');
  });
});

describe('workshop2 wave9 — edo RU labels', () => {
  it('maps status to Russian UI labels', () => {
    expect(workshop2EdoStatusLabelRu('pending')).toBe('Ожидает подписи');
    expect(workshop2EdoStatusLabelRu('signed')).toBe('Подписано');
    expect(workshop2EdoStatusLabelRu('rejected')).toBe('Отклонено');
  });

  it('handoff gate blocker in Russian when not signed', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      edoSignoffMirror: buildWorkshop2EdoSignoffMirror({
        dossier: emptyWorkshop2DossierPhase1(),
        provider: 'kontur',
        edoStatus: 'pending',
        env: { WORKSHOP2_EDO_SIGNOFF_REQUIRED: 'true' },
      }),
    };
    const gate = evaluateWorkshop2EdoSignoffHandoffGate(dossier, {
      WORKSHOP2_EDO_SIGNOFF_REQUIRED: 'true',
    });
    expect(gate?.messageRu).toMatch(/Подписано|подпись|Ожидает подписи|pending/i);
  });
});

describe('workshop2 wave9 — marking honest sign', () => {
  it('journal only without MARKING API URL', () => {
    const probe = probeWorkshop2MarkingHonestSign({});
    expect(probe.journalOnly).toBe(true);
    const reg = registerWorkshop2MarkingOrderJournal({
      dossier: {
        ...emptyWorkshop2DossierPhase1(),
        passportProductionBrief: { markingRequired: true, gtin: '04601234567890' },
      },
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      actor: 'test',
      env: {},
    });
    expect(reg.ok).toBe(true);
    expect(reg.sentToCrpt).toBe(false);
    expect(reg.mirror.markingOrderId).toMatch(/^mark-journal-/);
  });
});

describe('workshop2 wave9 — erp 1c export', () => {
  it('builds RUB BOM JSON without POST', async () => {
    const payload = buildWorkshop2Erp1cExportPayload({
      dossier: emptyWorkshop2DossierPhase1(),
      collectionId: 'SS27',
      articleId: 'x',
      env: { WORKSHOP2_B2B_VAT_RATE: '20' },
    });
    expect(payload.meta.currency).toBe('RUB');
    expect(payload.meta.vatRatePct).toBe(20);
    const out = await exportWorkshop2Erp1cJournal({
      dossier: emptyWorkshop2DossierPhase1(),
      collectionId: 'SS27',
      articleId: 'x',
      env: {},
    });
    expect(out.posted).toBe(false);
    expect(out.ok).toBe(true);
    expect(probeWorkshop2Erp1c({}).journalExport).toBe(true);
  });
});

describe('workshop2 wave9 — yukassa stub', () => {
  it('not_connected without keys', () => {
    delete process.env.YUKASSA_SHOP_ID;
    delete process.env.YUKASSA_SECRET_KEY;
    expect(probeWorkshop2Yukassa({}).status).toBe('not_connected');
  });

  it('configured when keys present', () => {
    expect(
      probeWorkshop2Yukassa({
        YUKASSA_SHOP_ID: '1',
        YUKASSA_SECRET_KEY: 'secret',
      }).status
    ).toBe('configured');
  });
});

describe('workshop2 wave9 — rf logistics docs', () => {
  it('lists TTN and UPD kinds', () => {
    expect(listWorkshop2RfLogisticsDocKinds().map((k) => k.kind)).toEqual(['ttn', 'upd']);
  });

  it('builds UPD template with RUB total', () => {
    const t = buildWorkshop2RfLogisticsDocTemplate({
      kind: 'upd',
      dossier: emptyWorkshop2DossierPhase1(),
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
    });
    expect(t.titleRu).toMatch(/УПД/);
    expect(t.vatRatePct).toBe(20);
  });
});

describe('workshop2 wave9 — b2b rub checkout', () => {
  it('formats rub amounts', () => {
    expect(formatWorkshop2RubAmount(1_500_000)).toMatch(/₽/);
  });

  it('vat rate from env', () => {
    expect(resolveWorkshop2B2bVatRate({ WORKSHOP2_B2B_VAT_RATE: '20' })).toBe(20);
  });

  it('order stub totals with optional vat', () => {
    const t = buildWorkshop2B2bOrderStubTotals({
      lines: [{ qty: 2, wholesalePrice: 10_000 }],
      env: { WORKSHOP2_B2B_VAT_RATE: '20' },
    });
    expect(t.formattedTotalRu).toMatch(/₽/);
    expect(t.vatRatePct).toBe(20);
  });

  it('filters territories to RU in ru market', () => {
    const rows = [
      { territoryId: 'RU-MOW', creditLimitRub: 1, openOrdersRub: 0 },
      { territoryId: 'KZ-ALA', creditLimitRub: 1, openOrdersRub: 0 },
    ];
    const filtered = filterWorkshop2TerritoriesForMarket(rows, { WORKSHOP2_MARKET: 'ru' });
    expect(filtered.every((r) => isWorkshop2RuTerritoryId(r.territoryId))).toBe(true);
  });
});

describe('workshop2 wave9 — investor + probes', () => {
  it('readyForInvestorDemo true in ru with localhost global ceilings', () => {
    const env = {
      WORKSHOP2_MARKET: 'ru',
      WORKSHOP2_DPP_REGISTRY_URL: 'http://127.0.0.1:4099/dpp',
    };
    expect(workshop2ReadyForInvestorDemo(env)).toBe(true);
  });

  it('wave9RuHorizontal exposes market and hidden globals', () => {
    const w9 = buildWorkshop2Wave9RuHorizontalProbes({ WORKSHOP2_MARKET: 'ru' });
    expect(w9.market.market).toBe('ru');
    expect(w9.globalIntegrationsHidden).toContain('shopify');
    expect(w9.domesticLogistics.journalOnly).toBe(true);
  });

  it('investor report includes market ru', () => {
    const report = buildWorkshop2InvestorReadinessReport({
      env: { WORKSHOP2_MARKET: 'ru', WORKSHOP2_UNIT_TESTS_PASSING: 'true' },
      ss27Dossiers: [buildWorkshop2Ss27MenCoat01FullTzDemoDossier(LEAF, 'test')],
    });
    expect(report.probes.market).toBe('ru');
    expect(report.probes.wave9RuHorizontal?.market.market).toBe('ru');
  });

  it('hub banner includes market ru', () => {
    const line = summarizeWorkshop2HubIntegrationProbesOneLiner({
      market: 'ru',
      readyForInvestorDemo: true,
      wave4Horizontal: { shopifyOAuth: { configured: true, status: 'not_connected' } },
    } as Parameters<typeof summarizeWorkshop2HubIntegrationProbesOneLiner>[0]);
    expect(line).toMatch(/market: ru/);
    expect(line).not.toMatch(/Shopify/);
  });
});

describe('workshop2 wave9 — ceilings stagingOk modeLabelRu', () => {
  it('localhost ceiling has stagingOk and modeLabelRu staging', () => {
    process.env.WORKSHOP2_STAGING_CONTRACT_MODE = 'true';
    process.env.WORKSHOP2_NESTING_API_URL = 'http://127.0.0.1:4099/nest';
    const s = buildWorkshop2IntegrationCeilingProbes(process.env).find((c) => c.kind === 'nesting');
    expect(s?.stagingOk).toBe(true);
    expect(s?.modeLabelRu).toBe('staging');
    delete process.env.WORKSHOP2_NESTING_API_URL;
    delete process.env.WORKSHOP2_STAGING_CONTRACT_MODE;
  });

  it('prod URL has modeLabelRu production when live', () => {
    process.env.WORKSHOP2_NESTING_API_URL = 'https://nesting.partner.example/v1';
    const s = buildWorkshop2IntegrationCeilingProbes(process.env).find((c) => c.kind === 'nesting');
    expect(s?.live).toBe(true);
    expect(s?.modeLabelRu).toBe('production');
    delete process.env.WORKSHOP2_NESTING_API_URL;
  });
});

describe('workshop2 wave9 — ss27 demo seed', () => {
  it('demo dossier has b2c slug marking and edo signed mock', () => {
    const d = buildWorkshop2Ss27MenCoat01FullTzDemoDossier(LEAF, 'uat');
    expect(d.passportProductionBrief?.b2cProductSlug).toBe('ss27-m-coat-01');
    expect(d.passportProductionBrief?.markingRequired).toBe(true);
    expect(d.edoSignoffMirror?.edoStatus).toBe('signed');
    expect(d.markingHonestSignMirror?.journalOnly).toBe(true);
  });
});

describe('workshop2 wave9 — UAT RU labels', () => {
  it('step 1 auto_pass for ru market without global ceilings', () => {
    const items = parseWorkshop2Ss27UatChecklistMarkdown('| 1 | Hub | x | x | ceilings | note |\n');
    const checked = autoCheckWorkshop2Ss27UatItems({
      items,
      env: { WORKSHOP2_MARKET: 'ru' },
      dossiers: [],
    });
    expect(checked[0]?.status).toBe('auto_pass');
    expect(checked[0]?.noteRu).toMatch(/Рынок РФ/i);
  });
});

describe('workshop2 wave9 — vendor bidding ru gate', () => {
  it('requires flag and ru market', () => {
    expect(isWorkshop2ShowVendorBiddingEnabled({})).toBe(false);
    expect(
      isWorkshop2ShowVendorBiddingEnabled({
        WORKSHOP2_SHOW_VENDOR_BIDDING: 'true',
        WORKSHOP2_MARKET: 'ru',
      })
    ).toBe(true);
    expect(
      isWorkshop2ShowVendorBiddingEnabled({
        WORKSHOP2_SHOW_VENDOR_BIDDING: 'true',
        WORKSHOP2_MARKET: 'global',
      })
    ).toBe(true);
  });
});

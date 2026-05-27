/**
 * Wave 10 RU — ₽ currency, PDF logistics, CommerceML, marking CSV, calendar auto-sync, wave10 probes.
 */
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  formatWorkshop2RubCurrency,
  parseWorkshop2RubInput,
  calcWorkshop2VatFromGrossRub,
  calcWorkshop2VatOnNetRub,
} from '@/lib/production/workshop2-rub-currency';
import {
  syncWorkshop2CostingRubMirrorOnDossier,
  resolveWorkshop2CostingRubFromDossier,
} from '@/lib/production/workshop2-dossier-costing-rub';
import {
  buildWorkshop2RfLogisticsDocTemplate,
  workshop2RfLogisticsPdfFileName,
} from '@/lib/production/workshop2-rf-logistics-docs';
import { formatWorkshop2RubAmount } from '@/lib/production/workshop2-b2b-checkout-rub';
import { shouldShowWorkshop2RubInUi } from '@/lib/production/workshop2-rub-currency';
import { auditWorkshop2RuCoreNotDisabled } from '@/lib/production/workshop2-ru-core-routes-audit';
import {
  buildWorkshop2Erp1cCommerceMlFragment,
  buildWorkshop2Erp1cExportPayload,
} from '@/lib/production/workshop2-erp-1c-stub';
import {
  buildWorkshop2MarkingWizardSteps,
  buildWorkshop2MarkingHonestSignCsv,
  workshop2MarkingCompositionLabelGateHintRu,
} from '@/lib/production/workshop2-marking-honest-sign';
import { requestWorkshop2EdoSignoff } from '@/lib/production/workshop2-edo-signoff';
import { createWorkshop2YukassaPaymentLink } from '@/lib/production/workshop2-yukassa-stub';
import { buildWorkshop2RuArticleDashboardCard } from '@/lib/production/workshop2-ru-workspace-dashboard';
import { shouldAutoSyncWorkshop2CalendarOnDossierPut } from '@/lib/production/workshop2-dossier-calendar-auto-sync';
import { buildWorkshop2SchetOffertaPayload } from '@/lib/production/workshop2-schet-offerta';
import { buildWorkshop2ShowroomLinesheetRubPayload } from '@/lib/production/workshop2-b2b-linesheet-rub';
import { buildWorkshop2Wave10RuHorizontalProbes } from '@/lib/production/workshop2-live-integration-probes';
import {
  WORKSHOP2_RU_ONBOARDING_STEPS,
  WORKSHOP2_RU_ONBOARDING_LS_KEY,
} from '@/lib/production/workshop2-ru-onboarding';
import { ensureWorkshop2ProductionModel } from '@/lib/production/workshop2-production-model-from-dossier';

describe('workshop2 wave10 — rub currency', () => {
  it('formats and parses rub', () => {
    expect(formatWorkshop2RubCurrency(1_500_000)).toMatch(/₽/);
    expect(parseWorkshop2RubInput('1 500 000')).toBe(1_500_000);
  });

  it('vat from gross and net', () => {
    const g = calcWorkshop2VatFromGrossRub({ grossRub: 120, vatRatePct: 20 });
    expect(g.vatRub).toBe(20);
    const n = calcWorkshop2VatOnNetRub({ netRub: 100, vatRatePct: 20 });
    expect(n.grossRub).toBe(120);
  });
});

describe('workshop2 wave10 — costingRub mirror', () => {
  it('syncs from BOM rollup', () => {
    const base = emptyWorkshop2DossierPhase1();
    const pm = ensureWorkshop2ProductionModel(base);
    const d = {
      ...base,
      productionModel: {
        ...pm,
        materialLines: [
          {
            id: 'm1',
            role: 'main',
            materialName: 'Shell',
            yieldPerUnit: 2,
            unitCostNet: 100,
            isPrimary: true,
          },
        ],
      },
    };
    const next = syncWorkshop2CostingRubMirrorOnDossier(d, { WORKSHOP2_MARKET: 'ru' });
    expect(next.passportProductionBrief?.costingRub?.estimatedFobRub).toBeGreaterThan(0);
    const resolved = resolveWorkshop2CostingRubFromDossier(next);
    expect(resolved?.source).toBe('bom_rollup');
  });
});

describe('workshop2 wave10 — rf logistics pdf', () => {
  it('template ready for PDF route (inline preview, ₽ total)', () => {
    const t = buildWorkshop2RfLogisticsDocTemplate({
      kind: 'upd',
      dossier: {
        ...emptyWorkshop2DossierPhase1(),
        passportProductionBrief: { targetFob: 25_000 },
      },
      collectionId: 'SS27',
      articleId: 'x',
    });
    expect(t.totalRub).toBeGreaterThan(0);
    expect(t.titleRu).toMatch(/УПД/);
    expect(t.noteRu).toMatch(/УПД|ЭДО/i);
  });
});

describe('workshop2 wave10 — erp commerceml', () => {
  it('emits CommerceML fragment', () => {
    const payload = buildWorkshop2Erp1cExportPayload({
      dossier: emptyWorkshop2DossierPhase1(),
      collectionId: 'SS27',
      articleId: 'x',
    });
    const xml = buildWorkshop2Erp1cCommerceMlFragment({ payload });
    expect(xml).toContain('КоммерческаяИнформация');
    expect(xml).toContain('ВерсияСхемы="2.10"');
  });
});

describe('workshop2 wave10 — marking wizard and csv', () => {
  it('wizard steps without api', () => {
    const steps = buildWorkshop2MarkingWizardSteps(
      {
        ...emptyWorkshop2DossierPhase1(),
        passportProductionBrief: { markingRequired: true, gtin: '04601234567890' },
      },
      {}
    );
    expect(steps).toHaveLength(3);
    expect(steps[2]?.hintRu).toMatch(/ожидает API|CSV/i);
  });

  it('csv export line', () => {
    const csv = buildWorkshop2MarkingHonestSignCsv({
      dossier: {
        ...emptyWorkshop2DossierPhase1(),
        passportProductionBrief: { gtin: '04601234567890', markingRequired: true },
      },
      collectionId: 'SS27',
      articleId: 'a1',
    });
    expect(csv).toContain('04601234567890');
    expect(workshop2MarkingCompositionLabelGateHintRu(emptyWorkshop2DossierPhase1())).toMatch(
      /GTIN|не требуется/i
    );
  });
});

describe('workshop2 wave10 — edo mock staging', () => {
  it('mock signs in staging on production node', async () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    process.env.WORKSHOP2_EDO_PROVIDER = 'mock';
    process.env.WORKSHOP2_STAGING_CONTRACT_MODE = 'true';
    const res = await requestWorkshop2EdoSignoff({
      dossier: emptyWorkshop2DossierPhase1(),
      collectionId: 'SS27',
      articleId: 'x',
      actor: 'test',
      env: process.env,
    });
    expect(res.ok).toBe(true);
    expect(res.mirror.edoStatus).toBe('signed');
    process.env.NODE_ENV = prev;
    delete process.env.WORKSHOP2_STAGING_CONTRACT_MODE;
  });
});

describe('workshop2 wave10 — yukassa create payment', () => {
  it('instruction without keys', () => {
    delete process.env.YUKASSA_SHOP_ID;
    delete process.env.YUKASSA_SECRET_KEY;
    const r = createWorkshop2YukassaPaymentLink({ amountRub: 10_000, descriptionRu: 'test' });
    expect(r.paymentUrl).toBeNull();
    expect(r.instructionRu).toMatch(/YUKASSA_SHOP_ID/i);
  });

  it('url when keys set', () => {
    const r = createWorkshop2YukassaPaymentLink({
      amountRub: 5000,
      descriptionRu: 'test',
      env: { YUKASSA_SHOP_ID: '1', YUKASSA_SECRET_KEY: 's' },
    });
    expect(r.paymentUrl).toMatch(/yookassa/i);
  });
});

describe('workshop2 wave10 — dashboard and calendar', () => {
  it('dashboard card fields', () => {
    const card = buildWorkshop2RuArticleDashboardCard({
      dossier: {
        ...emptyWorkshop2DossierPhase1(),
        taMilestones: [{ id: 'm1', title: 'Fit', targetDate: '2026-06-01', status: 'pending' }],
      },
    });
    expect(card.gatesSummaryRu).toMatch(/ТЗ/);
    expect(card.taNextMilestoneRu).toMatch(/Fit/);
  });

  it('calendar auto-sync when milestones change', () => {
    const prev = emptyWorkshop2DossierPhase1();
    const next = {
      ...prev,
      taMilestones: [{ id: 'm1', title: 'X', targetDate: '2026-07-01', status: 'pending' }],
    };
    expect(shouldAutoSyncWorkshop2CalendarOnDossierPut({ previous: prev, next })).toBe(true);
    expect(shouldAutoSyncWorkshop2CalendarOnDossierPut({ previous: next, next })).toBe(false);
  });
});

describe('workshop2 wave10 — b2b rub', () => {
  it('schet-offerta payload', () => {
    const p = buildWorkshop2SchetOffertaPayload({
      orderId: 'ord-1',
      lines: [{ name: 'Coat', qty: 2, priceRub: 10_000 }],
    });
    expect(p.totalFormattedRu).toMatch(/₽/);
    expect(p.documentType).toBe('schet-offerta');
  });

  it('linesheet rub moq', () => {
    const d = {
      ...emptyWorkshop2DossierPhase1(),
      passportProductionBrief: { targetFob: 12_000, moqTargetMaxPieces: 50 },
    };
    const ls = buildWorkshop2ShowroomLinesheetRubPayload({
      collectionId: 'SS27',
      articleId: 'x',
      dossier: d,
      env: { WORKSHOP2_MARKET: 'ru' },
    });
    expect(ls.currency).toBe('RUB');
    expect(ls.moqFromDossier).toBe(50);
    expect(ls.wholesaleFormattedRu).toMatch(/₽/);
  });
});

describe('workshop2 wave10 — probes and onboarding', () => {
  it('wave10RuHorizontal', () => {
    const w10 = buildWorkshop2Wave10RuHorizontalProbes({ WORKSHOP2_MARKET: 'ru' });
    expect(w10.coreRoutesAudit.ok).toBe(true);
    expect(w10.rfLogisticsPdf.downloadable).toBe(true);
    expect(w10.erp1cExport.formats).toContain('commerceml');
  });

  it('onboarding steps', () => {
    expect(WORKSHOP2_RU_ONBOARDING_STEPS).toHaveLength(5);
    expect(WORKSHOP2_RU_ONBOARDING_LS_KEY).toBe('w2-ru-onboarding-dismissed');
  });

  it('global mode flag on probes', () => {
    const g = buildWorkshop2Wave10RuHorizontalProbes({ WORKSHOP2_MARKET: 'global' });
    expect(g.globalPanelsAccessibleInGlobal).toBe(true);
  });
});

describe('workshop2 wave10 — rub display helpers', () => {
  it('b2b formatWorkshop2RubAmount uses rub currency', () => {
    expect(formatWorkshop2RubAmount(99_999)).toMatch(/₽/);
  });

  it('shouldShowWorkshop2RubInUi follows market', () => {
    expect(shouldShowWorkshop2RubInUi({ WORKSHOP2_MARKET: 'ru' })).toBe(true);
    expect(shouldShowWorkshop2RubInUi({ WORKSHOP2_MARKET: 'global' })).toBe(false);
  });

  it('rf pdf filename', () => {
    expect(workshop2RfLogisticsPdfFileName('ttn', 'demo-01')).toMatch(/\.pdf$/);
  });
});

describe('workshop2 wave10 — core audit in probes', () => {
  it('audit ok embedded in horizontal probes', () => {
    const audit = auditWorkshop2RuCoreNotDisabled({ WORKSHOP2_MARKET: 'ru' });
    const w10 = buildWorkshop2Wave10RuHorizontalProbes({ WORKSHOP2_MARKET: 'ru' });
    expect(w10.coreRoutesAudit.ok).toBe(audit.ok);
  });
});

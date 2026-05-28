/**
 * Wave 13 RU — финализация связности и опций (12 tests).
 */
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import { summarizeWorkshop2RuStatusStrip } from '@/lib/production/workshop2-ru-status-strip-summary';
import { buildWorkshop2CollectionHubSummary } from '@/lib/production/workshop2-hub-summary';
import {
  normalizeWorkshop2TnvedDigits,
  isWorkshop2TnvedFormatValid,
  buildWorkshop2TnvedFtsLookupUrl,
  summarizeWorkshop2GostSizeMappingHintRu,
} from '@/lib/production/workshop2-ru-wave13-helpers';
import {
  WORKSHOP2_RU_COLLECTION_DEFAULTS,
  getWorkshop2CollectionDefaults,
  putWorkshop2CollectionDefaults,
  clearWorkshop2CollectionDefaultsMemoryForTests,
} from '@/lib/production/workshop2-collection-defaults';
import { buildWorkshop2RuIntegrationToggles } from '@/components/brand/production/Workshop2RuIntegrationsSetupPanel';
import { buildWorkshop2Wave13RuFinalizationProbe } from '@/lib/production/workshop2-live-integration-probes';
import { listWorkshop2FactorySampleQueue } from '@/lib/production/workshop2-factory-sample-queue';
import {
  WORKSHOP2_RU_COLLECTION_DEFAULTS as barrelDefaults,
  isWorkshop2TnvedFormatValid as barrelTnvedValid,
} from '@/lib/production/workshop2-ru-index';

describe('workshop2 wave13 — RuStatusStrip click targets', () => {
  it('adds edo/marking/supply hrefs when nav provided', () => {
    const d = emptyWorkshop2DossierPhase1();
    d.edoSignoffMirror = { edoStatus: 'pending', provider: 'mock' };
    const strip = summarizeWorkshop2RuStatusStrip(d, {
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
    });
    expect(strip?.edoHref).toMatch(/w2pane=assignment/);
    expect(strip?.markingHref).toMatch(/compliance/);
    expect(strip?.supplyHref).toMatch(/w2pane=supply/);
  });
});

describe('workshop2 wave13 — TN VED helper', () => {
  it('normalizes to 10 digits', () => {
    expect(normalizeWorkshop2TnvedDigits('6204.11.000.0')).toBe('6204110000');
  });

  it('builds FTS lookup URL for valid code', () => {
    const url = buildWorkshop2TnvedFtsLookupUrl('6204110000');
    expect(url).toMatch(/customs\.ru/);
    expect(url).toMatch(/6204110000/);
  });

  it('rejects invalid tnved length', () => {
    expect(isWorkshop2TnvedFormatValid('123')).toBe(false);
  });
});

describe('workshop2 wave13 — GOST size hint', () => {
  it('mentions GOST 42–54 mapping', () => {
    expect(summarizeWorkshop2GostSizeMappingHintRu(['S', 'M', 'L'])).toMatch(/GOST 42–54/);
  });
});

describe('workshop2 wave13 — collection defaults RU', () => {
  beforeEach(() => clearWorkshop2CollectionDefaultsMemoryForTests());

  it('defaults VAT 20% and RUB', () => {
    expect(WORKSHOP2_RU_COLLECTION_DEFAULTS.vatPercent).toBe(20);
    expect(WORKSHOP2_RU_COLLECTION_DEFAULTS.currency).toBe('RUB');
    expect(WORKSHOP2_RU_COLLECTION_DEFAULTS.markingRequiredDefault).toBe(true);
  });

  it('persists per collection in file-store', () => {
    putWorkshop2CollectionDefaults({
      collectionId: 'SS27',
      defaults: { vatPercent: 20, markingRequiredDefault: true },
    });
    const loaded = getWorkshop2CollectionDefaults('SS27');
    expect(loaded.markingRequiredDefault).toBe(true);
  });
});

describe('workshop2 wave13 — hub summary chat preview', () => {
  it('includes chatLastMessagePreview field', () => {
    const summary = buildWorkshop2CollectionHubSummary({
      collectionId: 'SS27',
      articles: [
        {
          articleId: 'demo-ss27-01',
          dossier: null,
          chatLastMessagePreview: 'Последний комментарий',
        },
      ],
    });
    expect(summary.articles[0]?.chatLastMessagePreview).toBe('Последний комментарий');
  });
});

describe('workshop2 wave13 — setup RU integration toggles', () => {
  it('lists five RU integration rows', () => {
    const toggles = buildWorkshop2RuIntegrationToggles({});
    expect(toggles).toHaveLength(5);
    expect(toggles.map((t) => t.id)).toEqual(
      expect.arrayContaining(['moysklad', 'edo', 'marking', 'yukassa', 'erp1c'])
    );
  });
});

describe('workshop2 wave13 — factory sample queue', () => {
  it('returns SS27 demo orders for fact-1', async () => {
    const queue = await listWorkshop2FactorySampleQueue({ factoryId: 'fact-1' });
    expect(queue.items.length).toBeGreaterThan(0);
    expect(queue.items[0]?.workspaceFitQcHref).toMatch(/w2pane=fit/);
  });
});

describe('workshop2 wave13 — connectivity probe', () => {
  it('exposes wave13RuFinalization with ≥12 checks', () => {
    const probe = buildWorkshop2Wave13RuFinalizationProbe({ WORKSHOP2_MARKET: 'ru' });
    expect(probe.checks.length).toBeGreaterThanOrEqual(12);
    expect(probe.checks.every((c) => c.ok)).toBe(true);
  });
});

describe('workshop2 wave13 — ru-index barrel', () => {
  it('re-exports wave13 constants', () => {
    expect(barrelDefaults.vatPercent).toBe(20);
    expect(barrelTnvedValid('6204110000')).toBe(true);
  });
});

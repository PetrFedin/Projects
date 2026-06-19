import { getWorkshop2CoreCollectionRangePlannerMetadataRaw } from '@/lib/production/workshop2-core-collection-range-planner-metadata';
import {
  aggregateTierBudgetMarginFromHints,
  buildRangePlannerPgSnapshot,
  countRangePlannerTiersFromHints,
  extractRangePlannerBudgetMarginFromText,
  inferRangePlannerTierFromHints,
  parseDevelopmentStatusRangePlanner,
  parseRangePlannerCollectionMetadata,
  rangePlannerPgDisclaimerRu,
} from '@/lib/production/workshop2-range-planner-pg';
import {
  overlayDocFromPgSnapshot,
  syncRangePlannerOverlayFromPgSnapshot,
  workshop2RangePlannerOverlayKey,
} from '@/lib/production/workshop2-range-planner-overlay';

describe('workshop2-range-planner-pg', () => {
  it('infers tier from RP sku and Range Planner comment', () => {
    expect(
      inferRangePlannerTierFromHints({
        articleId: 'a1',
        sku: 'RP-FW27-CORE-ABC12',
      })
    ).toBe('core');
    expect(
      inferRangePlannerTierFromHints({
        articleId: 'a2',
        name: 'Range · Trend · FW27',
      })
    ).toBe('trend');
    expect(
      inferRangePlannerTierFromHints({
        articleId: 'a3',
        comment: 'Создано из Range Planner (Novelty · бюджет 400 000 ₽).',
      })
    ).toBe('novelty');
  });

  it('extracts budget and margin from Range Planner comment text', () => {
    expect(
      extractRangePlannerBudgetMarginFromText(
        'Создано из Range Planner (Core · бюджет 1 200 000 ₽ · маржа 42%).'
      )
    ).toEqual({ budget: 1_200_000, targetMargin: 42 });
  });

  it('parses collection metadata rangePlanner tiers', () => {
    const meta = parseRangePlannerCollectionMetadata({
      rangePlanner: {
        tiers: [
          { id: 'core', budget: 1_500_000, targetMargin: 44, planSkuCount: 20 },
          { id: 'trend', budget: 900_000, targetMargin: 36 },
        ],
      },
    });
    expect(meta?.tiers).toHaveLength(2);
    expect(meta?.tiers[0]).toMatchObject({ id: 'core', budget: 1_500_000, targetMargin: 44 });
  });

  it('aggregates tier budget/margin from dossier hints', () => {
    const agg = aggregateTierBudgetMarginFromHints([
      {
        articleId: 'a1',
        sku: 'RP-FW27-CORE-1',
        comment: 'Создано из Range Planner (Core · бюджет 1 200 000 ₽ · маржа 42%).',
      },
      {
        articleId: 'a2',
        name: 'Range · Trend · FW27',
        comment: 'Создано из Range Planner (Trend · бюджет 800 000 ₽ · маржа 38%).',
      },
      {
        articleId: 'a3',
        comment: 'Создано из Range Planner (Novelty · бюджет 400 000 ₽ · маржа 35%).',
      },
    ]);
    expect(agg.core).toEqual({ budget: 1_200_000, targetMargin: 42 });
    expect(agg.trend).toEqual({ budget: 800_000, targetMargin: 38 });
    expect(agg.novelty).toEqual({ budget: 400_000, targetMargin: 35 });
  });

  it('counts tier rows for PG snapshot', () => {
    const { counts, unassigned } = countRangePlannerTiersFromHints([
      { articleId: '1', sku: 'RP-SS27-CORE-1' },
      { articleId: '2', categoryLeafId: 'catalog-apparel-g1-l0' },
      { articleId: '3', sku: 'SS27-M-COAT-01' },
    ]);
    expect(counts.core).toBe(1);
    expect(counts.trend).toBe(1);
    expect(unassigned).toBe(1);
  });

  it('FW27 golden metadata resolves to full pg snapshot without PG row', () => {
    const raw = getWorkshop2CoreCollectionRangePlannerMetadataRaw('FW27');
    const meta = parseRangePlannerCollectionMetadata(raw);
    const snap = buildRangePlannerPgSnapshot({
      collectionId: 'FW27',
      articleCount: 3,
      pgEnabled: true,
      tierHints: [{ articleId: 'demo-fw27-01', categoryLeafId: 'catalog-apparel-g0-l0' }],
      collectionMeta: meta,
    });
    expect(snap.dataSource).toBe('pg');
    expect(snap.budgetFromPg).toBe(true);
    expect(snap.tiers.find((t) => t.id === 'core')?.budget).toBe(1_200_000);
  });

  it('builds partial snapshot when PG has articles without budget metadata', () => {
    const snap = buildRangePlannerPgSnapshot({
      collectionId: 'FW27',
      articleCount: 3,
      pgEnabled: true,
      tierHints: [{ articleId: 'demo-fw27-01', categoryLeafId: 'catalog-apparel-g0-l0' }],
    });
    expect(snap.dataSource).toBe('partial');
    expect(snap.tiersFromPg).toBe(true);
    expect(snap.budgetFromPg).toBe(false);
    expect(snap.articleCount).toBe(3);
    expect(snap.tiers.find((t) => t.id === 'core')?.pgSkuCount).toBe(1);
    expect(snap.tierArticles.core).toEqual([{ articleId: 'demo-fw27-01' }]);
    expect(snap.tierArticles.trend).toEqual([]);
    expect(rangePlannerPgDisclaimerRu(snap)).toContain('пока не в PG');
  });

  it('builds pg snapshot when collection metadata has all tier budgets', () => {
    const snap = buildRangePlannerPgSnapshot({
      collectionId: 'FW27',
      articleCount: 2,
      pgEnabled: true,
      tierHints: [{ articleId: 'demo-fw27-01', categoryLeafId: 'catalog-apparel-g0-l0' }],
      collectionMeta: {
        tiers: [
          { id: 'core', budget: 1_500_000, targetMargin: 44, planSkuCount: 20 },
          { id: 'trend', budget: 900_000, targetMargin: 36, planSkuCount: 12 },
          { id: 'novelty', budget: 500_000, targetMargin: 33, planSkuCount: 6 },
        ],
      },
    });
    expect(snap.dataSource).toBe('pg');
    expect(snap.budgetFromPg).toBe(true);
    expect(snap.tiersFromPg).toBe(true);
    expect(snap.tiers.find((t) => t.id === 'core')).toMatchObject({
      budget: 1_500_000,
      targetMargin: 44,
      planSkuCount: 20,
      budgetFromPg: true,
    });
    expect(rangePlannerPgDisclaimerRu(snap)).toContain('из PostgreSQL');
    expect(rangePlannerPgDisclaimerRu(snap)).not.toContain('пока не в PG');
  });

  it('builds pg snapshot from dossier hint budgets when metadata absent', () => {
    const snap = buildRangePlannerPgSnapshot({
      collectionId: 'SS27',
      articleCount: 3,
      pgEnabled: true,
      tierHints: [
        {
          articleId: '1',
          sku: 'RP-SS27-CORE-1',
          comment: 'Создано из Range Planner (Core · бюджет 1 200 000 ₽ · маржа 42%).',
        },
        {
          articleId: '2',
          name: 'Range · Trend · SS27',
          comment: 'Создано из Range Planner (Trend · бюджет 800 000 ₽ · маржа 38%).',
        },
        {
          articleId: '3',
          comment: 'Создано из Range Planner (Novelty · бюджет 400 000 ₽ · маржа 35%).',
        },
      ],
    });
    expect(snap.dataSource).toBe('pg');
    expect(snap.budgetFromPg).toBe(true);
    expect(snap.tiers.find((t) => t.id === 'novelty')?.budget).toBe(400_000);
  });

  it('parseDevelopmentStatusRangePlanner prefers API rangePlanner block', () => {
    const fromApi = parseDevelopmentStatusRangePlanner(
      {
        articleCount: 5,
        rangePlanner: buildRangePlannerPgSnapshot({
          collectionId: 'SS27',
          articleCount: 5,
          pgEnabled: true,
          tierHints: [],
        }),
      },
      'SS27',
      true
    );
    expect(fromApi.articleCount).toBe(5);
    expect(fromApi.dataSource).toBe('partial');
    expect(fromApi.tiersFromPg).toBe(true);
  });
});

describe('workshop2-range-planner-overlay', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('syncs PG snapshot tiers into localStorage overlay', () => {
    const snap = buildRangePlannerPgSnapshot({
      collectionId: 'FW27',
      articleCount: 2,
      pgEnabled: true,
      tierHints: [],
      collectionMeta: {
        tiers: [
          { id: 'core', budget: 1_500_000, targetMargin: 44, planSkuCount: 20 },
          { id: 'trend', budget: 900_000, targetMargin: 36, planSkuCount: 12 },
          { id: 'novelty', budget: 500_000, targetMargin: 33, planSkuCount: 6 },
        ],
      },
    });
    const doc = overlayDocFromPgSnapshot(snap);
    expect(doc.dataSource).toBe('pg');
    expect(doc.budgetFromPg).toBe(true);
    expect(doc.tiers).toHaveLength(3);

    expect(syncRangePlannerOverlayFromPgSnapshot(snap)).toBe(true);
    const key = workshop2RangePlannerOverlayKey('FW27');
    const raw = window.localStorage.getItem('synth.brand.workshop2RangePlannerOverlay.v1');
    const parsed = (JSON.parse(raw ?? '{}') as Record<string, typeof doc>)[key];
    expect(parsed.collectionId).toBe('FW27');
    expect(parsed.tiers[0]?.budget).toBe(1_500_000);
    expect(parsed.syncedFromPgAt).toBeTruthy();
  });
});

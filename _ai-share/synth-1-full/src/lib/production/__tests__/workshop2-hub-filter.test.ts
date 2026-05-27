import {
  WORKSHOP2_HUB_ARTICLE_FILTER_ALL,
  filterWorkshop2HubEntries,
  hubEntryEnrichmentKey,
} from '@/lib/production/workshop2-hub-filter';

const entries = [
  {
    collectionId: 'SS27',
    collectionName: 'SS27',
    row: {
      id: 'a1',
      sku: 'W2-001',
      name: 'Платье',
      categoryL1: 'Одежда',
      categoryL2: 'Платья',
      workshopTags: ['SS27', 'premium'],
    },
  },
  {
    collectionId: 'SS27',
    collectionName: 'SS27',
    row: {
      id: 'a2',
      sku: 'W2-002',
      name: 'Кроссовки',
      categoryL1: 'Обувь',
      workshopTags: ['SS27'],
    },
  },
];

describe('workshop2-hub-filter', () => {
  it('filters by search across sku and tags', () => {
    const out = filterWorkshop2HubEntries(entries, {
      search: 'premium',
      tagFilter: new Set(),
      articleFilter: WORKSHOP2_HUB_ARTICLE_FILTER_ALL,
      catL1: '',
      catL2: '',
      catL3: '',
    });
    expect(out).toHaveLength(1);
    expect(out[0]?.row.id).toBe('a1');
  });

  it('filters by category L1 and single article key', () => {
    const out = filterWorkshop2HubEntries(entries, {
      search: '',
      tagFilter: new Set(),
      articleFilter: 'SS27::a2',
      catL1: 'Обувь',
      catL2: '',
      catL3: '',
    });
    expect(out).toHaveLength(1);
    expect(out[0]?.row.sku).toBe('W2-002');
  });

  it('requires any selected tag when tag filter non-empty', () => {
    const out = filterWorkshop2HubEntries(entries, {
      search: '',
      tagFilter: new Set(['premium']),
      articleFilter: WORKSHOP2_HUB_ARTICLE_FILTER_ALL,
      catL1: '',
      catL2: '',
      catL3: '',
    });
    expect(out.map((e) => e.row.id)).toEqual(['a1']);
  });

  it('filters by sample order enrichment (wave 13)', () => {
    const enrichment = {
      [hubEntryEnrichmentKey('SS27', 'a1')]: { hasSampleOrder: false },
      [hubEntryEnrichmentKey('SS27', 'a2')]: { hasSampleOrder: true },
    };
    const out = filterWorkshop2HubEntries(
      entries,
      {
        search: '',
        tagFilter: new Set(),
        articleFilter: WORKSHOP2_HUB_ARTICLE_FILTER_ALL,
        catL1: '',
        catL2: '',
        catL3: '',
      },
      { hasSampleOrderOnly: true },
      enrichment
    );
    expect(out).toHaveLength(1);
    expect(out[0]?.row.id).toBe('a2');
  });
});

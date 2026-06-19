import {
  articleMatchesWorkshop2CategoryFacets,
  collectWorkshop2CategoryL1Options,
  collectWorkshop2CategoryL2Options,
  collectWorkshop2CategoryL3Options,
} from '@/lib/production/workshop2-article-category-facets';

describe('workshop2-article-category-facets', () => {
  const rows = [
    {
      id: 'a1',
      audienceLabel: 'Женское',
      categoryL1: 'Одежда',
      categoryL2: 'Платья',
      categoryL3: 'Миди',
    },
    {
      id: 'a2',
      audienceLabel: 'Мужское',
      categoryL1: 'Одежда',
      categoryL2: 'Куртки',
      categoryL3: 'Парки',
    },
    {
      id: 'a3',
      audienceLabel: 'Мужское',
      categoryL1: 'Обувь',
      categoryL2: 'Кроссовки',
      categoryL3: '—',
    },
  ];

  it('collects all L1 from created articles', () => {
    expect(collectWorkshop2CategoryL1Options(rows)).toEqual(['Обувь', 'Одежда']);
  });

  it('cascades L2 by selected L1', () => {
    expect(collectWorkshop2CategoryL2Options(rows)).toEqual(['Кроссовки', 'Куртки', 'Платья']);
    expect(collectWorkshop2CategoryL2Options(rows, 'Одежда')).toEqual(['Куртки', 'Платья']);
  });

  it('cascades L3 by L1 and L2', () => {
    expect(collectWorkshop2CategoryL3Options(rows, 'Одежда', 'Платья')).toEqual(['Миди']);
    expect(collectWorkshop2CategoryL3Options(rows, 'Одежда')).toEqual(['Миди', 'Парки']);
  });

  it('filters rows by facet sets', () => {
    const out = rows.filter((r) =>
      articleMatchesWorkshop2CategoryFacets(r, {
        l1: new Set(['Одежда']),
        l2: new Set(['Платья']),
      })
    );
    expect(out.map((r) => r.id)).toEqual(['a1']);
  });
});

/**
 * @jest-environment node
 */
import {
  buildHubCardProgressLabel,
  computeHubCardOverallReadinessPct,
  formatHubCardSeasonFooterLine,
  resolveWorkshop2HubCardAudience,
  resolveWorkshop2HubCardBrandName,
} from '@/lib/production/workshop2-hub-card-display';

describe('workshop2-hub-card-display', () => {
  it('computeHubCardOverallReadinessPct equals TZ readiness only', () => {
    expect(
      computeHubCardOverallReadinessPct({
        finalized: false,
        tzPct: 18,
      })
    ).toBe(18);
  });

  it('buildHubCardProgressLabel shows TZ percent with stages and pulse in title', () => {
    const r = buildHubCardProgressLabel({
      finalized: false,
      tzPct: 18,
      stagesPct: 0,
      pulseScore: 47,
      isComplete: false,
    });
    expect(r.label).toBe('18%');
    expect(r.overallReadinessPct).toBe(18);
    expect(r.title).toContain('Готовность ТЗ 18%');
    expect(r.title).toContain('этапы pipeline 0%');
    expect(r.title).toContain('пульс pre-flight 47/100');
  });

  it('formatHubCardSeasonFooterLine joins season, brand, unisex', () => {
    expect(
      formatHubCardSeasonFooterLine({
        seasonDisplay: 'SS27',
        brandName: 'Nordic Wool',
        isUnisex: false,
      })
    ).toBe('Сезон SS27 · Nordic Wool · унисекс: нет');
    expect(
      formatHubCardSeasonFooterLine({
        seasonDisplay: 'SS27',
        brandName: 'Syntha Lab',
        isUnisex: true,
      })
    ).toBe('Сезон SS27 · Syntha Lab · унисекс: да');
  });

  it('resolveWorkshop2HubCardBrandName prefers product brand', () => {
    expect(
      resolveWorkshop2HubCardBrandName({
        productBrandLabel: 'Nordic Wool',
        collectionDisplayName: 'SS27',
      })
    ).toBe('Nordic Wool');
  });

  it('resolveWorkshop2HubCardAudience: coat men, not unisex label', () => {
    const r = resolveWorkshop2HubCardAudience({
      audienceId: 'men',
      isUnisex: false,
      sku: 'SS27-M-COAT-01',
      name: 'Мужское пальто (шерсть)',
    });
    expect(r.label).toBe('Мужчины');
    expect(r.isUnisex).toBe(false);
  });

  it('resolveWorkshop2HubCardAudience: sneakers men + unisex, not Остальное on footwear', () => {
    const r = resolveWorkshop2HubCardAudience({
      audienceId: 'men',
      isUnisex: true,
      sku: 'SS27-U-SNK-03',
      name: 'Кроссовки демисезонные',
      categoryLeafId: 'catalog-shoes-g0-l0',
    });
    expect(r.label).toBe('Мужчины');
    expect(r.isUnisex).toBe(true);
  });

  it('resolveWorkshop2HubCardAudience: ignores other on footwear leaf', () => {
    const r = resolveWorkshop2HubCardAudience({
      audienceId: 'other',
      isUnisex: true,
      sku: 'SS27-U-SNK-03',
      name: 'Кроссовки',
      categoryLeafId: 'catalog-shoes-g0-l0',
    });
    expect(r.label).not.toBe('Остальное');
    expect(r.isUnisex).toBe(true);
  });

  it('resolveWorkshop2HubCardAudience does not map SKU -U- to audience label Унисекс', () => {
    const r = resolveWorkshop2HubCardAudience({
      sku: 'SS27-U-SNK-03',
      name: 'Кроссовки',
    });
    expect(r.label).not.toBe('Унисекс');
    expect(r.isUnisex).toBe(true);
  });
});

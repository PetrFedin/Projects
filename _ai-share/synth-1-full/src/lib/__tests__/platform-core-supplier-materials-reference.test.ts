import {
  computeSupplierBomFillRatePercent,
  computeSupplierBomWeightedFillRatePercent,
  extractSupplierAltMaterials,
  extractSupplierMaterialPricePoints,
} from '@/lib/platform-core-supplier-materials-reference';

describe('platform-core-supplier-materials-reference', () => {
  const lines = [
    {
      materialName: 'Хлопок',
      consumption: 1.2,
      unit: 'm' as const,
      unitCostNet: 450,
      currency: 'RUB',
      substitutes: ['Лён смесовой'],
    },
    {
      materialName: 'Подклад',
      quantity: 0,
      substitutes: [],
    },
    {
      materialName: 'Нитки',
      yieldPerUnit: 0.05,
      unit: 'kg' as const,
      unitCostNet: 120,
    },
  ];

  it('fill-rate считает строки с нормой расхода', () => {
    expect(computeSupplierBomFillRatePercent(lines)).toBe(67);
  });

  it('weighted fill-rate учитывает роль main выше label', () => {
    const weightedLines = [
      { materialName: 'Основа', role: 'main' as const, consumption: 1.5 },
      { materialName: 'Бирка', role: 'label' as const },
      { materialName: 'Подклад', role: 'lining' as const, yieldPerUnit: 0.8 },
    ];
    expect(computeSupplierBomFillRatePercent(weightedLines)).toBe(67);
    expect(computeSupplierBomWeightedFillRatePercent(weightedLines)).toBe(90);
  });

  it('price points только с unitCostNet > 0', () => {
    const prices = extractSupplierMaterialPricePoints(lines);
    expect(prices).toHaveLength(2);
    expect(prices[0]?.sourceLabelRu).toBe('Цена из ТЗ досье');
  });

  it('alt materials из substitutes', () => {
    const alts = extractSupplierAltMaterials(lines);
    expect(alts).toHaveLength(1);
    expect(alts[0]?.primary).toBe('Хлопок');
    expect(alts[0]?.alternatives).toContain('Лён смесовой');
  });
});

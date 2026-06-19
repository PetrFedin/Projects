import {
  estimateSupplierMaterialNeed,
  formatSupplierMaterialNeedRu,
  parseConsumptionPerGarment,
} from '@/lib/platform-core-supplier-forecast';

describe('platform-core-supplier-forecast', () => {
  it('парсит норму расхода из consumptionLabel', () => {
    expect(
      parseConsumptionPerGarment({
        name: 'Ткань',
        unitLabelRu: 'м',
        consumptionLabel: '1.5 м/изд.',
      })
    ).toBe(1.5);
  });

  it('считает потребность × qty B2B с диапазоном', () => {
    const need = estimateSupplierMaterialNeed({
      preview: {
        name: 'Ткань',
        unitLabelRu: 'м',
        consumptionLabel: '2 м/изд.',
      },
      orderQty: 100,
    });
    expect(need?.point).toBe(200);
    expect(need!.low).toBeLessThan(need!.point);
    expect(need!.high).toBeGreaterThan(need!.point);
    expect(formatSupplierMaterialNeedRu(need!)).toContain('200');
  });
});

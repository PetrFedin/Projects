import {
  buildLinearGradingRow,
  mapLinearGradingPresetsToRows,
  serializeWorkshopGradingSnapshot,
  W2_LINEAR_GRADING_PRESETS,
} from '@/lib/production/workshop2-grading-linear';

describe('workshop2-grading-linear', () => {
  it('buildLinearGradingRow centers increments on centerIndex', () => {
    const sizes = ['S', 'M', 'L'];
    const id = () => 'fixed-id';
    const row = buildLinearGradingRow(sizes, 1, 'Длина', 100, 2, id);
    expect(row.increments['S']).toBe(-2);
    expect(row.increments['M']).toBe(0);
    expect(row.increments['L']).toBe(2);
  });

  it('mapLinearGradingPresetsToRows uses shared builder', () => {
    const sizes = ['38', '39', '40'];
    let k = 0;
    const rows = mapLinearGradingPresetsToRows(
      sizes,
      1,
      W2_LINEAR_GRADING_PRESETS.shoes_auto,
      () => `id-${k++}`
    );
    expect(rows).toHaveLength(4);
    expect(rows[0]!.pointName).toContain('Длина стопы');
  });

  it('serializeWorkshopGradingSnapshot is stable for order of object keys in increments', () => {
    const a = serializeWorkshopGradingSnapshot(['M', 'L'], [
      {
        id: '1',
        pointName: 'A',
        baseMeasurement: 1,
        increments: { L: 1, M: 0 },
      },
    ]);
    const b = serializeWorkshopGradingSnapshot(['M', 'L'], [
      {
        id: '1',
        pointName: 'A',
        baseMeasurement: 1,
        increments: { M: 0, L: 1 },
      },
    ]);
    expect(a).toBe(b);
  });
});

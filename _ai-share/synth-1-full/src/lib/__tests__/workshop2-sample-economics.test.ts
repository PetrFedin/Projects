/**
 * @jest-environment node
 */
import {
  computeSampleEconomicsDraftTotal,
  computeSampleEconomicsLaborHoursTotal,
  emptyWorkshop2SampleEconomicsDraft,
} from '@/lib/production/workshop2-sample-economics';

describe('workshop2-sample-economics', () => {
  it('emptyWorkshop2SampleEconomicsDraft', () => {
    const d = emptyWorkshop2SampleEconomicsDraft();
    expect(d.schemaVersion).toBe(1);
    expect(d.lines).toEqual([]);
    expect(computeSampleEconomicsDraftTotal(d)).toBe(0);
  });

  it('computeSampleEconomicsDraftTotal sums qty * unitCost', () => {
    const d = emptyWorkshop2SampleEconomicsDraft();
    d.lines = [
      {
        id: 'a',
        label: 'Ткань',
        category: 'material',
        qty: 10,
        unitLabel: 'м',
        unitCost: 500,
      },
      {
        id: 'b',
        label: 'Пошив',
        category: 'labor',
        qty: 8,
        unitLabel: 'ч',
        unitCost: 1200,
      },
    ];
    expect(computeSampleEconomicsDraftTotal(d)).toBe(10 * 500 + 8 * 1200);
    d.lines[1].laborHours = 8;
    expect(computeSampleEconomicsLaborHoursTotal(d)).toBe(8);
  });
});

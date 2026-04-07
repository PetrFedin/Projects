import { formatMaterialBomPlainText, formatMaterialBomTsv } from '@/lib/production/workshop2-material-bom-export';

describe('workshop2-material-bom-export', () => {
  const sample = {
    sku: 'ABC-01',
    productName: 'Test / Path',
    l2Name: 'Верхняя одежда',
    matLines: ['Шерсть 80%', 'Нейлон 20%'],
    composition: [
      { label: 'Шерсть', pct: 80 },
      { label: 'Нейлон', pct: 20 },
    ],
    linkedComposition: true,
  };

  it('formatMaterialBomPlainText includes sections and sum', () => {
    const t = formatMaterialBomPlainText({ ...sample, tzPhase: '2' });
    expect(t).toContain('SKU: ABC-01');
    expect(t).toContain('Этап ТЗ: 2');
    expect(t).toContain('Шерсть 80%');
    expect(t).toContain('Итого: 100%');
  });

  it('formatMaterialBomTsv escapes tabs and optional tz_phase', () => {
    const t = formatMaterialBomTsv({
      ...sample,
      tzPhase: '3',
      productName: 'a\tb',
    });
    expect(t).toContain('section\tkey\tvalue');
    expect(t).toContain('meta\ttz_phase\t3');
    expect(t).not.toMatch(/product\ta\tb/);
    expect(t).toMatch(/a b/);
  });
});

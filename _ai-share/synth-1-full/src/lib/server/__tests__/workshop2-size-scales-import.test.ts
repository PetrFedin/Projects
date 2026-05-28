import {
  buildWorkshop2SizeScalePgRowsFromReport,
  parseWorkshop2SizeScaleCsv,
  validateWorkshop2SizeScaleCsv,
  workshop2SizeScalePgKey,
} from '@/lib/server/workshop2-size-scales-import';

describe('workshop2-size-scales-import', () => {
  it('parses header row and validates known scale', () => {
    const csv = `catL1Id,scaleId
women-apparel,EU`;
    const rows = parseWorkshop2SizeScaleCsv(csv);
    expect(rows).toHaveLength(1);
    expect(rows[0]?.catL1Id).toBe('women-apparel');

    const report = validateWorkshop2SizeScaleCsv(csv);
    expect(report.valid).toBe(1);
    expect(report.invalid).toBe(0);
  });

  it('rejects unknown catL1Id', () => {
    const report = validateWorkshop2SizeScaleCsv('unknown-l1,eu_int');
    expect(report.valid).toBe(0);
    expect(report.invalid).toBe(1);
    expect(report.results[0]).toMatchObject({ ok: false });
  });

  it('rejects unknown scale id for valid L1', () => {
    const report = validateWorkshop2SizeScaleCsv('women-apparel,not_a_scale');
    expect(report.valid).toBe(0);
  });

  it('buildWorkshop2SizeScalePgRowsFromReport maps valid rows', () => {
    const report = validateWorkshop2SizeScaleCsv('women-apparel,EU');
    const rows = buildWorkshop2SizeScalePgRowsFromReport(report);
    expect(rows).toHaveLength(1);
    expect(rows[0]?.scaleKey).toBe(workshop2SizeScalePgKey('women-apparel', 'EU'));
    expect(rows[0]?.catL1).toBe('women-apparel');
    expect(rows[0]?.rows.length).toBeGreaterThan(0);
  });
});

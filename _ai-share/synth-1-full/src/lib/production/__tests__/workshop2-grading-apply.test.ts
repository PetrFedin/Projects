import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  applyWorkshop2SmartGrading,
  buildWorkshop2GradingTableExport,
  resolveWorkshop2GradingSizesFromDossier,
} from '@/lib/production/workshop2-grading-apply';
import { findHandbookLeafById } from '@/lib/production/category-handbook-leaves';

describe('workshop2-grading-apply', () => {
  it('applyWorkshop2SmartGrading from sample base updates row values', () => {
    const pidM = '__free:M';
    const pidL = '__free:L';
    const dossier = {
      assignments: [
        {
          attributeId: 'sampleBaseSize',
          values: [{ valueSource: 'free_text' as const, text: 'M; L' }],
        },
      ],
      sampleBasePerSizeDimensions: {
        [pidM]: { 'Длина по спинке': '72' },
        [pidL]: { 'Длина по спинке': '74' },
      },
      sampleBaseSizeLabel: 'M',
    } as Workshop2DossierPhase1;

    const result = applyWorkshop2SmartGrading({
      dossier,
      sizes: ['M', 'L'],
      baseSizeLabel: 'M',
      measurementPoints: [{ id: 'back', pointName: 'Длина по спинке', dimKey: 'Длина по спинке' }],
    });

    expect(result).not.toBeNull();
    expect(result!.appliedFrom).toBe('sample_base');
    expect(result!.gradingRules).toHaveLength(1);
    expect(result!.gradingRules[0]!.baseMeasurement).toBeCloseTo(72);
    expect(result!.gradingRules[0]!.increments['L']).toBeCloseTo(2);
    expect(result!.sampleBasePerSizeDimensions?.[pidL]?.['Длина по спинке']).toBe('74');
  });

  it('buildWorkshop2GradingTableExport includes valuesBySize', () => {
    const dossier = {
      gradingSizes: ['S', 'M'],
      gradingRules: [
        {
          id: 'r1',
          pointName: 'Грудь',
          baseMeasurement: 50,
          increments: { S: -2, M: 0 },
        },
      ],
    } as Workshop2DossierPhase1;
    const exp = buildWorkshop2GradingTableExport(dossier);
    expect(exp.rows).toHaveLength(1);
    const row = (exp.rows as Array<{ valuesBySize: Record<string, number> }>)[0]!;
    expect(row.valuesBySize.M).toBe(50);
    expect(row.valuesBySize.S).toBe(48);
  });

  it('resolveWorkshop2GradingSizesFromDossier uses gradingSizes when set', () => {
    const leaf = findHandbookLeafById('catalog-apparel-g2-l0');
    const sizes = resolveWorkshop2GradingSizesFromDossier(
      { gradingSizes: ['44', '46', '48'] } as Workshop2DossierPhase1,
      leaf ?? undefined
    );
    expect(sizes).toEqual(['44', '46', '48']);
  });
});

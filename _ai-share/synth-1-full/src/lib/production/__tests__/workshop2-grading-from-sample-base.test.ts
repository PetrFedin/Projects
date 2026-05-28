import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  buildGradingRulesFromSampleBase,
  pushGradingRulesToSampleDimensions,
  workshop2SampleBaseSizeRowParts,
} from '@/lib/production/workshop2-grading-from-sample-base';

describe('workshop2-grading-from-sample-base', () => {
  it('workshop2SampleBaseSizeRowParts парсит free_text и не требует kind у assignment', () => {
    const dossier = {
      assignments: [
        {
          attributeId: 'sampleBaseSize',
          values: [{ valueSource: 'free_text' as const, text: '35; 36' }],
        },
      ],
    } as Workshop2DossierPhase1;
    const parts = workshop2SampleBaseSizeRowParts(dossier);
    expect(parts.map((p) => p.parameterId)).toEqual(['__free:35', '__free:36']);
  });

  it('buildGradingRulesFromSampleBase: база и приращения из табеля', () => {
    const pid35 = '__free:35';
    const pid36 = '__free:36';
    const dossier = {
      assignments: [
        {
          attributeId: 'sampleBaseSize',
          values: [{ valueSource: 'free_text' as const, text: '35; 36' }],
        },
      ],
      sampleBasePerSizeDimensions: {
        [pid35]: { 'Длина стопы': '23,4' },
        [pid36]: { 'Длина стопы': '24.4' },
      },
    } as Workshop2DossierPhase1;
    const rows = buildGradingRulesFromSampleBase(dossier, {
      sizes: ['35', '36'],
      baseSizeLabel: '35',
      points: [{ id: 'd', pointName: 'Длина стопы', dimKey: 'Длина стопы' }],
    });
    expect(rows).not.toBeNull();
    expect(rows![0]!.baseMeasurement).toBeCloseTo(23.4);
    expect(rows![0]!.increments['35']).toBe(0);
    expect(rows![0]!.increments['36']).toBeCloseTo(1);
  });

  it('pushGradingRulesToSampleDimensions: при inc=0 не выравнивает все размеры по базе', () => {
    const pid35 = '__free:35';
    const pid36 = '__free:36';
    const dossier = {
      assignments: [
        {
          attributeId: 'sampleBaseSize',
          values: [{ valueSource: 'free_text' as const, text: '35; 36' }],
        },
      ],
      sampleBasePerSizeDimensions: {
        [pid35]: { 'Длина стопы': '23.4', Ширина: '8.8' },
        [pid36]: { 'Длина стопы': '24.4', Ширина: '9.0' },
      },
    } as Workshop2DossierPhase1;
    const rules = [
      {
        id: 'foot',
        pointName: 'Длина стопы',
        baseMeasurement: 24,
        increments: { '35': 0, '36': 0 },
      },
      {
        id: 'width',
        pointName: 'Ширина',
        baseMeasurement: 10.8,
        increments: { '35': 0, '36': 0.2 },
      },
    ];
    const patch = pushGradingRulesToSampleDimensions(
      dossier,
      { sizes: ['35', '36'], baseLabel: '35' },
      rules,
      [
        { id: 'foot', pointName: 'Длина стопы', dimKey: 'Длина стопы' },
        { id: 'width', pointName: 'Ширина', dimKey: 'Ширина' },
      ]
    );
    expect(patch.sampleBasePerSizeDimensions?.[pid35]?.['Длина стопы']).toBe('24');
    expect(patch.sampleBasePerSizeDimensions?.[pid36]?.['Длина стопы']).toBe('24.4');
    expect(patch.sampleBasePerSizeDimensions?.[pid35]?.['Ширина']).toBe('10.8');
    expect(patch.sampleBasePerSizeDimensions?.[pid36]?.['Ширина']).toBe('11');
  });
});

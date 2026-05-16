import {
  buildWorkshop2ProductionPreflightSnapshot,
  getW2ProductionPreflightScoreBand,
} from '@/lib/production/workshop2-production-preflight';
import type { Workshop2DossierPhase1, Workshop2Phase1AttributeAssignment } from '@/lib/production/workshop2-dossier-phase1.types';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';

function canonicalAssignment(attributeId: string, displayLabel: string): Workshop2Phase1AttributeAssignment {
  return {
    assignmentId: `a-${attributeId}`,
    kind: 'canonical',
    attributeId,
    values: [
      {
        valueId: `v-${attributeId}`,
        valueSource: 'free_text',
        displayLabel,
        text: displayLabel,
      },
    ],
  };
}

describe('workshop2 production preflight', () => {
  test('blocks empty dossier', () => {
    const snapshot = buildWorkshop2ProductionPreflightSnapshot(emptyWorkshop2DossierPhase1());
    expect(snapshot.canSendToFactory).toBe(false);
    expect(snapshot.blockers.length).toBeGreaterThan(0);
  });

  test('blocks closure without hardware', () => {
    const dossier: Workshop2DossierPhase1 = {
      ...emptyWorkshop2DossierPhase1(),
      assignments: [
        canonicalAssignment('sku', 'SKU-1'),
        canonicalAssignment('name', 'Coat'),
        canonicalAssignment('l3', 'Пальто'),
        canonicalAssignment('silh', 'Regular'),
        canonicalAssignment('sleeve', 'Long'),
        canonicalAssignment('closure', 'Zipper'),
        canonicalAssignment('mat', 'Wool'),
        canonicalAssignment('composition', '100% wool'),
      ],
      categorySketchImageDataUrl: 'data:image/png;base64,AA',
      sampleBasePerSizeDimensions: {
        m: { length: '100', chest: '58', shoulder: '15' },
      },
    };

    const snapshot = buildWorkshop2ProductionPreflightSnapshot(dossier);
    expect(snapshot.blockers.some((b) => b.id === 'materials.hardware.missing')).toBe(true);
  });

  test('blocks composition sum not equal to 100 in label constructor', () => {
    const dossier: Workshop2DossierPhase1 = {
      ...emptyWorkshop2DossierPhase1(),
      compositionLabelSpec: {
        constructorFiberRows: [
          { rowId: '1', fiberId: 'cotton', percent: 80 },
          { rowId: '2', fiberId: 'polyester', percent: 10 },
        ],
      },
    };

    const snapshot = buildWorkshop2ProductionPreflightSnapshot(dossier);
    expect(snapshot.blockers.some((b) => b.id === 'materials.composition.sum.invalid')).toBe(true);
  });
});

describe('getW2ProductionPreflightScoreBand', () => {
  test.each([
    [0, 'нельзя передавать', 'text-rose-700'],
    [59, 'нельзя передавать', 'text-rose-700'],
    [60, 'риск', 'text-amber-700'],
    [79, 'риск', 'text-amber-700'],
    [80, 'готово', 'text-emerald-700'],
    [100, 'готово', 'text-emerald-700'],
  ] as const)('score %i → %s (%s)', (score, label, tone) => {
    const band = getW2ProductionPreflightScoreBand(score);
    expect(band.label).toBe(label);
    expect(band.tone).toBe(tone);
  });
});

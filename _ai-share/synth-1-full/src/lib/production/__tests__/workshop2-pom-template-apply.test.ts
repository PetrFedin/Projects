import {
  applyWorkshop2PomTemplateIfMeasurementsEmpty,
  mergeWorkshop2PomTemplateIntoDossier,
} from '@/lib/production/workshop2-pom-template-apply';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

const tpl = {
  leafId: 'catalog-apparel-g0-l0',
  label: 'Dress base',
  dimensionLabels: ['Длина', 'Грудь'],
};

describe('workshop2-pom-template-apply', () => {
  it('fills empty measurements', () => {
    const dossier = {
      productionModel: {
        version: 1,
        nodes: [],
        materialLines: [],
        trimLines: [],
        operations: [],
        measurements: [],
      },
    } as Workshop2DossierPhase1;
    const next = applyWorkshop2PomTemplateIfMeasurementsEmpty(dossier, [tpl]);
    expect(next?.productionModel?.measurements).toHaveLength(2);
  });

  it('merge adds only missing labels', () => {
    const dossier = {
      productionModel: {
        version: 1,
        nodes: [],
        materialLines: [],
        trimLines: [],
        operations: [],
        measurements: [{ id: '1', code: 'POM-01', label: 'Длина', size: 'M' }],
      },
    } as Workshop2DossierPhase1;
    const next = mergeWorkshop2PomTemplateIntoDossier(dossier, tpl, 'merge');
    expect(next?.productionModel?.measurements).toHaveLength(2);
    expect(next?.productionModel?.measurements?.[1]?.label).toBe('Грудь');
  });
});

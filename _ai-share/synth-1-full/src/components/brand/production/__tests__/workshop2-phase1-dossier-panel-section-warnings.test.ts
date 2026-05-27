import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import { getSectionWarnings } from '../workshop2-phase1-dossier-panel-section-warnings';

const leaf = { leafId: 'l1' } as HandbookCategoryLeaf;

const readinessBase = {
  general: { done: 0, total: 1, pct: 0, status: '' },
  visuals: { done: 0, total: 1, pct: 0, status: '' },
  material: { done: 0, total: 1, pct: 0, status: '' },
  construction: { done: 1, total: 1, pct: 100, status: '' },
  assignment: { done: 1, total: 1, pct: 100, status: '' },
  measurements: { done: 0, total: 1, pct: 0, status: '' },
  packaging: { done: 0, total: 1, pct: 0, status: '' },
  sample_intake: { done: 0, total: 1, pct: 0, status: '' },
};

describe('workshop2-phase1-dossier-panel-section-warnings', () => {
  it('general warns on empty sku/name', () => {
    const d = emptyWorkshop2DossierPhase1();
    const w = getSectionWarnings('general', d, leaf, '', '', [], readinessBase);
    expect(w).toEqual(['SKU еще не подтвержден.', 'Нет рабочего названия модели.']);
  });

  it('general: no sku warning when assignment has sku', () => {
    const d = emptyWorkshop2DossierPhase1();
    d.assignments = [{ attributeId: 'sku', values: [{ parameterId: 'x', displayLabel: 'SKU-1' }] }];
    const w = getSectionWarnings('general', d, leaf, '', '', [], readinessBase);
    expect(w).toEqual(['Нет рабочего названия модели.']);
  });

  it('material warns when mat/composition missing', () => {
    const w = getSectionWarnings(
      'material',
      emptyWorkshop2DossierPhase1(),
      leaf,
      's',
      'n',
      [],
      readinessBase
    );
    expect(w).toContain('Основной материал не выбран.');
    expect(w).toContain('Состав материала не подтвержден.');
  });

  it('construction merges dimension handbook warnings when done>0', () => {
    const hw = ['Размерная шкала: x', 'noise'];
    const w = getSectionWarnings(
      'construction',
      emptyWorkshop2DossierPhase1(),
      leaf,
      's',
      'n',
      hw,
      {
        ...readinessBase,
        construction: { done: 1, total: 1, pct: 100, status: '' },
      }
    );
    expect(w).toEqual(['Размерная шкала: x']);
  });

  it('assignment warns when pct < 100', () => {
    const w = getSectionWarnings('assignment', emptyWorkshop2DossierPhase1(), leaf, 's', 'n', [], {
      ...readinessBase,
      assignment: { done: 0, total: 2, pct: 50, status: '' },
    });
    expect(w.length).toBe(1);
    expect(w[0]).toContain('Задание');
  });
});

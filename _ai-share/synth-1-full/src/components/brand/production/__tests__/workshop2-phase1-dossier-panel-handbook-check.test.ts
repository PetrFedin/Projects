import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import { buildHandbookCheckSnapshot } from '../workshop2-phase1-dossier-panel-handbook-check-snapshot';

const leaf = { leafId: 'l1' } as HandbookCategoryLeaf;

const sectionLabels = {
  general: 'Паспорт',
  visuals: 'Визуал',
  material: 'Материалы',
  construction: 'Конструкция',
  assignment: 'Задание',
  measurements: 'Табель мер',
  packaging: 'Упаковка',
  sample_intake: 'Приёмка сэмпла',
};

const readiness = {
  general: { done: 0, total: 1, pct: 0, status: '' },
  visuals: { done: 0, total: 1, pct: 0, status: '' },
  material: { done: 0, total: 1, pct: 0, status: '' },
  construction: { done: 0, total: 1, pct: 0, status: '' },
  assignment: { done: 1, total: 1, pct: 100, status: '' },
  measurements: { done: 0, total: 1, pct: 0, status: '' },
  packaging: { done: 0, total: 1, pct: 0, status: '' },
  sample_intake: { done: 0, total: 1, pct: 0, status: '' },
};

describe('workshop2-phase1-dossier-panel-handbook-check', () => {
  it('buildHandbookCheckSnapshot prefixes lines with section label for scope only', () => {
    const snap = buildHandbookCheckSnapshot(
      emptyWorkshop2DossierPhase1(),
      leaf,
      '',
      '',
      [],
      readiness,
      'general',
      [{ label: 'x', ok: true }],
      sectionLabels
    );
    expect(snap.lines.some((l) => l.startsWith('Паспорт:'))).toBe(true);
    expect(snap.bySection.material).toEqual([]);
  });
});

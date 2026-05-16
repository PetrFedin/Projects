/**
 * @jest-environment node
 */
import { buildWorkshop2TzGateSnapshot } from '@/lib/production/workshop2-tz-gates';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { W2_CNODE_BOM, W2_MATERIAL_WITHOUT_NODE } from '@/lib/production/workshop2-bom-construction-node-integrity';

function emptyDossier(): Workshop2DossierPhase1 {
  return { assignments: [] } as Workshop2DossierPhase1;
}

function canon(
  attributeId: string,
  displayLabel: string,
  text?: string,
  assignmentId = `a-${attributeId}`
): Workshop2DossierPhase1['assignments'][number] {
  return {
    assignmentId,
    kind: 'canonical',
    attributeId,
    values: [
      {
        valueId: `${assignmentId}-v1`,
        valueSource: 'free_text',
        displayLabel,
        text: text ?? displayLabel,
      },
    ],
  };
}

function matTwoRows(): Workshop2DossierPhase1['assignments'][number] {
  return {
    assignmentId: 'a-mat',
    kind: 'canonical',
    attributeId: 'mat',
    values: [
      {
        valueId: 'mat-v1',
        valueSource: 'free_text',
        displayLabel: 'Основа · хлопок',
        text: '100% хлопок',
      },
      {
        valueId: 'mat-v2',
        valueSource: 'free_text',
        displayLabel: 'Подклад · вискоза',
        text: '100% вискоза',
      },
    ],
  };
}

describe('workshop2-tz-gates', () => {
  it('returns draft with blockers on empty dossier', () => {
    const snap = buildWorkshop2TzGateSnapshot(emptyDossier());
    expect(snap.state).toBe('draft');
    expect(snap.blockers.length).toBeGreaterThan(0);
  });

  it('critical open comments block ready/fixed', () => {
    const snap = buildWorkshop2TzGateSnapshot(emptyDossier(), {
      commentsById: {
        a: [{ status: 'open', severity: 'critical' }],
      },
    });
    expect(snap.openCriticalCommentsCount).toBe(1);
    expect(snap.lines.find((l) => l.id === 'critical_comments')?.ok).toBe(false);
  });

  it('includes composition_label gate', () => {
    const snap = buildWorkshop2TzGateSnapshot(emptyDossier());
    const comp = snap.lines.find((l) => l.id === 'composition_label');
    expect(comp).toBeDefined();
    expect(comp!.ok).toBe(false);
  });

  it('composition_label passes when label spec has exportable fields', () => {
    const d = {
      ...emptyDossier(),
      compositionLabelSpec: { labelWidthMm: '30', labelHeightMm: '10' },
    } as import('@/lib/production/workshop2-dossier-phase1.types').Workshop2DossierPhase1;
    const snap = buildWorkshop2TzGateSnapshot(d);
    expect(snap.lines.find((l) => l.id === 'composition_label')?.ok).toBe(true);
  });

  it('sectionMinimumErrors construction includes BOM node integrity with activeCategoryLeafId', () => {
    const leaf = 'leaf-1';
    const d = {
      ...emptyDossier(),
      bomLineCostingHints: [{ lineRef: 'LREF-OK-01' }],
      categorySketchAnnotations: [
        {
          annotationId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
          categoryLeafId: leaf,
          xPct: 1,
          yPct: 2,
          text: '',
          linkedAttributeId: 'zipperType',
          linkedBomLineRef: 'LREF-WRONG',
          linkedMaterialNote: 'Обработка',
        },
      ],
    } as Workshop2DossierPhase1;
    const snap = buildWorkshop2TzGateSnapshot(d, { activeCategoryLeafId: leaf });
    const c = snap.sectionMinimumErrors.construction.join('\n');
    expect(c).toContain(W2_CNODE_BOM.UNKNOWN_BOM_REF);
  });

  it('sectionMinimumErrors material includes W2_MATERIAL_WITHOUT_NODE when lineRef has no pin', () => {
    const leaf = 'leaf-1';
    const d = {
      ...emptyDossier(),
      bomLineCostingHints: [{ lineRef: 'LREF-ORPHAN-01' }],
    } as Workshop2DossierPhase1;
    const snap = buildWorkshop2TzGateSnapshot(d, { activeCategoryLeafId: leaf });
    expect(snap.sectionMinimumErrors.material.some((m) => m.includes(W2_MATERIAL_WITHOUT_NODE))).toBe(
      true
    );
  });

  describe('sectionMinimumErrors.material (W2-TZ-IMPLEMENTATION-SPEC)', () => {
    it('material_required: пустой mat', () => {
      const snap = buildWorkshop2TzGateSnapshot(emptyDossier());
      expect(snap.sectionMinimumErrors.material).toContain('В строке BOM не выбран материал.');
    });

    it('materials_min_count: одна строка mat недостаточно', () => {
      const d = {
        ...emptyDossier(),
        assignments: [
          canon('sku', 'SKU-1'),
          canon('name', 'Модель'),
          {
            assignmentId: 'a-mat-one',
            kind: 'canonical' as const,
            attributeId: 'mat',
            values: [
              {
                valueId: 'only',
                valueSource: 'free_text' as const,
                displayLabel: 'Только основа',
                text: 'хлопок',
              },
            ],
          },
          canon('composition', 'Состав', '50% хлопок, 50% полиэстер'),
          canon('zipperType', 'Молния', 'YKK'),
          canon('silh', 'Пальто', 'A-line'),
        ],
        visualReferences: [{ refId: 'r1', title: 't', previewDataUrl: 'data:image/png;base64,xx' }],
        categorySketchAnnotations: [
          {
            annotationId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
            categoryLeafId: 'leaf-1',
            xPct: 1,
            yPct: 1,
            text: 'a',
            linkedAttributeId: 'zipperType',
          },
          {
            annotationId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
            categoryLeafId: 'leaf-1',
            xPct: 2,
            yPct: 2,
            text: 'b',
            linkedAttributeId: 'neck',
          },
          {
            annotationId: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
            categoryLeafId: 'leaf-1',
            xPct: 3,
            yPct: 3,
            text: 'c',
            linkedAttributeId: 'sleeve',
          },
        ],
      } as Workshop2DossierPhase1;
      const snap = buildWorkshop2TzGateSnapshot(d, { activeCategoryLeafId: 'leaf-1' });
      expect(snap.sectionMinimumErrors.material).toContain('Добавьте минимум 2 материала.');
    });

    it('composition_sum_100_required: сумма не 100%', () => {
      const d = {
        ...emptyDossier(),
        assignments: [
          matTwoRows(),
          canon('composition', 'Состав', '40% хлопок, 40% полиэстер'),
        ],
      } as Workshop2DossierPhase1;
      const snap = buildWorkshop2TzGateSnapshot(d);
      expect(snap.sectionMinimumErrors.material.some((m) => m.includes('100%'))).toBe(true);
    });
  });

  describe('sectionMinimumErrors.construction', () => {
    it('closure_required: учитывает атрибут closure', () => {
      const d = {
        ...emptyDossier(),
        assignments: [
          matTwoRows(),
          canon('composition', 'Состав', '100% хлопок'),
          canon('closure', 'Пуговицы', '6 шт'),
          canon('silh', 'Пальто', 'A-line'),
        ],
      } as Workshop2DossierPhase1;
      const snap = buildWorkshop2TzGateSnapshot(d);
      expect(snap.sectionMinimumErrors.construction.some((m) => m.includes('застеж'))).toBe(false);
    });

    it('closure_required: без застежки', () => {
      const d = {
        ...emptyDossier(),
        assignments: [matTwoRows(), canon('composition', 'Состав', '100% хлопок')],
      } as Workshop2DossierPhase1;
      const snap = buildWorkshop2TzGateSnapshot(d);
      expect(snap.sectionMinimumErrors.construction).toContain('Укажите тип застежки.');
    });

    it('silhouette: требуется silh или fit_type (gate on visuals)', () => {
      const d = {
        ...emptyDossier(),
        assignments: [matTwoRows(), canon('composition', 'Состав', '100% хлопок'), canon('zipperType', 'Молния', 'YKK')],
      } as Workshop2DossierPhase1;
      const snap = buildWorkshop2TzGateSnapshot(d);
      expect(snap.sectionMinimumErrors.visuals).toContain('Выберите базовый силуэт.');
    });

    it('silhouette: достаточно fit_type', () => {
      const d = {
        ...emptyDossier(),
        assignments: [
          matTwoRows(),
          canon('composition', 'Состав', '100% хлопок'),
          canon('zipperType', 'Молния', 'YKK'),
          canon('fit_type', 'Посадка', 'Regular'),
        ],
      } as Workshop2DossierPhase1;
      const snap = buildWorkshop2TzGateSnapshot(d);
      expect(snap.sectionMinimumErrors.visuals.some((m) => m.includes('силуэт'))).toBe(false);
    });

    it('nodes_min_count: при 1–2 узлах на скетче — ошибка', () => {
      const d = {
        ...emptyDossier(),
        assignments: [
          matTwoRows(),
          canon('composition', 'Состав', '100% хлопок'),
          canon('zipperType', 'Молния', 'YKK'),
          canon('silh', 'Пальто', 'A-line'),
        ],
        categorySketchAnnotations: [
          {
            annotationId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
            categoryLeafId: 'leaf-1',
            xPct: 1,
            yPct: 1,
            text: 'n1',
            linkedAttributeId: 'zipperType',
          },
          {
            annotationId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
            categoryLeafId: 'leaf-1',
            xPct: 2,
            yPct: 2,
            text: 'n2',
            linkedAttributeId: 'neck',
          },
        ],
      } as Workshop2DossierPhase1;
      const snap = buildWorkshop2TzGateSnapshot(d, { activeCategoryLeafId: 'leaf-1' });
      expect(snap.sectionMinimumErrors.construction.some((m) => m.includes('минимум 3'))).toBe(true);
    });

    it('nodes_min_count: при 0 узлах тоже ошибка', () => {
      const d = {
        ...emptyDossier(),
        assignments: [
          matTwoRows(),
          canon('composition', 'Состав', '100% хлопок'),
          canon('zipperType', 'Молния', 'YKK'),
          canon('silh', 'Пальто', 'A-line'),
        ],
        categorySketchAnnotations: [],
      } as Workshop2DossierPhase1;
      const snap = buildWorkshop2TzGateSnapshot(d, { activeCategoryLeafId: 'leaf-1' });
      expect(snap.sectionMinimumErrors.construction.some((m) => m.includes('сейчас 0'))).toBe(true);
    });

    it('pocket_requires_description: заполненный pocket без текста в values', () => {
      const d = {
        ...emptyDossier(),
        assignments: [
          matTwoRows(),
          canon('composition', 'Состав', '100% хлопок'),
          canon('zipperType', 'Молния', 'YKK'),
          canon('silh', 'Пальто', 'A-line'),
          {
            assignmentId: 'pock',
            kind: 'canonical',
            attributeId: 'pocketOptions',
            values: [
              {
                valueId: 'p1',
                valueSource: 'handbook_parameter',
                displayLabel: 'Прорезной',
                text: '',
              },
            ],
          },
        ],
        categorySketchAnnotations: [
          {
            annotationId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
            categoryLeafId: 'leaf-1',
            xPct: 1,
            yPct: 1,
            text: 'a',
            linkedAttributeId: 'zipperType',
          },
          {
            annotationId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
            categoryLeafId: 'leaf-1',
            xPct: 2,
            yPct: 2,
            text: 'b',
            linkedAttributeId: 'neck',
          },
          {
            annotationId: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
            categoryLeafId: 'leaf-1',
            xPct: 3,
            yPct: 3,
            text: 'c',
            linkedAttributeId: 'sleeve',
          },
        ],
      } as Workshop2DossierPhase1;
      const snap = buildWorkshop2TzGateSnapshot(d, { activeCategoryLeafId: 'leaf-1' });
      expect(snap.sectionMinimumErrors.construction.some((m) => m.includes('карман'))).toBe(true);
    });
  });

  describe('sectionMinimumErrors.visuals (рефы и цвет)', () => {
    it('требует референс и поля цвета', () => {
      const d = {
        ...emptyDossier(),
        assignments: [canon('sku', 'X'), canon('name', 'Y')],
      } as Workshop2DossierPhase1;
      const snap = buildWorkshop2TzGateSnapshot(d);
      expect(snap.sectionMinimumErrors.visuals).toEqual(
        expect.arrayContaining([
          'Добавьте минимум 1 референс.',
          'Выберите основной цвет.',
          'Укажите референс цвета (Pantone/RAL/код).',
        ])
      );
    });
  });
});

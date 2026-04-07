import { describe, expect, it } from '@jest/globals';
import { filterSketchAnnotationsForExportSurface } from '@/lib/production/workshop2-sketch-export-annotation-filter';
import type { Workshop2Phase1CategorySketchAnnotation } from '@/lib/production/workshop2-dossier-phase1.types';

const leaf = 'leaf-1';

function ann(partial: Partial<Workshop2Phase1CategorySketchAnnotation>): Workshop2Phase1CategorySketchAnnotation {
  return {
    annotationId: 'a1',
    categoryLeafId: leaf,
    xPct: 10,
    yPct: 20,
    text: 't',
    annotationType: 'construction',
    ...partial,
  } as Workshop2Phase1CategorySketchAnnotation;
}

describe('filterSketchAnnotationsForExportSurface', () => {
  it('merch_clean removes technical and qc types', () => {
    const list = [
      ann({ annotationId: '1', annotationType: 'material' }),
      ann({ annotationId: '2', annotationType: 'qc' }),
      ann({ annotationId: '3', annotationType: 'finishing' }),
      ann({ annotationId: '4', annotationType: 'labeling' }),
    ];
    const out = filterSketchAnnotationsForExportSurface(list, leaf, 'merch_clean');
    expect(out.map((x) => x.annotationId).sort()).toEqual(['3', '4']);
  });

  it('workshop_floor keeps all', () => {
    const list = [ann({ annotationId: '1', annotationType: 'material' }), ann({ annotationId: '2', annotationType: 'qc' })];
    const out = filterSketchAnnotationsForExportSurface(list, leaf, 'workshop_floor');
    expect(out).toHaveLength(2);
  });
});

/**
 * @jest-environment node
 */
import { bomRefsUnionFromSketchSurfaces } from '@/lib/production/sketch-bom-integrity';
import type { Workshop2Phase1CategorySketchAnnotation } from '@/lib/production/workshop2-dossier-phase1.types';

function pin(ref: string, leaf: string): Workshop2Phase1CategorySketchAnnotation {
  return {
    annotationId: `a-${ref}`,
    categoryLeafId: leaf,
    xPct: 1,
    yPct: 2,
    text: '',
    linkedBomLineRef: ref,
  };
}

describe('sketch-bom-integrity', () => {
  it('bomRefsUnionFromSketchSurfaces merges master and sheets', () => {
    const leaf = 'leaf-1';
    const master = [pin('M1', leaf), pin('M2', leaf)];
    const sheets = [{ annotations: [pin('S1', leaf), pin('M1', leaf)] }];
    expect(bomRefsUnionFromSketchSurfaces(master, sheets, leaf)).toEqual(['M1', 'M2', 'S1']);
  });

  it('bomRefsUnionFromSketchSurfaces ignores other leaf', () => {
    const out = bomRefsUnionFromSketchSurfaces([pin('X', 'other')], [], 'leaf-1');
    expect(out).toEqual([]);
  });
});

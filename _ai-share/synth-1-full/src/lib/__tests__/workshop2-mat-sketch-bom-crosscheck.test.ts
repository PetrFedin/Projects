/**
 * @jest-environment node
 */
import { sketchBomRefsMissingFromMatLines } from '@/lib/production/workshop2-mat-sketch-bom-crosscheck';

describe('workshop2-mat-sketch-bom-crosscheck', () => {
  it('returns all refs when mat empty', () => {
    expect(sketchBomRefsMissingFromMatLines(['A', 'B'], [])).toEqual(['A', 'B']);
  });

  it('matches substring either way', () => {
    expect(sketchBomRefsMissingFromMatLines(['FAB-001'], ['Основа FAB-001 хлопок'])).toEqual([]);
    expect(sketchBomRefsMissingFromMatLines(['LONGREF'], ['LONG'])).toEqual([]);
  });

  it('flags ref not in any mat line', () => {
    expect(sketchBomRefsMissingFromMatLines(['X1', 'Y2'], ['Ткань A', 'Подклад B'])).toEqual(['X1', 'Y2']);
  });
});

import {
  mergeSuggestedTzAttributeIdsForSketchType,
  suggestedTzAttributeIdsForSketchType,
} from '@/lib/production/workshop2-sketch-tz-matrix';

describe('workshop2-sketch-tz-matrix', () => {
  it('mergeSuggestedTzAttributeIdsForSketchType appends catalog-driven ids', () => {
    const base = suggestedTzAttributeIdsForSketchType('construction');
    const merged = mergeSuggestedTzAttributeIdsForSketchType('construction', [
      { attributeId: 'customVisualAxis', sketchHighlightForPinTypes: ['construction'] },
      { attributeId: 'ignored', sketchHighlightForPinTypes: ['material'] },
    ]);
    expect(merged).toEqual(expect.arrayContaining([...base, 'customVisualAxis']));
    expect(merged).not.toContain('ignored');
  });

  it('withVisualAxes adds color and sil to construction suggestions', () => {
    const ids = suggestedTzAttributeIdsForSketchType('construction');
    expect(ids).toContain('color');
    expect(ids).toContain('sil');
  });
});

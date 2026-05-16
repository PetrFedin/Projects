import {
  NON_APPAREL_SEWING_PATTERN_RESULT,
  nonApparelSewingPatternResult,
} from '@/lib/pattern-drafting/build-sewing-pattern';

describe('non-apparel sewing placeholder', () => {
  it('стабильная ссылка и пустой buildLog (не-одежда)', () => {
    expect(nonApparelSewingPatternResult()).toBe(NON_APPAREL_SEWING_PATTERN_RESULT);
    expect(NON_APPAREL_SEWING_PATTERN_RESULT.buildLog).toEqual([]);
    expect(NON_APPAREL_SEWING_PATTERN_RESULT.notes.length).toBe(1);
    expect(NON_APPAREL_SEWING_PATTERN_RESULT.svg).toContain('xmlns="http://www.w3.org/2000/svg"');
  });
});

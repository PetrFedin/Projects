import { w2RuMetkaCountLabel } from '../workshop2-phase1-dossier-panel-ru-count-label';

describe('w2RuMetkaCountLabel', () => {
  it('pluralizes 1, 2–4, 5+ and 11–19', () => {
    expect(w2RuMetkaCountLabel(1)).toBe('1 метка');
    expect(w2RuMetkaCountLabel(3)).toBe('3 метки');
    expect(w2RuMetkaCountLabel(5)).toBe('5 меток');
    expect(w2RuMetkaCountLabel(11)).toBe('11 меток');
  });
});

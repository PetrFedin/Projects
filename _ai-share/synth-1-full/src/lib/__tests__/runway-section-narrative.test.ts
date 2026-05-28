import { resolveSectionNarrative, setRunwayLocale } from '../runway/runway-i18n';

describe('resolveSectionNarrative', () => {
  afterEach(() => {
    setRunwayLocale('ru');
  });

  it('returns RU fallback from JSON fields', () => {
    expect(resolveSectionNarrative('silk-midi-dress', 0, 'title', 'Лёгкость шёлка')).toBe(
      'Лёгкость шёлка'
    );
  });

  it('returns EN translation when locale is en', () => {
    setRunwayLocale('en');
    expect(resolveSectionNarrative('silk-midi-dress', 0, 'title', 'Лёгкость шёлка')).toBe(
      'Silk lightness'
    );
  });
});

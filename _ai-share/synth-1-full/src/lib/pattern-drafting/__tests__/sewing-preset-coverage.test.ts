import { resolveSewingCategoryPreset } from '@/lib/pattern-drafting/sewing-category-presets';
import {
  enumerateSewingApparelLeafCombos,
  isGenericSewingBrandNote,
} from '@/lib/pattern-drafting/sewing-preset-coverage';

describe('sewing preset coverage (category-handbook L2/L3)', () => {
  it('для каждого листа в ветке «Одежда» resolveSewingCategoryPreset возвращает валидный пресет', () => {
    const combos = enumerateSewingApparelLeafCombos();
    expect(combos.length).toBeGreaterThan(5);
    for (const c of combos) {
      const p = resolveSewingCategoryPreset(c.l2, c.leafName);
      expect(p.primary).toBeTruthy();
      expect(p.ease.bust).toBeGreaterThan(0);
      expect(typeof p.forBrandNote).toBe('string');
    }
  });

  it('отчёт: доля «общего» пресета (для расширения эвристик)', () => {
    const combos = enumerateSewingApparelLeafCombos();
    const generic = combos.filter((c) =>
      isGenericSewingBrandNote(resolveSewingCategoryPreset(c.l2, c.leafName).forBrandNote)
    ).length;
    expect(generic).toBeGreaterThanOrEqual(0);
    expect(generic).toBeLessThanOrEqual(combos.length);
    // eslint-disable-next-line no-console
    console.info(
      `[sewing-preset-coverage] apparel leaves: ${combos.length}, generic fallback: ${generic} (${((100 * generic) / combos.length).toFixed(1)}%)`
    );
  });
});

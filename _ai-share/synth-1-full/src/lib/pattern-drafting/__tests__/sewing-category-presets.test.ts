import { resolveSewingCategoryPreset } from '@/lib/pattern-drafting/sewing-category-presets';
import { getSewingL2Options, getSewingL3Options, getSewingEffectiveLeaf } from '@/lib/pattern-drafting/sewing-apparel-category-tree';

const L1 = 'Одежда' as const;

describe('sewing category taxonomy + presets', () => {
  it('handbook-«Каталог»: есть группы L2 (одежда)', () => {
    expect(getSewingL2Options(L1).length).toBeGreaterThan(3);
  });

  it('Верхняя одежда: есть лист L3 (напр. Куртки)', () => {
    const l3 = getSewingL3Options(L1, 'Верхняя одежда');
    expect(l3).toContain('Куртки');
  });

  it('пресет для юбки ведёт на skirt_front', () => {
    const p = resolveSewingCategoryPreset('Юбки', 'Юбки');
    expect(p.primary).toBe('skirt_front');
  });

  it('пресет для пальто — усиленный ease', () => {
    const p = resolveSewingCategoryPreset('Верхняя одежда', 'Пальто');
    expect(p.ease.bust).toBeGreaterThan(6);
  });

  it('getSewingEffectiveLeaf соответствует pathLabel из снимка', () => {
    const { pathLabel, leafName } = getSewingEffectiveLeaf(L1, 'Платья и сарафаны', 'Платья');
    expect(pathLabel).toContain('Одежда');
    expect(pathLabel).toContain('Платья');
    expect(leafName).toBe('Платья');
  });

  it('пресет для «Платья и сарафаны» (L2 handbook) — платье/сарафан', () => {
    const pDress = resolveSewingCategoryPreset('Платья и сарафаны', 'Платья');
    expect(pDress.primary).toBe('bodice_front');
    const pSar = resolveSewingCategoryPreset('Платья и сарафаны', 'Сарафаны');
    expect(pSar.primary).toBe('bodice_front');
  });

  it('пресет свадебной линии — подпись и длина', () => {
    const p = resolveSewingCategoryPreset('Свадебные и вечерние платья', 'Свадебные платья');
    expect(p.forBrandNote).toContain('свадеб');
    expect(p.skirtLenCm).toBeGreaterThanOrEqual(95);
  });

  it('пресет носков/колгот — без классических вытачек', () => {
    const p = resolveSewingCategoryPreset('Носки и колготы', 'Носки');
    expect(p.darts.shoulderDart).toBe(false);
    expect(p.darts.waistDart).toBe(false);
  });
});

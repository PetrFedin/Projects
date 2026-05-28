import { buildDemoSewingPatternSvg } from '@/lib/pattern-drafting/build-demo-sewing-pattern-svg';
import {
  buildSewingPattern,
  defaultSewingDraftOptions,
} from '@/lib/pattern-drafting/build-sewing-pattern';

describe('buildDemoSewingPatternSvg / buildSewingPattern', () => {
  const m = { unit: 'cm' as const, bust: 90, waist: 72, hip: 98, shoulderWidth: 40 };

  it('возвращает валидный SVG и viewBox (совмест.)', () => {
    const darts = { shoulderDart: true, bustSideDart: false, waistDart: true };
    const bodice = buildDemoSewingPatternSvg(m, 'bodice_front', darts);
    expect(bodice.svg).toContain('<svg');
    expect(bodice.viewBox).toMatch(/^\d+(\.\d+)? \d+(\.\d+)? \d+(\.\d+)? \d+(\.\d+)?$/);
    expect(bodice.notes.length).toBeGreaterThan(0);
    const skirt = buildDemoSewingPatternSvg(m, 'skirt_front', darts);
    expect(skirt.svg).toContain('Юбка');
  });

  it('все 5 кроя дают SVG и buildLog', () => {
    const darts = { shoulderDart: true, bustSideDart: true, waistDart: true };
    const garments = [
      'bodice_front',
      'bodice_back',
      'skirt_front',
      'skirt_back',
      'sleeve',
    ] as const;
    for (const g of garments) {
      const r = buildSewingPattern(defaultSewingDraftOptions({ measures: m, garment: g, darts }));
      expect(r.svg).toContain('path d=');
      expect(r.buildLog.length).toBeGreaterThan(0);
    }
  });
});

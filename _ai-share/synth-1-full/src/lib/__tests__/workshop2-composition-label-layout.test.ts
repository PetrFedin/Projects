import {
  buildDefaultCompositionLabelLayoutElements,
  ensureCompositionLabelLayoutElements,
  normalizeCompositionLabelLayoutElement,
} from '@/lib/production/workshop2-composition-label-layout';

describe('workshop2-composition-label-layout', () => {
  it('buildDefault returns logo, care, text', () => {
    const els = buildDefaultCompositionLabelLayoutElements();
    expect(els).toHaveLength(3);
    expect(els.map((e) => e.kind)).toEqual(['logo', 'careStrip', 'text']);
    const byId = Object.fromEntries(els.map((e) => [e.elementId, e]));
    expect(byId['layout-el-logo']?.kind).toBe('logo');
    expect(byId['layout-el-care']?.kind).toBe('careStrip');
    expect(byId['layout-el-text']?.kind).toBe('text');
  });

  it('ensure uses defaults when empty', () => {
    expect(ensureCompositionLabelLayoutElements(undefined)).toHaveLength(3);
    expect(ensureCompositionLabelLayoutElements([])).toHaveLength(3);
  });

  it('ensure sorts by zIndex', () => {
    const sorted = ensureCompositionLabelLayoutElements(buildDefaultCompositionLabelLayoutElements());
    expect(sorted.map((e) => e.kind)).toEqual(['text', 'careStrip', 'logo']);
  });

  it('normalize clamps geometry', () => {
    const el = normalizeCompositionLabelLayoutElement({
      elementId: 'x',
      kind: 'text',
      xPct: 95,
      yPct: 95,
      wPct: 50,
      hPct: 50,
      rotationDeg: 400,
      fontSizePx: 2,
      fontWeight: 'bold',
    });
    expect(el.xPct + el.wPct).toBeLessThanOrEqual(100);
    expect(el.yPct + el.hPct).toBeLessThanOrEqual(100);
    expect(el.rotationDeg).toBe(180);
    expect(el.fontSizePx).toBe(6);
  });
});

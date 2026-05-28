import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  collectColorBundlePaletteNeedles,
  extractHex6,
  extractTwoHexesFromCss,
  normalizeCatalogHex,
  normalizeRuColorMatch,
  split100,
  suggestHexFromPrimaryLabels,
  suggestPaletteFromPrimaryLabels,
} from '../workshop2-phase1-dossier-panel-color-mat-helpers';

describe('workshop2-phase1-dossier-panel-color-mat-helpers', () => {
  it('normalizeRuColorMatch maps ё to е', () => {
    expect(normalizeRuColorMatch('Чёрный')).toBe('черный');
  });

  it('suggestPaletteFromPrimaryLabels matches Russian black family', () => {
    const hit = suggestPaletteFromPrimaryLabels(
      ['чёрный'],
      [{ parameterId: 'p1', label: 'Черный графит' }]
    );
    expect(hit?.parameterId).toBe('p1');
  });

  it('suggestHexFromPrimaryLabels returns fallback for white family', () => {
    expect(suggestHexFromPrimaryLabels(['белый пух'])).toBe('#f8fafc');
  });

  it('normalizeCatalogHex validates 6-digit hex', () => {
    expect(normalizeCatalogHex('#AbCdef')).toBe('#abcdef');
    expect(normalizeCatalogHex('#abc')).toBeUndefined();
  });

  it('extractHex6 and extractTwoHexesFromCss parse CSS strings', () => {
    expect(extractHex6('x #1a2b3c y')).toBe('#1a2b3c');
    expect(extractTwoHexesFromCss('linear-gradient(#111111, #222222)'))?.toEqual({
      a: '#111111',
      b: '#222222',
    });
  });

  it('split100 distributes remainder round-robin', () => {
    expect(split100(3)).toEqual([34, 33, 33]);
  });

  it('collectColorBundlePaletteNeedles reads passport color attrs', () => {
    let d = emptyWorkshop2DossierPhase1();
    d = {
      ...d,
      assignments: [
        {
          assignmentId: 'a1',
          kind: 'canonical',
          attributeId: 'primaryColorFamilyOptions',
          values: [
            {
              valueId: 'v1',
              valueSource: 'handbook_parameter',
              parameterId: 'p',
              displayLabel: 'Navy Blue / графит',
            },
          ],
        },
      ],
    };
    const needles = collectColorBundlePaletteNeedles(d);
    expect(needles).toContain('navy');
    expect(needles).toContain('blue');
  });
});

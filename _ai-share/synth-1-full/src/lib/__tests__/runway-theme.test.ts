import {
  buildRunwayThemeStyle,
  resolveRunwayTheme,
  runwayThemeClassName,
} from '../runway/runway-theme';
import type { Product } from '../types';

const product: Product = {
  id: '1',
  slug: 'themed',
  name: 'Themed',
  brand: 'Test',
  price: 100,
  description: 'd',
  images: [],
  category: 'Tops',
  sustainability: [],
  sku: 'S',
  color: 'X',
  season: 'SS',
  runwayTheme: { accentColor: '#E11D48', panelStyle: 'glass' },
};

describe('runway-theme', () => {
  it('resolveRunwayTheme — читает из product', () => {
    expect(resolveRunwayTheme(product).accentColor).toBe('#E11D48');
  });

  it('buildRunwayThemeStyle — CSS variables accent + glass', () => {
    const style = buildRunwayThemeStyle(resolveRunwayTheme(product));
    expect(style['--runway-accent']).toBe('#E11D48');
    expect(style['--runway-panel-blur']).toBe('12px');
  });

  it('runwayThemeClassName — solid vs glass', () => {
    expect(runwayThemeClassName({ panelStyle: 'solid' })).toBe('runway-theme-solid');
    expect(runwayThemeClassName({ panelStyle: 'glass' })).toBe('runway-theme-glass');
    expect(runwayThemeClassName({})).toBe('');
  });

  it('buildRunwayThemeStyle — solid panel без blur', () => {
    const style = buildRunwayThemeStyle({ panelStyle: 'solid' });
    expect(style['--runway-panel-blur']).toBe('0px');
  });
});

import type { CSSProperties } from 'react';
import type { Product, RunwayTheme } from '@/lib/types';

/** CSS-переменные runway theme на корне switcher. */
export function resolveRunwayTheme(product: Product): RunwayTheme {
  return product.runwayTheme ?? {};
}

export function buildRunwayThemeStyle(theme: RunwayTheme): CSSProperties {
  const style: CSSProperties & Record<string, string> = {};

  if (theme.accentColor) {
    style['--runway-accent'] = theme.accentColor;
  }

  if (theme.panelStyle === 'solid') {
    style['--runway-panel-bg'] = 'hsl(var(--background))';
    style['--runway-panel-blur'] = '0px';
  } else if (theme.panelStyle === 'glass') {
    style['--runway-panel-bg'] = 'hsl(var(--background) / 0.88)';
    style['--runway-panel-blur'] = '12px';
  }

  return style;
}

export function runwayThemeClassName(theme: RunwayTheme): string {
  if (theme.panelStyle === 'solid') return 'runway-theme-solid';
  if (theme.panelStyle === 'glass') return 'runway-theme-glass';
  return '';
}

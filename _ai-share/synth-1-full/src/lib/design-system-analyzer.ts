/**
 * Design System Analyzer
 * Analyzes and normalizes styles based on design system tokens.
 */

import { designTokens } from './design-tokens';

export const normalizeSpacing = (cls: string): string => {
  // Normalize Tailwind spacing classes to fit our preferred scale
  const parts = cls.split('-');
  if (parts.length < 2) return cls;

  const prefix = parts[0];
  const side = parts.length === 3 ? parts[1] : '';
  const valStr = parts[parts.length - 1];
  const val = parseInt(valStr);

  if (isNaN(val)) return cls;

  // Normalization logic: prefer p-4/p-3 for containers, reduce p-6 to p-4
  if (prefix === 'p' || prefix === 'px' || prefix === 'py') {
    if (val > 6) return `${prefix === 'p' ? 'p' : prefix}-${6}`; // Max p-6 (24px)
    if (val === 5 || val === 6) return `${prefix === 'p' ? 'p' : prefix}-4`; // 16px
  }

  if (prefix === 'space' && side === 'y') {
    if (val > 8) return `space-y-6`; // Max space-y-6 (24px) for layouts
    if (val === 4 || val === 5) return `space-y-3`; // Tighter spacing
  }

  return cls;
};

export const normalizeTypography = (cls: string): string => {
  if (!cls.startsWith('text-')) return cls;

  const val = cls.split('-')[1];

  // Normalize oversized text to design system titles
  if (['3xl', '4xl', '5xl', '6xl', '7xl', '8xl'].includes(val)) {
    return 'text-2xl font-bold tracking-tight'; // Standard Page Title
  }

  if (val === 'xl') return 'text-lg font-semibold tracking-tight'; // Standard Section Title

  return cls;
};

export const normalizeRadius = (cls: string): string => {
  if (!cls.startsWith('rounded-')) return cls;
  if (cls === 'rounded-full') return cls;

  const val = cls.split('-')[1];
  if (val === '2xl' || val === '3xl') return 'rounded-xl'; // Normalize to 12px
  if (!val || val === 'md') return 'rounded-lg'; // Normalize to 8px

  return cls;
};

export const normalizeComponentVariant = (
  componentType: 'button' | 'card' | 'input',
  classes: string
): string => {
  let result = classes;

  // Systematic normalization of cards
  if (componentType === 'card') {
    result = result.replace(/p-\d+/g, 'p-4'); // Standard padding
    result = result.replace(/rounded-\w+/g, 'rounded-xl'); // Standard radius
    result = result.replace(/shadow-\w+/g, 'shadow-sm'); // Minimal clutter
    result = result.replace(/border-\w+/g, 'border-slate-100'); // Standard border
  }

  return result;
};

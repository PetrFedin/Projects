/**
 * Design Tokens for the Synth-1 Premium SaaS UI System.
 * These tokens define the standardized scales for spacing, radius, and typography.
 */

export const spacing = {
  '4': '4px',
  '8': '8px',
  '12': '12px',
  '16': '16px',
  '20': '20px',
  '24': '24px',
  '32': '32px',
  '40': '40px',
  '48': '48px',
};

export const borderRadius = {
  '8': '8px',
  '12': '12px',
  '16': '16px',
};

export const typography = {
  pageTitle: {
    fontSize: 'text-2xl',
    fontWeight: 'font-bold',
    tracking: 'tracking-tight',
  },
  sectionTitle: {
    fontSize: 'text-lg',
    fontWeight: 'font-semibold',
    tracking: 'tracking-tight',
  },
  cardTitle: {
    fontSize: 'text-base',
    fontWeight: 'font-semibold',
  },
  bodyText: {
    fontSize: 'text-sm',
    fontWeight: 'font-normal',
  },
  caption: {
    fontSize: 'text-[12px]',
    fontWeight: 'font-medium',
  },
  label: {
    fontSize: 'text-[10px]',
    fontWeight: 'font-bold',
    tracking: 'tracking-widest',
    transform: 'uppercase',
  },
};

/** Tailwind class fragments aligned with `tailwind.config` semantic colors (`text-text-*`, `bg-bg-*`, `accent-primary`). */
export const colors = {
<<<<<<< HEAD
  primary: 'slate-900',
  secondary: 'slate-500',
  accent: 'indigo-600',
  border: 'slate-200',
  surface: 'slate-50',
  background: 'white',
=======
  primary: 'text-text-primary',
  secondary: 'text-text-secondary',
  accent: 'text-accent-primary',
  border: 'border-border-default',
  surface: 'bg-bg-surface2',
  background: 'bg-bg-surface',
>>>>>>> recover/cabinet-wip-from-stash
};

export const designTokens = {
  spacing,
  borderRadius,
  typography,
  colors,
};

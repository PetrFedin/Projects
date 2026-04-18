/**
 * UI Refinement Engine
 * Applies systematic improvements to achieve a 25-30% more compact and professional UI.
 */

import { normalizeSpacing, normalizeTypography, normalizeRadius } from './design-system-analyzer';

export interface RefinementOptions {
  density: number; // 0-1, 1 is most dense
  hierarchy: number; // 0-1, 1 is most clear
  clutterReduction: number; // 0-1, 1 is most minimal
}

export const refineLayoutClasses = (
  classes: string,
  options: RefinementOptions = { density: 1, hierarchy: 1, clutterReduction: 1 }
): string => {
  let refined = classes;

  // 1. Spacing Normalization
  refined = refined
    .split(' ')
    .map((cls) => normalizeSpacing(cls))
    .join(' ');

  // 2. Typography Normalization
  refined = refined
    .split(' ')
    .map((cls) => normalizeTypography(cls))
    .join(' ');

  // 3. Radius Normalization
  refined = refined
    .split(' ')
    .map((cls) => normalizeRadius(cls))
    .join(' ');

  // 4. Density-specific refinements (e.g. reducing vertical space-y-X)
  if (options.density > 0.5) {
    refined = refined.replace(/space-y-8/g, 'space-y-6');
    refined = refined.replace(/space-y-6/g, 'space-y-4');
    refined = refined.replace(/p-8/g, 'p-6');
    refined = refined.replace(/p-6/g, 'p-4');
    refined = refined.replace(/px-8/g, 'px-6');
    refined = refined.replace(/px-6/g, 'px-4');
  }

  // 5. Clutter Reduction
  if (options.clutterReduction > 0.5) {
    refined = refined.replace(/shadow-lg/g, 'shadow-sm');
    refined = refined.replace(/shadow-md/g, 'shadow-sm');
    refined = refined.replace(/border-slate-300/g, 'border-slate-100');
    refined = refined.replace(/border-slate-200/g, 'border-slate-100');
  }

  return refined;
};

export const refineToolbar = (classes: string): string => {
  return refineLayoutClasses(
    classes +
      ' flex items-center justify-between gap-2 p-1 bg-slate-100 border border-slate-200 rounded-xl shadow-inner',
    { density: 1, hierarchy: 1, clutterReduction: 1 }
  );
};

export const refineTableRows = (classes: string): string => {
  return refineLayoutClasses(
    classes + ' h-10 border-b border-slate-50 hover:bg-slate-50/50 transition-all group',
    { density: 1, hierarchy: 1, clutterReduction: 1 }
  );
};

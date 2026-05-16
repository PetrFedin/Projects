import type { SewingPatternGarmentBlock } from '@/lib/pattern-drafting/sewing-pattern.types';

/** Пресет эвристики кроя по таксономии L2 + имя листа. */
export type SewingCategoryPreset = {
  summary: string;
  primary: SewingPatternGarmentBlock;
  alternates: SewingPatternGarmentBlock[];
  ease: { bust: number; waist: number; hip: number };
  darts: { shoulderDart: boolean; bustSideDart: boolean; waistDart: boolean };
  skirtLenCm: number;
  neckDropCm: number;
  forBrandNote: string;
};

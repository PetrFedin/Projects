import type { Product } from '@/lib/types';
import type { FabricSpecExtract } from './types';

function parseGsm(raw: unknown): number | null {
  if (typeof raw === 'number' && raw > 0 && raw < 2000) return Math.round(raw);
  if (typeof raw === 'string') {
    const m = raw.match(/(\d{2,4})\s*g\/?m²?/i) || raw.match(/^(\d{2,4})$/);
    if (m) return Math.min(2000, parseInt(m[1], 10));
  }
  return null;
}

/** Плотность и конструкция полотна из PIM. */
export function extractFabricSpec(product: Product): FabricSpecExtract | null {
  const a = product.attributes ?? {};
  const gsm =
    parseGsm(a.gsm) ?? parseGsm(a.fabricGsm) ?? parseGsm(a.fabricWeight) ?? parseGsm(a.weightGsm);
  const construction =
    typeof a.fabricConstruction === 'string'
      ? a.fabricConstruction
      : typeof a.weave === 'string'
        ? a.weave
        : typeof a.knitType === 'string'
          ? a.knitType
          : '';
  const handfeelNote =
    typeof a.handfeel === 'string'
      ? a.handfeel
      : typeof a.fabricHand === 'string'
        ? a.fabricHand
        : '';
  if (gsm == null && !construction.trim() && !handfeelNote.trim()) return null;
  return { gsm, construction: construction.trim(), handfeelNote: handfeelNote.trim() };
}

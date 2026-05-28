import {
  getSewingL1Options,
  getSewingL2Options,
  getSewingL3Options,
  getSewingEffectiveLeaf,
} from '@/lib/pattern-drafting/sewing-apparel-category-tree';
import { GENERIC_SEWING_PRESET_BRAND_NOTE } from '@/lib/pattern-drafting/sewing-category-presets';

export type SewingLeafCombo = { l1: string; l2: string; l3: string; leafName: string };

/** Все комбинации (L1, L2, L3) из снимка category-handbook, где L1 = «Одежда» (аудитория как в воркспейсе). */
export function enumerateSewingApparelLeafCombos(): SewingLeafCombo[] {
  const l1s = getSewingL1Options();
  const l1 = l1s.find((x) => x === 'Одежда') ?? l1s[0];
  if (!l1) return [];
  const out: SewingLeafCombo[] = [];
  for (const l2 of getSewingL2Options(l1)) {
    const l3s = getSewingL3Options(l1, l2);
    if (l3s.length === 0) {
      const { leafName } = getSewingEffectiveLeaf(l1, l2, '');
      out.push({ l1, l2, l3: '', leafName });
      continue;
    }
    for (const l3 of l3s) {
      const { leafName } = getSewingEffectiveLeaf(l1, l2, l3);
      out.push({ l1, l2, l3, leafName });
    }
  }
  return out;
}

export function isGenericSewingBrandNote(forBrandNote: string): boolean {
  return forBrandNote.trim() === GENERIC_SEWING_PRESET_BRAND_NOTE;
}

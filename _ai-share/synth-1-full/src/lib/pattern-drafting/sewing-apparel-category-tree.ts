import {
  findHandbookLeafById,
  getHandbookCategoryLeaves,
  handbookL1OptionsForAudience,
  handbookL2OptionsForAudience,
  handbookL3OptionsForAudience,
  handbookLeafIdFromL123,
  resolveHandbookLeafId,
} from '@/lib/production/category-handbook-leaves';

/**
 * Справочник Syntha: те же `leafId`, что в category-handbook / бренд-MES, аудитория `catalog` («Каталог»).
 */
export const SEWING_APPAREL_L1 = 'Одежда' as const;
export const SEWING_HANDBOOK_AUDIENCE = 'catalog' as const;

const AUD = SEWING_HANDBOOK_AUDIENCE;
function leaves() {
  return getHandbookCategoryLeaves();
}

export function getSewingL1Options(): string[] {
  return handbookL1OptionsForAudience(leaves(), AUD);
}

export function getSewingL2Options(l1: string): string[] {
  if (!l1) return [];
  return handbookL2OptionsForAudience(leaves(), AUD, l1);
}

export function getSewingL3Options(l1: string, l2: string): string[] {
  if (!l1 || !l2) return [];
  return handbookL3OptionsForAudience(leaves(), AUD, l1, l2);
}

/**
 * Стабилизирует (l1,l2,l3) по спискам L3; возвращает подписи и канонический `leafId` из снимка.
 * Для `l3Name === "—"` в пресетах `leafName` = ур.2 (как визуальное имя «листа»).
 */
export function getSewingEffectiveLeaf(
  l1: string,
  l2: string,
  l3: string
): { leafName: string; pathLabel: string; leafId: string | undefined } {
  const l3opts = getSewingL3Options(l1, l2);
  const l3eff = l3opts.length > 0 ? (l3 && l3opts.includes(l3) ? l3 : l3opts[0]!) : '';
  const rawId = l3eff ? handbookLeafIdFromL123(leaves(), AUD, l1, l2, l3eff) : undefined;
  const leaf = rawId ? findHandbookLeafById(rawId) : undefined;
  const pathLabel = leaf?.pathLabel ?? [l1, l2, l3eff || undefined].filter(Boolean).join(' › ');
  const leafName = l3eff === '—' || l3eff === '' ? l2 : l3eff;
  return { leafName, pathLabel, leafId: rawId ? resolveHandbookLeafId(rawId) : undefined };
}

/** true, если для пары (l1,l2) нет строк в снимке (неожиданно). */
export function isLeafOnlyAtL2(l1: string, l2: string): boolean {
  return getSewingL3Options(l1, l2).length === 0;
}

/** Стартовый выбор: первый лист в ветке «Одежда» (как в демо кроя). */
export function getDefaultSewingCategorySelection(): {
  l1: string;
  l2: string;
  l3: string;
  leafId: string;
} {
  const l1s = getSewingL1Options();
  const l1 = l1s.includes('Одежда') ? 'Одежда' : (l1s[0] ?? 'Одежда');
  const l2s = getSewingL2Options(l1);
  const l2 = l2s[0] ?? '';
  const l3s = getSewingL3Options(l1, l2);
  const l3 = l3s[0] ?? '';
  const { leafId } = getSewingEffectiveLeaf(l1, l2, l3);
  return { l1, l2, l3, leafId: leafId ?? '' };
}

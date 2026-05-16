/** Ё→е: иначе «чёрный» не попадает в /черн/ и не матчится с подписями палитры. */
export function normalizeRuColorMatch(s: string): string {
  return s.toLowerCase().replace(/ё/g, 'е');
}

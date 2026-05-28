/**
 * Стабильные slug'и демо Workshop2 (коллекция / артикулы).
 * Не подставлять «сырые» числовые id из каталога в e2e — только эти slug'и и контракт API.
 */
export const W2_DEMO_COLLECTION_SLUG = 'SS27' as const;

/** Полное демо ТЗ (merge SS27 при пустом LS). */
export const W2_DEMO_ARTICLE_TZ_FULL_SLUG = 'demo-ss27-01' as const;

/** Пустое досье, SKU SS27-W-DRS-02, подсказка canonical tech pack. */
export const W2_DEMO_ARTICLE_TZ_CANON_SLUG = 'demo-ss27-02' as const;

/** Ключ записи досье в `localStorage` (как в `Workshop2Phase1DossierPanel`). */
export const W2_DOSSIER_LOCAL_STORAGE_KEY = 'synth.brand.workshop2Phase1Dossier.v1' as const;

export function w2DossierStorageMapKey(collectionSlug: string, articleSlug: string): string {
  return `${collectionSlug}::${articleSlug}`;
}

export function w2BrandProductionArticlePath(
  articleSlug: string,
  query?: Record<string, string | undefined>
): string {
  const base = `/brand/production/workshop2/c/${W2_DEMO_COLLECTION_SLUG}/a/${articleSlug}`;
  if (!query || !Object.keys(query).length) return base;
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v != null && v !== '') sp.set(k, v);
  }
  const qs = sp.toString();
  return qs ? `${base}?${qs}` : base;
}

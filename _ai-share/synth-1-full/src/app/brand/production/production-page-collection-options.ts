/** Уникальные сезоны из каталога продуктов для селектора коллекций. */
export function deriveCollectionSeasonOptionsFromProducts(products: unknown): string[] {
  const seasons = new Set<string>();
  for (const p of products as Array<{ season?: unknown }>) {
    if (p.season && typeof p.season === 'string' && p.season.trim()) {
      seasons.add(p.season.trim());
    }
  }
  return Array.from(seasons).sort();
}

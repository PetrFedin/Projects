export type LocalRemovableArticleRow = { id: string; sku: string };

/** Артикулы с id `local-*` для UI удаления черновиков. */
export function buildLocalRemovableArticlesFromItems(
  items: Array<{ id?: unknown; sku?: unknown }>
): LocalRemovableArticleRow[] {
  return items
    .filter((it) => String(it.id ?? '').startsWith('local-'))
    .map((it) => ({ id: String(it.id), sku: String(it.sku ?? it.id) }));
}

/**
 * Фильтрация плоского хаба артикулов (поиск, теги, категории L1–L3, один артикул).
 * Вынесено из UI для unit-тестов и единообразия с batch readiness.
 */

export const WORKSHOP2_HUB_ARTICLE_FILTER_ALL = '__all__' as const;

export type Workshop2HubFilterableRow = {
  id: string;
  sku?: string;
  name?: string;
  internalArticleCode?: string;
  audienceLabel?: string;
  categoryL1?: string;
  categoryL2?: string;
  categoryL3?: string;
  season?: string;
  workshopLineSeason?: string;
  workshopTags?: string[];
};

export type Workshop2HubFilterableEntry = {
  collectionId: string;
  collectionName: string;
  hubGroupTagLabel?: string;
  row: Workshop2HubFilterableRow;
};

export type Workshop2HubFilterState = {
  search: string;
  tagFilter: ReadonlySet<string>;
  articleFilter: string;
  catL1: string;
  catL2: string;
  catL3: string;
};

/** Обогащение карточки хаба для readiness/gold/sample (ключ `collectionId::articleId`). */
export type Workshop2HubEntryEnrichment = {
  tzOverallPct?: number;
  goldApproved?: boolean;
  hasSampleOrder?: boolean;
};

export type Workshop2HubFilterAdvanced = {
  minTzPct?: number;
  goldApprovedOnly?: boolean;
  hasSampleOrderOnly?: boolean;
};

export function hubEntryEnrichmentKey(collectionId: string, articleId: string): string {
  return `${collectionId}::${articleId}`;
}

/** Сужает список карточек хаба по активным фильтрам (без articleStatusFilter — он на уровне scope). */
export function filterWorkshop2HubEntries<T extends Workshop2HubFilterableEntry>(
  entries: T[],
  state: Workshop2HubFilterState,
  advanced?: Workshop2HubFilterAdvanced,
  enrichmentByKey?: Record<string, Workshop2HubEntryEnrichment>
): T[] {
  const q = state.search.trim().toLowerCase();
  const narrowed = entries.filter((e) => {
    if (
      state.articleFilter !== WORKSHOP2_HUB_ARTICLE_FILTER_ALL &&
      `${e.collectionId}::${e.row.id}` !== state.articleFilter
    ) {
      return false;
    }
    if (state.catL1 && (e.row.categoryL1?.trim() || '') !== state.catL1) return false;
    if (state.catL2 && (e.row.categoryL2?.trim() || '') !== state.catL2) return false;
    if (state.catL3 && (e.row.categoryL3?.trim() || '') !== state.catL3) return false;
    return true;
  });

  const tagPick = (e: T) => {
    if (state.tagFilter.size === 0) return true;
    const tags = e.row.workshopTags ?? [];
    for (const t of state.tagFilter) {
      if (tags.includes(t)) return true;
    }
    return false;
  };

  const withTags = state.tagFilter.size === 0 ? narrowed : narrowed.filter((e) => tagPick(e));

  const withAdvanced = withTags.filter((e) => {
    if (!advanced && !enrichmentByKey) return true;
    const key = hubEntryEnrichmentKey(e.collectionId, e.row.id);
    const en = enrichmentByKey?.[key];
    if (advanced?.goldApprovedOnly && !en?.goldApproved) return false;
    if (advanced?.hasSampleOrderOnly && !en?.hasSampleOrder) return false;
    if (
      advanced?.minTzPct != null &&
      advanced.minTzPct > 0 &&
      (en?.tzOverallPct ?? 0) < advanced.minTzPct
    ) {
      return false;
    }
    return true;
  });

  if (!q) return withAdvanced;

  return withAdvanced.filter((e) => {
    const r = e.row;
    const hay = [
      r.sku,
      r.name,
      r.internalArticleCode,
      r.audienceLabel,
      r.categoryL1,
      r.categoryL2,
      r.categoryL3,
      r.season,
      r.workshopLineSeason,
      e.collectionName,
      e.hubGroupTagLabel,
      ...(r.workshopTags ?? []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return hay.includes(q);
  });
}

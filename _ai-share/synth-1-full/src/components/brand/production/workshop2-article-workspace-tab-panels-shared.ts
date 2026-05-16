export function newW2ArticleTabPanelRowId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `r_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/** Базовые стили полей ввода вкладок supply / plan / qc и т.д. */
export const W2_ARTICLE_WORKSPACE_TAB_FIELD_CLASS =
  'flex h-8 w-full rounded-md border border-border-default bg-white px-2 text-[12px] text-text-primary shadow-sm placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-primary';

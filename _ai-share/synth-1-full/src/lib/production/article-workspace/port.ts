import type { ArticleRef, ArticleWorkspaceBundle, ArticleWorkspaceDataMode } from './types';

/**
 * Единая точка загрузки/сохранения снимков вкладок артикула.
 * Локальная реализация — localStorage; HTTP — позже через тот же интерфейс.
 */
export interface ArticleWorkspaceDataPort {
  readonly mode: ArticleWorkspaceDataMode;
  loadBundle(ref: ArticleRef): Promise<ArticleWorkspaceBundle>;
  /** Частичное обновление: указанные ключи заменяют существующие снимки целиком. */
  mergeBundle(
    ref: ArticleRef,
    patch: Partial<ArticleWorkspaceBundle>
  ): Promise<ArticleWorkspaceBundle>;
}

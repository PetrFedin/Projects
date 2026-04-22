import type { ArticleRef, ArticleWorkspaceBundle } from './types';
import type { ArticleWorkspaceDataPort } from './port';
import { loadArticleWorkspaceBundle, saveArticleWorkspaceBundle } from './local-bundle';
import { normalizeArticleWorkspaceBundle } from './normalize-bundle';

export function createLocalArticleWorkspacePort(): ArticleWorkspaceDataPort {
  return {
    mode: 'local',
    async loadBundle(ref: ArticleRef): Promise<ArticleWorkspaceBundle> {
      const raw = loadArticleWorkspaceBundle(ref);
      return normalizeArticleWorkspaceBundle(ref, { ...raw, schemaVersion: 1 });
    },
    async mergeBundle(
      ref: ArticleRef,
      patch: Partial<ArticleWorkspaceBundle>
    ): Promise<ArticleWorkspaceBundle> {
      const cur = loadArticleWorkspaceBundle(ref);
      const merged: ArticleWorkspaceBundle = {
        ...cur,
        ...patch,
        schemaVersion: 1,
        updatedAt: new Date().toISOString(),
      };
      saveArticleWorkspaceBundle(ref, merged);
      return normalizeArticleWorkspaceBundle(ref, merged);
    },
  };
}

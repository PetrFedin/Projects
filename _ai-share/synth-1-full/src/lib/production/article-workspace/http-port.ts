import type { ArticleRef, ArticleWorkspaceBundle } from './types';
import type { ArticleWorkspaceDataPort } from './port';
import { normalizeArticleWorkspaceBundle } from './normalize-bundle';

export type ArticleWorkspaceHttpPortOptions = {
  baseUrl: string;
  getToken?: () => string | null;
};

/**
 * Реализация ArticleWorkspaceDataPort, работающая через HTTP API.
 */
export function createHttpArticleWorkspacePort(
  opts: ArticleWorkspaceHttpPortOptions
): ArticleWorkspaceDataPort {
  return {
    mode: 'http',
    async loadBundle(ref: ArticleRef): Promise<ArticleWorkspaceBundle> {
      const url = new URL(opts.baseUrl, window.location.origin);
      url.searchParams.set('collectionId', ref.collectionId);
      url.searchParams.set('articleId', ref.articleId);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (opts.getToken) {
        const token = opts.getToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(url.toString(), { headers });
      if (!res.ok) {
        if (res.status === 404) {
          return normalizeArticleWorkspaceBundle(ref, { schemaVersion: 1 });
        }
        throw new Error(`ArticleWorkspace HTTP loadBundle failed: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      return normalizeArticleWorkspaceBundle(ref, data);
    },
    async mergeBundle(
      ref: ArticleRef,
      patch: Partial<ArticleWorkspaceBundle>
    ): Promise<ArticleWorkspaceBundle> {
      const url = new URL(opts.baseUrl, window.location.origin);
      url.searchParams.set('collectionId', ref.collectionId);
      url.searchParams.set('articleId', ref.articleId);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (opts.getToken) {
        const token = opts.getToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(url.toString(), {
        method: 'POST',
        headers,
        body: JSON.stringify(patch),
      });

      if (!res.ok) {
        throw new Error(
          `ArticleWorkspace HTTP mergeBundle failed: ${res.status} ${res.statusText}`
        );
      }

      const data = await res.json();
      return normalizeArticleWorkspaceBundle(ref, data);
    },
  };
}

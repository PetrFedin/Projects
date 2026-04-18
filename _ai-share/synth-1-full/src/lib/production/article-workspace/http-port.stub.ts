import type { ArticleRef, ArticleWorkspaceBundle } from './types';
import type { ArticleWorkspaceDataPort } from './port';

export type ArticleWorkspaceHttpPortOptions = {
  baseUrl: string;
  getToken?: () => string | null;
};

/**
 * Заготовка под API: заменит тело методов на fetch к `/collections/:id/articles/:id/workspace`.
 * Пока не подключать в UI — только контракт.
 */
export function createHttpArticleWorkspacePort(
  _opts: ArticleWorkspaceHttpPortOptions
): ArticleWorkspaceDataPort {
  return {
    mode: 'http',
    async loadBundle(_ref: ArticleRef): Promise<ArticleWorkspaceBundle> {
      throw new Error(
        'ArticleWorkspace HTTP: не реализовано. Используйте createLocalArticleWorkspacePort() или задайте реализацию в bootstrap.'
      );
    },
    async mergeBundle(
      _ref: ArticleRef,
      _patch: Partial<ArticleWorkspaceBundle>
    ): Promise<ArticleWorkspaceBundle> {
      throw new Error(
        'ArticleWorkspace HTTP: не реализовано. Используйте createLocalArticleWorkspacePort() или задайте реализацию в bootstrap.'
      );
    },
  };
}

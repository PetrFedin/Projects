'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { ArticleRef, ArticleWorkspaceBundle } from '@/lib/production/article-workspace/types';
import { normalizeArticleWorkspaceBundle } from '@/lib/production/article-workspace/normalize-bundle';
import { getArticleWorkspaceDataPort } from '@/lib/production/article-workspace/registry';

type ArticleWorkspaceContextValue = {
  ref: ArticleRef;
  bundle: ArticleWorkspaceBundle | null;
  loading: boolean;
  dataMode: 'local' | 'http';
  reload: () => Promise<void>;
  mergeBundle: (patch: Partial<ArticleWorkspaceBundle>) => Promise<ArticleWorkspaceBundle>;
};

const ArticleWorkspaceContext = createContext<ArticleWorkspaceContextValue | null>(null);

export function ArticleWorkspaceProvider({
  articleRef,
  children,
}: {
  articleRef: ArticleRef;
  children: ReactNode;
}) {
  /** Без useMemo: при подмене порта через `setArticleWorkspaceDataPort` следующий рендер подхватит актуальный. */
  const port = getArticleWorkspaceDataPort();
  const [bundle, setBundle] = useState<ArticleWorkspaceBundle | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const b = await port.loadBundle(articleRef);
      setBundle(b);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[article-workspace] loadBundle failed:', err);
      }
      setBundle(normalizeArticleWorkspaceBundle(articleRef, { schemaVersion: 1 }));
    } finally {
      setLoading(false);
    }
  }, [port, articleRef]);

  useEffect(() => {
    void reload();
  }, [reload, articleRef.collectionId, articleRef.articleId]);

  const mergeBundle = useCallback(
    async (patch: Partial<ArticleWorkspaceBundle>) => {
      const next = await port.mergeBundle(articleRef, patch);
      setBundle(next);
      return next;
    },
    [port, articleRef]
  );

  const value = useMemo<ArticleWorkspaceContextValue>(
    () => ({
      ref: articleRef,
      bundle,
      loading,
      dataMode: port.mode,
      reload,
      mergeBundle,
    }),
    [articleRef, bundle, loading, port, reload, mergeBundle]
  );

  return (
    <ArticleWorkspaceContext.Provider value={value}>{children}</ArticleWorkspaceContext.Provider>
  );
}

export function useArticleWorkspace(): ArticleWorkspaceContextValue {
  const ctx = useContext(ArticleWorkspaceContext);
  if (!ctx) {
    throw new Error('useArticleWorkspace must be used within ArticleWorkspaceProvider');
  }
  return ctx;
}

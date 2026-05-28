'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import type { ArticleRef, ArticleWorkspaceBundle } from '@/lib/production/article-workspace/types';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { normalizeArticleWorkspaceBundle } from '@/lib/production/article-workspace/normalize-bundle';
import { getArticleWorkspaceDataPort } from '@/lib/production/article-workspace/registry';

type ArticleWorkspaceContextValue = {
  ref: ArticleRef;
  bundle: ArticleWorkspaceBundle | null;
  /** Phase-1 досье артикула (localStorage + опциональный poll с API). */
  dossier: Workshop2DossierPhase1 | null;
  setDossier: Dispatch<SetStateAction<Workshop2DossierPhase1 | null>>;
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
  const collectionId = articleRef.collectionId;
  const articleId = articleRef.articleId;
  const [bundle, setBundle] = useState<ArticleWorkspaceBundle | null>(null);
  const [dossier, setDossier] = useState<Workshop2DossierPhase1 | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const ref = { collectionId, articleId };
    setLoading(true);
    try {
      const b = await port.loadBundle(ref);
      setBundle(b);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[article-workspace] loadBundle failed:', err);
      }
      setBundle(normalizeArticleWorkspaceBundle(ref, { schemaVersion: 1 }));
    } finally {
      setLoading(false);
    }
  }, [port, collectionId, articleId]);

  useEffect(() => {
    void reload();
  }, [reload, collectionId, articleId]);

  const mergeBundle = useCallback(
    async (patch: Partial<ArticleWorkspaceBundle>) => {
      const ref = { collectionId, articleId };
      const next = await port.mergeBundle(ref, patch);
      setBundle(next);
      return next;
    },
    [port, collectionId, articleId]
  );

  const value = useMemo<ArticleWorkspaceContextValue>(
    () => ({
      ref: articleRef,
      bundle,
      dossier,
      setDossier,
      loading,
      dataMode: port.mode,
      reload,
      mergeBundle,
    }),
    [articleRef, bundle, dossier, loading, port, reload, mergeBundle]
  );

  return (
    <ArticleWorkspaceContext.Provider value={value}>{children}</ArticleWorkspaceContext.Provider>
  );
}

export function useArticleWorkspaceOptional(): ArticleWorkspaceContextValue | null {
  return useContext(ArticleWorkspaceContext);
}

export function useArticleWorkspace(): ArticleWorkspaceContextValue {
  const ctx = useContext(ArticleWorkspaceContext);
  if (!ctx) {
    throw new Error('useArticleWorkspace must be used within ArticleWorkspaceProvider');
  }
  return ctx;
}

/** Селекторный хук для ленты operational↔TZ (без zustand). */
export function useWorkspaceStore<T>(selector: (state: ArticleWorkspaceContextValue) => T): T {
  return selector(useArticleWorkspace());
}

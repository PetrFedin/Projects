import type { ArticleRef, ArticleWorkspaceBundle } from './types';
import { articleWorkspaceStorageKey } from './storage-key';

export function loadArticleWorkspaceBundle(ref: ArticleRef): ArticleWorkspaceBundle {
  if (typeof window === 'undefined') {
    return { schemaVersion: 1 };
  }
  try {
    const raw = window.localStorage.getItem(articleWorkspaceStorageKey(ref));
    if (!raw) return { schemaVersion: 1 };
    const p = JSON.parse(raw) as unknown;
    if (!p || typeof p !== 'object' || (p as ArticleWorkspaceBundle).schemaVersion !== 1) {
      return { schemaVersion: 1 };
    }
    return p as ArticleWorkspaceBundle;
  } catch {
    return { schemaVersion: 1 };
  }
}

export function saveArticleWorkspaceBundle(ref: ArticleRef, bundle: ArticleWorkspaceBundle): void {
  if (typeof window === 'undefined') return;
  try {
    const next: ArticleWorkspaceBundle = {
      ...bundle,
      schemaVersion: 1,
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(articleWorkspaceStorageKey(ref), JSON.stringify(next));
  } catch {
    /* quota */
  }
}

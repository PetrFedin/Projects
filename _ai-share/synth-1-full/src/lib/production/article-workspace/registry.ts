import type { ArticleWorkspaceDataPort } from './port';
import { createLocalArticleWorkspacePort } from './local-port';

let singleton: ArticleWorkspaceDataPort | null = null;

/** Порт по умолчанию — локальное хранилище; перед вызовом можно подменить (например, из bootstrap при появлении API). */
export function getArticleWorkspaceDataPort(): ArticleWorkspaceDataPort {
  if (!singleton) {
    singleton = createLocalArticleWorkspacePort();
  }
  return singleton;
}

export function setArticleWorkspaceDataPort(port: ArticleWorkspaceDataPort): void {
  singleton = port;
}

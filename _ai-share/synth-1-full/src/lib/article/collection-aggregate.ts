import type { ArticleAggregate } from './article-aggregate';

export interface CollectionAggregate {
  id: string;
  name?: string;
  season?: string;
  metadata?: {
    createdAt: string;
    updatedAt: string;
    version: number;
  };
}

export function calculateCollectionReadiness(
  _collection: CollectionAggregate,
  articles: ArticleAggregate[]
): { score: number; readyArticles: number; totalArticles: number } {
  const totalArticles = articles.length;
  if (totalArticles === 0) {
    return { score: 100, readyArticles: 0, totalArticles: 0 };
  }
  const readyArticles = articles.filter((a) => a.status === 'production_ready').length;
  const score = Math.round((readyArticles / totalArticles) * 100);
  return { score, readyArticles, totalArticles };
}

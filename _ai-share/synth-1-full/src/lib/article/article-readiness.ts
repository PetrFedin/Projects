import type { ArticleAggregate } from './article-aggregate';
import type { SampleAggregate } from './sample-aggregate';

export function calculateArticleReadiness(
  article: ArticleAggregate,
  samples: SampleAggregate[]
): {
  isReady: boolean;
  score: number;
  blockers: string[];
  nextActions: string[];
} {
  const blockers: string[] = [];
  if (!article.readiness.imagesReady) blockers.push('Images');
  if (!article.readiness.seoReady) blockers.push('SEO');
  if (!article.readiness.pricingReady) blockers.push('Pricing');
  if (!article.readiness.atpReady) blockers.push('ATP');
  if (!article.techPack.patternsReady) blockers.push('Patterns');
  if (!article.techPack.materialsSourced) blockers.push('Materials');
  const pending = samples.filter((s) => s.status !== 'approved' && s.status !== 'rejected');
  if (samples.length > 0 && pending.length > 0) blockers.push('Samples pending');

  const isReady = blockers.length === 0;
  const score = isReady ? 100 : Math.max(0, 100 - blockers.length * 12);
  return {
    isReady,
    score,
    blockers,
    nextActions: blockers.map((b) => `Resolve: ${b}`),
  };
}

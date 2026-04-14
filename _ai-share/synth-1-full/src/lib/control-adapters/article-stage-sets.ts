/**
 * Single source for Article lifecycle stage groupings used by adapter + derivations.
 * Avoids silent drift between mapArticleToControlSignals and deriveArticle*.
 */
import type { ArticleLifecycleStage } from '@/lib/brand-production/types';

export const ARTICLE_SAMPLE_GATE_STAGES: ReadonlySet<ArticleLifecycleStage> = new Set([
  'samples',
  'approval',
]);

export const ARTICLE_B2B_RELEASE_STAGES: ReadonlySet<ArticleLifecycleStage> = new Set([
  'warehouse',
  'b2b_ready',
]);

export const ARTICLE_LATE_FOR_LINESHEET: ReadonlySet<ArticleLifecycleStage> = new Set([
  'po',
  'manufacturing',
  'qc',
  'warehouse',
  'b2b_ready',
]);

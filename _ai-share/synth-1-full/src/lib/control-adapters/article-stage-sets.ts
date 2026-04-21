/**
 * Single source for Article lifecycle stage groupings used by adapter + derivations.
 * Avoids silent drift between mapArticleToControlSignals and deriveArticle*.
 */
import type { ArticleLifecycleStage } from '@/lib/brand-production/types';

export const ARTICLE_SAMPLE_GATE_STAGES = new Set<ArticleLifecycleStage>([
  'samples',
  'approval',
]);

export const ARTICLE_B2B_RELEASE_STAGES = new Set<ArticleLifecycleStage>([
  'warehouse',
  'b2b_ready',
]);

export const ARTICLE_LATE_FOR_LINESHEET = new Set<ArticleLifecycleStage>([
  'po',
  'manufacturing',
  'qc',
  'warehouse',
  'b2b_ready',
]);

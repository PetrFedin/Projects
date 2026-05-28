/**
 * Расчёт готовности артикула к публикации для UnifiedControlAggregator.
 * Дублирует логику `article-readiness` в duck-typed виде для произвольных `article` из моков/API.
 */
export class ArticleReadinessEngine {
  static calculate(
    article: {
      readiness?: {
        imagesReady?: boolean;
        seoReady?: boolean;
        pricingReady?: boolean;
        atpReady?: boolean;
      };
      techPack?: { patternsReady?: boolean; materialsSourced?: boolean };
    },
    productionCommitmentStatus?: string
  ): {
    isPublishable: boolean;
    blockers: string[];
    score: number;
    missingFields: string[];
  } {
    const blockers: string[] = [];
    const r = article.readiness ?? {};
    const tp = article.techPack ?? {};
    if (!r.imagesReady) blockers.push('Images');
    if (!r.seoReady) blockers.push('SEO');
    if (!r.pricingReady) blockers.push('Pricing');
    if (!r.atpReady) blockers.push('ATP');
    if (!tp.patternsReady) blockers.push('Patterns');
    if (!tp.materialsSourced) blockers.push('Materials');
    if (productionCommitmentStatus === 'qc_failed' || productionCommitmentStatus === 'cancelled') {
      blockers.push('Production');
    }

    const isPublishable = blockers.length === 0;
    const score = isPublishable ? 100 : Math.max(0, 100 - blockers.length * 12);
    return {
      isPublishable,
      score,
      blockers,
      missingFields: blockers,
    };
  }
}

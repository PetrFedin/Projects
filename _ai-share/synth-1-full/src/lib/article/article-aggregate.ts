import { Product } from '@/lib/types';
import { SampleAggregate } from './sample-aggregate';
import { calculateArticleReadiness } from './article-readiness';
import { publishArticleReadyForProduction } from '../order/domain-event-factories';
import { dispatchArticleChanged } from '@/lib/control-adapters/control-invalidation-targets';

export type ArticleStatus =
  | 'draft'
  | 'design'
  | 'tech_pack'
  | 'sampling'
  | 'production_ready'
  | 'archived';

export interface ArticleAggregate {
  id: string;
  collectionId: string;
  pim: {
    name: string;
    category: string;
    description?: string;
    composition?: string;
    careInstructions?: string;
  };
  techPack: {
    patternsReady: boolean;
    materialsSourced: boolean;
    factoryId?: string;
    baseCost?: number;
    currency: string;
  };
  readiness: {
    imagesReady: boolean;
    seoReady: boolean;
    pricingReady: boolean;
    atpReady: boolean;
  };
  status: ArticleStatus;
  externalReferences: {
    dossierId?: string;
    pimId?: string;
    plmId?: string;
    workshop2Key?: string;
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
    version: number;
  };
}

export const ArticleAggregateFactory = {
  create(params: Partial<ArticleAggregate>): ArticleAggregate {
    if (!params.id) throw new Error('Article must have an ID (SKU)');
    if (!params.collectionId) throw new Error('Article must be linked to a collection');

    return {
      id: params.id,
      collectionId: params.collectionId,
      pim: params.pim || { name: 'New Article', category: 'N/A' },
      techPack: params.techPack || {
        patternsReady: false,
        materialsSourced: false,
        currency: 'RUB',
      },
      readiness: params.readiness || {
        imagesReady: false,
        seoReady: false,
        pricingReady: false,
        atpReady: false,
      },
      status: params.status || 'draft',
      externalReferences: params.externalReferences || {},
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
      },
    };
  },

  markProductionReady(
    article: ArticleAggregate,
    samples: SampleAggregate[]
  ): { article?: ArticleAggregate; errors?: string[] } {
    const readiness = calculateArticleReadiness(article, samples);

    if (!readiness.isReady) {
      return { errors: readiness.blockers };
    }

    const updatedArticle: ArticleAggregate = {
      ...article,
      status: 'production_ready',
      metadata: {
        ...article.metadata,
        updatedAt: new Date().toISOString(),
        version: article.metadata.version + 1,
      },
    };

    void publishArticleReadyForProduction({
      aggregateId: article.id,
      version: updatedArticle.metadata.version,
      payload: {
        collectionId: article.collectionId,
        readinessScore: calculateArticleReadinessScore(updatedArticle),
      },
    });

    dispatchArticleChanged(article.id);

    return { article: updatedArticle };
  },
};

export function calculateArticleReadinessScore(a: ArticleAggregate): number {
  const checks = [
    a.readiness.imagesReady,
    a.readiness.seoReady,
    a.readiness.pricingReady,
    a.readiness.atpReady,
    a.techPack.patternsReady,
    a.techPack.materialsSourced,
    !!a.pim.description,
    !!a.pim.composition,
  ];
  const passed = checks.filter(Boolean).length;
  return Math.round((passed / checks.length) * 100);
}

export function isArticlePublishable(a: ArticleAggregate): boolean {
  return (
    a.status === 'production_ready' &&
    a.readiness.imagesReady &&
    a.readiness.pricingReady &&
    a.readiness.atpReady
  );
}

export function mapArticleToProduct(a: ArticleAggregate): Product {
  return {
    id: a.id,
    slug: a.id.toLowerCase(),
    name: a.pim.name,
    brand: 'Syntha',
    price: 0,
    description: a.pim.description || '',
    images: [],
    category: a.pim.category,
    sustainability: [],
    sku: a.id,
    color: 'N/A',
    season: 'FW26',
  };
}

export function mapProductToArticle(p: Product): ArticleAggregate {
  return {
    id: p.id,
    collectionId: 'COL-DEMO-01',
    pim: {
      name: p.name,
      category: p.category || 'N/A',
      description: p.description,
    },
    techPack: {
      patternsReady: true,
      materialsSourced: true,
      currency: 'RUB',
    },
    readiness: {
      imagesReady: !!p.images?.length,
      seoReady: true,
      pricingReady: !!p.price,
      atpReady: true,
    },
    status: 'production_ready',
    externalReferences: {
      dossierId: `dossier-${p.id}`,
    },
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    },
  };
}

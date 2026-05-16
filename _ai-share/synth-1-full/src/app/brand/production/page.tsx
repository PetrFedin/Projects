'use client';

import { BrandProductionCollectionFlowPageView } from '@/app/brand/production/brand-production-collection-flow-page-view';
import { useBrandProductionCollectionFlowPage } from '@/app/brand/production/use-brand-production-collection-flow-page';

export type { CollectionArticle } from '@/app/brand/production/production-page-types';

export default function BrandProductionCollectionFlowPage() {
  return <BrandProductionCollectionFlowPageView {...useBrandProductionCollectionFlowPage()} />;
}

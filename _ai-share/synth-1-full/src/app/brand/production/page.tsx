'use client';

import { BrandProductionCollectionFlowPageView } from '@/app/brand/production/brand-production-collection-flow-page-view';
import { useBrandProductionCollectionFlowPage } from '@/app/brand/production/use-brand-production-collection-flow-page';
import { BrandProductionCoreRedirect } from '@/app/brand/production/brand-production-core-redirect';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';

export type { CollectionArticle } from '@/app/brand/production/production-page-types';

function BrandProductionLegacyPage() {
  return <BrandProductionCollectionFlowPageView {...useBrandProductionCollectionFlowPage()} />;
}

export default function BrandProductionCollectionFlowPage() {
  if (isPlatformCoreMode()) return <BrandProductionCoreRedirect />;
  return <BrandProductionLegacyPage />;
}

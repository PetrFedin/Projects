'use client';

import type { Product } from '@/lib/types';
import { useScrollExperienceConfig } from '@/hooks/useScrollExperienceConfig';
import { isProductRunwayAvailable } from '@/lib/runway/runway-brand-gate';
import { isHeroRunwayProduct } from '@/lib/product-scroll-switcher';
import { RunwayBadge } from '@/components/product/scroll-switcher/RunwayBadge';

interface CatalogRunwayBadgeProps {
  product: Product;
  className?: string;
}

/** Бейдж Runway на карточке — scroll-video + brand gate + hero/config флаги. */
export function CatalogRunwayBadge({ product, className }: CatalogRunwayBadgeProps) {
  const config = useScrollExperienceConfig();
  if (config.enableCatalogBadge === false) return null;
  if (!isProductRunwayAvailable(product, config)) return null;
  if (config.runwayBadgeHeroOnly && !isHeroRunwayProduct(product, config)) return null;
  const shimmer = config.badgeShimmer === true;
  return (
    <RunwayBadge product={product} className={className} scrollConfig={config} shimmer={shimmer} />
  );
}

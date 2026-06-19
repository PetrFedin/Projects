'use client';

import dynamic from 'next/dynamic';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, type ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RunwayEntryCta } from '@/components/product/scroll-switcher/RunwayEntryCta';
import { ScrollSwitcherErrorBoundary } from '@/components/product/scroll-switcher/ScrollSwitcherErrorBoundary';
import { useProductRunwayState } from '@/hooks/useProductRunwayState';
import { useScrollExperienceConfig } from '@/hooks/useScrollExperienceConfig';
import {
  assignRunwayAbCohortWithTracking,
  resolveAbTestEnabledForProduct,
  resolveDefaultPdpMediaView,
} from '@/lib/runway/runway-ab-cohort';
import { isProductRunwayAvailable } from '@/lib/runway/runway-brand-gate';
import { t } from '@/lib/runway/runway-i18n';
import type { ColorInfo, Product } from '@/lib/types';

const ProductScrollSwitcher = dynamic(
  () =>
    import('@/components/product/ProductScrollSwitcher').then((m) => ({
      default: m.ProductScrollSwitcher,
    })),
  {
    ssr: false,
    loading: () => <Skeleton className="aspect-[4/5] w-full rounded-lg" data-runway-pdp-loading />,
  }
);

export interface ProductRunwayPdpMediaColumnProps {
  product: Product;
  activeColor?: ColorInfo | null;
  onColorChange: (colorName: string) => void;
  selectedSize?: string;
  onSizeSelect: (size: string) => void;
  onAddToCart: () => void;
  onSizeGuideClick: () => void;
  isInWishlist: boolean;
  onToggleWishlist: () => void;
  allSizes: string[];
  /** Стандартная галерея PDP (когда view=standard). */
  gallery: ReactNode;
}

/**
 * Левая колонка PDP: переключатель «Стандарт / Runway» + ProductScrollSwitcher или галерея.
 * Восстанавливает контракт ?view=runway&section=N для scroll-video SKU (E2E + deep links).
 */
export function ProductRunwayPdpMediaColumn({
  product,
  activeColor,
  onColorChange,
  selectedSize,
  onSizeSelect,
  onAddToCart,
  onSizeGuideClick,
  isInWishlist,
  onToggleWishlist,
  allSizes,
  gallery,
}: ProductRunwayPdpMediaColumnProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const config = useScrollExperienceConfig();
  const runway = useProductRunwayState({
    product,
    activeColor,
    onColorChange,
  });

  const runwayAvailable = isProductRunwayAvailable(product, config);
  const urlView = searchParams.get('view');

  const mediaView = useMemo(
    () =>
      resolveDefaultPdpMediaView({
        hasScrollVideoMode: runway.enabled && runwayAvailable,
        abTestRunwayDefault: config.abTestRunwayDefault,
        abTestFlagshipSlugs: config.abTestFlagshipSlugs,
        productSlug: product.slug,
        urlView,
      }),
    [
      runway.enabled,
      runwayAvailable,
      config.abTestRunwayDefault,
      config.abTestFlagshipSlugs,
      product.slug,
      urlView,
    ]
  );

  useEffect(() => {
    if (!runway.enabled || !runwayAvailable || urlView) return;
    const abEnabled = resolveAbTestEnabledForProduct({
      abTestRunwayDefault: config.abTestRunwayDefault,
      abTestFlagshipSlugs: config.abTestFlagshipSlugs,
      productSlug: product.slug,
    });
    if (!abEnabled) return;
    assignRunwayAbCohortWithTracking({
      productSlug: product.slug,
      brand: product.brand,
    });
  }, [
    runway.enabled,
    runwayAvailable,
    urlView,
    config.abTestRunwayDefault,
    config.abTestFlagshipSlugs,
    product.slug,
    product.brand,
  ]);

  const setMediaView = useCallback(
    (view: 'standard' | 'runway') => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('view', view);
      if (view === 'standard') {
        params.delete('section');
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  if (!runway.enabled || !runwayAvailable) {
    return <>{gallery}</>;
  }

  return (
    <div className="flex flex-col gap-3" data-runway-pdp-media>
      <Tabs
        value={mediaView}
        onValueChange={(value) => setMediaView(value as 'standard' | 'runway')}
      >
        <TabsList className="grid w-full max-w-xs grid-cols-2" data-runway-pdp-tabs>
          <TabsTrigger value="standard">{t('runway.standardTab')}</TabsTrigger>
          <TabsTrigger value="runway">{t('runway.runwayTab')}</TabsTrigger>
        </TabsList>
      </Tabs>

      {mediaView === 'runway' ? (
        <ScrollSwitcherErrorBoundary productSlug={product.slug} fallback={gallery}>
          <ProductScrollSwitcher
            product={product}
            activeColor={activeColor}
            controlledSectionIndex={runway.controlledSectionIndex}
            onSectionChange={runway.handleSectionChange}
            displayPrice={runway.displayPrice}
            variantSku={runway.variantSku}
            selectedSize={selectedSize}
            availableSizes={allSizes}
            onSizeSelect={onSizeSelect}
            requiresSize={allSizes.length > 0}
            onAddToCart={onAddToCart}
            syncUrl
            onSizeGuideClick={onSizeGuideClick}
            isInWishlist={isInWishlist}
            onToggleWishlist={onToggleWishlist}
            surface="pdp"
            analyticsSurface="pdp"
          />
        </ScrollSwitcherErrorBoundary>
      ) : (
        <>
          <RunwayEntryCta visible variant="link" onOpenRunway={() => setMediaView('runway')} />
          {gallery}
        </>
      )}
    </div>
  );
}

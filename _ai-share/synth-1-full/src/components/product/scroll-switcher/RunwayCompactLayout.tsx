'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { RunwayRichInfoPanel } from '@/components/product/scroll-switcher/RunwayRichInfoPanel';
import { RunwayMoreMenu } from '@/components/product/scroll-switcher/RunwayMoreMenu';
import { RunwaySocialProof } from '@/components/product/scroll-switcher/RunwaySocialProof';
import { RunwayCompleteLook } from '@/components/product/scroll-switcher/RunwayCompleteLook';
import { RunwayAttributionNote } from '@/components/product/scroll-switcher/RunwayAttributionNote';
import { RunwaySectionStory } from '@/components/product/scroll-switcher/RunwaySectionStory';
import { RunwaySectionNarrative } from '@/components/product/scroll-switcher/RunwaySectionNarrative';
import type { RunwayOrchestrationContext } from '@/hooks/useRunwayExperienceOrchestration';
import { t } from '@/lib/runway/runway-i18n';
import type { ReactNode } from 'react';

function formatProductPrice(value: number): string {
  return `${value.toLocaleString('ru-RU')} ₽`;
}

export interface RunwayCompactLayoutProps {
  ctx: RunwayOrchestrationContext;
  /** Сцена runway (hero) — без боковых overlay-панелей. */
  stage: ReactNode;
  compareFallbackRight: number;
}

/**
 * Minimal layout — одна колонка деталей на desktop, sticky bar на mobile.
 * Primary: stage, thumbs, price, cart, color. Secondary — меню «Ещё».
 */
export function RunwayCompactLayout({
  ctx,
  stage,
  compareFallbackRight,
}: RunwayCompactLayoutProps) {
  const {
    product,
    current,
    activeSection,
    sections,
    price,
    resolvedOriginalPrice,
    showStrikePrice,
    displayVariant,
    displayMaterial,
    displayDimensions,
    madeInLabel,
    brandHref,
    variantSku,
    requiresSize,
    availableSizes,
    selectedSize,
    onSizeSelect,
    sectionAvailability,
    lowStockQuantity,
    onSizeGuideClick,
    showSizeGuide,
    missingSize,
    selectionSummary,
    addToCartLabel,
    handleAddToCartClick,
    showCheckoutShortcut,
    socialProof,
    userPrefs,
    updateUserPrefs,
    scrollConfig,
    isInWishlist,
    handleWishlistToggle,
    showWishlist,
    showShare,
    onToggleWishlist,
    hasDemoAssets,
    isDemoMode,
    showDemoChrome,
    lookCatalogProducts,
    openCompareView,
    toggleFullscreen,
    isFullscreen,
    handleMoreDetails,
    cashbackAmount,
    surface,
    isEmbedSurface,
    showAutoTour,
    autoTour,
    prefersReducedMotion,
  } = ctx;

  const showCompare = sections.length > 1 && !isEmbedSurface;
  const showSocial = Boolean(socialProof) && scrollConfig.showSocialProof !== false;
  const showStoryOverlay = Boolean(current.sectionStory) && userPrefs.showStories;

  const moreMenuProps = {
    product,
    activeSection,
    surface,
    isInWishlist,
    onToggleWishlist: onToggleWishlist ? handleWishlistToggle : undefined,
    showWishlist: showWishlist && Boolean(onToggleWishlist) && !isEmbedSurface,
    showShare: showShare && !isEmbedSurface,
    showCompare,
    onOpenCompare: () => openCompareView(activeSection, compareFallbackRight),
    showFullscreen: !isEmbedSurface,
    isFullscreen,
    onToggleFullscreen: () => void toggleFullscreen(),
    showAutoTour: showAutoTour && !isEmbedSurface,
    autoTourRunning: autoTour.isRunning,
    autoTourComplete: autoTour.isComplete,
    onAutoTourStart: autoTour.startTour,
    onAutoTourStop: autoTour.stopTour,
    aiStylistTip: current.sectionAiTip,
    onOpenStylist: onSizeGuideClick,
    prefs: userPrefs,
    onUpdatePrefs: updateUserPrefs,
    showOptions: !isEmbedSurface,
  };

  const infoPanelProps = {
    product,
    displayMaterial,
    displayVariant,
    displayDimensions,
    madeInLabel,
    price,
    originalPrice: resolvedOriginalPrice,
    showStrikePrice,
    cashbackAmount,
    variantSku,
    brandHref,
    requiresSize,
    availableSizes,
    selectedSize,
    onSizeSelect,
    sectionAvailability,
    lowStockQuantity,
    onSizeGuideClick,
    showSizeGuide,
    missingSize,
    selectionSummary,
    addToCartLabel,
    onAddToCart: handleAddToCartClick,
    showCheckoutShortcut,
    onMoreDetails: handleMoreDetails,
    align: 'right' as const,
  };

  return (
    <div
      className="runway-layout-minimal flex flex-col gap-6 md:gap-8"
      data-runway-layout="minimal"
    >
      <div className="flex flex-col lg:flex-row lg:items-stretch lg:gap-8 lg:pt-2">
        <div className="min-w-0 flex-1 space-y-4">
          {stage}
          <RunwaySectionNarrative
            productSlug={product.slug}
            section={current}
            sectionIndex={activeSection}
            prefersReducedMotion={prefersReducedMotion}
            className="max-lg:px-1"
          />
        </div>

        <aside
          className="hidden lg:flex lg:w-[min(100%,300px)] lg:flex-col lg:gap-4 lg:py-1"
          data-runway-details-panel
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-1">
              {brandHref ? (
                <Link
                  href={brandHref}
                  className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-primary"
                >
                  {product.brand}
                </Link>
              ) : (
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  {product.brand}
                </p>
              )}
              <h2 className="font-headline text-lg font-semibold leading-snug tracking-tight text-foreground/90">
                {product.name}
              </h2>
              <p className="text-xs text-muted-foreground">{displayVariant}</p>
            </div>
            {!isEmbedSurface ? <RunwayMoreMenu {...moreMenuProps} /> : null}
          </div>

          <RunwayRichInfoPanel
            {...infoPanelProps}
            className="runway-panel-light border-0 bg-transparent p-0 shadow-none backdrop-blur-none"
          />

          {showSocial ? (
            <RunwaySocialProof proof={socialProof!} variant="inline" className="opacity-80" />
          ) : null}
        </aside>
      </div>

      <div
        className="runway-compact-mobile-bar sticky bottom-0 z-20 border-t border-border/50 bg-background/95 px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden"
        data-runway-mobile-bar
      >
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
              <span className="font-headline text-lg font-bold tabular-nums text-primary">
                {formatProductPrice(price)}
              </span>
              {showStrikePrice && resolvedOriginalPrice ? (
                <span className="text-xs tabular-nums text-muted-foreground line-through">
                  {formatProductPrice(resolvedOriginalPrice)}
                </span>
              ) : null}
            </div>
            {missingSize ? (
              <Badge variant="warning" className="mt-1 text-[9px]">
                {t('runway.selectSize')}
              </Badge>
            ) : null}
          </div>
          <Button
            type="button"
            size="sm"
            className="h-11 min-h-[44px] shrink-0 px-4"
            onClick={handleAddToCartClick}
            data-runway-add-to-cart
          >
            <ShoppingCart className="mr-1.5 h-4 w-4" />
            <span className="max-w-[7rem] truncate text-xs">{addToCartLabel}</span>
          </Button>
          {!isEmbedSurface ? <RunwayMoreMenu {...moreMenuProps} size="sm" /> : null}
        </div>
      </div>

      {showStoryOverlay && current.sectionStory ? (
        <RunwaySectionStory
          story={current.sectionStory}
          sectionLabel={current.label}
          activeSection={activeSection}
          prefersReducedMotion={prefersReducedMotion}
        />
      ) : null}

      {current.lookItems?.length && userPrefs.showCompleteLook && !isEmbedSurface ? (
        <RunwayCompleteLook
          items={current.lookItems}
          sectionLabel={current.label}
          parentProductSlug={product.slug}
          sectionIndex={activeSection}
          catalogProducts={lookCatalogProducts}
          defaultCollapsed
          embedded
        />
      ) : null}

      {hasDemoAssets && (showDemoChrome || isDemoMode) ? (
        <RunwayAttributionNote
          demoOnly={!isDemoMode}
          visible={showDemoChrome || isDemoMode}
          variant="footer"
        />
      ) : null}
    </div>
  );
}

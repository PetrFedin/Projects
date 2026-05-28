'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { GitCompare, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { runwayThemeClassName } from '@/lib/runway/runway-theme';
import { t } from '@/lib/runway/runway-i18n';
import { SwitcherStage } from '@/components/product/scroll-switcher/SwitcherStage';
import { SwitcherBar } from '@/components/product/scroll-switcher/SwitcherBar';
import { SwitcherProgress } from '@/components/product/scroll-switcher/SwitcherProgress';
import { SwitcherToolbar } from '@/components/product/scroll-switcher/SwitcherToolbar';
import { RunwayOnboardingHint } from '@/components/product/scroll-switcher/RunwayOnboardingHint';
import { RunwayKeyboardLegend } from '@/components/product/scroll-switcher/RunwayKeyboardLegend';
import { RunwaySectionStory } from '@/components/product/scroll-switcher/RunwaySectionStory';
import { RunwayCompleteLook } from '@/components/product/scroll-switcher/RunwayCompleteLook';
import { RunwaySocialProof } from '@/components/product/scroll-switcher/RunwaySocialProof';
import { RunwayNextProduct } from '@/components/product/scroll-switcher/RunwayNextProduct';
import { RunwayComparePeek } from '@/components/product/scroll-switcher/RunwayComparePeek';
import { RunwayAttributionNote } from '@/components/product/scroll-switcher/RunwayAttributionNote';
import { RunwayAutoTourButton } from '@/components/product/scroll-switcher/RunwayAutoTourButton';
import { RunwayRichInfoPanel } from '@/components/product/scroll-switcher/RunwayRichInfoPanel';
import { RunwayOptionsPanel } from '@/components/product/scroll-switcher/RunwayOptionsPanel';
import { RunwayCartUpsellStrip } from '@/components/product/scroll-switcher/RunwayCartUpsellStrip';
import { RunwaySectionFavoriteButton } from '@/components/product/scroll-switcher/RunwaySectionFavoriteButton';
import { RunwayAiStylistHint } from '@/components/product/scroll-switcher/RunwayAiStylistHint';
import { RunwayCartActions } from '@/components/product/scroll-switcher/RunwayCartActions';
import { RunwayMediaController } from '@/components/product/scroll-switcher/RunwayMediaController';
import { RunwayCompactLayout } from '@/components/product/scroll-switcher/RunwayCompactLayout';
import { RunwayKioskQr } from '@/components/product/scroll-switcher/RunwayKioskQr';
import type { RunwayOrchestrationContext } from '@/hooks/useRunwayExperienceOrchestration';
import type { ReactNode } from 'react';

const RunwayKioskShell = dynamic(
  () =>
    import('@/components/product/scroll-switcher/RunwayKioskShell').then((m) => ({
      default: m.RunwayKioskShell,
    })),
  { ssr: false }
);

const RunwayCompareView = dynamic(
  () =>
    import('@/components/product/scroll-switcher/RunwayCompareView').then((m) => ({
      default: m.RunwayCompareView,
    })),
  { ssr: false }
);

const RunwayGuidedTour = dynamic(
  () =>
    import('@/components/product/scroll-switcher/RunwayGuidedTour').then((m) => ({
      default: m.RunwayGuidedTour,
    })),
  { ssr: false }
);

const RunwayDemoRibbon = dynamic(
  () =>
    import('@/components/product/scroll-switcher/RunwayDemoRibbon').then((m) => ({
      default: m.RunwayDemoRibbon,
    })),
  { ssr: false }
);

const RunwayInvestorBanner = dynamic(
  () =>
    import('@/components/product/scroll-switcher/RunwayInvestorBanner').then((m) => ({
      default: m.RunwayInvestorBanner,
    })),
  { ssr: false }
);

export interface RunwayExperienceOrchestratorProps {
  ctx: RunwayOrchestrationContext;
  renderLeftPanel?: (ctx: RunwayOrchestrationContext) => ReactNode;
  renderRightPanel?: (ctx: RunwayOrchestrationContext) => ReactNode;
}

/** UI-слой runway — render props для левой/правой панелей. */
export function RunwayExperienceOrchestrator({
  ctx,
  renderLeftPanel,
  renderRightPanel,
}: RunwayExperienceOrchestratorProps) {
  const {
    product,
    containerRef,
    themeStyle,
    runwayTheme,
    cinematicVisible,
    markHeroVideoLoadedData,
    prefersReducedMotion,
    compact,
    isFullscreen,
    showDemoChrome,
    className,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    sections,
    activeSection,
    pickSection,
    scrollConfig,
    setCompareTargetIndex,
    compareTargetIndex,
    liveSectionLabel,
    livePriceAnnouncement,
    showProgress,
    progress,
    sectionLabels,
    current,
    favorites,
    cartUpsellVisible,
    showCheckoutShortcut,
    setCartUpsellVisible,
    syncUrl,
    shouldLoadMedia,
    showAutoTour,
    autoTour,
    hasDemoAssets,
    isDemoMode,
    stageImageUrl,
    adjacent,
    videoSources,
    usesPerSectionVideo,
    canUseVideo,
    videoReady,
    videoLoading,
    videoRef,
    stageBackground,
    setVideoReady,
    setVideoLoading,
    handleVideoError,
    handleVideoManualRetry,
    videoRetryKey,
    userPrefs,
    socialProof,
    brandScrollCatalog,
    lookCatalogProducts,
    adjacentBrandProducts,
    updateUserPrefs,
    toggleFullscreen,
    isInWishlist,
    onToggleWishlist,
    handleWishlistToggle,
    showWishlist,
    showShare,
    surface,
    parallaxOffset,
    displayMaterial,
    displayVariant,
    displayDimensions,
    madeInLabel,
    price,
    brandHref,
    handleMoreDetails,
    resolvedOriginalPrice,
    showStrikePrice,
    cashbackAmount,
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
    pulseSection,
    onThumbHover,
    onThumbHoverEnd,
    videoFailed,
    isKioskMode,
    exitKioskMode,
    compareViewOpen,
    compareViewIndices,
    openCompareView,
    closeCompareView,
    isEmbedSurface,
  } = ctx;

  const hidePdpChrome = isKioskMode || isEmbedSurface;
  const kioskLargeThumbs = isKioskMode;
  const layoutMode = scrollConfig.layout ?? 'minimal';
  const useMinimalLayout =
    layoutMode === 'minimal' && !isKioskMode && (isEmbedSurface || (!compact && !hidePdpChrome));
  const compareFallbackRight = sections.length > 1 ? (activeSection + 1) % sections.length : 0;

  const stageContent = (
    <div
      ref={containerRef}
      style={themeStyle}
      className={cn(
        'bg-bg-surface2 relative overflow-hidden rounded-lg border border-border text-foreground transition-opacity duration-300',
        useMinimalLayout && 'border-border/60 bg-background',
        runwayThemeClassName(runwayTheme),
        'runway-high-contrast',
        !cinematicVisible && !prefersReducedMotion && 'opacity-0',
        cinematicVisible && !prefersReducedMotion && 'animate-runway-cinematic-in',
        compact ? 'min-h-[420px]' : 'aspect-[4/5] max-h-[900px] min-h-[min(85vh,820px)] w-full',
        isFullscreen && 'aspect-auto max-h-none min-h-screen rounded-none',
        isKioskMode && 'aspect-auto max-h-none min-h-0 flex-1 rounded-none border-0',
        'max-md:aspect-auto max-md:max-h-none max-md:min-h-[min(100vw,720px)] max-md:w-full',
        showDemoChrome && !compact && !hidePdpChrome && 'pt-8',
        className
      )}
      role="region"
      aria-roledescription={t('runway.aria.stage')}
      aria-label={`Runway: ${product.name}`}
      data-runway-stage
      data-runway-ready={cinematicVisible ? 'true' : 'false'}
      onTouchStart={(e) => handleTouchStart(e.touches[0]?.clientY ?? 0)}
      onTouchMove={(e) => handleTouchMove(e.touches[0]?.clientY ?? 0)}
      onTouchEnd={handleTouchEnd}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          pickSection(Math.min(sections.length - 1, activeSection + 1), 'keyboard');
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          pickSection(Math.max(0, activeSection - 1), 'keyboard');
        }
        if (!e.shiftKey && /^[1-9]$/.test(e.key)) {
          const target = Number(e.key) - 1;
          if (target >= 0 && target < sections.length) {
            e.preventDefault();
            pickSection(target, 'keyboard');
          }
        }
        if (scrollConfig.enableComparePeek && e.shiftKey && /^[1-9]$/.test(e.key)) {
          const target = Number(e.key) - 1;
          if (target >= 0 && target < sections.length) {
            e.preventDefault();
            setCompareTargetIndex(target);
          }
        }
      }}
      tabIndex={0}
    >
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveSectionLabel ? t('runway.aria.sectionLive', { label: liveSectionLabel }) : null}
      </div>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {livePriceAnnouncement}
      </div>

      {showProgress ? (
        <SwitcherProgress
          progress={progress}
          sectionCount={sections.length}
          activeSection={activeSection}
          sectionLabels={sectionLabels}
          variant={useMinimalLayout ? 'dots' : 'full'}
          onSectionClick={(index) => pickSection(index, 'thumb')}
          trailingSlot={
            !compact && !useMinimalLayout ? (
              <RunwaySectionFavoriteButton
                sectionIndex={activeSection}
                sectionLabel={current.label}
                isFavorite={favorites.isFavorite(activeSection)}
                onToggle={() => favorites.toggleFavorite(activeSection)}
              />
            ) : null
          }
        />
      ) : null}

      {!useMinimalLayout ? (
        <RunwayCartUpsellStrip
          items={current?.lookItems ?? []}
          sectionLabel={current?.label ?? ''}
          visible={cartUpsellVisible}
          onDismiss={() => setCartUpsellVisible(false)}
        />
      ) : null}

      {!compact && syncUrl && !hidePdpChrome ? (
        <RunwayOnboardingHint enabled={shouldLoadMedia} subtle={useMinimalLayout} />
      ) : null}

      {showDemoChrome && !compact && !hidePdpChrome && !useMinimalLayout ? (
        <RunwayDemoRibbon enabled={shouldLoadMedia} />
      ) : null}

      {showAutoTour && !compact && syncUrl && !isKioskMode && !useMinimalLayout ? (
        <div className="pointer-events-auto absolute left-3 top-10 z-30 md:left-4 md:top-12">
          <RunwayAutoTourButton
            isRunning={autoTour.isRunning}
            isComplete={autoTour.isComplete}
            onStart={autoTour.startTour}
            onStop={autoTour.stopTour}
          />
        </div>
      ) : null}

      {isDemoMode && scrollConfig.enableInvestorBanner && !hidePdpChrome && !useMinimalLayout ? (
        <RunwayInvestorBanner
          enabled={shouldLoadMedia}
          message={scrollConfig.investorBannerMessage}
        />
      ) : null}

      {hasDemoAssets && !useMinimalLayout ? (
        <RunwayAttributionNote demoOnly={!isDemoMode} visible={showDemoChrome || isDemoMode} />
      ) : null}

      <SwitcherStage
        product={product}
        current={current}
        activeSection={activeSection}
        sectionCount={sections.length}
        stageImageUrl={stageImageUrl}
        prevImageUrl={adjacent.prev}
        videoSources={videoSources}
        usePerSectionVideo={usesPerSectionVideo}
        canUseVideo={canUseVideo}
        videoReady={videoReady}
        videoLoading={videoLoading}
        videoRef={videoRef}
        stageBackground={stageBackground}
        prefersReducedMotion={prefersReducedMotion}
        compact={compact}
        shouldLoadMedia={shouldLoadMedia}
        enableKenBurns={scrollConfig.enableKenBurns}
        minimalChrome={useMinimalLayout}
        onVideoLoaded={() => {
          setVideoReady(true);
          setVideoLoading(false);
        }}
        onHeroVideoLoadedData={() => {
          if (activeSection === 0) markHeroVideoLoadedData();
        }}
        onVideoError={handleVideoError}
        videoRetryKey={videoRetryKey}
      />

      {!useMinimalLayout && current.sectionStory && userPrefs.showStories ? (
        <RunwaySectionStory
          story={current.sectionStory}
          sectionLabel={current.label}
          activeSection={activeSection}
          prefersReducedMotion={prefersReducedMotion}
        />
      ) : null}

      {socialProof && !useMinimalLayout ? <RunwaySocialProof proof={socialProof} /> : null}

      {current.lookItems?.length && userPrefs.showCompleteLook && !useMinimalLayout ? (
        <div data-runway-complete-look>
          <RunwayCompleteLook
            items={current.lookItems}
            sectionLabel={current.label}
            parentProductSlug={product.slug}
            sectionIndex={activeSection}
            catalogProducts={lookCatalogProducts ?? brandScrollCatalog}
          />
        </div>
      ) : null}

      {!compact && brandScrollCatalog?.length && !hidePdpChrome && !useMinimalLayout ? (
        <RunwayNextProduct adjacent={adjacentBrandProducts} />
      ) : null}

      {scrollConfig.enableComparePeek && !useMinimalLayout ? (
        <RunwayComparePeek
          sections={sections}
          activeSection={activeSection}
          compareTargetIndex={compareTargetIndex}
          prefersReducedMotion={prefersReducedMotion}
        />
      ) : null}

      {!compact && !hidePdpChrome && !useMinimalLayout ? (
        <div className="pointer-events-auto absolute right-3 top-14 z-20 hidden items-center gap-1.5 md:right-4 md:top-16 md:flex">
          {sections.length > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 bg-background/90 text-xs backdrop-blur-sm"
              onClick={() => openCompareView(activeSection, compareFallbackRight)}
            >
              <GitCompare className="mr-1.5 h-3.5 w-3.5" />
              {t('runway.compareVariants')}
            </Button>
          ) : null}
          {scrollConfig.enableUserOptions ? (
            <RunwayOptionsPanel
              prefs={userPrefs}
              onUpdate={updateUserPrefs}
              showCompare={sections.length > 1 && Boolean(scrollConfig.enableComparePeek)}
              onOpenCompare={() => openCompareView(activeSection, compareFallbackRight)}
              showFullscreen
              isFullscreen={isFullscreen}
              onToggleFullscreen={() => void toggleFullscreen()}
            />
          ) : null}
          <RunwayKeyboardLegend />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 bg-background/90 backdrop-blur-sm"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? t('runway.fullscreenExit') : t('runway.fullscreenEnter')}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      ) : null}

      {!useMinimalLayout ? (
        <SwitcherToolbar
          product={product}
          activeSection={activeSection}
          isInWishlist={isInWishlist}
          onToggleWishlist={onToggleWishlist ? handleWishlistToggle : undefined}
          showWishlist={showWishlist && Boolean(onToggleWishlist) && !hidePdpChrome}
          showShare={showShare && !isEmbedSurface}
          surface={surface}
        />
      ) : null}

      {!useMinimalLayout &&
        (renderLeftPanel ? (
          <div
            className="pointer-events-none absolute left-3 top-1/2 z-10 hidden max-w-[200px] md:block lg:left-6 lg:max-w-[240px]"
            style={{
              transform: `translateY(calc(-50% + ${parallaxOffset * -1}px))`,
              transition: prefersReducedMotion ? 'none' : 'transform 0.15s ease-out',
            }}
          >
            {renderLeftPanel(ctx)}
          </div>
        ) : (
          <div
            className="pointer-events-none absolute left-3 top-1/2 z-10 hidden max-w-[200px] md:block lg:left-6 lg:max-w-[240px]"
            style={{
              transform: `translateY(calc(-50% + ${parallaxOffset * -1}px))`,
              transition: prefersReducedMotion ? 'none' : 'transform 0.15s ease-out',
            }}
          >
            <RunwayRichInfoPanel
              product={product}
              displayMaterial={displayMaterial}
              displayVariant={displayVariant}
              displayDimensions={displayDimensions}
              madeInLabel={madeInLabel}
              price={price}
              brandHref={brandHref}
              compact={compact}
              align="left"
              onMoreDetails={!compact ? handleMoreDetails : undefined}
            />
            {compact ? (
              <Link
                href={`/products/${product.slug}?view=runway`}
                className="pointer-events-auto mt-2 inline-block text-xs font-medium text-primary underline-offset-4 hover:underline"
              >
                {t('runway.runwayOnPdp')}
              </Link>
            ) : null}
          </div>
        ))}

      {!useMinimalLayout &&
        (renderRightPanel ? (
          <div
            className="pointer-events-none absolute right-3 top-1/2 z-10 hidden md:block lg:right-6"
            style={{
              transform: `translateY(calc(-50% + ${parallaxOffset}px))`,
              transition: prefersReducedMotion ? 'none' : 'transform 0.15s ease-out',
            }}
          >
            <div className="flex flex-col items-end gap-2">
              {renderRightPanel(ctx)}
              {!compact && (current.sectionAiTip || onSizeGuideClick) ? (
                <RunwayAiStylistHint
                  section={current}
                  sectionLabel={current.label}
                  onOpenStylist={onSizeGuideClick}
                  className="pointer-events-auto"
                />
              ) : null}
            </div>
          </div>
        ) : (
          <div
            className="pointer-events-none absolute right-3 top-1/2 z-10 hidden md:block lg:right-6"
            data-runway-price-panel
            style={{
              transform: `translateY(calc(-50% + ${parallaxOffset}px))`,
              transition: prefersReducedMotion ? 'none' : 'transform 0.15s ease-out',
            }}
          >
            <RunwayRichInfoPanel
              product={product}
              displayMaterial={displayMaterial}
              displayVariant={displayVariant}
              displayDimensions={displayDimensions}
              madeInLabel={madeInLabel}
              price={price}
              originalPrice={resolvedOriginalPrice}
              showStrikePrice={showStrikePrice}
              cashbackAmount={cashbackAmount}
              variantSku={variantSku}
              requiresSize={requiresSize}
              availableSizes={availableSizes}
              selectedSize={selectedSize}
              onSizeSelect={onSizeSelect}
              sectionAvailability={sectionAvailability}
              lowStockQuantity={lowStockQuantity}
              onSizeGuideClick={onSizeGuideClick}
              showSizeGuide={showSizeGuide}
              missingSize={missingSize}
              selectionSummary={selectionSummary}
              addToCartLabel={addToCartLabel}
              onAddToCart={handleAddToCartClick}
              showCheckoutShortcut={showCheckoutShortcut}
              align="right"
            />
            {!compact && (current.sectionAiTip || onSizeGuideClick) ? (
              <RunwayAiStylistHint
                section={current}
                sectionLabel={current.label}
                onOpenStylist={onSizeGuideClick}
                className="pointer-events-auto mt-2"
              />
            ) : null}
          </div>
        ))}

      {!useMinimalLayout ? (
        <RunwayCartActions
          product={product}
          activeSection={activeSection}
          sectionCount={sections.length}
          price={price}
          resolvedOriginalPrice={resolvedOriginalPrice}
          showStrikePrice={showStrikePrice}
          displayVariant={displayVariant}
          missingSize={missingSize}
          selectionSummary={selectionSummary}
          addToCartLabel={addToCartLabel}
          onAddToCart={handleAddToCartClick}
          showCheckoutShortcut={showCheckoutShortcut}
          onOpenCompare={() => openCompareView(activeSection, compareFallbackRight)}
        />
      ) : null}

      <SwitcherBar
        product={product}
        sections={sections}
        activeSection={activeSection}
        pulseSection={useMinimalLayout ? null : pulseSection}
        progress={progress}
        onSelect={(index) => pickSection(index, 'thumb')}
        onThumbHover={onThumbHover}
        onThumbHoverEnd={onThumbHoverEnd}
        kioskLargeThumbs={kioskLargeThumbs}
        minimalChrome={useMinimalLayout}
      />

      {isKioskMode ? (
        <RunwayKioskQr productSlug={product.slug} activeSection={activeSection} />
      ) : null}

      <RunwayMediaController videoFailed={videoFailed} onRetryVideo={handleVideoManualRetry} />
    </div>
  );

  const stageShell = useMinimalLayout ? (
    <RunwayCompactLayout
      ctx={ctx}
      stage={stageContent}
      compareFallbackRight={compareFallbackRight}
    />
  ) : (
    stageContent
  );

  return (
    <>
      <RunwayKioskShell
        active={isKioskMode}
        sectionCount={sections.length}
        activeSection={activeSection}
        onSectionChange={(index) => pickSection(index, 'url')}
        onExit={exitKioskMode}
      >
        {stageShell}
      </RunwayKioskShell>

      {compareViewOpen && compareViewIndices ? (
        <RunwayCompareView
          open={compareViewOpen}
          onClose={closeCompareView}
          sections={sections}
          leftIndex={compareViewIndices[0]}
          rightIndex={compareViewIndices[1]}
          prefersReducedMotion={prefersReducedMotion}
        />
      ) : null}

      {!compact && syncUrl && !hidePdpChrome && !isKioskMode && isDemoMode && !useMinimalLayout ? (
        <RunwayGuidedTour enabled={shouldLoadMedia} />
      ) : null}
    </>
  );
}

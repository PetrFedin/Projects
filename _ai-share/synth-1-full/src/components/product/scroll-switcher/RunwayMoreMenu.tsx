'use client';

import { useMemo, useState } from 'react';
import {
  GitCompare,
  Heart,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  Share2,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { buildRunwayShareUrl } from '@/hooks/useScrollExperienceUrlSync';
import {
  buildRunwayEmailCampaignLink,
  formatRunwayEmailCampaignSnippet,
} from '@/lib/runway/runway-share-link-builder';
import { trackScrollExperienceEvent } from '@/lib/scroll-experience-analytics';
import { resolveScrollSwitcherSections } from '@/lib/product-scroll-switcher';
import {
  buildRunwayShareCardViewModel,
  formatRunwayShareCardPlainText,
} from '@/lib/runway/runway-share-card';
import { t } from '@/lib/runway/runway-i18n';
import type { Product } from '@/lib/types';
import type { RunwayUserPreferences } from '@/hooks/useRunwayUserPreferences';
import { RunwayOptionsContent } from '@/components/product/scroll-switcher/RunwayOptionsPanel';
import { RunwayKeyboardLegend } from '@/components/product/scroll-switcher/RunwayKeyboardLegend';
import { RunwayAutoTourButton } from '@/components/product/scroll-switcher/RunwayAutoTourButton';
import { RunwayShareCard } from '@/components/product/scroll-switcher/RunwayShareCard';

export interface RunwayMoreMenuProps {
  product: Product;
  activeSection: number;
  surface?: string;
  /** Wishlist — secondary, доступен через меню. */
  isInWishlist?: boolean;
  onToggleWishlist?: () => void;
  showWishlist?: boolean;
  showShare?: boolean;
  showCompare?: boolean;
  onOpenCompare?: () => void;
  showFullscreen?: boolean;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  /** Demo-only автопоказ. */
  showAutoTour?: boolean;
  autoTourRunning?: boolean;
  autoTourComplete?: boolean;
  onAutoTourStart?: () => void;
  onAutoTourStop?: () => void;
  /** AI stylist / size guide. */
  aiStylistTip?: string;
  onOpenStylist?: () => void;
  /** Пользовательские prefs — toggles stories / complete look и т.д. */
  prefs?: RunwayUserPreferences;
  onUpdatePrefs?: (patch: Partial<RunwayUserPreferences>) => void;
  showOptions?: boolean;
  className?: string;
  /** Компактная кнопка для mobile sticky bar. */
  size?: 'default' | 'sm';
}

/**
 * Единое меню «Ещё» — progressive disclosure для runway minimal layout.
 * Share, compare, wishlist, fullscreen, auto-tour, AI stylist, options, hotkeys.
 */
export function RunwayMoreMenu({
  product,
  activeSection,
  surface = 'pdp',
  isInWishlist = false,
  onToggleWishlist,
  showWishlist = false,
  showShare = true,
  showCompare = false,
  onOpenCompare,
  showFullscreen = true,
  isFullscreen = false,
  onToggleFullscreen,
  showAutoTour = false,
  autoTourRunning = false,
  autoTourComplete = false,
  onAutoTourStart,
  onAutoTourStop,
  aiStylistTip,
  onOpenStylist,
  prefs,
  onUpdatePrefs,
  showOptions = true,
  className,
  size = 'default',
}: RunwayMoreMenuProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const shareViewModel = useMemo(() => {
    const sections = resolveScrollSwitcherSections(product);
    const section = sections[activeSection] ?? sections[0];
    if (!section) return null;
    const url = buildRunwayShareUrl(product.slug, activeSection);
    return buildRunwayShareCardViewModel(product, section, activeSection, url);
  }, [product, activeSection]);

  const handleShareTrack = () => {
    trackScrollExperienceEvent('scroll_experience_share', {
      productSlug: product.slug,
      productId: product.id,
      brand: product.brand,
      sectionIndex: activeSection,
      surface,
    });
  };

  const handleCopyEmailCampaign = async () => {
    const url = buildRunwayEmailCampaignLink(product.slug, activeSection);
    const plain = formatRunwayEmailCampaignSnippet(product.name, url);
    try {
      await navigator.clipboard.writeText(plain);
      toast({
        title: t('runway.emailCampaignCopied'),
        description: t('runway.emailCampaignCopiedDesc'),
      });
      setOpen(false);
    } catch {
      toast({
        title: t('runway.shareFailed'),
        description: url,
        variant: 'destructive',
      });
    }
  };

  const handleQuickShare = async () => {
    if (!shareViewModel) return;
    handleShareTrack();
    const plain = formatRunwayShareCardPlainText(shareViewModel);
    try {
      if (navigator.share) {
        await navigator.share({
          title: shareViewModel.headline,
          text: shareViewModel.description,
          url: shareViewModel.shareUrl,
        });
        setOpen(false);
        return;
      }
      await navigator.clipboard.writeText(plain);
      toast({
        title: t('runway.shareCopied'),
        description: t('runway.shareCopiedDesc'),
      });
      setOpen(false);
    } catch {
      toast({
        title: t('runway.shareFailed'),
        description: shareViewModel.shareUrl,
        variant: 'destructive',
      });
    }
  };

  const showAiStylist = Boolean(aiStylistTip?.trim() || onOpenStylist);
  const optionsAvailable = showOptions && prefs && onUpdatePrefs;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size={size === 'sm' ? 'sm' : 'default'}
          className={cn(
            size === 'sm' ? 'h-9 px-3 text-xs' : 'h-9 bg-background/90 backdrop-blur-sm',
            className
          )}
          aria-label={t('runway.moreMenu.title')}
          data-runway-more-menu-trigger
        >
          <MoreHorizontal className={cn('h-4 w-4', size !== 'sm' && 'mr-1.5')} />
          {size !== 'sm' ? t('runway.moreMenu.title') : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 space-y-3 p-3" data-runway-more-menu>
        <p className="text-sm font-semibold">{t('runway.moreMenu.title')}</p>

        <div className="grid gap-1.5">
          {showShare ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-9 w-full justify-start text-xs"
              onClick={() => void handleCopyEmailCampaign()}
              data-runway-email-campaign-copy
            >
              <Share2 className="mr-2 h-3.5 w-3.5" />
              {t('runway.emailCampaignCopy')}
            </Button>
          ) : null}

          {showShare && shareViewModel ? (
            <Popover open={shareOpen} onOpenChange={setShareOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-9 w-full justify-start text-xs"
                  onClick={(e) => {
                    if (e.shiftKey) {
                      e.preventDefault();
                      void handleQuickShare();
                      return;
                    }
                  }}
                >
                  <Share2 className="mr-2 h-3.5 w-3.5" />
                  {t('runway.share')}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-72 p-0" side="left">
                <RunwayShareCard
                  viewModel={shareViewModel}
                  onShare={handleShareTrack}
                  onCopy={() =>
                    toast({
                      title: t('runway.sharePreviewCopied'),
                      description: t('runway.sharePreviewCopiedDesc'),
                    })
                  }
                />
              </PopoverContent>
            </Popover>
          ) : null}

          {showCompare && onOpenCompare ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-9 w-full justify-start text-xs"
              onClick={() => {
                onOpenCompare();
                setOpen(false);
              }}
            >
              <GitCompare className="mr-2 h-3.5 w-3.5" />
              {t('runway.compareVariants')}
            </Button>
          ) : null}

          {showWishlist && onToggleWishlist ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-9 w-full justify-start text-xs"
              onClick={() => {
                onToggleWishlist();
                setOpen(false);
              }}
              aria-pressed={isInWishlist}
            >
              <Heart
                className={cn('mr-2 h-3.5 w-3.5', isInWishlist && 'fill-amber-500 text-amber-500')}
              />
              {isInWishlist ? t('runway.wishlistRemove') : t('runway.wishlistAdd')}
            </Button>
          ) : null}

          {showFullscreen && onToggleFullscreen ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-9 w-full justify-start text-xs"
              onClick={() => {
                void onToggleFullscreen();
                setOpen(false);
              }}
            >
              {isFullscreen ? (
                <Minimize2 className="mr-2 h-3.5 w-3.5" />
              ) : (
                <Maximize2 className="mr-2 h-3.5 w-3.5" />
              )}
              {isFullscreen ? t('runway.fullscreenExit') : t('runway.fullscreenEnter')}
            </Button>
          ) : null}

          {showAutoTour && onAutoTourStart && onAutoTourStop ? (
            <div className="pt-0.5">
              <RunwayAutoTourButton
                isRunning={autoTourRunning}
                isComplete={autoTourComplete}
                onStart={() => {
                  onAutoTourStart();
                  setOpen(false);
                }}
                onStop={onAutoTourStop}
                className="h-9 w-full justify-start border-0 bg-transparent px-2 shadow-none hover:bg-muted"
              />
            </div>
          ) : null}

          {showAiStylist ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-9 w-full justify-start text-xs"
              onClick={() => {
                onOpenStylist?.();
                setOpen(false);
              }}
            >
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              {t('runway.moreMenu.aiStylist')}
            </Button>
          ) : null}
        </div>

        {optionsAvailable ? (
          <div className="border-t border-border/60 pt-3">
            <RunwayOptionsContent
              prefs={prefs}
              onUpdate={onUpdatePrefs}
              showKeyboardLegend={false}
            />
          </div>
        ) : null}

        <RunwayKeyboardLegend embedded />
      </PopoverContent>
    </Popover>
  );
}

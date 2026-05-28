'use client';

import { useMemo, useState } from 'react';
import { Heart, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { buildRunwayShareUrl } from '@/hooks/useScrollExperienceUrlSync';
import { trackScrollExperienceEvent } from '@/lib/scroll-experience-analytics';
import type { Product } from '@/lib/types';
import { resolveScrollSwitcherSections } from '@/lib/product-scroll-switcher';
import {
  buildRunwayShareCardViewModel,
  formatRunwayShareCardPlainText,
} from '@/lib/runway/runway-share-card';
import { t } from '@/lib/runway/runway-i18n';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RunwayShareCard } from '@/components/product/scroll-switcher/RunwayShareCard';

interface SwitcherToolbarProps {
  product: Product;
  activeSection: number;
  isInWishlist: boolean;
  onToggleWishlist?: () => void;
  showWishlist?: boolean;
  showShare?: boolean;
  surface?: string;
  className?: string;
}

/** Share + wishlist — rich preview card + Web Share / clipboard. */
export function SwitcherToolbar({
  product,
  activeSection,
  isInWishlist,
  onToggleWishlist,
  showWishlist = true,
  showShare = true,
  surface = 'pdp',
  className,
}: SwitcherToolbarProps) {
  const { toast } = useToast();
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
        return;
      }
      await navigator.clipboard.writeText(plain);
      toast({
        title: t('runway.shareCopied'),
        description: t('runway.shareCopiedDesc'),
      });
    } catch {
      toast({
        title: t('runway.shareFailed'),
        description: shareViewModel.shareUrl,
        variant: 'destructive',
      });
    }
  };

  if (!showShare && !showWishlist) return null;

  return (
    <div
      className={cn(
        'pointer-events-auto absolute right-3 top-3 z-20 flex items-center gap-1.5 md:right-4 md:top-4',
        className
      )}
    >
      {showShare && shareViewModel ? (
        <Popover open={shareOpen} onOpenChange={setShareOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-9 w-9 bg-background/90 backdrop-blur-sm"
              aria-label={t('runway.share')}
              onClick={(e) => {
                if (!e.shiftKey) return;
                e.preventDefault();
                void handleQuickShare();
              }}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-72 p-0">
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
      {showWishlist && onToggleWishlist ? (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9 bg-background/90 backdrop-blur-sm"
          onClick={onToggleWishlist}
          aria-label={isInWishlist ? t('runway.wishlistRemove') : t('runway.wishlistAdd')}
          aria-pressed={isInWishlist}
        >
          <Heart className={cn('h-4 w-4', isInWishlist && 'fill-amber-500 text-amber-500')} />
        </Button>
      ) : null}
    </div>
  );
}

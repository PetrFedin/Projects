'use client';

import Image from 'next/image';
import { Copy, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { RunwayShareCardViewModel } from '@/lib/runway/runway-share-card';
import { formatRunwayShareCardPlainText } from '@/lib/runway/runway-share-card';
import { t } from '@/lib/runway/runway-i18n';

interface RunwayShareCardProps {
  viewModel: RunwayShareCardViewModel;
  className?: string;
  onShare?: () => void;
  onCopy?: () => void;
}

/**
 * Rich preview для шаринга runway: название, секция, цена, thumb.
 * Используется в share-flow и опционально с Web Share API.
 */
export function RunwayShareCard({ viewModel, className, onShare, onCopy }: RunwayShareCardProps) {
  const plain = formatRunwayShareCardPlainText(viewModel);

  const handleCopy = async () => {
    onCopy?.();
    try {
      await navigator.clipboard.writeText(plain);
    } catch {
      /* caller shows toast */
    }
  };

  const handleNativeShare = async () => {
    onShare?.();
    if (!navigator.share) {
      await handleCopy();
      return;
    }
    try {
      const payload: ShareData = {
        title: viewModel.headline,
        text: viewModel.description,
        url: viewModel.shareUrl,
      };
      if (navigator.canShare?.({ files: [] })) {
        await navigator.share(payload);
      } else {
        await navigator.share(payload);
      }
    } catch {
      /* user cancelled */
    }
  };

  return (
    <article
      className={cn(
        'overflow-hidden rounded-lg border border-border bg-card text-foreground shadow-sm',
        className
      )}
      aria-label={t('runway.share.cardLabel', { headline: viewModel.headline })}
    >
      <div className="flex gap-3 p-3">
        {viewModel.thumbUrl ? (
          <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
            <Image src={viewModel.thumbUrl} alt="" fill className="object-cover" sizes="56px" />
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {viewModel.brand ?? 'Runway'}
          </p>
          <p className="truncate font-headline text-sm font-bold">{viewModel.productName}</p>
          <p className="text-xs text-muted-foreground">
            {t('runway.share.variant', {
              label: viewModel.sectionLabel,
              n: viewModel.sectionIndex + 1,
            })}
          </p>
          <p className="mt-1 text-sm font-bold tabular-nums text-primary">
            {viewModel.priceFormatted}
          </p>
        </div>
      </div>
      <div className="flex border-t border-border">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="flex-1 gap-1.5 rounded-none text-xs"
          onClick={handleCopy}
        >
          <Copy className="h-3.5 w-3.5" />
          {t('runway.share.copy')}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="flex-1 gap-1.5 rounded-none border-l border-border text-xs"
          onClick={handleNativeShare}
        >
          <Share2 className="h-3.5 w-3.5" />
          {t('runway.share.action')}
        </Button>
      </div>
    </article>
  );
}

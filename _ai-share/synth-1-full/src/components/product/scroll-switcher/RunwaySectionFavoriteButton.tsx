'use client';

import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { t } from '@/lib/runway/runway-i18n';

interface RunwaySectionFavoriteButtonProps {
  sectionIndex: number;
  sectionLabel: string;
  isFavorite: boolean;
  onToggle: () => void;
  className?: string;
}

/** Звезда избранного варианта секции — localStorage per product. */
export function RunwaySectionFavoriteButton({
  sectionIndex,
  sectionLabel,
  isFavorite,
  onToggle,
  className,
}: RunwaySectionFavoriteButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={cn(
        'h-8 w-8 bg-background/90 backdrop-blur-sm',
        isFavorite && 'border-amber-400/60 text-amber-500',
        className
      )}
      onClick={onToggle}
      data-runway-favorite
      aria-label={
        isFavorite
          ? t('runway.favorite.remove', { label: sectionLabel })
          : t('runway.favorite.add', { label: sectionLabel })
      }
      aria-pressed={isFavorite}
    >
      <Star className={cn('h-4 w-4', isFavorite && 'fill-current')} />
      <span className="sr-only">{t('runway.favorite.section', { n: sectionIndex + 1 })}</span>
    </Button>
  );
}

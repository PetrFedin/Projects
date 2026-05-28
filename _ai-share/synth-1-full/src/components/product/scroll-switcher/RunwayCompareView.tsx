'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { X, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { RunwaySectionViewModel } from '@/lib/product-scroll-switcher';
import { t } from '@/lib/runway/runway-i18n';

export interface RunwayCompareViewProps {
  open: boolean;
  onClose: () => void;
  sections: RunwaySectionViewModel[];
  leftIndex: number;
  rightIndex: number;
  prefersReducedMotion?: boolean;
}

function formatPrice(value: number): string {
  return `${value.toLocaleString('ru-RU')} ₽`;
}

function ComparePanel({
  section,
  role,
  className,
}: {
  section: RunwaySectionViewModel;
  role: 'left' | 'right';
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {role === 'left' ? t('runway.compareCurrent') : t('runway.compareOther')}
      </p>
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border bg-muted">
        {section.heroUrl ? (
          <Image
            src={section.heroUrl}
            alt={section.label}
            fill
            className="object-cover"
            sizes="50vw"
          />
        ) : (
          <div className="h-full w-full" style={{ backgroundColor: section.color }} />
        )}
      </div>
      <div>
        <p className="font-headline text-lg font-bold">{section.label}</p>
        <p className="text-sm font-bold text-primary">{formatPrice(section.price)}</p>
        {section.material ? (
          <p className="mt-1 text-xs text-muted-foreground">{section.material}</p>
        ) : null}
      </div>
      {section.sectionStory ? (
        <p className="text-xs leading-relaxed text-muted-foreground">{section.sectionStory}</p>
      ) : null}
    </div>
  );
}

/**
 * Side-by-side compare — desktop split, mobile toggle.
 * URL: ?compare=0,2 или кнопка «Сравнить варианты».
 */
export function RunwayCompareView({
  open,
  onClose,
  sections,
  leftIndex,
  rightIndex,
  prefersReducedMotion = false,
}: RunwayCompareViewProps) {
  const [mobileSide, setMobileSide] = useState<'left' | 'right'>('left');

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const left = sections[leftIndex];
  const right = sections[rightIndex];
  if (!left || !right) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm',
        !prefersReducedMotion && 'duration-200 animate-in fade-in'
      )}
      role="dialog"
      aria-modal="true"
      aria-label={t('runway.compareVariants')}
      data-runway-compare-view
    >
      <div className="relative flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold">{t('runway.compareVariants')}</h2>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label={t('runway.aria.close')}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Desktop: side-by-side */}
        <div className="hidden flex-1 gap-6 overflow-y-auto p-6 md:grid md:grid-cols-2">
          <ComparePanel section={left} role="left" />
          <ComparePanel section={right} role="right" />
        </div>

        {/* Mobile: toggle */}
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 md:hidden">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={mobileSide === 'left' ? 'default' : 'outline'}
              size="sm"
              className="min-h-[44px] flex-1"
              onClick={() => setMobileSide('left')}
            >
              {left.label}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="min-h-[44px] min-w-[44px] shrink-0"
              onClick={() => setMobileSide(mobileSide === 'left' ? 'right' : 'left')}
              aria-label={t('runway.aria.compareFlip')}
              data-runway-compare-flip
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={mobileSide === 'right' ? 'default' : 'outline'}
              size="sm"
              className="min-h-[44px] flex-1"
              onClick={() => setMobileSide('right')}
            >
              {right.label}
            </Button>
          </div>
          <ComparePanel section={mobileSide === 'left' ? left : right} role={mobileSide} />
        </div>
      </div>
    </div>
  );
}

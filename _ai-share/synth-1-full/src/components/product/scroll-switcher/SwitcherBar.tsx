'use client';

import Image from 'next/image';
import { memo, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { sectionLocalProgress } from '@/lib/scroll-switcher-math';
import { RUNWAY_MOBILE_TOUCH_MIN_PX } from '@/lib/scroll-switcher-constants';
import type { Product } from '@/lib/types';
import type { RunwaySectionViewModel } from '@/lib/product-scroll-switcher';
import { resolveSectionThumbImage } from '@/lib/product-scroll-switcher';
import { t } from '@/lib/runway/runway-i18n';

interface SwitcherBarProps {
  product: Product;
  sections: RunwaySectionViewModel[];
  activeSection: number;
  pulseSection: number | null;
  /** Нормализованный прогресс 0–1 для кольцевого индикатора. */
  progress?: number;
  onSelect: (index: number) => void;
  onThumbHover?: (index: number) => void;
  onThumbHoverEnd?: () => void;
  /** Kiosk — крупные touch targets. */
  kioskLargeThumbs?: boolean;
  /** Minimal layout — меньшие thumbs, без hover-preview. */
  minimalChrome?: boolean;
}

function formatPrice(value: number): string {
  return `${value.toLocaleString('ru-RU')} ₽`;
}

/** SVG-кольцо прогресса вокруг активного thumb (luxury indicator). */
function ThumbProgressRing({
  size,
  localProgress,
  className,
}: {
  size: number;
  localProgress: number;
  className?: string;
}) {
  const stroke = 2;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - localProgress);

  return (
    <svg
      className={cn('pointer-events-none absolute inset-0 -rotate-90', className)}
      width={size}
      height={size}
      aria-hidden
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="opacity-90 transition-[stroke-dashoffset] duration-150 ease-out"
      />
    </svg>
  );
}

/** Нижняя панель превью вариантов — pill/chip в стиле PDP и каталога. */
function SwitcherBarInner({
  product,
  sections,
  activeSection,
  pulseSection,
  progress = 0,
  onSelect,
  onThumbHover,
  onThumbHoverEnd,
  kioskLargeThumbs = false,
  minimalChrome = false,
}: SwitcherBarProps) {
  const localProgress = sectionLocalProgress(progress, sections.length);
  const touchStartX = useRef<number | null>(null);

  const handleTouchStartBar = (clientX: number) => {
    touchStartX.current = clientX;
  };

  const handleTouchEndBar = (clientX: number) => {
    if (touchStartX.current == null || sections.length < 2) return;
    const delta = clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return;
    if (delta < 0) {
      onSelect(Math.min(sections.length - 1, activeSection + 1));
    } else {
      onSelect(Math.max(0, activeSection - 1));
    }
  };

  const focusThumb = useCallback((index: number) => {
    const el = document.querySelector<HTMLButtonElement>(`[data-runway-thumb="${index}"]`);
    el?.focus({ preventScroll: true });
  }, []);

  const handleBarKeyDown = (e: React.KeyboardEvent) => {
    if (sections.length < 2) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.min(sections.length - 1, activeSection + 1);
      onSelect(next);
      focusThumb(next);
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = Math.max(0, activeSection - 1);
      onSelect(prev);
      focusThumb(prev);
    }
    if (e.key === 'Home') {
      e.preventDefault();
      onSelect(0);
      focusThumb(0);
    }
    if (e.key === 'End') {
      e.preventDefault();
      const last = sections.length - 1;
      onSelect(last);
      focusThumb(last);
    }
  };

  return (
    <div
      data-runway-thumbs-bar
      role="tablist"
      aria-label={t('runway.aria.thumbStrip')}
      onKeyDown={handleBarKeyDown}
      className={cn(
        'absolute bottom-0 left-1/2 z-20 flex -translate-x-1/2 items-end gap-2 rounded-full border border-border bg-background/90 px-3 pb-2 pt-1 backdrop-blur-md',
        minimalChrome
          ? 'h-12 gap-1.5 border-border/50 bg-background/80 px-2 shadow-none'
          : 'shadow-sm',
        kioskLargeThumbs ? 'h-20 gap-3 px-4' : minimalChrome ? 'h-12' : 'h-14',
        'max-md:max-w-[calc(100%-1rem)] max-md:snap-x max-md:snap-mandatory max-md:overflow-x-auto max-md:overscroll-x-contain max-md:rounded-2xl max-md:px-2 max-md:pb-[max(0.5rem,env(safe-area-inset-bottom))]'
      )}
      onTouchStart={(e) => handleTouchStartBar(e.touches[0]?.clientX ?? 0)}
      onTouchEnd={(e) => handleTouchEndBar(e.changedTouches[0]?.clientX ?? 0)}
    >
      {sections.map((section, index) => {
        const isActive = index === activeSection;
        const outer = kioskLargeThumbs
          ? isActive
            ? 52
            : 44
          : minimalChrome
            ? isActive
              ? 36
              : 40
            : isActive
              ? 38
              : 28;
        const inner = kioskLargeThumbs
          ? isActive
            ? 44
            : 38
          : minimalChrome
            ? isActive
              ? 30
              : 34
            : isActive
              ? 32
              : 22;
        const thumb = section.thumbUrl ?? resolveSectionThumbImage(product, section, index);
        const btnSize = Math.max(RUNWAY_MOBILE_TOUCH_MIN_PX, outer + 12);

        return (
          <button
            key={section.id}
            type="button"
            role="tab"
            data-runway-thumb={index}
            aria-label={t('runway.thumb.aria', {
              label: section.label,
              price: formatPrice(section.price),
              current: index + 1,
              total: sections.length,
            })}
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            className="group relative flex shrink-0 snap-center flex-col items-center justify-end transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            style={{ minWidth: btnSize, minHeight: btnSize, width: btnSize, height: btnSize + 8 }}
            onClick={() => onSelect(index)}
            onMouseEnter={() => onThumbHover?.(index)}
            onMouseLeave={() => onThumbHoverEnd?.()}
            onFocus={() => onThumbHover?.(index)}
            onBlur={() => onThumbHoverEnd?.()}
          >
            {!minimalChrome ? (
              <span className="pointer-events-none absolute bottom-full mb-2 hidden flex-col items-center opacity-0 transition-opacity duration-200 group-hover:flex group-hover:opacity-100 group-focus-visible:flex group-focus-visible:opacity-100">
                <span className="overflow-hidden rounded-lg border border-border bg-background shadow-lg">
                  {thumb ? (
                    <Image
                      src={thumb}
                      alt=""
                      width={120}
                      height={120}
                      className="h-[120px] w-[120px] object-cover"
                    />
                  ) : (
                    <span
                      className="block h-[120px] w-[120px]"
                      style={{ backgroundColor: section.color }}
                    />
                  )}
                </span>
                <span className="mt-1.5 max-w-[120px] truncate text-center text-[10px] font-medium">
                  {section.label}
                </span>
                <span className="text-[10px] tabular-nums text-primary">
                  {formatPrice(section.price)}
                </span>
              </span>
            ) : null}

            <span
              className="relative flex items-center justify-center"
              style={{ width: outer, height: outer }}
            >
              {isActive ? <ThumbProgressRing size={outer} localProgress={localProgress} /> : null}
              <span
                className={cn(
                  'flex items-center justify-center overflow-hidden rounded-full border-2 transition-all duration-200',
                  isActive
                    ? minimalChrome
                      ? 'scale-[1.02] border-primary shadow-[0_0_0_1px_hsl(var(--primary)/0.35)] ring-2 ring-primary/80 ring-offset-2 ring-offset-background'
                      : 'scale-[1.02] border-primary shadow-[0_0_0_1px_hsl(var(--primary)/0.35)] ring-2 ring-primary ring-offset-2 ring-offset-background'
                    : 'border-border/80 opacity-80 hover:border-muted-foreground/60 hover:opacity-100'
                )}
                style={{
                  width: inner,
                  height: inner,
                  backgroundColor: section.color,
                }}
              >
                {thumb ? (
                  <Image
                    src={thumb}
                    alt=""
                    width={inner}
                    height={inner}
                    className="h-full w-full object-cover"
                    loading={isActive ? 'eager' : 'lazy'}
                    priority={isActive}
                  />
                ) : null}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export const SwitcherBar = memo(SwitcherBarInner);

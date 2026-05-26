'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown, Loader2, Plus, ShoppingBag } from 'lucide-react';
import type { Product, RunwayLookItem } from '@/lib/types';
import {
  RUNWAY_LOOK_ITEM_WIDTH_PX,
  RUNWAY_LOOK_VIRTUALIZE_THRESHOLD,
} from '@/lib/scroll-switcher-constants';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useRunwayLookCart } from '@/hooks/useRunwayLookCart';
import { useToast } from '@/hooks/use-toast';
import { t } from '@/lib/runway/runway-i18n';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface RunwayCompleteLookProps {
  items: RunwayLookItem[];
  sectionLabel: string;
  parentProductSlug?: string;
  sectionIndex?: number;
  catalogProducts?: Product[];
  /** Свёрнут по умолчанию (minimal layout). */
  defaultCollapsed?: boolean;
  /** Не absolute — блок под сценой. */
  embedded?: boolean;
}

function LookItemAddButton({
  item,
  parentProductSlug,
  sectionIndex,
  catalogProducts,
}: {
  item: RunwayLookItem;
  parentProductSlug?: string;
  sectionIndex?: number;
  catalogProducts?: Product[];
}) {
  const { addLookItem, resolveProduct, lookProductRequiresSize, resolveLookProductSizes, pendingSlug } =
    useRunwayLookCart({
      catalogProducts,
      parentProductSlug,
      sectionIndex,
      surface: 'pdp',
    });
  const [sizes, setSizes] = useState<string[]>([]);
  const [needsSize, setNeedsSize] = useState(false);
  const [open, setOpen] = useState(false);
  const loading = pendingSlug === item.slug;

  useEffect(() => {
    let cancelled = false;
    void resolveProduct(item.slug).then((product) => {
      if (cancelled || !product) return;
      setNeedsSize(lookProductRequiresSize(product));
      setSizes(resolveLookProductSizes(product));
    });
    return () => {
      cancelled = true;
    };
  }, [item.slug, resolveProduct]);

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (needsSize) {
      setOpen(true);
      return;
    }
    await addLookItem(item.slug);
  };

  const handleSizePick = async (size: string) => {
    setOpen(false);
    await addLookItem(item.slug, size);
  };

  if (needsSize) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="h-7 shrink-0 px-2 text-[10px]"
            disabled={loading}
            data-runway-look-add={item.slug}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
            {t('runway.completeLook.add')}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-2" align="end" onClick={(e) => e.stopPropagation()}>
          <p className="mb-2 text-[10px] font-medium text-muted-foreground">{t('runway.selectSize')}</p>
          <div className="flex flex-wrap gap-1">
            {sizes.map((size) => (
              <Button
                key={size}
                type="button"
                variant="outline"
                size="sm"
                className="h-8 min-w-[2.25rem] px-2 text-xs"
                data-runway-look-size={size}
                onClick={() => void handleSizePick(size)}
              >
                {size}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Button
      type="button"
      size="sm"
      variant="secondary"
      className="h-7 shrink-0 px-2 text-[10px]"
      disabled={loading}
      data-runway-look-add={item.slug}
      onClick={(e) => void handleQuickAdd(e)}
    >
      {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
      {t('runway.completeLook.add')}
    </Button>
  );
}

/** Горизонтальная полоска «Дополните образ» — virtual scroll при >5 items. */
export function RunwayCompleteLook({
  items,
  sectionLabel,
  parentProductSlug,
  sectionIndex,
  catalogProducts,
  defaultCollapsed = false,
  embedded = false,
}: RunwayCompleteLookProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [expanded, setExpanded] = useState(!defaultCollapsed);
  const { toast } = useToast();
  const { addAllLookItems, isAddingAll } = useRunwayLookCart({
    catalogProducts,
    parentProductSlug,
    sectionIndex,
    surface: 'pdp',
  });

  const shouldVirtualize = items.length > RUNWAY_LOOK_VIRTUALIZE_THRESHOLD;

  const updateMetrics = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setScrollLeft(el.scrollLeft);
    setViewportWidth(el.clientWidth);
  }, []);

  useEffect(() => {
    updateMetrics();
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateMetrics);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateMetrics, items.length]);

  const handleAddAllLook = useCallback(async () => {
    const slugs = items.map((item) => item.slug);
    const result = await addAllLookItems(slugs);
    if (result.added > 0) {
      toast({
        title: t('runway.completeLook.addAllDone', { count: result.added }),
      });
    }
    if (result.failed.length > 0) {
      toast({
        title: t('runway.completeLook.addAllPartial', {
          added: result.added,
          total: slugs.length,
          failed: result.failed.join(', '),
        }),
        variant: result.added > 0 ? 'default' : 'destructive',
      });
    }
  }, [addAllLookItems, items, toast, t]);

  if (items.length === 0) return null;

  const itemWidth = RUNWAY_LOOK_ITEM_WIDTH_PX + 24;
  const buffer = 1;
  const startIndex = shouldVirtualize
    ? Math.max(0, Math.floor(scrollLeft / itemWidth) - buffer)
    : 0;
  const visibleCount = shouldVirtualize
    ? Math.ceil(viewportWidth / itemWidth) + buffer * 2
    : items.length;
  const endIndex = Math.min(items.length, startIndex + visibleCount);
  const visibleItems = shouldVirtualize ? items.slice(startIndex, endIndex) : items;
  const leadingSpacer = shouldVirtualize ? startIndex * itemWidth : 0;
  const trailingSpacer = shouldVirtualize ? (items.length - endIndex) * itemWidth : 0;

  return (
    <div
      className={cn(
        embedded
          ? 'rounded-lg border border-border/60 bg-background/80'
          : 'pointer-events-auto absolute bottom-[4.5rem] left-0 right-0 z-20 px-3 md:bottom-[4.75rem] md:px-6'
      )}
      data-runway-complete-look
    >
      <div
        className={cn(
          embedded
            ? 'px-3 py-2'
            : 'mx-auto max-w-lg rounded-xl border border-border/80 bg-background/90 px-3 py-2 shadow-sm backdrop-blur-md'
        )}
      >
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 text-left"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          data-runway-complete-look-toggle
        >
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {t('runway.completeLook.title', { label: sectionLabel })}
            {shouldVirtualize ? (
              <span className="ml-1 text-muted-foreground/70">({items.length})</span>
            ) : null}
          </p>
          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 text-muted-foreground transition-transform',
              expanded && 'rotate-180'
            )}
            aria-hidden
          />
        </button>
        {expanded ? (
          <>
        <div className="mb-1.5 mt-2 flex justify-end">
          <Button
            type="button"
            size="sm"
            variant="default"
            className="h-7 gap-1 px-2.5 text-[10px]"
            disabled={isAddingAll}
            data-runway-look-add-all
            onClick={() => void handleAddAllLook()}
          >
            {isAddingAll ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <ShoppingBag className="h-3 w-3" />
            )}
            {t('runway.completeLook.addAll')}
          </Button>
        </div>
        <div
          ref={scrollRef}
          onScroll={updateMetrics}
          className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {shouldVirtualize && leadingSpacer > 0 ? (
            <div aria-hidden style={{ minWidth: leadingSpacer, width: leadingSpacer }} />
          ) : null}
          {visibleItems.map((item) => (
            <div
              key={item.slug}
              className="group flex shrink-0 items-center gap-1.5 rounded-lg border border-border/60 bg-card/80 p-1.5 transition-colors hover:border-primary/50 hover:bg-card"
              style={{ minWidth: RUNWAY_LOOK_ITEM_WIDTH_PX + 24, width: RUNWAY_LOOK_ITEM_WIDTH_PX + 24 }}
              data-runway-look-item={item.slug}
            >
              <Link
                href={`/products/${item.slug}`}
                className="flex min-w-0 flex-1 items-center gap-2"
              >
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="40px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-medium leading-tight">{item.name}</p>
                  <p className="text-[10px] tabular-nums text-primary">
                    {item.price.toLocaleString('ru-RU')} ₽
                  </p>
                </div>
              </Link>
              <LookItemAddButton
                item={item}
                parentProductSlug={parentProductSlug}
                sectionIndex={sectionIndex}
                catalogProducts={catalogProducts}
              />
            </div>
          ))}
          {shouldVirtualize && trailingSpacer > 0 ? (
            <div aria-hidden style={{ minWidth: trailingSpacer, width: trailingSpacer }} />
          ) : null}
        </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

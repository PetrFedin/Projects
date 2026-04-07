'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import {
  Palette,
  Ruler,
  Layers,
  Leaf,
  LayoutGrid,
  Columns2,
  FolderTree,
  Bell,
  ArrowRightLeft,
  Shuffle,
  Wand2,
  Calculator,
  Droplets,
} from 'lucide-react';

type Props = { slug: string; sku: string; className?: string };

export function FashionPdpQuickLinks({ slug, sku, className }: Props) {
  const q = (base: string, extra: Record<string, string>) => {
    const u = new URLSearchParams(extra);
    return `${base}?${u.toString()}`;
  };

  return (
    <div className={cn('flex flex-wrap gap-2 mt-3', className)}>
      <Link
        href={q(ROUTES.client.colorStudio, { slug })}
        className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
      >
        <Palette className="h-3.5 w-3.5" />
        Цвет и сочетания
      </Link>
      <Link
        href={q(ROUTES.client.fitAdvisor, { sku })}
        className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
      >
        <Ruler className="h-3.5 w-3.5" />
        Посадка и размер
      </Link>
      <Link
        href={ROUTES.client.sizeConverter}
        className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
      >
        <ArrowRightLeft className="h-3.5 w-3.5" />
        Конвертер размеров
      </Link>
      <Link
        href={q(ROUTES.client.skuAlternatives, { sku })}
        className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
      >
        <Shuffle className="h-3.5 w-3.5" />
        Похожие SKU
      </Link>
      <Link
        href={q(ROUTES.client.sizeCompare, { a: slug })}
        className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
      >
        <Columns2 className="h-3.5 w-3.5" />
        Сравнить SKU
      </Link>
      <Link
        href={q(ROUTES.client.outfitBuilder, { seed: slug })}
        className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
      >
        <Layers className="h-3.5 w-3.5" />
        Собрать образ
      </Link>
      <Link
        href={ROUTES.client.sustainabilityExplorer}
        className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
      >
        <Leaf className="h-3.5 w-3.5" />
        Eco-каталог
      </Link>
      <Link
        href={ROUTES.client.careSymbols}
        className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
      >
        <Droplets className="h-3.5 w-3.5" />
        Уход: пиктограммы
      </Link>
      <Link
        href={q(ROUTES.client.inspirationBoard, { add: slug })}
        className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
      >
        <LayoutGrid className="h-3.5 w-3.5" />
        На доску
      </Link>
      <Link
        href={ROUTES.client.categoryAtlas}
        className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
      >
        <FolderTree className="h-3.5 w-3.5" />
        Категории
      </Link>
      <Link
        href={ROUTES.client.styleQuiz}
        className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
      >
        <Wand2 className="h-3.5 w-3.5" />
        Квиз стиля
      </Link>
      <Link
        href={ROUTES.client.dutyEstimate}
        className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
      >
        <Calculator className="h-3.5 w-3.5" />
        Пошлина (демо)
      </Link>
      <Link
        href={q(ROUTES.client.priceWatch, { addSku: sku })}
        className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
      >
        <Bell className="h-3.5 w-3.5" />
        Следить за ценой
      </Link>
    </div>
  );
}

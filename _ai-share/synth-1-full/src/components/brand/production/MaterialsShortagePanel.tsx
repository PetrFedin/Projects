'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Gavel, Store } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';

export interface ShortageItem {
  id: string;
  name: string;
  category: 'fabric' | 'haberdashery';
  needed: number;
  unit: string;
  stock: number;
  inPurchase?: number;
  collection?: string;
  skuIds?: string[];
}

export interface MaterialsShortagePanelProps {
  items: ShortageItem[];
  onSearchMarketplace: (query: string) => void;
  onSearchAuctions?: (query: string) => void;
  className?: string;
}

const CATEGORY_LABELS = { fabric: 'Ткань', haberdashery: 'Фурнитура' };

export function MaterialsShortagePanel({
  items,
  onSearchMarketplace,
  onSearchAuctions,
  className,
}: MaterialsShortagePanelProps) {
  const shortageItems = items.filter((i) => (i.stock || 0) + (i.inPurchase || 0) < i.needed);

  if (shortageItems.length === 0) return null;

  return (
    <Card className={cn('border-amber-100 bg-amber-50/50', className)}>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <CardTitle className="text-sm font-black uppercase tracking-widest text-amber-900">
            Нехватка сырья
          </CardTitle>
          <Badge variant="outline" className="border-amber-200 text-[9px] text-amber-700">
            {shortageItems.length}
          </Badge>
        </div>
        <p className="mt-1 text-[10px] font-bold uppercase text-amber-700/80">
          Ищите в аукционах и предложениях поставщиков — сравнение цен и ценообразования
        </p>
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-0">
        {shortageItems.map((item) => {
          const def = item.needed - (item.stock || 0) - (item.inPurchase || 0);
          const searchQuery = item.name;
          return (
            <div
              key={item.id}
              className="flex flex-col justify-between gap-2 rounded-xl border border-amber-100 bg-white p-3 transition-colors hover:border-amber-200 sm:flex-row sm:items-center"
            >
              <div className="space-y-0.5">
                <p className="text-text-primary text-[11px] font-bold">{item.name}</p>
                <div className="text-text-secondary flex items-center gap-2 text-[9px] font-bold uppercase">
                  <span>{CATEGORY_LABELS[item.category]}</span>
                  <span>·</span>
                  <span className="text-amber-600">
                    Не хватает: {def} {item.unit}
                  </span>
                  {item.collection && (
                    <>
                      <span>·</span>
                      <Badge variant="outline" className="border-border-default text-[8px]">
                        {item.collection}
                      </Badge>
                    </>
                  )}
                </div>
                <p className="text-text-muted text-[9px]">
                  Остаток: {item.stock} {item.unit} · В закупке: {item.inPurchase ?? 0} {item.unit}
                </p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1 rounded-lg border-amber-200 text-[9px] font-bold uppercase text-amber-700 hover:bg-amber-50"
                  onClick={() => onSearchMarketplace(searchQuery)}
                >
                  <Store className="h-3.5 w-3.5" />
                  Маркетплейс
                </Button>
                {onSearchAuctions && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-accent-primary/30 text-accent-primary hover:bg-accent-primary/10 h-8 gap-1 rounded-lg text-[9px] font-bold uppercase"
                    onClick={() => onSearchAuctions(searchQuery)}
                  >
                    <Gavel className="h-3.5 w-3.5" />
                    Аукционы
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 text-[9px] font-bold uppercase"
                  asChild
                >
                  <Link href={ROUTES.brand.auctions}>Аукционы бренда</Link>
                </Button>
              </div>
            </div>
          );
        })}
        <p className="text-[9px] font-bold uppercase text-amber-800/70">
          Сравните предложения участников, поставщиков и производств по тканям и фурнитуре,
          совпадение материалов и ценообразование
        </p>
      </CardContent>
    </Card>
  );
}

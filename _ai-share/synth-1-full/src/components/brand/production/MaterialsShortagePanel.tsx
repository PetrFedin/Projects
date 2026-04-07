'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Gavel, Store } from 'lucide-react';
import { cn } from '@/lib/utils';

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
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <CardTitle className="text-sm font-black uppercase tracking-widest text-amber-900">
            Нехватка сырья
          </CardTitle>
          <Badge variant="outline" className="text-[9px] border-amber-200 text-amber-700">
            {shortageItems.length}
          </Badge>
        </div>
        <p className="text-[10px] text-amber-700/80 font-bold uppercase mt-1">
          Ищите в аукционах и предложениях поставщиков — сравнение цен и ценообразования
        </p>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        {shortageItems.map((item) => {
          const def = item.needed - (item.stock || 0) - (item.inPurchase || 0);
          const searchQuery = item.name;
          return (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white rounded-xl border border-amber-100 hover:border-amber-200 transition-colors"
            >
              <div className="space-y-0.5">
                <p className="text-[11px] font-bold text-slate-900">{item.name}</p>
                <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500 uppercase">
                  <span>{CATEGORY_LABELS[item.category]}</span>
                  <span>·</span>
                  <span className="text-amber-600">
                    Не хватает: {def} {item.unit}
                  </span>
                  {item.collection && (
                    <>
                      <span>·</span>
                      <Badge variant="outline" className="text-[8px] border-slate-200">
                        {item.collection}
                      </Badge>
                    </>
                  )}
                </div>
                <p className="text-[9px] text-slate-400">
                  Остаток: {item.stock} {item.unit} · В закупке: {item.inPurchase ?? 0} {item.unit}
                </p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-[9px] font-bold uppercase gap-1 rounded-lg border-amber-200 text-amber-700 hover:bg-amber-50"
                  onClick={() => onSearchMarketplace(searchQuery)}
                >
                  <Store className="w-3.5 h-3.5" />
                  Маркетплейс
                </Button>
                {onSearchAuctions && (
                  <Button variant="outline" size="sm" className="h-8 text-[9px] font-bold uppercase gap-1 rounded-lg border-indigo-200 text-indigo-700 hover:bg-indigo-50" onClick={() => onSearchAuctions(searchQuery)}>
                    <Gavel className="w-3.5 h-3.5" />
                    Аукционы
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="h-8 text-[9px] font-bold uppercase gap-1" asChild>
                  <Link href="/brand/auctions">Аукционы бренда</Link>
                </Button>
              </div>
            </div>
          );
        })}
        <p className="text-[9px] text-amber-800/70 font-bold uppercase">
          Сравните предложения участников, поставщиков и производств по тканям и фурнитуре,
          совпадение материалов и ценообразование
        </p>
      </CardContent>
    </Card>
  );
}

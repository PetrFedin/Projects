'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { getProductHeritage } from '@/lib/fashion/heritage-logic';
import { History, Heart, Anchor, Info } from 'lucide-react';

type Props = { product: Product };

export function ProductHeritageBlock({ product }: Props) {
  const heritage = getProductHeritage(product);

  return (
    <Card className="mt-4 border-dashed bg-stone-50/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <History className="h-4 w-4 text-stone-600" />
          Product Heritage & Story
        </CardTitle>
        <CardDescription className="text-xs">
          Культурный код и история создания этой модели.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <p className="text-xs font-bold text-stone-800">{heritage.storyHeadline}</p>
          {heritage.artisanNote && (
            <p className="text-[11px] text-stone-600 leading-relaxed italic border-l-2 border-stone-200 pl-3 py-0.5">
              "{heritage.artisanNote}"
            </p>
          )}
        </div>

        {heritage.archiveReference && (
          <div className="flex items-center gap-2 p-2 rounded bg-stone-100 border border-stone-200">
            <Anchor className="h-3.5 w-3.5 text-stone-500" />
            <span className="text-[10px] font-medium text-stone-700 uppercase tracking-tight">
              Inspired by: {heritage.archiveReference}
            </span>
          </div>
        )}

        <div className="pt-2 border-t border-stone-200 flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Heart className={`h-3 w-3 ${heritage.sustainabilityHigh ? 'text-emerald-600 fill-emerald-600' : 'text-stone-400'}`} />
            <span className="text-[9px] text-stone-500 uppercase font-bold tracking-widest">
              {heritage.sustainabilityHigh ? 'High Impact Craft' : 'Artisan Quality'}
            </span>
          </div>
          <span className="text-[9px] text-stone-400 font-mono">Archive ID: {product.sku.slice(0, 4)}-HIST</span>
        </div>
      </CardContent>
    </Card>
  );
}

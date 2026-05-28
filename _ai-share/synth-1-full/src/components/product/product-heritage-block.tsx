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
        <CardTitle className="flex items-center gap-2 text-sm">
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
            <p className="border-l-2 border-stone-200 py-0.5 pl-3 text-[11px] italic leading-relaxed text-stone-600">
              "{heritage.artisanNote}"
            </p>
          )}
        </div>

        {heritage.archiveReference && (
          <div className="flex items-center gap-2 rounded border border-stone-200 bg-stone-100 p-2">
            <Anchor className="h-3.5 w-3.5 text-stone-500" />
            <span className="text-[10px] font-medium uppercase tracking-tight text-stone-700">
              Inspired by: {heritage.archiveReference}
            </span>
          </div>
        )}

        <div className="flex items-center gap-3 border-t border-stone-200 pt-2">
          <div className="flex items-center gap-1">
            <Heart
              className={`h-3 w-3 ${heritage.sustainabilityHigh ? 'fill-emerald-600 text-emerald-600' : 'text-stone-400'}`}
            />
            <span className="text-[9px] font-bold uppercase tracking-widest text-stone-500">
              {heritage.sustainabilityHigh ? 'High Impact Craft' : 'Artisan Quality'}
            </span>
          </div>
          <span className="font-mono text-[9px] text-stone-400">
            Archive ID: {product.sku.slice(0, 4)}-HIST
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

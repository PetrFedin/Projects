'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { findBundlesForProduct } from '@/lib/fashion/bundle-logic';
import { products } from '@/lib/products';
import { Sparkles, ShoppingBag } from 'lucide-react';

type Props = { product: Product };

export function ProductBundleOfferBlock({ product }: Props) {
  const bundles = findBundlesForProduct(product, products);
  if (bundles.length === 0) return null;

  const bundle = bundles[0];

  return (
    <Card className="mt-4 border-primary/30 bg-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Спецпредложение: Купите образом
        </CardTitle>
        <CardDescription className="text-xs">
          {bundle.name} — скидка {bundle.discountPct}% на весь сет.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground line-through">
              {bundle.totalOriginal} ₽
            </p>
            <p className="text-lg font-bold text-primary">
              {bundle.totalDiscounted} ₽
            </p>
          </div>
          <Button size="sm" className="gap-2">
            <ShoppingBag className="h-4 w-4" />
            Добавить сет в корзину
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground italic">
          * Цена включает скидку {bundle.discountPct}% при покупке всех позиций образа.
        </p>
      </CardContent>
    </Card>
  );
}

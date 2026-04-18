'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LayoutGrid, Palette, Target, Zap } from 'lucide-react';
import { products } from '@/lib/products';
import { optimizeVisualGrid } from '@/lib/fashion/visual-merch';

export default function VisualMerchGridPage() {
  const slots = optimizeVisualGrid(products);

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="bg-accent-primary/15 rounded-lg p-2">
            <LayoutGrid className="text-accent-primary h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Visual Merchandising Grid</h1>
        </div>
        <p className="text-muted-foreground">
          AI-optimized product placement for digital storefronts and physical shelf planning.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {slots.map((slot) => {
          const product = products.find((p) => p.sku === slot.sku);
          if (!product) return null;

          return (
            <Card
              key={slot.sku}
              className="hover:border-accent-primary/40 overflow-hidden border-2 transition-colors"
            >
              <div className="bg-bg-surface2 group relative aspect-[3/4]">
                <img
                  src={product.images?.[0]?.url ?? ''}
                  alt={product.name}
                  className="h-full w-full object-cover grayscale-[20%] transition-all group-hover:grayscale-0"
                />
                <div className="absolute left-2 top-2 flex flex-col gap-1">
                  <Badge className="border-none bg-white/90 text-black shadow-sm">
                    POS #{slot.position}
                  </Badge>
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-white">
                  <div className="truncate text-xs font-bold">{product.name}</div>
                  <div className="text-[10px] opacity-80">{product.sku}</div>
                </div>
              </div>

              <div className="space-y-3 bg-white p-3">
                <div className="text-text-muted flex items-center justify-between text-[10px] font-black uppercase">
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-yellow-500" />
                    Visual Weight: {slot.visualWeight}%
                  </div>
                </div>

                <div className="text-text-muted flex items-center justify-between text-[10px] font-black uppercase">
                  <div className="flex items-center gap-1">
                    <Palette className="text-accent-primary h-3 w-3" />
                    Harmony: {slot.colorHarmonyScore}%
                  </div>
                </div>

                <div className="border-t pt-2">
                  <div className="flex flex-wrap gap-1">
                    {product.attributes?.mainColor && (
                      <Badge variant="secondary" className="h-4 text-[9px]">
                        {product.attributes.mainColor}
                      </Badge>
                    )}
                    <Badge variant="outline" className="h-4 text-[9px]">
                      {product.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

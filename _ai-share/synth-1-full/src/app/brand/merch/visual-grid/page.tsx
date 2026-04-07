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
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <LayoutGrid className="w-6 h-6 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Visual Merchandising Grid</h1>
        </div>
        <p className="text-muted-foreground">
          AI-optimized product placement for digital storefronts and physical shelf planning.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {slots.map((slot) => {
          const product = products.find(p => p.sku === slot.sku);
          if (!product) return null;

          return (
            <Card key={slot.sku} className="overflow-hidden border-2 hover:border-indigo-400 transition-colors">
              <div className="aspect-[3/4] bg-slate-100 relative group">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all"
                />
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  <Badge className="bg-white/90 text-black border-none shadow-sm">
                    POS #{slot.position}
                  </Badge>
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-white">
                  <div className="text-xs font-bold truncate">{product.name}</div>
                  <div className="text-[10px] opacity-80">{product.sku}</div>
                </div>
              </div>
              
              <div className="p-3 bg-white space-y-3">
                <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-yellow-500" />
                    Visual Weight: {slot.visualWeight}%
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
                  <div className="flex items-center gap-1">
                    <Palette className="w-3 h-3 text-indigo-500" />
                    Harmony: {slot.colorHarmonyScore}%
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex flex-wrap gap-1">
                    {product.attributes?.mainColor && (
                      <Badge variant="secondary" className="text-[9px] h-4">
                        {product.attributes.mainColor}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-[9px] h-4">
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

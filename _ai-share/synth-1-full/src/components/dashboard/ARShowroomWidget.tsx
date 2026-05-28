'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Camera, Maximize2, Play, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useB2BState } from '@/providers/b2b-state';
import { useState } from 'react';

export function ARShowroomWidget() {
  const { b2bCart } = useB2BState();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  // Get products with 3D models (mock)
  const productsWithAR = b2bCart.slice(0, 3).map((item) => ({
    ...item,
    has3D: true,
    hasAR: item.id === '1' || item.id === '2',
    hasVideo: true,
  }));

  if (productsWithAR.length === 0) {
    return (
      <Card className="border-accent-primary/20 rounded-xl border-2 shadow-xl">
        <CardContent className="p-3 text-center">
          <Eye className="text-accent-primary mx-auto mb-4 h-12 w-12" />
          <h3 className="text-text-primary mb-2 font-black">No Products in Cart</h3>
          <p className="text-text-secondary text-sm">Add products to preview in AR</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-accent-primary/20 rounded-xl border-2 shadow-xl">
      <CardHeader className="border-border-subtle from-accent-primary/10 to-accent-primary/10 border-b bg-gradient-to-r">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-accent-primary flex h-12 w-12 items-center justify-center rounded-xl">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-text-primary text-sm font-black uppercase tracking-tight">
                Virtual Showroom
              </CardTitle>
              <p className="text-text-secondary text-[10px] font-medium">3D & AR Preview</p>
            </div>
          </div>

          <Badge className="bg-accent-primary animate-pulse text-[7px] font-black uppercase text-white">
            ✨ AI POWERED
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-4">
        {productsWithAR.map((product) => (
          <div
            key={product.id}
            className={cn(
              'cursor-pointer rounded-xl border-2 p-4 transition-all',
              selectedProduct === product.id
                ? 'bg-accent-primary/10 border-accent-primary/30'
                : 'bg-bg-surface2 border-border-default hover:border-accent-primary/30'
            )}
            onClick={() => setSelectedProduct(product.id)}
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <img
                  src={product.images?.[0]?.url || '/placeholder.jpg'}
                  alt={product.name}
                  className="h-20 w-20 rounded-lg object-cover"
                />
                {product.hasAR && (
                  <div className="bg-accent-primary absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="text-text-primary mb-2 text-sm font-black uppercase leading-tight">
                  {product.name}
                </h4>

                <div className="flex flex-wrap gap-2">
                  {product.has3D && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-[8px] font-black uppercase"
                    >
                      <Maximize2 className="mr-1 h-3 w-3" />
                      3D View
                    </Button>
                  )}

                  {product.hasAR && (
                    <Button
                      size="sm"
                      className="bg-accent-primary hover:bg-accent-primary h-7 text-[8px] font-black uppercase"
                    >
                      <Camera className="mr-1 h-3 w-3" />
                      Try AR
                    </Button>
                  )}

                  {product.hasVideo && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-[8px] font-black uppercase"
                    >
                      <Play className="mr-1 h-3 w-3" />
                      Catwalk
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {selectedProduct === product.id && (
              <div className="border-accent-primary/20 mt-4 rounded-lg border-2 bg-white p-4">
                <div className="from-accent-primary/15 to-accent-primary/15 mb-3 flex aspect-video items-center justify-center rounded-lg bg-gradient-to-br">
                  <div className="text-center">
                    <Eye className="text-accent-primary mx-auto mb-2 h-12 w-12" />
                    <p className="text-accent-primary text-sm font-black uppercase">3D Viewer</p>
                    <p className="text-accent-primary text-[10px]">
                      Rotate • Zoom • Inspect Details
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="h-8 flex-1 text-[8px] font-black uppercase">
                    <Maximize2 className="mr-1 h-3 w-3" />
                    Fullscreen
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 flex-1 text-[8px] font-black uppercase"
                  >
                    Share View
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="from-accent-primary/10 to-accent-primary/10 border-accent-primary/20 rounded-xl border-2 bg-gradient-to-r p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="text-accent-primary mt-0.5 h-5 w-5 flex-shrink-0" />
            <div>
              <p className="text-accent-primary mb-1 text-[10px] font-black uppercase">
                AR Try-On Available
              </p>
              <p className="text-accent-primary text-[9px] leading-relaxed">
                Use your device camera to see how products look in real environment. Works best with
                bags, accessories, and footwear.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { getStylePairings } from '@/lib/fashion/pairing-logic';
import { products } from '@/lib/products';
import { Sparkles, ArrowRight } from 'lucide-react';

type Props = { product: Product };

export function ProductStylePairingBlock({ product }: Props) {
  const pairings = getStylePairings(product, products);
  if (pairings.length === 0) return null;

  return (
    <Card className="mt-4 border-dashed bg-muted/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          С чем носить
        </CardTitle>
        <CardDescription className="text-xs">
          Стилистические рекомендации на основе конструктивных признаков модели.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {pairings.map(p => (
            <Link key={p.sku} href={`/products/${p.slug}`} className="group space-y-2">
              <div className="relative aspect-[3/4] rounded-md overflow-hidden border bg-muted">
                <Image 
                  src={p.images[0]?.url} 
                  alt={p.name} 
                  fill 
                  className="object-cover transition-transform group-hover:scale-105" 
                  sizes="120px"
                />
              </div>
              <div>
                <p className="text-[10px] font-medium line-clamp-1 group-hover:text-primary transition-colors">{p.name}</p>
                <p className="text-[10px] text-muted-foreground">{p.price.toLocaleString()} ₽</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t flex justify-end">
          <Link href="/client/outfit-builder" className="text-[10px] text-primary font-medium flex items-center gap-1 hover:underline">
            Перейти в конструктор образа <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

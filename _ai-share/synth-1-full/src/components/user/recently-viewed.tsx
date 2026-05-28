'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Clock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import allProducts from '@/lib/products';

export default function RecentlyViewed() {
  const { user } = useAuth();
  const [viewedProducts, setViewedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!user || typeof window === 'undefined') return;

    // Get recently viewed from localStorage
    const viewed = localStorage.getItem(`syntha_recently_viewed_${user.uid}`);
    if (viewed) {
      const productIds = JSON.parse(viewed) as string[];
      const products = productIds
        .map((id) => allProducts.find((p) => p.id === id))
        .filter((p): p is Product => p !== undefined && p.price !== undefined)
        .slice(0, 8);
      setViewedProducts(products);
    } else {
      // Demo data for Elena Petrova
      const demoViewed = allProducts.filter((p): p is Product => p.price !== undefined).slice(0, 8);
      setViewedProducts(demoViewed);
      localStorage.setItem(
        `syntha_recently_viewed_${user.uid}`,
        JSON.stringify(demoViewed.map((p) => p.id))
      );
    }
  }, [user]);

  if (viewedProducts.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Вы недавно смотрели
            </CardTitle>
            <CardDescription>{viewedProducts.length} товаров</CardDescription>
          </div>
          <Button variant="link" size="sm" asChild>
            <Link href="/search?recent=true">
              Все просмотры <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {viewedProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.slug}`} className="group relative">
              <div className="relative mb-2 aspect-square overflow-hidden rounded-lg bg-muted">
                <Image
                  src={product.images?.[0]?.url || (product as any).image || '/placeholder.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <p className="line-clamp-2 text-sm font-medium transition-colors group-hover:text-accent">
                {product.name}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {(product.price || 0).toLocaleString('ru-RU')} ₽
              </p>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

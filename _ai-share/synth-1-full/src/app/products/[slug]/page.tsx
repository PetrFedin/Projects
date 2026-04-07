
'use client';

import { use, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import ProductPageContent from './page-content';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductPage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
  const params = use(paramsPromise);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch('/data/products.json');
        const products: Product[] = await response.json();
        const foundProduct = products.find(p => p.slug === params.slug);
        setProduct(foundProduct || null);
      } catch (error) {
        console.error("Failed to fetch product", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-4">
        <div className="grid md:grid-cols-2 gap-3 lg:gap-3">
            <div className="flex flex-col gap-3">
                <Skeleton className="aspect-[4/5] w-full rounded-lg"/>
                <div className="grid grid-cols-4 gap-3">
                    <Skeleton className="aspect-square w-full rounded-md"/>
                    <Skeleton className="aspect-square w-full rounded-md"/>
                    <Skeleton className="aspect-square w-full rounded-md"/>
                    <Skeleton className="aspect-square w-full rounded-md"/>
                </div>
            </div>
            <div className="py-4 space-y-4">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-10 w-2/3" />
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  return <ProductPageContent product={product} />;
}

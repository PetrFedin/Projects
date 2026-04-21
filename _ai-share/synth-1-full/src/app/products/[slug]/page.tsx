'use client';

import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
import { use, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import ProductPageContent from '@/components/product/product-page-content';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchWithHttpDeadline } from '@/lib/http/http-fetch-deadline';

export default function ProductPage({
  params: paramsPromise,
}: {
  params: Promise<{ slug: string }>;
}) {
  const params = use(paramsPromise);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetchWithHttpDeadline('/data/products.json');
        const products = (await response.json()) as Product[];
        const foundProduct = products.find((p) => p.slug === params.slug);
        setProduct(foundProduct || null);
      } catch (error) {
        console.error('Failed to fetch product', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.slug]);

  if (loading) {
    return (
      <CabinetPageContent maxWidth="7xl" className="p-4">
        <div className="grid gap-3 md:grid-cols-2 lg:gap-3">
          <div className="flex flex-col gap-3">
            <Skeleton className="aspect-[4/5] w-full rounded-lg" />
            <div className="grid grid-cols-4 gap-3">
              <Skeleton className="aspect-square w-full rounded-md" />
              <Skeleton className="aspect-square w-full rounded-md" />
              <Skeleton className="aspect-square w-full rounded-md" />
              <Skeleton className="aspect-square w-full rounded-md" />
            </div>
          </div>
          <div className="space-y-4 py-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </CabinetPageContent>
    );
  }

  if (!product) {
    notFound();
  }

  return <ProductPageContent product={product} />;
}

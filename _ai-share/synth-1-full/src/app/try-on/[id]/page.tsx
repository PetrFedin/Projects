'use client';

import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import VirtualTryOn from '@/components/product/try-on/VirtualTryOn';
import { products as allProducts } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { RegistryPageShell } from '@/components/design-system';

export default function TryOnPage() {
  const params = useParams();
  const id = params.id as string;

  const product = useMemo(() => {
    return allProducts.find((p) => p.id === id) || allProducts[0];
  }, [id]);

  return (
    <div className="min-h-screen bg-white">
      <RegistryPageShell className="pb-16">
        <header className="mb-12 flex items-center justify-between">
          <Link href={ROUTES.shop.product(product.id)}>
            <Button
              variant="ghost"
              className="text-text-muted hover:text-text-primary rounded-xl text-[10px] font-black uppercase tracking-widest"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Product
            </Button>
          </Link>
          <div className="text-right">
            <p className="text-text-muted mb-0.5 text-[10px] font-black uppercase">
              {product.brand}
            </p>
            <h2 className="text-text-primary text-base font-black uppercase leading-none tracking-tight">
              {product.name}
            </h2>
          </div>
        </header>

        <VirtualTryOn product={product} />
      </RegistryPageShell>
    </div>
  );
}

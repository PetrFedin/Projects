'use client';

import dynamic from 'next/dynamic';
import type { Product } from '@/lib/types';
import { useDeferredMount } from '@/components/home/hooks/use-deferred-mount';

const ProductScrollSwitcherFeatured = dynamic(
  () =>
    import('@/components/product/ProductScrollSwitcherFeatured').then((m) => ({
      default: m.ProductScrollSwitcherFeatured,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        className="mx-auto min-h-[420px] max-w-6xl animate-pulse rounded-xl bg-muted/40"
        aria-hidden
      />
    ),
  }
);

type ProductScrollSwitcherFeaturedGateProps = {
  products: Product[];
  productsReady: boolean;
};

/** Runway block — IO/idle после products.json. */
export function ProductScrollSwitcherFeaturedGate({
  products,
  productsReady,
}: ProductScrollSwitcherFeaturedGateProps) {
  const { sentinelRef, ready } = useDeferredMount({
    enabled: productsReady && products.length > 0,
    rootMargin: '400px 0px',
    idleTimeout: 3000,
  });

  if (!productsReady || products.length === 0) {
    return (
      <div
        className="mx-auto min-h-[420px] max-w-6xl animate-pulse rounded-xl bg-muted/40"
        aria-hidden
      />
    );
  }

  return (
    <>
      <div ref={sentinelRef} className="h-px w-full shrink-0" aria-hidden />
      {ready ? (
        <ProductScrollSwitcherFeatured products={products} />
      ) : (
        <div
          className="mx-auto min-h-[420px] max-w-6xl animate-pulse rounded-xl bg-muted/40"
          aria-hidden
        />
      )}
    </>
  );
}

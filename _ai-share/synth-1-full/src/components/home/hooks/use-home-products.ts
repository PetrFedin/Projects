'use client';

import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { waitForIdle } from '@/lib/wait-for-idle';
import { HOME_ROLES_NEEDING_PRODUCTS } from '@/components/home/hooks/home-data-roles';
import { loadHomeProductsCatalog } from '@/components/home/lib/home-products-catalog';

type UseHomeProductsOptions = {
  viewRole?: string;
};

/** products.json — mid-fold/showroom; shared cache + prefetch из shell. */
export function useHomeProducts({ viewRole = 'client' }: UseHomeProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsReady, setProductsReady] = useState(
    () => !HOME_ROLES_NEEDING_PRODUCTS.has(viewRole)
  );

  useEffect(() => {
    if (!HOME_ROLES_NEEDING_PRODUCTS.has(viewRole)) {
      setProducts([]);
      setProductsReady(true);
      return;
    }

    let cancelled = false;
    setProductsReady(false);

    (async () => {
      await waitForIdle();
      if (cancelled) return;
      try {
        const allProducts = await loadHomeProductsCatalog();
        if (!cancelled) setProducts(allProducts);
      } finally {
        if (!cancelled) setProductsReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [viewRole]);

  return { products, productsReady };
}

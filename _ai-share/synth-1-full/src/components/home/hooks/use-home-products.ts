'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { waitForIdle } from '@/lib/wait-for-idle';
import { HOME_ROLES_NEEDING_PRODUCTS } from '@/components/home/hooks/home-data-roles';
import {
  loadHomeProductsCatalog,
  readHomeProductsCatalogCache,
  seedHomeProductsCatalog,
} from '@/components/home/lib/home-products-catalog';

type UseHomeProductsOptions = {
  viewRole?: string;
};

/** products.json — mid-fold/showroom; shared cache + RSC seed / prefetch из shell. */
export function useHomeProducts({ viewRole = 'client' }: UseHomeProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>(() => {
    if (!HOME_ROLES_NEEDING_PRODUCTS.has(viewRole)) return [];
    return readHomeProductsCatalogCache() ?? [];
  });
  const [productsReady, setProductsReady] = useState(() => {
    if (!HOME_ROLES_NEEDING_PRODUCTS.has(viewRole)) return true;
    return readHomeProductsCatalogCache() !== undefined;
  });

  useEffect(() => {
    if (!HOME_ROLES_NEEDING_PRODUCTS.has(viewRole)) {
      setProducts([]);
      setProductsReady(true);
      return;
    }

    const cached = readHomeProductsCatalogCache();
    if (cached !== undefined) {
      setProducts(cached);
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

/** Прогрев client cache из RSC baseline до mid-fold mount. */
export function useSeedHomeProductsCatalog(initialProducts?: Product[]): void {
  useLayoutEffect(() => {
    if (initialProducts === undefined) return;
    if (readHomeProductsCatalogCache() !== undefined) return;
    seedHomeProductsCatalog(initialProducts);
  }, [initialProducts]);
}

'use client';

import { useCallback, useRef, useState } from 'react';
import type { Product } from '@/lib/types';
import { useUIState } from '@/providers/ui-state';
import { trackScrollExperienceEvent } from '@/lib/scroll-experience-analytics';
import {
  fetchLookProductBySlug,
  lookProductRequiresSize,
  resolveDefaultLookSize,
  resolveLookProductSizes,
  uniqueLookItemSlugs,
  type RunwayLookCartBulkResult,
} from '@/lib/runway/runway-look-cart';

export interface UseRunwayLookCartOptions {
  catalogProducts?: Product[];
  surface?: string;
  parentProductSlug?: string;
  sectionIndex?: number;
}

/** Добавление look-item в корзину — реальный cart hook, не dead button. */
export function useRunwayLookCart({
  catalogProducts,
  surface = 'pdp',
  parentProductSlug,
  sectionIndex,
}: UseRunwayLookCartOptions) {
  const { addCartItem, openCart } = useUIState();
  const cacheRef = useRef<Map<string, Product>>(new Map());
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);
  const [isAddingAll, setIsAddingAll] = useState(false);

  const resolveProduct = useCallback(
    async (slug: string): Promise<Product | null> => {
      const cached = cacheRef.current.get(slug);
      if (cached) return cached;
      const product = await fetchLookProductBySlug(slug, catalogProducts);
      if (product) cacheRef.current.set(slug, product);
      return product;
    },
    [catalogProducts]
  );

  const addLookItem = useCallback(
    async (slug: string, sizeOverride?: string) => {
      setPendingSlug(slug);
      try {
        const product = await resolveProduct(slug);
        if (!product) return false;

        const size = sizeOverride ?? resolveDefaultLookSize(product);
        await addCartItem(product, size, 1);
        openCart();

        trackScrollExperienceEvent('scroll_experience_add_to_cart', {
          productSlug: product.slug,
          productId: product.id,
          brand: product.brand,
          sectionIndex,
          price: product.price,
          surface: `${surface}:complete-look`,
          source: parentProductSlug,
        });

        return true;
      } finally {
        setPendingSlug(null);
      }
    },
    [addCartItem, openCart, parentProductSlug, resolveProduct, sectionIndex, surface]
  );

  /** Добавляет все look-items с default/first size; частичные ошибки не блокируют остальные. */
  const addAllLookItems = useCallback(
    async (slugs: string[]): Promise<RunwayLookCartBulkResult> => {
      const unique = uniqueLookItemSlugs(slugs);
      if (!unique.length) return { added: 0, failed: [] };

      setIsAddingAll(true);
      const failed: string[] = [];
      let added = 0;

      try {
        for (const slug of unique) {
          try {
            const product = await resolveProduct(slug);
            if (!product) {
              failed.push(slug);
              continue;
            }
            const size = resolveDefaultLookSize(product);
            await addCartItem(product, size, 1);
            added += 1;

            trackScrollExperienceEvent('scroll_experience_add_to_cart', {
              productSlug: product.slug,
              productId: product.id,
              brand: product.brand,
              sectionIndex,
              price: product.price,
              surface: `${surface}:complete-look-bulk`,
              source: parentProductSlug,
            });
          } catch {
            failed.push(slug);
          }
        }

        if (added > 0) openCart();
        return { added, failed };
      } finally {
        setIsAddingAll(false);
      }
    },
    [addCartItem, openCart, parentProductSlug, resolveProduct, sectionIndex, surface]
  );

  return {
    addLookItem,
    addAllLookItems,
    resolveProduct,
    resolveLookProductSizes,
    lookProductRequiresSize,
    pendingSlug,
    isAddingAll,
  };
}

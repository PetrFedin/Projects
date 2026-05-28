'use client';

import { useHomeCmsConfig } from '@/components/home/hooks/use-home-cms-config';
import { useHomeProducts } from '@/components/home/hooks/use-home-products';

type UseHomePageDataOptions = {
  viewRole?: string;
};

/** @deprecated Используйте useHomeCmsConfig + useHomeProducts (split re-renders). */
export function useHomePageData({ viewRole = 'client' }: UseHomePageDataOptions = {}) {
  const cfg = useHomeCmsConfig();
  const { products, productsReady } = useHomeProducts({ viewRole });
  return { cfg, products, productsReady };
}

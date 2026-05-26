import type { CmsHomeConfig } from '@/data/cms.home.default';
import type { Product } from '@/lib/types';
import { HomePageClient } from './HomePageClient';

type HomePageDynamicProps = {
  initialCms?: CmsHomeConfig;
  initialProducts?: Product[];
};

/**
 * Server-safe обёртка → client boundary в `HomePageClient`.
 * Тяжёлые секции лениво грузятся внутри client shell.
 */
export function HomePageDynamic({ initialCms, initialProducts }: HomePageDynamicProps) {
  return <HomePageClient initialCms={initialCms} initialProducts={initialProducts} />;
}

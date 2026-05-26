import type { CmsHomeConfig } from '@/data/cms.home.default';
import { HomePageClient } from './HomePageClient';

type HomePageDynamicProps = {
  initialCms?: CmsHomeConfig;
};

/**
 * Server-safe обёртка → client boundary в `HomePageClient`.
 * Тяжёлые секции лениво грузятся внутри client shell.
 */
export function HomePageDynamic({ initialCms }: HomePageDynamicProps) {
  return <HomePageClient initialCms={initialCms} />;
}

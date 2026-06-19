import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { COLLECTION_DEV_HUB_TITLE_RU } from '@/lib/production/collection-development-labels';

type RouteParams = { collectionId: string; articleId: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { collectionId, articleId } = await params;
  const col = decodeURIComponent(collectionId);
  const art = decodeURIComponent(articleId);
  return {
    title: `Разработка · ${art}`,
    description: `${COLLECTION_DEV_HUB_TITLE_RU} · досье SKU: ТЗ и согласования, затем сэмплы и выпуск. Коллекция ${col}.`,
  };
}

export default function Workshop2ArticleRouteLayout({ children }: { children: ReactNode }) {
  return children;
}

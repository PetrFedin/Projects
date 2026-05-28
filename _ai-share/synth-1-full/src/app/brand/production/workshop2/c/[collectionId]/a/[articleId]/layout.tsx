import type { ReactNode } from 'react';
import type { Metadata } from 'next';

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
    description: `Разработка коллекции · досье SKU: обзор и ТЗ (разработка и согласования), затем от supply-path — сэмплы и выпуск. Коллекция ${col}.`,
  };
}

export default function Workshop2ArticleRouteLayout({ children }: { children: ReactNode }) {
  return children;
}

import { redirect } from 'next/navigation';
import { getPlatformCoreDemo } from '@/lib/platform-core-hub-matrix';
import { workshop2ArticleHref } from '@/lib/production/workshop2-url';

export default async function Workshop2CollectionRedirectPage({
  params,
}: {
  params: Promise<{ collectionId: string }>;
}) {
  const { collectionId } = await params;
  const { demoArticleId } = getPlatformCoreDemo(collectionId);
  redirect(workshop2ArticleHref(collectionId, demoArticleId));
}

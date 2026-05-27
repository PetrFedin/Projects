import { redirect } from 'next/navigation';

export default async function Workshop2CollectionRedirectPage({
  params,
}: {
  params: Promise<{ collectionId: string }>;
}) {
  const { collectionId } = await params;
  redirect(`/brand/production/workshop2/c/${encodeURIComponent(collectionId)}/a/demo-ss27-01`);
}

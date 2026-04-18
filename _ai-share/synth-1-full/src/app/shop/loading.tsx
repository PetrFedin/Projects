import { PageSkeleton } from '@/components/ui/page-skeleton';

export default function ShopLoading() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-6 pb-24">
      <PageSkeleton />
    </div>
  );
}

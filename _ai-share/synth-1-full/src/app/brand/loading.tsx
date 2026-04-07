import { PageSkeleton } from '@/components/ui/page-skeleton';

export default function BrandLoading() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl pb-24">
      <PageSkeleton />
    </div>
  );
}

import { PageSkeleton } from '@/components/ui/page-skeleton';

export default function BrandLoading() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 pb-24">
      <PageSkeleton />
    </div>
  );
}

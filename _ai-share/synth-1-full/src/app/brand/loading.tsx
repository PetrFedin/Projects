import { PageSkeleton } from '@/components/ui/page-skeleton';
import { cn } from '@/lib/utils';
import { registryFeedLayout } from '@/lib/ui/registry-feed-layout';

export default function BrandLoading() {
  return (
    <div className={cn(registryFeedLayout.pageShell, 'max-w-7xl')}>
      <PageSkeleton />
    </div>
  );
}

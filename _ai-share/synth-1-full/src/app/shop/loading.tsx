import { PageSkeleton } from '@/components/ui/page-skeleton';
import { cn } from '@/lib/utils';
import { registryFeedLayout } from '@/lib/ui/registry-feed-layout';

export default function ShopLoading() {
  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-6xl px-4 py-6 pb-24">
=======
    <div className={cn(registryFeedLayout.pageShell, 'max-w-6xl')}>
>>>>>>> recover/cabinet-wip-from-stash
      <PageSkeleton />
    </div>
  );
}

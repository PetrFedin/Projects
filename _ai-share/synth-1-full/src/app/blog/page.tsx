<<<<<<< HEAD
export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-4 text-center">
      <h1 className="font-headline text-sm font-bold">Блог</h1>
      <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground">
        Статьи, новости и истории от наших брендов. Скоро здесь будет интересно!
=======
import { cn } from '@/lib/utils';
import { registryFeedLayout } from '@/lib/ui/registry-feed-layout';

export default function BlogPage() {
  return (
    <div className={cn(registryFeedLayout.pageShell, 'text-center')}>
      <h1 className="font-headline text-sm font-bold">Блог</h1>
      <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground">
        Новости и материалы платформы.
>>>>>>> recover/cabinet-wip-from-stash
      </p>
    </div>
  );
}

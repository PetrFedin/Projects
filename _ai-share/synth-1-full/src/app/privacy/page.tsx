<<<<<<< HEAD
export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-4 text-center">
      <h1 className="font-headline text-sm font-bold">Политика конфиденциальности</h1>
      <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground">
        Как мы обрабатываем и защищаем ваши данные.
=======
import { cn } from '@/lib/utils';
import { registryFeedLayout } from '@/lib/ui/registry-feed-layout';

export default function PrivacyPage() {
  return (
    <div className={cn(registryFeedLayout.pageShell, 'text-center')}>
      <h1 className="font-headline text-sm font-bold">Конфиденциальность</h1>
      <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground">
        Политика конфиденциальности Syntha.
>>>>>>> recover/cabinet-wip-from-stash
      </p>
    </div>
  );
}

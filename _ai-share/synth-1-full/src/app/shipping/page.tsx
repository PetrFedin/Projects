import { cn } from '@/lib/utils';
import { registryFeedLayout } from '@/lib/ui/registry-feed-layout';

export default function ShippingPage() {
  return (
    <div className={cn(registryFeedLayout.pageShell, 'text-center')}>
      <h1 className="font-headline text-sm font-bold">Доставка</h1>
      <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground">
        Информация о доставке заказов.
      </p>
    </div>
  );
}

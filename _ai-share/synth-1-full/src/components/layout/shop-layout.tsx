'use client';

import { usePathname } from 'next/navigation';
import { ShoppingCart, Bell, LayoutDashboard } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { mainShopNavLinks } from '@/lib/data/shop-navigation';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const isB2bSection = pathname.startsWith('/shop/b2b');

  const handleShopTabChange = (value: string) => {
    const link = mainShopNavLinks.find((l) => l.value === value);
    if (link) {
      router.push(link.href);
    }
  };

  const getShopCurrentTab = () => {
    const sortedLinks = [...mainShopNavLinks].sort((a, b) => b.href.length - a.href.length);
    const currentBase = sortedLinks.find((link) => pathname.startsWith(link.href));
    return currentBase?.value || 'overview';
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-4 sm:px-6">
      <header className="mb-8 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <ShoppingCart className="h-8 w-8" />
          <div>
            <h1 className="font-headline text-base font-bold">Кабинет магазина</h1>
            <p className="text-muted-foreground">
              Управляйте розничными продажами и оптовыми закупками.
            </p>
          </div>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge
                variant="destructive"
                className="absolute -right-1 -top-1 h-4 w-4 justify-center p-0"
              >
                3
              </Badge>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0">
            <div className="p-4">
              <h4 className="text-sm font-medium">Уведомления</h4>
            </div>
            <Separator />
            <div className="space-y-3 p-4 text-sm">
              <p>
                <span className="font-semibold">Syntha</span> согласовал ваш заказ{' '}
                <span className="font-mono">#B2B-0012</span>.
              </p>
              <p>
                <span className="font-semibold">A.P.C.</span> опубликовал новую коллекцию.
              </p>
              <p>
                Товар <span className="font-semibold">"Шелковое платье-миди"</span> от Syntha снова
                в наличии.
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </header>

      <Tabs value={getShopCurrentTab()} onValueChange={handleShopTabChange} className="w-full">
        {/* cabinetSurface v1 */}
        <TabsList className={cn(cabinetSurface.tabsList, 'flex-wrap')}>
          {mainShopNavLinks.map((link) => {
            const NavIcon = link.icon ?? LayoutDashboard;
            return (
              <TabsTrigger
                key={link.value}
                value={link.value}
                className={cn(
                  cabinetSurface.tabsTrigger,
                  'h-9 gap-2 text-sm font-semibold normal-case tracking-normal'
                )}
              >
                <NavIcon className="h-4 w-4 shrink-0" />
                {link.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      <div className="py-6">{children}</div>
    </div>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Zap, ShoppingBag } from 'lucide-react';
import { useUIState } from '@/providers/ui-state';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

export default function PreOrderSheet() {
  const { isPreOrderOpen, togglePreOrder, preOrders } = useUIState();

  return (
    <Sheet open={isPreOrderOpen} onOpenChange={togglePreOrder}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader className="pr-6">
          <SheetTitle className="flex items-center gap-2 font-headline text-sm uppercase tracking-tighter">
            <Zap className="h-6 w-6 fill-current text-amber-500" />
            Предзаказы
          </SheetTitle>
        </SheetHeader>
        {preOrders && preOrders.length > 0 ? (
          <ScrollArea className="-mx-6 mt-4 flex-1">
            <div className="space-y-4 px-6">
              {preOrders.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize}`}
                  className="flex items-start gap-3 rounded-2xl border border-muted/10 bg-muted/20 p-3"
                >
                  <div className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={item.images?.[0]?.url || (item as any).image || '/placeholder.jpg'}
                      alt={item.images?.[0]?.alt || item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <p className="text-[10px] font-black uppercase text-muted-foreground">
                      {item.brand}
                    </p>
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={togglePreOrder}
                      className="text-sm font-black uppercase leading-tight transition-colors hover:text-accent"
                    >
                      {item.name}
                    </Link>
                    {item.selectedSize && (
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">
                        Размер: {item.selectedSize}
                      </p>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm font-black">{item.price.toLocaleString('ru-RU')} ₽</p>
                      <Badge
                        variant="outline"
                        className="border-amber-500 text-[8px] font-black uppercase text-amber-600"
                      >
                        Ожидается
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <Zap className="mb-4 h-12 w-12 text-muted-foreground/20" />
            <h3 className="text-base font-black uppercase tracking-tighter">
              Список предзаказов пуст
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Здесь будут отображаться товары, на которые вы оставили запрос
            </p>
            <Button
              asChild
              className="mt-6 rounded-xl text-xs font-black uppercase tracking-widest"
              onClick={togglePreOrder}
            >
              <Link href="/search">В каталог</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

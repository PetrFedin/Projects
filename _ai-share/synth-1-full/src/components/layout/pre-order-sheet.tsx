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
      <SheetContent className="w-full flex flex-col sm:max-w-md">
        <SheetHeader className="pr-6">
          <SheetTitle className="font-headline text-sm flex items-center gap-2 uppercase tracking-tighter">
            <Zap className="h-6 w-6 text-amber-500 fill-current" />
            Предзаказы
          </SheetTitle>
        </SheetHeader>
        {preOrders && preOrders.length > 0 ? (
          <ScrollArea className="flex-1 -mx-6 mt-4">
            <div className="px-6 space-y-4">
              {preOrders.map(item => (
                <div key={`${item.id}-${item.selectedSize}`} className="flex gap-3 items-start bg-muted/20 p-3 rounded-2xl border border-muted/10">
                  <div className="relative aspect-[4/5] w-20 rounded-xl overflow-hidden shrink-0">
                    <Image src={item.images?.[0]?.url || (item as any).image || '/placeholder.jpg'} alt={item.images?.[0]?.alt || item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <p className="text-[10px] font-black uppercase text-muted-foreground">{item.brand}</p>
                    <Link href={`/products/${item.slug}`} onClick={togglePreOrder} className="font-black hover:text-accent transition-colors text-sm uppercase leading-tight">
                      {item.name}
                    </Link>
                    {item.selectedSize && <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-tighter">Размер: {item.selectedSize}</p>}
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm font-black">{item.price.toLocaleString('ru-RU')} ₽</p>
                      <Badge variant="outline" className="text-[8px] font-black border-amber-500 text-amber-600 uppercase">Ожидается</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Zap className="h-12 w-12 text-muted-foreground/20 mb-4" />
            <h3 className="text-base font-black uppercase tracking-tighter">Список предзаказов пуст</h3>
            <p className="text-muted-foreground text-sm mt-1">Здесь будут отображаться товары, на которые вы оставили запрос</p>
            <Button asChild className="mt-6 rounded-xl font-black uppercase text-xs tracking-widest" onClick={togglePreOrder}>
              <Link href="/search">В каталог</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

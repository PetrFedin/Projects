'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Star } from 'lucide-react';
import ProductCard from '@/components/product-card';
import { useUIState } from '@/providers/ui-state';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '../ui/separator';

export default function WishlistSheet() {
  const { isWishlistOpen, toggleWishlist, wishlistCollections } = useUIState();

  const totalItems = wishlistCollections.reduce(
    (acc, collection) => acc + collection.items.length,
    0
  );

  return (
    <Sheet open={isWishlistOpen} onOpenChange={toggleWishlist}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader className="pr-6">
          <SheetTitle className="font-headline text-sm">Список желаний</SheetTitle>
        </SheetHeader>

        {totalItems > 0 ? (
          <ScrollArea className="-mx-6 flex-1">
            <div className="space-y-6 px-6">
              {wishlistCollections.map((collection) => (
                <div key={collection.id}>
                  <h3 className="mb-2 text-sm font-semibold">{collection.name}</h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {collection.items.map((item) => (
                      <ProductCard key={item.id} product={item} />
                    ))}
                  </div>
                  <Separator className="mt-6" />
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <Star className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="text-base font-semibold">Ваш список желаний пуст</h3>
            <p className="mt-1 text-muted-foreground">
              Нажмите на звездочку, чтобы сохранить товары.
            </p>
            <Button asChild className="mt-6" onClick={toggleWishlist}>
              <Link href="/search">Продолжить покупки</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

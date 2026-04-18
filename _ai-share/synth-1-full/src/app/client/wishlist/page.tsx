'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart, ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { useUIState } from '@/providers/ui-state';
import ProductCard from '@/components/product-card';

/** ASOS-style: страница «Избранное» и пункт в навбаре. */
export default function ClientWishlistPage() {
  const { wishlist } = useUIState();

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6 pb-24">
      <div className="mb-6 flex items-center gap-3">
        <Link href={ROUTES.client.home}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold uppercase tracking-tight">
            <Heart className="h-6 w-6 text-rose-500" /> Избранное
          </h1>
<<<<<<< HEAD
          <p className="mt-0.5 text-sm text-slate-500">{wishlist.length} товаров</p>
=======
          <p className="text-text-secondary mt-0.5 text-sm">{wishlist.length} товаров</p>
>>>>>>> recover/cabinet-wip-from-stash
        </div>
      </div>

      {wishlist.length === 0 ? (
        <Card className="border-border-subtle">
          <CardContent className="py-12 text-center">
<<<<<<< HEAD
            <Heart className="mx-auto mb-3 h-12 w-12 text-slate-200" />
            <p className="font-medium text-slate-500">В избранном пока ничего нет</p>
            <p className="mt-1 text-sm text-slate-400">
=======
            <Heart className="text-text-muted mx-auto mb-3 h-12 w-12" />
            <p className="text-text-secondary font-medium">В избранном пока ничего нет</p>
            <p className="text-text-muted mt-1 text-sm">
>>>>>>> recover/cabinet-wip-from-stash
              Добавляйте понравившиеся товары — они появятся здесь.
            </p>
            <Button className="mt-4" asChild>
              <Link href="/search">Перейти в каталог</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} viewMode="grid" />
          ))}
        </div>
      )}
      <div className="mt-6 flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="/search">Каталог</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.client.home}>В личный кабинет</Link>
        </Button>
      </div>
    </div>
  );
}

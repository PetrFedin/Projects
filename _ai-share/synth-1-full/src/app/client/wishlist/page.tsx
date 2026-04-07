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
    <div className="container max-w-6xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.client.home}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2"><Heart className="h-6 w-6 text-rose-500" /> Избранное</h1>
          <p className="text-slate-500 text-sm mt-0.5">{wishlist.length} товаров</p>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <Card className="border-slate-100">
          <CardContent className="py-12 text-center">
            <Heart className="h-12 w-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">В избранном пока ничего нет</p>
            <p className="text-slate-400 text-sm mt-1">Добавляйте понравившиеся товары — они появятся здесь.</p>
            <Button className="mt-4" asChild><Link href="/search">Перейти в каталог</Link></Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} viewMode="grid" />
          ))}
        </div>
      )}
      <div className="mt-6 flex gap-2">
        <Button variant="outline" size="sm" asChild><Link href="/search">Каталог</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.client.home}>В личный кабинет</Link></Button>
      </div>
    </div>
  );
}

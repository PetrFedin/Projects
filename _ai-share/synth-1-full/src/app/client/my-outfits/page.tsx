'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Shirt, Trash2, ShoppingCart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTES } from '@/lib/routes';
import { useUIState } from '@/providers/ui-state';
import allProductsData from '@/lib/products';
import type { Product, SavedCartOutfit } from '@/lib/types';
import { lineRefMatchesCartItem, subtotalForItems } from '@/lib/cart-outfit-utils';
import { useMemo } from 'react';

function outfitPreviewUrls(outfit: SavedCartOutfit, catalog: Product[], max = 5): string[] {
  const urls: string[] = [];
  for (const ref of outfit.lineRefs) {
    const p = catalog.find((x) => x.id === ref.productId);
    const u = p?.images?.[0]?.url;
    if (u) urls.push(u);
    if (urls.length >= max) break;
  }
  return urls;
}

function outfitCatalogSubtotal(outfit: SavedCartOutfit, catalog: Product[]): number {
  let sum = 0;
  for (const ref of outfit.lineRefs) {
    const p = catalog.find((x) => x.id === ref.productId);
    if (p) sum += p.price || 0;
  }
  return sum;
}

export default function ClientMyOutfitsPage() {
  const {
    savedCartOutfits,
    deleteCartOutfit,
    applyCartOutfitToCart,
    setActiveCartOutfitId,
    toggleCart,
    cart,
  } = useUIState();

  const catalog = allProductsData as Product[];

  const rows = useMemo(() => {
    return savedCartOutfits.map((o) => ({
      outfit: o,
      thumbs: outfitPreviewUrls(o, catalog),
      catalogTotal: outfitCatalogSubtotal(o, catalog),
      inCartTotal: subtotalForItems(
        cart.filter((item) => o.lineRefs.some((ref) => lineRefMatchesCartItem(ref, item)))
      ),
    }));
  }, [savedCartOutfits, catalog, cart]);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6 pb-24">
      <div className="mb-6 flex items-center gap-3">
        <Link href={ROUTES.client.home}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold uppercase tracking-tight">
<<<<<<< HEAD
            <Shirt className="h-6 w-6 text-indigo-600" />
            Мои образы
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
=======
            <Shirt className="text-accent-primary h-6 w-6" />
            Мои образы
          </h1>
          <p className="text-text-secondary mt-0.5 text-sm">
>>>>>>> recover/cabinet-wip-from-stash
            Сохранённые наборы из корзины: сумма в каталоге и в текущей корзине.
          </p>
        </div>
      </div>

      {rows.length === 0 ? (
        <Card className="border-border-subtle">
          <CardContent className="py-12 text-center">
<<<<<<< HEAD
            <Shirt className="mx-auto mb-3 h-12 w-12 text-slate-200" />
            <p className="font-medium text-slate-500">Пока нет сохранённых образов</p>
            <p className="mt-1 text-sm text-slate-400">
=======
            <Shirt className="text-text-muted mx-auto mb-3 h-12 w-12" />
            <p className="text-text-secondary font-medium">Пока нет сохранённых образов</p>
            <p className="text-text-muted mt-1 text-sm">
>>>>>>> recover/cabinet-wip-from-stash
              В корзине отметьте позиции и нажмите «В образ».
            </p>
            <Button className="mt-4" onClick={toggleCart}>
              Открыть корзину
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-4">
          {rows.map(({ outfit, thumbs, catalogTotal, inCartTotal }) => (
            <li key={outfit.id}>
<<<<<<< HEAD
              <Card className="overflow-hidden border-slate-100">
=======
              <Card className="border-border-subtle overflow-hidden">
>>>>>>> recover/cabinet-wip-from-stash
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="flex shrink-0 gap-1">
                      {thumbs.length === 0 ? (
<<<<<<< HEAD
                        <div className="flex h-20 w-16 items-center justify-center rounded bg-slate-100 px-1 text-center text-[10px] font-bold uppercase text-slate-300">
=======
                        <div className="bg-bg-surface2 text-text-muted flex h-20 w-16 items-center justify-center rounded px-1 text-center text-[10px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                          Нет фото
                        </div>
                      ) : (
                        thumbs.map((url, i) => (
                          <div
                            key={i}
<<<<<<< HEAD
                            className="relative h-20 w-14 overflow-hidden rounded border border-slate-100 bg-slate-50"
=======
                            className="bg-bg-surface2 border-border-subtle relative h-20 w-14 overflow-hidden rounded border"
>>>>>>> recover/cabinet-wip-from-stash
                          >
                            <Image src={url} alt="" fill className="object-cover" sizes="56px" />
                          </div>
                        ))
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg font-bold leading-tight">{outfit.name}</h2>
<<<<<<< HEAD
                      <p className="mt-1 text-xs text-slate-500">
=======
                      <p className="text-text-secondary mt-1 text-xs">
>>>>>>> recover/cabinet-wip-from-stash
                        {outfit.lineRefs.length} поз. · по каталогу ~
                        {catalogTotal.toLocaleString('ru-RU')} ₽
                      </p>
                      {inCartTotal > 0 && (
<<<<<<< HEAD
                        <p className="mt-0.5 flex items-center gap-1 text-xs font-bold text-indigo-700">
=======
                        <p className="text-accent-primary mt-0.5 flex items-center gap-1 text-xs font-bold">
>>>>>>> recover/cabinet-wip-from-stash
                          <Sparkles className="h-3 w-3" /> В корзине сейчас:{' '}
                          {inCartTotal.toLocaleString('ru-RU')} ₽
                        </p>
                      )}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="text-xs font-bold uppercase"
                          onClick={() => {
                            void applyCartOutfitToCart(outfit.id);
                          }}
                        >
                          <ShoppingCart className="mr-1 h-3.5 w-3.5" />В корзину
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs font-bold uppercase"
                          onClick={() => {
                            setActiveCartOutfitId(outfit.id);
                            toggleCart();
                          }}
                        >
                          Показать в корзине
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                          onClick={() => deleteCartOutfit(outfit.id)}
                        >
                          <Trash2 className="mr-1 h-3.5 w-3.5" />
                          Удалить
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

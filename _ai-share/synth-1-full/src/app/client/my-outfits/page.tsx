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
      inCartTotal: subtotalForItems(cart.filter((item) => o.lineRefs.some((ref) => lineRefMatchesCartItem(ref, item)))),
    }));
  }, [savedCartOutfits, catalog, cart]);

  return (
    <div className="container max-w-3xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.client.home}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2">
            <Shirt className="h-6 w-6 text-indigo-600" />
            Мои образы
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Сохранённые наборы из корзины: сумма в каталоге и в текущей корзине.
          </p>
        </div>
      </div>

      {rows.length === 0 ? (
        <Card className="border-slate-100">
          <CardContent className="py-12 text-center">
            <Shirt className="h-12 w-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Пока нет сохранённых образов</p>
            <p className="text-slate-400 text-sm mt-1">В корзине отметьте позиции и нажмите «В образ».</p>
            <Button className="mt-4" onClick={toggleCart}>
              Открыть корзину
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-4">
          {rows.map(({ outfit, thumbs, catalogTotal, inCartTotal }) => (
            <li key={outfit.id}>
              <Card className="border-slate-100 overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="flex gap-1 shrink-0">
                      {thumbs.length === 0 ? (
                        <div className="h-20 w-16 rounded bg-slate-100 flex items-center justify-center text-slate-300 text-[10px] font-bold uppercase text-center px-1">
                          Нет фото
                        </div>
                      ) : (
                        thumbs.map((url, i) => (
                          <div key={i} className="relative h-20 w-14 rounded overflow-hidden bg-slate-50 border border-slate-100">
                            <Image src={url} alt="" fill className="object-cover" sizes="56px" />
                          </div>
                        ))
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-lg leading-tight">{outfit.name}</h2>
                      <p className="text-xs text-slate-500 mt-1">{outfit.lineRefs.length} поз. · по каталогу ~{catalogTotal.toLocaleString('ru-RU')} ₽</p>
                      {inCartTotal > 0 && (
                        <p className="text-xs font-bold text-indigo-700 mt-0.5 flex items-center gap-1">
                          <Sparkles className="h-3 w-3" /> В корзине сейчас: {inCartTotal.toLocaleString('ru-RU')} ₽
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="text-xs font-bold uppercase"
                          onClick={() => {
                            void applyCartOutfitToCart(outfit.id);
                          }}
                        >
                          <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                          В корзину
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
                          className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                          onClick={() => deleteCartOutfit(outfit.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
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

'use client';

import { RegistryPageShell } from '@/components/design-system';
import { use, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
<<<<<<< HEAD
=======
import { ShopB2bContentHeader } from '@/components/shop/ShopB2bContentHeader';
>>>>>>> recover/cabinet-wip-from-stash
import {
  getShoppableLooksByLookbookId,
  type ShoppableLookProduct,
} from '@/lib/ux/shoppable-lookbook';
import { useB2BState } from '@/providers/b2b-state';
import allProducts from '@/lib/products';

/** JOOR: Shoppable Lookbook — заказ прямо из lookbook */
export default function ShoppableLookbookPage({
  params,
}: {
  params: Promise<{ lookbookId: string }>;
}) {
  const { lookbookId } = use(params);
  const looks = getShoppableLooksByLookbookId(lookbookId);
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const { setB2bCart, b2bCart } = useB2BState();

  const activeLook = looks[activeLookIndex];
  const products = allProducts;

  const handleAddToCart = (prod: ShoppableLookProduct) => {
    const fullProduct = products.find(
      (p) => p.id === prod.productId || (p.sku ?? '').toUpperCase() === prod.sku.toUpperCase()
    );
    const item = {
      id: fullProduct?.id ?? prod.productId,
      sku: prod.sku,
      name: prod.name,
      price: prod.price,
      quantity: 1,
      brand: fullProduct?.brand ?? 'Syntha Lab',
      images: fullProduct?.images,
      selectedSize: prod.size ?? (fullProduct?.sizes as any)?.[0]?.name ?? 'M',
      color: prod.color,
    };
    setB2bCart?.((prev: any[]) => [...(prev ?? []), item]);
    setAddedIds((s) => new Set(s).add(prod.productId));
  };

  if (looks.length === 0) {
    return (
<<<<<<< HEAD
      <div className="container mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-slate-500">Лукбук не найден или в нём нет shoppable look'ов.</p>
=======
      <RegistryPageShell className="max-w-2xl space-y-6 py-12 text-center">
        <p className="text-text-secondary">Лукбук не найден или в нём нет shoppable look'ов.</p>
>>>>>>> recover/cabinet-wip-from-stash
        <Button variant="outline" className="mt-4" asChild>
          <Link href={ROUTES.shop.b2bShowroom}>В шоурум</Link>
        </Button>
      </RegistryPageShell>
    );
  }

  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-4xl px-4 py-6 pb-24">
      <div className="mb-6 flex items-center gap-3">
        <Link href={ROUTES.shop.b2bShowroom}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold uppercase tracking-tight">
            <ShoppingBag className="h-6 w-6" /> Shoppable Lookbook
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            JOOR: клик по продукту на look'е — добавление в заказ
          </p>
        </div>
      </div>
=======
    <RegistryPageShell className="max-w-4xl space-y-6">
      <ShopB2bContentHeader
        backHref={ROUTES.shop.b2bShowroom}
        lead="Клик по товару на look'е — добавление в заказ (JOOR Shoppable Lookbook)."
      />
>>>>>>> recover/cabinet-wip-from-stash

      <div className="mb-4 flex gap-2 overflow-x-auto">
        {looks.map((l, i) => (
          <Button
            key={l.id}
            variant={activeLookIndex === i ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveLookIndex(i)}
          >
            {l.title ?? `Look ${i + 1}`}
          </Button>
        ))}
      </div>

      {activeLook && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{activeLook.title}</CardTitle>
          </CardHeader>
          <CardContent>
<<<<<<< HEAD
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
=======
            <div className="bg-bg-surface2 relative aspect-[4/3] overflow-hidden rounded-xl">
>>>>>>> recover/cabinet-wip-from-stash
              <Image
                src={activeLook.imageUrl}
                alt={activeLook.title ?? 'Look'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
              {activeLook.products.map((prod) => (
                <Hotspot
                  key={prod.productId}
                  product={prod}
                  onAdd={() => handleAddToCart(prod)}
                  added={addedIds.has(prod.productId)}
                />
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {activeLook.products.map((p) => (
                <div
                  key={p.productId}
<<<<<<< HEAD
                  className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm"
=======
                  className="bg-bg-surface2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
>>>>>>> recover/cabinet-wip-from-stash
                >
                  <span className="font-medium">{p.name}</span>
                  <span className="text-text-secondary">{p.price.toLocaleString('ru-RU')} ₽</span>
                  <Button
                    size="sm"
                    variant={addedIds.has(p.productId) ? 'secondary' : 'default'}
                    className="h-7 text-xs"
                    onClick={() => handleAddToCart(p)}
                  >
                    {addedIds.has(p.productId) ? 'В корзине' : <Plus className="h-3 w-3" />}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-6 flex gap-2">
        <Button asChild>
          <Link href={ROUTES.shop.b2bMatrix}>В матрицу заказа</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={ROUTES.shop.b2bShowroom}>Шоурум</Link>
        </Button>
      </div>
    </RegistryPageShell>
  );
}

function Hotspot({
  product,
  onAdd,
  added,
}: {
  product: ShoppableLookProduct;
  onAdd: () => void;
  added: boolean;
}) {
  return (
    <button
      type="button"
<<<<<<< HEAD
      className="absolute flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-indigo-500/90 text-white shadow-lg transition-transform hover:scale-110"
=======
      className="bg-accent-primary/90 absolute flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-white shadow-lg transition-transform hover:scale-110"
>>>>>>> recover/cabinet-wip-from-stash
      style={{ left: `${product.x}%`, top: `${product.y}%`, transform: 'translate(-50%, -50%)' }}
      onClick={onAdd}
      title={`${product.name} — ${product.price.toLocaleString('ru-RU')} ₽`}
    >
      {added ? '✓' : '+'}
    </button>
  );
}

'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingBag, Plus } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { getShoppableLooksByLookbookId, type ShoppableLookProduct } from '@/lib/ux/shoppable-lookbook';
import { useB2BState } from '@/providers/b2b-state';
import allProducts from '@/lib/products';

/** JOOR: Shoppable Lookbook — заказ прямо из lookbook */
export default function ShoppableLookbookPage({ params }: { params: Promise<{ lookbookId: string }> }) {
  const { lookbookId } = use(params);
  const looks = getShoppableLooksByLookbookId(lookbookId);
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const { setB2bCart, b2bCart } = useB2BState();

  const activeLook = looks[activeLookIndex];
  const products = allProducts;

  const handleAddToCart = (prod: ShoppableLookProduct) => {
    const fullProduct = products.find((p) => p.id === prod.productId || (p.sku ?? '').toUpperCase() === prod.sku.toUpperCase());
    const item = {
      id: fullProduct?.id ?? prod.productId,
      sku: prod.sku,
      name: prod.name,
      price: prod.price,
      quantity: 1,
      brand: fullProduct?.brand ?? 'Syntha',
      images: fullProduct?.images,
      selectedSize: prod.size ?? (fullProduct?.sizes as any)?.[0]?.name ?? 'M',
      color: prod.color,
    };
    setB2bCart?.((prev: any[]) => [...(prev ?? []), item]);
    setAddedIds((s) => new Set(s).add(prod.productId));
  };

  if (looks.length === 0) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-500">Лукбук не найден или в нём нет shoppable look'ов.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href={ROUTES.shop.b2bShowroom}>В шоурум</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.shop.b2bShowroom}>
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2">
            <ShoppingBag className="h-6 w-6" /> Shoppable Lookbook
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">JOOR: клик по продукту на look'е — добавление в заказ</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto">
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
            <div className="relative aspect-[4/3] bg-slate-100 rounded-xl overflow-hidden">
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
                <div key={p.productId} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 text-sm">
                  <span className="font-medium">{p.name}</span>
                  <span className="text-slate-500">{p.price.toLocaleString('ru-RU')} ₽</span>
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
        <Button asChild><Link href={ROUTES.shop.b2bMatrix}>В матрицу заказа</Link></Button>
        <Button variant="outline" asChild><Link href={ROUTES.shop.b2bShowroom}>Шоурум</Link></Button>
      </div>
    </div>
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
      className="absolute w-8 h-8 rounded-full border-2 border-white bg-indigo-500/90 text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
      style={{ left: `${product.x}%`, top: `${product.y}%`, transform: 'translate(-50%, -50%)' }}
      onClick={onAdd}
      title={`${product.name} — ${product.price.toLocaleString('ru-RU')} ₽`}
    >
      {added ? '✓' : '+'}
    </button>
  );
}

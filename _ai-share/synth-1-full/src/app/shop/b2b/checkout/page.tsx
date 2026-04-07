'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { useB2BState } from '@/providers/b2b-state';
import { ProductCustomizationBlock } from '@/components/b2b/ProductCustomizationBlock';

/** RepSpark: Product Customization в checkout — логотипы, мокапы при оформлении */
export default function B2BCheckoutPage() {
  const { b2bCart = [] } = useB2BState();
  const total = b2bCart.reduce((acc: number, item: any) => acc + (item.price ?? 0) * (item.quantity ?? 1), 0);

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.shop.b2b}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2"><ShoppingBag className="h-6 w-6" /> Оформление заказа</h1>
          <p className="text-slate-500 text-sm mt-0.5">Product Customization: логотипы, мокапы при оформлении</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Позиции заказа</CardTitle>
        </CardHeader>
        <CardContent>
          {b2bCart.length === 0 ? (
            <p className="text-slate-500 text-sm">Корзина пуста. Добавьте товары в матрице заказа.</p>
          ) : (
            <ul className="space-y-2">
              {b2bCart.map((item: any, i: number) => (
                <li key={`${item.id}-${i}`} className="flex justify-between text-sm">
                  <span>{item.name ?? item.sku} × {item.quantity ?? 1}</span>
                  <span>{(item.price ?? 0) * (item.quantity ?? 1).toLocaleString('ru-RU')} ₽</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 font-semibold">Итого: {total.toLocaleString('ru-RU')} ₽</p>
        </CardContent>
      </Card>

      <ProductCustomizationBlock productName={b2bCart[0]?.name} />

      <div className="mt-6 flex gap-2">
        <Button disabled={b2bCart.length === 0}>Подтвердить заказ</Button>
        <Button variant="outline" asChild><Link href={ROUTES.shop.b2bMatrix}>В матрицу</Link></Button>
      </div>
    </div>
  );
}

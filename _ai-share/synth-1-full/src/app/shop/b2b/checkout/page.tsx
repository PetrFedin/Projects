'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';
import { ShopB2bContentHeader } from '@/components/shop/ShopB2bContentHeader';
import { useB2BState } from '@/providers/b2b-state';
import { ProductCustomizationBlock } from '@/components/b2b/ProductCustomizationBlock';
import { RegistryPageShell } from '@/components/design-system';
import { tid } from '@/lib/ui/test-ids';
import { ShopAnalyticsSegmentErpStrip } from '@/components/shop/ShopAnalyticsSegmentErpStrip';
import { B2bMarginAnalysisHubButton } from '@/components/shop/B2bMarginAnalysisHubButton';

/** RepSpark: Product Customization в checkout — логотипы, мокапы при оформлении */
export default function B2BCheckoutPage() {
  const { b2bCart = [] } = useB2BState();
  const total = b2bCart.reduce(
    (acc: number, item: any) => acc + (item.price ?? 0) * (item.quantity ?? 1),
    0
  );

  return (
    <RegistryPageShell className="max-w-2xl space-y-6" data-testid={tid.page('shop-b2b-checkout')}>
      <ShopB2bContentHeader lead="Product Customization: логотипы и мокапы при оформлении (RepSpark)." />
      <ShopAnalyticsSegmentErpStrip />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Позиции заказа</CardTitle>
        </CardHeader>
        <CardContent>
          {b2bCart.length === 0 ? (
            <p className="text-text-secondary text-sm">
              Корзина пуста. Добавьте товары в матрице заказа.
            </p>
          ) : (
            <ul className="space-y-2">
              {b2bCart.map((item: any, i: number) => (
                <li key={`${item.id}-${i}`} className="flex justify-between text-sm">
                  <span>
                    {item.name ?? item.sku} × {item.quantity ?? 1}
                  </span>
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
        <Button variant="outline" asChild>
          <Link href={ROUTES.shop.b2bMatrix}>В матрицу</Link>
        </Button>
      </div>

      <div className="border-border-subtle flex flex-wrap items-center gap-2 border-t pt-4">
        <span className="text-text-muted text-[10px] font-black uppercase tracking-widest">
          См. также
        </span>
        <Button variant="outline" size="sm" className="text-xs font-black uppercase" asChild>
          <Link href={ROUTES.shop.analytics} data-testid="shop-b2b-checkout-retail-link">
            Розничная аналитика
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="text-xs font-black uppercase" asChild>
          <Link href={ROUTES.shop.analyticsFootfall} data-testid="shop-b2b-checkout-footfall-link">
            Трафик по зонам
          </Link>
        </Button>
        <B2bMarginAnalysisHubButton />
      </div>
    </RegistryPageShell>
  );
}

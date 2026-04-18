'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Tag } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { ShopB2bContentHeader } from '@/components/shop/ShopB2bContentHeader';
import { JOOR_DELIVERY_WINDOWS, JOOR_MOQ_BY_PRODUCT } from '@/lib/b2b/joor-constants';
import { getOrderRulesForPartner } from '@/lib/b2b/order-rules';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { B2BIntegrationStatusWidget } from '@/components/b2b/B2BIntegrationStatusWidget';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';
import { RegistryPageShell } from '@/components/design-system';

const MOV_DEFAULT = 150_000; // минимальная сумма заказа (мок)

export default function B2BCollectionTermsPage() {
  const rules = getOrderRulesForPartner();
  const moqEntries = Object.entries(JOOR_MOQ_BY_PRODUCT);
  const [priceLists, setPriceLists] = useState<{ slug: string; name: string; currency?: string }[]>(
    []
  );

  useEffect(() => {
    fetch('/api/b2b/integrations/price-lists')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setPriceLists(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-4xl px-4 py-6 pb-24">
      <div className="mb-6 flex items-center gap-3">
        <Link href={ROUTES.shop.b2b}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold uppercase tracking-tight">
            <CalendarClock className="h-6 w-6" /> Условия по коллекциям
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            NuOrder/JOOR: дедлайны заказа, MOQ по стилю, минимальная сумма заказа (MOV).
          </p>
        </div>
      </div>
=======
    <RegistryPageShell className="max-w-4xl space-y-6">
      <ShopB2bContentHeader lead="NuOrder / JOOR: дедлайны заказа, MOQ по стилю, минимальная сумма заказа (MOV)." />
>>>>>>> recover/cabinet-wip-from-stash

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-black uppercase">
            <Package className="h-4 w-4" /> Минимум по стилю (MOQ)
          </CardTitle>
          <CardDescription>
            Минимальное количество по артикулу. Ниже — заказ по позиции не пройдёт.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {moqEntries.map(([productId, moq]) => (
              <li
                key={productId}
                className="bg-bg-surface2 flex justify-between rounded-lg px-3 py-2"
              >
                <span className="text-text-secondary font-mono">Стиль {productId}</span>
                <span className="font-bold">MOQ {moq} шт.</span>
              </li>
            ))}
            <li className="bg-bg-surface2 text-text-secondary flex justify-between rounded-lg px-3 py-2">
              <span>Остальные стили</span>
              <span>MOQ 6 шт. (по умолчанию)</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm font-black uppercase">
            Минимальная сумма заказа (MOV)
          </CardTitle>
          <CardDescription>Минимальная сумма одного заказа по бренду/коллекции.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-text-primary text-2xl font-black">
            {MOV_DEFAULT.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽
          </p>
          {rules.movByBrand && Object.keys(rules.movByBrand).length > 0 && (
            <ul className="mt-3 space-y-2 text-sm">
              {Object.entries(rules.movByBrand).map(([brand, mov]) => (
                <li key={brand} className="flex justify-between">
                  <span>{brand}</span>
                  <span>
                    {typeof mov === 'number' ? mov.toLocaleString('ru-RU') + ' ₽' : String(mov)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm font-black uppercase">Дедлайны и окна доставки</CardTitle>
          <CardDescription>
            Дата отмены (cancel date) — до неё можно отменить или изменить заказ.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {JOOR_DELIVERY_WINDOWS.map((w) => (
            <div key={w.id} className="bg-bg-surface2 rounded-lg px-3 py-2 text-sm">
              <span className="font-bold">{w.label}</span>
<<<<<<< HEAD
              <span className="ml-2 text-slate-500">
=======
              <span className="text-text-secondary ml-2">
>>>>>>> recover/cabinet-wip-from-stash
                · отмена до {w.cancelDate} · отгрузка {w.startShipDate}–{w.completeShipDate}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {priceLists.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-black uppercase">
              <Tag className="h-4 w-4" /> Прайс-листы (SparkLayer)
            </CardTitle>
            <CardDescription>
              Доступные прайс-листы для расчёта цен в матрице заказа.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {priceLists.map((pl) => (
                <li
                  key={pl.slug}
                  className="bg-bg-surface2 flex justify-between rounded-lg px-3 py-2"
                >
                  <span className="font-medium">{pl.name}</span>
<<<<<<< HEAD
                  <span className="text-slate-500">
=======
                  <span className="text-text-secondary">
>>>>>>> recover/cabinet-wip-from-stash
                    {pl.slug}
                    {pl.currency ? ` · ${pl.currency}` : ''}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <B2BIntegrationStatusWidget settingsHref={ROUTES.shop.b2bSettings} />
      <RelatedModulesBlock
        title="Связанные разделы"
        links={getShopB2BHubLinks().filter((l) =>
          [ROUTES.shop.b2bDeliveryCalendar, ROUTES.shop.b2bCreateOrder].includes(l.href as string)
        )}
      />
    </RegistryPageShell>
  );
}

'use client';

import { RegistryPageShell } from '@/components/design-system';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Store, Package } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { ShopB2bContentHeader } from '@/components/shop/ShopB2bContentHeader';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';
import { tid } from '@/lib/ui/test-ids';
import { ShopAnalyticsSegmentErpStrip } from '@/components/shop/ShopAnalyticsSegmentErpStrip';
import { B2bMarginAnalysisHubButton } from '@/components/shop/B2bMarginAnalysisHubButton';

/** JOOR/NuOrder для РФ: синхронизация заказов и каталога с Shopify. Позже — 1С, Мой Склад, ЭДО. */
export default function ShopifySyncPage() {
  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-2xl px-4 py-6 pb-24">
      <div className="mb-6 flex items-center gap-3">
        <Link href={ROUTES.shop.b2b}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold uppercase tracking-tight">
            <Plug className="h-6 w-6" /> Синхронизация с Shopify
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Оптовые заказы и каталог — в ваш интернет-магазин. Для РФ: планируем 1С, Мой Склад, ЭДО
            и маркировка.
          </p>
        </div>
      </div>
=======
    <RegistryPageShell
      className="min-h-[200px] max-w-2xl space-y-6"
      data-testid={tid.page('shop-b2b-shopify-sync')}
    >
      <ShopB2bContentHeader lead="Оптовые заказы и каталог в интернет-магазин; для РФ — 1С, Мой Склад, ЭДО и маркировка." />
      <ShopAnalyticsSegmentErpStrip hideSettingsLink />
>>>>>>> recover/cabinet-wip-from-stash

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Подключение</CardTitle>
          <CardDescription>
            OAuth, webhooks и выгрузка статусов. Остатки и заказы в реальном времени.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
<<<<<<< HEAD
          <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-4">
=======
          <div className="border-border-subtle bg-bg-surface2 flex items-center justify-between rounded-lg border p-4">
>>>>>>> recover/cabinet-wip-from-stash
            <div className="flex items-center gap-3">
              <Store className="text-text-secondary size-8" />
              <div>
                <p className="font-medium">Shopify</p>
<<<<<<< HEAD
                <p className="text-xs text-slate-500">
=======
                <p className="text-text-secondary text-xs">
>>>>>>> recover/cabinet-wip-from-stash
                  Экспорт заказов, синхронизация остатков, webhooks
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Подключить
            </Button>
          </div>
<<<<<<< HEAD
          <div className="flex items-center justify-between rounded-lg border border-dashed border-slate-200 p-4 opacity-80">
=======
          <div className="border-border-default flex items-center justify-between rounded-lg border border-dashed p-4 opacity-80">
>>>>>>> recover/cabinet-wip-from-stash
            <div className="flex items-center gap-3">
              <Package className="text-text-muted size-8" />
              <div>
                <p className="text-text-secondary font-medium">1С, Мой Склад</p>
                <p className="text-text-secondary text-xs">В разработке для российского рынка</p>
              </div>
            </div>
            <Badge variant="secondary">Скоро</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Что синхронизируется</CardTitle>
          <CardDescription>После подключения</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
<<<<<<< HEAD
              <Check className="h-4 w-4 text-emerald-500" /> Заказы B2B → статусы в вашем магазине
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" /> Остатки и артикулы по каталогу бренда
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" /> Уведомления об отгрузках
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-slate-400" /> ЭДО и маркировка (Честный ЗНАК) — в
=======
              <Check className="size-4 text-emerald-500" /> Заказы B2B → статусы в вашем магазине
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4 text-emerald-500" /> Остатки и артикулы по каталогу бренда
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4 text-emerald-500" /> Уведомления об отгрузках
            </li>
            <li className="flex items-center gap-2">
              <Check className="text-text-muted size-4" /> ЭДО и маркировка (Честный ЗНАК) — в
>>>>>>> recover/cabinet-wip-from-stash
              планах
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="mb-6 flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bOrders}>Мои заказы</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bPartners}>Мои бренды</Link>
        </Button>
      </div>
<<<<<<< HEAD
=======

      <div className="border-border-subtle flex flex-wrap items-center gap-2 border-t pt-4">
        <span className="text-text-muted text-[10px] font-black uppercase tracking-widest">
          См. также
        </span>
        <Button variant="outline" size="sm" className="text-xs font-black uppercase" asChild>
          <Link href={ROUTES.shop.analytics} data-testid="shop-b2b-shopify-sync-retail-link">
            Розничная аналитика
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="text-xs font-black uppercase" asChild>
          <Link
            href={ROUTES.shop.analyticsFootfall}
            data-testid="shop-b2b-shopify-sync-footfall-link"
          >
            Трафик по зонам
          </Link>
        </Button>
        <B2bMarginAnalysisHubButton />
      </div>

>>>>>>> recover/cabinet-wip-from-stash
      <RelatedModulesBlock
        links={getShopB2BHubLinks()}
        title="Заказы, каталог, партнёры"
        className="mt-6"
      />
<<<<<<< HEAD
    </div>
=======
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}

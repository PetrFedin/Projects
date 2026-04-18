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
    <RegistryPageShell
      className="min-h-[200px] max-w-2xl space-y-6"
      data-testid={tid.page('shop-b2b-shopify-sync')}
    >
      <ShopB2bContentHeader lead="Оптовые заказы и каталог в интернет-магазин; для РФ — 1С, Мой Склад, ЭДО и маркировка." />
      <ShopAnalyticsSegmentErpStrip hideSettingsLink />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Подключение</CardTitle>
          <CardDescription>
            OAuth, webhooks и выгрузка статусов. Остатки и заказы в реальном времени.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-border-subtle bg-bg-surface2 flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <Store className="text-text-secondary size-8" />
              <div>
                <p className="font-medium">Shopify</p>
                <p className="text-text-secondary text-xs">
                  Экспорт заказов, синхронизация остатков, webhooks
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Подключить
            </Button>
          </div>
          <div className="border-border-default flex items-center justify-between rounded-lg border border-dashed p-4 opacity-80">
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

      <RelatedModulesBlock
        links={getShopB2BHubLinks()}
        title="Заказы, каталог, партнёры"
        className="mt-6"
      />
    </RegistryPageShell>
  );
}

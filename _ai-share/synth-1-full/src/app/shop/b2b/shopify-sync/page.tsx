'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plug, ArrowLeft, Check, Store, Package, RefreshCw } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';

/** JOOR/NuOrder для РФ: синхронизация заказов и каталога с Shopify. Позже — 1С, Мой Склад, ЭДО. */
export default function ShopifySyncPage() {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.shop.b2b}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2"><Plug className="h-6 w-6" /> Синхронизация с Shopify</h1>
          <p className="text-slate-500 text-sm mt-0.5">Оптовые заказы и каталог — в ваш интернет-магазин. Для РФ: планируем 1С, Мой Склад, ЭДО и маркировка.</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Подключение</CardTitle>
          <CardDescription>OAuth, webhooks и выгрузка статусов. Остатки и заказы в реальном времени.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-3">
              <Store className="h-8 w-8 text-slate-500" />
              <div>
                <p className="font-medium">Shopify</p>
                <p className="text-xs text-slate-500">Экспорт заказов, синхронизация остатков, webhooks</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Подключить</Button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border border-dashed border-slate-200 opacity-80">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-slate-400" />
              <div>
                <p className="font-medium text-slate-600">1С, Мой Склад</p>
                <p className="text-xs text-slate-500">В разработке для российского рынка</p>
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
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Заказы B2B → статусы в вашем магазине</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Остатки и артикулы по каталогу бренда</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Уведомления об отгрузках</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-slate-400" /> ЭДО и маркировка (Честный ЗНАК) — в планах</li>
          </ul>
        </CardContent>
      </Card>

      <div className="flex gap-2 mb-6">
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bOrders}>Мои заказы</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bPartners}>Мои бренды</Link></Button>
      </div>
      <RelatedModulesBlock links={getShopB2BHubLinks()} title="Заказы, каталог, партнёры" className="mt-6" />
    </div>
  );
}

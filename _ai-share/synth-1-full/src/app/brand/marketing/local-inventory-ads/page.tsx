'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, ArrowLeft, Map } from 'lucide-react';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { getLiaLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import type { LiaStoreFeed } from '@/lib/shop/local-inventory-ads';
import { ROUTES } from '@/lib/routes';
import { RegistryPageShell } from '@/components/design-system';

const MOCK_FEEDS: LiaStoreFeed[] = [
  {
    storeId: 'msk-1',
    storeName: 'Москва, Тверская',
    channel: 'google',
    status: 'active',
    lastSyncAt: '2026-03-11T08:00:00Z',
    itemCount: 420,
  },
  {
    storeId: 'msk-1',
    storeName: 'Москва, Тверская',
    channel: 'yandex',
    status: 'active',
    lastSyncAt: '2026-03-11T07:30:00Z',
    itemCount: 420,
  },
];

const statusLabels: Record<LiaStoreFeed['status'], string> = {
  active: 'Активен',
  paused: 'Приостановлен',
  error: 'Ошибка',
};

export default function LocalInventoryAdsPage() {
  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-6 pb-24">
=======
    <RegistryPageShell className="max-w-5xl space-y-6 pb-16">
>>>>>>> recover/cabinet-wip-from-stash
      <SectionInfoCard
        title="Local Inventory Ads (LIA)"
        description="Передача наличия в Google / Yandex Maps. Связь со складом, маркетингом и BOPIS. При API — фиды по магазинам, синхронизация остатков."
        icon={MapPin}
        iconBg="bg-amber-100"
        iconColor="text-amber-600"
        badges={
          <>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
<<<<<<< HEAD
              <Link href="/brand/warehouse">Склад</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href="/brand/promotions">Маркетинг</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href="/brand/bopis">BOPIS</Link>
=======
              <Link href={ROUTES.brand.warehouse}>Склад</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.promotions}>Маркетинг</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.bopis}>BOPIS</Link>
>>>>>>> recover/cabinet-wip-from-stash
            </Button>
          </>
        }
      />
      <div className="flex items-center gap-3">
<<<<<<< HEAD
        <Link href="/brand/kickstarter">
=======
        <Link href={ROUTES.brand.kickstarter}>
>>>>>>> recover/cabinet-wip-from-stash
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold uppercase">Local Inventory Ads</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" /> Фиды по магазинам
          </CardTitle>
          <CardDescription>
            Наличие передаётся в Google и Yandex Карты для локальной рекламы и BOPIS.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {MOCK_FEEDS.map((f, i) => (
              <li
                key={`${f.storeId}-${f.channel}-${i}`}
<<<<<<< HEAD
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
=======
                className="bg-bg-surface2 border-border-subtle flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3"
>>>>>>> recover/cabinet-wip-from-stash
              >
                <div>
                  <p className="font-medium">
                    {f.storeName} → {f.channel}
                  </p>
<<<<<<< HEAD
                  <p className="text-xs text-slate-500">
=======
                  <p className="text-text-secondary text-xs">
>>>>>>> recover/cabinet-wip-from-stash
                    {f.itemCount} SKU · обновлено {f.lastSyncAt?.slice(0, 10)}
                  </p>
                </div>
                <Badge
                  variant={f.status === 'active' ? 'default' : 'outline'}
                  className="text-[10px]"
                >
                  {statusLabels[f.status]}
                </Badge>
              </li>
            ))}
          </ul>
<<<<<<< HEAD
          <p className="mt-3 text-xs text-slate-400">
=======
          <p className="text-text-muted mt-3 text-xs">
>>>>>>> recover/cabinet-wip-from-stash
            API: LOCAL_INVENTORY_ADS_API — фиды, синк по магазинам.
          </p>
        </CardContent>
      </Card>
      <RelatedModulesBlock links={getLiaLinks()} title="Склад, маркетинг, BOPIS" />
    </RegistryPageShell>
  );
}

'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Eye, ShoppingCart, Calendar, TrendingUp } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { B2BIntegrationStatusWidget } from '@/components/b2b/B2BIntegrationStatusWidget';
import { getB2BLinks } from '@/lib/data/entity-links';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';

/** Мок: визиты партнёров (шоурум, лайншит, лукбук). JOOR-style активность. */
const MOCK_VISITS = [
  {
    id: '1',
    partner: 'Podium (Москва)',
    type: 'showroom',
    at: '2025-03-10T14:00:00',
    duration: 45,
  },
  { id: '2', partner: 'ЦУМ (Москва)', type: 'linesheet', at: '2025-03-10T11:30:00', duration: 12 },
  {
    id: '3',
    partner: 'Boutique No.7 (СПб)',
    type: 'lookbook',
    at: '2025-03-09T16:00:00',
    duration: 20,
  },
  {
    id: '4',
    partner: 'Podium (Москва)',
    type: 'showroom',
    at: '2025-03-09T10:00:00',
    duration: 60,
  },
];

/** Мок: активность (открыл кампанию, скачал PDF, добавил в заказ). NuOrder: кто открыл/заказал. */
const MOCK_ACTIVITY = [
  {
    id: 'a1',
    partner: 'Podium (Москва)',
    action: 'Открыл лайншит FW26',
    at: '2025-03-10T14:05:00',
  },
  { id: 'a2', partner: 'ЦУМ (Москва)', action: 'Скачал PDF коллекции', at: '2025-03-10T11:35:00' },
  {
    id: 'a3',
    partner: 'Boutique No.7 (СПб)',
    action: 'Добавил позиции в заказ',
    at: '2025-03-09T16:10:00',
  },
  { id: 'a4', partner: 'Podium (Москва)', action: 'Открыл лукбук SS26', at: '2025-03-09T10:15:00' },
];

export default function BrandB2BEngagementPage() {
  return (
    <RegistryPageShell className="w-full max-w-none space-y-6 pb-16">
      <RegistryPageHeader
        title="Вовлечённость партнёров"
        leadPlain="JOOR: визиты шоурума и лайншита, активность по кампаниям. NuOrder: кто открыл/заказал — связь с заказами и событиями."
        eyebrow={
          <Button variant="ghost" size="icon" asChild>
            <Link href={ROUTES.brand.b2bOrders} aria-label="Назад к заказам">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        }
        actions={
          <div className="flex flex-wrap justify-end gap-1">
            <Button variant="outline" size="sm" asChild>
              <Link href={ROUTES.brand.integrationsJoor}>JOOR</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={ROUTES.brand.integrationsNuOrder}>NuOrder</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={ROUTES.brand.integrationsFashionCloud}>Fashion Cloud</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={ROUTES.brand.integrationsSparkLayer}>SparkLayer</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={ROUTES.brand.integrationsColect}>Colect</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={ROUTES.brand.integrationsZedonk}>Zedonk</Link>
            </Button>
          </div>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-black uppercase">
              <Eye className="h-4 w-4" /> Визиты за период
            </CardTitle>
            <CardDescription>Просмотры шоурума, лайншита, лукбука по партнёрам.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-text-primary text-2xl font-black">{MOCK_VISITS.length}</p>
            <p className="text-text-secondary text-xs">последние 7 дней (мок)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-black uppercase">
              <TrendingUp className="h-4 w-4" /> Активность
            </CardTitle>
            <CardDescription>Открытия кампаний, скачивания, добавления в заказ.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-text-primary text-2xl font-black">{MOCK_ACTIVITY.length}</p>
            <p className="text-text-secondary text-xs">событий за период</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm font-black uppercase">Последние визиты</CardTitle>
          <CardDescription>
            Партнёр, тип (шоурум/лайншит/лукбук), дата и длительность.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {MOCK_VISITS.map((v) => (
              <li
                key={v.id}
                className="border-border-subtle flex items-center justify-between border-b py-2 last:border-0"
              >
                <div>
                  <span className="font-medium">{v.partner}</span>
                  <Badge variant="secondary" className="ml-2 text-[9px]">
                    {v.type}
                  </Badge>
                </div>
                <span className="text-text-secondary text-xs">
                  {new Date(v.at).toLocaleString('ru-RU')} · {v.duration} мин
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm font-black uppercase">Активность по кампаниям</CardTitle>
          <CardDescription>
            Кто открыл лайншит, скачал PDF, добавил в заказ — CTA к заказам и событиям.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {MOCK_ACTIVITY.map((a) => (
              <li
                key={a.id}
                className="border-border-subtle flex items-center justify-between border-b py-2 last:border-0"
              >
                <div>
                  <span className="font-medium">{a.partner}</span>
                  <span className="text-text-secondary ml-2 text-sm">{a.action}</span>
                </div>
                <span className="text-text-secondary text-xs">
                  {new Date(a.at).toLocaleString('ru-RU')}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" className="gap-1.5 rounded-lg" asChild>
              <Link href={ROUTES.brand.b2bOrders}>
                <ShoppingCart className="h-3.5 w-3.5" /> Перейти к заказам
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 rounded-lg" asChild>
              <Link href={ROUTES.brand.tradeShows}>
                <Calendar className="h-3.5 w-3.5" /> Выставки и события
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <B2BIntegrationStatusWidget settingsHref={ROUTES.brand.integrations} />
      <RelatedModulesBlock title="B2B и партнёры" links={getB2BLinks().slice(0, 6)} />
    </RegistryPageShell>
  );
}

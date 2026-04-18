'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
<<<<<<< HEAD
import { BarChart3, Globe, Download, ArrowLeft, Link2, Upload, CheckCircle } from 'lucide-react';
=======
import { ArrowLeft, Link2, Upload, CheckCircle } from 'lucide-react';
>>>>>>> recover/cabinet-wip-from-stash
import { ROUTES } from '@/lib/routes';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getAnalyticsLinks } from '@/lib/data/entity-links';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';

/** Интеграция результатов продаж закупленных коллекций на других площадках — свод на платформе. */
const MOCK_EXTERNAL = [
  {
    id: '1',
    collection: 'FW26 Основная',
<<<<<<< HEAD
    retailer: 'Podium',
=======
    retailer: 'Демо-магазин · Москва 1',
>>>>>>> recover/cabinet-wip-from-stash
    channel: 'Свой сайт',
    sales: '1 240 000 ₽',
    units: 312,
    integration: 'api',
    period: '30 дн.',
  },
  {
    id: '2',
    collection: 'FW26 Основная',
<<<<<<< HEAD
    retailer: 'ЦУМ',
=======
    retailer: 'Демо-магазин · Москва 2',
>>>>>>> recover/cabinet-wip-from-stash
    channel: 'Магазины',
    sales: '2 100 000 ₽',
    units: 480,
    integration: 'upload',
    period: '30 дн.',
  },
  {
    id: '3',
    collection: 'FW26 Основная',
<<<<<<< HEAD
    retailer: 'Lamoda',
    channel: 'Lamoda (маркетплейс)',
=======
    retailer: 'Демо-магазин · СПб',
    channel: 'Маркетплейс (демо)',
>>>>>>> recover/cabinet-wip-from-stash
    sales: '890 000 ₽',
    units: 220,
    integration: 'api',
    period: '30 дн.',
  },
  {
    id: '4',
    collection: 'FW26 Techwear',
<<<<<<< HEAD
    retailer: 'Podium',
    channel: 'Wildberries',
=======
    retailer: 'Демо-магазин · Москва 1',
    channel: 'Маркетплейс (демо)',
>>>>>>> recover/cabinet-wip-from-stash
    sales: '420 000 ₽',
    units: 95,
    integration: 'api',
    period: '30 дн.',
  },
  {
    id: '5',
    collection: 'SS25 Остатки',
<<<<<<< HEAD
    retailer: 'ЦУМ',
    channel: 'Ozon',
=======
    retailer: 'Демо-магазин · Москва 2',
    channel: 'Маркетплейс (демо)',
>>>>>>> recover/cabinet-wip-from-stash
    sales: '180 000 ₽',
    units: 88,
    integration: 'upload',
    period: '30 дн.',
  },
];

const channelLabel = (integration: string) =>
  integration === 'api' ? 'Интеграция (API)' : 'Загрузка вручную';

export default function ExternalSalesPage() {
  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-6 pb-24">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={ROUTES.brand.analyticsBi}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold uppercase tracking-tight">
            <Globe className="h-6 w-6" /> Продажи на других площадках
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Интеграция результатов продаж закупленных у вас коллекций: ритейлеры отчитывают продажи
            с своего сайта, маркетплейсов (WB, Ozon, Lamoda), магазинов. Все данные сводятся на
            платформе для полного анализа.
          </p>
        </div>
      </div>
=======
    <RegistryPageShell className="w-full max-w-none space-y-6 pb-16">
      <RegistryPageHeader
        title="Продажи на других площадках"
        leadPlain="Интеграция результатов продаж закупленных у вас коллекций: ритейлеры отчитывают продажи с своего сайта и внешних каналов (маркетплейсы, офлайн). Все данные сводятся на платформе для полного анализа."
        eyebrow={
          <Button variant="ghost" size="icon" className="-ml-2 shrink-0" asChild>
            <Link href={ROUTES.brand.analyticsBi} aria-label="Назад к BI">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        }
      />
>>>>>>> recover/cabinet-wip-from-stash

      <Card>
        <CardHeader>
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <CardTitle>Продажи по каналам ритейлеров</CardTitle>
              <CardDescription>
                Коллекция, партнёр, канал продаж, выручка и способ поступления данных (API или
                загрузка)
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" /> Запросить отчёт у партнёра
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Коллекция</TableHead>
                <TableHead>Партнёр</TableHead>
                <TableHead>Канал</TableHead>
                <TableHead className="text-right">Продажи</TableHead>
                <TableHead className="text-right">Ед.</TableHead>
                <TableHead>Поступление данных</TableHead>
                <TableHead>Период</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_EXTERNAL.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.collection}</TableCell>
                  <TableCell>{row.retailer}</TableCell>
                  <TableCell>{row.channel}</TableCell>
                  <TableCell className="text-right font-semibold">{row.sales}</TableCell>
                  <TableCell className="text-right">{row.units}</TableCell>
                  <TableCell>
                    <Badge
                      variant={row.integration === 'api' ? 'default' : 'secondary'}
                      className="text-[10px]"
                    >
                      {row.integration === 'api' ? (
                        <CheckCircle className="mr-1 inline h-3 w-3" />
                      ) : (
                        <Upload className="mr-1 inline h-3 w-3" />
                      )}
                      {channelLabel(row.integration)}
                    </Badge>
                  </TableCell>
<<<<<<< HEAD
                  <TableCell className="text-sm text-slate-500">{row.period}</TableCell>
=======
                  <TableCell className="text-text-secondary text-sm">{row.period}</TableCell>
>>>>>>> recover/cabinet-wip-from-stash
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-accent-primary/20 bg-accent-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Link2 className="h-4 w-4" /> Сведение данных на платформе
          </CardTitle>
          <CardDescription>
<<<<<<< HEAD
            Все каналы (B2B отгрузки, Маркетрум, Аутлет, продажи партнёров на WB/Ozon/свой сайт)
            сводятся в единую отчётность. Откройте «Сводную аналитику» для полного анализа.
=======
            Все каналы (B2B отгрузки, Маркетрум, Аутлет, продажи партнёров на внешних витринах и
            своём сайте) сводятся в единую отчётность. Откройте «Сводную аналитику» для полного
            анализа.
>>>>>>> recover/cabinet-wip-from-stash
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Badge variant="outline" className="text-xs">
              B2B заказы
            </Badge>
            <Badge variant="outline" className="text-xs">
              Маркетрум
            </Badge>
            <Badge variant="outline" className="text-xs">
              Аутлет
            </Badge>
            <Badge variant="outline" className="text-xs">
              Сайты партнёров
            </Badge>
            <Badge variant="outline" className="text-xs">
<<<<<<< HEAD
              Wildberries
            </Badge>
            <Badge variant="outline" className="text-xs">
              Ozon
            </Badge>
            <Badge variant="outline" className="text-xs">
              Lamoda
=======
              Маркетплейс (демо) A
            </Badge>
            <Badge variant="outline" className="text-xs">
              Маркетплейс (демо) B
            </Badge>
            <Badge variant="outline" className="text-xs">
              Маркетплейс (демо) C
>>>>>>> recover/cabinet-wip-from-stash
            </Badge>
          </div>
          <Button className="mt-4" asChild>
            <Link href={ROUTES.brand.analyticsUnified}>Перейти в сводную аналитику</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.brand.analyticsPlatformSales}>Маркетрум и Аутлет</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.brand.analyticsUnified}>Полный анализ</Link>
        </Button>
      </div>
      <RelatedModulesBlock links={getAnalyticsLinks()} title="BI, платформа, 360°" />
    </RegistryPageShell>
  );
}

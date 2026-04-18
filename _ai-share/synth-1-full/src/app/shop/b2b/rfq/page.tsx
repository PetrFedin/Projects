'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { ShopB2bContentHeader } from '@/components/shop/ShopB2bContentHeader';
import type { RfqRequest, RfqStatus } from '@/lib/rf-market/rfq';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2bRfqCrossRoleLinks } from '@/lib/data/entity-links';
import { RegistryPageShell } from '@/components/design-system';

/** Alibaba/OroCommerce: RFQ — запрос котировок от поставщиков */
const MOCK_RFQS: RfqRequest[] = [
  {
    id: 'rfq1',
    buyerId: 'b1',
    buyerName: 'Сеть «Мода»',
    title: 'Запрос цен на джинсовую ткань',
    lines: [
      {
        id: 'rl1',
        description: 'Деним 12 oz, индиго',
        quantity: 3000,
        unit: 'м',
        requestedDelivery: '2026-04-15',
      },
    ],
    supplierIds: ['sup1', 'sup4'],
    status: 'quotes_received',
    currency: 'RUB',
    quoteDeadline: '2026-03-20',
    createdAt: '2026-03-05',
    updatedAt: '2026-03-11',
  },
  {
    id: 'rfq2',
    buyerId: 'b1',
    buyerName: 'Сеть «Мода»',
    title: 'Фурнитура: молнии, пуговицы',
    lines: [
      { id: 'rl2', description: 'Молния металл 5 см', quantity: 10000, unit: 'шт' },
      { id: 'rl3', description: 'Пуговицы 4-дырки', quantity: 15000, unit: 'шт' },
    ],
    supplierIds: ['sup2'],
    status: 'sent',
    currency: 'RUB',
    quoteDeadline: '2026-03-25',
    createdAt: '2026-03-10',
    updatedAt: '2026-03-10',
  },
];

function StatusBadge({ status }: { status: RfqStatus }) {
  const map: Record<RfqStatus, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
    draft: { label: 'Черновик', variant: 'secondary' },
    sent: { label: 'Отправлен', variant: 'outline' },
    quotes_received: { label: 'Котировки получены', variant: 'default' },
    closed: { label: 'Закрыт', variant: 'secondary' },
    converted: { label: 'В заказ', variant: 'default' },
  };
  const c = map[status];
  return <Badge variant={c.variant}>{c.label}</Badge>;
}

export default function RfqPage() {
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
            <FileSearch className="h-6 w-6" /> Запрос котировок (RFQ)
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Alibaba/OroCommerce: отправьте запрос поставщикам — получите цены и условия
          </p>
        </div>
      </div>
=======
    <RegistryPageShell className="max-w-4xl space-y-6">
      <ShopB2bContentHeader lead="Витрина байера: котировки по материалам и услугам; ответы поставщиков можно сопоставить с производственным хабом и брендовым RFQ." />

      <Card className="bg-bg-surface2/50 mb-6 border-dashed">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Связь ролей</CardTitle>
          <CardDescription>
            Ответы поставщиков здесь дополняют контур бренда (материалы, реестр поставщиков) и
            factory — удобно проверять условия перед переносом в B2B-заказ.
          </CardDescription>
        </CardHeader>
      </Card>
>>>>>>> recover/cabinet-wip-from-stash

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Мои запросы котировок</CardTitle>
          <CardDescription>
            Создайте RFQ, выберите поставщиков и получите предложения
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {MOCK_RFQS.map((r) => (
            <div
              key={r.id}
<<<<<<< HEAD
              className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center"
=======
              className="border-border-default flex flex-col justify-between gap-3 rounded-xl border p-4 sm:flex-row sm:items-center"
>>>>>>> recover/cabinet-wip-from-stash
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{r.title}</h3>
                  <StatusBadge status={r.status} />
                </div>
<<<<<<< HEAD
                <p className="mt-1 text-xs text-slate-500">
=======
                <p className="text-text-secondary mt-1 text-xs">
>>>>>>> recover/cabinet-wip-from-stash
                  {r.lines.length} позиций · Дедлайн котировок: {r.quoteDeadline}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" asChild>
<<<<<<< HEAD
                  <Link href={`/shop/b2b/rfq/${r.id}`}>Подробнее</Link>
                </Button>
                {r.status === 'quotes_received' && (
                  <Button size="sm" asChild>
                    <Link href={`/shop/b2b/rfq/${r.id}/compare`}>Сравнить и выбрать</Link>
=======
                  <Link href={`${ROUTES.shop.b2bRfq}/${r.id}`}>Подробнее</Link>
                </Button>
                {r.status === 'quotes_received' && (
                  <Button size="sm" asChild>
                    <Link href={`${ROUTES.shop.b2bRfq}/${r.id}/compare`}>Сравнить и выбрать</Link>
>>>>>>> recover/cabinet-wip-from-stash
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

<<<<<<< HEAD
      <div className="flex gap-2">
        <Button asChild>
          <Link href="/shop/b2b/rfq/create">
=======
      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link href={ROUTES.shop.b2bRfqCreate}>
>>>>>>> recover/cabinet-wip-from-stash
            <Plus className="mr-2 h-4 w-4" /> Создать RFQ
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bSupplierDiscovery}>Найти поставщиков</Link>
        </Button>
<<<<<<< HEAD
=======
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bTenders}>Тендеры</Link>
        </Button>
>>>>>>> recover/cabinet-wip-from-stash
      </div>

      <RelatedModulesBlock
        links={getShopB2bRfqCrossRoleLinks()}
        title="Бренд, factory, следующие шаги"
        className="mt-8"
      />
    </RegistryPageShell>
  );
}

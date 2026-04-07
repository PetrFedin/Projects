'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileSearch, Plus, Send } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import type { RfqRequest, RfqStatus } from '@/lib/rf-market/rfq';

/** Alibaba/OroCommerce: RFQ — запрос котировок от поставщиков */
const MOCK_RFQS: RfqRequest[] = [
  {
    id: 'rfq1',
    buyerId: 'b1',
    buyerName: 'Сеть «Мода»',
    title: 'Запрос цен на джинсовую ткань',
    lines: [
      { id: 'rl1', description: 'Деним 12 oz, индиго', quantity: 3000, unit: 'м', requestedDelivery: '2026-04-15' },
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
    <div className="container max-w-4xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.shop.b2b}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2"><FileSearch className="h-6 w-6" /> Запрос котировок (RFQ)</h1>
          <p className="text-slate-500 text-sm mt-0.5">Alibaba/OroCommerce: отправьте запрос поставщикам — получите цены и условия</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Мои запросы котировок</CardTitle>
          <CardDescription>Создайте RFQ, выберите поставщиков и получите предложения</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {MOCK_RFQS.map((r) => (
            <div key={r.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">{r.title}</h3>
                  <StatusBadge status={r.status} />
                </div>
                <p className="text-xs text-slate-500 mt-1">{r.lines.length} позиций · Дедлайн котировок: {r.quoteDeadline}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" asChild><Link href={`/shop/b2b/rfq/${r.id}`}>Подробнее</Link></Button>
                {r.status === 'quotes_received' && (
                  <Button size="sm" asChild><Link href={`/shop/b2b/rfq/${r.id}/compare`}>Сравнить и выбрать</Link></Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button asChild><Link href="/shop/b2b/rfq/create"><Plus className="h-4 w-4 mr-2" /> Создать RFQ</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bSupplierDiscovery}>Найти поставщиков</Link></Button>
      </div>
    </div>
  );
}

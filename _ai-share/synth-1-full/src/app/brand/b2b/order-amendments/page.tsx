'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { B2BOrdersApprovalBadges } from '@/components/brand/SectionBadgeCta';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { ROUTES } from '@/lib/routes';
import { getB2BLinks } from '@/lib/data/entity-links';
import { FileEdit, ArrowLeft, ListTodo } from 'lucide-react';

const MOCK_AMENDMENTS = [
  {
    id: 'am1',
    orderId: 'PO-301',
    partner: 'Podium',
    type: 'quantity_change',
    typeLabel: 'Изменение количества',
    requestedAt: '2026-03-11T10:00:00',
    status: 'pending',
  },
  {
    id: 'am2',
    orderId: 'PO-302',
    partner: 'MultiBrand Store',
    type: 'ship_date',
    typeLabel: 'Перенос даты отгрузки',
    requestedAt: '2026-03-10T15:00:00',
    status: 'approved',
  },
];

export default function OrderAmendmentsPage() {
  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-6 pb-24">
      <SectionInfoCard
        title="Order Amendments"
        description="Заявки магазинов на изменение заказа: количество, дата отгрузки, адрес, отмена позиций. JOOR/NuOrder-style. Связь с заказами и согласованием."
        icon={FileEdit}
        iconBg="bg-amber-100"
        iconColor="text-amber-600"
        badges={<B2BOrdersApprovalBadges />}
      />
      <div className="flex flex-wrap items-center gap-3">
        <Link href={ROUTES.brand.b2bOrders}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold uppercase">Order Amendments</h1>
      </div>

      <Card className="rounded-xl border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ListTodo className="h-5 w-5" /> Заявки на изменение
          </CardTitle>
          <CardDescription>
            Запросы ритейлеров на изменение уже размещённого заказа. При API — апрув/отклонение,
            обновление PO и документов.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {MOCK_AMENDMENTS.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div>
                  <p className="font-mono font-semibold">{a.orderId}</p>
                  <p className="text-[11px] text-slate-500">
                    {a.partner} · {a.typeLabel}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={a.status === 'approved' ? 'default' : 'secondary'}
                    className="text-[9px]"
                  >
                    {a.status === 'approved' ? 'Принято' : 'На рассмотрении'}
                  </Badge>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`${ROUTES.brand.b2bOrders}/${a.orderId}`}>К заказу</Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <RelatedModulesBlock links={getB2BLinks()} title="B2B заказы, согласование, чаты" />
    </div>
  );
}

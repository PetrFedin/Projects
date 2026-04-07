'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { B2BOrdersAmendmentsFinanceBadges } from '@/components/brand/SectionBadgeCta';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { ROUTES } from '@/lib/routes';
import { getB2BLinks } from '@/lib/data/entity-links';
import { CheckCircle2, ArrowLeft, ClipboardList, Clock } from 'lucide-react';

const MOCK_APPROVALS = [
  { id: 'a1', orderId: 'PO-301', partner: 'Podium', requestedAt: '2026-03-10T09:00:00', step: 'credit_check', stepLabel: 'Проверка лимита', status: 'pending' },
  { id: 'a2', orderId: 'PO-302', partner: 'MultiBrand Store', requestedAt: '2026-03-09T14:00:00', step: 'manager_approval', stepLabel: 'Согласование менеджером', status: 'approved' },
];

export default function OrderApprovalWorkflowPage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-5xl pb-24">
      <SectionInfoCard
        title="Order Approval Workflow"
        description="Многошаговое согласование B2B заказа: лимит, менеджер, кредит, особые условия. JOOR-style. Связь с заказами и финансами."
        icon={CheckCircle2}
        iconBg="bg-indigo-100"
        iconColor="text-indigo-600"
        badges={<B2BOrdersAmendmentsFinanceBadges />}
      />
      <div className="flex items-center gap-3 flex-wrap">
        <Link href={ROUTES.brand.b2bOrders}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <h1 className="text-2xl font-bold uppercase">Order Approval Workflow</h1>
      </div>

      <Card className="rounded-xl border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ClipboardList className="h-5 w-5" /> Заказы на согласовании
          </CardTitle>
          <CardDescription>Очередь заказов по шагам workflow. При API — правила по партнёру/сумме, делегирование, уведомления.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {MOCK_APPROVALS.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-mono font-semibold">{a.orderId}</p>
                  <p className="text-[11px] text-slate-500">{a.partner} · {a.stepLabel}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={a.status === 'approved' ? 'default' : 'secondary'} className="text-[9px] gap-1">
                    {a.status === 'approved' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                    {a.status === 'approved' ? 'Согласован' : 'Ожидает'}
                  </Badge>
                  <Button variant="ghost" size="sm" asChild><Link href={`${ROUTES.brand.b2bOrders}/${a.orderId}`}>Открыть</Link></Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <RelatedModulesBlock links={getB2BLinks()} title="B2B заказы, заявки на изменение, финансы" />
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, ArrowLeft } from 'lucide-react';
import { PartnersFinanceDistributorsBadges } from '@/components/brand/SectionBadgeCta';
import { B2BIntegrationStatusWidget } from '@/components/b2b/B2BIntegrationStatusWidget';
import { getSubAgentCommissionLinks } from '@/lib/data/entity-links';
import { ROUTES } from '@/lib/routes';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import {
  listCommissionRecords,
  type CommissionRecord,
} from '@/lib/distributor/sub-agent-commission';
<<<<<<< HEAD
=======
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';
>>>>>>> recover/cabinet-wip-from-stash

const statusLabels: Record<CommissionRecord['status'], string> = {
  pending: 'На согласовании',
  approved: 'Утверждено',
  paid: 'Выплачено',
};

export default function SubAgentCommissionPage() {
  const [records, setRecords] = useState<CommissionRecord[]>([]);

  useEffect(() => {
    listCommissionRecords().then(setRecords);
  }, []);

  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-6 pb-24">
      <SectionInfoCard
        title="Sub-Agent Commission Dash"
        description="Расчёт комиссий торговых представителей. Связь с партнёрами, финансами и дистрибуцией. При API — утверждение и отметка о выплате."
        icon={DollarSign}
        iconBg="bg-emerald-100"
        iconColor="text-emerald-600"
        badges={<PartnersFinanceDistributorsBadges />}
      />
      <div className="flex items-center gap-3">
        <Link href={ROUTES.brand.distributors}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold uppercase">Sub-Agent Commission</h1>
      </div>
=======
    <RegistryPageShell className="w-full max-w-none space-y-6 pb-16">
      <RegistryPageHeader
        title="Sub-Agent Commission"
        leadPlain="Расчёт комиссий торговых представителей. Связь с партнёрами, финансами и дистрибуцией. При API — утверждение и отметка о выплате."
        eyebrow={
          <Button variant="ghost" size="icon" asChild>
            <Link href={ROUTES.brand.distributors} aria-label="Назад к дистрибьюторам">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        }
        actions={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <DollarSign className="size-6 shrink-0 text-muted-foreground" aria-hidden />
            <PartnersFinanceDistributorsBadges />
          </div>
        }
      />
>>>>>>> recover/cabinet-wip-from-stash

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" /> Комиссии по периодам
          </CardTitle>
          <CardDescription>
            Выручка и комиссия по представителям. Zedonk: комиссия по строке или по заказу —
            настраивается по агенту. Утверждение и выплата.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {records.map((r) => (
              <li
                key={r.id}
<<<<<<< HEAD
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
              >
                <div>
                  <p className="font-medium">{r.subAgentName}</p>
                  <p className="text-xs text-slate-500">
=======
                className="border-border-subtle bg-bg-surface2 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3"
              >
                <div>
                  <p className="font-medium">{r.subAgentName}</p>
                  <p className="text-text-secondary text-xs">
>>>>>>> recover/cabinet-wip-from-stash
                    {r.period} · Выручка {r.revenueRub.toLocaleString('ru-RU')} ₽ · Комиссия{' '}
                    {r.commissionRub.toLocaleString('ru-RU')} ₽{' '}
                    {r.commissionType === 'per_line'
                      ? '(по строке)'
                      : r.commissionType === 'per_order'
                        ? '(по заказу)'
                        : ''}
                  </p>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  {statusLabels[r.status]}
                </Badge>
              </li>
            ))}
          </ul>
<<<<<<< HEAD
          <p className="mt-3 text-xs text-slate-400">
=======
          <p className="text-text-muted mt-3 text-xs">
>>>>>>> recover/cabinet-wip-from-stash
            API: SUB_AGENT_COMMISSION_API — агенты, записи, approve, markPaid.
          </p>
        </CardContent>
      </Card>
      <B2BIntegrationStatusWidget settingsHref={ROUTES.brand.integrations} />
      <RelatedModulesBlock
        links={getSubAgentCommissionLinks()}
        title="Партнёры, финансы, дистрибуция"
      />
<<<<<<< HEAD
    </div>
=======
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}

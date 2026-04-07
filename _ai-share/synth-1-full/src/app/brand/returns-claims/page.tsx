'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { WidgetCard } from '@/components/ui/widget-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  ShieldAlert, Plus, Package, FileText,
  CheckCircle2, Clock, AlertTriangle, ChevronRight
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getArbitrationLinks, getB2BLinks } from '@/lib/data/entity-links';
import { getRmaList } from '@/lib/b2b/rma-workflow';
import { cn } from '@/lib/utils';

const mockClaimsFallback = [
  { id: 'RMA-001', orderId: 'ORD-8821', partner: 'Podium', type: 'return', reason: 'Брак: разошелся шов', items: 3, amount: 45000, status: 'in_review', createdAt: '2026-03-10' },
  { id: 'RMA-002', orderId: 'ORD-8805', partner: 'Boutique No.7', type: 'claim', reason: 'Не соответствует образцу по цвету', items: 12, amount: 120000, status: 'approved', createdAt: '2026-03-08' },
  { id: 'RMA-003', orderId: 'ORD-8791', partner: 'ЦУМ', type: 'return', reason: 'Пересорт: L вместо M', items: 5, amount: 75000, status: 'pending', createdAt: '2026-03-12' },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  draft: { label: 'Черновик', color: 'bg-slate-50 text-slate-600 border-slate-100', icon: FileText },
  submitted: { label: 'Отправлена', color: 'bg-amber-50 text-amber-600 border-amber-100', icon: Clock },
  pending: { label: 'На рассмотрении', color: 'bg-amber-50 text-amber-600 border-amber-100', icon: Clock },
  in_review: { label: 'Проверка', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: FileText },
  approved: { label: 'Одобрена', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: CheckCircle2 },
  rejected: { label: 'Отклонена', color: 'bg-rose-50 text-rose-600 border-rose-100', icon: AlertTriangle },
  received: { label: 'Получено', color: 'bg-indigo-50 text-indigo-600 border-indigo-100', icon: Package },
  refunded: { label: 'Возврат', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: CheckCircle2 },
  closed: { label: 'Закрыта', color: 'bg-slate-50 text-slate-500 border-slate-100', icon: CheckCircle2 },
};

export default function ReturnsClaimsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const rmaList = getRmaList();
  const mockClaims = rmaList.length > 0
    ? rmaList.map((r) => ({
        id: r.id,
        orderId: r.orderId,
        partner: r.partnerName,
        type: r.type,
        reason: r.reason ?? r.items.map((i) => i.reason).join(', '),
        items: r.items.reduce((s, i) => s + i.qty, 0),
        amount: r.totalAmount,
        status: r.status,
        createdAt: r.createdAt.slice(0, 10),
      }))
    : mockClaimsFallback;
  const filtered = mockClaims.filter((c) => statusFilter === 'all' || c.status === statusFilter);

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-[9px]">B2B</Badge>
          <Badge variant="outline" className="text-[9px]">RMA</Badge>
          <Button variant="outline" size="sm" className="text-[9px] h-7" asChild>
            <Link href={ROUTES.brand.b2bOrders}><Package className="h-3 w-3 mr-1" /> B2B Orders</Link>
          </Button>
          <Button variant="outline" size="sm" className="text-[9px] h-7" asChild>
            <Link href={ROUTES.brand.disputes}><ShieldAlert className="h-3 w-3 mr-1" /> Disputes</Link>
          </Button>
        </div>
        <Button asChild>
          <Link href={`${ROUTES.brand.returnsClaims}?action=new`}>
            <Plus className="h-4 w-4 mr-2" /> Новая рекламация
          </Link>
        </Button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {['all', 'submitted', 'in_review', 'approved', 'rejected'].map((s) => (
          <Button
            key={s}
            variant={statusFilter === s ? 'default' : 'outline'}
            size="sm"
            className="text-[10px] h-7"
            onClick={() => setStatusFilter(s)}
          >
            {s === 'all' ? 'Все' : statusConfig[s]?.label || s}
          </Button>
        ))}
      </div>

      <WidgetCard title="Рекламации и возвраты" description="Партнёр, заказ, причина, статус">
        <div className="rounded-xl border border-slate-200 overflow-x-auto">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow className="border-b border-slate-100 hover:bg-transparent">
                <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">ID</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Заказ</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Партнёр</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Тип</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Причина</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Сумма</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Статус</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => {
                const config = statusConfig[c.status] || statusConfig.pending;
                const Icon = config.icon;
                return (
                  <TableRow key={c.id} className="border-b border-slate-100 hover:bg-slate-50 group">
                    <TableCell className="font-mono text-[11px] text-slate-900">{c.id}</TableCell>
                    <TableCell>
                      <Link href={`${ROUTES.brand.b2bOrders}/${c.orderId}`} className="hover:text-slate-900 font-medium text-slate-900">
                        {c.orderId}
                      </Link>
                    </TableCell>
                    <TableCell>{c.partner}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[9px]">
                        {typeof c.type === 'string' ? (c.type === 'return' ? 'Возврат' : c.type === 'claim' ? 'Рекламация' : 'Обмен') : 'Рекламация'}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate text-slate-600 text-[11px]">{c.reason}</TableCell>
                    <TableCell className="text-right font-bold tabular-nums">{c.amount.toLocaleString('ru-RU')} ₽</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('text-[9px] gap-1', config.color)}>
                        <Icon className="h-3 w-3" />
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-7 text-[10px]" asChild>
                        <Link href={`/brand/returns-claims/${c.id}`}>
                          Детали <ChevronRight className="h-3 w-3 ml-0.5" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </WidgetCard>

      <RelatedModulesBlock
        title="Связанные модули"
        links={[...getB2BLinks(), ...getArbitrationLinks()]}
      />
    </div>
  );
}

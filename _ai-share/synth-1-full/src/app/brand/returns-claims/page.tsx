'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { WidgetCard } from '@/components/ui/widget-card';
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
import {
  ShieldAlert,
  Plus,
  Package,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getArbitrationLinks, getB2BLinks } from '@/lib/data/entity-links';
import { getRmaList } from '@/lib/b2b/rma-workflow';
import { cn } from '@/lib/utils';

const mockClaimsFallback = [
  {
    id: 'RMA-001',
    orderId: 'ORD-8821',
<<<<<<< HEAD
    partner: 'Podium',
=======
    partner: 'Демо-магазин · Москва 1',
>>>>>>> recover/cabinet-wip-from-stash
    type: 'return',
    reason: 'Брак: разошелся шов',
    items: 3,
    amount: 45000,
    status: 'in_review',
    createdAt: '2026-03-10',
  },
  {
    id: 'RMA-002',
    orderId: 'ORD-8805',
    partner: 'Boutique No.7',
    type: 'claim',
    reason: 'Не соответствует образцу по цвету',
    items: 12,
    amount: 120000,
    status: 'approved',
    createdAt: '2026-03-08',
  },
  {
    id: 'RMA-003',
    orderId: 'ORD-8791',
<<<<<<< HEAD
    partner: 'ЦУМ',
=======
    partner: 'Демо-магазин · Москва 2',
>>>>>>> recover/cabinet-wip-from-stash
    type: 'return',
    reason: 'Пересорт: L вместо M',
    items: 5,
    amount: 75000,
    status: 'pending',
    createdAt: '2026-03-12',
  },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  draft: {
    label: 'Черновик',
<<<<<<< HEAD
    color: 'bg-slate-50 text-slate-600 border-slate-100',
=======
    color: 'bg-bg-surface2 text-text-secondary border-border-subtle',
>>>>>>> recover/cabinet-wip-from-stash
    icon: FileText,
  },
  submitted: {
    label: 'Отправлена',
    color: 'bg-amber-50 text-amber-600 border-amber-100',
    icon: Clock,
  },
  pending: {
    label: 'На рассмотрении',
    color: 'bg-amber-50 text-amber-600 border-amber-100',
    icon: Clock,
  },
  in_review: {
    label: 'Проверка',
    color: 'bg-blue-50 text-blue-600 border-blue-100',
    icon: FileText,
  },
  approved: {
    label: 'Одобрена',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    icon: CheckCircle2,
  },
  rejected: {
    label: 'Отклонена',
    color: 'bg-rose-50 text-rose-600 border-rose-100',
    icon: AlertTriangle,
  },
  received: {
    label: 'Получено',
<<<<<<< HEAD
    color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
=======
    color: 'bg-accent-primary/10 text-accent-primary border-accent-primary/20',
>>>>>>> recover/cabinet-wip-from-stash
    icon: Package,
  },
  refunded: {
    label: 'Возврат',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    icon: CheckCircle2,
  },
  closed: {
    label: 'Закрыта',
<<<<<<< HEAD
    color: 'bg-slate-50 text-slate-500 border-slate-100',
=======
    color: 'bg-bg-surface2 text-text-secondary border-border-subtle',
>>>>>>> recover/cabinet-wip-from-stash
    icon: CheckCircle2,
  },
};

export default function ReturnsClaimsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const rmaList = getRmaList();
  const mockClaims =
    rmaList.length > 0
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
          <Badge variant="outline" className="text-[9px]">
            B2B
          </Badge>
          <Badge variant="outline" className="text-[9px]">
            RMA
          </Badge>
          <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
            <Link href={ROUTES.brand.b2bOrders}>
              <Package className="mr-1 h-3 w-3" /> B2B Orders
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
            <Link href={ROUTES.brand.disputes}>
              <ShieldAlert className="mr-1 h-3 w-3" /> Disputes
            </Link>
          </Button>
        </div>
        <Button asChild>
          <Link href={`${ROUTES.brand.returnsClaims}?action=new`}>
            <Plus className="mr-2 h-4 w-4" /> Новая рекламация
          </Link>
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {['all', 'submitted', 'in_review', 'approved', 'rejected'].map((s) => (
          <Button
            key={s}
            variant={statusFilter === s ? 'default' : 'outline'}
            size="sm"
            className="h-7 text-[10px]"
            onClick={() => setStatusFilter(s)}
          >
            {s === 'all' ? 'Все' : statusConfig[s]?.label || s}
          </Button>
        ))}
      </div>

      <WidgetCard title="Рекламации и возвраты" description="Партнёр, заказ, причина, статус">
<<<<<<< HEAD
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow className="border-b border-slate-100 hover:bg-transparent">
                <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  ID
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Заказ
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Партнёр
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Тип
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Причина
                </TableHead>
                <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                  Сумма
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">
=======
        <div className="border-border-default overflow-x-auto rounded-xl border">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow className="border-border-subtle border-b hover:bg-transparent">
                <TableHead className="text-text-secondary text-xs font-bold uppercase tracking-wider">
                  ID
                </TableHead>
                <TableHead className="text-text-secondary text-xs font-bold uppercase tracking-wider">
                  Заказ
                </TableHead>
                <TableHead className="text-text-secondary text-xs font-bold uppercase tracking-wider">
                  Партнёр
                </TableHead>
                <TableHead className="text-text-secondary text-xs font-bold uppercase tracking-wider">
                  Тип
                </TableHead>
                <TableHead className="text-text-secondary text-xs font-bold uppercase tracking-wider">
                  Причина
                </TableHead>
                <TableHead className="text-text-secondary text-right text-xs font-bold uppercase tracking-wider">
                  Сумма
                </TableHead>
                <TableHead className="text-text-secondary text-xs font-bold uppercase tracking-wider">
>>>>>>> recover/cabinet-wip-from-stash
                  Статус
                </TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => {
                const config = statusConfig[c.status] || statusConfig.pending;
                const Icon = config.icon;
                return (
                  <TableRow
                    key={c.id}
<<<<<<< HEAD
                    className="group border-b border-slate-100 hover:bg-slate-50"
                  >
                    <TableCell className="font-mono text-[11px] text-slate-900">{c.id}</TableCell>
                    <TableCell>
                      <Link
                        href={`${ROUTES.brand.b2bOrders}/${c.orderId}`}
                        className="font-medium text-slate-900 hover:text-slate-900"
=======
                    className="border-border-subtle hover:bg-bg-surface2 group border-b"
                  >
                    <TableCell className="text-text-primary font-mono text-[11px]">
                      {c.id}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={ROUTES.brand.b2bOrder(c.orderId)}
                        className="hover:text-text-primary text-text-primary font-medium"
>>>>>>> recover/cabinet-wip-from-stash
                      >
                        {c.orderId}
                      </Link>
                    </TableCell>
                    <TableCell>{c.partner}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[9px]">
                        {typeof c.type === 'string'
                          ? c.type === 'return'
                            ? 'Возврат'
                            : c.type === 'claim'
                              ? 'Рекламация'
                              : 'Обмен'
                          : 'Рекламация'}
                      </Badge>
                    </TableCell>
<<<<<<< HEAD
                    <TableCell className="max-w-[180px] truncate text-[11px] text-slate-600">
=======
                    <TableCell className="text-text-secondary max-w-[180px] truncate text-[11px]">
>>>>>>> recover/cabinet-wip-from-stash
                      {c.reason}
                    </TableCell>
                    <TableCell className="text-right font-bold tabular-nums">
                      {c.amount.toLocaleString('ru-RU')} ₽
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('gap-1 text-[9px]', config.color)}>
                        <Icon className="h-3 w-3" />
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-7 text-[10px]" asChild>
                        <Link href={`/brand/returns-claims/${c.id}`}>
                          Детали <ChevronRight className="ml-0.5 h-3 w-3" />
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

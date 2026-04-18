'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
  Heart,
  Shirt,
  ShoppingCart,
  Undo2,
  Share2,
  Eye,
  TrendingUp,
  Star,
  AlertCircle,
  ArrowUpRight,
  Search,
  Users,
  Activity,
  Globe,
} from 'lucide-react';

const matrixData = [
  {
    action: 'Добавил в избранное',
    icon: Heart,
    metric: 'Awareness',
    label: 'Осведомленность',
    value: '+15% SKU interest',
    benefit: 'Бренд видит рост интереса к конкретным товарам (SKU) и может планировать запасы.',
    href: '/brand/products',
<<<<<<< HEAD
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
=======
    color: 'text-accent-primary',
    bg: 'bg-accent-primary/10',
>>>>>>> recover/cabinet-wip-from-stash
  },
  {
    action: 'Создал look с товаром',
    icon: Shirt,
    metric: 'Engagement',
    label: 'Вовлеченность',
    value: 'Insight into styling',
    benefit: 'Понимание, с какими вещами других брендов сочетают ваши товары (UGC-аналитика).',
    href: '/brand/showroom',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    action: 'Покупка',
    icon: ShoppingCart,
    metric: 'Conversion',
    label: 'Конверсия',
    value: '+8.4M ₽ Revenue',
    benefit: 'Прямая выручка и подтверждение эффективности маркетинга.',
    href: '/brand/finance',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    action: 'Возврат',
    icon: Undo2,
    metric: 'Churn Risk',
    label: 'Риск оттока',
    value: '4.2% Return Rate',
    benefit: 'Сигнал о проблемах с качеством, размерной сеткой или несоответствием ожиданиям.',
    href: '/brand/customer-intelligence',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
  },
  {
    action: 'Просмотр шоу бренда',
    icon: Eye,
    metric: 'Media Impact',
    label: 'Влияние медиа',
    value: '+30% product views',
    benefit: 'Измерение эффективности цифровых ивентов и их влияния на интерес к продукту.',
    href: '/brand/showroom',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    action: 'Поделился товаром',
    icon: Share2,
    metric: 'Virality',
    label: 'Виральность',
    value: '1.2x Reach',
    benefit: 'Органическое привлечение новых клиентов через рекомендации существующих.',
    href: '/brand/analytics-360',
<<<<<<< HEAD
    color: 'text-purple-600',
    bg: 'bg-purple-50',
=======
    color: 'text-accent-primary',
    bg: 'bg-accent-primary/10',
>>>>>>> recover/cabinet-wip-from-stash
  },
];

export function CustomerBrandMatrix() {
  return (
    <Card className="overflow-hidden rounded-xl border-none bg-white shadow-sm">
      <CardHeader className="p-4 pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="mb-1 flex items-center gap-2">
<<<<<<< HEAD
              <Activity className="h-4 w-4 text-indigo-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
=======
              <Activity className="text-accent-primary h-4 w-4" />
              <span className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em]">
>>>>>>> recover/cabinet-wip-from-stash
                Matrix v2.0
              </span>
            </div>
            <CardTitle className="text-base font-black uppercase tracking-tight">
              Матрица "Клиент-Бренд"
            </CardTitle>
<<<<<<< HEAD
            <CardDescription className="text-xs font-medium italic text-slate-400">
=======
            <CardDescription className="text-text-muted text-xs font-medium italic">
>>>>>>> recover/cabinet-wip-from-stash
              Как действия клиентов влияют на ключевые метрики вашего бренда.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full overflow-auto">
          <Table>
<<<<<<< HEAD
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="h-10 px-8 text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Действие клиента
                </TableHead>
                <TableHead className="h-10 text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Метрика бренда
                </TableHead>
                <TableHead className="h-10 text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Показатель
                </TableHead>
                <TableHead className="h-10 px-8 text-[9px] font-black uppercase tracking-widest text-slate-400">
=======
            <TableHeader className="bg-bg-surface2/80">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="text-text-muted h-10 px-8 text-[9px] font-black uppercase tracking-widest">
                  Действие клиента
                </TableHead>
                <TableHead className="text-text-muted h-10 text-[9px] font-black uppercase tracking-widest">
                  Метрика бренда
                </TableHead>
                <TableHead className="text-text-muted h-10 text-[9px] font-black uppercase tracking-widest">
                  Показатель
                </TableHead>
                <TableHead className="text-text-muted h-10 px-8 text-[9px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                  Выгода и Логика
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matrixData.map((row) => (
                <TableRow
                  key={row.action}
<<<<<<< HEAD
                  className="group border-slate-50 transition-all hover:bg-slate-50"
=======
                  className="hover:bg-bg-surface2 border-border-subtle group transition-all"
>>>>>>> recover/cabinet-wip-from-stash
                >
                  <TableCell className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'rounded-xl p-2 shadow-sm transition-all group-hover:scale-110',
                          row.bg
                        )}
                      >
                        <row.icon className={cn('h-4 w-4', row.color)} />
                      </div>
<<<<<<< HEAD
                      <span className="text-[11px] font-black uppercase leading-tight text-slate-900">
=======
                      <span className="text-text-primary text-[11px] font-black uppercase leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
                        {row.action}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
<<<<<<< HEAD
                      <span className="text-[9px] font-black uppercase text-slate-900">
                        {row.metric}
                      </span>
                      <span className="text-[8px] font-medium uppercase tracking-widest text-slate-400">
=======
                      <span className="text-text-primary text-[9px] font-black uppercase">
                        {row.metric}
                      </span>
                      <span className="text-text-muted text-[8px] font-medium uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                        {row.label}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'rounded-lg px-2 py-0.5 text-[10px] font-black tabular-nums',
                          row.metric === 'Churn Risk'
                            ? 'bg-rose-50 text-rose-600'
                            : 'bg-emerald-50 text-emerald-600'
                        )}
                      >
                        {row.value}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-5">
                    <div className="flex items-center justify-between gap-3">
<<<<<<< HEAD
                      <p className="max-w-sm text-[9px] font-medium italic leading-relaxed text-slate-500">
=======
                      <p className="text-text-secondary max-w-sm text-[9px] font-medium italic leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                        {row.benefit}
                      </p>
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
<<<<<<< HEAD
                        className="h-8 w-8 rounded-xl bg-slate-50 text-slate-400 opacity-0 transition-all hover:bg-slate-900 hover:text-white group-hover:opacity-100"
=======
                        className="bg-bg-surface2 text-text-muted hover:bg-text-primary/90 h-8 w-8 rounded-xl opacity-0 transition-all hover:text-white group-hover:opacity-100"
>>>>>>> recover/cabinet-wip-from-stash
                      >
                        <Link href={row.href}>
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

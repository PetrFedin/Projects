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
    color: 'text-accent-primary',
    bg: 'bg-accent-primary/10',
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
    color: 'text-accent-primary',
    bg: 'bg-accent-primary/10',
  },
];

export function CustomerBrandMatrix() {
  return (
    <Card className="overflow-hidden rounded-xl border-none bg-white shadow-sm">
      <CardHeader className="p-4 pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="mb-1 flex items-center gap-2">
              <Activity className="text-accent-primary h-4 w-4" />
              <span className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em]">
                Matrix v2.0
              </span>
            </div>
            <CardTitle className="text-base font-black uppercase tracking-tight">
              Матрица "Клиент-Бренд"
            </CardTitle>
            <CardDescription className="text-text-muted text-xs font-medium italic">
              Как действия клиентов влияют на ключевые метрики вашего бренда.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full overflow-auto">
          <Table>
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
                  Выгода и Логика
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matrixData.map((row) => (
                <TableRow
                  key={row.action}
                  className="hover:bg-bg-surface2 border-border-subtle group transition-all"
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
                      <span className="text-text-primary text-[11px] font-black uppercase leading-tight">
                        {row.action}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-text-primary text-[9px] font-black uppercase">
                        {row.metric}
                      </span>
                      <span className="text-text-muted text-[8px] font-medium uppercase tracking-widest">
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
                      <p className="text-text-secondary max-w-sm text-[9px] font-medium italic leading-relaxed">
                        {row.benefit}
                      </p>
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="bg-bg-surface2 text-text-muted hover:bg-text-primary/90 h-8 w-8 rounded-xl opacity-0 transition-all hover:text-white group-hover:opacity-100"
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

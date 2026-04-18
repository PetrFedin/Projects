'use client';

import React, { useState, type ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import {
  Copy,
  Tag,
  BarChart3,
  Clock,
  AlertTriangle,
  FileText,
  Package,
  Layers,
  CreditCard,
  Truck,
  Filter,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/** Section info card — описание раздела в стиле «Что такое бюджет» */
export function SectionInfoCard({
  title,
  description,
  icon: Icon,
  iconBg = 'bg-accent-primary/15',
  iconColor = 'text-accent-primary',
  badges,
  children,
}: {
  title: string;
  description?: ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  iconBg?: string;
  iconColor?: string;
  badges?: ReactNode;
  children?: ReactNode;
}) {
  return (
<<<<<<< HEAD
    <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50/50 to-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
=======
    <div className="border-border-subtle from-bg-surface2/50 rounded-xl border bg-gradient-to-br to-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-xl',
>>>>>>> recover/cabinet-wip-from-stash
            iconBg,
            iconColor
          )}
        >
<<<<<<< HEAD
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-black uppercase text-slate-900">{title}</h3>
          {description ? (
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600">{description}</p>
=======
          <Icon className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-text-primary text-sm font-black uppercase tracking-tight">{title}</h3>
          {description ? (
            <p className="text-text-secondary mt-1 text-xs font-medium leading-relaxed">
              {description}
            </p>
>>>>>>> recover/cabinet-wip-from-stash
          ) : null}
          {badges ? <div className="mt-3 flex flex-wrap items-center gap-2">{badges}</div> : null}
          {children}
        </div>
      </div>
    </div>
  );
}

/** Collection card stats (SKU, PO, samples) */
export function CollectionCardStats({
  skuCount,
  poCount,
  samplePending,
  onNavigate,
}: {
  skuCount: number;
  poCount: number;
  samplePending: number;
  onNavigate?: (tab: string) => void;
}) {
  return (
<<<<<<< HEAD
    <div className="flex gap-3 text-[10px]">
      <button
        type="button"
        onClick={() => onNavigate?.('plm')}
        className="flex items-center gap-1 text-slate-600 hover:text-indigo-600"
      >
        <Layers className="h-3.5 w-3.5" /> {skuCount} SKU
=======
    <div className="flex gap-3 text-xs">
      <button
        type="button"
        onClick={() => onNavigate?.('plm')}
        className="text-text-secondary hover:text-accent-primary flex items-center gap-1"
      >
        <Layers className="size-3.5" /> {skuCount} SKU
>>>>>>> recover/cabinet-wip-from-stash
      </button>
      <button
        type="button"
        onClick={() => onNavigate?.('orders')}
<<<<<<< HEAD
        className="flex items-center gap-1 text-slate-600 hover:text-indigo-600"
      >
        <Package className="h-3.5 w-3.5" /> {poCount} PO
=======
        className="text-text-secondary hover:text-accent-primary flex items-center gap-1"
      >
        <Package className="size-3.5" /> {poCount} PO
>>>>>>> recover/cabinet-wip-from-stash
      </button>
      {samplePending > 0 && (
        <button
          type="button"
          onClick={() => onNavigate?.('samples')}
          className="flex items-center gap-1 font-bold text-amber-600"
        >
<<<<<<< HEAD
          <Clock className="h-3.5 w-3.5" /> {samplePending} на проверке
=======
          <Clock className="size-3.5" /> {samplePending} на проверке
>>>>>>> recover/cabinet-wip-from-stash
        </button>
      )}
    </div>
  );
}

/** Budget category breakdown */
export function BudgetCategoryBreakdown({
  categories,
  totalPlan,
  totalFact,
  onAlert,
}: {
  categories: Array<{ id: string; label: string; plan: number; fact: number; unit: string }>;
  totalPlan: number;
  totalFact: number;
  onAlert?: (over: boolean) => void;
}) {
  const remainder = totalPlan - totalFact;
  const over = remainder < 0;
  if (onAlert && over) onAlert(true);
  return (
    <div className="space-y-3">
      {categories.map((cat) => {
        const pct = cat.plan ? Math.round((cat.fact / cat.plan) * 100) : 0;
        const overCat = cat.fact > cat.plan;
        return (
          <div key={cat.id} className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span>{cat.label}</span>
              <span className={cn(overCat ? 'text-rose-600' : 'text-text-secondary')}>
                {(cat.fact / 1000).toFixed(0)}k / {(cat.plan / 1000).toFixed(0)}k ₽
              </span>
            </div>
            <Progress
              value={Math.min(pct, 100)}
              className={cn('h-1.5', overCat && '[&>div]:bg-rose-400')}
            />
          </div>
        );
      })}
<<<<<<< HEAD
      <div className="flex justify-between border-t border-slate-100 pt-2 text-[11px] font-bold">
=======
      <div className="border-border-subtle flex justify-between border-t pt-2 text-sm font-bold">
>>>>>>> recover/cabinet-wip-from-stash
        <span>Остаток</span>
        <span className={cn(remainder >= 0 ? 'text-emerald-600' : 'text-rose-600')}>
          {(remainder / 1000).toFixed(0)}k ₽
        </span>
      </div>
    </div>
  );
}

/** SLA countdown / overdue badge */
export function SLACountdown({ dueDate, overdue }: { dueDate?: string; overdue?: boolean }) {
  if (!dueDate) return null;
  return (
    <Badge variant={overdue ? 'destructive' : 'outline'} className="gap-0.5 text-[8px]">
<<<<<<< HEAD
      {overdue ? <AlertTriangle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
=======
      {overdue ? <AlertTriangle className="size-3" /> : <Clock className="size-3" />}
>>>>>>> recover/cabinet-wip-from-stash
      {overdue ? 'Просрочено' : dueDate}
    </Badge>
  );
}

/** Audit row with expandable detail */
export function AuditRowWithDetail({
  actionLabel,
  entity,
  user,
  time,
  detail,
}: {
  actionLabel: string;
  entity: string;
  user: string;
  time: string;
  detail?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
<<<<<<< HEAD
    <tr className="cursor-pointer hover:bg-slate-50/50" onClick={() => setExpanded(!expanded)}>
      <td className="py-2 text-[10px] font-medium">{actionLabel}</td>
      <td className="font-mono text-[10px]">{entity}</td>
      <td className="text-[10px]">{user}</td>
      <td className="text-[10px] text-slate-500">{time}</td>
=======
    <tr className="hover:bg-bg-surface2/80 cursor-pointer" onClick={() => setExpanded(!expanded)}>
      <td className="py-2 text-xs font-medium">{actionLabel}</td>
      <td className="font-mono text-xs">{entity}</td>
      <td className="text-xs">{user}</td>
      <td className="text-text-secondary text-xs">{time}</td>
>>>>>>> recover/cabinet-wip-from-stash
      <td className="text-[9px]">{expanded && detail ? detail : detail ? '…' : ''}</td>
    </tr>
  );
}

/** PO expandable detail row */
export function PODetailExpanded({
  po,
  onNavigateFinance,
  onNavigateLogistics,
}: {
  po: {
    id: string;
    collection?: string;
    factory?: string;
    qty?: number;
    status?: string;
    sizeMatrix?: Record<string, number>;
    colors?: string[];
    progress?: number;
  };
  onNavigateFinance?: () => void;
  onNavigateLogistics?: () => void;
}) {
  const progress =
    po.progress ?? (po.status === 'Shipped' ? 100 : po.status === 'In Production' ? 65 : 25);
  return (
<<<<<<< HEAD
    <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/80 p-4">
      <div className="flex flex-wrap gap-4">
        {po.sizeMatrix &&
          Object.entries(po.sizeMatrix).map(([size, qty]) => (
            <span key={size} className="font-mono text-[10px]">
=======
    <div className="border-border-subtle bg-bg-surface2/80 space-y-3 rounded-xl border p-4">
      <div className="flex flex-wrap gap-4">
        {po.sizeMatrix &&
          Object.entries(po.sizeMatrix).map(([size, qty]) => (
            <span key={size} className="font-mono text-xs">
>>>>>>> recover/cabinet-wip-from-stash
              <strong>{size}</strong>: {qty}
            </span>
          ))}
      </div>
      {po.colors && <p className="text-xs">Цвета: {po.colors.join(', ')}</p>}
      <div>
<<<<<<< HEAD
        <div className="mb-1 flex justify-between text-[10px] font-bold">Прогресс</div>
=======
        <div className="mb-1 flex justify-between text-xs font-bold">Прогресс</div>
>>>>>>> recover/cabinet-wip-from-stash
        <Progress value={progress} className="h-2" />
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="h-7 text-[9px]" onClick={onNavigateFinance}>
          Финансы
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-[9px]"
          onClick={onNavigateLogistics}
        >
          Логистика
        </Button>
      </div>
    </div>
  );
}

/** Mini progress chart by stages (design, tz, bom, sample, approval, po, production) */
export function CollectionProgressMiniChart({
  stageStatus,
  onStageClick,
}: {
  stageStatus: Record<string, 'completed' | 'active' | 'locked'>;
  onStageClick?: (stage: string) => void;
}) {
  const stages = ['design', 'tz', 'bom', 'sample', 'approval', 'po', 'production'];
  const labels: Record<string, string> = {
    design: 'Дизайн',
    tz: 'ТЗ',
    bom: 'BOM',
    sample: 'Сэмплы',
    approval: 'Утв.',
    po: 'PO',
    production: 'Пр-во',
  };
  const done = stages.filter((s) => stageStatus[s] === 'completed').length;
  const pct = Math.round((done / stages.length) * 100);
  return (
    <div className="space-y-1.5">
      <div className="text-text-secondary flex justify-between text-[9px] font-bold">
        <span>Этапы</span>
        <span>{pct}%</span>
      </div>
      <div className="flex gap-0.5">
        {stages.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onStageClick?.(s)}
            title={labels[s] || s}
            className={cn(
              'h-1.5 flex-1 rounded-sm transition-colors',
              stageStatus[s] === 'completed'
                ? 'bg-emerald-500'
                : stageStatus[s] === 'active'
                  ? 'bg-amber-500'
<<<<<<< HEAD
                  : 'bg-slate-200'
=======
                  : 'bg-border-subtle'
>>>>>>> recover/cabinet-wip-from-stash
            )}
          />
        ))}
      </div>
    </div>
  );
}

/** Document filter bar */
export function DocumentFilterBar({
  filter,
  onFilter,
  types,
}: {
  filter: string;
  onFilter: (v: string) => void;
  types: string[];
}) {
  return (
    <div className="mb-3 flex flex-wrap gap-1">
      <button
        type="button"
        onClick={() => onFilter('all')}
        className={cn(
          'rounded-lg px-3 py-1.5 text-[9px] font-bold uppercase transition-all',
<<<<<<< HEAD
          filter === 'all' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-500 hover:bg-slate-100'
=======
          filter === 'all'
            ? 'bg-accent-primary/15 text-accent-primary'
            : 'text-text-secondary hover:bg-bg-surface2'
>>>>>>> recover/cabinet-wip-from-stash
        )}
      >
        Все
      </button>
      {types.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onFilter(t)}
          className={cn(
            'rounded-lg px-3 py-1.5 text-[9px] font-bold uppercase transition-all',
<<<<<<< HEAD
            filter === t ? 'bg-indigo-100 text-indigo-600' : 'text-slate-500 hover:bg-slate-100'
=======
            filter === t
              ? 'bg-accent-primary/15 text-accent-primary'
              : 'text-text-secondary hover:bg-bg-surface2'
>>>>>>> recover/cabinet-wip-from-stash
          )}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

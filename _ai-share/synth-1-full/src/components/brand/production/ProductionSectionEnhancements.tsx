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
  iconBg = 'bg-indigo-100',
  iconColor = 'text-indigo-600',
  badges,
  children,
}: {
  title: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg?: string;
  iconColor?: string;
  badges?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 shadow-sm p-5 bg-gradient-to-br from-slate-50/50 to-white">
      <div className="flex items-start gap-4">
        <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center shrink-0', iconBg, iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-black uppercase text-slate-900">{title}</h3>
          {description ? (
            <p className="text-[11px] text-slate-600 leading-relaxed mt-1">{description}</p>
          ) : null}
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
    <div className="flex gap-3 text-[10px]">
      <button type="button" onClick={() => onNavigate?.('plm')} className="flex items-center gap-1 text-slate-600 hover:text-indigo-600">
        <Layers className="h-3.5 w-3.5" /> {skuCount} SKU
      </button>
      <button type="button" onClick={() => onNavigate?.('orders')} className="flex items-center gap-1 text-slate-600 hover:text-indigo-600">
        <Package className="h-3.5 w-3.5" /> {poCount} PO
      </button>
      {samplePending > 0 && (
        <button type="button" onClick={() => onNavigate?.('samples')} className="flex items-center gap-1 text-amber-600 font-bold">
          <Clock className="h-3.5 w-3.5" /> {samplePending} на проверке
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
            <div className="flex justify-between text-[10px] font-bold">
              <span>{cat.label}</span>
              <span className={cn(overCat ? 'text-rose-600' : 'text-slate-600')}>
                {(cat.fact / 1000).toFixed(0)}k / {(cat.plan / 1000).toFixed(0)}k ₽
              </span>
            </div>
            <Progress value={Math.min(pct, 100)} className={cn('h-1.5', overCat && '[&>div]:bg-rose-400')} />
          </div>
        );
      })}
      <div className="pt-2 border-t border-slate-100 flex justify-between text-[11px] font-bold">
        <span>Остаток</span>
        <span className={cn(remainder >= 0 ? 'text-emerald-600' : 'text-rose-600')}>{(remainder / 1000).toFixed(0)}k ₽</span>
      </div>
    </div>
  );
}

/** SLA countdown / overdue badge */
export function SLACountdown({ dueDate, overdue }: { dueDate?: string; overdue?: boolean }) {
  if (!dueDate) return null;
  return (
    <Badge variant={overdue ? 'destructive' : 'outline'} className="text-[8px] gap-0.5">
      {overdue ? <AlertTriangle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
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
    <tr className="hover:bg-slate-50/50 cursor-pointer" onClick={() => setExpanded(!expanded)}>
      <td className="text-[10px] font-medium py-2">{actionLabel}</td>
      <td className="text-[10px] font-mono">{entity}</td>
      <td className="text-[10px]">{user}</td>
      <td className="text-[10px] text-slate-500">{time}</td>
      <td className="text-[9px]">{expanded && detail ? detail : (detail ? '…' : '')}</td>
    </tr>
  );
}

/** PO expandable detail row */
export function PODetailExpanded({
  po,
  onNavigateFinance,
  onNavigateLogistics,
}: {
  po: { id: string; collection?: string; factory?: string; qty?: number; status?: string; sizeMatrix?: Record<string, number>; colors?: string[]; progress?: number };
  onNavigateFinance?: () => void;
  onNavigateLogistics?: () => void;
}) {
  const progress = po.progress ?? (po.status === 'Shipped' ? 100 : po.status === 'In Production' ? 65 : 25);
  return (
    <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100 space-y-3">
      <div className="flex gap-4 flex-wrap">
        {po.sizeMatrix && Object.entries(po.sizeMatrix).map(([size, qty]) => (
          <span key={size} className="text-[10px] font-mono"><strong>{size}</strong>: {qty}</span>
        ))}
      </div>
      {po.colors && <p className="text-[10px]">Цвета: {po.colors.join(', ')}</p>}
      <div>
        <div className="flex justify-between text-[10px] font-bold mb-1">Прогресс</div>
        <Progress value={progress} className="h-2" />
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="text-[9px] h-7" onClick={onNavigateFinance}>Финансы</Button>
        <Button size="sm" variant="outline" className="text-[9px] h-7" onClick={onNavigateLogistics}>Логистика</Button>
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
  const labels: Record<string, string> = { design: 'Дизайн', tz: 'ТЗ', bom: 'BOM', sample: 'Сэмплы', approval: 'Утв.', po: 'PO', production: 'Пр-во' };
  const done = stages.filter(s => stageStatus[s] === 'completed').length;
  const pct = Math.round((done / stages.length) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[9px] font-bold text-slate-500">
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
              stageStatus[s] === 'completed' ? 'bg-emerald-500' : stageStatus[s] === 'active' ? 'bg-amber-500' : 'bg-slate-200'
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
    <div className="flex flex-wrap gap-1 mb-3">
      <button
        type="button"
        onClick={() => onFilter('all')}
        className={cn('px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all', filter === 'all' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-500 hover:bg-slate-100')}
      >
        Все
      </button>
      {types.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onFilter(t)}
          className={cn('px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all', filter === t ? 'bg-indigo-100 text-indigo-600' : 'text-slate-500 hover:bg-slate-100')}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

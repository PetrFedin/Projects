'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  Layers,
  ClipboardCheck,
  Wallet,
  GanttChart,
  FileText,
  TrendingUp,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ApiDrop {
  id: number;
  drop_name: string;
  season: string;
  status: string;
  scheduled_date: string;
}

export interface ProductionContextBarProps {
  selectedCollectionIds: string[];
  collections: Array<{ id: string; name: string }>;
  skuCount: number;
  poCount: number;
  samplePendingCount: number;
  sampleOverdueCount: number;
  budgetRemainder: number; // sum of (plan - fact) for selected collections
  lossCount?: number;
  docCount?: number;
  apiDrops?: ApiDrop[];
  onNavigate: (tab: string) => void;
  activeTab?: string;
}

const QUICK_TABS = [
  { id: 'plm', label: 'PLM', icon: Layers },
  { id: 'samples', label: 'Сэмплы', icon: ClipboardCheck },
  { id: 'approval', label: 'Утверждение', icon: ClipboardCheck },
  { id: 'orders', label: 'Заказы', icon: Package },
  { id: 'materials', label: 'Материалы', icon: Layers },
  { id: 'budget', label: 'Бюджет', icon: Wallet },
  { id: 'finance', label: 'Финансы', icon: Wallet },
  { id: 'documents', label: 'Документы', icon: FileText },
  { id: 'losses', label: 'Потери', icon: TrendingUp },
  { id: 'calendar', label: 'Календарь', icon: GanttChart },
] as const;

export function ProductionContextBar({
  selectedCollectionIds,
  collections,
  skuCount,
  poCount,
  samplePendingCount,
  sampleOverdueCount,
  budgetRemainder,
  lossCount = 0,
  docCount = 0,
  apiDrops = [],
  onNavigate,
  activeTab,
}: ProductionContextBarProps) {
  if (selectedCollectionIds.length === 0) return null;

  const labels = selectedCollectionIds
    .map((id) => collections.find((c) => c.id === id)?.name || id)
    .join(', ');
  const budgetFormatted =
    budgetRemainder >= 0
      ? `+${(budgetRemainder / 1000).toFixed(0)}k ₽`
      : `−${(Math.abs(budgetRemainder) / 1000).toFixed(0)}k ₽`;
  const hasRisks = sampleOverdueCount > 0 || budgetRemainder < 0;

  return (
    <Card className="border-border-subtle mb-3 rounded-xl border bg-white/95 p-3 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-text-muted text-[9px] font-black uppercase tracking-widest">
            Контекст: <span className="text-accent-primary">{labels}</span>
          </span>
          {hasRisks && (
            <Badge
              variant="outline"
              className="gap-1 border-amber-200 bg-amber-50 text-[8px] text-amber-700"
            >
              <AlertTriangle className="h-3 w-3" /> Риски
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => onNavigate('plm')}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-bold uppercase transition-all',
              activeTab === 'plm'
                ? 'bg-accent-primary/15 text-accent-primary'
                : 'bg-bg-surface2 text-text-secondary hover:bg-bg-surface2'
            )}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>SKU</span>
            <span className="tabular-nums">{skuCount}</span>
          </button>
          <button
            onClick={() => onNavigate('orders')}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-bold uppercase transition-all',
              activeTab === 'orders'
                ? 'bg-accent-primary/15 text-accent-primary'
                : 'bg-bg-surface2 text-text-secondary hover:bg-bg-surface2'
            )}
          >
            <Package className="h-3.5 w-3.5" />
            <span>PO</span>
            <span className="tabular-nums">{poCount}</span>
          </button>
          <button
            onClick={() => onNavigate('samples')}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-bold uppercase transition-all',
              activeTab === 'samples'
                ? 'bg-accent-primary/15 text-accent-primary'
                : 'bg-bg-surface2 text-text-secondary hover:bg-bg-surface2'
            )}
          >
            <ClipboardCheck className="h-3.5 w-3.5" />
            <span>Сэмплы</span>
            <span className="tabular-nums">{samplePendingCount + sampleOverdueCount}</span>
            {sampleOverdueCount > 0 && (
              <span className="font-black text-amber-600">({sampleOverdueCount} просрочено)</span>
            )}
          </button>
          <button
            onClick={() => onNavigate('budget')}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-bold uppercase transition-all',
              activeTab === 'budget'
                ? 'bg-accent-primary/15 text-accent-primary'
                : 'bg-bg-surface2 text-text-secondary hover:bg-bg-surface2'
            )}
          >
            <Wallet className="h-3.5 w-3.5" />
            <span>Остаток бюджета</span>
            <span
              className={cn(
                'tabular-nums',
                budgetRemainder >= 0 ? 'text-emerald-600' : 'text-rose-600'
              )}
            >
              {budgetFormatted}
            </span>
          </button>
          {docCount > 0 && (
            <button
              onClick={() => onNavigate('documents')}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-bold uppercase transition-all',
                activeTab === 'documents'
                  ? 'bg-accent-primary/15 text-accent-primary'
                  : 'bg-bg-surface2 text-text-secondary hover:bg-bg-surface2'
              )}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Док.</span>
              <span className="tabular-nums">{docCount}</span>
            </button>
          )}
          {lossCount > 0 && (
            <button
              onClick={() => onNavigate('losses')}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-bold uppercase transition-all',
                activeTab === 'losses'
                  ? 'bg-accent-primary/15 text-accent-primary'
                  : 'bg-bg-surface2 text-text-secondary hover:bg-bg-surface2'
              )}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Потери</span>
              <span className="tabular-nums text-rose-600">{lossCount}</span>
            </button>
          )}
        </div>

        {apiDrops.length > 0 && (
          <div className="border-border-subtle flex flex-wrap items-center gap-2 border-t pt-2">
            <span className="text-text-muted text-[8px] font-bold uppercase tracking-widest">
              Дропы (API):
            </span>
            {apiDrops.slice(0, 5).map((d) => (
              <button
                key={d.id}
                onClick={() => onNavigate('calendar')}
                className="bg-bg-surface2 hover:bg-accent-primary/15 text-text-primary hover:text-accent-primary rounded-lg px-2 py-1 text-[9px] font-bold uppercase transition-all"
              >
                {d.drop_name} · {d.season}
              </button>
            ))}
          </div>
        )}

        <div className="border-border-subtle flex flex-wrap items-center gap-1.5 border-t pt-1">
          <span className="text-text-muted mr-1 text-[8px] font-bold uppercase tracking-widest">
            Перейти:
          </span>
          {QUICK_TABS.map(({ id, label }) => (
            <Button
              key={id}
              variant="ghost"
              size="sm"
              className={cn(
                'h-6 rounded-md px-2 text-[8px] font-bold uppercase',
                activeTab === id
                  ? 'bg-accent-primary/15 text-accent-primary'
                  : 'text-text-secondary hover:text-accent-primary'
              )}
              onClick={() => onNavigate(id)}
            >
              {label}
            </Button>
          ))}
          <ChevronRight className="text-text-muted h-3 w-3" />
        </div>
      </div>
    </Card>
  );
}

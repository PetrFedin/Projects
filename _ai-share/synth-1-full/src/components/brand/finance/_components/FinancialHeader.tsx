'use client';

import {
  Calculator,
  Download,
  Plus,
  PieChart,
  DollarSign,
  Scale,
  Wallet,
  Package,
  FileText,
  Banknote,
  Percent,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FinancialHeaderProps {
  activeView: string;
  setActiveView: (view: any) => void;
  isAdmin: boolean;
}

export function FinancialHeader({ activeView, setActiveView, isAdmin }: FinancialHeaderProps) {
  return (
    <>
      <header className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0f111a] shadow-xl">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-text-primary font-headline text-base font-black uppercase tracking-tighter">
              Financial Control Hub
            </h2>
          </div>
          <p className="text-text-muted ml-1 text-[10px] font-bold uppercase tracking-widest">
            Управление экономикой бизнеса, планирование и финансовый аудит
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-border-default hover:bg-bg-surface2 h-12 gap-2 rounded-xl px-8 text-[9px] font-black uppercase tracking-widest shadow-sm transition-all"
          >
            <Download className="h-4 w-4" /> Экспорт отчетности
          </Button>
          <Button className="button-glimmer h-12 gap-2 rounded-xl bg-black px-8 text-[9px] font-black uppercase tracking-widest text-white shadow-2xl">
            <Plus className="h-4 w-4" /> Внести операцию
          </Button>
        </div>
      </header>

      {/* Financial Navigation */}
      <div className="border-border-subtle custom-scrollbar flex w-fit items-center gap-3 overflow-x-auto rounded-[1.5rem] border bg-white/50 p-1.5 shadow-sm backdrop-blur-sm">
        {[
          { id: 'overview', label: 'Обзор', icon: PieChart },
          { id: 'fintech', label: 'Fintech & Escrow', icon: ShieldCheck },
          { id: 'pnl', label: 'P&L / Прибыль', icon: DollarSign },
          { id: 'balance', label: 'Баланс и Оценка', icon: Scale },
          { id: 'payroll', label: 'ФОТ и Штат', icon: Wallet },
          { id: 'inventory', label: 'Stock Asset', icon: Package },
          { id: 'invoices', label: 'Счета партнеров', icon: FileText },
          { id: 'expenses', label: 'Расходы и Доходы', icon: Banknote },
          ...(isAdmin
            ? [{ id: 'platform_commissions', label: 'Комиссии платформы', icon: Percent }]
            : []),
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id as any)}
            className={cn(
              'flex h-11 items-center gap-2.5 whitespace-nowrap rounded-xl px-6 text-[10px] font-black uppercase tracking-widest transition-all',
              activeView === tab.id
                ? 'bg-text-primary scale-[1.02] text-white shadow-xl'
                : 'text-text-muted hover:text-text-secondary hover:bg-white/80'
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>
    </>
  );
}

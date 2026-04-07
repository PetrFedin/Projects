"use client";

import { Calculator, Download, Plus, PieChart, DollarSign, Scale, Wallet, Package, FileText, Banknote, Percent, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FinancialHeaderProps {
  activeView: string;
  setActiveView: (view: any) => void;
  isAdmin: boolean;
}

export function FinancialHeader({ activeView, setActiveView, isAdmin }: FinancialHeaderProps) {
  return (
    <>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#0f111a] flex items-center justify-center shadow-xl">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-base font-black uppercase tracking-tighter text-slate-900 font-headline">Financial Control Hub</h2>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Управление экономикой бизнеса, планирование и финансовый аудит</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl font-black uppercase text-[9px] tracking-widest h-12 px-8 gap-2 border-slate-200 shadow-sm hover:bg-slate-50 transition-all">
            <Download className="h-4 w-4" /> Экспорт отчетности
          </Button>
          <Button className="bg-black text-white rounded-xl font-black uppercase text-[9px] tracking-widest h-12 px-8 shadow-2xl button-glimmer gap-2">
            <Plus className="h-4 w-4" /> Внести операцию
          </Button>
        </div>
      </header>

      {/* Financial Navigation */}
      <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm p-1.5 rounded-[1.5rem] border border-slate-100 shadow-sm w-fit overflow-x-auto custom-scrollbar">
        {[
          { id: 'overview', label: 'Обзор', icon: PieChart },
          { id: 'fintech', label: 'Fintech & Escrow', icon: ShieldCheck },
          { id: 'pnl', label: 'P&L / Прибыль', icon: DollarSign },
          { id: 'balance', label: 'Баланс и Оценка', icon: Scale },
          { id: 'payroll', label: 'ФОТ и Штат', icon: Wallet },
          { id: 'inventory', label: 'Stock Asset', icon: Package },
          { id: 'invoices', label: 'Счета партнеров', icon: FileText },
          { id: 'expenses', label: 'Расходы и Доходы', icon: Banknote },
          ...(isAdmin ? [{ id: 'platform_commissions', label: 'Комиссии платформы', icon: Percent }] : []),
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id as any)}
            className={cn(
              "flex items-center gap-2.5 px-6 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
              activeView === tab.id 
                ? "bg-slate-900 text-white shadow-xl scale-[1.02]" 
                : "text-slate-400 hover:text-slate-600 hover:bg-white/80"
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

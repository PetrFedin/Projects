"use client";

import { Calculator, Download, Plus, PieChart, DollarSign, Scale, Wallet, Package, FileText, Banknote, Percent, Zap, ShieldCheck, AlertCircle, Building2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { mockBankAccounts } from "../_fixtures/finance-data";

interface FinancialSidebarProps {
  setActiveView: (view: any) => void;
  activeView: string;
  isAdmin: boolean;
}

export function FinancialSidebar({ setActiveView, activeView, isAdmin }: FinancialSidebarProps) {
  return (
    <div className="lg:col-span-4 space-y-10">
      <Card className="rounded-xl border-none shadow-2xl bg-indigo-600 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-3 opacity-10 rotate-12">
          <Zap className="h-48 w-48" />
        </div>
        <CardHeader className="p-3 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md shadow-xl">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-base font-black uppercase tracking-tight leading-none">AI Advisor</CardTitle>
              <p className="text-[8px] font-black uppercase text-white/40 tracking-widest mt-2">Financial Intelligence</p>
            </div>
          </div>
          <CardDescription className="text-white/70 text-xs font-medium leading-relaxed">
            Интеллектуальный анализ вашей экономики на основе данных платформы и банковских выписок.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 pt-0 space-y-6 relative z-10">
          <div className="space-y-4">
            {[
              { title: 'Оптимизация налогов', text: 'Вы можете снизить налоговую нагрузку на 4.2% в этом квартале, применив льготу для IT-партнеров.', type: 'tip' },
              { title: 'Риск кассового разрыва', text: 'Внимание: 15.02 ожидаются крупные выплаты (ФОТ + Аренда). Рекомендуется ускорить подтверждение INV-883.', type: 'alert' },
              { title: 'Инвестиционный потенциал', text: 'Текущий индекс устойчивости (88%) позволяет привлечь кредитную линию до 15 млн ₽ под 8.5%.', type: 'insight' }
            ].map((tip, i) => (
              <div key={i} className="p-3 rounded-3xl bg-white/10 border border-white/10 space-y-2 hover:bg-white/15 transition-all cursor-pointer group relative overflow-hidden">
                {tip.type === 'alert' && <div className="absolute top-0 left-0 w-1 h-full bg-rose-400" />}
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/50 group-hover:text-white/90 transition-colors">{tip.title}</span>
                  {tip.type === 'alert' && <AlertCircle className="h-3.5 w-3.5 text-rose-300 animate-pulse" />}
                </div>
                <p className="text-[11px] font-medium leading-relaxed text-white/80">{tip.text}</p>
              </div>
            ))}
          </div>
          <Button className="w-full h-10 bg-white text-indigo-600 hover:bg-indigo-50 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl transition-transform active:scale-95">
            Сформировать стратегию FW26
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-slate-100 shadow-sm bg-white overflow-hidden">
        <CardHeader className="p-3 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shadow-inner">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-900">Интеграция с банком</CardTitle>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Партнер: Alfa Bank Business</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Статус синхронизации</span>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase text-emerald-600">Активна: 10 мин назад</span>
            </div>
          </div>
          <div className="space-y-4">
            {mockBankAccounts.map(account => (
              <div key={account.id} className="flex items-center justify-between p-3 rounded-[1.5rem] bg-slate-50 border border-slate-100 group hover:border-indigo-200 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm group-hover:text-indigo-600 transition-colors">
                    {account.icon}
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase">{account.name}</span>
                </div>
                <span className="text-sm font-black text-slate-900 tabular-nums">{account.balance.toLocaleString('ru-RU')} ₽</span>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 gap-3 transition-all">
            Управление счетами <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

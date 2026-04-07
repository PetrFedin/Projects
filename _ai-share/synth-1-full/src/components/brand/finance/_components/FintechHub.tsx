"use client";

import { CreditCard, ShieldCheck, Scale, History, ArrowUpRight, Zap, Lock, DollarSign, Globe, FileText, TrendingUp, AlertOctagon, CheckCircle2, PlayCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function FintechHub() {
  const escrowTransactions = [
    { id: "TX-9021", partner: "Guangzhou Factory #4", amount: 1250000, status: "Locked", stage: "Production" },
    { id: "TX-8842", partner: "Milan Leather Hub", amount: 450000, status: "Released", stage: "Quality Control OK" },
    { id: "TX-9105", partner: "Istanbul Denim Corp", amount: 890000, status: "Locked", stage: "Material Sourcing" },
  ];

  const activeClaims = [
    { id: "CLM-442", store: "Stockmann Helsinki", reason: "Ткань: зацепки", status: "AI Analyzing", timer: "42s" },
    { id: "CLM-441", store: "Selfridges London", reason: "Фурнитура: брак", status: "Resolved", result: "Refund Approved" },
  ];

  const customsDocs = [
    { country: "USA", duty: "12%", tax: "0%", status: "Ready", form: "7501" },
    { country: "EU (Germany)", duty: "0%", tax: "19%", status: "Auto-Pay", form: "T1" },
    { country: "UK", duty: "4.5%", tax: "20%", status: "Audit required", form: "C88" },
  ];

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Section: Escrow & Credit Limit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="rounded-xl border-none shadow-xl bg-indigo-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp className="h-32 w-32" />
          </div>
          <CardHeader className="p-4 pb-0">
            <div className="flex justify-between items-start">
              <Badge className="w-fit bg-white/20 text-white border-none mb-2 font-black uppercase text-[9px] tracking-widest">
                Syntha Wallet & Yield
              </Badge>
              <Badge className="bg-emerald-400 text-indigo-900 border-none text-[9px] font-black uppercase">Yield: 4.2% APY</Badge>
            </div>
            <CardTitle className="text-base font-black uppercase tracking-tighter">Available Balance</CardTitle>
            <CardDescription className="text-indigo-100 font-medium">Ваш оборотный капитал с функцией авто-кешбэка.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-6">
            <div className="space-y-6">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-black tabular-nums">4,820,000</span>
                <span className="text-sm font-bold opacity-60">₽</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Заморожено (Escrow)</p>
                  <p className="text-base font-bold mt-1">2,140,000 ₽</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Бонусы за период</p>
                  <p className="text-base font-bold mt-1 text-emerald-300">+12,400 ₽</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button className="flex-1 bg-white text-indigo-600 hover:bg-indigo-50 font-black uppercase text-[10px] h-12 rounded-xl shadow-lg">
                  Вывести средства
                </Button>
                <Button className="flex-1 bg-indigo-500 text-white hover:bg-indigo-400 font-black uppercase text-[10px] h-12 rounded-xl border border-indigo-400">
                  Пополнить
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-slate-100 shadow-xl bg-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-indigo-600">
            <CreditCard className="h-32 w-32" />
          </div>
          <CardHeader className="p-4 pb-0">
            <Badge variant="outline" className="w-fit border-indigo-100 text-indigo-600 mb-2 font-black uppercase text-[9px] tracking-widest">
              B2B Credit & Factoring
            </Badge>
            <CardTitle className="text-base font-black uppercase tracking-tighter text-slate-900">Credit Limit</CardTitle>
            <CardDescription className="text-slate-500 font-medium">Доступный лимит на закупку сырья и оплату мощностей.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-6 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-black tabular-nums text-slate-900">3,500,000</span>
                  <span className="text-sm font-bold text-slate-400">₽</span>
                </div>
                <span className="text-[10px] font-black text-emerald-600 uppercase">Score: 840/1000</span>
              </div>
              <Progress value={65} className="h-2 bg-slate-100" />
              <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
                <span>Использовано: 1,250,000 ₽</span>
                <span>Доступно: 2,250,000 ₽</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center gap-3">
              <Zap className="h-8 w-8 text-indigo-600 fill-current" />
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase text-indigo-900">Спецпредложение</p>
                <p className="text-[11px] text-indigo-700 font-medium leading-tight">Увеличьте лимит до 5.0M ₽, подтвердив контракт с новым ритейлером.</p>
              </div>
              <Button size="sm" className="bg-indigo-600 text-white font-bold uppercase text-[9px]">Подать заявку</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Section: Smart Claims & Logistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="md:col-span-2 rounded-xl border-slate-100 shadow-sm bg-white overflow-hidden">
          <CardHeader className="p-4 pb-4 flex flex-row items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <AlertOctagon className="h-4 w-4 text-rose-500" />
                <Badge variant="outline" className="text-rose-500 border-rose-100 text-[8px] font-black uppercase">AI Smart Claims</Badge>
              </div>
              <CardTitle className="text-base font-black uppercase tracking-tight">Активные претензии</CardTitle>
            </div>
            <Button variant="outline" size="sm" className="text-[9px] font-black uppercase rounded-xl">Новый спор</Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              {activeClaims.map((claim) => (
                <div key={claim.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center",
                      claim.status === "Resolved" ? "bg-emerald-50 text-emerald-600" : "bg-indigo-50 text-indigo-600"
                    )}>
                      {claim.status === "Resolved" ? <CheckCircle2 className="h-5 w-5" /> : <PlayCircle className="h-5 w-5 animate-pulse" />}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{claim.id} • {claim.store}</p>
                      <p className="text-sm font-bold text-slate-900">{claim.reason}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {claim.status === "Resolved" ? (
                      <Badge className="bg-emerald-500 text-white border-none text-[9px] font-black uppercase">{claim.result}</Badge>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-indigo-600 uppercase">AI Analyzing... {claim.timer}</span>
                        <Progress value={65} className="w-12 h-1 bg-indigo-100" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-none shadow-sm bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Globe className="h-24 w-24" />
          </div>
          <CardHeader className="p-4 pb-4">
            <Badge className="w-fit bg-indigo-500 text-white border-none mb-2 font-black uppercase text-[8px] tracking-widest">
              Logistics & Customs
            </Badge>
            <CardTitle className="text-base font-black uppercase tracking-tight">Global Gateway</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-6">
            <div className="space-y-4">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[9px] font-black text-indigo-400 uppercase mb-2">Customs & Tax Hub</p>
                <div className="space-y-2">
                  {customsDocs.map((c, i) => (
                    <div key={i} className="flex justify-between items-center text-[10px]">
                      <span className="font-bold">{c.country}</span>
                      <div className="flex gap-2 font-black tabular-nums">
                        <span className="text-white/40">{c.duty} duty</span>
                        <span className="text-emerald-400">{c.tax} tax</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/10">
                <div>
                  <p className="text-[9px] font-black text-white/40 uppercase">Best Rate</p>
                  <p className="text-sm font-bold">DHL Express</p>
                </div>
                <p className="text-emerald-400 font-bold text-xs">-12% cost</p>
              </div>
            </div>
            <Button className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-black uppercase text-[9px] h-10 rounded-xl">
              Оптимизировать экспорт
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="rounded-xl border-slate-100 shadow-sm bg-white overflow-hidden">
        <CardHeader className="p-4 pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-black uppercase tracking-tight">Recent Transactions</CardTitle>
            <CardDescription className="text-[11px] font-medium">Последние операции в системе безопасных расчетов.</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase gap-2">
            Вся история <History className="h-3 w-3" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-t border-slate-50">
              <thead className="bg-slate-50/50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                <tr>
                  <th className="px-8 py-4">ID / Транзакция</th>
                  <th className="px-8 py-4">Контрагент</th>
                  <th className="px-8 py-4">Сумма</th>
                  <th className="px-8 py-4">Этап проекта</th>
                  <th className="px-8 py-4">Статус</th>
                  <th className="px-8 py-4 text-right">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {escrowTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5 font-bold text-slate-900">{tx.id}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100" />
                        <span className="font-semibold text-slate-600">{tx.partner}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-black text-slate-900">{tx.amount.toLocaleString('ru-RU')} ₽</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="text-[11px] font-bold text-slate-500 uppercase">{tx.stage}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <Badge variant="outline" className={tx.status === "Locked" ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"}>
                        {tx.status}
                      </Badge>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <Button variant="ghost" size="icon" className="rounded-full hover:bg-white border-none">
                        <FileText className="h-4 w-4 text-slate-400 group-hover:text-indigo-600" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

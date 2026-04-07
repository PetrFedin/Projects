'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { FinancialHub } from "@/components/brand/finance/FinancialHub";
import BudgetControl from "@/components/brand/finance/BudgetControl";
import { FactoringAutomation } from "@/components/brand/FactoringAutomation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Landmark, Wallet, BarChart3, TrendingUp, PiggyBank, Calculator, Shield, Scale, ShieldCheck, Banknote, Clock, Gavel, Activity, Hammer } from 'lucide-react';
import { Button } from "@/components/ui/button";
import BudgetVsActual from "@/components/brand/finance/BudgetVsActual";
import { getFinanceLinks } from "@/lib/data/entity-links";
import { RelatedModulesBlock } from "@/components/brand/RelatedModulesBlock";

const EscrowPageContent = dynamic(() => import('@/app/brand/finance/escrow/page'), { ssr: false });
const LandedCostPageContent = dynamic(() => import('@/app/brand/finance/landed-cost/page'), { ssr: false });
const EmbeddedPaymentContent = dynamic(() => import('@/app/brand/finance/embedded-payment/page').then(m => m.default), { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> });
const RfTermsContent = dynamic(() => import('@/app/brand/finance/rf-terms/page').then(m => m.default), { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> });
const AuctionsContent = dynamic(() => import('@/app/brand/auctions/page').then(m => m.default), { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> });
const EscrowLiveContent = dynamic(() => import('@/app/brand/finance/escrow-live/page').then(m => m.default), { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> });
const DemandAuctionsContent = dynamic(() => import('@/app/brand/finance/demand-auctions/page').then(m => m.default), { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> });

const financeTabTriggerClass =
  'text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5';

export default function BrandFinancePage() {
    const [tab, setTab] = useState('factoring');
    return (
        <div className="container mx-auto px-4 py-4 space-y-4 max-w-5xl pb-24 animate-in fade-in duration-700">
            {/* Control Panel: Executive Style */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" /> Ликвидность: OK
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
                    <Button variant="ghost" className="h-7 px-3 rounded-lg text-[9px] font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-600 hover:bg-white hover:shadow-sm transition-all">
                        Сверить счета
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 px-3 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-white border-slate-200 text-slate-600 shadow-sm hover:border-indigo-200 transition-all">
                        Экспорт P&L
                    </Button>
                </div>
            </div>

            <Tabs value={tab} onValueChange={setTab} className="space-y-4">
                <TabsList className="bg-slate-100/80 border border-slate-200 h-9 px-1 gap-0.5 flex-wrap">
                    <TabsTrigger value="factoring" className={financeTabTriggerClass}>
                        <Landmark className="h-3 w-3 shrink-0" /> Факторинг
                    </TabsTrigger>
                    <TabsTrigger value="hub" className={financeTabTriggerClass}>
                        <Wallet className="h-3 w-3 shrink-0" /> Баланс
                    </TabsTrigger>
                    <TabsTrigger value="budget" className={financeTabTriggerClass}>
                        <PiggyBank className="h-3 w-3 shrink-0" /> Лимиты
                    </TabsTrigger>
                    <TabsTrigger value="budgetVsActual" className={financeTabTriggerClass}>
                        <Scale className="h-3 w-3 shrink-0" /> План vs Факт
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className={financeTabTriggerClass}>
                        <TrendingUp className="h-3 w-3 shrink-0" /> Анализ
                    </TabsTrigger>
                    <TabsTrigger value="escrow" className={financeTabTriggerClass}>
                        <ShieldCheck className="h-3 w-3 shrink-0" /> Эскроу
                    </TabsTrigger>
                    <TabsTrigger value="escrow-live" className={financeTabTriggerClass}>
                        <Activity className="h-3 w-3 shrink-0" /> LIVE: Эскроу
                    </TabsTrigger>
                    <TabsTrigger value="demand-auctions" className={financeTabTriggerClass}>
                        <Hammer className="h-3 w-3 shrink-0" /> Аукционы потребностей
                    </TabsTrigger>
                    <TabsTrigger value="landedCost" className={financeTabTriggerClass}>
                        <Calculator className="h-3 w-3 shrink-0" /> Себестоимость
                    </TabsTrigger>
                    <TabsTrigger value="embedded-payment" className={financeTabTriggerClass}>
                        <Banknote className="h-3 w-3 shrink-0" /> Оплата
                    </TabsTrigger>
                    <TabsTrigger value="rf-terms" className={financeTabTriggerClass}>
                        <Clock className="h-3 w-3 shrink-0" /> Отсрочка НДС
                    </TabsTrigger>
                    <TabsTrigger value="auctions" className={financeTabTriggerClass}>
                        <Gavel className="h-3 w-3 shrink-0" /> Аукционы
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="factoring" className="mt-0">
                    <FactoringAutomation />
                </TabsContent>

                <TabsContent value="hub" className="mt-0">
                    <div className="max-w-5xl mx-auto">
                        <FinancialHub />
                    </div>
                </TabsContent>

                <TabsContent value="budget" className="mt-0">
                    <BudgetControl brandId="BRAND-XYZ" />
                </TabsContent>

                <TabsContent value="budgetVsActual" className="mt-0">
                    <BudgetVsActual brandId="BRAND-XYZ" embedded />
                </TabsContent>

                <TabsContent value="analytics" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'P&L за месяц', value: '2.4M ₽', delta: '+12%', color: 'text-emerald-600' },
                            { label: 'Cash Flow', value: '1.8M ₽', delta: 'стабильно', color: 'text-slate-900' },
                            { label: 'Доля B2B', value: '68%', delta: '+3%', color: 'text-indigo-600' },
                            { label: 'Средний чек PO', value: '420K ₽', delta: '-2%', color: 'text-slate-600' },
                        ].map((m, i) => (
                            <Card key={i} className="p-4 border border-slate-100 rounded-xl">
                                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{m.label}</p>
                                <p className={`text-xl font-black ${m.color} mt-1`}>{m.value}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5">{m.delta}</p>
                            </Card>
                        ))}
                        <Card className="md:col-span-2 p-4 border border-slate-100 rounded-xl">
                            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-3">Динамика выручки</p>
                            <div className="flex items-end gap-1 h-24">
                                {[65, 72, 58, 81, 75, 88].map((h, i) => (
                                    <div key={i} className="flex-1 bg-indigo-100 rounded-t min-h-[20px]" style={{ height: `${h}%` }} />
                                ))}
                            </div>
                            <p className="text-[9px] text-slate-400 mt-2">Последние 6 месяцев</p>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="escrow" className="mt-0">
                    {tab === 'escrow' && <EscrowPageContent />}
                </TabsContent>

                <TabsContent value="escrow-live" className="mt-0">
                    {tab === 'escrow-live' && <EscrowLiveContent />}
                </TabsContent>

                <TabsContent value="demand-auctions" className="mt-0">
                    {tab === 'demand-auctions' && <DemandAuctionsContent />}
                </TabsContent>

                <TabsContent value="landedCost" className="mt-0">
                    {tab === 'landedCost' && <LandedCostPageContent />}
                </TabsContent>

                <TabsContent value="embedded-payment" className="mt-0">
                    {tab === 'embedded-payment' && <EmbeddedPaymentContent />}
                </TabsContent>

                <TabsContent value="rf-terms" className="mt-0">
                    {tab === 'rf-terms' && <RfTermsContent />}
                </TabsContent>

                <TabsContent value="auctions" className="mt-0">
                    {tab === 'auctions' && <AuctionsContent />}
                </TabsContent>
            </Tabs>

            <RelatedModulesBlock links={getFinanceLinks()} className="mt-6" />
        </div>
    );
}

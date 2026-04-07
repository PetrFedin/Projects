'use client';

import React, { useState } from 'react';
import { 
    Landmark, DollarSign, Zap, ShieldCheck, 
    ArrowUpRight, FileText, CheckCircle2, 
    RefreshCw, Clock, Wallet, BarChart3,
    Handshake, Scale, AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { fmtMoney } from '@/lib/format';

const MOCK_FACTORING_INVOICES = [
    { id: 'inv-0012', retailer: 'Podium', amount: 2400000, status: 'Eligible', rate: '1.2%', advance: '80%' },
    { id: 'inv-0015', retailer: 'ЦУМ', amount: 1200000, status: 'Funded', rate: '1.1%', advance: '90%' },
    { id: 'inv-0018', retailer: 'Boutique No.7', amount: 3100000, status: 'Under Review', rate: '1.5%', advance: '75%' },
];

export function FactoringAutomation() {
    return (
        <div className="space-y-4 pb-24 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row justify-between md:items-end gap-3 border-b border-slate-100 pb-3">
                <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                        <div className="p-1.5 bg-emerald-600 rounded-lg text-white shadow-lg shadow-emerald-100/50">
                            <Landmark className="h-4 w-4" />
                        </div>
                        <h1 className="text-base font-bold font-headline tracking-tighter uppercase text-slate-900 leading-none">Автоматический Факторинг</h1>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Автоматическое финансирование дебиторской задолженности.</p>
                </div>
                <div className="flex gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
                    <Button variant="ghost" className="h-7 px-3 bg-white text-slate-600 rounded-lg font-bold uppercase text-[9px] tracking-widest shadow-sm border border-slate-200 transition-all hover:text-indigo-600">
                        <Scale className="mr-1.5 h-3 w-3" /> Лимиты
                    </Button>
                    <Button className="bg-emerald-600 text-white rounded-lg h-7 px-4 font-bold uppercase text-[9px] tracking-widest shadow-md hover:bg-emerald-700 transition-all">
                        <Zap className="mr-1.5 h-3 w-3 fill-white" /> Финансировать все
                    </Button>
                </div>
            </header>

            {/* Financial Health Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Card className="rounded-xl border border-slate-100 shadow-sm bg-white p-4 space-y-3.5 hover:border-emerald-100 transition-all group">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 border border-emerald-100 shadow-inner group-hover:scale-105 transition-transform">
                            <Wallet className="h-4 w-4" />
                        </div>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold text-[7px] uppercase px-1.5 h-4 tracking-widest shadow-sm">ДОСТУПНО</Badge>
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-[9px] font-bold uppercase text-slate-400 tracking-[0.15em] leading-none">Кредитный лимит</p>
                        <p className="text-sm font-bold tracking-tighter text-slate-900 uppercase leading-none">45,000,000 ₽</p>
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest leading-none">
                            <span className="text-slate-400">Использовано</span>
                            <span className="text-emerald-600">12%</span>
                        </div>
                        <Progress value={12} className="h-1 bg-emerald-50 border border-emerald-100/30" />
                    </div>
                </Card>

                <Card className="rounded-xl border border-slate-100 shadow-sm bg-white p-4 space-y-3.5 hover:border-indigo-100 transition-all group">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 border border-indigo-100 shadow-inner group-hover:scale-105 transition-transform">
                            <BarChart3 className="h-4 w-4" />
                        </div>
                        <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-100 font-bold text-[7px] uppercase px-1.5 h-4 tracking-widest shadow-sm">SPEED</Badge>
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-[9px] font-bold uppercase text-slate-400 tracking-[0.15em] leading-none">Ср. время выплаты</p>
                        <p className="text-sm font-bold tracking-tighter text-slate-900 uppercase leading-none">4.2 <span className="text-xs text-slate-400">часа</span></p>
                    </div>
                    <p className="text-[8px] font-bold text-slate-400 leading-tight uppercase tracking-tight opacity-60">Скорость получения средств на счет после отгрузки.</p>
                </Card>

                <Card className="rounded-xl border-none shadow-xl shadow-indigo-100/30 bg-slate-900 text-white p-4 space-y-3.5 overflow-hidden relative group hover:bg-slate-800 transition-colors">
                    <Handshake className="absolute -right-6 -top-4 h-24 w-24 text-emerald-500 opacity-10 group-hover:scale-110 transition-transform duration-700" />
                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-emerald-400" />
                            <h3 className="text-[10px] font-bold uppercase tracking-widest">Активные партнеры</h3>
                        </div>
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-8 w-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[8px] font-bold text-slate-400 shadow-lg transition-transform hover:-translate-y-1">B{i}</div>
                            ))}
                            <div className="h-8 w-8 rounded-full border-2 border-slate-900 bg-indigo-600 flex items-center justify-center text-[8px] font-bold text-white shadow-lg">+4</div>
                        </div>
                        <p className="text-[8px] font-bold text-slate-400 leading-tight uppercase tracking-tight opacity-80">Инвойсы доступны для выкупа 7 банками Syntha.</p>
                    </div>
                </Card>
            </div>

            {/* Invoices List */}
            <Card className="rounded-xl border border-slate-100 shadow-sm bg-white overflow-hidden hover:border-indigo-100/50 transition-all">
                <CardHeader className="bg-slate-50/50 p-4 border-b border-slate-100 flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                        <CardTitle className="text-[11px] font-bold uppercase tracking-widest text-slate-700 flex items-center gap-2">
                            <FileText className="h-3.5 w-3.5 text-indigo-600" /> Дебиторская задолженность
                        </CardTitle>
                        <CardDescription className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Инвойсы для мгновенного финансирования</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 px-2.5 rounded-lg text-[8px] font-bold uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 transition-all">Архив</Button>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-50">
                        {MOCK_FACTORING_INVOICES.map((inv) => (
                            <div key={inv.id} className="p-4 flex items-center justify-between group hover:bg-slate-50/50 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-400 shadow-inner group-hover:scale-105 transition-transform">#{inv.id.split('-')[1]}</div>
                                    <div>
                                        <p className="text-[11px] font-bold uppercase text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors leading-none">{inv.retailer}</p>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <Badge variant="outline" className={cn(
                                                "text-[7px] font-bold uppercase px-1.5 h-3.5 border shadow-sm transition-all tracking-widest",
                                                inv.status === 'Funded' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                                                inv.status === 'Eligible' ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-amber-50 text-amber-600 border-amber-100"
                                            )}>{inv.status === 'Funded' ? 'Выплачено' : inv.status === 'Eligible' ? 'Доступно' : 'На проверке'}</Badge>
                                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest opacity-60">Ставка: {inv.rate}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 leading-none">Сумма инвойса</p>
                                        <p className="text-[13px] font-bold text-slate-900 tabular-nums uppercase leading-none">{fmtMoney(inv.amount)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 leading-none">Макс. аванс</p>
                                        <p className="text-[13px] font-bold text-emerald-600 tabular-nums uppercase leading-none">{fmtMoney(inv.amount * parseFloat(inv.advance) / 100)}</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {inv.status === 'Eligible' ? (
                                            <Button className="h-8 px-4 bg-slate-900 text-white rounded-lg font-bold uppercase text-[9px] tracking-widest shadow-md hover:bg-indigo-600 transition-all">Получить аванс</Button>
                                        ) : inv.status === 'Funded' ? (
                                            <Button variant="outline" disabled className="h-8 px-4 border-emerald-100 bg-emerald-50 text-emerald-600 rounded-lg font-bold uppercase text-[9px] tracking-widest opacity-100 shadow-sm">
                                                <CheckCircle2 className="mr-1.5 h-3 w-3" /> Выплачено
                                            </Button>
                                        ) : (
                                            <Button variant="outline" className="h-8 px-4 border-slate-200 text-slate-400 rounded-lg font-bold uppercase text-[9px] tracking-widest hover:bg-slate-50 transition-all">Статус</Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="bg-slate-50/30 p-4 border-t border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-rose-600">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <p className="text-[9px] font-bold uppercase tracking-widest opacity-80">2 инвойса требуют уточнения данных для выплаты.</p>
                    </div>
                    <Button variant="ghost" className="h-7 rounded-lg text-[8px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-all">Справка <ArrowUpRight className="ml-1 h-2.5 w-2.5" /></Button>
                </CardFooter>
            </Card>
        </div>
    );
}

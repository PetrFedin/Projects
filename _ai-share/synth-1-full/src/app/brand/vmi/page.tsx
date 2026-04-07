'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
    Warehouse, Factory, Box, Layers, Zap, 
    TrendingUp, TrendingDown, History, Search,
    Filter, Download, Plus, CheckCircle2, AlertTriangle,
    ShieldCheck, Ruler, Palette, Thermometer, Calendar, ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { fmtNumber } from '@/lib/format';

const MOCK_MATERIALS = [
    { id: 'm1', name: 'Cyber-Silk 2.0 (Black)', category: 'Fabrics', stock: 1200, unit: 'm', factory: 'SilkRoad Textiles', health: 94, status: 'Optimal' },
    { id: 'm2', name: 'Nano-Nylon 400D', category: 'Fabrics', stock: 450, unit: 'm', factory: 'TechWeave Italia', health: 42, status: 'Low Stock' },
    { id: 'm3', name: 'Titanium Zippers (15cm)', category: 'Trims', stock: 5000, unit: 'pcs', factory: 'Precision Trims Ltd', health: 100, status: 'Excess' },
];

const MOCK_CAPACITY = [
    { factory: 'Milan Atelier', line: 'Outerwear Line A', booked: 85, month: 'March 2026' },
    { factory: 'Milan Atelier', line: 'Accessories B', booked: 40, month: 'March 2026' },
    { factory: 'Istanbul Hub', line: 'Knitwear Line 1', booked: 92, month: 'April 2026' },
];

export default function VMIPortalPage() {
    return (
        <div className="space-y-4 pb-20">
            <SectionInfoCard
                title="VMI (Vendor Managed Inventory)"
                description="Контроль сырья на фабриках и планирование мощностей. Связь с Production (загрузка линий, PO), Warehouse (материалы) и B2B (объёмы заказов)."
                icon={Warehouse}
                iconBg="bg-indigo-100"
                iconColor="text-indigo-600"
                badges={<><Badge variant="outline" className="text-[9px]">Materials</Badge><Button variant="outline" size="sm" className="text-[9px] h-7 ml-1" asChild><Link href="/brand/products">Products</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/materials">Materials</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/production">Production</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/warehouse">Warehouse</Link></Button></>}
            />
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-600 rounded-2xl">
                            <Warehouse className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-base font-black uppercase tracking-tighter text-slate-900">Production VMI Portal</h1>
                    </div>
                    <p className="text-slate-500 font-medium italic">Vendor Managed Inventory: Контроль сырья на фабриках и планирование мощностей.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-2xl border-slate-200 h-12 px-6 font-black uppercase text-[10px] tracking-widest">
                        <History className="mr-2 h-4 w-4" /> Лог поставок
                    </Button>
                    <Button className="bg-slate-900 text-white rounded-2xl h-12 px-8 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200">
                        <Plus className="mr-2 h-4 w-4" /> Забронировать линию
                    </Button>
                </div>
            </header>

            {/* VMI Intelligence Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                {/* Materials Inventory */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-xl border-none shadow-sm bg-white overflow-hidden">
                        <CardHeader className="bg-slate-50 p-4 border-b border-slate-100 flex flex-row items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                    <Layers className="h-4 w-4" /> Raw Materials Stock
                                </CardTitle>
                                <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Остатки материалов на складах партнеров</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                    <Input placeholder="Search materials..." className="h-9 w-48 pl-9 rounded-xl border-slate-200 text-[10px] font-bold" />
                                </div>
                                <Button variant="ghost" size="icon" className="h-9 w-9 border border-slate-200 rounded-xl"><Filter className="h-4 w-4 text-slate-400" /></Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-50">
                                {MOCK_MATERIALS.map((m) => (
                                    <div key={m.id} className="p-4 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm",
                                                m.category === 'Fabrics' ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"
                                            )}>
                                                {m.category === 'Fabrics' ? <Ruler className="h-6 w-6" /> : <Palette className="h-6 w-6" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black uppercase text-slate-900 tracking-tight">{m.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    <Factory className="h-3 w-3" /> {m.factory}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Stock</p>
                                                <p className="text-sm font-black text-slate-900 tabular-nums">{fmtNumber(m.stock)} <span className="text-xs text-slate-400">{m.unit}</span></p>
                                            </div>
                                            <div className="w-32 space-y-2">
                                                <div className="flex justify-between items-center text-[8px] font-black uppercase">
                                                    <span className={cn(
                                                        m.status === 'Optimal' ? "text-emerald-600" :
                                                        m.status === 'Low Stock' ? "text-rose-600" : "text-amber-600"
                                                    )}>{m.status}</span>
                                                    <span className="text-slate-400">{m.health}%</span>
                                                </div>
                                                <Progress value={m.health} className={cn(
                                                    "h-1",
                                                    m.health > 80 ? "bg-emerald-100" : m.health < 50 ? "bg-rose-100" : "bg-amber-100"
                                                )} />
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRight className="h-4 w-4 text-slate-400" /></Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="bg-slate-50/50 p-4 border-t border-slate-100 flex justify-between items-center">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic leading-relaxed">
                                *Данные обновлены 12 минут назад через IoT-датчики складов.
                            </p>
                            <Button variant="ghost" className="text-[9px] font-black uppercase text-indigo-600 hover:bg-indigo-50">Заказать поставку сырья <Plus className="ml-2 h-3 w-3" /></Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* Production Capacity & Booking */}
                <aside className="space-y-4">
                    <Card className="rounded-xl border-none shadow-xl bg-slate-900 text-white p-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Zap className="h-32 w-32 text-indigo-400" />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <header className="space-y-2">
                                <Badge className="bg-indigo-500 text-white border-none font-black text-[8px] uppercase px-3 py-1">Capacity Live View</Badge>
                                <h3 className="text-sm font-black uppercase tracking-tight leading-none italic">Factory Booking <br /> Status</h3>
                            </header>

                            <div className="space-y-6">
                                {MOCK_CAPACITY.map((c, i) => (
                                    <div key={i} className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{c.factory}</p>
                                                <p className="text-xs font-bold uppercase">{c.line}</p>
                                            </div>
                                            <span className="text-xs font-black text-white">{c.booked}% Booked</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                            <div className={cn(
                                                "h-full transition-all duration-1000",
                                                c.booked > 90 ? "bg-rose-500" : "bg-indigo-500"
                                            )} style={{ width: `${c.booked}%` }} />
                                        </div>
                                        <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">{c.month}</p>
                                    </div>
                                ))}
                            </div>

                            <Button className="w-full h-10 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-400 hover:text-white transition-all shadow-2xl">
                                Планировать квоту <Calendar className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </Card>

                    <Card className="rounded-xl border-none shadow-sm bg-white p-4 space-y-6">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="h-5 w-5 text-emerald-600" />
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">VMI Health Audit</h3>
                        </div>
                        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
                            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                                <TrendingUp className="h-5 w-5 text-emerald-600" />
                            </div>
                            <p className="text-[10px] font-bold text-emerald-900 uppercase leading-tight">Сырьевая безопасность: В норме. Хватит на 4.5 месяца производства.</p>
                        </div>
                        <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-center gap-3">
                            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                                <AlertTriangle className="h-5 w-5 text-rose-600" />
                            </div>
                            <p className="text-[10px] font-bold text-rose-900 uppercase leading-tight">Прогноз: Дефицит Nano-Nylon к Маю 2026. Рекомендуется предзаказ.</p>
                        </div>
                    </Card>
                </aside>
            </div>
        </div>
    );
}

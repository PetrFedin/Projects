'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Layers, ShoppingBag, Truck, RefreshCcw, 
    TrendingUp, ShieldCheck, Factory, Store,
    ArrowUpRight, BarChart3, Users, Settings,
    CheckCircle2, AlertCircle, Info, Zap, Globe, 
    Box, FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
    Tooltip as RechartsTooltip, CartesianGrid, Cell,
    AreaChart, Area
} from 'recharts';
import Image from 'next/image';
import { products as allProducts } from '@/lib/products';

const SHARED_STOCK_DATA = [
    { name: 'Stockmann', brand: 450, store: 120, target: 600 },
    { name: 'Tsvetnoy', brand: 300, store: 80, target: 450 },
    { name: 'DLT', brand: 600, store: 210, target: 900 },
    { name: 'KM20', brand: 150, store: 45, target: 200 },
];

export default function VMIPortal() {
    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
                <div className="space-y-4">
                    <Badge className="bg-slate-900 text-white border-none px-3 py-1 font-black uppercase tracking-widest text-[10px]">
                        Brand-Retailer Collaboration
                    </Badge>
                    <h1 className="text-sm font-black uppercase tracking-tighter text-slate-900 leading-none">
                        VMI <span className="text-indigo-600 italic">Collaborative</span> Portal
                    </h1>
                    <p className="text-slate-500 font-medium max-w-2xl text-sm">
                        Vendor Managed Inventory: бренд берет на себя управление остатками в точках продаж ритейлера для минимизации out-of-stock.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl border-slate-200 h-12 px-6 font-black uppercase tracking-widest text-[10px]">
                        <Settings className="mr-2 h-4 w-4" /> VMI Policies
                    </Button>
                    <Button className="rounded-xl h-12 px-8 bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-slate-200 hover:bg-indigo-600 transition-all">
                        Sync Global Stock
                    </Button>
                </div>
            </header>

            <div className="grid lg:grid-cols-12 gap-3">
                {/* Main Shared Stock View */}
                <div className="lg:col-span-8 space-y-4">
                    <Card className="rounded-xl border-none shadow-xl bg-white p-4">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3">
                                <Layers className="h-6 w-6 text-indigo-600" />
                                <h3 className="text-base font-black uppercase tracking-tight italic">Shared Inventory (Retailer Points)</h3>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-slate-200" />
                                    <span className="text-[9px] font-black uppercase text-slate-400">Brand Hub Stock</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-indigo-600" />
                                    <span className="text-[9px] font-black uppercase text-slate-400">In-Store Stock</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={SHARED_STOCK_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} dy={10} />
                                    <YAxis hide />
                                    <RechartsTooltip />
                                    <Bar dataKey="brand" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="store" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <div className="space-y-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 px-2 flex items-center gap-2">
                            <Zap className="h-4 w-4 text-amber-500" /> VMI Auto-Replenishment SKU
                        </h3>
                        <div className="grid md:grid-cols-2 gap-3">
                            {allProducts.slice(0, 4).map(item => (
                                <Card key={item.id} className="rounded-xl border-none shadow-lg bg-white p-4 flex items-center gap-3 group hover:shadow-xl transition-all">
                                    <div className="h-20 w-12 rounded-xl overflow-hidden relative shrink-0">
                                        <Image src={item.images[0].url} alt={item.name} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[8px] font-black uppercase text-slate-400 mb-0.5">{item.brand}</p>
                                        <h4 className="text-xs font-black uppercase tracking-tight truncate leading-none mb-1.5">{item.name}</h4>
                                        <div className="flex items-center gap-2">
                                            <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-black uppercase px-2 py-0.5">Auto-Refill: ON</Badge>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[8px] font-black text-slate-400 uppercase mb-0.5">Threshold</p>
                                        <p className="text-sm font-black text-slate-900">15 ед.</p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Collaboration & Policies */}
                <div className="lg:col-span-4 space-y-4">
                    <Card className="rounded-xl border-none shadow-xl bg-slate-900 text-white p-4 relative overflow-hidden group">
                        <Users className="absolute -right-4 -top-4 h-32 w-32 text-indigo-500 opacity-10 group-hover:scale-110 transition-transform duration-700" />
                        <div className="relative z-10 space-y-4">
                            <header className="space-y-2">
                                <Badge className="bg-indigo-500 text-white border-none font-black text-[8px] uppercase px-2 py-0.5">Global Partnership</Badge>
                                <h3 className="text-sm font-black uppercase tracking-tight leading-none italic">Active Retailer <br /> Connections</h3>
                            </header>

                            <div className="space-y-4">
                                {[
                                    { name: 'Stockmann', share: '45%', status: 'Balanced' },
                                    { name: 'Tsvetnoy', share: '30%', status: 'Low Stock' },
                                    { name: 'DLT (Mercury)', share: '25%', status: 'Optimal' }
                                ].map((p, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-tight">{p.name}</p>
                                            <p className="text-[8px] font-black text-slate-500 uppercase">Portfolio Share: {p.share}</p>
                                        </div>
                                        <div className={cn(
                                            "text-[8px] font-black uppercase px-2 py-1 rounded-md",
                                            p.status === 'Low Stock' ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400"
                                        )}>
                                            {p.status}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button className="w-full h-10 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-400 hover:text-white transition-all shadow-xl shadow-black/20">
                                Connect New Retailer <ArrowUpRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </Card>

                    <Card className="rounded-xl border-none shadow-xl bg-white p-4 space-y-6">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="h-5 w-5 text-indigo-600" />
                            <h3 className="text-sm font-black uppercase tracking-widest">VMI Service Level (SLA)</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-slate-400">Inventory Turnover</span>
                                    <span>8.2x / yr</span>
                                </div>
                                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                    <div className="h-full w-[82%] bg-indigo-600 rounded-full" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <p className="text-[8px] font-black uppercase text-slate-400 mb-1">Stock Accuracy</p>
                                    <p className="text-sm font-black text-slate-900">99.8%</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <p className="text-[8px] font-black uppercase text-slate-400 mb-1">Refill Speed</p>
                                    <p className="text-sm font-black text-emerald-600">24h</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-[9px] text-slate-400 font-medium italic leading-relaxed text-center pt-4 border-t border-slate-50">
                            *SLA контролируется Syntha Smart Contracts. Штрафы за out-of-stock начисляются автоматически.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
}


'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Product } from '@/lib/types';
import { products as allProducts } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { 
  Search, PlusCircle, Filter, Download, ArrowUpRight, 
  TrendingUp, AlertTriangle, Package, BarChart3, 
  ChevronRight, Bot, Sparkles, RefreshCcw, MoreHorizontal,
  Eye, Layers, Globe, Truck, Activity, Factory, Warehouse
} from 'lucide-react';
import { PromotionDialog } from '@/components/brand/promotion-dialog';
import Link from 'next/link';
import NextImage from 'next/image';
import { cn } from '@/lib/utils';
import { fmtNumber, fmtMoney } from '@/lib/format';
import { GismtMonitor } from '@/components/brand/gismt-monitor';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';

const initialInventory = allProducts.filter(p => p.brand === 'Syntha');

export default function BrandInventoryPage() {
    const [products, setProducts] = useState(initialInventory);
    const [searchQuery, setSearchQuery] = useState('');
    const [availability, setAvailability] = useState<'all' | 'in_stock' | 'pre_order' | 'out_of_stock' | 'coming_soon'>('all');
    const [promotionProduct, setPromotionProduct] = useState<Product | null>(null);
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    
    const filteredProducts = useMemo(() => {
        let tempProducts = [...products];
        if (searchQuery) {
            tempProducts = tempProducts.filter(product => 
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                product.sku.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (availability !== 'all') {
            if(availability === 'in_stock') {
                 tempProducts = tempProducts.filter(p => p.availableColors?.some(c => c.sizeAvailability?.some(s => s.status === 'in_stock' && s.quantity && s.quantity > 0)));
            } else if (availability === 'out_of_stock') {
                 tempProducts = tempProducts.filter(p => !p.availableColors?.some(c => c.sizeAvailability?.some(s => s.status === 'in_stock' && s.quantity && s.quantity > 0)));
            }
        }
        return tempProducts;
    }, [products, searchQuery, availability]);

    return (
        <div className="container mx-auto px-4 py-4 space-y-4 max-w-5xl pb-24 animate-in fade-in duration-700">
            <SectionInfoCard
                title="Inventory Matrix"
                description="Остатки по SKU, видимость в каналах. Связь с Warehouse (склад), Production (приёмки) и B2B (заказы)."
                icon={Package}
                iconBg="bg-emerald-100"
                iconColor="text-emerald-600"
                badges={<><Badge variant="outline" className="text-[9px]">Warehouse</Badge><Button variant="outline" size="sm" className="text-[9px] h-7 ml-1" asChild><Link href="/brand/products"><Package className="h-3 w-3 mr-1" /> Products</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/products/matrix"><Layers className="h-3 w-3 mr-1" /> Matrix</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/warehouse"><Warehouse className="h-3 w-3 mr-1" /> Warehouse</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/production"><Factory className="h-3 w-3 mr-1" /> Production</Link></Button></>}
            />
            {/* --- TOP STRATEGIC BAR --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 border-b border-slate-100 pb-3">
                <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                        <Link href="/brand" className="hover:text-indigo-600 transition-colors">Organization</Link>
                        <ChevronRight className="h-2 w-2" />
                        <span className="text-slate-300">Inventory</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-base font-bold font-headline tracking-tighter uppercase text-slate-900 leading-none">Inventory Matrix 2.0</h1>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold text-[7px] px-1.5 h-4 gap-1 tracking-widest shadow-sm transition-all">
                           <Activity className="w-2.5 h-2.5" /> LIVE SYNC
                        </Badge>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
                        <Button variant="ghost" className="h-7 px-3 bg-white text-slate-900 text-[9px] font-bold uppercase rounded-lg shadow-sm">Money</Button>
                        <Button variant="ghost" className="h-7 px-3 text-slate-400 text-[9px] font-bold uppercase hover:bg-white hover:text-slate-600 rounded-lg transition-all">Units</Button>
                    </div>
                    <div className="h-5 w-[1px] bg-slate-200 mx-0.5" />
                    <Button variant="outline" size="sm" className="h-7 px-2.5 rounded-lg border border-slate-200 bg-white text-[9px] font-bold uppercase gap-1.5 hover:bg-slate-50 shadow-sm text-slate-500 tracking-widest transition-all">
                        <Download className="h-3 w-3" /> CSV
                    </Button>
                    <Button asChild className="h-7 px-3 rounded-lg bg-slate-900 text-white text-[9px] font-bold uppercase gap-1.5 hover:bg-indigo-600 shadow-md tracking-widest transition-all">
                        <Link href="/brand/products/new">
                            <PlusCircle className="h-3 w-3" /> Add SKU
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                <GismtMonitor />

                {/* --- ANALYTICAL GRID --- */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                        { label: "STOCK VALUE", val: "142.5M ₽", sub: "+2.4%", trend: "up", icon: Package, bg: 'bg-indigo-50/50' },
                        { label: "SELL-THROUGH", val: "68.2%", sub: "High", trend: "up", icon: BarChart3, bg: 'bg-emerald-50/50' },
                        { label: "LOW STOCK", val: "12", sub: "Critical", trend: "down", icon: AlertTriangle, critical: true, bg: 'bg-rose-50/50' },
                        { label: "REPLENISH", val: "8.4M ₽", sub: "Suggested", trend: "up", icon: RefreshCcw, bg: 'bg-amber-50/50' },
                    ].map((m, i) => (
                        <Card key={i} className="border border-slate-100 shadow-sm bg-white p-3.5 group hover:border-indigo-100 hover:shadow-md transition-all rounded-xl relative overflow-hidden">
                            <div className="flex items-center justify-between mb-2.5">
                                <div className={cn("p-1.5 rounded-lg shadow-inner border border-slate-200/50", m.bg)}>
                                    <m.icon className={cn("h-3.5 w-3.5", m.critical ? "text-rose-500" : "text-slate-400 group-hover:text-indigo-600")} />
                                </div>
                                <Badge variant="outline" className={cn("text-[7px] font-bold uppercase px-1.5 h-3.5 border shadow-sm transition-all tracking-widest", m.trend === "up" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100")}>{m.sub}</Badge>
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] leading-none">{m.label}</span>
                                <p className="text-sm font-bold tracking-tighter text-slate-900 tabular-nums uppercase leading-none">{m.val}</p>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* --- RETAILER DEMAND SYNC --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Card className="bg-slate-50/30 border border-slate-100 p-4 rounded-xl shadow-sm hover:border-indigo-100 transition-all group">
                        <div className="flex items-center justify-between mb-3.5">
                            <div className="flex items-center gap-2.5">
                                <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600 border border-indigo-100 shadow-inner group-hover:scale-105 transition-transform"><RefreshCcw className="h-3.5 w-3.5 animate-spin-slow" /></div>
                                <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 leading-none">Retailer Inventory Sync</h2>
                            </div>
                            <Badge className="bg-rose-50 text-rose-600 border border-rose-100 text-[7px] font-bold uppercase h-4 px-1.5 tracking-widest shadow-sm">8 ALERT</Badge>
                        </div>
                        <div className="space-y-1.5">
                            {[
                                { shop: "PODIUM", item: "Graphite Parka", stock: 2, recommended: 20, status: "Critical" },
                                { shop: "ЦУМ", item: "Tech Trousers", stock: 5, recommended: 50, status: "Warning" },
                            ].map((alert, i) => (
                                <div key={i} className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between group/item hover:bg-slate-50 hover:border-indigo-100 transition-all cursor-pointer">
                                    <div>
                                        <p className="text-[8px] font-bold text-indigo-500 uppercase tracking-widest leading-none mb-1">{alert.shop}</p>
                                        <p className="text-[10px] font-bold text-slate-900 uppercase tracking-tight group-hover/item:text-indigo-600 transition-colors">{alert.item}</p>
                                    </div>
                                    <Button className="h-6.5 px-3 bg-slate-900 text-white rounded-lg text-[8px] font-bold uppercase tracking-widest hover:bg-indigo-600 shadow-md transition-all">
                                        Replenish (+{alert.recommended})
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="bg-slate-50/30 border border-slate-100 p-4 rounded-xl shadow-sm hover:border-emerald-100 transition-all group">
                        <div className="flex items-center justify-between mb-3.5">
                            <div className="flex items-center gap-2.5">
                                <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600 border border-emerald-100 shadow-inner group-hover:scale-105 transition-transform"><Truck className="h-3.5 w-3.5" /></div>
                                <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 leading-none">Dropshipping Hub</h2>
                            </div>
                            <Badge className="bg-emerald-600 text-white border-none text-[7px] font-bold uppercase h-4 px-1.5 tracking-widest shadow-sm">LIVE FEED</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-3.5">
                            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm group-hover:border-emerald-100 transition-colors">
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">Active Orders</p>
                                <p className="text-base font-bold text-slate-900 tabular-nums tracking-tighter uppercase leading-none">142</p>
                                <p className="text-[8px] text-emerald-600 font-bold uppercase mt-1.5 tracking-widest leading-none">SLA: 99.8%</p>
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm group-hover:border-emerald-100 transition-colors">
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">Revenue (24h)</p>
                                <p className="text-base font-bold text-slate-900 tabular-nums tracking-tighter uppercase leading-none">4.2M ₽</p>
                                <p className="text-[8px] text-emerald-600 font-bold uppercase mt-1.5 tracking-widest leading-none">+15% TREND</p>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full h-7 border border-slate-200 text-slate-500 bg-white rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm">
                            Manage Dropship Stock
                        </Button>
                    </Card>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-3">
                    <div className="xl:col-span-9 space-y-3">
                        {/* --- TOOLBAR --- */}
                        <div className="bg-slate-100 p-1 flex items-center justify-between rounded-xl border border-slate-200 shadow-inner">
                            <div className="flex items-center gap-1.5">
                                <div className="flex bg-white border border-slate-200 p-1 rounded-lg shadow-sm">
                                    <button 
                                        onClick={() => setViewMode('table')}
                                        className={cn("h-6.5 px-3 text-[9px] font-bold uppercase rounded-md transition-all", viewMode === 'table' ? "bg-slate-900 text-white shadow-sm" : "text-slate-400 hover:bg-slate-50")}
                                    >
                                        Table
                                    </button>
                                    <button 
                                        onClick={() => setViewMode('grid')}
                                        className={cn("h-6.5 px-3 text-[9px] font-bold uppercase rounded-md transition-all", viewMode === 'grid' ? "bg-slate-900 text-white shadow-sm" : "text-slate-400 hover:bg-slate-50")}
                                    >
                                        Grid
                                    </button>
                                </div>
                                <div className="h-4 w-[1px] bg-slate-200 mx-0.5" />
                                <div className="flex bg-white border border-slate-200 p-1 rounded-lg shadow-sm overflow-x-auto no-scrollbar max-w-[300px] md:max-w-none">
                                    {['all', 'in_stock', 'pre_order', 'out_of_stock'].map((a) => (
                                        <button 
                                            key={a}
                                            onClick={() => setAvailability(a as any)}
                                            className={cn("h-6.5 px-2.5 text-[8px] font-bold uppercase rounded-md transition-all whitespace-nowrap", availability === a ? "bg-slate-100 text-slate-900 shadow-inner" : "text-slate-400 hover:bg-slate-50")}
                                        >
                                            {a.replace('_', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                                    <Input 
                                        placeholder="Search..." 
                                        className="h-7 pl-8 w-32 md:w-44 bg-white border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-tight shadow-sm focus:ring-1 focus:ring-indigo-500" 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Button variant="ghost" size="icon" className="h-7 w-7 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-all">
                                    <Filter className="h-3 w-3 text-slate-400" />
                                </Button>
                            </div>
                        </div>

                        {/* --- INVENTORY TABLE --- */}
                        <div className="border border-slate-100 rounded-xl bg-white overflow-hidden shadow-sm hover:border-indigo-100/50 transition-all">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] sticky left-0 bg-slate-50/50 z-10 w-[35%] h-9">Product Detail</th>
                                        <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-9">SKU</th>
                                        <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-9">Category</th>
                                        <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] text-right h-9">Stock</th>
                                        <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] text-right h-9">Wholesale</th>
                                        <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] w-12 h-9"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-slate-50/50 transition-all group h-12">
                                            <td className="px-4 py-2 sticky left-0 bg-white group-hover:bg-slate-50 transition-colors z-10">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="h-8 w-8 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0 relative border border-slate-200/50 shadow-inner group-hover:scale-105 transition-transform">
                                                        <NextImage src={product.thumbnail || 'https://picsum.photos/seed/p/200'} alt="" fill className="object-cover" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{product.name}</p>
                                                        <p className="text-[8px] font-bold text-slate-400 uppercase mt-0.5 tracking-widest">{product.brand}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2">
                                                <span className="text-[10px] font-mono text-slate-400 tabular-nums uppercase tracking-tighter">{product.sku}</span>
                                            </td>
                                            <td className="px-4 py-2">
                                                <Badge variant="outline" className="bg-white text-slate-500 border-slate-200 text-[8px] font-bold px-1.5 h-4 rounded shadow-sm tracking-widest uppercase">
                                                    {product.category}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-2 text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[11px] font-bold tabular-nums text-slate-900">{fmtNumber(Math.floor(Math.random() * 200))}</span>
                                                    <span className="text-[7px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none">UNITS</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 text-right">
                                                <span className="text-[11px] font-bold tabular-nums text-slate-900 uppercase tracking-tighter">{fmtMoney(product.price)}</span>
                                            </td>
                                            <td className="px-4 py-2">
                                                <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-all">
                                                    <button className="h-6 w-6 flex items-center justify-center hover:bg-slate-900 hover:text-white hover:shadow-md rounded-md text-slate-400 border border-transparent transition-all"><MoreHorizontal className="h-3.5 w-3.5" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="px-4 py-2 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest opacity-60">Displaying {filteredProducts.length} results</span>
                                <div className="flex gap-1">
                                    <button className="h-6 px-2.5 bg-white border border-slate-200 rounded-md text-[8px] font-bold uppercase tracking-widest text-slate-400 hover:bg-slate-50 shadow-sm transition-all disabled:opacity-50" disabled>PREV</button>
                                    <button className="h-6 px-2.5 bg-white border border-slate-200 rounded-md text-[8px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 shadow-sm transition-all">NEXT</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="xl:col-span-3 space-y-4">
                        {/* --- REPLENISHMENT AI --- */}
                        <Card className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white space-y-4 relative overflow-hidden group shadow-lg">
                            <div className="relative z-10">
                                <div className="flex items-center gap-2.5 mb-4">
                                    <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg border border-indigo-500 group-hover:scale-105 transition-transform">
                                        <Bot className="h-4 w-4" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-300 leading-none">Inventory AI</span>
                                        <p className="text-[11px] font-bold uppercase tracking-tight">Co-Pilot Mode</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-2.5">
                                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm group-hover:bg-white/10 transition-colors">
                                        <p className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest mb-1 leading-none">Replenish Alert</p>
                                        <p className="text-[10px] text-slate-300 font-bold uppercase leading-relaxed tracking-tight">
                                            "Parka Graphite selling 40% faster. Out of stock in 14 days."
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="p-2 bg-white/5 border border-white/10 rounded-lg text-center">
                                            <p className="text-[7px] text-slate-500 font-bold uppercase mb-0.5 tracking-widest">Health</p>
                                            <span className="text-[11px] font-bold text-emerald-400 tabular-nums tracking-tighter uppercase">94%</span>
                                        </div>
                                        <div className="p-2 bg-white/5 border border-white/10 rounded-lg text-center">
                                            <p className="text-[7px] text-slate-500 font-bold uppercase mb-0.5 tracking-widest">Velocity</p>
                                            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-tighter">High</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <Button className="w-full h-8 bg-white text-slate-900 text-[9px] font-bold uppercase rounded-lg mt-4 hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-xl tracking-widest">
                                    Generate Order
                                </Button>
                            </div>
                            <Sparkles className="absolute -right-6 -top-4 h-24 w-24 text-indigo-600 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-700" />
                        </Card>

                        {/* --- PRODUCTION UPDATES --- */}
                        <Card className="bg-white border border-slate-100 shadow-sm rounded-xl p-4 space-y-4 hover:border-indigo-100 transition-all group">
                            <div className="flex items-center justify-between border-b border-slate-50 pb-2.5">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-700 flex items-center gap-2">
                                    <Layers className="h-3.5 w-3.5 text-indigo-600" /> Pipeline
                                </h3>
                                <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[7px] font-bold px-1.5 h-3.5 rounded shadow-sm tracking-widest">ACTIVE</Badge>
                            </div>

                            <div className="space-y-3.5">
                                {[
                                    { stage: 'CUTTING', style: 'Graphite Parka', prog: 85, status: 'On Track' },
                                    { stage: 'SEWING', style: 'Tech Trousers', prog: 42, status: 'Delayed' },
                                    { stage: 'QC', style: 'Silk Scarf', prog: 100, status: 'Finished' },
                                ].map((step, i) => (
                                    <div key={i} className="space-y-1">
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-[9px] font-bold text-slate-900 uppercase tracking-tight leading-none">{step.style}</span>
                                            <span className={cn("text-[7px] font-bold uppercase px-1 rounded h-3.5 flex items-center tracking-widest", step.status === 'Delayed' ? 'text-rose-500 bg-rose-50' : step.status === 'Finished' ? 'text-emerald-600 bg-emerald-50' : 'text-indigo-600 bg-indigo-50')}>{step.status}</span>
                                        </div>
                                        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/30">
                                            <div className={cn("h-full transition-all duration-1000", step.status === 'Delayed' ? 'bg-rose-500' : step.status === 'Finished' ? 'bg-emerald-500' : 'bg-indigo-500')} style={{ width: `${step.prog}%` }} />
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest leading-none">{step.stage}</span>
                                            <span className="text-[9px] font-bold tabular-nums text-slate-500 tracking-tighter">{step.prog}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <Button variant="outline" className="w-full h-8 border border-slate-200 text-slate-400 text-[9px] font-bold uppercase rounded-lg hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm flex items-center justify-center gap-1.5 tracking-widest">
                                Production View <ChevronRight className="h-3 w-3" />
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>

            {promotionProduct && (
                <PromotionDialog 
                    product={promotionProduct}
                    isOpen={!!promotionProduct}
                    onOpenChange={(open) => {
                        if (!open) setPromotionProduct(null);
                    }}
                />
            )}
        </div>
    );
}


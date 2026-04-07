'use client';

import React, { useState } from 'react';
import { 
    Package, Search, Filter, Plus, Download, Upload, Edit, 
    MoreVertical, ChevronDown, CheckCircle2, AlertCircle, 
    Layers, Image as ImageIcon, FileText, LayoutGrid, List,
    Sparkles, Save, Trash2, Copy, Activity, Database, 
    ShieldCheck, AlertTriangle, RefreshCw, TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { fmtNumber } from '@/lib/format';
import { fastApiService } from '@/lib/fastapi-service';
import Link from 'next/link';
import { useEffect } from 'react';

const MOCK_PIM_PRODUCTS = [
    { 
        id: '1', 
        sku: 'CTP-26-001', 
        name: 'Cyber Tech Parka', 
        category: 'Outerwear', 
        season: 'FW26', 
        status: 'Ready', 
        price: 18000, 
        colors: 3, 
        sizes: 5, 
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200',
        sustainabilityScore: 88,
        productionStatus: 'Quality Check',
        productionProgress: 95,
        certificates: ['GOTS', 'OEKO-TEX'],
        iotProtected: true,
        retailerInterest: 'High'
    },
    { 
        id: '2', 
        sku: 'NCP-26-042', 
        name: 'Neural Cargo Pants', 
        category: 'Pants', 
        season: 'FW26', 
        status: 'Draft', 
        price: 9500, 
        colors: 2, 
        sizes: 6, 
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200',
        sustainabilityScore: 72,
        productionStatus: 'Sewing',
        productionProgress: 45,
        certificates: ['BCI'],
        iotProtected: false,
        retailerInterest: 'Medium'
    },
    { 
        id: '3', 
        sku: 'SRO-26-015', 
        name: 'Silk Road Overshirt', 
        category: 'Shirts', 
        season: 'CORE', 
        status: 'In Review', 
        price: 12000, 
        colors: 4, 
        sizes: 4, 
        image: 'https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?w=200',
        sustainabilityScore: 94,
        productionStatus: 'Finished',
        productionProgress: 100,
        certificates: ['GOTS', 'Fair Trade'],
        iotProtected: true,
        retailerInterest: 'Very High'
    },
];

export function AdvancedPIM() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [products, setProducts] = useState<any[]>(MOCK_PIM_PRODUCTS);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const response = await fastApiService.getProducts();
                const data = Array.isArray(response) ? response : (response?.data ?? []);
                if (data.length > 0) setProducts(data);
            } catch (err) {
                console.warn('Failed to fetch real products, using mock data:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="container mx-auto px-4 py-4 space-y-4 max-w-5xl pb-24 animate-in fade-in duration-700">
            {/* Control Panel: Executive Style */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 border-b border-slate-100 pb-3">
                <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                        <Package className="h-2.5 w-2.5" />
                        <span>Catalog</span>
                        <ChevronDown className="h-2 w-2 opacity-50" />
                        <span className="text-slate-300">Advanced PIM</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-base font-bold font-headline tracking-tighter uppercase text-slate-900 leading-none">Product Hub 2.0</h1>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold text-[7px] px-1.5 h-4 gap-1 tracking-widest shadow-sm transition-all">
                           <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> ERP SYNC: ACTIVE
                        </Badge>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
                        <Button variant="ghost" className="h-7 px-3 bg-white text-slate-600 rounded-lg font-bold uppercase text-[9px] tracking-widest shadow-sm border border-slate-200 transition-all hover:text-indigo-600">
                            <RefreshCw className="mr-1.5 h-3 w-3" /> Refresh
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 px-3 rounded-lg border border-slate-200 bg-white text-[9px] font-bold uppercase gap-1.5 hover:bg-slate-50 shadow-sm text-slate-500 tracking-widest transition-all">
                            <Download className="h-3 w-3" /> Export
                        </Button>
                    </div>
                </div>
            </div>

            {/* 1. High-Level PIM KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <TooltipProvider>
                    {[
                        { label: "TOTAL SKU", value: "1,248", change: "+12%", icon: Package, color: "text-indigo-600", bg: "bg-indigo-50/50", section: "Каталог", desc: "Общее количество уникальных артикулов в базе PIM." },
                        { label: "SALES READY", value: "94%", change: "+2.1%", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50/50", section: "Статус", desc: "Процент товаров с полностью заполненными данными и медиа-активами." },
                        { label: "DATA ERRORS", value: "18", change: "-5", icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50/50", section: "Качество", desc: "Количество SKU с критическими ошибками (отсутствует описание, цена или фото)." },
                        { label: "MEDIA COVERAGE", value: "88%", change: "+4.5%", icon: ImageIcon, color: "text-blue-600", bg: "bg-blue-50/50", section: "Контент", desc: "Охват товаров профессиональным фотоконтентом (Lookbook, 3D, Flatlay)." },
                    ].map((stat, i) => (
                        <Tooltip key={i}>
                            <TooltipTrigger asChild>
                                <Card className="rounded-xl border border-slate-100 shadow-sm p-3.5 bg-white hover:border-indigo-100 transition-all group cursor-pointer relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-2.5">
                                        <div className="flex items-center gap-2">
                                            <div className={cn("p-1.5 rounded-lg border border-slate-200/50 shadow-inner", stat.bg)}>
                                                <stat.icon className={cn("h-3.5 w-3.5", stat.color)} />
                                            </div>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] leading-none">{stat.label}</span>
                                        </div>
                                        <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold text-[8px] uppercase px-1.5 h-4 tracking-tight rounded-md shadow-sm">{stat.change}</Badge>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-sm font-bold tracking-tighter text-slate-900 tabular-nums uppercase leading-none">{stat.value}</span>
                                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{stat.section}</span>
                                    </div>
                                </Card>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="bg-slate-900 text-white border-none text-[9px] font-bold uppercase tracking-widest p-3 rounded-xl shadow-2xl max-w-[200px]">
                                <p className="leading-relaxed">{stat.desc}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </TooltipProvider>
            </div>

            {/* 2. Search & List Section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                <aside className="lg:col-span-1 space-y-3">
                    <Card className="rounded-xl border border-slate-100 shadow-sm bg-white overflow-hidden hover:border-indigo-100 transition-all">
                        <CardHeader className="p-3.5 border-b border-slate-50 bg-slate-50/50">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Collection Filter</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3.5 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold uppercase text-slate-400 tracking-widest ml-1 leading-none">Seasonality</label>
                                <Select defaultValue="all">
                                    <SelectTrigger className="h-8 rounded-lg bg-slate-50/50 border border-slate-100 text-[10px] font-bold uppercase tracking-tight focus:ring-1 focus:ring-indigo-100 transition-all">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                        <SelectItem value="all" className="text-[10px] font-bold uppercase py-1.5">All Seasons</SelectItem>
                                        <SelectItem value="fw26" className="text-[10px] font-bold uppercase py-1.5">FW 2026</SelectItem>
                                        <SelectItem value="ss26" className="text-[10px] font-bold uppercase py-1.5">SS 2026</SelectItem>
                                        <SelectItem value="core" className="text-[10px] font-bold uppercase py-1.5">CORE Collection</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="space-y-2.5">
                                <label className="text-[9px] font-bold uppercase text-slate-400 tracking-widest ml-1 leading-none">Data Status</label>
                                <div className="space-y-1">
                                    {['Ready', 'Draft', 'Review', 'Error'].map(s => (
                                        <div key={s} className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded-lg transition-all cursor-pointer group">
                                            <Checkbox id={s} className="h-3.5 w-3.5 rounded-sm border-slate-200 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600" />
                                            <label htmlFor={s} className="text-[10px] font-bold text-slate-600 uppercase group-hover:text-indigo-600 cursor-pointer transition-colors leading-none tracking-tight">{s}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button variant="ghost" className="w-full h-8 rounded-lg border border-slate-100 text-slate-400 text-[9px] font-bold uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                                Reset Filters
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl border border-slate-800 bg-slate-900 text-white p-4 relative overflow-hidden group shadow-lg">
                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 bg-indigo-600 rounded-lg shadow-lg border border-indigo-500 group-hover:scale-105 transition-transform">
                                    <Sparkles className="h-3.5 w-3.5 text-white" />
                                </div>
                                <div className="space-y-0.5">
                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-300 leading-none">Intelligence</span>
                                    <p className="text-[11px] font-bold uppercase tracking-tight">PIM AI Advisor</p>
                                </div>
                            </div>
                            <div className="p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm group-hover:bg-white/10 transition-colors">
                                <p className="text-[10px] font-bold uppercase tracking-tight leading-relaxed opacity-80 italic">
                                    "Detected 12 SKU missing technical specs and 5 with low-res assets. Action recommended."
                                </p>
                            </div>
                            <Button className="w-full bg-white text-slate-900 hover:bg-indigo-50 rounded-lg font-bold uppercase text-[9px] tracking-widest h-8 shadow-xl transition-all">
                                Remediate Errors
                            </Button>
                        </div>
                        <Sparkles className="absolute -right-6 -top-4 h-24 w-24 text-indigo-600 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-700" />
                    </Card>
                </aside>

                <div className="lg:col-span-3 space-y-3">
                    <Card className="rounded-xl border border-slate-100 shadow-sm bg-white overflow-hidden hover:border-indigo-100 transition-all">
                        <CardHeader className="p-3.5 border-b border-slate-50 bg-slate-50/50">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600 border border-indigo-100 shadow-inner"><Layers className="h-3.5 w-3.5" /></div>
                                    <div className="space-y-0.5">
                                        <CardTitle className="text-[11px] font-bold uppercase tracking-widest text-slate-700">SKU Registry</CardTitle>
                                        <CardDescription className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Master Data Management</CardDescription>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 w-full md:w-auto">
                                    <div className="relative flex-1 md:flex-none">
                                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                                        <Input placeholder="Search SKU..." className="h-7 w-full md:w-44 pl-8 rounded-lg bg-white border-slate-200 text-[10px] font-bold uppercase tracking-tight shadow-sm focus:ring-1 focus:ring-indigo-500" />
                                    </div>
                                    <Button className="h-7 px-3 rounded-lg bg-slate-900 text-white font-bold uppercase text-[9px] tracking-widest shadow-lg hover:bg-indigo-600 transition-all gap-1.5">
                                        <Plus className="h-3 w-3" /> Create SKU
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50/30">
                                    <TableRow className="border-none h-9">
                                        <TableHead className="w-10 px-4 text-center h-9"><Checkbox checked={selectedItems.length === products.length} onCheckedChange={(val) => val ? setSelectedItems(products.map(p => p.id)) : setSelectedItems([])} /></TableHead>
                                        <TableHead className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 py-0 h-9">Article</TableHead>
                                        <TableHead className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 py-0 h-9">SKU / Season</TableHead>
                                        <TableHead className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 py-0 h-9">Production</TableHead>
                                        <TableHead className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 py-0 h-9 text-center">ESG</TableHead>
                                        <TableHead className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 py-0 h-9">Status</TableHead>
                                        <TableHead className="text-right pr-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 py-0 h-9">Valuation</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.map((product) => (
                                        <TableRow key={product.id} className="group hover:bg-slate-50/50 border-slate-50 transition-all h-12">
                                            <TableCell className="px-4 text-center py-0"><Checkbox checked={selectedItems.includes(product.id)} onCheckedChange={(val) => val ? setSelectedItems([...selectedItems, product.id]) : setSelectedItems(selectedItems.filter(id => id !== product.id))} /></TableCell>
                                            <TableCell className="py-0">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="h-8 w-6.5 rounded-lg overflow-hidden relative shadow-sm border border-slate-200 bg-white group-hover:scale-110 transition-transform">
                                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                        {product.iotProtected && (
                                                            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-slate-900 rounded-full flex items-center justify-center border border-white shadow-xl">
                                                                <ShieldCheck className="h-2 w-2 text-indigo-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors leading-none">{product.name}</p>
                                                        <Badge variant="outline" className="mt-1 text-[7px] font-bold border-slate-100 bg-slate-50 text-slate-400 h-3 px-1 uppercase leading-none shadow-sm tracking-widest">{product.category}</Badge>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-0">
                                                <div className="space-y-0.5">
                                                    <p className="text-[10px] font-bold text-slate-900 leading-none tracking-tight">{product.sku}</p>
                                                    <p className="text-[8px] font-bold uppercase text-slate-400 tracking-[0.2em] leading-none mt-1 opacity-70">{product.season}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-0">
                                                <div className="max-w-[80px] space-y-1">
                                                    <div className="flex justify-between text-[8px] font-bold uppercase tracking-tight leading-none">
                                                        <span className="text-slate-400">{product.productionStatus}</span>
                                                        <span className="text-indigo-600">{product.productionProgress}%</span>
                                                    </div>
                                                    <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-50">
                                                        <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${product.productionProgress}%` }} />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center py-0">
                                                <span className={cn(
                                                    "text-[10px] font-bold uppercase leading-none tabular-nums",
                                                    product.sustainabilityScore > 80 ? "text-emerald-600" : "text-amber-600"
                                                )}>
                                                    {product.sustainabilityScore}%
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-0">
                                                <Badge variant="outline" className={cn(
                                                    "text-[8px] font-bold uppercase px-1.5 h-4 border shadow-sm transition-all tracking-widest",
                                                    product.status === 'Ready' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                                                    product.status === 'Draft' ? "bg-slate-50 text-slate-400 border-slate-200" : "bg-amber-50 text-amber-600 border-amber-100"
                                                )}>
                                                    {product.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-4 py-0">
                                                <p className="text-[11px] font-bold text-slate-900 uppercase tracking-tighter tabular-nums">{fmtNumber(product.price)} ₽</p>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardFooter className="px-4 py-2 bg-slate-50/50 flex items-center justify-between border-t border-slate-100">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] opacity-60">Inventory count: {products.length}</p>
                            <div className="flex items-center gap-1">
                                <Button variant="outline" size="sm" disabled className="h-6 px-2.5 bg-white border border-slate-200 rounded-md text-[8px] font-bold uppercase tracking-widest text-slate-400 hover:bg-slate-50 shadow-sm transition-all disabled:opacity-50">Prev</Button>
                                <Button variant="outline" size="sm" className="h-6 px-2.5 bg-white border border-slate-200 rounded-md text-[8px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 shadow-sm transition-all">Next</Button>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}

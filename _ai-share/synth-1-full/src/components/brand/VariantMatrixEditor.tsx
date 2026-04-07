'use client';

import React, { useState } from 'react';
import { 
    Layers, Palette, Ruler, DollarSign, 
    Save, RefreshCw, Plus, Trash2, 
    CheckCircle2, AlertCircle, Info,
    Maximize2, Grid, List, Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from '@/lib/utils';

const MOCK_VARIANTS = [
    { id: 'v1', color: 'Midnight Black', size: 'S', sku: 'CP-BLK-S', stock: 120, wholesale: 7200, rrp: 18000 },
    { id: 'v2', color: 'Midnight Black', size: 'M', sku: 'CP-BLK-M', stock: 85, wholesale: 7200, rrp: 18000 },
    { id: 'v3', color: 'Midnight Black', size: 'L', sku: 'CP-BLK-L', stock: 42, wholesale: 7500, rrp: 18500 }, // Premium size
    { id: 'v4', color: 'Slate Grey', size: 'S', sku: 'CP-GRY-S', stock: 64, wholesale: 7200, rrp: 18000 },
    { id: 'v5', color: 'Slate Grey', size: 'M', sku: 'CP-GRY-M', stock: 110, wholesale: 7200, rrp: 18000 },
];

export function VariantMatrixEditor({ collectionId }: { collectionId?: string | null }) {
    const matrix = React.useMemo(() => {
        if (collectionId === 'SS26' || collectionId === 'BASIC') return MOCK_VARIANTS;
        if (collectionId === 'DROP-UZ') return MOCK_VARIANTS.slice(0, 2);
        return [];
    }, [collectionId]);

    const [variants, setVariants] = useState(matrix);

    React.useEffect(() => {
        setVariants(matrix);
    }, [matrix]);

    if (!collectionId || variants.length === 0) {
        return (
            <div className="space-y-4 pb-24 animate-in fade-in duration-700">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                            <Grid className="w-3.5 h-3.5 text-indigo-500" />
                            Fashion OS — Product Management
                        </div>
                        <h1 className="text-sm font-bold tracking-tight text-slate-900 leading-tight uppercase">Variant Matrix Editor</h1>
                    </div>
                </header>
                <Card className="border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/30 flex flex-col items-center justify-center p-20 gap-6 text-center">
                    <div className="h-20 w-20 rounded-3xl bg-white flex items-center justify-center shadow-lg border border-slate-100">
                        <Grid className="h-10 w-10 text-slate-300" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900">Матрица вариантов пуста</h3>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest max-w-xs mx-auto">Для этой коллекции еще не созданы цвето-размерные варианты артикулов.</p>
                    </div>
                    <Button className="bg-black text-white rounded-xl h-12 px-8 font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-indigo-600 transition-all">Сгенерировать матрицу</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-4 pb-24 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-100 pb-4">
                <div className="space-y-0.5">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                        <Grid className="w-3.5 h-3.5 text-indigo-500" />
                        Fashion OS — Product Management
                    </div>
                    <h1 className="text-sm font-bold tracking-tight text-slate-900 leading-tight uppercase">Variant Matrix Editor</h1>
                    <p className="text-[11px] text-slate-500 font-medium">Управление размерными сетками, цветами и SKU в едином интерфейсе.</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
                    <Button variant="outline" className="gap-1.5 rounded-lg h-7 px-3 font-bold uppercase text-[9px] border-none bg-white text-slate-600 hover:bg-slate-50 shadow-sm transition-all">
                        <RefreshCw className="w-3.5 h-3.5 text-slate-400" /> Sync SKU
                    </Button>
                    <Button className="gap-1.5 rounded-lg h-7 px-4 font-bold uppercase text-[9px] bg-slate-900 text-white shadow-md hover:bg-slate-800 transition-all">
                        <Save className="w-3.5 h-3.5 text-indigo-400" /> Save Matrix
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                {/* Product Summary */}
                <Card className="lg:col-span-1 rounded-xl border border-slate-100 shadow-sm bg-white overflow-hidden self-start hover:border-indigo-100 transition-all group">
                    <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute top-3 left-3">
                            <Badge className="bg-slate-900/80 backdrop-blur-md text-white border border-white/10 text-[8px] font-bold uppercase tracking-wider px-2 h-5 rounded-md shadow-lg">Master SKU: CTP-26</Badge>
                        </div>
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="space-y-1">
                            <h2 className="text-sm font-bold uppercase text-slate-900 leading-tight tracking-tight">Cyber Tech Parka</h2>
                            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">FW26 Collection • Outerwear</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 shadow-inner">
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Colors</p>
                                <p className="text-sm font-bold text-slate-900 uppercase">3 Options</p>
                            </div>
                            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 shadow-inner">
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Sizes</p>
                                <p className="text-sm font-bold text-slate-900 uppercase">5 Options</p>
                            </div>
                        </div>
                        <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-1.5">
                                <Info className="h-3.5 w-3.5 text-indigo-600" />
                                <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-900 leading-none">AI Price Guard</span>
                            </div>
                            <p className="text-[10px] text-indigo-700 font-bold uppercase tracking-tight leading-relaxed opacity-80">
                                «Обнаружено отклонение в маржинальности для размера L (Black). Оптовая цена выше средней на 4%.»
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Matrix Table */}
                {/* Matrix Table */}
                <div className="lg:col-span-3 space-y-4">
                    <Card className="rounded-xl border border-slate-100 shadow-sm bg-white overflow-hidden hover:border-indigo-100 transition-all">
                        <div className="p-4 bg-slate-50/30 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="relative flex-1 md:flex-none">
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                    <Input placeholder="Фильтр по матрице..." className="h-8 w-full md:w-64 pl-8 rounded-lg bg-white border-slate-200 text-[11px] font-bold uppercase tracking-tight focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm" />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="h-7 px-3 rounded-lg border-slate-200 text-[9px] font-bold uppercase tracking-wider text-slate-600 bg-white hover:bg-slate-50 shadow-sm transition-all">Markup</Button>
                                <Button variant="outline" size="sm" className="h-7 px-3 rounded-lg border-slate-200 text-[9px] font-bold uppercase tracking-wider text-slate-600 bg-white hover:bg-slate-50 shadow-sm transition-all">Stocks</Button>
                            </div>
                        </div>
                        <div className="p-0 overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="border-none h-9">
                                        <TableHead className="pl-5 text-[10px] font-bold uppercase tracking-widest text-slate-400 h-9">Вариант (Color/Size)</TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 h-9">SKU Артикул</TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 h-9">Опт (Wholesale)</TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 h-9">Розница (RRP)</TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right h-9">Свободный сток</TableHead>
                                        <TableHead className="pr-5 h-9"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {variants.map((v) => (
                                        <TableRow key={v.id} className="group hover:bg-indigo-50/30 border-slate-50 transition-colors h-10">
                                            <TableCell className="pl-5 py-0">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn("h-4 w-4 rounded-full border border-white shadow-sm ring-1 ring-slate-200", v.color === 'Midnight Black' ? 'bg-slate-950' : 'bg-slate-400')} />
                                                    <div>
                                                        <p className="text-[11px] font-bold uppercase text-slate-900 leading-none group-hover:text-indigo-600 transition-colors">{v.color}</p>
                                                        <Badge variant="outline" className="h-4 px-1.5 text-[8px] font-bold border-slate-100 bg-slate-50 text-slate-400 uppercase mt-1 leading-none">Size: {v.size}</Badge>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-0">
                                                <code className="text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 uppercase">{v.sku}</code>
                                            </TableCell>
                                            <TableCell className="py-0">
                                                <div className="relative w-24">
                                                    <Input defaultValue={v.wholesale} className={cn("h-8 rounded-lg text-[11px] font-bold pl-6 border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-indigo-100 transition-all", v.wholesale > 7200 && "border-amber-200 bg-amber-50/30")} />
                                                    <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-0">
                                                <div className="relative w-24">
                                                    <Input defaultValue={v.rrp} className="h-8 rounded-lg text-[11px] font-bold pl-6 border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-indigo-100 transition-all" />
                                                    <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right py-0">
                                                <span className={cn(
                                                    "text-[11px] font-bold tabular-nums px-2 py-0.5 rounded-md shadow-sm border",
                                                    v.stock < 50 ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                )}>{v.stock} ед.</span>
                                            </TableCell>
                                            <TableCell className="pr-5 py-0 text-right">
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-300 opacity-0 group-hover:opacity-100 hover:text-rose-600 hover:bg-rose-50 transition-all"><Trash2 className="h-3.5 w-3.5" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <CardFooter className="p-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Всего вариантов: {variants.length}</p>
                            <Button variant="ghost" className="h-8 text-[10px] font-bold uppercase text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all gap-1.5 tracking-wider">
                                <Plus className="h-3.5 w-3.5" /> Добавить вариант
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}

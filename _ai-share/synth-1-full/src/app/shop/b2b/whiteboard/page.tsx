'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { products } from '@/lib/products';
import Image from 'next/image';
import { LayoutGrid, Layers, Filter, Plus, Save, Share2, MousePointer2, GripHorizontal, Calendar, Info, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function WhiteboardPage() {
    const [activeTab, setActiveTab] = useState('canvas');
    const whiteboardProducts = products.slice(0, 12);

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-[#F8F9FB]">
            {/* Header Area */}
            <header className="bg-white border-b px-6 py-4 flex items-center justify-between z-20">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-600 rounded-xl">
                        <LayoutGrid className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-base font-black uppercase tracking-tighter text-slate-900">Advanced Assortment Whiteboard</h1>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px] font-bold border-indigo-100 text-indigo-600 bg-indigo-50/50">Season: FW24</Badge>
                            <span className="text-[10px] text-slate-400 font-medium">Last saved: 2 mins ago</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center -space-x-2 mr-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                                <Image src={`https://i.pravatar.cc/100?u=${i}`} alt="user" width={32} height={32} />
                            </div>
                        ))}
                        <div className="h-8 w-8 rounded-full border-2 border-white bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                            +5
                        </div>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl border-slate-200">
                        <Share2 className="mr-2 h-4 w-4" /> Поделиться
                    </Button>
                    <Button size="sm" className="rounded-xl bg-indigo-600 hover:bg-indigo-700">
                        <Save className="mr-2 h-4 w-4" /> Сохранить план
                    </Button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Toolbar */}
                <aside className="w-12 bg-white border-r flex flex-col items-center py-6 gap-3 z-10">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600">
                                    <MousePointer2 className="h-5 w-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">Выбор</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:text-indigo-600">
                                    <Layers className="h-5 w-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">Слои</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:text-indigo-600">
                                    <Calendar className="h-5 w-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">График поставок</TooltipContent>
                        </Tooltip>

                        <div className="h-px w-8 bg-slate-100 my-2" />

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:text-indigo-600">
                                    <Sparkles className="h-5 w-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">AI Рекомендации</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </aside>

                {/* Main Canvas */}
                <main className="flex-1 relative overflow-hidden p-4">
                    {/* Background Grid */}
                    <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

                    <div className="relative z-10 grid grid-cols-4 gap-3 h-full">
                        {/* Drop 1 Section */}
                        <div className="col-span-2 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                    <Calendar className="h-3 w-3" /> Drop 1: August Arrival
                                </h3>
                                <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 border-none text-[8px] uppercase">45 SKUs • 1200 Units</Badge>
                            </div>
                            <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-3xl p-4 min-h-[400px] grid grid-cols-3 gap-3">
                                {whiteboardProducts.slice(0, 6).map((product, idx) => (
                                    <Card key={idx} className="group relative overflow-hidden rounded-2xl border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-grab active:cursor-grabbing">
                                        <CardContent className="p-0">
                                            <div className="aspect-[3/4] relative">
                                                <Image src={product.images[0].url} alt={product.name} fill className="object-cover" />
                                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="secondary" size="icon" className="h-7 w-7 rounded-lg bg-white/90 backdrop-blur">
                                                        <Info className="h-3.5 w-3.5 text-slate-600" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="p-2.5 bg-white border-t border-slate-50">
                                                <p className="text-[10px] font-black uppercase tracking-tighter truncate">{product.name}</p>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="text-[9px] font-bold text-indigo-600">{product.price} ₽</span>
                                                    <Badge variant="outline" className="text-[7px] py-0 h-3.5 border-slate-100">Top 5%</Badge>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Drop 2 Section */}
                        <div className="col-span-2 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                    <Calendar className="h-3 w-3" /> Drop 2: September Arrival
                                </h3>
                                <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-none text-[8px] uppercase">32 SKUs • 850 Units</Badge>
                            </div>
                            <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-3xl p-4 min-h-[400px] grid grid-cols-3 gap-3">
                                {whiteboardProducts.slice(6, 9).map((product, idx) => (
                                    <Card key={idx} className="group relative overflow-hidden rounded-2xl border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-grab active:cursor-grabbing">
                                        <CardContent className="p-0">
                                            <div className="aspect-[3/4] relative">
                                                <Image src={product.images[0].url} alt={product.name} fill className="object-cover" />
                                            </div>
                                            <div className="p-2.5 bg-white">
                                                <p className="text-[10px] font-black uppercase tracking-tighter truncate">{product.name}</p>
                                                <p className="text-[9px] font-bold text-indigo-600 mt-1">{product.price} ₽</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                <Button variant="ghost" className="h-full border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-300 hover:text-indigo-400 hover:bg-white/80 transition-all">
                                    <Plus className="h-6 w-6" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Добавить товар</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Right Panel - Product Library */}
                <aside className="w-80 bg-white border-l flex flex-col z-10 shadow-[-4px_0_12px_rgba(0,0,0,0.02)]">
                    <div className="p-4 border-b">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-black uppercase tracking-tighter">Библиотека SKU</h3>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Поиск по артикулу..." 
                                className="w-full h-10 px-4 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                    <ScrollArea className="flex-1 p-4">
                        <div className="grid grid-cols-2 gap-3">
                            {products.map((product, idx) => (
                                <div key={idx} className="group cursor-pointer">
                                    <div className="aspect-[3/4] relative rounded-xl overflow-hidden border border-slate-100 group-hover:ring-2 group-hover:ring-indigo-500 transition-all">
                                        <Image src={product.images[0].url} alt={product.name} fill className="object-cover" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                                            <Plus className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all" />
                                        </div>
                                    </div>
                                    <p className="text-[9px] font-bold uppercase mt-1.5 truncate text-slate-500">{product.name}</p>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                    <div className="p-4 border-t bg-slate-50/50">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase text-slate-400">Итого в плане:</span>
                                <span className="text-sm font-black">77 SKUs</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase text-slate-400">Бюджет:</span>
                                <span className="text-sm font-black text-indigo-600">4 850 000 ₽</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

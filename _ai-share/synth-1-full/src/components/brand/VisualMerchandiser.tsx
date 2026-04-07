'use client';

import React, { useState } from 'react';
import { 
    LayoutGrid, Move, Eye, Save, RotateCcw, 
    Sparkles, ShoppingBag, Plus, Info, ChevronRight,
    Smartphone, Tv, Layers, Maximize2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion, Reorder } from 'framer-motion';

const MOCK_COLLECTION = [
    { id: '1', name: 'Cyber Parka', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300', price: '18,000 ₽', category: 'Outerwear' },
    { id: '2', name: 'Cargo Pants', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300', price: '9,500 ₽', category: 'Pants' },
    { id: '3', name: 'Overshirt', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?w=300', price: '12,000 ₽', category: 'Shirts' },
    { id: '4', name: 'Neural Tee', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300', price: '4,500 ₽', category: 'Tees' },
];

export function VisualMerchandiser() {
    const [items, setItems] = useState(MOCK_COLLECTION);
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile' | 'showroom'>('showroom');

    return (
        <div className="space-y-4 pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-600 rounded-2xl">
                            <LayoutGrid className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-base font-black uppercase tracking-tighter text-slate-900">Digital Rack Planner</h1>
                    </div>
                    <p className="text-slate-500 font-medium italic">Визуальный мерчандайзинг коллекции: спланируйте «идеальную развеску» для байеров.</p>
                </div>
                <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                    <Button 
                        variant={previewMode === 'showroom' ? 'secondary' : 'ghost'} 
                        size="sm" 
                        onClick={() => setPreviewMode('showroom')}
                        className="rounded-xl font-black uppercase text-[10px]"
                    >
                        <Tv className="mr-2 h-3.5 w-3.5" /> Showroom
                    </Button>
                    <Button 
                        variant={previewMode === 'mobile' ? 'secondary' : 'ghost'} 
                        size="sm" 
                        onClick={() => setPreviewMode('mobile')}
                        className="rounded-xl font-black uppercase text-[10px]"
                    >
                        <Smartphone className="mr-2 h-3.5 w-3.5" /> Mobile
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                {/* Rack Preview Area */}
                <div className="lg:col-span-3 space-y-6">
                    <div className={cn(
                        "bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-3 transition-all duration-500",
                        previewMode === 'mobile' ? "max-w-[400px] mx-auto" : "w-full"
                    )}>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Layout: Best Sellers Sequence</h3>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600"><RotateCcw className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600"><Save className="h-4 w-4" /></Button>
                            </div>
                        </div>

                        <Reorder.Group axis="x" values={items} onReorder={setItems} className="flex flex-wrap gap-3 justify-center">
                            {items.map((item) => (
                                <Reorder.Item 
                                    key={item.id} 
                                    value={item}
                                    className="w-[200px] group cursor-grab active:cursor-grabbing"
                                >
                                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden group-hover:shadow-xl group-hover:border-indigo-200 transition-all">
                                        <div className="aspect-[3/4] relative overflow-hidden">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/10 transition-colors" />
                                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="h-8 w-8 bg-white rounded-xl shadow-lg flex items-center justify-center">
                                                    <Move className="h-4 w-4 text-slate-400" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 space-y-1">
                                            <p className="text-[10px] font-black uppercase text-slate-900 truncate">{item.name}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase">{item.category}</span>
                                                <span className="text-[10px] font-black text-indigo-600">{item.price}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>
                    </div>
                </div>

                {/* Strategy Sidebar */}
                <aside className="space-y-6">
                    <Card className="rounded-xl border-none shadow-sm bg-white overflow-hidden">
                        <CardHeader className="bg-slate-50 p-4 border-b border-slate-100">
                            <CardTitle className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-indigo-600" /> AI Merchandiser
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-6">
                            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 italic text-[10px] text-indigo-900 leading-relaxed font-medium">
                                «На основе данных прошлых сезонов в магазине ЦУМ, рекомендую поставить Cyber Parka первой в развеске для увеличения конверсии на 12.4%».
                            </div>
                            <Button className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-100">
                                Применить AI-Layout
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl border-none shadow-sm bg-slate-900 text-white p-4">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="h-5 w-5 text-indigo-400" />
                                <h3 className="text-sm font-black uppercase tracking-tight">Buy Limit Enforcement</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase text-white/40">
                                        <span>MOQ Progress</span>
                                        <span>75%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 w-[75%]" />
                                    </div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
                                    <Info className="h-4 w-4 text-amber-400" />
                                    <p className="text-[9px] font-bold text-slate-300 leading-tight uppercase">Для активации этого набора байеру не хватает 250,000 ₽ до минимального порога.</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </aside>
            </div>
        </div>
    );
}

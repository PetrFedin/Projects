'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
    FileText, Download, Share2, Plus, Trash2, 
    Search, Filter, CheckCircle2, LayoutGrid, 
    List as ListIcon, Zap, Sparkles, Printer,
    ChevronRight, Info, AlertCircle, ShoppingBag,
    Calendar, Package, DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { products as allProducts } from '@/lib/products';
import { useToast } from '@/hooks/use-toast';
import { 
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function LineSheetGenerator() {
    const { toast } = useToast();
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isResultOpen, setIsResultOpen] = useState(false);
    const [linesheetTitle, setLinesheetTitle] = useState('Line Sheet: FW26 Core Collection');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const filteredProducts = useMemo(() => {
        return allProducts.filter(p => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const toggleProduct = (id: string) => {
        setSelectedProductIds(prev => 
            prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
        );
    };

    const handleGenerate = () => {
        if (selectedProductIds.length === 0) {
            toast({
                title: "No products selected",
                description: "Please select at least one product to generate a linesheet.",
                variant: "destructive"
            });
            return;
        }
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            setIsResultOpen(true);
            toast({
                title: "Line Sheet Generated",
                description: "Digital Line Sheet is ready for sharing.",
            });
        }, 2000);
    };

    const selectedProducts = useMemo(() => {
        return allProducts.filter(p => selectedProductIds.includes(p.id));
    }, [selectedProductIds]);

    const totalPrice = selectedProducts.reduce((sum, p) => sum + p.price, 0);
    const wholesalePrice = totalPrice * 0.45; // Simulated wholesale value

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
                <div>
                    <Badge className="bg-indigo-600 text-white border-none mb-3 px-3 py-1 font-black uppercase tracking-widest text-[10px]">
                        Wholesale & B2B Tool
                    </Badge>
                    <h1 className="text-sm font-black uppercase tracking-tight text-slate-900 leading-none">
                        Digital <span className="text-indigo-600">Line Sheet</span> Generator
                    </h1>
                    <p className="mt-4 text-slate-500 font-medium max-w-xl">
                        Создавайте профессиональные цифровые каталоги (Line Sheets) для байеров и ритейлеров за считанные минуты.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button 
                        variant="outline" 
                        onClick={() => setSelectedProductIds([])}
                        className="rounded-xl border-slate-200 h-10 px-4 font-bold uppercase tracking-widest text-[9px]"
                    >
                        <RotateCcw className="mr-2 h-3 w-3" /> Сбросить выбор
                    </Button>
                    <Button 
                        onClick={handleGenerate}
                        disabled={selectedProductIds.length === 0 || isGenerating}
                        className="rounded-xl h-10 px-6 bg-slate-900 text-white font-black uppercase tracking-widest text-[9px] shadow-lg shadow-slate-200"
                    >
                        {isGenerating ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Sparkles className="mr-2 h-3 w-3" />}
                        Сгенерировать ({selectedProductIds.length})
                    </Button>
                </div>
            </header>

            <div className="grid lg:grid-cols-12 gap-3 items-start">
                {/* Left: Product Selector */}
                <div className="lg:col-span-8 space-y-6">
                    <Card className="rounded-xl border-none shadow-xl bg-white overflow-hidden">
                        <CardHeader className="border-b border-slate-50">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input 
                                        placeholder="Поиск товаров по имени, бренду или артикулу..." 
                                        className="pl-10 h-11 bg-slate-50 border-none rounded-xl text-xs font-medium"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button 
                                        variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                                        size="icon" 
                                        className="h-10 w-10 rounded-xl"
                                        onClick={() => setViewMode('grid')}
                                    >
                                        <LayoutGrid className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                        variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                                        size="icon" 
                                        className="h-10 w-10 rounded-xl"
                                        onClick={() => setViewMode('list')}
                                    >
                                        <ListIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            <ScrollArea className="h-[600px] pr-4">
                                <div className={cn(
                                    "grid gap-3",
                                    viewMode === 'grid' ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
                                )}>
                                    {filteredProducts.map(product => {
                                        const isSelected = selectedProductIds.includes(product.id);
                                        return (
                                            <div 
                                                key={product.id}
                                                onClick={() => toggleProduct(product.id)}
                                                className={cn(
                                                    "group relative cursor-pointer rounded-2xl border-2 transition-all overflow-hidden",
                                                    isSelected ? "border-indigo-600 bg-indigo-50/30 shadow-md" : "border-slate-100 hover:border-slate-200 bg-white"
                                                )}
                                            >
                                                <div className="aspect-[3/4] relative">
                                                    <Image 
                                                        src={product.images?.[0]?.url || (product as any).image || 'https://picsum.photos/seed/p1/400/600'} 
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover transition-transform group-hover:scale-105"
                                                    />
                                                    {isSelected && (
                                                        <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg">
                                                            <CheckCircle2 className="h-4 w-4" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-3">
                                                    <p className="text-[8px] font-black uppercase text-slate-400 mb-0.5">{product.brand}</p>
                                                    <h4 className="text-[10px] font-black uppercase tracking-tight truncate mb-1">{product.name}</h4>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[9px] font-bold tabular-nums">{product.price.toLocaleString('ru-RU')} ₽</span>
                                                        <span className="text-[7px] font-black uppercase text-indigo-600 bg-indigo-50 px-1 rounded">WS: {(product.price * 0.45).toLocaleString('ru-RU')} ₽</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Summary & Configuration */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="rounded-xl border-none shadow-xl bg-white overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-base font-black uppercase tracking-tight">Настройки каталога</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Название коллекции</Label>
                                <Input 
                                    value={linesheetTitle}
                                    onChange={(e) => setLinesheetTitle(e.target.value)}
                                    className="rounded-xl bg-slate-50 border-none font-bold"
                                />
                            </div>

                            <div className="p-4 rounded-2xl bg-indigo-600 text-white space-y-4 shadow-xl shadow-indigo-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <ShoppingBag className="h-4 w-4 opacity-70" />
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Итого в каталоге</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-[8px] font-black uppercase opacity-60">Товаров</p>
                                        <p className="text-sm font-black">{selectedProductIds.length}</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black uppercase opacity-60">Суммарная ценность (WS)</p>
                                        <p className="text-sm font-black tabular-nums">{Math.round(wholesalePrice).toLocaleString('ru-RU')} ₽</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Параметры отображения</h4>
                                <div className="space-y-3">
                                    {[
                                        { id: 'prices', label: 'Показывать оптовые цены (WS)', checked: true },
                                        { id: 'rrp', label: 'Показывать рекомендуемые розничные цены (RRP)', checked: true },
                                        { id: 'availability', label: 'Показывать доступность (ATS)', checked: true },
                                        { id: 'materials', label: 'Включить состав материалов', checked: false },
                                        { id: 'qr', label: 'Добавить QR-коды для каждого товара', checked: true }
                                    ].map(opt => (
                                        <div key={opt.id} className="flex items-center space-x-3">
                                            <Checkbox id={opt.id} defaultChecked={opt.checked} />
                                            <Label htmlFor={opt.id} className="text-xs font-bold uppercase tracking-tight cursor-pointer leading-none">{opt.label}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-slate-50 p-4 flex flex-col gap-3">
                            <Button 
                                className="w-full rounded-xl h-12 bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] shadow-lg"
                                onClick={handleGenerate}
                                disabled={selectedProductIds.length === 0 || isGenerating}
                            >
                                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                                Сгенерировать Line Sheet
                            </Button>
                            <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest">
                                Ссылка будет активна 30 дней
                            </p>
                        </CardFooter>
                    </Card>

                    <div className="bg-gradient-to-br from-indigo-50 to-white p-4 rounded-xl border border-indigo-100 space-y-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-indigo-600" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-900">AI Line Sheet Optimizer</h4>
                        </div>
                        <p className="text-[11px] text-indigo-700 font-medium leading-relaxed">
                            На основе анализа спроса в регионе байера (Москва), мы рекомендуем добавить еще 3 модели из коллекции "Techwear Base". Это увеличит вероятность заказа на 24%.
                        </p>
                        <Button variant="outline" className="w-full rounded-xl border-indigo-200 text-indigo-600 text-[9px] font-black uppercase tracking-widest h-9 bg-white hover:bg-indigo-50">
                            Принять рекомендации
                        </Button>
                    </div>
                </div>
            </div>

            {/* Result Dialog */}
            <Dialog open={isResultOpen} onOpenChange={setIsResultOpen}>
                <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white border-none rounded-xl">
                    <div className="bg-slate-900 p-4 text-white relative">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <FileText className="h-64 w-64 rotate-12" />
                        </div>
                        <div className="relative z-10">
                            <Badge className="bg-indigo-600 text-white border-none mb-6 px-4 py-1 font-black uppercase tracking-widest text-[10px]">
                                Generation Successful
                            </Badge>
                            <h2 className="text-sm font-black uppercase tracking-tighter mb-4 leading-none italic">{linesheetTitle}</h2>
                            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Expires: March 15, 2026</span>
                                <span className="flex items-center gap-2"><Package className="h-4 w-4" /> {selectedProductIds.length} Items Included</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 space-y-10">
                        <div className="grid md:grid-cols-2 gap-3">
                            <div className="space-y-6">
                                <h3 className="text-base font-black uppercase tracking-tight">Доступные форматы</h3>
                                <div className="space-y-3">
                                    {[
                                        { id: 'web', label: 'Interactive Digital Link', icon: Zap, desc: 'Байер может делать заказ прямо из каталога', primary: true },
                                        { id: 'pdf', label: 'High-Res PDF (Print ready)', icon: FileText, desc: 'Для офлайн встреч и архива', primary: false },
                                        { id: 'xls', label: 'Excel Order Form', icon: Package, desc: 'Таблица со всеми SKU и WS ценами', primary: false }
                                    ].map(format => (
                                        <div key={format.id} className={cn(
                                            "p-3 rounded-2xl border-2 flex items-center gap-3 transition-all cursor-pointer",
                                            format.primary ? "border-indigo-600 bg-indigo-50/50 shadow-lg" : "border-slate-100 hover:border-slate-200"
                                        )}>
                                            <div className={cn(
                                                "h-10 w-10 rounded-xl flex items-center justify-center",
                                                format.primary ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
                                            )}>
                                                <format.icon className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">{format.label}</p>
                                                <p className="text-[10px] font-bold text-slate-400">{format.desc}</p>
                                            </div>
                                            <Download className="h-4 w-4 text-slate-300" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h3 className="text-base font-black uppercase tracking-tight">Шеринг и Безопасность</h3>
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Публичная ссылка</Label>
                                        <div className="flex gap-2">
                                            <Input readOnly value="https://syntha.os/ls/b2b-fw26-core-6721" className="bg-white border-slate-200 text-xs font-bold h-10" />
                                            <Button size="icon" className="h-10 w-10 shrink-0 bg-slate-900 rounded-lg">
                                                <Share2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                                        <CheckCircle2 className="h-4 w-4" />
                                        <p className="text-[10px] font-bold">Пароль для доступа: <strong>SYN26B2B</strong></p>
                                    </div>
                                </div>
                                <div className="p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                                    <Printer className="h-5 w-5 text-slate-400" />
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Печать этикеток</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Сгенерировать QR для шоурума</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="ml-auto rounded-lg"><ChevronRight className="h-4 w-4" /></Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                        <Button variant="outline" className="rounded-xl h-12 px-8 font-black uppercase tracking-widest text-[10px]" onClick={() => setIsResultOpen(false)}>
                            Закрыть
                        </Button>
                        <Button className="rounded-xl h-12 px-10 bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-100">
                            Открыть превью <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function RotateCcw(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}

function Loader2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="M4.93 4.93l2.83 2.83" />
      <path d="M16.24 16.24l2.83 2.83" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
      <path d="M4.93 19.07l2.83-2.83" />
      <path d="M16.24 7.76l2.83-2.83" />
    </svg>
  )
}

function ArrowUpRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  )
}

function Timer(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="10" x2="14" y1="2" y2="2" />
      <line x1="12" x2="15" y1="14" y2="11" />
      <circle cx="12" cy="14" r="8" />
    </svg>
  )
}

'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
    Search, Filter, ChevronRight, ShieldCheck, Leaf, Heart, Check, Clock, 
    MessageSquare, Sparkles, Zap, Star, Handshake, BarChart2, Info, ArrowUpRight
} from "lucide-react";
import { Input } from '@/components/ui/input';
import { brands as allBrands } from "@/lib/placeholder-data";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

// Mock quality data for all brands
const mockQualityData: Record<string, any> = {
    'syntha': {
        score: 92,
        metrics: [
            { id: 'reputation', score: 98, status: 'active' },
            { id: 'eco', score: 92, status: 'active' },
            { id: 'loyalty', score: 95, status: 'active' },
            { id: 'quality', score: 97, status: 'active' },
            { id: 'delivery', score: 88, status: 'active' },
            { id: 'service', score: 94, status: 'active' },
            { id: 'trend', score: 75, status: 'potential' },
            { id: 'innovation', score: 82, status: 'potential' },
            { id: 'experts', score: 68, status: 'potential' },
            { id: 'social', score: 45, status: 'potential' }
        ]
    },
    'nordic': {
        score: 85,
        metrics: [
            { id: 'reputation', score: 90, status: 'active' },
            { id: 'eco', score: 95, status: 'active' },
            { id: 'loyalty', score: 88, status: 'active' },
            { id: 'quality', score: 92, status: 'active' },
            { id: 'delivery', score: 75, status: 'potential' },
            { id: 'service', score: 82, status: 'potential' },
            { id: 'trend', score: 65, status: 'potential' },
            { id: 'innovation', score: 60, status: 'potential' },
            { id: 'experts', score: 85, status: 'active' },
            { id: 'social', score: 70, status: 'potential' }
        ]
    }
    // ... other brands would have default or generated data
};

const metricIcons: Record<string, any> = {
    reputation: <ShieldCheck className="h-4 w-4" />,
    eco: <Leaf className="h-4 w-4" />,
    loyalty: <Heart className="h-4 w-4" />,
    quality: <Check className="h-4 w-4" />,
    delivery: <Clock className="h-4 w-4" />,
    service: <MessageSquare className="h-4 w-4" />,
    trend: <Sparkles className="h-4 w-4" />,
    innovation: <Zap className="h-4 w-4" />,
    experts: <Star className="h-4 w-4" />,
    social: <Handshake className="h-4 w-4" />
};

export default function AdminQualityPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBrand, setSelectedBrand] = useState<any>(null);

    const filteredBrands = useMemo(() => {
        return allBrands.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [searchQuery]);

    return (
        <div className="space-y-4 p-4">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-base font-black uppercase tracking-tighter">Контроль Системы Качества</h1>
                    <p className="text-muted-foreground">Глобальный мониторинг показателей и достижений всех брендов платформы.</p>
                </div>
                <div className="flex gap-3">
                    <Card className="px-6 py-3 border-accent/10 bg-accent/5 flex items-center gap-3">
                        <BarChart2 className="h-6 w-6 text-accent" />
                        <div>
                            <p className="text-[10px] font-black uppercase text-muted-foreground">Средний BPI</p>
                            <p className="text-sm font-black">78.4%</p>
                        </div>
                    </Card>
                </div>
            </header>

            <Card className="rounded-3xl border-muted/20 shadow-sm overflow-hidden">
                <CardHeader className="pb-4">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-base font-black uppercase tracking-tighter">Реестр показателей</CardTitle>
                        <div className="relative w-full max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Поиск бренда..." 
                                className="pl-10 rounded-xl"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-b border-muted/20">
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-500">Бренд</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-500">Общий балл</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-500">Активные знаки</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-500">Ключевая компетенция</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-500 text-right">Детализация</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredBrands.map(brand => {
                                const data = mockQualityData[brand.id] || mockQualityData['nordic']; // fallback
                                const activeCount = data.metrics.filter((m: any) => m.status === 'active').length;
                                return (
                                    <TableRow key={brand.id} className="group cursor-pointer hover:bg-muted/5 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl border bg-white p-1 flex items-center justify-center">
                                                    <img src={brand.logo.url} alt={brand.name} className="h-full w-full object-contain" />
                                                </div>
                                                <span className="font-black uppercase text-xs tracking-tight">{brand.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-12 bg-muted rounded-full overflow-hidden">
                                                    <div 
                                                        className={cn(
                                                            "h-full rounded-full",
                                                            data.score > 90 ? "bg-yellow-500" : data.score > 80 ? "bg-accent" : "bg-slate-400"
                                                        )}
                                                        style={{ width: `${data.score}%` }} 
                                                    />
                                                </div>
                                                <span className="font-black text-sm">{data.score}%</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                {data.metrics.filter((m: any) => m.status === 'active').slice(0, 5).map((m: any) => (
                                                    <div key={m.id} className="h-6 w-6 rounded-md bg-muted/50 flex items-center justify-center text-slate-500">
                                                        {metricIcons[m.id]}
                                                    </div>
                                                ))}
                                                {activeCount > 5 && (
                                                    <div className="h-6 w-6 rounded-md bg-muted/50 flex items-center justify-center text-[8px] font-black">
                                                        +{activeCount - 5}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-black uppercase text-[9px] border-accent/20 text-accent">
                                                {data.metrics[0].id === 'reputation' ? 'Безупречность' : 'Экологичность'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="rounded-xl font-black uppercase text-[9px] group-hover:bg-black group-hover:text-white transition-all"
                                                onClick={() => setSelectedBrand({ ...brand, quality: data })}
                                            >
                                                Просмотр <ChevronRight className="ml-1 h-3 w-3" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Brand Quality Detail Dialog */}
            <Dialog open={!!selectedBrand} onOpenChange={() => setSelectedBrand(null)}>
                <DialogContent className="max-w-4xl p-0 rounded-xl overflow-hidden border-none shadow-2xl">
                    <VisuallyHidden>
                        <DialogTitle>Детализация качества: {selectedBrand?.name}</DialogTitle>
                    </VisuallyHidden>
                    {selectedBrand && (
                        <div className="flex flex-col">
                            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-20 w-20 rounded-2xl bg-white p-2 shrink-0">
                                        <img src={selectedBrand.logo.url} alt={selectedBrand.name} className="h-full w-full object-contain" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-black uppercase tracking-tighter">{selectedBrand.name}</h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge className="bg-yellow-500 text-white border-none font-black text-[10px]">PREMIUM PARTNER</Badge>
                                            <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">ID: {selectedBrand.id}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase text-white/40 mb-1">Глобальный BPI</p>
                                    <p className="text-sm font-black text-yellow-500">{selectedBrand.quality.score}%</p>
                                </div>
                            </div>

                            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 bg-white">
                                <div className="space-y-6">
                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Детализация по 10 параметрам</h4>
                                    <div className="grid grid-cols-1 gap-3">
                                        {selectedBrand.quality.metrics.map((m: any) => (
                                            <div key={m.id} className="flex items-center justify-between p-3 rounded-2xl bg-muted/20 border border-muted/10">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "h-8 w-8 rounded-lg flex items-center justify-center",
                                                        m.status === 'active' ? "bg-accent text-white" : "bg-muted text-slate-400"
                                                    )}>
                                                        {metricIcons[m.id]}
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-tight">{m.id}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-black text-xs">{m.score}%</span>
                                                    <Badge className={cn(
                                                        "text-[8px] font-black h-4",
                                                        m.status === 'active' ? "bg-green-500" : "bg-slate-300"
                                                    )}>
                                                        {m.status === 'active' ? 'OK' : 'WAIT'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Логи нарушений и успехов</h4>
                                    <Card className="rounded-3xl border-muted/20 bg-muted/5 p-4">
                                        <div className="space-y-6">
                                            <div className="flex gap-3">
                                                <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-slate-900">Улучшение логистики</p>
                                                    <p className="text-[11px] text-muted-foreground font-medium mt-1">Время обработки заказов снизилось на 15% за последний месяц.</p>
                                                    <span className="text-[8px] font-bold text-slate-400 uppercase mt-2 block">12 Янв 2024</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-slate-900">Жалоба на качество упаковки</p>
                                                    <p className="text-[11px] text-muted-foreground font-medium mt-1">Клиент сообщил о повреждении коробки при доставке. Требуется проверка упаковочного материала.</p>
                                                    <span className="text-[8px] font-bold text-slate-400 uppercase mt-2 block">08 Янв 2024</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-slate-900">Продление статуса «Репутация»</p>
                                                    <p className="text-[11px] text-muted-foreground font-medium mt-1">Бренд успешно прошел ежеквартальную проверку доверия платформы.</p>
                                                    <span className="text-[8px] font-bold text-slate-400 uppercase mt-2 block">01 Янв 2024</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                    
                                    <div className="flex gap-2">
                                        <Button className="flex-1 rounded-2xl bg-black text-white font-black uppercase text-[10px] h-12">Связаться с брендом</Button>
                                        <Button variant="outline" className="flex-1 rounded-2xl font-black uppercase text-[10px] h-12 border-muted/20">Назначить аудит</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

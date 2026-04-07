"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Factory, TrendingUp, CheckCircle, AlertTriangle, XCircle, MoreHorizontal, Settings, Play, Pause, PlusCircle, Paperclip, MessageSquare, Calendar, ChevronDown, Link as LinkIcon, FileText, FolderArchive, ShieldCheck, Box, Leaf } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { products } from '@/lib/products';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import Link from 'next/link';
import { MaterialsDialog } from './materials-dialog';
import { Timeline, TimelineItem, TimelineConnector, TimelineHeader, TimelineIcon, TimelineTitle, TimelineDescription, TimelineBody } from '../ui/timeline';
import { useAuth } from '@/providers/auth-provider';
import { ProductionArchiveHub } from './production-archive-hub';

const productionData = products.slice(0, 5).map((p, i) => ({
    ...p,
    productionStatus: i === 0 ? 'Пошив' : (i === 1 ? 'Контроль качества' : (i === 2 ? 'Раскрой' : 'Запланировано')),
    units: 500,
    costPerUnit: p.productionCost,
    materialsStatus: i < 2 ? 'ok' : 'pending',
    deadline: `2024-08-${15 + i}`,
    startDate: `2024-07-${20 + i}`,
    factory: i % 2 === 0 ? 'Фабрика #1 (Москва)' : 'Ателье "Стежок" (СПб)',
    comments: [
        { user: 'Марина (Технолог)', text: 'Прошу проверить лекала для размера XL, есть расхождения с ТЗ.', date: '2024-07-25' },
        { user: 'Анна (Менеджер)', text: 'Партия ткани задерживается на 2 дня.', date: '2024-07-26' }
    ]
}));

const statusOrder = ['Запланировано', 'Закупка материалов', 'Разработка лекал', 'Создание сэмпла', 'Раскрой', 'Пошив', 'Контроль качества', 'Упаковка', 'Готово'];

const statusConfig: Record<string, { color: string, progress: number }> = {
    'Запланировано': { color: 'bg-gray-400', progress: 5 },
    'Закупка материалов': { color: 'bg-cyan-400', progress: 15 },
    'Разработка лекал': { color: 'bg-teal-400', progress: 25 },
    'Создание сэмпла': { color: 'bg-blue-400', progress: 35 },
    'Раскрой': { color: 'bg-yellow-400', progress: 50 },
    'Пошив': { color: 'bg-orange-400', progress: 75 },
    'Контроль качества': { color: 'bg-purple-400', progress: 90 },
    'Упаковка': { color: 'bg-indigo-400', progress: 95 },
    'Готово': { color: 'bg-green-500', progress: 100 },
};

export function DigitalProductionView({ collectionId }: { collectionId?: string | null }) {
    const { user } = useAuth();
    const [selectedSku, setSelectedSku] = useState<(typeof productionData)[0] | null>(null);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [isMaterialsDialogOpen, setIsMaterialsDialogOpen] = useState(false);
    const [viewMode, setViewRole] = useState<'details' | 'archive'>('details');

    const effectiveRole = user?.roles?.includes('admin') ? 'admin' : (user?.roles?.includes('manufacturer') ? 'manufacturer' : 'brand');

    const filteredProduction = useMemo(() => {
        let list = productionData;
        
        // Mock filtering by collectionId
        if (collectionId === 'SS26') {
            list = productionData.slice(0, 3);
        } else if (collectionId === 'DROP-UZ') {
            list = productionData.slice(3, 4);
        } else if (collectionId === 'BASIC') {
            list = productionData.slice(4, 5);
        } else if (collectionId) {
            list = []; // New collection
        }

        if (effectiveRole === 'manufacturer') {
            return list.filter(item => item.factory === 'Фабрика #1 (Москва)');
        }
        return list;
    }, [effectiveRole, collectionId]);

    return (
        <TooltipProvider>
            <Card className="rounded-xl border-slate-100 shadow-sm overflow-hidden">
                <CardHeader className="p-4 pb-4">
                    <div className="flex justify-between items-center">
                        <div className="space-y-1">
                            <CardTitle className="text-base font-black uppercase tracking-tight">Цифровое производство</CardTitle>
                            <CardDescription className="text-xs font-medium">
                                {effectiveRole === 'manufacturer' 
                                    ? `Заказы для производства: ${user?.partnerName || 'Фабрика #1'}` 
                                    : (collectionId ? `Мониторинг коллекции: ${collectionId}` : 'Отслеживание всех артикулов (SKU) в производственном цикле.')}
                            </CardDescription>
                        </div>
                        <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] h-10">
                            <PlusCircle className="mr-2 h-4 w-4"/>
                            Новый заказ
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="border-none h-9">
                                <TableHead className="px-8 text-[10px] font-black uppercase text-slate-400 tracking-widest h-9">Артикул</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest h-9">Статус</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest h-9">Производство</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest h-9">Кол-во</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest h-9">Срок</TableHead>
                                <TableHead className="text-right px-8 text-[10px] font-black uppercase text-slate-400 tracking-widest h-9">Действия</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProduction.map(item => (
                                <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors group h-14">
                                    <TableCell onClick={() => { setSelectedSku(item); setViewRole('details'); }} className="cursor-pointer px-8 py-2">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-8 relative rounded-lg overflow-hidden border border-slate-100">
                                                <Image src={item.images[0].url} alt={item.name} fill className="object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-[11px] uppercase leading-none mb-1">{item.name}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{item.sku}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell onClick={() => { setSelectedSku(item); setViewRole('details'); }} className="cursor-pointer py-2">
                                         <div className="flex items-center gap-2">
                                            <div className={cn("h-2 w-2 rounded-full", statusConfig[item.productionStatus]?.color || 'bg-gray-400')}></div>
                                            <span className="text-[10px] font-bold uppercase text-slate-600">{item.productionStatus}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-[10px] font-medium text-slate-500 py-2">{item.factory}</TableCell>
                                    <TableCell className="text-[10px] font-black text-slate-900 py-2">{item.units.toLocaleString('ru-RU')} ед.</TableCell>
                                    <TableCell className="text-[10px] font-bold text-slate-500 py-2">{new Date(item.deadline).toLocaleDateString('ru-RU')}</TableCell>
                                    <TableCell className="text-right px-8 py-2">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white" onClick={() => { setSelectedSku(item); setViewRole('archive'); }}>
                                                <FolderArchive className="h-4 w-4 text-indigo-600" />
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white"><MoreHorizontal className="h-4 w-4"/></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-xl border-slate-100">
                                                    <DropdownMenuItem onClick={() => { setSelectedSku(item); setViewRole('details'); }}>Просмотреть детали</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => { setSelectedSku(item); setViewRole('archive'); }}>Архив производства</DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/brand/products/${item.id}`}>Редактировать товар</Link>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredProduction.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-48 text-center">
                                        <div className="flex flex-col items-center justify-center gap-3 opacity-30">
                                            <Factory className="h-10 w-10 text-slate-300" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Производственные заказы не найдены</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {selectedSku && (
                <Dialog open={!!selectedSku} onOpenChange={(open) => !open && setSelectedSku(null)}>
                    <DialogContent className="max-w-5xl h-[90vh] flex flex-col rounded-xl border-none p-0 overflow-hidden">
                        <DialogHeader className="sr-only">
                            <DialogTitle>Детали производства: {selectedSku.name}</DialogTitle>
                            <DialogDescription>Просмотр этапов производства, чата и документации по артикулу.</DialogDescription>
                        </DialogHeader>
                        <div className="flex h-full">
                            {/* Sidebar / Tabs */}
                            <div className="w-20 border-r border-slate-100 flex flex-col items-center py-4 gap-3 bg-slate-50/50">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className={cn("h-12 w-12 rounded-2xl transition-all", viewMode === 'details' ? "bg-white shadow-md text-indigo-600 border border-slate-100" : "text-slate-400")}
                                    onClick={() => setViewRole('details')}
                                >
                                    <Box className="h-5 w-5" />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className={cn("h-12 w-12 rounded-2xl transition-all", viewMode === 'archive' ? "bg-white shadow-md text-indigo-600 border border-slate-100" : "text-slate-400")}
                                    onClick={() => setViewRole('archive')}
                                >
                                    <FolderArchive className="h-5 w-5" />
                                </Button>
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 flex flex-col">
                                <div className="p-4 flex-1 overflow-y-auto">
                                    {viewMode === 'details' ? (
                                        <div className="space-y-4 animate-in fade-in duration-500">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Badge className="bg-emerald-50 text-emerald-600 border-none text-[9px] font-black uppercase">Live Tracking</Badge>
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedSku.sku}</span>
                                                    </div>
                                                    <h2 className="text-base font-black uppercase tracking-tighter text-slate-900">{selectedSku.name}</h2>
                                                </div>
                                                <Button variant="outline" className="rounded-xl border-slate-200 font-bold uppercase text-[10px] h-10">
                                                    Скачать отчет
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                <div className="md:col-span-2 space-y-6">
                                                    <Card className="rounded-xl border-slate-100 shadow-sm overflow-hidden">
                                                        <CardHeader className="bg-slate-50/50 border-b border-slate-50 p-4">
                                                            <CardTitle className="text-sm font-black uppercase tracking-tight">Этапы производства</CardTitle>
                                                        </CardHeader>
                                                        <CardContent className="p-4">
                                                            <Timeline>
                                                                {statusOrder.map((status, index) => {
                                                                    const currentIndex = statusOrder.indexOf(selectedSku.productionStatus);
                                                                    const isCompleted = index < currentIndex;
                                                                    const isActive = index === currentIndex;
                                                                    const config = statusConfig[status];
                                                                    return(
                                                                    <TimelineItem key={status}>
                                                                        <TimelineConnector />
                                                                        <TimelineHeader>
                                                                            <TimelineIcon className={cn(isCompleted ? "bg-emerald-500 border-emerald-500" : (isActive ? "bg-indigo-600 border-indigo-600" : "bg-white border-slate-200"))}>
                                                                                {isCompleted ? <CheckCircle className="h-3 w-3 text-white"/> : <Factory className={cn("h-3 w-3", isActive ? 'text-white' : 'text-slate-300')}/>}
                                                                            </TimelineIcon>
                                                                            <TimelineTitle className={cn("text-xs font-black uppercase tracking-tight", isActive ? "text-indigo-600" : "text-slate-900")}>{status}</TimelineTitle>
                                                                        </TimelineHeader>
                                                                        <TimelineBody>
                                                                            <p className={cn("text-[10px] font-bold uppercase mb-2", isActive ? 'text-indigo-400': 'text-slate-400')}>
                                                                                {isCompleted ? 'Завершено' : (isActive ? 'В процессе' : 'Ожидает')}
                                                                            </p>
                                                                            {isActive && <Progress value={config.progress} className="h-1 bg-indigo-50" />}
                                                                        </TimelineBody>
                                                                    </TimelineItem>
                                                                )})}
                                                            </Timeline>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                                
                                                <div className="space-y-6">
                                                    <Card className="rounded-xl border-slate-100 shadow-sm">
                                                        <CardHeader className="bg-slate-50/50 border-b border-slate-50 p-4">
                                                            <CardTitle className="text-sm font-black uppercase tracking-tight">Чат по SKU</CardTitle>
                                                        </CardHeader>
                                                        <CardContent className="p-4">
                                                            <div className="space-y-4 h-[300px] overflow-y-auto pr-2 custom-scrollbar mb-4">
                                                                {selectedSku.comments.map((c, i) => (
                                                                    <div key={i} className="space-y-1">
                                                                        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                                                                            <span>{c.user}</span>
                                                                            <span>{c.date}</span>
                                                                        </div>
                                                                        <div className="p-3 bg-slate-50 rounded-2xl text-[11px] font-medium text-slate-600 leading-relaxed">
                                                                            {c.text}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Input placeholder="Ваше сообщение..." className="h-10 text-xs rounded-xl border-slate-200" />
                                                                <Button size="icon" className="h-10 w-10 rounded-xl bg-indigo-600 shadow-lg shadow-indigo-100">
                                                                    <ArrowRight className="h-4 w-4 text-white" />
                                                                </Button>
                                                            </div>
                                                        </CardContent>
                                                    </Card>

                                                    <Card className="rounded-xl border-slate-100 shadow-sm bg-indigo-600 text-white overflow-hidden relative group cursor-pointer" onClick={() => setViewRole('archive')}>
                                                        <div className="absolute top-0 right-0 p-4 opacity-10">
                                                            <FolderArchive className="h-12 w-12" />
                                                        </div>
                                                        <CardContent className="p-4">
                                                            <Badge className="bg-white/20 text-white border-none text-[8px] font-black uppercase mb-2">Centralized Hub</Badge>
                                                            <h4 className="text-sm font-black uppercase tracking-tight mb-1">Архив производства</h4>
                                                            <p className="text-[10px] text-indigo-100 font-medium leading-relaxed">Все ТЗ, лекала и сертификаты в одном месте.</p>
                                                            <Button variant="ghost" className="mt-4 p-0 h-auto text-[10px] font-black uppercase text-white hover:bg-transparent hover:text-indigo-200">
                                                                    Открыть хранилище <ArrowRight className="ml-2 h-3 w-3" />
                                                                </Button>
                                                            </CardContent>
                                                        </Card>

                                                        <Card className="rounded-xl border-slate-100 shadow-sm bg-emerald-600 text-white overflow-hidden relative group">
                                                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                                                <Leaf className="h-12 w-12" />
                                                            </div>
                                                            <CardContent className="p-4">
                                                                <Badge className="bg-white/20 text-white border-none text-[8px] font-black uppercase mb-2">ESG Scorecard</Badge>
                                                                <h4 className="text-sm font-black uppercase tracking-tight mb-1">Эко-рейтинг SKU</h4>
                                                                <div className="flex items-baseline gap-2 mb-4">
                                                                    <span className="text-base font-black tabular-nums">A+</span>
                                                                    <span className="text-[10px] font-bold text-emerald-200 uppercase">Excellent</span>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <div className="flex justify-between text-[9px] font-bold uppercase text-emerald-100">
                                                                        <span>Carbon Footprint</span>
                                                                        <span>0.4kg CO2</span>
                                                                    </div>
                                                                    <Progress value={15} className="h-1 bg-white/20" />
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <ProductionArchiveHub 
                                            sku={{...selectedSku, brand: 'Syntha'}} 
                                            userRole={effectiveRole}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
            
             <MaterialsDialog isOpen={isMaterialsDialogOpen} onOpenChange={setIsMaterialsDialogOpen} />
        </TooltipProvider>
    );
}

// Reuse ArrowRight from lucide-react if needed, or define it locally
function ArrowRight({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

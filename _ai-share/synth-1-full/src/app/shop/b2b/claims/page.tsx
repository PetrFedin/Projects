'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    AlertTriangle, 
    CheckCircle2, 
    Clock, 
    FileText, 
    Camera, 
    Plus, 
    Search, 
    Filter, 
    MessageSquare, 
    ArrowUpRight,
    ShieldAlert,
    Package
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

export default function ClaimsPortalPage() {
    const claims = [
        { id: 'CLM-0012', orderId: 'ORD-8821', brand: 'Nordic Wool', type: 'Damage', status: 'In Review', priority: 'High', date: '12.02.2024', amount: '45,000 ₽' },
        { id: 'CLM-0010', orderId: 'ORD-8790', brand: 'Syntha Lab', type: 'Incorrect SKU', status: 'Resolved', priority: 'Medium', date: '08.02.2024', amount: '12,500 ₽' },
        { id: 'CLM-0008', orderId: 'ORD-8755', brand: 'Radical Chic', type: 'Shortage', status: 'Pending Info', priority: 'Low', date: '01.02.2024', amount: '8,900 ₽' },
    ];

    const [selectedClaimId, setSelectedClaimId] = useState(claims[0].id);
    const activeClaim = claims.find(c => c.id === selectedClaimId) || claims[0];

    return (
        <div className="container mx-auto px-4 py-4 space-y-4 h-[calc(100vh-64px)] flex flex-col">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-base font-black uppercase tracking-tighter text-slate-900">RMA & Claims Portal</h1>
                    <p className="text-slate-500 font-medium italic text-sm">Центр управления рекламациями и возвратами B2B</p>
                </div>
                <Button className="bg-red-600 hover:bg-red-700 h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-red-100 px-8">
                    <Plus className="mr-2 h-4 w-4" /> Создать новую рекламацию
                </Button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 overflow-hidden">
                {/* Left Side - Claims List */}
                <div className="lg:col-span-4 flex flex-col space-y-6 overflow-hidden">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input placeholder="Поиск по ID или бренду..." className="pl-10 h-12 rounded-2xl border-slate-100" />
                    </div>

                    <ScrollArea className="flex-1 pr-4">
                        <div className="space-y-3">
                            {claims.map((claim) => (
                                <div 
                                    key={claim.id}
                                    onClick={() => setSelectedClaimId(claim.id)}
                                    className={cn(
                                        "p-3 rounded-xl border-2 transition-all cursor-pointer",
                                        selectedClaimId === claim.id 
                                            ? "border-red-600 bg-red-50/30 shadow-xl shadow-red-50" 
                                            : "border-slate-50 bg-white hover:border-slate-200"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{claim.id}</p>
                                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{claim.brand}</h3>
                                        </div>
                                        <Badge 
                                            className={cn(
                                                "text-[8px] font-black uppercase border-none px-2 py-0.5",
                                                claim.status === 'Resolved' ? "bg-emerald-100 text-emerald-600" :
                                                claim.status === 'In Review' ? "bg-indigo-100 text-indigo-600" : "bg-amber-100 text-amber-600"
                                            )}
                                        >
                                            {claim.status}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center mt-4">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle className={cn("h-3.5 w-3.5", claim.priority === 'High' ? 'text-red-500' : 'text-amber-500')} />
                                            <span className="text-[10px] font-bold text-slate-600 uppercase">{claim.type}</span>
                                        </div>
                                        <p className="text-xs font-black text-slate-900">{claim.amount}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Right Side - Claim Detail */}
                <div className="lg:col-span-8 overflow-hidden flex flex-col space-y-6">
                    <Card className="rounded-xl border-none shadow-2xl overflow-hidden flex-1 flex flex-col">
                        <CardHeader className="bg-slate-900 text-white p-4 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-base font-black uppercase tracking-tighter">{activeClaim.id}</h2>
                                        <Badge className="bg-red-500 text-white border-none uppercase text-[10px] font-black">{activeClaim.priority} Priority</Badge>
                                    </div>
                                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Order Reference: {activeClaim.orderId}</p>
                                </div>
                                <Button variant="ghost" className="text-white hover:bg-white/10 rounded-xl font-black uppercase text-[10px] tracking-widest h-10">
                                    Скачать PDF <FileText className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        
                        <CardContent className="p-4 flex-1 overflow-y-auto space-y-4">
                            {/* Status Timeline */}
                            <div className="relative pt-8">
                                <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0" />
                                <div className="relative z-10 flex justify-between">
                                    {[
                                        { label: 'Created', date: '12.02', active: true },
                                        { label: 'Evidence Review', date: '13.02', active: true },
                                        { label: 'Warehouse Check', date: '14.02', active: false },
                                        { label: 'Resolution', date: 'TBD', active: false },
                                    ].map((step, i) => (
                                        <div key={i} className="flex flex-col items-center gap-2">
                                            <div className={cn(
                                                "h-10 w-10 rounded-full border-4 border-white shadow-lg flex items-center justify-center transition-colors",
                                                step.active ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-400"
                                            )}>
                                                {step.active ? <CheckCircle2 className="h-5 w-5" /> : <div className="h-2 w-2 rounded-full bg-current" />}
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[10px] font-black uppercase text-slate-900 tracking-tight">{step.label}</p>
                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{step.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                        <ShieldAlert className="h-4 w-4 text-red-500" /> Описание проблемы
                                    </h4>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                                        <p className="text-sm font-medium text-slate-700 leading-relaxed italic">«При распаковке заказа ORD-8821 было обнаружено, что 5 коробок с Cyber Tech Parka имеют повреждения упаковки, а 2 единицы товара имеют механические повреждения рукавов.»</p>
                                        <div className="flex gap-2 pt-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="h-12 w-12 rounded-xl bg-slate-200 overflow-hidden relative group cursor-pointer">
                                                    <Image src={`https://images.unsplash.com/photo-1550246140-5119ae4790b8?q=80&w=200&i=${i}`} alt="Evidence" fill className="object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                        <Maximize2 className="h-4 w-4 text-white" />
                                                    </div>
                                                </div>
                                            ))}
                                            <Button variant="outline" className="h-12 w-12 rounded-xl border-dashed border-slate-300 flex flex-col items-center justify-center gap-1 text-slate-400">
                                                <Camera className="h-4 w-4" />
                                                <span className="text-[7px] font-black uppercase tracking-widest">Add</span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4 text-indigo-600" /> Сообщения по кейсу
                                    </h4>
                                    <ScrollArea className="h-48 bg-slate-50 rounded-xl border border-slate-100 p-4">
                                        <div className="space-y-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[8px] font-black text-indigo-600 uppercase">Brand Support</span>
                                                    <span className="text-[7px] text-slate-400">13.02 14:20</span>
                                                </div>
                                                <p className="text-[10px] text-slate-600 bg-white p-3 rounded-2xl rounded-tl-none shadow-sm">Мы получили ваши фотографии. Запрос передан на склад в Милане для подтверждения состояния при отгрузке.</p>
                                            </div>
                                            <div className="flex flex-col gap-1 items-end">
                                                <div className="flex items-center justify-between w-full">
                                                    <span className="text-[7px] text-slate-400">12.02 16:10</span>
                                                    <span className="text-[8px] font-black text-slate-900 uppercase">You</span>
                                                </div>
                                                <p className="text-[10px] text-white bg-slate-900 p-3 rounded-2xl rounded-tr-none shadow-sm">Фотографии прикреплены к рекламации. Ждем решения.</p>
                                            </div>
                                        </div>
                                    </ScrollArea>
                                    <div className="relative">
                                        <Input placeholder="Ответить по кейсу..." className="h-11 pr-12 rounded-xl border-slate-100" />
                                        <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 text-indigo-600">
                                            <ArrowUpRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Прогноз решения</p>
                                    <p className="text-sm font-black text-indigo-600">Full Replacement / Credit Note</p>
                                </div>
                                <div className="h-8 w-px bg-slate-200" />
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ETA</p>
                                    <p className="text-sm font-black text-slate-900">24-48 hours</p>
                                </div>
                            </div>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl px-12 group">
                                Согласовать решение <CheckCircle2 className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function Maximize2(props: any) {
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
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  )
}

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, MapPin, Box, Truck, Zap, Filter, Search, ShieldCheck, Clock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export default function StockMapPage() {
    const warehouses = [
        { id: 'w1', name: 'Milan Central Hub', location: 'Milan, IT', stock: 12450, status: 'Optimal', type: 'Production', lat: '45.4642', lng: '9.1899' },
        { id: 'w2', name: 'Moscow North', location: 'Moscow, RU', stock: 8200, status: 'Low Stock', type: 'Distribution', lat: '55.7558', lng: '37.6173' },
        { id: 'w3', name: 'Dubai Logistics', location: 'Dubai, UAE', stock: 15900, status: 'Optimal', type: 'Regional Hub', lat: '25.2048', lng: '55.2708' },
        { id: 'w4', name: 'Shanghai Factory', location: 'Shanghai, CN', stock: 45000, status: 'High Stock', type: 'Manufacturing', lat: '31.2304', lng: '121.4737' },
    ];

    const [selectedWarehouse, setSelectedWarehouse] = useState(warehouses[0]);

    return (
        <div className="flex h-[calc(100vh-64px)] bg-[#F8F9FB] overflow-hidden">
            {/* Left Sidebar - Inventory List */}
            <aside className="w-96 bg-white border-r flex flex-col z-10 shadow-2xl">
                <div className="p-4 border-b space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-sm font-black uppercase tracking-tighter text-slate-900">Global Stock</h1>
                        <div className="h-8 w-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Box className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Поиск по складу или SKU..." 
                            className="w-full h-11 pl-10 pr-4 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 rounded-xl text-[10px] font-black uppercase h-10 border-slate-200">
                            <Filter className="mr-2 h-3.5 w-3.5" /> Фильтры
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 rounded-xl text-[10px] font-black uppercase h-10 border-slate-200">
                            <Truck className="mr-2 h-3.5 w-3.5" /> В пути
                        </Button>
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-3">
                        {warehouses.map((w) => (
                            <div 
                                key={w.id}
                                onClick={() => setSelectedWarehouse(w)}
                                className={cn(
                                    "p-3 rounded-xl border-2 transition-all cursor-pointer group",
                                    selectedWarehouse.id === w.id 
                                        ? "border-indigo-600 bg-indigo-50/30 shadow-xl shadow-indigo-100" 
                                        : "border-slate-50 bg-white hover:border-slate-200"
                                )}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{w.type}</p>
                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{w.name}</h3>
                                    </div>
                                    <Badge 
                                        className={cn(
                                            "text-[8px] font-black uppercase border-none px-2 py-0.5",
                                            w.status === 'Optimal' ? "bg-emerald-100 text-emerald-600" :
                                            w.status === 'Low Stock' ? "bg-amber-100 text-amber-600" : "bg-indigo-100 text-indigo-600"
                                        )}
                                    >
                                        {w.status}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Available</p>
                                        <p className="text-sm font-black tabular-nums text-slate-900">{w.stock.toLocaleString('ru-RU')}</p>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Last Sync</p>
                                        <p className="text-xs font-bold text-slate-600">2 min ago</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </aside>

            {/* Main Content - Map Visualization */}
            <main className="flex-1 relative bg-slate-100 overflow-hidden">
                {/* Background Map Simulation */}
                <div className="absolute inset-0 z-0 bg-[#E5E9EC] flex items-center justify-center">
                    <div className="relative w-full h-full opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000">
                        <img src="https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=2000" className="w-full h-full object-cover" alt="World map" />
                    </div>
                    
                    {/* Map Pins */}
                    {warehouses.map((w) => (
                        <div 
                            key={w.id}
                            className="absolute transition-all duration-500"
                            style={{ 
                                top: `${30 + (parseInt(w.id.slice(1)) * 15)}%`, 
                                left: `${20 + (parseInt(w.id.slice(1)) * 20)}%` 
                            }}
                        >
                            <div className={cn(
                                "relative flex items-center justify-center h-12 w-12 rounded-full border-4 border-white shadow-2xl transition-transform hover:scale-125 cursor-pointer",
                                selectedWarehouse.id === w.id ? "bg-indigo-600 scale-125 z-10" : "bg-slate-400 opacity-60"
                            )}>
                                <MapPin className="h-5 w-5 text-white" />
                                {selectedWarehouse.id === w.id && (
                                    <div className="absolute inset-0 bg-indigo-600 rounded-full animate-ping opacity-25" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Floating Detail Panel */}
                <div className="absolute bottom-10 left-10 right-10">
                    <Card className="rounded-xl border-none shadow-2xl bg-white/90 backdrop-blur-xl p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                                        <Globe className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-tighter">{selectedWarehouse.name}</h2>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedWarehouse.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-emerald-600">
                                    <ShieldCheck className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase">Верифицированный узел</span>
                                </div>
                            </div>

                            <div className="space-y-2 border-x border-slate-200 px-8">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Пропускная способность</p>
                                <div className="flex items-end gap-3">
                                    <span className="text-base font-black tabular-nums">85%</span>
                                    <div className="h-2 w-full bg-slate-100 rounded-full mb-2 overflow-hidden">
                                        <div className="h-full bg-indigo-600 w-[85%]" />
                                    </div>
                                </div>
                                <p className="text-[9px] text-slate-500 italic">На 15% выше среднего по региону</p>
                            </div>

                            <div className="space-y-4 px-8 border-r border-slate-200">
                                <div className="flex items-center justify-between">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Средняя отгрузка</p>
                                    <Clock className="h-3.5 w-3.5 text-slate-300" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-black tabular-nums">2.4 дня</p>
                                    <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Express Priority</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 justify-center">
                                <Button className="bg-slate-900 text-white rounded-2xl h-12 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200 group">
                                    Просмотр SKU на складе <Zap className="ml-2 h-4 w-4 transition-transform group-hover:scale-125" />
                                </Button>
                                <Button variant="outline" className="rounded-2xl h-12 font-black uppercase text-[10px] tracking-widest border-slate-200">
                                    Связаться с логистом
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Map Controls */}
                <div className="absolute top-3 right-10 flex flex-col gap-3">
                    <Button size="icon" variant="secondary" className="h-12 w-12 rounded-2xl bg-white shadow-xl border-none text-slate-600">
                        <PlusIcon className="h-6 w-6" />
                    </Button>
                    <Button size="icon" variant="secondary" className="h-12 w-12 rounded-2xl bg-white shadow-xl border-none text-slate-600">
                        <MinusIcon className="h-6 w-6" />
                    </Button>
                </div>
            </main>
        </div>
    );
}

function PlusIcon(props: any) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}

function MinusIcon(props: any) {
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
      <path d="M5 12h14" />
    </svg>
  )
}

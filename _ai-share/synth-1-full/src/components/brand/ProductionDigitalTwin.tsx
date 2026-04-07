'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
    Factory, Video, Cpu, Activity, Zap, 
    Box, Layers, Thermometer, ShieldCheck,
    Play, Info, ArrowUpRight, Maximize2,
    Calendar, Clock, User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const MOCK_SHOP_FLOORS = [
    { id: 'f1', name: 'Cutting Shop A', status: 'Active', load: 82, temp: 24, humidity: 45, items: ['Cyber Parka v2'], workers: 12 },
    { id: 'f2', name: 'Sewing Line 4', status: 'Active', load: 94, temp: 26, humidity: 42, items: ['Neural Cargo'], workers: 28 },
    { id: 'f3', name: 'Quality Control', status: 'Maintenance', load: 0, temp: 22, humidity: 40, items: [], workers: 0 },
];

export function ProductionDigitalTwin({ collectionId }: { collectionId?: string | null }) {
    const floors = useMemo(() => {
        if (!collectionId) return MOCK_SHOP_FLOORS;
        // Mock filtering by collectionId
        if (collectionId === 'SS26') return MOCK_SHOP_FLOORS.slice(0, 2);
        if (collectionId === 'DROP-UZ') return MOCK_SHOP_FLOORS.slice(1, 2);
        if (collectionId === 'BASIC') return MOCK_SHOP_FLOORS.slice(0, 1);
        return [];
    }, [collectionId]);

    const [activeFloor, setActiveFloor] = useState(floors[0] || MOCK_SHOP_FLOORS[0]);

    useEffect(() => {
        if (floors.length > 0) {
            setActiveFloor(floors[0]);
        }
    }, [floors]);

    if (!collectionId || (collectionId && floors.length === 0)) {
        return (
            <div className="space-y-4 pb-20">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-slate-900 rounded-2xl text-white shadow-xl shadow-slate-200">
                                <Cpu className="h-6 w-6" />
                            </div>
                            <h1 className="text-base font-black uppercase tracking-tighter text-slate-900">Production Digital Twin</h1>
                        </div>
                        <p className="text-slate-500 font-medium italic">Виртуальный двойник производства: живой мониторинг цехов и контроль качества в реальном времени.</p>
                    </div>
                </header>
                <Card className="border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/30 flex flex-col items-center justify-center p-20 gap-6 text-center h-[500px]">
                    <div className="h-20 w-20 rounded-3xl bg-white flex items-center justify-center shadow-lg border border-slate-100">
                        <Factory className="h-10 w-10 text-slate-300" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900">Цехи не подключены</h3>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest max-w-xs mx-auto">Для этой коллекции еще не распределены производственные мощности.</p>
                    </div>
                    <Button className="bg-black text-white rounded-xl h-12 px-8 font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-indigo-600 transition-all">Связаться с производством</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-4 pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-900 rounded-2xl text-white shadow-xl shadow-slate-200">
                            <Cpu className="h-6 w-6" />
                        </div>
                        <h1 className="text-base font-black uppercase tracking-tighter text-slate-900">Production Digital Twin</h1>
                    </div>
                    <p className="text-slate-500 font-medium italic">Виртуальный двойник производства: живой мониторинг цехов и контроль качества в реальном времени.</p>
                </div>
                <div className="flex gap-3">
                    <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-emerald-700 uppercase">IoT Core: Connected</span>
                    </div>
                    <Button className="bg-indigo-600 text-white rounded-2xl h-12 px-8 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-100">
                        <Video className="mr-2 h-4 w-4" /> Live Все камеры
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-3">
                {/* Factory Map / Floor List */}
                <div className="xl:col-span-4 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Shop Floors (Milan Hub)</h3>
                        <Badge variant="outline" className="text-[8px] font-black uppercase border-slate-200">3 Floors Online</Badge>
                    </div>
                    <div className="space-y-4">
                        {floors.map((floor) => (
                            <Card 
                                key={floor.id} 
                                onClick={() => setActiveFloor(floor)}
                                className={cn(
                                    "rounded-xl border-none shadow-sm transition-all cursor-pointer group",
                                    activeFloor.id === floor.id ? "bg-slate-900 text-white shadow-2xl scale-[1.02]" : "bg-white hover:bg-slate-50"
                                )}
                            >
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "h-10 w-10 rounded-xl flex items-center justify-center",
                                                activeFloor.id === floor.id ? "bg-white/10" : "bg-slate-100"
                                            )}>
                                                <Factory className={cn("h-5 w-5", activeFloor.id === floor.id ? "text-indigo-400" : "text-slate-400")} />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black uppercase tracking-tight">{floor.name}</p>
                                                <p className={cn("text-[9px] font-bold uppercase", activeFloor.id === floor.id ? "text-slate-400" : "text-slate-400")}>
                                                    {floor.status} • {floor.workers} workers
                                                </p>
                                            </div>
                                        </div>
                                        {floor.status === 'Active' && <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />}
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-[9px] font-black uppercase">
                                            <span className="opacity-40">Floor Load</span>
                                            <span>{floor.load}%</span>
                                        </div>
                                        <Progress value={floor.load} className={cn("h-1", activeFloor.id === floor.id ? "bg-white/10" : "bg-slate-100")} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Digital Twin Viewport */}
                <div className="xl:col-span-8 space-y-4">
                    <Card className="rounded-xl border-none shadow-2xl bg-white overflow-hidden flex flex-col h-[600px]">
                        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Badge className="bg-indigo-600 text-white border-none uppercase text-[8px] font-black px-3 h-6">Live Feed</Badge>
                                <h3 className="text-base font-black uppercase tracking-tight text-slate-900">{activeFloor.name} - View Cam 02</h3>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white shadow-sm"><Maximize2 className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white shadow-sm text-rose-500"><Info className="h-4 w-4" /></Button>
                            </div>
                        </div>
                        <div className="flex-1 bg-slate-900 relative overflow-hidden">
                            {/* Simulated Camera Feed */}
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200')] bg-cover bg-center opacity-60 mix-blend-overlay" />
                            
                            {/* Digital Overlay Labels */}
                            <div className="absolute inset-0 p-3">
                                <motion.div 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="absolute top-20 left-40 p-4 bg-indigo-600/80 backdrop-blur-md rounded-2xl border border-indigo-400 text-white shadow-2xl"
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <Box className="h-3 w-3" />
                                        <span className="text-[8px] font-black uppercase">Batch ID: #CYBER-26-A</span>
                                    </div>
                                    <p className="text-[10px] font-black uppercase">Cyber Parka v2 (Cutting)</p>
                                    <p className="text-[8px] font-bold text-white/60 uppercase mt-1">Progress: 84%</p>
                                </motion.div>

                                <div className="absolute bottom-10 right-10 flex gap-3">
                                    <div className="p-4 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 text-white min-w-[120px]">
                                        <div className="flex items-center gap-2 opacity-40 mb-2">
                                            <Thermometer className="h-3.5 w-3.5" />
                                            <span className="text-[8px] font-black uppercase">Temp</span>
                                        </div>
                                        <p className="text-base font-black">{activeFloor.temp}°C</p>
                                    </div>
                                    <div className="p-4 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 text-white min-w-[120px]">
                                        <div className="flex items-center gap-2 opacity-40 mb-2">
                                            <Activity className="h-3.5 w-3.5" />
                                            <span className="text-[8px] font-black uppercase">Humidity</span>
                                        </div>
                                        <p className="text-base font-black">{activeFloor.humidity}%</p>
                                    </div>
                                </div>
                            </div>

                            {/* Scanline Effect */}
                            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%]" />
                        </div>
                        <CardFooter className="p-4 bg-white border-t border-slate-50 grid grid-cols-3 gap-3">
                            <div className="space-y-2">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Batch</p>
                                <p className="text-sm font-black text-slate-900 uppercase">Cyber Parka v2</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Est. Completion</p>
                                <p className="text-sm font-black text-indigo-600 uppercase">Today, 18:00</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Quality Check</p>
                                <div className="flex items-center gap-2 text-emerald-600">
                                    <ShieldCheck className="h-4 w-4" />
                                    <span className="text-sm font-black uppercase">Passed (99.2%)</span>
                                </div>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}

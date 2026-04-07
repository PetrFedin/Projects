"use client";

import { DigitalProductionView } from "@/components/brand/digital-production-view";
import { Factory, Activity, Zap, Cpu, Settings2, Leaf, Box, Database, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { MtoBridge } from "@/components/factory/mto-bridge";

export default function ProductionPage() {
    return (
        <div className="space-y-4">
             <header className="flex justify-between items-end">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                        <Factory className="h-5 w-5 text-indigo-600" />
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Core Production Engine</span>
                    </div>
                    <h1 className="text-base font-black font-headline uppercase tracking-tighter">Линии пошива</h1>
                    <p className="text-muted-foreground text-sm font-medium">Мониторинг производственных потоков, мощностей и этапов сборки в реальном времени.</p>
                </div>
                <div className="flex gap-3">
                    <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black text-[10px] uppercase h-8 px-4 flex items-center gap-2">
                        <Activity className="h-3 w-3 animate-pulse" /> IoT Hub: Online
                    </Badge>
                    <Button variant="outline" className="h-8 text-[10px] font-black uppercase rounded-lg border-slate-200">
                        <Settings2 className="h-3.5 w-3.5 mr-2" /> Настроить сенсоры
                    </Button>
                </div>
            </header>

            <MtoBridge />

            {/* IoT Real-time Feed Widget */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {[
                    { line: "Line A-1", efficiency: "94%", status: "Optimal", speed: "120 ops/h" },
                    { line: "Line A-2", efficiency: "88%", status: "Optimal", speed: "105 ops/h" },
                    { line: "Line B-1", efficiency: "72%", status: "Warning", speed: "82 ops/h" },
                    { line: "Line C-4", efficiency: "98%", status: "Ultra", speed: "142 ops/h" },
                ].map((l, i) => (
                    <Card key={i} className="rounded-2xl border-slate-100 shadow-sm overflow-hidden relative">
                        <div className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div className="space-y-0.5">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{l.line}</p>
                                    <h4 className="text-sm font-black">{l.efficiency}</h4>
                                </div>
                                <Badge variant="outline" className={cn(
                                    "text-[8px] font-black uppercase",
                                    l.status === "Optimal" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                    l.status === "Ultra" ? "bg-indigo-50 text-indigo-600 border-indigo-100" :
                                    "bg-rose-50 text-rose-600 border-rose-100"
                                )}>
                                    {l.status}
                                </Badge>
                            </div>
                            <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: l.efficiency }}
                                    className={cn(
                                        "h-full rounded-full",
                                        l.status === "Optimal" ? "bg-emerald-500" :
                                        l.status === "Ultra" ? "bg-indigo-500" :
                                        "bg-rose-500"
                                    )}
                                />
                            </div>
                            <p className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                                <Cpu className="h-3 w-3" /> {l.speed}
                            </p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Sustainability & Fabric Hub */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Card className="rounded-xl border-slate-100 shadow-sm bg-emerald-50/30 overflow-hidden group">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-12 w-12 rounded-3xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                            <Leaf className="h-8 w-8" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <Badge className="bg-emerald-100 text-emerald-700 border-none text-[8px] font-black uppercase">EU Standard 2026</Badge>
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">ESG Tracker</span>
                            </div>
                            <h3 className="text-base font-black uppercase tracking-tight">Carbon Footprint Auto-Calculator</h3>
                            <p className="text-xs text-slate-500 font-medium mt-1">Авто-расчет углеродного следа каждой партии на основе логистики и типа сырья.</p>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-emerald-100">
                            <ArrowRight className="h-5 w-5 text-emerald-600" />
                        </Button>
                    </CardContent>
                </Card>

                <Card className="rounded-xl border-slate-100 shadow-sm bg-indigo-50/30 overflow-hidden group">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-12 w-12 rounded-3xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                            <Database className="h-8 w-8" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <Badge className="bg-indigo-100 text-indigo-700 border-none text-[8px] font-black uppercase">CLO3D Sync</Badge>
                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Asset Hub</span>
                            </div>
                            <h3 className="text-base font-black uppercase tracking-tight">Digital Fabric Swatch Library</h3>
                            <p className="text-xs text-slate-500 font-medium mt-1">Цифровые свойства тканей для мгновенного импорта в 3D PLM системы.</p>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-indigo-100">
                            <ArrowRight className="h-5 w-5 text-indigo-600" />
                        </Button>
                    </CardContent>
                </Card>
            </div>
            
            <div className="animate-in fade-in duration-700">
                <DigitalProductionView />
            </div>
        </div>
    );
}

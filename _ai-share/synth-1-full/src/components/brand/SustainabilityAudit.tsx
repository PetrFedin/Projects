'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Leaf, 
  Droplets, 
  Wind, 
  ShieldCheck, 
  Zap, 
  ArrowUpRight,
  TrendingDown,
  Globe,
  Award,
  BarChart3,
  Factory
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function SustainabilityAudit() {
  const METRICS = [
    { label: 'CO2 Footprint', value: '4.2 kg', target: '3.8 kg', trend: 'down', status: 'optimal', icon: Wind, color: 'text-sky-500', bg: 'bg-sky-50' },
    { label: 'Water Usage', value: '250 L', target: '400 L', trend: 'down', status: 'excellent', icon: Droplets, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Recycled Fiber', value: '45%', target: '60%', trend: 'up', status: 'warning', icon: Leaf, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Factory Rating', value: 'A+', target: 'A', trend: 'stable', status: 'optimal', icon: Factory, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  return (
    <Card className="border border-slate-100 shadow-sm rounded-xl bg-white overflow-hidden h-full group">
      <CardHeader className="p-4 border-b border-slate-50 bg-emerald-50/20 flex flex-row items-center justify-between">
        <div className="space-y-0.5">
          <CardTitle className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 text-slate-900">
            <Leaf className="w-4 h-4 text-emerald-600" />
            Экологический аудит (ESG Score)
          </CardTitle>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">Влияние на среду и соответствие стандартам.</p>
        </div>
        <Badge className="bg-emerald-500 text-white border-none font-black text-[8px] uppercase px-2 h-5 tracking-widest shadow-lg shadow-emerald-200">B+ GRADE</Badge>
      </CardHeader>
      
      <CardContent className="p-4 space-y-5">
        <div className="grid grid-cols-2 gap-3">
          {METRICS.map((metric, i) => (
            <div key={i} className="p-3 bg-slate-50/50 rounded-xl border border-slate-100/50 space-y-2 hover:bg-white hover:border-emerald-100 hover:shadow-sm transition-all group/metric">
              <div className="flex justify-between items-center">
                <div className={cn("p-1.5 rounded-lg shadow-sm group-hover/metric:scale-110 transition-transform", metric.bg, metric.color)}>
                  <metric.icon className="h-3.5 w-3.5" />
                </div>
                {metric.trend === 'down' && <TrendingDown className="h-3 w-3 text-emerald-500" />}
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase text-slate-400 tracking-widest leading-none mb-1">{metric.label}</p>
                <p className="text-xs font-black text-slate-900 tabular-nums">{metric.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 relative overflow-hidden group/dark shadow-xl shadow-slate-200/50">
           <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-8 translate-x-8 blur-2xl group-hover/dark:bg-emerald-500/10 transition-all"></div>
           <div className="relative z-10 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-400 shadow-lg" />
                <span className="text-[10px] font-black uppercase tracking-widest">Цифровой паспорт</span>
             </div>
             <Zap className="h-3 w-3 text-indigo-400 animate-pulse fill-indigo-400" />
           </div>
           <p className="text-[9px] leading-relaxed text-slate-300 font-bold uppercase tracking-tight relative z-10">
             Данные аудита автоматически синхронизируются с QR-кодом Digital Product Passport для конечного покупателя.
           </p>
           <Button variant="ghost" className="w-full h-8 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] transition-all gap-2 group/btn">
             Просмотр паспорта <ArrowUpRight className="h-3 w-3 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
           </Button>
        </div>

        <div className="flex items-center gap-2 text-[8px] font-bold text-slate-400 uppercase tracking-widest justify-center">
           <ShieldCheck className="h-3 w-3 text-emerald-500" /> Сертифицировано: OEKO-TEX Standard 100
        </div>
      </CardContent>
    </Card>
  );
}

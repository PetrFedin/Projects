'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FlaskConical, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  ChevronRight,
  Download,
  ShieldCheck,
  Scale,
  Droplets,
  Wind,
  Settings2,
  FileSearch,
  Maximize2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function FabricLabTests() {
  const TESTS = [
    { label: 'Pilling Resistance', value: '4.5/5', status: 'pass', icon: FlaskConical },
    { label: 'Color Fastness', value: '4/5', status: 'pass', icon: Droplets },
    { label: 'Shrinkage (Wash)', value: '-1.5%', status: 'warning', icon: Scale },
    { label: 'Breathability', value: '850 g/m²', status: 'pass', icon: Wind },
  ];

  return (
    <Card className="border border-slate-100 shadow-sm rounded-xl bg-white overflow-hidden h-full group">
      <CardHeader className="p-4 border-b border-slate-50 bg-indigo-50/20 flex flex-row items-center justify-between">
        <div className="space-y-0.5">
          <CardTitle className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 text-slate-900">
            <FlaskConical className="w-4 h-4 text-indigo-600" />
            Лабораторные тесты полотна (Quality Lab)
          </CardTitle>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">Протоколы испытаний и соответствие ТЗ.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white shadow-sm border border-slate-100"><Download className="h-3.5 w-3.5" /></Button>
           <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white shadow-sm border border-slate-100"><FileSearch className="h-3.5 w-3.5" /></Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {TESTS.map((test, i) => (
            <div key={i} className={cn(
              "p-3 rounded-xl border flex flex-col justify-between transition-all",
              test.status === 'pass' ? "bg-slate-50 border-slate-100 hover:border-emerald-200" : "bg-amber-50 border-amber-100 hover:border-amber-200"
            )}>
               <div className="flex justify-between items-start mb-2">
                 <div className={cn("p-1.5 rounded-lg", test.status === 'pass' ? "bg-emerald-50 text-emerald-600" : "bg-amber-100 text-amber-600")}>
                    <test.icon className="h-3 w-3" />
                 </div>
                 {test.status === 'pass' ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <AlertCircle className="h-3 w-3 text-amber-500" />}
               </div>
               <div className="space-y-0.5">
                 <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none">{test.label}</p>
                 <p className="text-xs font-black text-slate-900 tabular-nums">{test.value}</p>
               </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-slate-900 text-white rounded-xl space-y-2 relative overflow-hidden group/dark shadow-lg shadow-slate-200/50">
           <div className="relative z-10 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-indigo-400">
              <Zap className="h-3 w-3 fill-indigo-400 animate-pulse" /> AI Lab Assistant
           </div>
           <p className="text-[9px] leading-relaxed text-slate-300 font-bold uppercase tracking-tight relative z-10">
             Усадка в -1.5% выше стандартной нормы. Рекомендуется декатировка паром при 120°C перед раскроем.
           </p>
           <Button variant="ghost" className="w-full h-7 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] transition-all shadow-md">
             Печать ТЗ для цеха
           </Button>
        </div>

        <div className="flex items-center gap-2 text-[8px] font-bold text-slate-400 uppercase tracking-widest justify-center">
           <ShieldCheck className="h-3 w-3 text-indigo-500" /> Лаборатория: SGS / Intertek (РФ)
        </div>
      </CardContent>
    </Card>
  );
}

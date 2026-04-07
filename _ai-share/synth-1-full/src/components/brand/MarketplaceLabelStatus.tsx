'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  ChevronRight,
  ArrowRight,
  Download,
  Barcode,
  ArrowRightLeft,
  Truck,
  Package,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function MarketplaceLabelStatus() {
  const MARKETPLACES = [
    { name: 'Wildberries', status: 'Ready', count: '1,240 КМ', icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
    { name: 'Ozon', status: 'In Review', count: '850 КМ', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { name: 'Lamoda', status: 'Pending', count: '0 КМ', icon: ShoppingBag, color: 'text-slate-900', bg: 'bg-slate-50', border: 'border-slate-100' },
  ];

  return (
    <Card className="border border-slate-100 shadow-sm rounded-xl bg-white overflow-hidden h-full group">
      <CardHeader className="p-4 border-b border-slate-50 bg-indigo-50/20 flex flex-row items-center justify-between">
        <div className="space-y-0.5">
          <CardTitle className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 text-slate-900">
            <Barcode className="w-4 h-4 text-indigo-600" />
            Этикетки Маркетплейсов (WB/Ozon/LMD)
          </CardTitle>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">Генерация штрих-кодов и стикеров для маркетплейсов.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white shadow-sm border border-slate-100"><Download className="h-3.5 w-3.5" /></Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          {MARKETPLACES.map((mp, i) => (
            <div key={i} className={cn(
              "p-3 rounded-xl border flex justify-between items-center transition-all cursor-pointer group/mp",
              mp.bg, mp.border
            )}>
               <div className="flex items-center gap-3">
                 <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shadow-sm", mp.color, "bg-white border border-slate-100")}>
                    <mp.icon className="h-4 w-4" />
                 </div>
                 <div className="space-y-0.5">
                   <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{mp.name}</p>
                   <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{mp.count}</p>
                 </div>
               </div>
               <div className="flex items-center gap-4">
                  <Badge className={cn(
                    "text-[7px] font-black uppercase px-1 h-3.5 border-none",
                    mp.status === 'Ready' ? "bg-emerald-500 text-white" : 
                    mp.status === 'In Review' ? "bg-amber-500 text-white" : "bg-slate-200 text-slate-400"
                  )}>{mp.status}</Badge>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover/mp:text-indigo-600 transition-colors" />
               </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 relative overflow-hidden group/dark shadow-xl shadow-slate-200/50">
           <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-8 translate-x-8 blur-2xl group-hover/dark:bg-indigo-500/10 transition-all"></div>
           <div className="relative z-10 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400 animate-pulse fill-amber-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">Auto-Aggregation AI</span>
           </div>
           <p className="text-[9px] leading-relaxed text-slate-300 font-bold uppercase tracking-tight relative z-10">
             Генерация коробов и паллетных листов с привязкой КИЗ Честного Знака.
           </p>
           <Button className="w-full h-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[8px] font-black uppercase tracking-[0.2em] transition-all shadow-lg border-none">
             Сформировать поставку <ArrowRight className="h-3 w-3" />
           </Button>
        </div>

        <div className="flex items-center gap-2 text-[8px] font-bold text-slate-400 uppercase tracking-widest justify-center">
           <ShieldCheck className="h-3 w-3 text-indigo-500" /> Интегрировано с ГИС МТ и API Маркетплейсов
        </div>
      </CardContent>
    </Card>
  );
}

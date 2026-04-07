'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  AlertTriangle, 
  MapPin, 
  TrendingUp, 
  BarChart3, 
  Layers, 
  Maximize2,
  ChevronRight,
  ShieldAlert,
  Zap,
  CheckCircle2,
  Box,
  FileWarning,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { createCAPA } from "@/lib/production/plm-extended";

const ZONE_TO_DEFECT_CODE: Record<string, string> = {
  Sleeve: 'SEAM_SLEEVE',
  Shoulder: 'FIT_SHOULDER',
  Collar: 'COLLAR_ALIGN',
  Hem: 'HEM_QUALITY',
};

export function DefectHeatmap() {
  const [activeZone, setActiveZone] = useState<string | null>('Sleeve');
  const [capaOpen, setCapaOpen] = useState(false);
  const [capaForm, setCapaForm] = useState({ description: '', action_type: 'process_change' });
  const [capaLoading, setCapaLoading] = useState(false);
  
  const DEFECT_ZONES = [
    { name: 'Sleeve', count: 12, rate: '2.5%', trend: 'up', severity: 'medium', color: 'bg-amber-400' },
    { name: 'Shoulder', count: 4, rate: '0.8%', trend: 'down', severity: 'low', color: 'bg-emerald-400' },
    { name: 'Collar', count: 18, rate: '3.7%', trend: 'up', severity: 'high', color: 'bg-rose-500' },
    { name: 'Hem', count: 2, rate: '0.4%', trend: 'stable', severity: 'low', color: 'bg-slate-200' },
  ];

  const RECENT_LOSSES = [
    { id: 'L-001', type: 'sewing', item: 'Collar Alignment', batch: 'PO-26-012', status: 'In Review' },
    { id: 'L-002', type: 'material', item: 'Fabric Spotting', batch: 'PO-26-015', status: 'Confirmed' },
  ];

  return (
    <Card className="border border-slate-100 shadow-sm rounded-xl bg-white overflow-hidden h-full group">
      <CardHeader className="p-4 border-b border-slate-50 bg-rose-50/20 flex flex-row items-center justify-between">
        <div className="space-y-0.5">
          <CardTitle className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 text-slate-900">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            Карта дефектов (Quality Heatmap)
          </CardTitle>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">Анализ зон риска и причин брака по модели.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white shadow-sm border border-slate-100"><Maximize2 className="h-3.5 w-3.5" /></Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Schematic Diagram (Abstract Mock) */}
          <div className="relative aspect-[3/4] bg-slate-100 rounded-2xl border border-slate-200 p-4 flex items-center justify-center group/schematic">
             <Box className="h-full w-full text-slate-200" />
             
             {/* Heatmap Points */}
             <div className="absolute top-[20%] left-[45%] h-4 w-4 bg-rose-500 rounded-full animate-pulse shadow-lg shadow-rose-500/50 cursor-pointer hover:scale-150 transition-transform" />
             <div className="absolute top-[40%] left-[20%] h-3 w-3 bg-amber-400 rounded-full shadow-lg shadow-amber-400/50 cursor-pointer hover:scale-150 transition-transform" />
             <div className="absolute top-[40%] right-[20%] h-3 w-3 bg-amber-400 rounded-full shadow-lg shadow-amber-400/50 cursor-pointer hover:scale-150 transition-transform" />
             <div className="absolute bottom-[20%] left-[50%] -translate-x-1/2 h-2 w-2 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50 cursor-pointer hover:scale-150 transition-transform" />

             <div className="absolute inset-x-0 bottom-3 px-3">
                <div className="bg-white/80 backdrop-blur-md rounded-lg p-2 border border-slate-200 shadow-sm flex items-center justify-between">
                   <div className="space-y-0.5">
                      <p className="text-[7px] font-black uppercase text-slate-400 tracking-widest">Selected Zone</p>
                      <p className="text-[9px] font-bold text-slate-900 uppercase">Collar (Воротник)</p>
                   </div>
                   <Badge className="bg-rose-100 text-rose-600 border-none text-[8px] font-black uppercase px-1 h-3.5 shadow-sm">CRITICAL</Badge>
                </div>
             </div>
          </div>

          {/* Statistics & Legend */}
          <div className="space-y-4 flex flex-col justify-center">
            <div className="space-y-2">
              <h5 className="text-[9px] font-black uppercase tracking-widest text-slate-400">Топ зон брака</h5>
              <div className="space-y-2">
                {DEFECT_ZONES.map((zone, i) => (
                  <div key={i} className={cn(
                    "p-2.5 rounded-xl border transition-all cursor-pointer group/zone flex items-center justify-between",
                    activeZone === zone.name ? "bg-white border-rose-200 shadow-sm" : "bg-slate-50 border-slate-100 opacity-60 hover:opacity-100"
                  )} onClick={() => setActiveZone(zone.name)}>
                    <div className="flex items-center gap-2">
                      <div className={cn("h-2 w-2 rounded-full", zone.color)} />
                      <p className="text-[9px] font-black text-slate-900 uppercase tracking-tight">{zone.name}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[9px] font-bold text-slate-900 tabular-nums">{zone.rate}</p>
                       <div className="flex items-center gap-1 justify-end">
                         {zone.trend === 'up' && <TrendingUp className="h-2 w-2 text-rose-500" />}
                         <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">{zone.count} cases</p>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-900 text-white rounded-xl space-y-2 relative overflow-hidden group/dark shadow-lg shadow-slate-200/50">
               <div className="relative z-10 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-indigo-400">
                  <Zap className="h-3 w-3 fill-indigo-400 animate-pulse" /> AI Auditor
               </div>
               <p className="text-[9px] leading-relaxed text-slate-300 font-bold uppercase tracking-tight relative z-10">
                 Причина брака: Нестабильное натяжение нити на участке №4.
               </p>
               <Button className="w-full h-7 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] transition-all shadow-md">
                 Открыть QC Отчет
               </Button>
               <Button
                 className="w-full h-7 bg-amber-500/80 hover:bg-amber-500 text-white border border-amber-400/50 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] transition-all shadow-md mt-1.5 flex items-center justify-center gap-1.5"
                 onClick={() => setCapaOpen(true)}
               >
                 <FileWarning className="h-3 w-3" /> Создать CAPA
               </Button>
            </div>

            <Dialog open={capaOpen} onOpenChange={setCapaOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>CAPA — корректирующее действие</DialogTitle>
                </DialogHeader>
                <p className="text-[10px] text-slate-500">Зона: <strong>{activeZone}</strong></p>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label className="text-[10px]">Описание</Label>
                    <Input
                      value={capaForm.description}
                      onChange={e => setCapaForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="Например: Провести инструктаж по натяжению нити"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px]">Тип действия</Label>
                    <select
                      value={capaForm.action_type}
                      onChange={e => setCapaForm(f => ({ ...f, action_type: e.target.value }))}
                      className="mt-1 w-full h-9 rounded-md border border-input px-3 text-sm"
                    >
                      <option value="training">Обучение</option>
                      <option value="process_change">Изменение процесса</option>
                      <option value="tool_replacement">Замена инструмента</option>
                    </select>
                  </div>
                </div>
                <Button
                  onClick={async () => {
                    setCapaLoading(true);
                    try {
                      await createCAPA({
                        defect_type_code: activeZone ? ZONE_TO_DEFECT_CODE[activeZone] || 'DEFECT_OTHER' : 'DEFECT_OTHER',
                        description: capaForm.description || 'Корректирующее действие',
                        action_type: capaForm.action_type,
                      });
                      setCapaOpen(false);
                      setCapaForm({ description: '', action_type: 'process_change' });
                    } finally {
                      setCapaLoading(false);
                    }
                  }}
                  disabled={capaLoading}
                >
                  {capaLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  <span className="ml-2">Создать CAPA</span>
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

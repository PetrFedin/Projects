'use client';

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  Video, 
  Ruler, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  History, 
  ArrowRight,
  User,
  Clock,
  ChevronRight,
  Info,
  Maximize2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface FittingLogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  productName?: string;
  sku?: string;
}

export function FittingLog({ 
  isOpen, 
  onOpenChange, 
  productName = "Urban Jacket SS26",
  sku = "TP-9921" 
}: FittingLogProps) {
  const [activeProto, setActiveProto] = useState('Proto 2');
  
  const FITTING_HISTORY = [
    { id: 1, type: 'Proto 1', date: '20.02.2026', status: 'Approved with changes', notes: 'Укоротить рукав на 1.5см, изменить форму воротника.', images: 3, model: 'Elena K. (S)' },
    { id: 2, type: 'Proto 2', date: '10.03.2026', status: 'In Progress', notes: 'Проверка посадки плечевого пояса и длины изделия.', images: 5, model: 'Elena K. (S)' },
  ];

  const MEASUREMENTS = [
    { label: 'Длина по спинке', spec: '72.0', proto1: '73.5', proto2: '72.2', diff: '+0.2', status: 'success' },
    { label: 'Ширина плеч', spec: '45.0', proto1: '45.0', proto2: '45.5', diff: '+0.5', status: 'warning' },
    { label: 'Длина рукава', spec: '64.0', proto1: '65.5', proto2: '64.0', diff: '0.0', status: 'success' },
    { label: 'Ширина груди', spec: '52.0', proto1: '52.0', proto2: '51.5', diff: '-0.5', status: 'warning' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] bg-white border-none rounded-2xl p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="p-6 bg-slate-900 text-white relative">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-900/20">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-black uppercase tracking-tighter">Журнал примерок (Fitting Log)</DialogTitle>
              <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                Контроль посадки и конструктивные правки для {productName}
              </DialogDescription>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            {['Proto 1', 'Proto 2', 'SMS', 'PPS', 'Golden Sample'].map((p) => (
              <Button 
                key={p} 
                variant="ghost" 
                onClick={() => setActiveProto(p)}
                className={cn(
                  "h-7 px-3 rounded-lg text-[9px] font-black uppercase transition-all",
                  activeProto === p ? "bg-indigo-600 text-white shadow-lg" : "bg-white/5 text-slate-400 hover:bg-white/10"
                )}
              >
                {p}
              </Button>
            ))}
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-5 gap-0">
          {/* History Sidebar */}
          <div className="md:col-span-2 p-6 border-r border-slate-100 bg-slate-50/30 space-y-6">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                <History className="h-3.5 w-3.5 text-indigo-500" /> История итераций
              </h4>
              <div className="space-y-3">
                {FITTING_HISTORY.map((h) => (
                  <div key={h.id} className={cn(
                    "p-3 rounded-xl border transition-all cursor-pointer group",
                    activeProto === h.type ? "bg-white border-indigo-200 shadow-sm" : "bg-transparent border-transparent opacity-60 hover:opacity-100"
                  )}>
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{h.type}</p>
                      <Badge className={cn(
                        "text-[7px] font-black uppercase px-1 h-3.5 border-none",
                        h.status.includes('Approved') ? "bg-emerald-50 text-emerald-600" : "bg-indigo-50 text-indigo-600"
                      )}>{h.status}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" /> {h.date}</span>
                      <span className="flex items-center gap-1"><User className="h-2.5 w-2.5" /> {h.model}</span>
                    </div>
                    <p className="text-[9px] text-slate-600 font-medium leading-relaxed italic line-clamp-2">"{h.notes}"</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full h-9 border-dashed border-slate-300 text-slate-400 text-[9px] font-black uppercase rounded-xl hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all gap-2">
                <Plus className="h-3 w-3" /> Добавить примерку
              </Button>
            </div>
          </div>

          {/* Main Content: Measurements & Media */}
          <div className="md:col-span-3 p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                  <Ruler className="h-3.5 w-3.5 text-indigo-500" /> Табель мер (Proto 2)
                </h4>
                <Badge variant="outline" className="text-slate-400 border-slate-200 text-[8px] font-bold">Спец. EU S</Badge>
              </div>
              <div className="space-y-1 bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                <div className="grid grid-cols-4 p-2.5 bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest">
                  <div className="col-span-1">Параметр</div>
                  <div className="text-center">Spec</div>
                  <div className="text-center">Proto 2</div>
                  <div className="text-right">Diff</div>
                </div>
                {MEASUREMENTS.map((m, idx) => (
                  <div key={idx} className="grid grid-cols-4 p-2.5 border-b border-slate-100 last:border-none text-[10px] font-bold uppercase tracking-tight hover:bg-white transition-colors">
                    <div className="col-span-1 text-slate-500">{m.label}</div>
                    <div className="text-center text-slate-400 tabular-nums">{m.spec}</div>
                    <div className="text-center text-slate-900 tabular-nums">{m.proto2}</div>
                    <div className={cn(
                      "text-right tabular-nums",
                      m.status === 'success' ? "text-emerald-500" : "text-amber-500"
                    )}>{m.diff}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                  <Camera className="h-3.5 w-3.5 text-indigo-500" /> Фото/Видео обзоры
                </h4>
                <Button variant="ghost" className="h-6 px-2 text-[8px] font-black uppercase text-indigo-600 gap-1"><Video className="h-3 w-3" /> Все медиа</Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square bg-slate-100 rounded-xl relative group overflow-hidden border border-slate-200">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 backdrop-blur-[2px] transition-all cursor-pointer">
                      <Maximize2 className="h-4 w-4 text-white" />
                    </div>
                    <div className="absolute bottom-1 right-1 p-0.5 bg-black/50 rounded-md">
                      <Video className="h-2 w-2 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-6 w-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center">
                    <User className="h-3 w-3 text-slate-400" />
                  </div>
                ))}
             </div>
             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">3 участника согласования</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="h-10 border-slate-200 rounded-xl font-black uppercase text-[10px] tracking-widest text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all">На доработку</Button>
            <Button className="h-10 bg-indigo-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all gap-2">
              Утвердить Proto 2 <CheckCircle2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

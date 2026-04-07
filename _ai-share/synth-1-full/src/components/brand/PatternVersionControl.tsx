'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileCode2, 
  History, 
  User, 
  Clock, 
  ArrowUpRight,
  Download,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertCircle,
  FileSearch,
  Maximize2,
  Box
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function PatternVersionControl({ collectionId }: { collectionId?: string | null }) {
  const versions = React.useMemo(() => {
    if (!collectionId || collectionId === 'ARCHIVE') return [];
    if (collectionId === 'SS26') {
      return [
        { id: 'v2.4', date: '08.03.2026', user: 'Mark L.', change: 'Увеличен припуск на швы рукава до 1.2см. Исправлена дуга проймы.', status: 'approved', icon: CheckCircle2 },
        { id: 'v2.3', date: '01.03.2026', user: 'Mark L.', change: 'Добавлены лекала для подкладки. Оптимизация раскладки.', status: 'archive', icon: History },
        { id: 'v2.2', date: '15.02.2026', user: 'Ivan S.', change: 'Базовая конструкция (EU 38). Первичный драфт.', status: 'archive', icon: History },
      ];
    }
    return [];
  }, [collectionId]);

  const handleAction = (title: string, desc: string) => {
    // In a real app this would call a toast or open a modal
    console.log(title, desc);
  };

  return (
    <Card className="border border-slate-100 shadow-sm rounded-xl bg-white overflow-hidden h-full group">
      <CardHeader className="p-4 border-b border-slate-50 bg-indigo-50/20 flex flex-row items-center justify-between">
        <div className="space-y-0.5">
          <CardTitle className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 text-slate-900">
            <FileCode2 className="w-4 h-4 text-indigo-600" />
            Версионный контроль лекал (CAD)
          </CardTitle>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">История изменений конструкторской документации.</p>
        </div>
        <div className="flex gap-2">
           <Button onClick={() => handleAction("Экспорт", "Подготовка файлов DXF/AAMA для экспорта...")} variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white shadow-sm border border-slate-100"><Download className="h-3.5 w-3.5" /></Button>
           <Button onClick={() => handleAction("Просмотр", "Открытие 3D-вьювера Clo3D...")} variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white shadow-sm border border-slate-100"><FileSearch className="h-3.5 w-3.5" /></Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        <div className="space-y-3">
          {versions.map((v, i) => (
            <div key={i} className={cn(
              "p-3 rounded-xl border transition-all cursor-pointer group/version relative overflow-hidden",
              v.status === 'approved' ? "bg-white border-indigo-200 shadow-sm ring-1 ring-indigo-50" : "bg-slate-50/50 border-slate-100 opacity-60 hover:opacity-100 hover:bg-white"
            )}>
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <div className={cn("h-6 w-6 rounded-lg flex items-center justify-center shadow-sm", v.status === 'approved' ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500")}>
                    <v.icon className="h-3 w-3" />
                  </div>
                  <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{v.id}</p>
                </div>
                <Badge className={cn(
                  "text-[7px] font-black uppercase px-1 h-3.5 border-none",
                  v.status === 'approved' ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
                )}>{v.status === 'approved' ? 'MASTER' : 'ARCHIVE'}</Badge>
              </div>
              
              <div className="flex items-center gap-2 text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" /> {v.date}</span>
                <span className="flex items-center gap-1"><User className="h-2.5 w-2.5" /> {v.user}</span>
              </div>
              
              <p className="text-[9px] text-slate-600 font-medium leading-relaxed italic line-clamp-2">"{v.change}"</p>
              
              {v.status === 'approved' && (
                <div className="absolute -right-2 -bottom-2 opacity-5 group-hover/version:opacity-10 transition-opacity">
                  <Box className="h-12 w-12 text-indigo-900" />
                </div>
              )}
            </div>
          ))}
          {versions.length === 0 && (
            <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-xl">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 italic">Лекала еще не загружены</p>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 relative overflow-hidden group/dark shadow-xl shadow-slate-200/50">
           <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-8 translate-x-8 blur-2xl group-hover/dark:bg-indigo-500/10 transition-all"></div>
           <div className="relative z-10 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400 animate-pulse fill-amber-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">Auto-Grading AI</span>
           </div>
           <p className="text-[9px] leading-relaxed text-slate-300 font-bold uppercase tracking-tight relative z-10">
             Используйте AI для автоматической градации лекал по размерной сетке бренда.
           </p>
           <Button className="w-full h-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[8px] font-black uppercase tracking-[0.2em] transition-all shadow-lg border-none">
             Запустить градацию (Clo3D/Optitex)
           </Button>
        </div>
      </CardContent>
    </Card>
  );
}

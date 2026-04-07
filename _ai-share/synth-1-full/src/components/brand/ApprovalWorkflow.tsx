'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  CheckCircle2, 
  Clock, 
  User, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  Zap, 
  ChevronRight,
  MessageSquare,
  ArrowRight,
  Users,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function ApprovalWorkflow() {
  const [activeStage, setActiveStage] = useState(2);
  const [rejectingStageId, setRejectingStageId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [stageComments, setStageComments] = useState<Record<number, string>>({});
  
  const STAGES = [
    { id: 1, label: 'Design & Sketch', role: 'Designer', status: 'completed', user: 'Anna K.' },
    { id: 2, label: 'Tech Pack (BOM)', role: 'Technologist', status: 'in_review', user: 'Mark L.' },
    { id: 3, label: 'Pre-costing', role: 'Financier', status: 'pending', user: 'Sergei V.' },
    { id: 4, label: 'Production Launch', role: 'Production Mgr', status: 'pending', user: 'Ivan S.' },
  ];

  return (
  <>
    <Card className="border border-slate-100 shadow-sm rounded-xl bg-white overflow-hidden h-full group">
      <CardHeader className="p-4 border-b border-slate-50 bg-indigo-50/20 flex flex-row items-center justify-between">
        <div className="space-y-0.5">
          <CardTitle className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 text-slate-900">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            Внутреннее согласование (Workflows)
          </CardTitle>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">Многоуровневый процесс утверждения этапов.</p>
        </div>
        <div className="flex items-center gap-1">
           <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
           <span className="text-[8px] font-black uppercase text-amber-600 tracking-widest">In Review</span>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        <div className="space-y-3 relative">
          {/* Vertical line connector */}
          <div className="absolute left-[13px] top-6 bottom-6 w-0.5 bg-slate-100" />

          {STAGES.map((stage) => (
            <div key={stage.id} className={cn(
              "flex gap-4 p-3 rounded-xl border transition-all relative z-10",
              stage.status === 'in_review' ? "bg-white border-indigo-200 shadow-sm" : 
              stage.status === 'completed' ? "bg-slate-50/50 border-transparent opacity-80" : "bg-transparent border-transparent opacity-40"
            )}>
               <div className={cn(
                 "h-7 w-7 rounded-full flex items-center justify-center shadow-sm shrink-0 border-2",
                 stage.status === 'completed' ? "bg-emerald-500 border-emerald-500 text-white" :
                 stage.status === 'in_review' ? "bg-white border-indigo-500 text-indigo-500" : "bg-white border-slate-200 text-slate-300"
               )}>
                  {stage.status === 'completed' ? <CheckCircle2 className="h-4 w-4" /> : 
                   stage.status === 'in_review' ? <Clock className="h-4 w-4 animate-spin-slow" /> : <Lock className="h-3.5 w-3.5" />}
               </div>
               
               <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                     <p className={cn("text-[10px] font-black uppercase tracking-tight", stage.status !== 'pending' ? "text-slate-900" : "text-slate-400")}>{stage.label}</p>
                     {stage.status === 'in_review' && (
                       <Button size="icon" variant="ghost" className="h-5 w-5 rounded-md hover:bg-indigo-50 text-indigo-500 transition-all"><MessageSquare className="h-3 w-3" /></Button>
                     )}
                  </div>
                  <div className="flex items-center gap-2 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                     <span className="flex items-center gap-1"><User className="h-2.5 w-2.5" /> {stage.user}</span>
                     <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">{stage.role}</span>
                     {stage.status === 'in_review' && <span className="text-amber-600 font-black">→ Следующий в очереди</span>}
                     {stage.status === 'in_review' && <span className="text-rose-500 font-black">SLA: 2 дн.</span>}
                  </div>
                  {stageComments[stage.id] && <p className="text-[9px] text-slate-500 italic mt-1">{stageComments[stage.id]}</p>}
               </div>
               
               {stage.status === 'in_review' && (
                 <div className="flex flex-col gap-1 justify-center">
                    <Button className="h-6 px-3 bg-indigo-600 text-white text-[8px] font-black uppercase rounded-lg shadow-md hover:bg-indigo-700 transition-all">Утвердить</Button>
                    <Button variant="ghost" className="h-6 px-3 text-rose-500 text-[8px] font-black uppercase rounded-lg hover:bg-rose-50 transition-all" onClick={() => setRejectingStageId(stage.id)}>Reject</Button>
                 </div>
               )}
            </div>
          ))}
        </div>

        <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
           <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
           <p className="text-[9px] text-amber-800/80 font-bold uppercase tracking-tight leading-relaxed">
             Внимание: Запуск производства заблокирован до утверждения себестоимости отделом финансов.
           </p>
        </div>
      </CardContent>
    </Card>
    <Dialog open={!!rejectingStageId} onOpenChange={(open) => !open && setRejectingStageId(null)}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-sm">Причина rejection</DialogTitle>
          <DialogDescription className="text-[10px]">Структурированная причина и комментарий</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {['Несоответствие тех-пака', 'Перерасход бюджета', 'Качество образца', 'Сроки нарушены', 'Прочее'].map((r) => (
              <button key={r} onClick={() => setRejectReason(r)} className={cn("p-2 rounded-lg text-[10px] font-bold uppercase border transition-all", rejectReason === r ? "border-rose-300 bg-rose-50 text-rose-700" : "border-slate-200 hover:border-slate-300")}>{r}</button>
            ))}
          </div>
          <input value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Комментарий" className="w-full h-10 text-sm rounded-lg border border-slate-200 px-3" />
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={() => { setRejectReason(''); setRejectingStageId(null); }}>Отмена</Button>
            <Button size="sm" variant="destructive" onClick={() => { if (rejectingStageId) setStageComments(c => ({ ...c, [rejectingStageId]: `Rejected: ${rejectReason || '—'}` })); setRejectReason(''); setRejectingStageId(null); }}>Подтвердить</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </>
  );
}

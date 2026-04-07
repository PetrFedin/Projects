'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { 
  Calendar, 
  Filter, 
  GanttChart,
  CheckCircle2,
  ChevronRight,
  FileText,
  Package,
  Truck,
  ClipboardCheck,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const MONTHS = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
const WEEKS = Array.from({ length: 24 }, (_, i) => {
  const m = MONTHS[Math.floor(i / 4)];
  const w = (i % 4) + 1;
  return `${m} W${w}`;
});
const QUARTERS = ['Q1 Mar–May', 'Q2 Jun–Aug'];

const GANTT_DATA = [
  {
    id: 'SS26',
    name: "Spring-Summer 26",
    status: "Development",
    phases: [
      { id: 1, name: "Design", start: 0, width: 20, status: "completed", color: "bg-indigo-500" },
      { id: 2, name: "Sampling", start: 22, width: 25, status: "in_progress", color: "bg-amber-500" },
      { id: 3, name: "Production", start: 50, width: 30, status: "pending", color: "bg-slate-200" },
      { id: 4, name: "Logistics", start: 82, width: 15, status: "pending", color: "bg-slate-200" },
    ]
  },
  {
    id: 'DROP-UZ',
    name: "Urban Zen Drop",
    status: "Production",
    phases: [
      { id: 1, name: "Sampling", start: 0, width: 15, status: "completed", color: "bg-indigo-500" },
      { id: 2, name: "Production", start: 17, width: 45, status: "in_progress", color: "bg-emerald-500" },
      { id: 3, name: "Logistics", start: 65, width: 20, status: "pending", color: "bg-slate-200" },
    ]
  },
  {
    id: 'BASIC',
    name: "Basic Collection",
    status: "Continuous",
    phases: [
      { id: 1, name: "Replenishment", start: 0, width: 100, status: "active", color: "bg-indigo-600/30" },
    ]
  }
];

export function ProductionGantt({ selectedCollectionIds = [], onPeriodChange, onNavigate }: { selectedCollectionIds?: string[]; onPeriodChange?: (p: string) => void; onNavigate?: (tab: string) => void } = {}) {
  const [activeView, setActiveView] = useState<'week' | 'month' | 'year'>('month');
  const [selectedPhase, setSelectedPhase] = useState<{ project: typeof GANTT_DATA[0]; phase: typeof GANTT_DATA[0]['phases'][0] } | null>(null);
  const filteredGanttData = selectedCollectionIds.length > 0
    ? GANTT_DATA.filter(g => selectedCollectionIds.includes(g.id))
    : GANTT_DATA;

  const timelineLabels = activeView === 'week' ? WEEKS : activeView === 'month' ? MONTHS : QUARTERS;

  const getPhaseNavTab = (phaseName: string) => {
    const n = phaseName.toLowerCase();
    if (n.includes('design') || n.includes('дизайн')) return 'plm';
    if (n.includes('sampling') || n.includes('сэмпл')) return 'samples';
    if (n.includes('production') || n.includes('пошив') || n.includes('цех')) return 'orders';
    if (n.includes('logistics') || n.includes('логистик') || n.includes('отгрузк')) return 'logistics';
    if (n.includes('replenish')) return 'orders';
    return 'plm';
  };

  return (
  <>
    <Card className="border border-slate-100 shadow-sm rounded-xl bg-white overflow-hidden">
      <CardHeader className="p-4 border-b border-slate-50 bg-slate-50/30 flex flex-row items-center justify-between">
        <div className="space-y-0.5">
          <CardTitle className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 text-slate-900">
            <GanttChart className="w-4 h-4 text-indigo-600" />
            График производства (Critical Path)
          </CardTitle>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">Таймлайн разработки и отгрузок по коллекциям.</p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-white rounded-lg border border-slate-200 p-0.5 shadow-sm">
            {(['week', 'month', 'year'] as const).map(v => (
              <Button 
                key={v} 
                variant="ghost" 
                size="sm" 
                onClick={() => { setActiveView(v); onPeriodChange?.(v); }}
                className={cn(
                  "h-6 px-3 rounded-md text-[8px] font-black uppercase transition-all",
                  activeView === v ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:bg-slate-50"
                )}
              >
                {v === 'week' ? 'WEEK' : v === 'month' ? 'MONTH' : 'YEAR'}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="icon" className="h-7 w-7 rounded-lg text-slate-400 border-slate-200 bg-white"><Filter className="h-3.5 w-3.5" /></Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 overflow-x-auto">
        <div className={cn(activeView === 'week' ? "min-w-[1100px]" : activeView === 'year' ? "min-w-[600px]" : "min-w-[800px]")}>
          {/* Timeline Header */}
          <div className="grid grid-cols-12 border-b border-slate-100">
            <div className="col-span-3 p-3 text-[9px] font-black uppercase text-slate-400 tracking-widest border-r border-slate-100 bg-slate-50/50">Проект / Коллекция</div>
            <div className="col-span-9 p-0 flex">
              {timelineLabels.map((label, i) => (
                <div key={i} className="flex-1 min-w-[24px] p-1.5 text-center text-[7px] font-black uppercase text-slate-400 tracking-wider border-r border-slate-100 last:border-none" title={label}>
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Rows — по выбранным коллекциям */}
          {filteredGanttData.map((project) => (
            <div key={project.id} className="grid grid-cols-12 border-b border-slate-100 hover:bg-slate-50/30 transition-colors group">
              <div className="col-span-3 p-4 border-r border-slate-100 flex flex-col justify-center space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{project.name}</h4>
                  <Badge className={cn(
                    "text-[7px] font-black uppercase px-1 h-3.5 border-none",
                    project.status === 'Production' ? "bg-emerald-50 text-emerald-600" : "bg-indigo-50 text-indigo-600"
                  )}>{project.status}</Badge>
                </div>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{project.id}</p>
              </div>
              <div className="col-span-9 p-4 relative flex items-center h-20">
                 {/* Grid lines background */}
                 <div className="absolute inset-0 flex pointer-events-none">
                    {timelineLabels.map((_, i) => <div key={i} className="flex-1 border-r border-slate-100/30 last:border-none min-w-0" />)}
                 </div>

                 {/* Phases */}
                 <div className="relative w-full h-8 flex">
                    {project.phases.map((phase) => (
                      <motion.div
                        key={phase.id}
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        onClick={() => setSelectedPhase({ project, phase })}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && setSelectedPhase({ project, phase })}
                        className={cn(
                          "absolute h-6 rounded-lg shadow-sm border border-white/20 flex items-center justify-center cursor-pointer group/phase overflow-hidden transition-all hover:h-8 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-400",
                          phase.color
                        )}
                        style={{ 
                          left: `${phase.start}%`, 
                          width: `${phase.width}%`,
                          zIndex: 10
                        }}
                      >
                         <span className="text-[7px] font-black uppercase text-white tracking-widest truncate px-1">
                           {phase.name}
                         </span>
                         {phase.status === 'completed' && <CheckCircle2 className="h-2 w-2 text-white/50 absolute top-1 right-1" />}
                         {phase.status === 'in_progress' && (
                           <div className="absolute inset-0 bg-white/10 overflow-hidden">
                             <motion.div 
                               animate={{ x: ['-100%', '100%'] }}
                               transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                               className="h-full w-20 bg-white/20 skew-x-12"
                             />
                           </div>
                         )}
                      </motion.div>
                    ))}
                 </div>
              </div>
            </div>
          ))}

          {/* Milestones Legend */}
          <div className="p-3 bg-slate-50/50 flex items-center gap-6 justify-center border-t border-slate-100">
             <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-sm" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">Завершено</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">В работе</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-amber-500 shadow-sm" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">Sampling</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-slate-200 shadow-sm" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">План</span>
             </div>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Диалог этапа: детали, правки, навигация */}
    <Dialog open={!!selectedPhase} onOpenChange={(o) => !o && setSelectedPhase(null)}>
      <DialogContent className="sm:max-w-[560px] border-none rounded-2xl shadow-xl p-0 overflow-hidden">
        {selectedPhase && (
          <>
            <DialogHeader className="p-6 bg-slate-900 text-white">
              <div className="flex items-center gap-3">
                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", selectedPhase.phase.color)}>
                  {selectedPhase.phase.name.includes('Design') || selectedPhase.phase.name.includes('Replenish') ? (
                    <FileText className="h-5 w-5 text-white" />
                  ) : selectedPhase.phase.name.includes('Sampling') ? (
                    <Package className="h-5 w-5 text-white" />
                  ) : selectedPhase.phase.name.includes('Production') ? (
                    <ClipboardCheck className="h-5 w-5 text-white" />
                  ) : (
                    <Truck className="h-5 w-5 text-white" />
                  )}
                </div>
                <div>
                  <DialogTitle className="text-lg font-black uppercase tracking-tight text-white">{selectedPhase.phase.name}</DialogTitle>
                  <DialogDescription className="text-[10px] text-slate-300 mt-0.5">
                    {selectedPhase.project.name} · {selectedPhase.project.id}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={cn(
                  "text-[9px] font-black uppercase",
                  selectedPhase.phase.status === 'completed' ? "bg-indigo-100 text-indigo-700" :
                  selectedPhase.phase.status === 'in_progress' ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                )}>
                  {selectedPhase.phase.status === 'completed' ? 'Завершено' : selectedPhase.phase.status === 'in_progress' ? 'В работе' : selectedPhase.phase.status === 'active' ? 'Активно' : 'План'}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {selectedPhase.phase.name === 'Design' && 'Лекала, техпакеты, BOM — проверьте спецификации и внесите правки.'}
                {selectedPhase.phase.name === 'Sampling' && 'Образцы Proto 1, Proto 2, PP — статус сэмплов и комментарии по посадке.'}
                {selectedPhase.phase.name === 'Production' && 'Заказы (PO), цех, мониторинг партий — осмотр и корректировки.'}
                {selectedPhase.phase.name === 'Logistics' && 'Отгрузки, CMR, маркировка — проверка документов и статуса.'}
                {selectedPhase.phase.name === 'Replenishment' && 'Пополнение стока — заказы и планирование.'}
              </p>
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[9px] font-bold uppercase text-slate-400 tracking-widest mb-3">Перейти к разделу для проверки и правок</p>
                <div className="flex flex-wrap gap-2">
                  {(['plm', 'samples', 'orders', 'materials', 'execution', 'logistics'] as const).map((tab) => (
                    <Button
                      key={tab}
                      variant="outline"
                      size="sm"
                      className="h-9 text-[9px] font-bold uppercase gap-1.5"
                      onClick={() => { onNavigate?.(tab); setSelectedPhase(null); }}
                    >
                      {tab === 'plm' && <><FileText className="h-3.5 w-3.5" /> Артикулы / PLM</>}
                      {tab === 'samples' && <><Package className="h-3.5 w-3.5" /> Сэмплы</>}
                      {tab === 'orders' && <><ClipboardCheck className="h-3.5 w-3.5" /> Заказы (PO)</>}
                      {tab === 'materials' && <><Package className="h-3.5 w-3.5" /> Материалы</>}
                      {tab === 'execution' && <><ClipboardCheck className="h-3.5 w-3.5" /> Цех</>}
                      {tab === 'logistics' && <><Truck className="h-3.5 w-3.5" /> Логистика</>}
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  ))}
                </div>
                <Button
                  className="mt-3 w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase gap-2"
                  onClick={() => { onNavigate?.(getPhaseNavTab(selectedPhase.phase.name)); setSelectedPhase(null); }}
                >
                  Открыть {getPhaseNavTab(selectedPhase.phase.name) === 'plm' ? 'Артикулы' : getPhaseNavTab(selectedPhase.phase.name) === 'samples' ? 'Сэмплы' : getPhaseNavTab(selectedPhase.phase.name) === 'orders' ? 'Заказы' : 'Логистику'}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  </>
  );
}

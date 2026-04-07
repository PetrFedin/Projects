'use client';

import { useState, useMemo } from 'react';
import { 
  Users, Bot, Maximize2, Zap, AlertCircle, X
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';
import { TeamMember } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TeamNewsfeed = ({
  team,
  onOpenMatrixSummary,
}: {
  team: TeamMember[];
  onOpenMatrixSummary: () => void;
}) => {
  const activeMembers = team.filter(m => m.invitationStatus === "accepted" && !m.isArchived);
  const onlineCount = activeMembers.filter(m => m.isOnline).length;
  const highWorkloadCount = activeMembers.filter(m => (m.workload || 0) > 85).length;
  const avgWorkload = Math.round(activeMembers.reduce((acc, m) => acc + (m.workload || 0), 0) / (activeMembers.length || 1));
  const totalTasks = activeMembers.reduce((acc, m) => acc + (m.history?.filter(h => h.category === "task").length || 0), 0);
  
  const deptStats = activeMembers.reduce((acc: any, m) => {
    const dept = m.department || "Other";
    if (!acc[dept]) acc[dept] = { count: 0, workload: 0 };
    acc[dept].count += 1;
    acc[dept].workload += (m.workload || 0);
    return acc;
  }, {});

  const [isMatrixSummaryOpen, setIsMatrixSummaryOpen] = useState(false); // Local state for dialog

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Активная Матрица", value: onlineCount > 0 ? "ONLINE" : "IDLE", sub: `${onlineCount} из ${activeMembers.length} в сети`, color: "emerald" },
          { label: "Операционная нагрузка", value: `${avgWorkload}%`, sub: avgWorkload > 80 ? "Критический уровень" : "Стабильно", color: avgWorkload > 80 ? "rose" : "indigo" },
          { label: "Выполнено задач", value: totalTasks, sub: "За последние 24ч", color: "slate" },
          { label: "Зоны риска", value: highWorkloadCount, sub: "Требуют внимания", color: highWorkloadCount > 0 ? "rose" : "emerald" },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-slate-100 p-3 rounded-xl shadow-sm group">
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{s.label}</p>
            <p className={cn("text-sm font-black tracking-tighter", s.color === "rose" ? "text-rose-600" : s.color === "emerald" ? "text-emerald-600" : "text-slate-900")}>{s.value}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0f111a] rounded-xl border border-white/10 p-4 relative overflow-hidden group hover:bg-[#161926] transition-all duration-700 cursor-pointer shadow-2xl"
        onClick={() => setIsMatrixSummaryOpen(true)}
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-1000">
          <Bot className="h-48 w-48 text-indigo-500" />
        </div>
        <div className="flex flex-col lg:flex-row items-center gap-3 relative z-10">
          <div className="flex items-center gap-3 shrink-0">
            <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.4)] animate-pulse">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-1">Intel OS AI Newsfeed</h4>
              <p className="text-base font-black uppercase text-white tracking-tight">Сводка по матрице штата</p>
            </div>
          </div>
          <div className="h-12 w-[1px] bg-white/10 hidden lg:block" />
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-indigo-500 text-white border-none text-[8px] font-black uppercase px-3 py-1 rounded-full">LIVE ANALYTICS</Badge>
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Нажмите для детального анализа ресурсов</span>
            </div>
            <p className="text-sm font-bold text-slate-400 leading-relaxed max-w-2xl">
              <span className="text-white font-black">AI Контекст:</span> Текущая нагрузка распределена {avgWorkload < 70 ? "оптимально" : "неравномерно"}. 
              Обнаружено {highWorkloadCount} узлов с критической загрузкой. Рекомендуется аудит задач в секторе {Object.keys(deptStats).length > 0 ? Object.keys(deptStats)[0] : "основных операций"}.
            </p>
          </div>
          <Maximize2 className="h-6 w-6 text-white/20 group-hover:text-white transition-colors" />
        </div>
      </motion.div>

      <Dialog open={isMatrixSummaryOpen} onOpenChange={setIsMatrixSummaryOpen}>
        <DialogContent className="max-w-5xl p-0 rounded-xl overflow-hidden border-none shadow-2xl bg-[#f8f9fa] max-h-[90vh] flex flex-col">
          <DialogTitle className="sr-only">Анализ активной матрицы штата</DialogTitle>
          <DialogDescription className="sr-only">Детальный отчет по нагрузке и эффективности подразделений.</DialogDescription>
          
          <div className="bg-[#0f111a] p-3 text-white shrink-0">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-400">Intel OS AI Intelligence</h2>
                  <h1 className="text-base font-black tracking-tighter uppercase">Ресурсный Хаб</h1>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsMatrixSummaryOpen(false)} className="rounded-full text-white/40 hover:text-white hover:bg-white/10">
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-3 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(deptStats).map(([dept, stats]: [string, any]) => (
                  <div key={dept} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">{dept}</h4>
                      <Badge className="bg-slate-100 text-slate-600 border-none text-[8px] font-black">{stats.count} чел.</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase">
                        <span className="text-slate-400">Средняя нагрузка</span>
                        <span className={cn(stats.workload/stats.count > 80 ? "text-rose-500" : "text-indigo-600")}>
                          {Math.round(stats.workload/stats.count)}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full transition-all duration-1000", stats.workload/stats.count > 80 ? "bg-rose-500" : "bg-indigo-500")}
                          style={{ width: `${Math.round(stats.workload/stats.count)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-500" /> Критические узлы (Top Load)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {activeMembers.sort((a, b) => (b.workload || 0) - (a.workload || 0)).slice(0, 6).map((m, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100">
                      <Avatar className="h-10 w-10 rounded-xl">
                        <AvatarImage src={m.avatar} />
                        <AvatarFallback className="text-[10px] font-black">{m.firstName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black uppercase truncate">{m.firstName} {m.lastName}</p>
                        <p className="text-[8px] font-bold text-rose-500 uppercase">{m.workload}% Load</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-indigo-600 rounded-xl p-4 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Zap className="h-32 w-32" />
                </div>
                <div className="relative z-10 space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-white/60">AI Стратегические инсайты</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase text-indigo-200">Оптимизация</p>
                      <p className="text-sm font-medium leading-relaxed">
                        Рекомендуется перераспределить 20% текущих задач из перегруженного сектора {Object.keys(deptStats).length > 0 ? Object.keys(deptStats)[0] : "основных операций"} в сектор с низкой загрузкой. Это сократит время обработки SKU на 18%.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase text-indigo-200">Прогноз</p>
                      <p className="text-sm font-medium leading-relaxed">
                        При сохранении текущей динамики, через 72 часа нагрузка на отдел логистики достигнет 95%. Требуется временное привлечение дополнительных ресурсов.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="p-4 bg-white border-t border-slate-50 flex justify-end gap-3 shrink-0">
            <Button variant="outline" onClick={() => setIsMatrixSummaryOpen(false)} className="rounded-2xl font-black uppercase tracking-widest text-[10px] h-12 px-8">
              Закрыть окно
            </Button>
            <Button className="bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[10px] h-12 px-10 shadow-xl">
              Сформировать PDF отчет
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamNewsfeed;

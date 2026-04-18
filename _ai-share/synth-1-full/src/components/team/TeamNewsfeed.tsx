'use client';

import { useState, useMemo } from 'react';
import { Users, Bot, Maximize2, Zap, AlertCircle, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { TeamMember } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const TeamNewsfeed = ({
  team,
  onOpenMatrixSummary,
}: {
  team: TeamMember[];
  onOpenMatrixSummary: () => void;
}) => {
  const activeMembers = team.filter((m) => m.invitationStatus === 'accepted' && !m.isArchived);
  const onlineCount = activeMembers.filter((m) => m.isOnline).length;
  const highWorkloadCount = activeMembers.filter((m) => (m.workload || 0) > 85).length;
  const avgWorkload = Math.round(
    activeMembers.reduce((acc, m) => acc + (m.workload || 0), 0) / (activeMembers.length || 1)
  );
  const totalTasks = activeMembers.reduce(
    (acc, m) => acc + (m.history?.filter((h) => h.category === 'task').length || 0),
    0
  );

  const deptStats = activeMembers.reduce((acc: any, m) => {
    const dept = m.department || 'Other';
    if (!acc[dept]) acc[dept] = { count: 0, workload: 0 };
    acc[dept].count += 1;
    acc[dept].workload += m.workload || 0;
    return acc;
  }, {});

  const [isMatrixSummaryOpen, setIsMatrixSummaryOpen] = useState(false); // Local state for dialog

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          {
            label: 'Активная Матрица',
            value: onlineCount > 0 ? 'ONLINE' : 'IDLE',
            sub: `${onlineCount} из ${activeMembers.length} в сети`,
            color: 'emerald',
          },
          {
            label: 'Операционная нагрузка',
            value: `${avgWorkload}%`,
            sub: avgWorkload > 80 ? 'Критический уровень' : 'Стабильно',
            color: avgWorkload > 80 ? 'rose' : 'indigo',
          },
          { label: 'Выполнено задач', value: totalTasks, sub: 'За последние 24ч', color: 'slate' },
          {
            label: 'Зоны риска',
            value: highWorkloadCount,
            sub: 'Требуют внимания',
            color: highWorkloadCount > 0 ? 'rose' : 'emerald',
          },
        ].map((s, i) => (
          <div key={i} className="group rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
            <p className="mb-2 text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">
              {s.label}
            </p>
            <p
              className={cn(
                'text-sm font-black tracking-tighter',
                s.color === 'rose'
                  ? 'text-rose-600'
                  : s.color === 'emerald'
                    ? 'text-emerald-600'
                    : 'text-slate-900'
              )}
            >
              {s.value}
            </p>
            <p className="mt-1 text-[9px] font-bold uppercase tracking-tight text-slate-400">
              {s.sub}
            </p>
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-[#0f111a] p-4 shadow-2xl transition-all duration-700 hover:bg-[#161926]"
        onClick={() => setIsMatrixSummaryOpen(true)}
      >
        <div className="absolute right-0 top-0 p-4 opacity-10 transition-transform duration-1000 group-hover:scale-110">
          <Bot className="h-48 w-48 text-indigo-500" />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-3 lg:flex-row">
          <div className="flex shrink-0 items-center gap-3">
            <div className="flex h-12 w-12 animate-pulse items-center justify-center rounded-xl bg-indigo-600 shadow-[0_0_30px_rgba(79,70,229,0.4)]">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <div>
              <h4 className="mb-1 text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">
                Intel OS AI Newsfeed
              </h4>
              <p className="text-base font-black uppercase tracking-tight text-white">
                Сводка по матрице штата
              </p>
            </div>
          </div>
          <div className="hidden h-12 w-[1px] bg-white/10 lg:block" />
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <Badge className="rounded-full border-none bg-indigo-500 px-3 py-1 text-[8px] font-black uppercase text-white">
                LIVE ANALYTICS
              </Badge>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                Нажмите для детального анализа ресурсов
              </span>
            </div>
            <p className="max-w-2xl text-sm font-bold leading-relaxed text-slate-400">
              <span className="font-black text-white">AI Контекст:</span> Текущая нагрузка
              распределена {avgWorkload < 70 ? 'оптимально' : 'неравномерно'}. Обнаружено{' '}
              {highWorkloadCount} узлов с критической загрузкой. Рекомендуется аудит задач в секторе{' '}
              {Object.keys(deptStats).length > 0 ? Object.keys(deptStats)[0] : 'основных операций'}.
            </p>
          </div>
          <Maximize2 className="h-6 w-6 text-white/20 transition-colors group-hover:text-white" />
        </div>
      </motion.div>

      <Dialog open={isMatrixSummaryOpen} onOpenChange={setIsMatrixSummaryOpen}>
        <DialogContent className="flex max-h-[90vh] max-w-5xl flex-col overflow-hidden rounded-xl border-none bg-[#f8f9fa] p-0 shadow-2xl">
          <DialogTitle className="sr-only">Анализ активной матрицы штата</DialogTitle>
          <DialogDescription className="sr-only">
            Детальный отчет по нагрузке и эффективности подразделений.
          </DialogDescription>

          <div className="shrink-0 bg-[#0f111a] p-3 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-400">
                    Intel OS AI Intelligence
                  </h2>
                  <h1 className="text-base font-black uppercase tracking-tighter">Ресурсный Хаб</h1>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMatrixSummaryOpen(false)}
                className="rounded-full text-white/40 hover:bg-white/10 hover:text-white"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-10 p-3">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {Object.entries(deptStats).map(([dept, stats]: [string, any]) => (
                  <div
                    key={dept}
                    className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">
                        {dept}
                      </h4>
                      <Badge className="border-none bg-slate-100 text-[8px] font-black text-slate-600">
                        {stats.count} чел.
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase">
                        <span className="text-slate-400">Средняя нагрузка</span>
                        <span
                          className={cn(
                            stats.workload / stats.count > 80 ? 'text-rose-500' : 'text-indigo-600'
                          )}
                        >
                          {Math.round(stats.workload / stats.count)}%
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-50">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-1000',
                            stats.workload / stats.count > 80 ? 'bg-rose-500' : 'bg-indigo-500'
                          )}
                          style={{ width: `${Math.round(stats.workload / stats.count)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <AlertCircle className="h-4 w-4 text-rose-500" /> Критические узлы (Top Load)
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {activeMembers
                    .sort((a, b) => (b.workload || 0) - (a.workload || 0))
                    .slice(0, 6)
                    .map((m, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4"
                      >
                        <Avatar className="h-10 w-10 rounded-xl">
                          <AvatarImage src={m.avatar} />
                          <AvatarFallback className="text-[10px] font-black">
                            {m.firstName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[10px] font-black uppercase">
                            {m.firstName} {m.lastName}
                          </p>
                          <p className="text-[8px] font-bold uppercase text-rose-500">
                            {m.workload}% Load
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl bg-indigo-600 p-4 text-white">
                <div className="absolute right-0 top-0 p-3 opacity-10">
                  <Zap className="h-32 w-32" />
                </div>
                <div className="relative z-10 space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-white/60">
                    AI Стратегические инсайты
                  </h3>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase text-indigo-200">
                        Оптимизация
                      </p>
                      <p className="text-sm font-medium leading-relaxed">
                        Рекомендуется перераспределить 20% текущих задач из перегруженного сектора{' '}
                        {Object.keys(deptStats).length > 0
                          ? Object.keys(deptStats)[0]
                          : 'основных операций'}{' '}
                        в сектор с низкой загрузкой. Это сократит время обработки SKU на 18%.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase text-indigo-200">Прогноз</p>
                      <p className="text-sm font-medium leading-relaxed">
                        При сохранении текущей динамики, через 72 часа нагрузка на отдел логистики
                        достигнет 95%. Требуется временное привлечение дополнительных ресурсов.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="flex shrink-0 justify-end gap-3 border-t border-slate-50 bg-white p-4">
            <Button
              variant="outline"
              onClick={() => setIsMatrixSummaryOpen(false)}
              className="h-12 rounded-2xl px-8 text-[10px] font-black uppercase tracking-widest"
            >
              Закрыть окно
            </Button>
            <Button className="h-12 rounded-2xl bg-black px-10 text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
              Сформировать PDF отчет
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamNewsfeed;

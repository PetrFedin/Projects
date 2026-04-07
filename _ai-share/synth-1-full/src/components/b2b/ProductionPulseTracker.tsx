'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Factory, 
  Activity, 
  Box, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Truck,
  Layers,
  Settings2,
  Zap,
  ArrowRight,
  ShieldCheck,
  Maximize2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUIState } from '@/providers/ui-state';
import { useB2BState } from '@/providers/b2b-state';
import { cn } from '@/lib/cn';

export function ProductionPulseTracker() {
  const { b2bActivityLogs } = useB2BState();
  const [activeStage, setActiveStage] = useState(2); // In Production
  const [pulseData, setPulseData] = useState({
    cutting: 100,
    sewing: 42,
    qc: 0,
    packing: 0
  });

  const stages = [
    { id: 0, label: 'Утверждение лекал', icon: Layers, status: 'Завершено' },
    { id: 1, label: 'Раскрой ткани', icon: Box, status: 'Завершено' },
    { id: 2, label: 'Массовый пошив', icon: Factory, status: 'В процессе' },
    { id: 3, label: 'Контроль качества', icon: ShieldCheck, status: 'Ожидает' },
    { id: 4, label: 'Упаковка и транзит', icon: Truck, status: 'Ожидает' }
  ];

  // Simulation: increment sewing progress
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseData(prev => ({
        ...prev,
        sewing: prev.sewing < 100 ? prev.sewing + 0.1 : 100
      }));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-4 p-4 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <Badge variant="outline" className="border-indigo-100 text-indigo-600 uppercase font-black tracking-widest text-[9px]">
              IOT_PULSE_v5.4
            </Badge>
          </div>
          <h2 className="text-sm md:text-sm font-black uppercase tracking-tighter text-slate-900 leading-none">
            Пульс Производства<br/>Онлайн-трекер
          </h2>
          <p className="text-slate-400 font-medium text-xs max-w-md text-left">
            Прямая IoT-интеграция с датчиками на фабричных линиях. Мониторинг пошива, точек контроля качества и упаковки в реальном времени.
          </p>
        </div>

        <div className="flex gap-3">
           <div className="flex items-center gap-2 px-4 h-10 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase text-slate-900 tracking-widest">Узел фабрики: Подключен</span>
           </div>
           <Button className="h-10 bg-slate-900 text-white rounded-2xl px-8 font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl shadow-slate-200">
              Дашборд всей фабрики <ArrowRight className="h-4 w-4" />
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Stages Timeline */}
        <div className="lg:col-span-8 space-y-4">
           <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-white p-3 overflow-hidden relative">
              <div className="flex items-center justify-between mb-12">
                 <div className="space-y-1">
                    <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">Линия #042: Серия Cyber Tech</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID Заказа: #WH-8241 • Кол-во: 1,250 ед.</p>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="text-right">
                       <p className="text-[10px] font-black uppercase text-slate-400">Общая готовность</p>
                       <p className="text-sm font-black text-indigo-600">{Math.round((pulseData.cutting + pulseData.sewing + pulseData.qc + pulseData.packing) / 4)}%</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center">
                       <Zap className="h-6 w-6 text-amber-500 fill-amber-500" />
                    </div>
                 </div>
              </div>

              <div className="relative flex justify-between items-start max-w-4xl mx-auto py-4">
                 <div className="absolute top-3 left-0 right-0 h-1 bg-slate-100" />
                 <div className="absolute top-3 left-0 h-1 bg-indigo-500 transition-all duration-1000" style={{ width: `${(activeStage / (stages.length - 1)) * 100}%` }} />

                 {stages.map((s, i) => (
                   <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
                      <div className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                        i <= activeStage ? "bg-slate-900 text-white shadow-xl shadow-slate-200" : "bg-white text-slate-200 border-2 border-slate-100"
                      )}>
                         <s.icon className="h-6 w-6" />
                      </div>
                      <div className="text-center space-y-1">
                         <p className={cn("text-[9px] font-black uppercase tracking-tight", i <= activeStage ? "text-slate-900" : "text-slate-300")}>{s.label}</p>
                         <Badge className={cn(
                           "text-[7px] font-black uppercase border-none",
                           i < activeStage ? "bg-emerald-50 text-emerald-600" :
                           i === activeStage ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-300"
                         )}>{s.status}</Badge>
                      </div>
                   </div>
                 ))}
              </div>
           </Card>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Card className="border-none shadow-xl bg-white p-4 space-y-6 rounded-xl">
                 <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Здоровье компонентов</h4>
                    <Settings2 className="h-4 w-4 text-slate-400" />
                 </div>
                 <div className="space-y-4">
                    {[
                      { label: 'Сырьевой поток', val: 98, status: 'stable' },
                      { label: 'Uptime станков', val: 94, status: 'stable' },
                      { label: 'Эффективность персонала', val: 82, status: 'alert' }
                    ].map((c, i) => (
                      <div key={i} className="space-y-2">
                         <div className="flex justify-between text-[9px] font-black uppercase">
                            <span className="text-slate-400">{c.label}</span>
                            <span className={c.status === 'stable' ? 'text-emerald-600' : 'text-amber-600'}>{c.val}%</span>
                         </div>
                         <div className="w-full h-1 bg-slate-50 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${c.val}%` }} className={cn("h-full", c.status === 'stable' ? 'bg-emerald-500' : 'bg-amber-500')} />
                         </div>
                      </div>
                    ))}
                 </div>
              </Card>

              <Card className="border-none shadow-xl bg-indigo-600 text-white p-4 space-y-6 rounded-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                    <CheckCircle2 className="h-32 w-32" />
                 </div>
                 <div className="relative z-10 space-y-4">
                    <h4 className="text-sm font-black uppercase tracking-tight">QA / QC Этап</h4>
                    <p className="text-[11px] font-medium text-white/80 leading-relaxed uppercase">
                      Автоматическое сканирование первых 100 единиц завершено. Отклонений в целостности швов и распределении графенового покрытия не обнаружено.
                    </p>
                    <Button variant="outline" className="w-full h-12 rounded-xl bg-white/10 border-white/20 text-white font-black uppercase text-[10px] tracking-widest hover:bg-white/20">
                       Просмотреть фото инспекции
                    </Button>
                 </div>
              </Card>
           </div>
        </div>

        {/* Live Metrics Side */}
        <div className="lg:col-span-4 space-y-4">
           <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-slate-900 text-white p-3 space-y-4">
              <div className="space-y-1">
                 <h3 className="text-base font-black uppercase tracking-tight">Метрики в реальном времени</h3>
                 <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Стриминг с узла фабрики #RU-01</p>
              </div>

              <div className="space-y-4">
                 {[
                   { label: 'Раскроено', val: '1,250 / 1,250', pct: 100 },
                   { label: 'Сшито', val: `${Math.round(1250 * (pulseData.sewing / 100))} / 1,250`, pct: pulseData.sewing },
                   { label: 'Проверка качества', val: '0 / 1,250', pct: 0 },
                   { label: 'Упаковано', val: '0 / 1,250', pct: 0 }
                 ].map((m, i) => (
                   <div key={i} className="space-y-3">
                      <div className="flex justify-between items-end">
                         <div>
                            <p className="text-[8px] font-black uppercase text-white/40 mb-1">{m.label}</p>
                            <p className="text-sm font-black tabular-nums">{m.val}</p>
                         </div>
                         <span className="text-[10px] font-black text-indigo-400">{Math.round(m.pct)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                         <motion.div 
                           className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                           animate={{ width: `${m.pct}%` }}
                         />
                      </div>
                   </div>
                 ))}
              </div>

              <div className="pt-4 p-4 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-white/40" />
                    <div className="space-y-0.5">
                       <p className="text-[8px] font-black text-white/40 uppercase">Ожид. завершение</p>
                       <p className="text-[10px] font-black text-white uppercase">28 фев, 2026</p>
                    </div>
                 </div>
                 <Badge className="bg-emerald-500 text-white border-none text-[8px] font-black uppercase">В графике</Badge>
              </div>
           </Card>

           <Card className="border-none shadow-xl bg-white p-4 rounded-xl flex flex-col items-center text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center">
                 <Maximize2 className="h-6 w-6 text-slate-300" />
              </div>
              <div className="space-y-1">
                 <h4 className="text-sm font-black uppercase text-slate-900 tracking-tight">Живая AR-проекция</h4>
                 <p className="text-[10px] font-medium text-slate-400 uppercase leading-relaxed">
                   Просматривайте 3D цифровой двойник вашей производственной линии в AR для проверки конкретных узлов.
                 </p>
              </div>
              <Button variant="outline" className="w-full h-12 rounded-2xl border-slate-100 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50">
                 Запустить AR-просмотр
              </Button>
           </Card>
        </div>
      </div>
    </div>
  );
}

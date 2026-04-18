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
  Maximize2,
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
    packing: 0,
  });

  const stages = [
    { id: 0, label: 'Утверждение лекал', icon: Layers, status: 'Завершено' },
    { id: 1, label: 'Раскрой ткани', icon: Box, status: 'Завершено' },
    { id: 2, label: 'Массовый пошив', icon: Factory, status: 'В процессе' },
    { id: 3, label: 'Контроль качества', icon: ShieldCheck, status: 'Ожидает' },
    { id: 4, label: 'Упаковка и транзит', icon: Truck, status: 'Ожидает' },
  ];

  // Simulation: increment sewing progress
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseData((prev) => ({
        ...prev,
        sewing: prev.sewing < 100 ? prev.sewing + 0.1 : 100,
      }));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
<<<<<<< HEAD
    <div className="min-h-screen space-y-4 bg-slate-50 p-4">
=======
    <div className="bg-bg-surface2 min-h-screen space-y-4 p-4">
>>>>>>> recover/cabinet-wip-from-stash
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
<<<<<<< HEAD
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600">
=======
            <div className="bg-accent-primary flex h-8 w-8 items-center justify-center rounded-xl">
>>>>>>> recover/cabinet-wip-from-stash
              <Activity className="h-4 w-4 text-white" />
            </div>
            <Badge
              variant="outline"
<<<<<<< HEAD
              className="border-indigo-100 text-[9px] font-black uppercase tracking-widest text-indigo-600"
=======
              className="border-accent-primary/20 text-accent-primary text-[9px] font-black uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
            >
              IOT_PULSE_v5.4
            </Badge>
          </div>
<<<<<<< HEAD
          <h2 className="text-sm font-black uppercase leading-none tracking-tighter text-slate-900 md:text-sm">
=======
          <h2 className="text-text-primary text-sm font-black uppercase leading-none tracking-tighter md:text-sm">
>>>>>>> recover/cabinet-wip-from-stash
            Пульс Производства
            <br />
            Онлайн-трекер
          </h2>
<<<<<<< HEAD
          <p className="max-w-md text-left text-xs font-medium text-slate-400">
=======
          <p className="text-text-muted max-w-md text-left text-xs font-medium">
>>>>>>> recover/cabinet-wip-from-stash
            Прямая IoT-интеграция с датчиками на фабричных линиях. Мониторинг пошива, точек контроля
            качества и упаковки в реальном времени.
          </p>
        </div>

        <div className="flex gap-3">
<<<<<<< HEAD
          <div className="flex h-10 items-center gap-2 rounded-2xl border border-slate-100 bg-white px-4 shadow-sm">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">
              Узел фабрики: Подключен
            </span>
          </div>
          <Button className="h-10 gap-2 rounded-2xl bg-slate-900 px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-slate-200">
=======
          <div className="border-border-subtle flex h-10 items-center gap-2 rounded-2xl border bg-white px-4 shadow-sm">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-text-primary text-[10px] font-black uppercase tracking-widest">
              Узел фабрики: Подключен
            </span>
          </div>
          <Button className="bg-text-primary h-10 gap-2 rounded-2xl px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-md shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
            Дашборд всей фабрики <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        {/* Stages Timeline */}
        <div className="space-y-4 lg:col-span-8">
<<<<<<< HEAD
          <Card className="relative overflow-hidden rounded-xl border-none bg-white p-3 shadow-2xl shadow-slate-200/50">
            <div className="mb-12 flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">
                  Линия #042: Серия Cyber Tech
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
=======
          <Card className="relative overflow-hidden rounded-xl border-none bg-white p-3 shadow-2xl shadow-md">
            <div className="mb-12 flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-text-primary text-sm font-black uppercase tracking-tight">
                  Линия #042: Серия Cyber Tech
                </h3>
                <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                  ID Заказа: #WH-8241 • Кол-во: 1,250 ед.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
<<<<<<< HEAD
                  <p className="text-[10px] font-black uppercase text-slate-400">
                    Общая готовность
                  </p>
                  <p className="text-sm font-black text-indigo-600">
=======
                  <p className="text-text-muted text-[10px] font-black uppercase">
                    Общая готовность
                  </p>
                  <p className="text-accent-primary text-sm font-black">
>>>>>>> recover/cabinet-wip-from-stash
                    {Math.round(
                      (pulseData.cutting + pulseData.sewing + pulseData.qc + pulseData.packing) / 4
                    )}
                    %
                  </p>
                </div>
<<<<<<< HEAD
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50">
=======
                <div className="bg-bg-surface2 flex h-12 w-12 items-center justify-center rounded-xl">
>>>>>>> recover/cabinet-wip-from-stash
                  <Zap className="h-6 w-6 fill-amber-500 text-amber-500" />
                </div>
              </div>
            </div>

            <div className="relative mx-auto flex max-w-4xl items-start justify-between py-4">
<<<<<<< HEAD
              <div className="absolute left-0 right-0 top-3 h-1 bg-slate-100" />
              <div
                className="absolute left-0 top-3 h-1 bg-indigo-500 transition-all duration-1000"
=======
              <div className="bg-bg-surface2 absolute left-0 right-0 top-3 h-1" />
              <div
                className="bg-accent-primary absolute left-0 top-3 h-1 transition-all duration-1000"
>>>>>>> recover/cabinet-wip-from-stash
                style={{ width: `${(activeStage / (stages.length - 1)) * 100}%` }}
              />

              {stages.map((s, i) => (
                <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-500',
                      i <= activeStage
<<<<<<< HEAD
                        ? 'bg-slate-900 text-white shadow-xl shadow-slate-200'
                        : 'border-2 border-slate-100 bg-white text-slate-200'
=======
                        ? 'bg-text-primary text-white shadow-md shadow-xl'
                        : 'text-text-muted border-border-subtle border-2 bg-white'
>>>>>>> recover/cabinet-wip-from-stash
                    )}
                  >
                    <s.icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-1 text-center">
                    <p
                      className={cn(
                        'text-[9px] font-black uppercase tracking-tight',
<<<<<<< HEAD
                        i <= activeStage ? 'text-slate-900' : 'text-slate-300'
=======
                        i <= activeStage ? 'text-text-primary' : 'text-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
                      )}
                    >
                      {s.label}
                    </p>
                    <Badge
                      className={cn(
                        'border-none text-[7px] font-black uppercase',
                        i < activeStage
                          ? 'bg-emerald-50 text-emerald-600'
                          : i === activeStage
                            ? 'bg-amber-50 text-amber-600'
<<<<<<< HEAD
                            : 'bg-slate-50 text-slate-300'
=======
                            : 'bg-bg-surface2 text-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
                      )}
                    >
                      {s.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-xl">
              <div className="flex items-center justify-between">
<<<<<<< HEAD
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">
                  Здоровье компонентов
                </h4>
                <Settings2 className="h-4 w-4 text-slate-400" />
=======
                <h4 className="text-text-primary text-sm font-black uppercase tracking-widest">
                  Здоровье компонентов
                </h4>
                <Settings2 className="text-text-muted h-4 w-4" />
>>>>>>> recover/cabinet-wip-from-stash
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Сырьевой поток', val: 98, status: 'stable' },
                  { label: 'Uptime станков', val: 94, status: 'stable' },
                  { label: 'Эффективность персонала', val: 82, status: 'alert' },
                ].map((c, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[9px] font-black uppercase">
<<<<<<< HEAD
                      <span className="text-slate-400">{c.label}</span>
=======
                      <span className="text-text-muted">{c.label}</span>
>>>>>>> recover/cabinet-wip-from-stash
                      <span
                        className={c.status === 'stable' ? 'text-emerald-600' : 'text-amber-600'}
                      >
                        {c.val}%
                      </span>
                    </div>
<<<<<<< HEAD
                    <div className="h-1 w-full overflow-hidden rounded-full bg-slate-50">
=======
                    <div className="bg-bg-surface2 h-1 w-full overflow-hidden rounded-full">
>>>>>>> recover/cabinet-wip-from-stash
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${c.val}%` }}
                        className={cn(
                          'h-full',
                          c.status === 'stable' ? 'bg-emerald-500' : 'bg-amber-500'
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

<<<<<<< HEAD
            <Card className="relative space-y-6 overflow-hidden rounded-xl border-none bg-indigo-600 p-4 text-white shadow-xl">
=======
            <Card className="bg-accent-primary relative space-y-6 overflow-hidden rounded-xl border-none p-4 text-white shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
              <div className="absolute right-0 top-0 p-4 opacity-10">
                <CheckCircle2 className="h-32 w-32" />
              </div>
              <div className="relative z-10 space-y-4">
                <h4 className="text-sm font-black uppercase tracking-tight">QA / QC Этап</h4>
                <p className="text-[11px] font-medium uppercase leading-relaxed text-white/80">
                  Автоматическое сканирование первых 100 единиц завершено. Отклонений в целостности
                  швов и распределении графенового покрытия не обнаружено.
                </p>
                <Button
                  variant="outline"
                  className="h-12 w-full rounded-xl border-white/20 bg-white/10 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/20"
                >
                  Просмотреть фото инспекции
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Live Metrics Side */}
        <div className="space-y-4 lg:col-span-4">
<<<<<<< HEAD
          <Card className="space-y-4 rounded-xl border-none bg-slate-900 p-3 text-white shadow-2xl shadow-slate-200/50">
=======
          <Card className="bg-text-primary space-y-4 rounded-xl border-none p-3 text-white shadow-2xl shadow-md">
>>>>>>> recover/cabinet-wip-from-stash
            <div className="space-y-1">
              <h3 className="text-base font-black uppercase tracking-tight">
                Метрики в реальном времени
              </h3>
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/40">
                Стриминг с узла фабрики #RU-01
              </p>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Раскроено', val: '1,250 / 1,250', pct: 100 },
                {
                  label: 'Сшито',
                  val: `${Math.round(1250 * (pulseData.sewing / 100))} / 1,250`,
                  pct: pulseData.sewing,
                },
                { label: 'Проверка качества', val: '0 / 1,250', pct: 0 },
                { label: 'Упаковано', val: '0 / 1,250', pct: 0 },
              ].map((m, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="mb-1 text-[8px] font-black uppercase text-white/40">
                        {m.label}
                      </p>
                      <p className="text-sm font-black tabular-nums">{m.val}</p>
                    </div>
<<<<<<< HEAD
                    <span className="text-[10px] font-black text-indigo-400">
=======
                    <span className="text-accent-primary text-[10px] font-black">
>>>>>>> recover/cabinet-wip-from-stash
                      {Math.round(m.pct)}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                    <motion.div
<<<<<<< HEAD
                      className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
=======
                      className="bg-accent-primary h-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
>>>>>>> recover/cabinet-wip-from-stash
                      animate={{ width: `${m.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-4 pt-4">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-white/40" />
                <div className="space-y-0.5">
                  <p className="text-[8px] font-black uppercase text-white/40">Ожид. завершение</p>
                  <p className="text-[10px] font-black uppercase text-white">28 фев, 2026</p>
                </div>
              </div>
              <Badge className="border-none bg-emerald-500 text-[8px] font-black uppercase text-white">
                В графике
              </Badge>
            </div>
          </Card>

          <Card className="flex flex-col items-center space-y-4 rounded-xl border-none bg-white p-4 text-center shadow-xl">
<<<<<<< HEAD
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
              <Maximize2 className="h-6 w-6 text-slate-300" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">
                Живая AR-проекция
              </h4>
              <p className="text-[10px] font-medium uppercase leading-relaxed text-slate-400">
=======
            <div className="bg-bg-surface2 flex h-12 w-12 items-center justify-center rounded-full">
              <Maximize2 className="text-text-muted h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-text-primary text-sm font-black uppercase tracking-tight">
                Живая AR-проекция
              </h4>
              <p className="text-text-muted text-[10px] font-medium uppercase leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                Просматривайте 3D цифровой двойник вашей производственной линии в AR для проверки
                конкретных узлов.
              </p>
            </div>
            <Button
              variant="outline"
<<<<<<< HEAD
              className="h-12 w-full rounded-2xl border-slate-100 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50"
=======
              className="border-border-subtle hover:bg-bg-surface2 h-12 w-full rounded-2xl text-[10px] font-black uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
            >
              Запустить AR-просмотр
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

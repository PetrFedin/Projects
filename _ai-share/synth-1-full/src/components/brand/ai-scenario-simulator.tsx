'use client';

import React, { useState, useMemo } from 'react';
import {
  BrainCircuit,
  TrendingUp,
  AlertTriangle,
  Zap,
  DollarSign,
  BarChart3,
  PieChart,
  RefreshCcw,
  ArrowRight,
  Layers,
  Box,
  Globe,
  ShieldCheck,
  Scale,
  Calculator,
  Play,
  Pause,
  Save,
  Share2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function AiScenarioSimulator() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Variables
  const [volume, setVolume] = useState([5000]); // units
  const [fabricCost, setFabricCost] = useState([1200]); // per meter
  const [logisticRisk, setLogisticRisk] = useState([20]); // %

  // Calculated base values (mock logic)
  const results = useMemo(() => {
    const v = volume[0];
    const c = fabricCost[0];
    const r = logisticRisk[0];

    const revenue = v * 8500;
    const prodCost = v * (c * 2.5 + 1500); // fabric * consumption + labor
    const shipCost = v * 400 * (1 + r / 100);
    const profit = revenue - prodCost - shipCost;
    const margin = (profit / revenue) * 100;

    return {
      revenue: (revenue / 1000000).toFixed(1),
      profit: (profit / 1000000).toFixed(1),
      margin: margin.toFixed(1),
      riskScore: Math.min(r * 1.5 + (v > 10000 ? 20 : 0), 100).toFixed(0),
    };
  }, [volume, fabricCost, logisticRisk]);

  const runSimulation = () => {
    setIsSimulating(true);
    setShowResults(false);
    setTimeout(() => {
      setIsSimulating(false);
      setShowResults(true);
    }, 2000);
  };

  return (
    <Card className="overflow-hidden rounded-xl border-none bg-white shadow-2xl">
      <CardHeader className="bg-slate-900 p-3 pb-4 text-white">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="mb-1 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600">
                <BrainCircuit className="h-4 w-4 text-white" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                Business Twin AI
              </span>
            </div>
            <CardTitle className="text-base font-bold uppercase tracking-tighter">
              AI Scenario Simulator
            </CardTitle>
            <CardDescription className="font-medium text-slate-400">
              Моделирование прибыли и рисков коллекции перед запуском производства.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="h-10 rounded-xl border-white/10 bg-white/5 px-4 text-[9px] font-bold uppercase text-white"
            >
              <Save className="mr-2 h-3.5 w-3.5" /> Сохранить сценарий
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-10">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
          {/* Controls Column */}
          <div className="space-y-10 lg:col-span-4">
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Тираж коллекции (ед.)
                  </label>
                  <span className="text-sm font-bold tabular-nums">
                    {volume[0].toLocaleString('ru-RU')}
                  </span>
                </div>
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={20000}
                  step={100}
                  className="py-4"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Цена ткани (₽/м)
                  </label>
                  <span className="text-sm font-bold tabular-nums">
                    {fabricCost[0].toLocaleString('ru-RU')}
                  </span>
                </div>
                <Slider
                  value={fabricCost}
                  onValueChange={setFabricCost}
                  max={5000}
                  step={50}
                  className="py-4"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Риск логистики (%)
                  </label>
                  <span className="text-sm font-bold tabular-nums">{logisticRisk[0]}%</span>
                </div>
                <Slider
                  value={logisticRisk}
                  onValueChange={setLogisticRisk}
                  max={100}
                  step={5}
                  className="py-4"
                />
              </div>
            </div>

            <Button
              onClick={runSimulation}
              disabled={isSimulating}
              className="h-12 w-full rounded-[1.5rem] bg-indigo-600 text-[11px] font-bold uppercase tracking-widest text-white shadow-2xl shadow-indigo-200 transition-transform hover:scale-105"
            >
              {isSimulating ? (
                <RefreshCcw className="mr-3 h-5 w-5 animate-spin" />
              ) : (
                <Play className="mr-3 h-5 w-5 fill-current" />
              )}
              Запустить симуляцию
            </Button>
          </div>

          {/* Visualization Column */}
          <div className="relative overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-3 lg:col-span-8">
            <AnimatePresence mode="wait">
              {isSimulating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full flex-col items-center justify-center space-y-6"
                >
                  <div className="relative">
                    <div className="h-24 w-24 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
                    <BrainCircuit className="absolute inset-0 m-auto h-8 w-8 animate-pulse text-indigo-600" />
                  </div>
                  <div className="text-center">
                    <h4 className="text-base font-bold uppercase tracking-tighter">
                      AI просчитывает 10,000 вариантов...
                    </h4>
                    <p className="mt-2 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                      Анализ рыночных цен, погоды и портовых задержек
                    </p>
                  </div>
                </motion.div>
              ) : showResults ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full space-y-4"
                >
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
                      <p className="mb-1 text-[10px] font-bold uppercase text-slate-400">
                        Выручка (прогноз)
                      </p>
                      <h4 className="text-base font-bold tabular-nums text-slate-900">
                        {results.revenue}M <span className="text-xs text-slate-400">₽</span>
                      </h4>
                    </div>
                    <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
                      <p className="mb-1 text-[10px] font-bold uppercase text-slate-400">
                        Чистая прибыль
                      </p>
                      <h4 className="text-base font-bold tabular-nums text-indigo-600">
                        {results.profit}M <span className="text-xs text-slate-400">₽</span>
                      </h4>
                    </div>
                    <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
                      <p className="mb-1 text-[10px] font-bold uppercase text-slate-400">
                        Рентабельность
                      </p>
                      <h4 className="text-base font-bold tabular-nums text-emerald-500">
                        {results.margin}%
                      </h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-6">
                      <h5 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-900">
                        <AlertTriangle className="h-4 w-4 text-amber-500" /> Анализ рисков
                      </h5>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-bold uppercase">
                            <span>Вероятность задержки поставки</span>
                            <span className="text-amber-600">{results.riskScore}%</span>
                          </div>
                          <Progress
                            value={parseInt(results.riskScore)}
                            className="h-1.5 bg-slate-200"
                          />
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-tight text-slate-500">
                          «При выбранном объеме логистическая нагрузка на хаб в Москве возрастет. AI
                          рекомендует диверсифицировать отгрузку через Питер.»
                        </p>
                      </div>
                    </div>

                    <div className="relative flex flex-col justify-between overflow-hidden rounded-xl bg-slate-900 p-4 text-white">
                      <div className="absolute right-0 top-0 p-4 opacity-10">
                        <TrendingUp className="h-20 w-20" />
                      </div>
                      <div className="relative z-10">
                        <Badge className="mb-4 border-none bg-indigo-600 text-[8px] font-bold uppercase text-white">
                          AI Insight
                        </Badge>
                        <h4 className="mb-2 text-sm font-bold uppercase leading-tight">
                          Оптимальная стратегия
                        </h4>
                        <p className="text-[10px] leading-relaxed text-slate-400">
                          Снизьте тираж на 15% и увеличьте розничную цену на 8%. Это поднимет чистую
                          прибыль на 1.2M ₽ при снижении риска неликвида на 24%.
                        </p>
                      </div>
                      <Button className="mt-6 h-10 w-full rounded-xl bg-white text-[9px] font-bold uppercase text-slate-900 hover:bg-slate-100">
                        Применить стратегию
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center space-y-4 p-4 text-center opacity-40">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-200">
                    <Layers className="h-10 w-10 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold uppercase tracking-tighter">
                      Ожидание параметров
                    </h4>
                    <p className="mx-auto max-w-xs text-xs font-bold uppercase text-slate-400">
                      Настройте переменные в левой панели, чтобы увидеть проекцию будущего вашей
                      коллекции.
                    </p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

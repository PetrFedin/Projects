'use client';

import React, { useState, useMemo } from 'react';
import { 
  BrainCircuit, TrendingUp, AlertTriangle, Zap, 
  DollarSign, BarChart3, PieChart, RefreshCcw,
  ArrowRight, Layers, Box, Globe, ShieldCheck,
  Scale, Calculator, Play, Pause, Save, Share2
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
    const shipCost = v * 400 * (1 + r/100);
    const profit = revenue - prodCost - shipCost;
    const margin = (profit / revenue) * 100;
    
    return {
      revenue: (revenue / 1000000).toFixed(1),
      profit: (profit / 1000000).toFixed(1),
      margin: margin.toFixed(1),
      riskScore: Math.min(r * 1.5 + (v > 10000 ? 20 : 0), 100).toFixed(0)
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
    <Card className="rounded-xl border-none shadow-2xl overflow-hidden bg-white">
      <CardHeader className="p-3 pb-4 bg-slate-900 text-white">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-6 w-6 bg-indigo-600 rounded-lg flex items-center justify-center">
                <BrainCircuit className="h-4 w-4 text-white" />
              </div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Business Twin AI</span>
            </div>
            <CardTitle className="text-base font-bold uppercase tracking-tighter">AI Scenario Simulator</CardTitle>
            <CardDescription className="text-slate-400 font-medium">Моделирование прибыли и рисков коллекции перед запуском производства.</CardDescription>
          </div>
          <div className="flex gap-2">
             <Button variant="outline" className="bg-white/5 border-white/10 text-white rounded-xl h-10 px-4 text-[9px] font-bold uppercase">
                <Save className="h-3.5 w-3.5 mr-2" /> Сохранить сценарий
             </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Controls Column */}
          <div className="lg:col-span-4 space-y-10">
             <div className="space-y-4">
                <div className="space-y-4">
                   <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Тираж коллекции (ед.)</label>
                      <span className="text-sm font-bold tabular-nums">{volume[0].toLocaleString('ru-RU')}</span>
                   </div>
                   <Slider value={volume} onValueChange={setVolume} max={20000} step={100} className="py-4" />
                </div>

                <div className="space-y-4">
                   <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Цена ткани (₽/м)</label>
                      <span className="text-sm font-bold tabular-nums">{fabricCost[0].toLocaleString('ru-RU')}</span>
                   </div>
                   <Slider value={fabricCost} onValueChange={setFabricCost} max={5000} step={50} className="py-4" />
                </div>

                <div className="space-y-4">
                   <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Риск логистики (%)</label>
                      <span className="text-sm font-bold tabular-nums">{logisticRisk[0]}%</span>
                   </div>
                   <Slider value={logisticRisk} onValueChange={setLogisticRisk} max={100} step={5} className="py-4" />
                </div>
             </div>

             <Button 
              onClick={runSimulation}
              disabled={isSimulating}
              className="w-full h-12 bg-indigo-600 text-white rounded-[1.5rem] font-bold uppercase text-[11px] tracking-widest hover:scale-105 transition-transform shadow-2xl shadow-indigo-200"
             >
               {isSimulating ? <RefreshCcw className="h-5 w-5 animate-spin mr-3" /> : <Play className="h-5 w-5 mr-3 fill-current" />}
               Запустить симуляцию
             </Button>
          </div>

          {/* Visualization Column */}
          <div className="lg:col-span-8 bg-slate-50 rounded-xl border border-slate-100 p-3 relative overflow-hidden">
             <AnimatePresence mode="wait">
                {isSimulating ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center space-y-6"
                  >
                     <div className="relative">
                        <div className="h-24 w-24 border-4 border-indigo-100 rounded-full animate-spin border-t-indigo-600" />
                        <BrainCircuit className="absolute inset-0 m-auto h-8 w-8 text-indigo-600 animate-pulse" />
                     </div>
                     <div className="text-center">
                        <h4 className="text-base font-bold uppercase tracking-tighter">AI просчитывает 10,000 вариантов...</h4>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-2">Анализ рыночных цен, погоды и портовых задержек</p>
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
                        <div className="p-4 bg-white rounded-3xl shadow-sm border border-slate-100">
                           <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Выручка (прогноз)</p>
                           <h4 className="text-base font-bold text-slate-900 tabular-nums">{results.revenue}M <span className="text-xs text-slate-400">₽</span></h4>
                        </div>
                        <div className="p-4 bg-white rounded-3xl shadow-sm border border-slate-100">
                           <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Чистая прибыль</p>
                           <h4 className="text-base font-bold text-indigo-600 tabular-nums">{results.profit}M <span className="text-xs text-slate-400">₽</span></h4>
                        </div>
                        <div className="p-4 bg-white rounded-3xl shadow-sm border border-slate-100">
                           <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Рентабельность</p>
                           <h4 className="text-base font-bold text-emerald-500 tabular-nums">{results.margin}%</h4>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-6">
                           <h5 className="text-[11px] font-bold uppercase tracking-widest text-slate-900 flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-amber-500" /> Анализ рисков
                           </h5>
                           <div className="space-y-4">
                              <div className="space-y-2">
                                 <div className="flex justify-between text-[10px] font-bold uppercase">
                                    <span>Вероятность задержки поставки</span>
                                    <span className="text-amber-600">{results.riskScore}%</span>
                                 </div>
                                 <Progress value={parseInt(results.riskScore)} className="h-1.5 bg-slate-200" />
                              </div>
                              <p className="text-[10px] font-bold uppercase tracking-tight text-slate-500">
                                 «При выбранном объеме логистическая нагрузка на хаб в Москве возрастет. AI рекомендует диверсифицировать отгрузку через Питер.»
                              </p>
                           </div>
                        </div>

                        <div className="p-4 bg-slate-900 rounded-xl text-white flex flex-col justify-between overflow-hidden relative">
                           <div className="absolute top-0 right-0 p-4 opacity-10">
                              <TrendingUp className="h-20 w-20" />
                           </div>
                           <div className="relative z-10">
                              <Badge className="bg-indigo-600 text-white border-none uppercase text-[8px] font-bold mb-4">AI Insight</Badge>
                              <h4 className="text-sm font-bold uppercase leading-tight mb-2">Оптимальная стратегия</h4>
                              <p className="text-[10px] text-slate-400 leading-relaxed">
                                 Снизьте тираж на 15% и увеличьте розничную цену на 8%. Это поднимет чистую прибыль на 1.2M ₽ при снижении риска неликвида на 24%.
                              </p>
                           </div>
                           <Button className="mt-6 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold uppercase text-[9px] h-10 w-full">Применить стратегию</Button>
                        </div>
                     </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-4 opacity-40">
                     <div className="h-20 w-20 bg-slate-200 rounded-full flex items-center justify-center">
                        <Layers className="h-10 w-10 text-slate-400" />
                     </div>
                     <div>
                        <h4 className="text-base font-bold uppercase tracking-tighter">Ожидание параметров</h4>
                        <p className="text-xs font-bold text-slate-400 uppercase max-w-xs mx-auto">Настройте переменные в левой панели, чтобы увидеть проекцию будущего вашей коллекции.</p>
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

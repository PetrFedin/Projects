'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Truck, Globe, Zap, AlertTriangle, CheckCircle2, 
  MapPin, Clock, Navigation, ShieldCheck, 
  RefreshCcw, Filter, Search, TrendingUp, Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_ROUTES = [
  { id: 'r1', from: 'Shanghai, CN', to: 'Moscow, RU', status: 'In Transit', progress: 65, eta: '12 Feb', risk: 'Low', method: 'Rail/Sea' },
  { id: 'r2', from: 'Istanbul, TR', to: 'Almaty, KZ', status: 'Delayed', progress: 20, eta: '18 Feb', risk: 'High', method: 'Road' },
  { id: 'r3', from: 'Milan, IT', to: 'Dubai, AE', status: 'Scheduled', progress: 0, eta: '14 Feb', risk: 'Low', method: 'Air' }
];

export function RealRouteAi() {
  const [activeRouteId, setActiveRouteId] = useState<string | null>('r1');
  const [isRerouting, setIsRerouting] = useState(false);
  const activeRoute = useMemo(() => MOCK_ROUTES.find(r => r.id === activeRouteId), [activeRouteId]);

  const handleReroute = () => {
    setIsRerouting(true);
    setTimeout(() => setIsRerouting(false), 3000);
  };

  return (
    <Card className="rounded-xl border-none shadow-2xl overflow-hidden bg-white">
      <CardHeader className="p-3 pb-4 bg-slate-900 text-white">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <Navigation className="h-6 w-6 text-indigo-400" />
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Real-Route AI Engine</span>
            </div>
            <CardTitle className="text-base font-black uppercase tracking-tighter">Интеллектуальная Логистика</CardTitle>
            <CardDescription className="text-slate-400 font-medium italic">Предиктивный анализ задержек и автоматическое перестроение маршрутов.</CardDescription>
          </div>
          <div className="flex gap-3">
             <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md flex flex-col items-end">
                <p className="text-[8px] font-black uppercase text-indigo-400">Точность прогноза ETA</p>
                <p className="text-sm font-black text-white">98.2%</p>
             </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
           {/* Global Map Mockup */}
           <div className="lg:col-span-8">
              <div className="relative aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                 {/* This would be a real map in production */}
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4">
                       <Globe className="h-24 w-24 text-slate-200 mx-auto animate-pulse" />
                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Global Logistics Visualizer</p>
                    </div>
                 </div>

                 {/* Animated Route Line Mockup */}
                 <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <motion.path 
                      d="M 200 300 Q 400 100 600 300"
                      fill="transparent"
                      stroke="#4f46e5"
                      strokeWidth="3"
                      strokeDasharray="10 5"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                 </svg>

                 {/* Active Trackers */}
                 <AnimatePresence>
                    {MOCK_ROUTES.map((route, i) => (
                      <motion.div 
                        key={route.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={cn(
                          "absolute h-10 w-10 bg-white rounded-xl shadow-2xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform border border-slate-100",
                          activeRouteId === route.id && "ring-4 ring-indigo-600 ring-offset-2 z-20"
                        )}
                        style={{ top: `${20 + i * 20}%`, left: `${15 + i * 25}%` }}
                        onClick={() => setActiveRouteId(route.id)}
                      >
                         <Truck className={cn("h-5 w-5", route.status === 'Delayed' ? 'text-rose-500' : 'text-indigo-600')} />
                         {route.status === 'Delayed' && (
                           <span className="absolute -top-1 -right-1 h-3 w-3 bg-rose-500 rounded-full animate-ping" />
                         )}
                      </motion.div>
                    ))}
                 </AnimatePresence>
              </div>
           </div>

           {/* Route Analysis Sidebar */}
           <div className="lg:col-span-4 space-y-6">
              <AnimatePresence mode="wait">
                 {activeRoute && (
                   <motion.div 
                     key={activeRoute.id}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="space-y-6"
                   >
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-6">
                         <div className="flex justify-between items-start">
                            <Badge className={cn(
                              "text-[8px] font-black uppercase px-2 py-1",
                              activeRoute.status === 'Delayed' ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"
                            )}>
                               {activeRoute.status}
                            </Badge>
                            <span className="text-[10px] font-black uppercase text-slate-400">ETA: {activeRoute.eta}</span>
                         </div>
                         
                         <div className="space-y-1">
                            <h4 className="text-base font-black uppercase tracking-tighter text-slate-900">{activeRoute.from} → {activeRoute.to}</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{activeRoute.method}</p>
                         </div>

                         <div className="space-y-2">
                            <div className="flex justify-between text-[9px] font-black uppercase">
                               <span>Прогресс пути</span>
                               <span>{activeRoute.progress}%</span>
                            </div>
                            <Progress value={activeRoute.progress} className="h-1.5 bg-slate-200" />
                         </div>

                         {activeRoute.status === 'Delayed' && (
                           <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 space-y-2">
                              <div className="flex items-center gap-2 text-rose-600">
                                 <AlertTriangle className="h-4 w-4" />
                                 <span className="text-[10px] font-black uppercase">Риск: Пробка на границе</span>
                              </div>
                              <p className="text-[9px] text-rose-700/70 font-medium">Ожидаемая задержка: 48 часов. AI рекомендует перестроить маршрут через альтернативный ТЛЦ.</p>
                           </div>
                         )}

                         <Button 
                           onClick={handleReroute}
                           disabled={isRerouting}
                           className={cn(
                             "w-full h-10 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all",
                             activeRoute.status === 'Delayed' ? "bg-indigo-600 text-white" : "bg-slate-900 text-white"
                           )}
                         >
                            {isRerouting ? (
                              <div className="flex items-center gap-2">
                                 <RefreshCcw className="h-4 w-4 animate-spin" /> Пересчет...
                              </div>
                            ) : activeRoute.status === 'Delayed' ? "Перестроить маршрут" : "Детали пути"}
                         </Button>
                      </div>

                      <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm space-y-4">
                         <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            <span className="text-[10px] font-black uppercase text-slate-900">Таможенный статус</span>
                         </div>
                         <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-slate-50 rounded-xl">
                               <p className="text-[8px] font-black uppercase text-slate-400">Документы</p>
                               <p className="text-[10px] font-black text-emerald-600">Готовы (12/12)</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl">
                               <p className="text-[8px] font-black uppercase text-slate-400">Пошлина</p>
                               <p className="text-[10px] font-black text-slate-900">Оплачена</p>
                            </div>
                         </div>
                      </div>
                   </motion.div>
                 )}
              </AnimatePresence>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}

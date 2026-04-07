'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, ScanBarcode, CheckCircle2, AlertTriangle, 
  RefreshCcw, Download, History, Zap, ShieldAlert, FileText,
  Activity, ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function GismtMonitor() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [markingProgress, setMarkingProgress] = useState(0);

  const startSync = () => {
    setIsSyncing(true);
    setMarkingProgress(0);
    const interval = setInterval(() => {
      setMarkingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSyncing(false);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  return (
    <Card className="rounded-sm border-indigo-100 shadow-sm overflow-hidden bg-white">
      <CardHeader className="p-4 border-b border-indigo-50 bg-indigo-50/30">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="h-4 w-4 text-indigo-600" />
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Russian Market Compliance</span>
            </div>
            <CardTitle className="text-base font-black uppercase tracking-tighter flex items-center gap-2">
              Честный ЗНАК / ГИСМТ Live
            </CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">
              Автоматическая маркировка и контроль оборота товаров в РФ
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-emerald-100 text-emerald-700 border-none h-6 px-2 text-[8px] font-black uppercase flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              ГИСМТ: Online
            </Badge>
            <Button 
              size="sm"
              onClick={startSync}
              disabled={isSyncing}
              className="h-8 bg-indigo-600 text-white hover:bg-indigo-700 rounded-none text-[9px] font-black uppercase px-4"
            >
              {isSyncing ? <RefreshCcw className="h-3 w-3 animate-spin mr-2" /> : <RefreshCcw className="h-3 w-3 mr-2" />}
              Синхронизировать
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Main Counter */}
          <div className="md:col-span-1 space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-none relative overflow-hidden group">
              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Ожидают маркировки</p>
              <div className="flex items-end gap-2">
                <h4 className="text-base font-black text-slate-900 tabular-nums">1,240</h4>
                <span className="text-[10px] font-black text-rose-500 mb-1 uppercase tracking-tighter">КМ</span>
              </div>
              <p className="text-[8px] text-slate-400 font-bold uppercase mt-1">Партия: Urban Jacket SS26</p>
              <ScanBarcode className="absolute -right-2 -bottom-2 h-12 w-12 text-slate-200 opacity-50 group-hover:scale-110 transition-transform" />
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-none relative overflow-hidden group">
              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Баланс кодов (ЦРПТ)</p>
              <div className="flex items-end gap-2">
                <h4 className="text-sm font-black text-slate-900 tabular-nums">48,000</h4>
                <span className="text-[10px] font-black text-indigo-600 mb-1 uppercase tracking-tighter">₽</span>
              </div>
              <p className="text-[8px] text-indigo-600 font-bold uppercase mt-1">Хватит на 80,000 ед.</p>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                <History className="h-3.5 w-3.5 text-indigo-600" /> Последние действия
              </h5>
              <button className="text-[8px] font-black uppercase text-indigo-600 hover:underline">Все отчеты</button>
            </div>
            
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
              {[
                { action: 'Заказ кодов', target: '2,500 КМ', status: 'success', time: '10 мин назад', desc: 'Заявка №29421-ГИСМТ' },
                { action: 'Ввод в оборот', target: '800 ед.', status: 'success', time: '2 часа назад', desc: 'Партия SKU-9921' },
                { action: 'Выбытие (Чек)', target: '1 ед.', status: 'success', time: '15:20', desc: 'Магазин "Подиум" (Retail)' },
                { action: 'Ошибка агрегации', target: 'Короб #4', status: 'error', time: 'Вчера', desc: 'Нечитаемый код в упаковке' },
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-none bg-slate-50/50 hover:bg-white transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-8 w-8 rounded-none flex items-center justify-center",
                      log.status === 'success' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    )}>
                      {log.status === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-900 uppercase leading-tight">{log.action}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">{log.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-900 uppercase leading-tight">{log.target}</p>
                    <p className="text-[8px] text-slate-400 font-bold uppercase">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions / Integration */}
          <div className="md:col-span-1 space-y-4">
             <div className="p-4 bg-indigo-600 rounded-none text-white space-y-4 relative overflow-hidden group">
                <div className="relative z-10">
                  <h6 className="text-[10px] font-black uppercase tracking-widest mb-4">Маркировка Live</h6>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full h-8 bg-white/10 border-white/20 text-white rounded-none text-[9px] font-black uppercase hover:bg-white/20 transition-all justify-start">
                      <Download className="h-3.5 w-3.5 mr-2" /> Скачать КМ (PDF/CSV)
                    </Button>
                    <Button variant="outline" className="w-full h-8 bg-white/10 border-white/20 text-white rounded-none text-[9px] font-black uppercase hover:bg-white/20 transition-all justify-start">
                      <FileText className="h-3.5 w-3.5 mr-2" /> Реестр агрегации
                    </Button>
                    <Button className="w-full h-10 bg-white text-indigo-600 rounded-none text-[9px] font-black uppercase hover:bg-indigo-50 transition-all shadow-xl">
                      Отчет о нанесении
                    </Button>
                  </div>
                </div>
                <Activity className="absolute -right-8 -bottom-8 h-24 w-24 text-white opacity-10 group-hover:scale-110 transition-transform" />
             </div>
             
             <div className="p-4 border border-slate-200 rounded-none flex items-center justify-between">
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase">Партнер по ЭДО</p>
                  <p className="text-[10px] font-black text-slate-900 uppercase">СБИС / Тензор</p>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-slate-300" />
             </div>
          </div>
        </div>

        {/* Sync Progress Overlay */}
        <AnimatePresence>
          {isSyncing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4 space-y-6"
            >
              <div className="relative">
                <RefreshCcw className="h-12 w-12 text-indigo-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-black text-indigo-900 tabular-nums">{markingProgress}%</span>
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-base font-black uppercase tracking-tighter">Синхронизация с ЦРПТ...</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Проверка статусов 428 кодов маркировки</p>
              </div>
              <div className="w-full max-w-sm">
                <Progress value={markingProgress} className="h-1 bg-indigo-100" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

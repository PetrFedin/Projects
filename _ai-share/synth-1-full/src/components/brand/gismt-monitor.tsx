'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ScanBarcode,
  CheckCircle2,
  AlertTriangle,
  RefreshCcw,
  Download,
  History,
  Zap,
  ShieldAlert,
  FileText,
  Activity,
  ExternalLink,
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
      setMarkingProgress((prev) => {
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
    <Card className="border-accent-primary/20 overflow-hidden rounded-sm bg-white shadow-sm">
      <CardHeader className="border-accent-primary/15 bg-accent-primary/10 border-b p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="mb-1 flex items-center gap-2">
              <ShieldCheck className="text-accent-primary h-4 w-4" />
              <span className="text-accent-primary text-[10px] font-black uppercase tracking-widest">
                Russian Market Compliance
              </span>
            </div>
            <CardTitle className="flex items-center gap-2 text-base font-black uppercase tracking-tighter">
              Честный ЗНАК / ГИСМТ Live
            </CardTitle>
            <CardDescription className="text-text-secondary text-[10px] font-bold uppercase">
              Автоматическая маркировка и контроль оборота товаров в РФ
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge className="flex h-6 items-center gap-1.5 border-none bg-emerald-100 px-2 text-[8px] font-black uppercase text-emerald-700">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              ГИСМТ: Online
            </Badge>
            <Button
              size="sm"
              onClick={startSync}
              disabled={isSyncing}
              className="bg-accent-primary hover:bg-accent-primary h-8 rounded-none px-4 text-[9px] font-black uppercase text-white"
            >
              {isSyncing ? (
                <RefreshCcw className="mr-2 h-3 w-3 animate-spin" />
              ) : (
                <RefreshCcw className="mr-2 h-3 w-3" />
              )}
              Синхронизировать
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          {/* Main Counter */}
          <div className="space-y-4 md:col-span-1">
            <div className="bg-bg-surface2 border-border-subtle group relative overflow-hidden rounded-none border p-4">
              <p className="text-text-muted mb-1 text-[9px] font-black uppercase">
                Ожидают маркировки
              </p>
              <div className="flex items-end gap-2">
                <h4 className="text-text-primary text-base font-black tabular-nums">1,240</h4>
                <span className="mb-1 text-[10px] font-black uppercase tracking-tighter text-rose-500">
                  КМ
                </span>
              </div>
              <p className="text-text-muted mt-1 text-[8px] font-bold uppercase">
                Партия: Urban Jacket SS26
              </p>
              <ScanBarcode className="text-text-muted absolute -bottom-2 -right-2 h-12 w-12 opacity-50 transition-transform group-hover:scale-110" />
            </div>
            <div className="bg-bg-surface2 border-border-subtle group relative overflow-hidden rounded-none border p-4">
              <p className="text-text-muted mb-1 text-[9px] font-black uppercase">
                Баланс кодов (ЦРПТ)
              </p>
              <div className="flex items-end gap-2">
                <h4 className="text-text-primary text-sm font-black tabular-nums">48,000</h4>
                <span className="text-accent-primary mb-1 text-[10px] font-black uppercase tracking-tighter">
                  ₽
                </span>
              </div>
              <p className="text-accent-primary mt-1 text-[8px] font-bold uppercase">
                Хватит на 80,000 ед.
              </p>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center justify-between">
              <h5 className="text-text-primary flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                <History className="text-accent-primary h-3.5 w-3.5" /> Последние действия
              </h5>
              <button className="text-accent-primary text-[8px] font-black uppercase hover:underline">
                Все отчеты
              </button>
            </div>

            <div className="custom-scrollbar max-h-[160px] space-y-2 overflow-y-auto pr-2">
              {[
                {
                  action: 'Заказ кодов',
                  target: '2,500 КМ',
                  status: 'success',
                  time: '10 мин назад',
                  desc: 'Заявка №29421-ГИСМТ',
                },
                {
                  action: 'Ввод в оборот',
                  target: '800 ед.',
                  status: 'success',
                  time: '2 часа назад',
                  desc: 'Партия SKU-9921',
                },
                {
                  action: 'Выбытие (Чек)',
                  target: '1 ед.',
                  status: 'success',
                  time: '15:20',
                  desc: 'Магазин "Подиум" (Retail)',
                },
                {
                  action: 'Ошибка агрегации',
                  target: 'Короб #4',
                  status: 'error',
                  time: 'Вчера',
                  desc: 'Нечитаемый код в упаковке',
                },
              ].map((log, i) => (
                <div
                  key={i}
                  className="border-border-subtle bg-bg-surface2/80 group flex items-center justify-between rounded-none border p-3 transition-colors hover:bg-white"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-none',
                        log.status === 'success'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-rose-50 text-rose-600'
                      )}
                    >
                      {log.status === 'success' ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-text-primary text-[10px] font-black uppercase leading-tight">
                        {log.action}
                      </p>
                      <p className="text-text-muted text-[9px] font-bold uppercase tracking-tight">
                        {log.desc}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-text-primary text-[10px] font-black uppercase leading-tight">
                      {log.target}
                    </p>
                    <p className="text-text-muted text-[8px] font-bold uppercase">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions / Integration */}
          <div className="space-y-4 md:col-span-1">
            <div className="bg-accent-primary group relative space-y-4 overflow-hidden rounded-none p-4 text-white">
              <div className="relative z-10">
                <h6 className="mb-4 text-[10px] font-black uppercase tracking-widest">
                  Маркировка Live
                </h6>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="h-8 w-full justify-start rounded-none border-white/20 bg-white/10 text-[9px] font-black uppercase text-white transition-all hover:bg-white/20"
                  >
                    <Download className="mr-2 h-3.5 w-3.5" /> Скачать КМ (PDF/CSV)
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-full justify-start rounded-none border-white/20 bg-white/10 text-[9px] font-black uppercase text-white transition-all hover:bg-white/20"
                  >
                    <FileText className="mr-2 h-3.5 w-3.5" /> Реестр агрегации
                  </Button>
                  <Button className="text-accent-primary hover:bg-accent-primary/10 h-10 w-full rounded-none bg-white text-[9px] font-black uppercase shadow-xl transition-all">
                    Отчет о нанесении
                  </Button>
                </div>
              </div>
              <Activity className="absolute -bottom-8 -right-8 h-24 w-24 text-white opacity-10 transition-transform group-hover:scale-110" />
            </div>

            <div className="border-border-default flex items-center justify-between rounded-none border p-4">
              <div>
                <p className="text-text-muted text-[8px] font-black uppercase">Партнер по ЭДО</p>
                <p className="text-text-primary text-[10px] font-black uppercase">СБИС / Тензор</p>
              </div>
              <ExternalLink className="text-text-muted h-3.5 w-3.5" />
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
              className="absolute inset-0 z-50 flex flex-col items-center justify-center space-y-6 bg-white/80 p-4 backdrop-blur-sm"
            >
              <div className="relative">
                <RefreshCcw className="text-accent-primary h-12 w-12 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-accent-primary text-xs font-black tabular-nums">
                    {markingProgress}%
                  </span>
                </div>
              </div>
              <div className="space-y-2 text-center">
                <h3 className="text-base font-black uppercase tracking-tighter">
                  Синхронизация с ЦРПТ...
                </h3>
                <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">
                  Проверка статусов 428 кодов маркировки
                </p>
              </div>
              <div className="w-full max-w-sm">
                <Progress value={markingProgress} className="bg-accent-primary/15 h-1" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

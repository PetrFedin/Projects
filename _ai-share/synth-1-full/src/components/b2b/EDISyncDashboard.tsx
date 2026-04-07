'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Settings2, 
  FileJson, 
  ShieldCheck,
  History,
  Zap,
  Lock,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUIState } from '@/providers/ui-state';
import { cn } from '@/lib/cn';

export function EDISyncDashboard() {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');

  const integrations = [
    { id: '1c', name: '1C: Предприятие', type: 'ERP', status: 'connected', lastSync: '12 min ago' },
    { id: 'sap', name: 'SAP S/4HANA', type: 'ERP', status: 'available', lastSync: 'Never' },
    { id: 'ms', name: 'MS Dynamics 365', type: 'CRM/ERP', status: 'maintenance', lastSync: '2h ago' }
  ];

  return (
    <div className="space-y-4 p-4 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Database className="h-4 w-4 text-white" />
            </div>
            <Badge variant="outline" className="border-indigo-100 text-indigo-600 uppercase font-black tracking-widest text-[9px]">
              EDI_Integration_v2.1
            </Badge>
          </div>
          <h2 className="text-sm md:text-sm font-black uppercase tracking-tighter text-slate-900 leading-none">
            Синхронизация<br/>Экосистемы
          </h2>
          <p className="text-slate-400 font-medium text-xs max-w-md text-left">
            Прямая EDI-синхронизация с ERP-системами ритейлеров. Автоматизируйте обновление остатков, заказов и цен во всей дистрибьюторской сети.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={() => {
              setSyncStatus('syncing');
              setTimeout(() => setSyncStatus('idle'), 2000);
            }}
            disabled={syncStatus === 'syncing'}
            className="h-10 bg-slate-900 text-white rounded-2xl px-8 font-black uppercase text-[10px] tracking-widest gap-2 shadow-2xl shadow-slate-200"
          >
            {syncStatus === 'syncing' ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Zap className="h-4 w-4" />
            )}
            Force Global Sync
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Main Integration Grid */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Интеграции узлов ритейлеров</h3>
            <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-indigo-600 gap-2 p-0 h-auto hover:bg-transparent">
              Консоль API Webhook <ArrowRight className="h-3 w-3" />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {integrations.map((int) => (
              <Card key={int.id} className="group border-none shadow-xl shadow-slate-200/50 rounded-xl overflow-hidden bg-white hover:scale-[1.01] transition-all">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-12 w-12 rounded-2xl flex items-center justify-center border transition-colors",
                      int.status === 'connected' ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                      int.status === 'maintenance' ? "bg-amber-50 border-amber-100 text-amber-600" :
                      "bg-slate-50 border-slate-100 text-slate-300"
                    )}>
                      <FileJson className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className="text-base font-black text-slate-900 uppercase tracking-tight">{int.name}</h4>
                        <Badge className={cn(
                          "text-[8px] font-black uppercase px-2 py-0.5",
                          int.status === 'connected' ? "bg-emerald-100 text-emerald-600" :
                          int.status === 'maintenance' ? "bg-amber-100 text-amber-600" :
                          "bg-slate-100 text-slate-400"
                        )}>
                          {int.status === 'connected' ? 'подключено' : 
                           int.status === 'maintenance' ? 'обслуживание' : 
                           int.status === 'available' ? 'доступно' : int.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Протокол {int.type}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-200" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Синх: {int.lastSync.replace('min ago', 'мин назад').replace('Never', 'Никогда').replace('h ago', 'ч назад')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-slate-100">
                      <Settings2 className="h-5 w-5 text-slate-400" />
                    </Button>
                    <Button className="h-12 bg-slate-900 text-white rounded-xl px-6 font-black uppercase text-[10px] tracking-widest gap-2 shadow-lg shadow-slate-200">
                      Логи <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sync Analytics Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-indigo-600 text-white p-3 space-y-4 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap className="h-32 w-32" />
            </div>
            
            <div className="relative z-10 space-y-6">
              <h3 className="text-sm font-black uppercase tracking-tight">Целостность синхронизации</h3>
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Показатель здоровья</span>
                  <span className="text-base font-black tabular-nums text-white">99.8%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '99.8%' }}
                    className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
                  />
                </div>
              </div>
              <div className="pt-4 grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-[8px] font-black uppercase text-indigo-200 tracking-widest">Всего SKU сопоставлено</p>
                  <p className="text-sm font-black">12,450</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-black uppercase text-indigo-200 tracking-widest">Активные каналы</p>
                  <p className="text-sm font-black">128</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-white p-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center">
                <History className="h-5 w-5 text-slate-400" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">Очередь автоматизации</h4>
            </div>
            <div className="space-y-4">
              {[
                { title: 'Обновление остатков Real-time', status: 'success' },
                { title: 'Пуш оптовых цен', status: 'pending' },
                { title: 'Синхронизация цифровых контрактов', status: 'success' }
              ].map((job, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                  <span className="text-[10px] font-black text-slate-900 uppercase">{job.title}</span>
                  {job.status === 'success' ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Zap className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

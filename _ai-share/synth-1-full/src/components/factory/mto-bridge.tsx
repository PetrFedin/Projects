'use client';

import React, { useState } from 'react';
import {
  User,
  Shirt,
  Scissors,
  ChevronRight,
  CheckCircle2,
  Clock,
  Zap,
  Layout,
  Settings,
  Sparkles,
  Box,
  Smartphone,
  MessageSquare,
  AlertTriangle,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_MTO_ORDERS = [
  {
    id: 'mto-1',
    client: 'Анна С.',
    item: 'Urban Parka Custom',
    mods: ['Вышивка "AS"', 'Удлиненный рукав +2см'],
    status: 'cutting',
    priority: 'high',
    time: '1ч назад',
  },
  {
    id: 'mto-2',
    client: 'Иван К.',
    item: 'Tech Blazer',
    mods: ['Контрастный подклад', 'Скрытый карман'],
    status: 'queue',
    priority: 'medium',
    time: '3ч назад',
  },
  {
    id: 'mto-3',
    client: 'Елена М.',
    item: 'Silk Dress',
    mods: ['Длина миди', 'Пояс в цвет'],
    status: 'sewing',
    priority: 'urgent',
    time: '15 мин назад',
  },
];

export function MtoBridge() {
  const [activeTab, setActiveTab] = useState<'orders' | 'config'>('orders');

  return (
    <Card className="overflow-hidden rounded-xl border-none bg-white shadow-2xl">
      <CardHeader className="bg-accent-primary p-3 pb-4 text-white">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="mb-1 flex items-center gap-2">
              <Shirt className="h-6 w-6 text-white" />
              <span className="text-accent-primary/40 text-[10px] font-black uppercase tracking-widest">
                Made-to-Order Bridge
              </span>
            </div>
            <CardTitle className="text-base font-black uppercase tracking-tighter">
              MTO Direct Channel
            </CardTitle>
            <CardDescription className="text-accent-primary/30 font-medium italic">
              Прямой поток кастомных заказов от клиентов в производственный цех.
            </CardDescription>
          </div>
          <div className="flex rounded-2xl bg-white/10 p-1 backdrop-blur-md">
            <button
              onClick={() => setActiveTab('orders')}
              className={cn(
                'rounded-xl px-4 py-2 text-[10px] font-black uppercase transition-all',
                activeTab === 'orders' ? 'text-accent-primary bg-white shadow-lg' : 'text-white/60'
              )}
            >
              Очередь заказов
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={cn(
                'rounded-xl px-4 py-2 text-[10px] font-black uppercase transition-all',
                activeTab === 'config' ? 'text-accent-primary bg-white shadow-lg' : 'text-white/60'
              )}
            >
              Настройка MTO
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-10">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
          {/* Main List Area */}
          <div className="space-y-4 lg:col-span-8">
            <div className="flex items-center justify-between">
              <h4 className="text-text-muted text-[11px] font-black uppercase tracking-widest">
                Активные MTO-слоты
              </h4>
              <div className="flex gap-2">
                <Badge className="border-none bg-emerald-50 text-[8px] font-black uppercase text-emerald-600">
                  Online: 3 Sewing Lines
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              {MOCK_MTO_ORDERS.map((order) => (
                <motion.div
                  key={order.id}
                  layoutId={order.id}
                  className="bg-bg-surface2 border-border-subtle hover:border-accent-primary/20 group flex items-center justify-between rounded-xl border p-4 transition-all hover:bg-white hover:shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="border-border-subtle flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border bg-white shadow-sm">
                      <User className="text-text-muted h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h5 className="text-text-primary text-sm font-black uppercase tracking-tight">
                          {order.item} / {order.client}
                        </h5>
                        <Badge
                          className={cn(
                            'h-4 px-1.5 text-[7px] font-black uppercase',
                            order.priority === 'urgent'
                              ? 'bg-rose-500 text-white'
                              : order.priority === 'high'
                                ? 'bg-amber-500 text-white'
                                : 'bg-border-subtle text-text-secondary'
                          )}
                        >
                          {order.priority}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {order.mods.map((mod, i) => (
                          <span
                            key={i}
                            className="text-accent-primary bg-accent-primary/10 border-accent-primary/20 rounded-full border px-2 py-0.5 text-[9px] font-bold"
                          >
                            {mod}
                          </span>
                        ))}
                      </div>
                      <p className="text-text-muted text-[9px] font-bold uppercase tracking-tighter">
                        {order.time} • ID: {order.id}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-text-muted mb-1 text-[9px] font-black uppercase">Статус</p>
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            'h-2 w-2 animate-pulse rounded-full',
                            order.status === 'sewing'
                              ? 'bg-emerald-500'
                              : order.status === 'cutting'
                                ? 'bg-amber-500'
                                : 'bg-border-default'
                          )}
                        />
                        <span className="text-text-primary text-[10px] font-black uppercase">
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <Button className="bg-text-primary hover:bg-accent-primary h-12 rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest text-white shadow-lg transition-colors">
                      Взять в работу
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* MTO Config Sidebar */}
          <div className="space-y-4 lg:col-span-4">
            <div className="bg-text-primary relative space-y-4 overflow-hidden rounded-xl p-4 text-white">
              <div className="absolute right-0 top-0 p-4 opacity-10">
                <Scissors className="h-32 w-32" />
              </div>

              <div className="relative z-10 space-y-1">
                <p className="text-accent-primary text-[10px] font-black uppercase tracking-widest">
                  MTO Capacity
                </p>
                <h3 className="text-sm font-black tabular-nums">
                  12 <span className="text-sm text-white/40">/ 20</span>
                </h3>
                <p className="text-accent-primary/60 text-[9px] font-bold uppercase">
                  Слотов забронировано на сегодня
                </p>
              </div>

              <div className="relative z-10 space-y-4 pt-4">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <Zap className="h-4 w-4 text-amber-400" />
                    <span className="text-[10px] font-black uppercase">Auto-Sourcing</span>
                  </div>
                  <Badge className="border-none bg-emerald-500 text-[8px] font-black uppercase text-white">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="text-accent-primary h-4 w-4" />
                    <span className="text-[10px] font-black uppercase">Client Live Sync</span>
                  </div>
                  <Badge className="border-none bg-emerald-500 text-[8px] font-black uppercase text-white">
                    Active
                  </Badge>
                </div>
              </div>

              <Button className="bg-accent-primary hover:bg-accent-primary relative z-10 h-10 w-full rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-2xl transition-colors">
                Открыть прием заказов
              </Button>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="space-y-2 pt-1">
                <p className="text-[11px] font-black uppercase leading-none text-emerald-900">
                  Zero Waste Target
                </p>
                <p className="text-[10px] font-medium leading-relaxed text-emerald-700/80">
                  Через MTO-канал вы сократили складские остатки на 12.4% за прошлый месяц. Система
                  оптимизирует раскладку лекал для кастомных заказов.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

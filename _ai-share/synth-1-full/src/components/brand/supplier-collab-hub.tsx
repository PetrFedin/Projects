'use client';

import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  FileText,
  Zap,
  Eye,
  CheckCircle2,
  Clock,
  Share2,
  Plus,
  Sparkles,
  Box,
  Layout,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const MOCK_PROPOSALS = [
  {
    id: 'p1',
    supplier: 'TexWorld Italy',
    material: 'Eco-Nylon 2.0',
    status: 'pending',
    match: 98,
    time: '2ч назад',
  },
  {
    id: 'p2',
    supplier: 'Nordic Wool Co',
    material: 'Merino Blend XP',
    status: 'approved',
    match: 92,
    time: '1д назад',
  },
  {
    id: 'p3',
    supplier: 'Silk Road Silk',
    material: 'Raw Silk Canvas',
    status: 'rejected',
    match: 75,
    time: '3д назад',
  },
];

export function SupplierCollabHub() {
  const [activeTab, setActiveTab] = useState<'proposals' | 'live'>('proposals');

  return (
    <Card className="border-border-subtle overflow-hidden rounded-xl bg-white shadow-2xl">
      <CardHeader className="border-border-subtle border-b p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="mb-1 flex items-center gap-2">
              <div className="bg-accent-primary flex h-6 w-6 items-center justify-center rounded-lg">
                <Users className="h-4 w-4 text-white" />
              </div>
              <span className="text-accent-primary text-[10px] font-bold uppercase tracking-widest">
                Collaborative Sourcing 2.0
              </span>
            </div>
            <CardTitle className="text-base font-bold uppercase tracking-tighter">
              Supplier Collab Lab
            </CardTitle>
            <CardDescription className="text-sm font-medium">
              Прямая синхронизация поставщиков материалов с вашим отделом дизайна. Сокращение цикла
              закупки в 3 раза.
            </CardDescription>
          </div>
          <div className="bg-bg-surface2 border-border-default flex rounded-2xl border p-1">
            <button
              onClick={() => setActiveTab('proposals')}
              className={cn(
                'rounded-xl px-4 py-2 text-[10px] font-bold uppercase transition-all',
                activeTab === 'proposals' ? 'bg-white text-black shadow-sm' : 'text-text-muted'
              )}
            >
              Предложения
            </button>
            <button
              onClick={() => setActiveTab('live')}
              className={cn(
                'rounded-xl px-4 py-2 text-[10px] font-bold uppercase transition-all',
                activeTab === 'live' ? 'bg-white text-black shadow-sm' : 'text-text-muted'
              )}
            >
              Live Сессия
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {activeTab === 'proposals' ? (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            {/* Left Column: Sketch & Design Context */}
            <div className="space-y-4 lg:col-span-1">
              <div className="bg-bg-surface2 group relative aspect-[3/4] overflow-hidden rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800"
                  alt="Sketch"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 p-4 text-center text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <Layout className="mb-2 h-8 w-8" />
                  <p className="text-[10px] font-bold uppercase">
                    Текущий концепт: Tech-Minimalism SS26
                  </p>
                </div>
                <div className="absolute left-4 top-4">
                  <Badge className="bg-accent-primary text-[8px] font-bold uppercase text-white">
                    Design Context
                  </Badge>
                </div>
              </div>
              <div className="bg-text-primary space-y-2 rounded-2xl p-4 text-white">
                <p className="text-[10px] font-bold uppercase text-white/40">Требования AI</p>
                <p className="text-[11px] font-bold uppercase leading-relaxed tracking-tight">
                  "Ищем водоотталкивающий нейлон с матовым финишем. Плотность 120-150г/м.
                  Эко-сертификат обязателен."
                </p>
              </div>
            </div>

            {/* Right Column: Supplier Proposals */}
            <div className="space-y-6 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h4 className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                  Входящие предложения под эскиз
                </h4>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-emerald-600">
                    <Sparkles className="h-3 w-3" />
                    <span className="text-[9px] font-bold uppercase tracking-tighter">
                      AI Match Enabled
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {MOCK_PROPOSALS.map((prop) => (
                  <motion.div
                    key={prop.id}
                    whileHover={{ x: 10 }}
                    className="border-border-subtle hover:border-accent-primary/20 flex items-center justify-between rounded-xl border bg-white p-3 shadow-sm transition-all hover:shadow-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-bg-surface2 border-border-subtle flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border">
                        <Box className="text-text-muted h-6 w-6" />
                      </div>
                      <div>
                        <div className="mb-0.5 flex items-center gap-2">
                          <p className="text-text-primary text-[11px] font-bold uppercase">
                            {prop.material}
                          </p>
                          <Badge
                            className={cn(
                              'h-4 px-1.5 text-[7px] font-bold uppercase',
                              prop.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-600'
                                : prop.status === 'rejected'
                                  ? 'bg-rose-100 text-rose-600'
                                  : 'bg-bg-surface2 text-text-secondary'
                            )}
                          >
                            {prop.status}
                          </Badge>
                        </div>
                        <p className="text-text-muted text-[9px] font-bold uppercase tracking-tight">
                          {prop.supplier} • {prop.time}
                        </p>
                        <div className="mt-2 flex items-center gap-3">
                          <div className="text-accent-primary flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            <span className="text-[9px] font-bold uppercase">
                              {prop.match}% AI Match
                            </span>
                          </div>
                          <div className="text-text-muted flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            <span className="text-[9px] font-bold uppercase">4 сообщения</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="border-border-subtle h-10 w-10 rounded-xl p-0"
                      >
                        <Eye className="text-text-muted h-4 w-4" />
                      </Button>
                      <Button className="bg-accent-primary h-10 rounded-xl px-6 text-[9px] font-bold uppercase tracking-widest text-white transition-transform hover:scale-105">
                        Обсудить
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button className="border-border-subtle text-text-muted hover:border-accent-primary/30 hover:text-accent-primary flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed py-4 text-[10px] font-bold uppercase transition-all">
                <Plus className="h-4 w-4" /> Запросить образцы у других поставщиков
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-text-primary relative space-y-4 overflow-hidden rounded-xl p-4 text-center">
            <div className="bg-accent-primary/10 absolute inset-0 backdrop-blur-3xl" />
            <div className="relative z-10 space-y-4">
              <div className="bg-accent-primary shadow-accent-primary/25 mx-auto flex h-20 w-20 items-center justify-center rounded-3xl text-white shadow-2xl">
                <Zap className="h-10 w-10 animate-pulse" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-tighter text-white">
                Live Sourcing Session
              </h3>
              <p className="mx-auto max-w-[400px] text-sm leading-relaxed text-white/60">
                Присоединяйтесь к прямой трансляции с производства или шоурума поставщика для
                мгновенного утверждения материалов.
              </p>
              <div className="pt-4">
                <Button className="text-accent-primary h-10 rounded-2xl bg-white px-12 text-[11px] font-bold uppercase tracking-widest shadow-2xl shadow-white/10 transition-transform hover:scale-105">
                  Войти в Live Session
                </Button>
              </div>
            </div>
            <div className="relative z-10 grid grid-cols-4 gap-3 pt-8 opacity-40">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-video rounded-xl border border-white/10 bg-white/5"
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

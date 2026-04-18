'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Camera,
  Video,
  Ruler,
  CheckCircle2,
  AlertCircle,
  Plus,
  History,
  ArrowRight,
  User,
  Clock,
  ChevronRight,
  Info,
  Maximize2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface FittingLogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  productName?: string;
  sku?: string;
}

export function FittingLog({
  isOpen,
  onOpenChange,
  productName = 'Urban Jacket SS26',
  sku = 'TP-9921',
}: FittingLogProps) {
  const [activeProto, setActiveProto] = useState('Proto 2');

  const FITTING_HISTORY = [
    {
      id: 1,
      type: 'Proto 1',
      date: '20.02.2026',
      status: 'Approved with changes',
      notes: 'Укоротить рукав на 1.5см, изменить форму воротника.',
      images: 3,
      model: 'Elena K. (S)',
    },
    {
      id: 2,
      type: 'Proto 2',
      date: '10.03.2026',
      status: 'In Progress',
      notes: 'Проверка посадки плечевого пояса и длины изделия.',
      images: 5,
      model: 'Elena K. (S)',
    },
  ];

  const MEASUREMENTS = [
    {
      label: 'Длина по спинке',
      spec: '72.0',
      proto1: '73.5',
      proto2: '72.2',
      diff: '+0.2',
      status: 'success',
    },
    {
      label: 'Ширина плеч',
      spec: '45.0',
      proto1: '45.0',
      proto2: '45.5',
      diff: '+0.5',
      status: 'warning',
    },
    {
      label: 'Длина рукава',
      spec: '64.0',
      proto1: '65.5',
      proto2: '64.0',
      diff: '0.0',
      status: 'success',
    },
    {
      label: 'Ширина груди',
      spec: '52.0',
      proto1: '52.0',
      proto2: '51.5',
      diff: '-0.5',
      status: 'warning',
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden rounded-2xl border-none bg-white p-0 shadow-2xl sm:max-w-[800px]">
        <DialogHeader className="bg-text-primary relative p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-accent-primary shadow-accent-primary/20 flex h-10 w-10 items-center justify-center rounded-xl shadow-lg">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-black uppercase tracking-tighter">
                Журнал примерок (Fitting Log)
              </DialogTitle>
              <DialogDescription className="text-text-muted mt-0.5 text-[10px] font-bold uppercase tracking-widest">
                Контроль посадки и конструктивные правки для {productName}
              </DialogDescription>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            {['Proto 1', 'Proto 2', 'SMS', 'PPS', 'Golden Sample'].map((p) => (
              <Button
                key={p}
                variant="ghost"
                onClick={() => setActiveProto(p)}
                className={cn(
                  'h-7 rounded-lg px-3 text-[9px] font-black uppercase transition-all',
                  activeProto === p
                    ? 'bg-accent-primary text-white shadow-lg'
                    : 'text-text-muted bg-white/5 hover:bg-white/10'
                )}
              >
                {p}
              </Button>
            ))}
          </div>
        </DialogHeader>

        <div className="grid gap-0 md:grid-cols-5">
          {/* History Sidebar */}
          <div className="border-border-subtle bg-bg-surface2/30 space-y-6 border-r p-6 md:col-span-2">
            <div className="space-y-4">
              <h4 className="text-text-primary flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                <History className="text-accent-primary h-3.5 w-3.5" /> История итераций
              </h4>
              <div className="space-y-3">
                {FITTING_HISTORY.map((h) => (
                  <div
                    key={h.id}
                    className={cn(
                      'group cursor-pointer rounded-xl border p-3 transition-all',
                      activeProto === h.type
                        ? 'border-accent-primary/30 bg-white shadow-sm'
                        : 'border-transparent bg-transparent opacity-60 hover:opacity-100'
                    )}
                  >
                    <div className="mb-1 flex items-start justify-between">
                      <p className="text-text-primary text-[10px] font-black uppercase tracking-tight">
                        {h.type}
                      </p>
                      <Badge
                        className={cn(
                          'h-3.5 border-none px-1 text-[7px] font-black uppercase',
                          h.status.includes('Approved')
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-accent-primary/10 text-accent-primary'
                        )}
                      >
                        {h.status}
                      </Badge>
                    </div>
                    <div className="text-text-muted mb-2 flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" /> {h.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-2.5 w-2.5" /> {h.model}
                      </span>
                    </div>
                    <p className="text-text-secondary line-clamp-2 text-[9px] font-medium italic leading-relaxed">
                      "{h.notes}"
                    </p>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="border-border-default text-text-muted hover:bg-accent-primary/10 hover:text-accent-primary hover:border-accent-primary/30 h-9 w-full gap-2 rounded-xl border-dashed text-[9px] font-black uppercase transition-all"
              >
                <Plus className="h-3 w-3" /> Добавить примерку
              </Button>
            </div>
          </div>

          {/* Main Content: Measurements & Media */}
          <div className="space-y-6 p-6 md:col-span-3">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-text-primary flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                  <Ruler className="text-accent-primary h-3.5 w-3.5" /> Табель мер (Proto 2)
                </h4>
                <Badge
                  variant="outline"
                  className="text-text-muted border-border-default text-[8px] font-bold"
                >
                  Спец. EU S
                </Badge>
              </div>
              <div className="bg-bg-surface2 border-border-subtle space-y-1 overflow-hidden rounded-xl border">
                <div className="bg-text-primary grid grid-cols-4 p-2.5 text-[8px] font-black uppercase tracking-widest text-white">
                  <div className="col-span-1">Параметр</div>
                  <div className="text-center">Spec</div>
                  <div className="text-center">Proto 2</div>
                  <div className="text-right">Diff</div>
                </div>
                {MEASUREMENTS.map((m, idx) => (
                  <div
                    key={idx}
                    className="border-border-subtle grid grid-cols-4 border-b p-2.5 text-[10px] font-bold uppercase tracking-tight transition-colors last:border-none hover:bg-white"
                  >
                    <div className="text-text-secondary col-span-1">{m.label}</div>
                    <div className="text-text-muted text-center tabular-nums">{m.spec}</div>
                    <div className="text-text-primary text-center tabular-nums">{m.proto2}</div>
                    <div
                      className={cn(
                        'text-right tabular-nums',
                        m.status === 'success' ? 'text-emerald-500' : 'text-amber-500'
                      )}
                    >
                      {m.diff}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-text-primary flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                  <Camera className="text-accent-primary h-3.5 w-3.5" /> Фото/Видео обзоры
                </h4>
                <Button
                  variant="ghost"
                  className="text-accent-primary h-6 gap-1 px-2 text-[8px] font-black uppercase"
                >
                  <Video className="h-3 w-3" /> Все медиа
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-bg-surface2 border-border-default group relative aspect-square overflow-hidden rounded-xl border"
                  >
                    <div className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-all group-hover:opacity-100">
                      <Maximize2 className="h-4 w-4 text-white" />
                    </div>
                    <div className="absolute bottom-1 right-1 rounded-md bg-black/50 p-0.5">
                      <Video className="h-2 w-2 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="bg-bg-surface2 border-border-subtle flex items-center justify-between border-t p-6">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-border-subtle flex h-6 w-6 items-center justify-center rounded-full border-2 border-white"
                >
                  <User className="text-text-muted h-3 w-3" />
                </div>
              ))}
            </div>
            <p className="text-text-muted text-[9px] font-bold uppercase tracking-widest">
              3 участника согласования
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-border-default h-10 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-500 transition-all hover:border-rose-100 hover:bg-rose-50"
            >
              На доработку
            </Button>
            <Button className="bg-accent-primary h-10 gap-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl transition-all">
              Утвердить Proto 2 <CheckCircle2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

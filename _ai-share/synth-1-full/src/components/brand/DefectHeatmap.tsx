'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertTriangle,
  MapPin,
  TrendingUp,
  BarChart3,
  Layers,
  Maximize2,
  ChevronRight,
  ShieldAlert,
  Zap,
  CheckCircle2,
  Box,
  FileWarning,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { createCAPA } from '@/lib/production/plm-extended';

const ZONE_TO_DEFECT_CODE: Record<string, string> = {
  Sleeve: 'SEAM_SLEEVE',
  Shoulder: 'FIT_SHOULDER',
  Collar: 'COLLAR_ALIGN',
  Hem: 'HEM_QUALITY',
};

export function DefectHeatmap() {
  const [activeZone, setActiveZone] = useState<string | null>('Sleeve');
  const [capaOpen, setCapaOpen] = useState(false);
  const [capaForm, setCapaForm] = useState({ description: '', action_type: 'process_change' });
  const [capaLoading, setCapaLoading] = useState(false);

  const DEFECT_ZONES = [
    {
      name: 'Sleeve',
      count: 12,
      rate: '2.5%',
      trend: 'up',
      severity: 'medium',
      color: 'bg-amber-400',
    },
    {
      name: 'Shoulder',
      count: 4,
      rate: '0.8%',
      trend: 'down',
      severity: 'low',
      color: 'bg-emerald-400',
    },
    {
      name: 'Collar',
      count: 18,
      rate: '3.7%',
      trend: 'up',
      severity: 'high',
      color: 'bg-rose-500',
    },
    {
      name: 'Hem',
      count: 2,
      rate: '0.4%',
      trend: 'stable',
      severity: 'low',
      color: 'bg-slate-200',
    },
  ];

  const RECENT_LOSSES = [
    {
      id: 'L-001',
      type: 'sewing',
      item: 'Collar Alignment',
      batch: 'PO-26-012',
      status: 'In Review',
    },
    {
      id: 'L-002',
      type: 'material',
      item: 'Fabric Spotting',
      batch: 'PO-26-015',
      status: 'Confirmed',
    },
  ];

  return (
    <Card className="group h-full overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 bg-rose-50/20 p-4">
        <div className="space-y-0.5">
          <CardTitle className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-900">
            <ShieldAlert className="h-4 w-4 text-rose-600" />
            Карта дефектов (Quality Heatmap)
          </CardTitle>
          <p className="text-[10px] font-medium uppercase tracking-tight text-slate-400">
            Анализ зон риска и причин брака по модели.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg border border-slate-100 text-slate-400 shadow-sm hover:bg-white hover:text-rose-600"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Schematic Diagram (Abstract Mock) */}
          <div className="group/schematic relative flex aspect-[3/4] items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 p-4">
            <Box className="h-full w-full text-slate-200" />

            {/* Heatmap Points */}
            <div className="absolute left-[45%] top-[20%] h-4 w-4 animate-pulse cursor-pointer rounded-full bg-rose-500 shadow-lg shadow-rose-500/50 transition-transform hover:scale-150" />
            <div className="absolute left-[20%] top-[40%] h-3 w-3 cursor-pointer rounded-full bg-amber-400 shadow-lg shadow-amber-400/50 transition-transform hover:scale-150" />
            <div className="absolute right-[20%] top-[40%] h-3 w-3 cursor-pointer rounded-full bg-amber-400 shadow-lg shadow-amber-400/50 transition-transform hover:scale-150" />
            <div className="absolute bottom-[20%] left-[50%] h-2 w-2 -translate-x-1/2 cursor-pointer rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50 transition-transform hover:scale-150" />

            <div className="absolute inset-x-0 bottom-3 px-3">
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white/80 p-2 shadow-sm backdrop-blur-md">
                <div className="space-y-0.5">
                  <p className="text-[7px] font-black uppercase tracking-widest text-slate-400">
                    Selected Zone
                  </p>
                  <p className="text-[9px] font-bold uppercase text-slate-900">Collar (Воротник)</p>
                </div>
                <Badge className="h-3.5 border-none bg-rose-100 px-1 text-[8px] font-black uppercase text-rose-600 shadow-sm">
                  CRITICAL
                </Badge>
              </div>
            </div>
          </div>

          {/* Statistics & Legend */}
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h5 className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                Топ зон брака
              </h5>
              <div className="space-y-2">
                {DEFECT_ZONES.map((zone, i) => (
                  <div
                    key={i}
                    className={cn(
                      'group/zone flex cursor-pointer items-center justify-between rounded-xl border p-2.5 transition-all',
                      activeZone === zone.name
                        ? 'border-rose-200 bg-white shadow-sm'
                        : 'border-slate-100 bg-slate-50 opacity-60 hover:opacity-100'
                    )}
                    onClick={() => setActiveZone(zone.name)}
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn('h-2 w-2 rounded-full', zone.color)} />
                      <p className="text-[9px] font-black uppercase tracking-tight text-slate-900">
                        {zone.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-bold tabular-nums text-slate-900">
                        {zone.rate}
                      </p>
                      <div className="flex items-center justify-end gap-1">
                        {zone.trend === 'up' && <TrendingUp className="h-2 w-2 text-rose-500" />}
                        <p className="text-[7px] font-bold uppercase tracking-widest text-slate-400">
                          {zone.count} cases
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="group/dark relative space-y-2 overflow-hidden rounded-xl bg-slate-900 p-3 text-white shadow-lg shadow-slate-200/50">
              <div className="relative z-10 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-indigo-400">
                <Zap className="h-3 w-3 animate-pulse fill-indigo-400" /> AI Auditor
              </div>
              <p className="relative z-10 text-[9px] font-bold uppercase leading-relaxed tracking-tight text-slate-300">
                Причина брака: Нестабильное натяжение нити на участке №4.
              </p>
              <Button className="h-7 w-full rounded-lg border border-white/20 bg-white/10 text-[8px] font-black uppercase tracking-[0.2em] text-white shadow-md transition-all hover:bg-white/20">
                Открыть QC Отчет
              </Button>
              <Button
                className="mt-1.5 flex h-7 w-full items-center justify-center gap-1.5 rounded-lg border border-amber-400/50 bg-amber-500/80 text-[8px] font-black uppercase tracking-[0.2em] text-white shadow-md transition-all hover:bg-amber-500"
                onClick={() => setCapaOpen(true)}
              >
                <FileWarning className="h-3 w-3" /> Создать CAPA
              </Button>
            </div>

            <Dialog open={capaOpen} onOpenChange={setCapaOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>CAPA — корректирующее действие</DialogTitle>
                </DialogHeader>
                <p className="text-[10px] text-slate-500">
                  Зона: <strong>{activeZone}</strong>
                </p>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label className="text-[10px]">Описание</Label>
                    <Input
                      value={capaForm.description}
                      onChange={(e) => setCapaForm((f) => ({ ...f, description: e.target.value }))}
                      placeholder="Например: Провести инструктаж по натяжению нити"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px]">Тип действия</Label>
                    <select
                      value={capaForm.action_type}
                      onChange={(e) => setCapaForm((f) => ({ ...f, action_type: e.target.value }))}
                      className="mt-1 h-9 w-full rounded-md border border-input px-3 text-sm"
                    >
                      <option value="training">Обучение</option>
                      <option value="process_change">Изменение процесса</option>
                      <option value="tool_replacement">Замена инструмента</option>
                    </select>
                  </div>
                </div>
                <Button
                  onClick={async () => {
                    setCapaLoading(true);
                    try {
                      await createCAPA({
                        defect_type_code: activeZone
                          ? ZONE_TO_DEFECT_CODE[activeZone] || 'DEFECT_OTHER'
                          : 'DEFECT_OTHER',
                        description: capaForm.description || 'Корректирующее действие',
                        action_type: capaForm.action_type,
                      });
                      setCapaOpen(false);
                      setCapaForm({ description: '', action_type: 'process_change' });
                    } finally {
                      setCapaLoading(false);
                    }
                  }}
                  disabled={capaLoading}
                >
                  {capaLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  <span className="ml-2">Создать CAPA</span>
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

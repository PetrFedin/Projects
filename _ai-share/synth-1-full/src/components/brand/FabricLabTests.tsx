'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FlaskConical,
  CheckCircle2,
  AlertCircle,
  Zap,
  ChevronRight,
  Download,
  ShieldCheck,
  Scale,
  Droplets,
  Wind,
  Settings2,
  FileSearch,
  Maximize2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function FabricLabTests() {
  const TESTS = [
    { label: 'Pilling Resistance', value: '4.5/5', status: 'pass', icon: FlaskConical },
    { label: 'Color Fastness', value: '4/5', status: 'pass', icon: Droplets },
    { label: 'Shrinkage (Wash)', value: '-1.5%', status: 'warning', icon: Scale },
    { label: 'Breathability', value: '850 g/m²', status: 'pass', icon: Wind },
  ];

  return (
    <Card className="border-border-subtle group h-full overflow-hidden rounded-xl border bg-white shadow-sm">
      <CardHeader className="border-border-subtle bg-accent-primary/10 flex flex-row items-center justify-between border-b p-4">
        <div className="space-y-0.5">
          <CardTitle className="text-text-primary flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
            <FlaskConical className="text-accent-primary h-4 w-4" />
            Лабораторные тесты полотна (Quality Lab)
          </CardTitle>
          <p className="text-text-muted text-[10px] font-medium uppercase tracking-tight">
            Протоколы испытаний и соответствие ТЗ.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-text-muted hover:text-accent-primary border-border-subtle h-7 w-7 rounded-lg border shadow-sm hover:bg-white"
          >
            <Download className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-text-muted hover:text-accent-primary border-border-subtle h-7 w-7 rounded-lg border shadow-sm hover:bg-white"
          >
            <FileSearch className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-4">
        <div className="grid grid-cols-2 gap-3">
          {TESTS.map((test, i) => (
            <div
              key={i}
              className={cn(
                'flex flex-col justify-between rounded-xl border p-3 transition-all',
                test.status === 'pass'
                  ? 'bg-bg-surface2 border-border-subtle hover:border-emerald-200'
                  : 'border-amber-100 bg-amber-50 hover:border-amber-200'
              )}
            >
              <div className="mb-2 flex items-start justify-between">
                <div
                  className={cn(
                    'rounded-lg p-1.5',
                    test.status === 'pass'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-amber-100 text-amber-600'
                  )}
                >
                  <test.icon className="h-3 w-3" />
                </div>
                {test.status === 'pass' ? (
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                ) : (
                  <AlertCircle className="h-3 w-3 text-amber-500" />
                )}
              </div>
              <div className="space-y-0.5">
                <p className="text-text-muted text-[9px] font-black uppercase leading-none tracking-widest">
                  {test.label}
                </p>
                <p className="text-text-primary text-xs font-black tabular-nums">{test.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-text-primary group/dark relative space-y-2 overflow-hidden rounded-xl p-3 text-white shadow-lg shadow-md">
          <div className="text-accent-primary relative z-10 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest">
            <Zap className="fill-accent-primary h-3 w-3 animate-pulse" /> AI Lab Assistant
          </div>
          <p className="text-text-muted relative z-10 text-[9px] font-bold uppercase leading-relaxed tracking-tight">
            Усадка в -1.5% выше стандартной нормы. Рекомендуется декатировка паром при 120°C перед
            раскроем.
          </p>
          <Button
            variant="ghost"
            className="h-7 w-full rounded-lg border border-white/20 bg-white/10 text-[8px] font-black uppercase tracking-[0.2em] text-white shadow-md transition-all hover:bg-white/20"
          >
            Печать ТЗ для цеха
          </Button>
        </div>

        <div className="text-text-muted flex items-center justify-center gap-2 text-[8px] font-bold uppercase tracking-widest">
          <ShieldCheck className="text-accent-primary h-3 w-3" /> Лаборатория: SGS / Intertek (РФ)
        </div>
      </CardContent>
    </Card>
  );
}

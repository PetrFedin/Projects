'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FileCode2,
  History,
  User,
  Clock,
  ArrowUpRight,
  Download,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertCircle,
  FileSearch,
  Maximize2,
  Box,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function PatternVersionControl({ collectionId }: { collectionId?: string | null }) {
  const versions = React.useMemo(() => {
    if (!collectionId || collectionId === 'ARCHIVE') return [];
    if (collectionId === 'SS26') {
      return [
        {
          id: 'v2.4',
          date: '08.03.2026',
          user: 'Mark L.',
          change: 'Увеличен припуск на швы рукава до 1.2см. Исправлена дуга проймы.',
          status: 'approved',
          icon: CheckCircle2,
        },
        {
          id: 'v2.3',
          date: '01.03.2026',
          user: 'Mark L.',
          change: 'Добавлены лекала для подкладки. Оптимизация раскладки.',
          status: 'archive',
          icon: History,
        },
        {
          id: 'v2.2',
          date: '15.02.2026',
          user: 'Ivan S.',
          change: 'Базовая конструкция (EU 38). Первичный драфт.',
          status: 'archive',
          icon: History,
        },
      ];
    }
    return [];
  }, [collectionId]);

  const handleAction = (title: string, desc: string) => {
    // In a real app this would call a toast or open a modal
    console.log(title, desc);
  };

  return (
<<<<<<< HEAD
    <Card className="group h-full overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 bg-indigo-50/20 p-4">
        <div className="space-y-0.5">
          <CardTitle className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-900">
            <FileCode2 className="h-4 w-4 text-indigo-600" />
            Версионный контроль лекал (CAD)
          </CardTitle>
          <p className="text-[10px] font-medium uppercase tracking-tight text-slate-400">
=======
    <Card className="border-border-subtle group h-full overflow-hidden rounded-xl border bg-white shadow-sm">
      <CardHeader className="border-border-subtle bg-accent-primary/10 flex flex-row items-center justify-between border-b p-4">
        <div className="space-y-0.5">
          <CardTitle className="text-text-primary flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
            <FileCode2 className="text-accent-primary h-4 w-4" />
            Версионный контроль лекал (CAD)
          </CardTitle>
          <p className="text-text-muted text-[10px] font-medium uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
            История изменений конструкторской документации.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => handleAction('Экспорт', 'Подготовка файлов DXF/AAMA для экспорта...')}
            variant="ghost"
            size="icon"
<<<<<<< HEAD
            className="h-7 w-7 rounded-lg border border-slate-100 text-slate-400 shadow-sm hover:bg-white hover:text-indigo-600"
=======
            className="text-text-muted hover:text-accent-primary border-border-subtle h-7 w-7 rounded-lg border shadow-sm hover:bg-white"
>>>>>>> recover/cabinet-wip-from-stash
          >
            <Download className="h-3.5 w-3.5" />
          </Button>
          <Button
            onClick={() => handleAction('Просмотр', 'Открытие 3D-вьювера Clo3D...')}
            variant="ghost"
            size="icon"
<<<<<<< HEAD
            className="h-7 w-7 rounded-lg border border-slate-100 text-slate-400 shadow-sm hover:bg-white hover:text-indigo-600"
=======
            className="text-text-muted hover:text-accent-primary border-border-subtle h-7 w-7 rounded-lg border shadow-sm hover:bg-white"
>>>>>>> recover/cabinet-wip-from-stash
          >
            <FileSearch className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-4">
        <div className="space-y-3">
          {versions.map((v, i) => (
            <div
              key={i}
              className={cn(
                'group/version relative cursor-pointer overflow-hidden rounded-xl border p-3 transition-all',
                v.status === 'approved'
<<<<<<< HEAD
                  ? 'border-indigo-200 bg-white shadow-sm ring-1 ring-indigo-50'
                  : 'border-slate-100 bg-slate-50/50 opacity-60 hover:bg-white hover:opacity-100'
=======
                  ? 'border-accent-primary/30 ring-accent-primary/10 bg-white shadow-sm ring-1'
                  : 'bg-bg-surface2/80 border-border-subtle opacity-60 hover:bg-white hover:opacity-100'
>>>>>>> recover/cabinet-wip-from-stash
              )}
            >
              <div className="mb-1 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-lg shadow-sm',
                      v.status === 'approved'
<<<<<<< HEAD
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-200 text-slate-500'
=======
                        ? 'bg-accent-primary text-white'
                        : 'bg-border-subtle text-text-secondary'
>>>>>>> recover/cabinet-wip-from-stash
                    )}
                  >
                    <v.icon className="h-3 w-3" />
                  </div>
<<<<<<< HEAD
                  <p className="text-[11px] font-black uppercase tracking-tight text-slate-900">
=======
                  <p className="text-text-primary text-[11px] font-black uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                    {v.id}
                  </p>
                </div>
                <Badge
                  className={cn(
                    'h-3.5 border-none px-1 text-[7px] font-black uppercase',
                    v.status === 'approved'
                      ? 'bg-emerald-500 text-white'
<<<<<<< HEAD
                      : 'bg-slate-100 text-slate-400'
=======
                      : 'bg-bg-surface2 text-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
                  )}
                >
                  {v.status === 'approved' ? 'MASTER' : 'ARCHIVE'}
                </Badge>
              </div>

<<<<<<< HEAD
              <div className="mb-2 flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-slate-400">
=======
              <div className="text-text-muted mb-2 flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                <span className="flex items-center gap-1">
                  <Clock className="h-2.5 w-2.5" /> {v.date}
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-2.5 w-2.5" /> {v.user}
                </span>
              </div>

<<<<<<< HEAD
              <p className="line-clamp-2 text-[9px] font-medium italic leading-relaxed text-slate-600">
=======
              <p className="text-text-secondary line-clamp-2 text-[9px] font-medium italic leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                "{v.change}"
              </p>

              {v.status === 'approved' && (
                <div className="absolute -bottom-2 -right-2 opacity-5 transition-opacity group-hover/version:opacity-10">
<<<<<<< HEAD
                  <Box className="h-12 w-12 text-indigo-900" />
=======
                  <Box className="text-accent-primary h-12 w-12" />
>>>>>>> recover/cabinet-wip-from-stash
                </div>
              )}
            </div>
          ))}
          {versions.length === 0 && (
<<<<<<< HEAD
            <div className="rounded-xl border-2 border-dashed border-slate-100 py-10 text-center">
              <p className="text-[9px] font-black uppercase italic tracking-widest text-slate-300">
=======
            <div className="border-border-subtle rounded-xl border-2 border-dashed py-10 text-center">
              <p className="text-text-muted text-[9px] font-black uppercase italic tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                Лекала еще не загружены
              </p>
            </div>
          )}
        </div>

<<<<<<< HEAD
        <div className="group/dark relative space-y-3 overflow-hidden rounded-2xl bg-slate-900 p-4 text-white shadow-xl shadow-slate-200/50">
          <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-white/5 blur-2xl transition-all group-hover/dark:bg-indigo-500/10"></div>
=======
        <div className="bg-text-primary group/dark relative space-y-3 overflow-hidden rounded-2xl p-4 text-white shadow-md shadow-xl">
          <div className="group-hover/dark:bg-accent-primary/10 absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-white/5 blur-2xl transition-all"></div>
>>>>>>> recover/cabinet-wip-from-stash
          <div className="relative z-10 flex items-center gap-2">
            <Zap className="h-4 w-4 animate-pulse fill-amber-400 text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Auto-Grading AI
            </span>
          </div>
<<<<<<< HEAD
          <p className="relative z-10 text-[9px] font-bold uppercase leading-relaxed tracking-tight text-slate-300">
            Используйте AI для автоматической градации лекал по размерной сетке бренда.
          </p>
          <Button className="h-8 w-full rounded-lg border-none bg-indigo-600 text-[8px] font-black uppercase tracking-[0.2em] text-white shadow-lg transition-all hover:bg-indigo-500">
=======
          <p className="text-text-muted relative z-10 text-[9px] font-bold uppercase leading-relaxed tracking-tight">
            Используйте AI для автоматической градации лекал по размерной сетке бренда.
          </p>
          <Button className="bg-accent-primary hover:bg-accent-primary h-8 w-full rounded-lg border-none text-[8px] font-black uppercase tracking-[0.2em] text-white shadow-lg transition-all">
>>>>>>> recover/cabinet-wip-from-stash
            Запустить градацию (Clo3D/Optitex)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  CheckCircle2,
  Clock,
  User,
  Lock,
  Unlock,
  ShieldCheck,
  Zap,
  ChevronRight,
  MessageSquare,
  ArrowRight,
  Users,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function ApprovalWorkflow() {
  const [activeStage, setActiveStage] = useState(2);
  const [rejectingStageId, setRejectingStageId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [stageComments, setStageComments] = useState<Record<number, string>>({});

  const STAGES = [
    { id: 1, label: 'Design & Sketch', role: 'Designer', status: 'completed', user: 'Anna K.' },
    { id: 2, label: 'Tech Pack (BOM)', role: 'Technologist', status: 'in_review', user: 'Mark L.' },
    { id: 3, label: 'Pre-costing', role: 'Financier', status: 'pending', user: 'Sergei V.' },
    {
      id: 4,
      label: 'Production Launch',
      role: 'Production Mgr',
      status: 'pending',
      user: 'Ivan S.',
    },
  ];

  return (
    <>
      <Card className="border-border-subtle group h-full overflow-hidden rounded-xl border bg-white shadow-sm">
        <CardHeader className="border-border-subtle bg-accent-primary/10 flex flex-row items-center justify-between border-b p-4">
          <div className="space-y-0.5">
            <CardTitle className="text-text-primary flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
              <ShieldCheck className="text-accent-primary h-4 w-4" />
              Внутреннее согласование (Workflows)
            </CardTitle>
            <p className="text-text-muted text-[10px] font-medium uppercase tracking-tight">
              Многоуровневый процесс утверждения этапов.
            </p>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
            <span className="text-[8px] font-black uppercase tracking-widest text-amber-600">
              In Review
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 p-4">
          <div className="relative space-y-3">
            {/* Vertical line connector */}
            <div className="bg-bg-surface2 absolute bottom-6 left-[13px] top-6 w-0.5" />

            {STAGES.map((stage) => (
              <div
                key={stage.id}
                className={cn(
                  'relative z-10 flex gap-4 rounded-xl border p-3 transition-all',
                  stage.status === 'in_review'
                    ? 'border-accent-primary/30 bg-white shadow-sm'
                    : stage.status === 'completed'
                      ? 'bg-bg-surface2/80 border-transparent opacity-80'
                      : 'border-transparent bg-transparent opacity-40'
                )}
              >
                <div
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 shadow-sm',
                    stage.status === 'completed'
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : stage.status === 'in_review'
                        ? 'border-accent-primary text-accent-primary bg-white'
                        : 'border-border-default text-text-muted bg-white'
                  )}
                >
                  {stage.status === 'completed' ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : stage.status === 'in_review' ? (
                    <Clock className="animate-spin-slow h-4 w-4" />
                  ) : (
                    <Lock className="h-3.5 w-3.5" />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between">
                    <p
                      className={cn(
                        'text-[10px] font-black uppercase tracking-tight',
                        stage.status !== 'pending' ? 'text-text-primary' : 'text-text-muted'
                      )}
                    >
                      {stage.label}
                    </p>
                    {stage.status === 'in_review' && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="hover:bg-accent-primary/10 text-accent-primary h-5 w-5 rounded-md transition-all"
                      >
                        <MessageSquare className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <div className="text-text-muted flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1">
                      <User className="h-2.5 w-2.5" /> {stage.user}
                    </span>
                    <span className="bg-bg-surface2 text-text-secondary rounded px-1.5 py-0.5">
                      {stage.role}
                    </span>
                    {stage.status === 'in_review' && (
                      <span className="font-black text-amber-600">→ Следующий в очереди</span>
                    )}
                    {stage.status === 'in_review' && (
                      <span className="font-black text-rose-500">SLA: 2 дн.</span>
                    )}
                  </div>
                  {stageComments[stage.id] && (
                    <p className="text-text-secondary mt-1 text-[9px] italic">
                      {stageComments[stage.id]}
                    </p>
                  )}
                </div>

                {stage.status === 'in_review' && (
                  <div className="flex flex-col justify-center gap-1">
                    <Button className="bg-accent-primary hover:bg-accent-primary h-6 rounded-lg px-3 text-[8px] font-black uppercase text-white shadow-md transition-all">
                      Утвердить
                    </Button>
                    <Button
                      variant="ghost"
                      className="h-6 rounded-lg px-3 text-[8px] font-black uppercase text-rose-500 transition-all hover:bg-rose-50"
                      onClick={() => setRejectingStageId(stage.id)}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3 rounded-xl border border-amber-100 bg-amber-50 p-3">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
            <p className="text-[9px] font-bold uppercase leading-relaxed tracking-tight text-amber-800/80">
              Внимание: Запуск производства заблокирован до утверждения себестоимости отделом
              финансов.
            </p>
          </div>
        </CardContent>
      </Card>
      <Dialog open={!!rejectingStageId} onOpenChange={(open) => !open && setRejectingStageId(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-sm">Причина rejection</DialogTitle>
            <DialogDescription className="text-[10px]">
              Структурированная причина и комментарий
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {[
                'Несоответствие тех-пака',
                'Перерасход бюджета',
                'Качество образца',
                'Сроки нарушены',
                'Прочее',
              ].map((r) => (
                <button
                  key={r}
                  onClick={() => setRejectReason(r)}
                  className={cn(
                    'rounded-lg border p-2 text-[10px] font-bold uppercase transition-all',
                    rejectReason === r
                      ? 'border-rose-300 bg-rose-50 text-rose-700'
                      : 'border-border-default hover:border-border-default'
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
            <input
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Комментарий"
              className="border-border-default h-10 w-full rounded-lg border px-3 text-sm"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setRejectReason('');
                  setRejectingStageId(null);
                }}
              >
                Отмена
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  if (rejectingStageId)
                    setStageComments((c) => ({
                      ...c,
                      [rejectingStageId]: `Rejected: ${rejectReason || '—'}`,
                    }));
                  setRejectReason('');
                  setRejectingStageId(null);
                }}
              >
                Подтвердить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

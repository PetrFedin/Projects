'use client';

import { Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AuditTrailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuditTrailDialog({ isOpen, onOpenChange }: AuditTrailDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-xl border-none bg-white p-4 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold uppercase tracking-tight">
<<<<<<< HEAD
            <Clock className="h-5 w-5 text-indigo-600" /> История активности
=======
            <Clock className="text-accent-primary h-5 w-5" /> История активности
>>>>>>> recover/cabinet-wip-from-stash
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-6">
          {[
            {
              time: '10:45 AM',
              user: 'Alex (Бренд)',
              action: 'Обновил скидку до 5%',
              type: 'finance',
            },
            {
              time: '09:12 AM',
              user: 'Мария (Байер)',
              action: 'Увеличила Qty для SKU #772',
              type: 'order',
            },
            {
              time: 'Вчера',
              user: 'Система',
              action: 'Условия Net 60 одобрены',
              type: 'system',
            },
            {
              time: '2 дня назад',
              user: 'John (Фабрика)',
              action: 'Обновил остатки (ATS) для верхней одежды',
              type: 'production',
            },
          ].map((log, i) => (
            <div key={i} className="group relative flex gap-3">
              {i < 3 && (
<<<<<<< HEAD
                <div className="absolute bottom-[-24px] left-[9px] top-4 w-px bg-slate-100" />
=======
                <div className="bg-bg-surface2 absolute bottom-[-24px] left-[9px] top-4 w-px" />
>>>>>>> recover/cabinet-wip-from-stash
              )}
              <div
                className={cn(
                  'z-10 h-[18px] w-[18px] shrink-0 rounded-full border-2 border-white shadow-sm',
                  log.type === 'finance'
                    ? 'bg-emerald-500'
                    : log.type === 'order'
<<<<<<< HEAD
                      ? 'bg-indigo-500'
                      : log.type === 'production'
                        ? 'bg-amber-500'
                        : 'bg-slate-400'
=======
                      ? 'bg-accent-primary'
                      : log.type === 'production'
                        ? 'bg-amber-500'
                        : 'bg-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
                )}
              />
              <div className="space-y-1 pb-2">
                <div className="flex items-center gap-2">
<<<<<<< HEAD
                  <span className="text-[10px] font-bold text-slate-900">{log.user}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    {log.time}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-500">{log.action}</p>
=======
                  <span className="text-text-primary text-[10px] font-bold">{log.user}</span>
                  <span className="text-text-muted text-[10px] font-bold uppercase tracking-wide">
                    {log.time}
                  </span>
                </div>
                <p className="text-text-secondary text-xs font-medium">{log.action}</p>
>>>>>>> recover/cabinet-wip-from-stash
              </div>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
<<<<<<< HEAD
          className="mt-6 w-full rounded-xl border-slate-200 text-[10px] font-bold uppercase"
=======
          className="border-border-default mt-6 w-full rounded-xl text-[10px] font-bold uppercase"
>>>>>>> recover/cabinet-wip-from-stash
          onClick={() => onOpenChange(false)}
        >
          Закрыть историю
        </Button>
      </DialogContent>
    </Dialog>
  );
}

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
            <Clock className="h-5 w-5 text-indigo-600" /> История активности
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
              action: 'Отсрочка 60 дней одобрена',
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
                <div className="absolute bottom-[-24px] left-[9px] top-4 w-px bg-slate-100" />
              )}
              <div
                className={cn(
                  'z-10 h-[18px] w-[18px] shrink-0 rounded-full border-2 border-white shadow-sm',
                  log.type === 'finance'
                    ? 'bg-emerald-500'
                    : log.type === 'order'
                      ? 'bg-indigo-500'
                      : log.type === 'production'
                        ? 'bg-amber-500'
                        : 'bg-slate-400'
                )}
              />
              <div className="space-y-1 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-900">{log.user}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    {log.time}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-500">{log.action}</p>
              </div>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          className="mt-6 w-full rounded-xl border-slate-200 text-[10px] font-bold uppercase"
          onClick={() => onOpenChange(false)}
        >
          Закрыть историю
        </Button>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { Check, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SmartCheckoutDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  toast: any;
}

export function SmartCheckoutDialog({ isOpen, onOpenChange, toast }: SmartCheckoutDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl overflow-hidden rounded-xl border-none bg-white/95 p-0 shadow-[0_0_100px_rgba(0,0,0,0.1)] backdrop-blur-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Smart Checkout</DialogTitle>
        </DialogHeader>
        <div className="flex h-[600px]">
          {/* Left: Progress & Terms */}
          <div className="relative flex w-1/3 flex-col justify-between overflow-hidden bg-slate-900 p-3 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.1),transparent)]" />
            <div className="relative z-10 space-y-4">
              <div className="space-y-2">
                <Badge className="border-none bg-indigo-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  ORDER_v2.0
                </Badge>
                <h2 className="text-sm font-bold uppercase leading-none tracking-tight">
                  Smart
                  <br />
                  Checkout
                </h2>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Состав заказа', status: 'completed' },
                  { label: 'Условия оплаты', status: 'current' },
                  { label: 'Логистика', status: 'pending' },
                  { label: 'Подтверждение', status: 'pending' },
                ].map((step, i) => (
                  <div key={i} className="group/step flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px] font-bold transition-all',
                        step.status === 'completed'
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : step.status === 'current'
                            ? 'border-white bg-white text-slate-900 shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                            : 'border-slate-800 text-slate-600'
                      )}
                    >
                      {step.status === 'completed' ? <Check className="h-3 w-3" /> : i + 1}
                    </div>
                    <span
                      className={cn(
                        'text-[10px] font-bold uppercase tracking-wide transition-colors',
                        step.status === 'pending' ? 'text-slate-600' : 'text-white'
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 space-y-4 rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Ваш Кредитный Лимит
              </p>
              <div className="space-y-2">
                <div className="flex items-end justify-between">
                  <span className="text-base font-bold leading-none text-white">2.5M / 5.0M</span>
                  <span className="text-[10px] font-bold text-emerald-500">50% Использовано</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Forms */}
          <div className="flex flex-1 flex-col justify-between p-3">
            <div className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Выберите условия оплаты (Payment Terms)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      id: 'net30',
                      label: 'Net 30',
                      desc: 'Оплата через 30 дней',
                      active: false,
                    },
                    {
                      id: 'net60',
                      label: 'Net 60',
                      desc: 'Оплата через 60 дней',
                      active: true,
                    },
                    {
                      id: 'deposit',
                      label: '30% Deposit',
                      desc: 'Оплата частями',
                      active: false,
                    },
                    {
                      id: 'prepay',
                      label: 'Prepayment',
                      desc: 'Полная предоплата (-5%)',
                      active: false,
                    },
                  ].map((term) => (
                    <button
                      key={term.id}
                      className={cn(
                        'group/term space-y-1 rounded-2xl border-2 p-4 text-left transition-all',
                        term.active
                          ? 'border-indigo-600 bg-indigo-50/50'
                          : 'border-slate-100 hover:border-slate-300'
                      )}
                    >
                      <p
                        className={cn(
                          'text-sm font-bold uppercase',
                          term.active ? 'text-indigo-600' : 'text-slate-900'
                        )}
                      >
                        {term.label}
                      </p>
                      <p className="text-[10px] font-medium text-slate-400">{term.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Инвойсинг
                </h3>
                <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                      <FileText className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold uppercase text-slate-900">
                        Proforma_Invoice_#884.pdf
                      </p>
                      <p className="text-[10px] font-bold uppercase text-slate-400">
                        Сгенерирован автоматически на основе корзины
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="h-8 rounded-lg border-slate-200 text-[10px] font-bold uppercase"
                  >
                    Скачать
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-slate-100 pt-8">
              <Button
                variant="outline"
                className="h-12 flex-1 rounded-2xl border-slate-200 text-[10px] font-bold uppercase tracking-wide"
              >
                Назад
              </Button>
              <Button
                onClick={() => {
                  onOpenChange(false);
                  toast({
                    title: 'Заказ подтвержден',
                    description: 'Ваш оптовый заказ отправлен на верификацию бренду.',
                  });
                }}
                className="h-12 flex-[2] rounded-2xl bg-indigo-600 text-[10px] font-bold uppercase tracking-wide text-white shadow-xl shadow-indigo-200 hover:bg-indigo-700"
              >
                Подтвердить заказ (2,500,000₽)
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

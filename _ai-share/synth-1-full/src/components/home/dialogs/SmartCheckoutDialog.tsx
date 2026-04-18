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
          <div className="bg-text-primary relative flex w-1/3 flex-col justify-between overflow-hidden p-3 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.1),transparent)]" />
            <div className="relative z-10 space-y-4">
              <div className="space-y-2">
                <Badge className="bg-accent-primary border-none px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
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
                            ? 'text-text-primary border-white bg-white shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                            : 'border-text-primary/30 text-text-secondary'
                      )}
                    >
                      {step.status === 'completed' ? <Check className="h-3 w-3" /> : i + 1}
                    </div>
                    <span
                      className={cn(
                        'text-[10px] font-bold uppercase tracking-wide transition-colors',
                        step.status === 'pending' ? 'text-text-secondary' : 'text-white'
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 space-y-4 rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-text-muted text-[10px] font-bold uppercase tracking-wide">
                Ваш Кредитный Лимит
              </p>
              <div className="space-y-2">
                <div className="flex items-end justify-between">
                  <span className="text-base font-bold leading-none text-white">2.5M / 5.0M</span>
                  <span className="text-[10px] font-bold text-emerald-500">50% Использовано</span>
                </div>
                <div className="bg-text-primary/90 h-1.5 w-full overflow-hidden rounded-full">
                  <div className="from-accent-primary h-full w-1/2 rounded-full bg-gradient-to-r to-emerald-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Forms */}
          <div className="flex flex-1 flex-col justify-between p-3">
            <div className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-text-muted text-xs font-bold uppercase tracking-wide">
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
                          ? 'border-accent-primary bg-accent-primary/10'
                          : 'border-border-subtle hover:border-border-default'
                      )}
                    >
                      <p
                        className={cn(
                          'text-sm font-bold uppercase',
                          term.active ? 'text-accent-primary' : 'text-text-primary'
                        )}
                      >
                        {term.label}
                      </p>
                      <p className="text-text-muted text-[10px] font-medium">{term.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-text-muted text-xs font-bold uppercase tracking-wide">
                  Инвойсинг
                </h3>
                <div className="bg-bg-surface2 border-border-subtle flex items-center justify-between rounded-2xl border p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                      <FileText className="text-accent-primary h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-text-primary text-[10px] font-bold uppercase">
                        Proforma_Invoice_#884.pdf
                      </p>
                      <p className="text-text-muted text-[10px] font-bold uppercase">
                        Сгенерирован автоматически на основе корзины
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="border-border-default h-8 rounded-lg text-[10px] font-bold uppercase"
                  >
                    Скачать
                  </Button>
                </div>
              </div>
            </div>

            <div className="border-border-subtle flex items-center gap-3 border-t pt-8">
              <Button
                variant="outline"
                className="border-border-default h-12 flex-1 rounded-2xl text-[10px] font-bold uppercase tracking-wide"
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
                className="bg-accent-primary hover:bg-accent-primary shadow-accent-primary/15 h-12 flex-[2] rounded-2xl text-[10px] font-bold uppercase tracking-wide text-white shadow-xl"
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

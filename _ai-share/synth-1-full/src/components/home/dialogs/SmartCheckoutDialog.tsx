"use client";

import { Check, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SmartCheckoutDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  toast: any;
}

export function SmartCheckoutDialog({
  isOpen,
  onOpenChange,
  toast,
}: SmartCheckoutDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 bg-white/95 backdrop-blur-2xl border-none rounded-xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.1)]">
        <DialogHeader className="sr-only">
          <DialogTitle>Smart Checkout</DialogTitle>
        </DialogHeader>
        <div className="flex h-[600px]">
          {/* Left: Progress & Terms */}
          <div className="w-1/3 bg-slate-900 p-3 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.1),transparent)]" />
            <div className="relative z-10 space-y-4">
              <div className="space-y-2">
                <Badge className="bg-indigo-600 text-white border-none text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide">
                  ORDER_v2.0
                </Badge>
                <h2 className="text-sm font-bold uppercase tracking-tight leading-none">
                  Smart
                  <br />
                  Checkout
                </h2>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Состав заказа", status: "completed" },
                  { label: "Условия оплаты", status: "current" },
                  { label: "Логистика", status: "pending" },
                  { label: "Подтверждение", status: "pending" },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3 group/step">
                    <div
                      className={cn(
                        "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all",
                        step.status === "completed"
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : step.status === "current"
                          ? "bg-white text-slate-900 border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                          : "border-slate-800 text-slate-600",
                      )}
                    >
                      {step.status === "completed" ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        i + 1
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-wide transition-colors",
                        step.status === "pending"
                          ? "text-slate-600"
                          : "text-white",
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 p-4 bg-white/5 rounded-3xl border border-white/10 space-y-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Ваш Кредитный Лимит
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-base font-bold text-white leading-none">
                    2.5M / 5.0M
                  </span>
                  <span className="text-[10px] font-bold text-emerald-500">
                    50% Использовано
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Forms */}
          <div className="flex-1 p-3 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Выберите условия оплаты (Payment Terms)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      id: "net30",
                      label: "Net 30",
                      desc: "Оплата через 30 дней",
                      active: false,
                    },
                    {
                      id: "net60",
                      label: "Net 60",
                      desc: "Оплата через 60 дней",
                      active: true,
                    },
                    {
                      id: "deposit",
                      label: "30% Deposit",
                      desc: "Оплата частями",
                      active: false,
                    },
                    {
                      id: "prepay",
                      label: "Prepayment",
                      desc: "Полная предоплата (-5%)",
                      active: false,
                    },
                  ].map((term) => (
                    <button
                      key={term.id}
                      className={cn(
                        "p-4 rounded-2xl border-2 transition-all text-left space-y-1 group/term",
                        term.active
                          ? "border-indigo-600 bg-indigo-50/50"
                          : "border-slate-100 hover:border-slate-300",
                      )}
                    >
                      <p
                        className={cn(
                          "text-sm font-bold uppercase",
                          term.active ? "text-indigo-600" : "text-slate-900",
                        )}
                      >
                        {term.label}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {term.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Инвойсинг
                </h3>
                <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                      <FileText className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold text-slate-900 uppercase">
                        Proforma_Invoice_#884.pdf
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        Сгенерирован автоматически на основе корзины
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="h-8 rounded-lg text-[10px] font-bold uppercase border-slate-200"
                  >
                    Скачать
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-8 border-t border-slate-100">
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-2xl text-[10px] font-bold uppercase tracking-wide border-slate-200"
              >
                Назад
              </Button>
              <Button
                onClick={() => {
                  onOpenChange(false);
                  toast({
                    title: "Заказ подтвержден",
                    description:
                      "Ваш оптовый заказ отправлен на верификацию бренду.",
                  });
                }}
                className="flex-[2] h-12 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-200 text-[10px] font-bold uppercase tracking-wide"
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

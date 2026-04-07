"use client";

import { Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AuditTrailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuditTrailDialog({ isOpen, onOpenChange }: AuditTrailDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white border-none rounded-xl shadow-2xl p-4">
        <DialogHeader>
          <DialogTitle className="text-base font-bold uppercase tracking-tight flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-600" /> История активности
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 mt-4">
          {[
            {
              time: "10:45 AM",
              user: "Alex (Бренд)",
              action: "Обновил скидку до 5%",
              type: "finance",
            },
            {
              time: "09:12 AM",
              user: "Мария (Байер)",
              action: "Увеличила Qty для SKU #772",
              type: "order",
            },
            {
              time: "Вчера",
              user: "Система",
              action: "Условия Net 60 одобрены",
              type: "system",
            },
            {
              time: "2 дня назад",
              user: "John (Фабрика)",
              action: "Обновил остатки (ATS) для верхней одежды",
              type: "production",
            },
          ].map((log, i) => (
            <div key={i} className="flex gap-3 relative group">
              {i < 3 && (
                <div className="absolute left-[9px] top-4 bottom-[-24px] w-px bg-slate-100" />
              )}
              <div
                className={cn(
                  "h-[18px] w-[18px] rounded-full border-2 border-white shadow-sm shrink-0 z-10",
                  log.type === "finance"
                    ? "bg-emerald-500"
                    : log.type === "order"
                    ? "bg-indigo-500"
                    : log.type === "production"
                    ? "bg-amber-500"
                    : "bg-slate-400",
                )}
              />
              <div className="space-y-1 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-900">
                    {log.user}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    {log.time}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {log.action}
                </p>
              </div>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          className="w-full mt-6 rounded-xl border-slate-200 text-[10px] font-bold uppercase"
          onClick={() => onOpenChange(false)}
        >
          Закрыть историю
        </Button>
      </DialogContent>
    </Dialog>
  );
}

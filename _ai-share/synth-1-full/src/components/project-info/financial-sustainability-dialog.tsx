'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";

interface FinancialSustainabilityDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function FinancialSustainabilityDialog({ isOpen, onOpenChange }: FinancialSustainabilityDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">🔟 Финансовая и стратегическая устойчивость</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4 text-sm">
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Диверсифицированная монетизация: комиссии, подписки, AI-сервисы, аналитика, лицензии.</li>
                <li>Высокий процент повторных доходов (MRR &gt; 70%).</li>
                <li>Снижение зависимости от сезонности за счёт подписок и Data Insights.</li>
                <li>Потенциал экспорта технологий (API / White-label / консалтинг).</li>
            </ul>
            <p className="font-semibold text-foreground pt-2 flex items-start gap-2"><Lightbulb className="h-4 w-4 mt-1 shrink-0 text-accent" />Результат: платформа финансово устойчива и способна масштабироваться без внешнего капитала на ранних этапах.</p>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Закрыть</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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

interface EsgEcosystemDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function EsgEcosystemDialog({ isOpen, onOpenChange }: EsgEcosystemDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">4️⃣ ESG-экосистема и реальные метрики устойчивости</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4 text-sm">
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Syntha внедряет Sustainability Scorer — систему, которая измеряет влияние коллекций на устойчивость.</li>
                <li>Подсчёт: доля digital-прототипов, отказ от образцов, углеродный след, повторное использование ассетов.</li>
                <li>Отчётность в формате ESG Dashboard: можно сравнивать бренды, категории и сезоны.</li>
                <li>Интеграция с глобальными ESG-базами (по партнёрству) — для международной сертификации.</li>
            </ul>
            <p className="font-semibold text-foreground pt-2 flex items-start gap-2"><Lightbulb className="h-4 w-4 mt-1 shrink-0 text-accent" />Результат: мода получает прозрачные цифровые метрики устойчивости, а бренды — реальные цифры для инвесторов и аудиторов.</p>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Закрыть</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

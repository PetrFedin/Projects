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

interface CycleIntegrationDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function CycleIntegrationDialog({ isOpen, onOpenChange }: CycleIntegrationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">8️⃣ Интеграция всего модного цикла: Create → Present → Sell → Analyze</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4 text-sm">
            <p className="text-muted-foreground">
                Syntha закрывает весь жизненный цикл коллекции:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li><b>Create:</b> создание и рендеринг в Digital Fashion Laboratory</li>
                <li><b>Present:</b> digital-lookbooks, AR и live-шоурумы</li>
                <li><b>Sell:</b> B2C-витрины и B2B-заказы в Market Room</li>
                <li><b>Analyze:</b> AI-инсайты, Data Insights, ESG-панели</li>
            </ul>
             <p className="text-muted-foreground">
                Все данные связываются через Syntha Data Graph — единый слой аналитики и сигналов.
            </p>
            <p className="font-semibold text-foreground pt-2 flex items-start gap-2"><Lightbulb className="h-4 w-4 mt-1 shrink-0 text-accent" />Результат: модный бизнес получает сквозную управляемость и предсказуемость вместо разрозненных инструментов.</p>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Закрыть</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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

interface AiInfraDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function AiInfraDialog({ isOpen, onOpenChange }: AiInfraDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">9️⃣ Собственная AI-инфраструктура и explainable-интеллект</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4 text-sm">
            <p className="text-muted-foreground">
                Все модели Syntha основаны на открытой и управляемой архитектуре AI, где каждый прогноз или подбор имеет объяснение.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Explainable-интерфейсы показывают, почему тот или иной образ или SKU рекомендован.</li>
                <li>Обучение на обезличенных данных платформы, с соблюдением RLS и GDPR.</li>
                <li>Прозрачный AI повышает доверие брендов и партнёров.</li>
            </ul>
            <p className="font-semibold text-foreground pt-2 flex items-start gap-2"><Lightbulb className="h-4 w-4 mt-1 shrink-0 text-accent" />Результат: Syntha — не «магия нейросетей», а управляемый интеллект с доказуемой ценностью.</p>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Закрыть</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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

interface GrowthPlatformDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function GrowthPlatformDialog({ isOpen, onOpenChange }: GrowthPlatformDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">7️⃣ Платформа роста — от стартапа до индустриального стандарта</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4 text-sm">
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Syntha масштабируется от индивидуальных дизайнеров до корпораций и fashion-холдингов.</li>
                <li>Модель multi-tenant: бренды, магазины и креаторы работают независимо, но в единой архитектуре данных.</li>
                <li>Архитектура на FastAPI + PostgreSQL + S3 + pgvector + Kubernetes обеспечивает горизонтальное масштабирование.</li>
                <li>Переход из MVP в Enterprise без миграций — просто добавлением модулей.</li>
            </ul>
            <p className="font-semibold text-foreground pt-2 flex items-start gap-2"><Lightbulb className="h-4 w-4 mt-1 shrink-0 text-accent" />Результат: система не устаревает — она растёт вместе с бизнесом и индустрией.</p>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Закрыть</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

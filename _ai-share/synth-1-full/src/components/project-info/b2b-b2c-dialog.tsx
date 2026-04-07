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

interface B2bB2cDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function B2bB2cDialog({ isOpen, onOpenChange }: B2bB2cDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">1️⃣ Полное слияние B2B и B2C в одной системе</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4 text-sm">
            <p className="text-muted-foreground">
                Syntha объединяет шоурумы для байеров (Market Room) и цифровые витрины для клиентов (Client App) в едином контуре данных.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Бренд публикует коллекцию один раз — и она автоматически становится видимой и для ритейла, и для конечного покупателя.</li>
                <li>Байеры видят коммерческую статистику, а клиенты — digital-lookbook и AR-примерку.</li>
                <li>Все данные (просмотры, заказы, вовлечённость) поступают в общую аналитику и AI-ядро, формируя «замкнутую петлю моды».</li>
            </ul>
            <p className="font-semibold text-foreground pt-2 flex items-start gap-2"><Lightbulb className="h-4 w-4 mt-1 shrink-0 text-accent" />Результат: единый pipeline от создания до продажи — без дублирования, интеграций и потерь данных.</p>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Закрыть</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

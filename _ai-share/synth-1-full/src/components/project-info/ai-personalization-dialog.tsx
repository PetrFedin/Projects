'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';

interface AiPersonalizationDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function AiPersonalizationDialog({ isOpen, onOpenChange }: AiPersonalizationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">
            3️⃣ AI-персонализация для всех уровней: бренды, магазины, покупатели
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4 text-sm">
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            <li>
              AI Stylist подбирает образы по вкусу, событию, региону и гардеробу пользователя.
            </li>
            <li>
              AI Merchandising Advisor анализирует ассортимент, прогнозирует спрос и рекомендует
              цвета, категории, ценовые диапазоны.
            </li>
            <li>
              AI Trend Analyst отслеживает тренды соцсетей и пользовательских предпочтений в
              реальном времени.
            </li>
            <li>
              AI Copywriter и Visual Generator создают кампании, баннеры и описания под ДНК бренда.
            </li>
          </ul>
          <p className="flex items-start gap-2 pt-2 font-semibold text-foreground">
            <Lightbulb className="mt-1 h-4 w-4 shrink-0 text-accent" />
            Результат: каждый участник платформы получает персональный интеллект, который усиливает
            его решения — от стилиста до CEO.
          </p>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Закрыть</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

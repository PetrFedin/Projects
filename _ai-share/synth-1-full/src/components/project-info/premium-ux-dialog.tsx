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

interface PremiumUxDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function PremiumUxDialog({ isOpen, onOpenChange }: PremiumUxDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">
            6️⃣ Премиальный UX / UI и эстетика digital luxury fashion
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4 text-sm">
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            <li>
              Интерфейсы созданы в эстетике luxury digital — нейтральные фоны, интуитивная
              навигация, 3D-анимации.
            </li>
            <li>AI-композиция изображений и автоподбор световых сцен для коллекций.</li>
            <li>Реал-тайм 3D и AR на базе Three.js, WebGL, WebXR — без скачивания приложений.</li>
            <li>
              Интерактивные live-room-шоурумы и digital-подиумы с возможностью заказа прямо из
              видео.
            </li>
          </ul>
          <p className="flex items-start gap-2 pt-2 font-semibold text-foreground">
            <Lightbulb className="mt-1 h-4 w-4 shrink-0 text-accent" />
            Результат: опыт работы с платформой сравним с виртуальным бутиком уровня Louis Vuitton /
            Farfetch Future Store, а не с обычным маркетплейсом.
          </p>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Закрыть</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

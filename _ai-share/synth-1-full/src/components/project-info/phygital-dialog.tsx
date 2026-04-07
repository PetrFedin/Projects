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

interface PhygitalDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function PhygitalDialog({ isOpen, onOpenChange }: PhygitalDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">2️⃣ Phygital-взаимодействие: коллекции, контент и продажи</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4 text-sm">
            <p className="text-muted-foreground">
                Каждая вещь существует одновременно в физическом и цифровом измерении — со своим Digital Twin-паспортом.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>3D и AR позволяют клиентам примерять коллекции в реальности или метавселенной.</li>
                <li>Бренды могут выпускать digital drops, NFT-капсулы или «виртуальные показы» без студий и логистики.</li>
                <li>Phygital-контент интегрируется с продажами: клики, просмотры и лайки напрямую влияют на видимость SKU.</li>
            </ul>
            <p className="font-semibold text-foreground pt-2 flex items-start gap-2"><Lightbulb className="h-4 w-4 mt-1 shrink-0 text-accent" />Результат: мода становится интерактивной, данные о реакции аудитории — коммерчески значимыми, а каждая вещь получает цифровую биографию.</p>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Закрыть</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

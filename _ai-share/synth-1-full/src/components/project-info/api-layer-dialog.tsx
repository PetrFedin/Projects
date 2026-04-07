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

interface ApiLayerDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ApiLayerDialog({ isOpen, onOpenChange }: ApiLayerDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">5️⃣ Универсальный API-слой и SDK для партнёров</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4 text-sm">
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Syntha открыта для интеграций: GraphQL / REST API, Webhooks, SDK (JS/Python).</li>
                <li>ERP/CRM, платёжные шлюзы, AI-инструменты, логистика, стриминговые сервисы — всё подключается через единый API-шлюз.</li>
                <li>White-label API для внешних проектов (AI Stylist, Trend Engine, Look Generator).</li>
                <li>SDK для встраивания 3D-витрин, AR-примерки и AI-помощников на сайты брендов.</li>
            </ul>
            <p className="font-semibold text-foreground pt-2 flex items-start gap-2"><Lightbulb className="h-4 w-4 mt-1 shrink-0 text-accent" />Результат: Syntha превращается в технологическую платформу для индустрии, а не закрытую экосистему.</p>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Закрыть</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

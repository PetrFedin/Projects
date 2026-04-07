'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Loader2, Wand2, BrainCircuit } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";

interface RrpSuggestionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  suggestion: { suggestedRrp: number; reasoning: string; } | null;
  onAccept: (newPrice: number) => void;
  isLoading: boolean;
}

export function RrpSuggestionDialog({ isOpen, onOpenChange, suggestion, onAccept, isLoading }: RrpSuggestionDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><Wand2 className="text-accent" /> Рекомендация AI по цене</DialogTitle>
                </DialogHeader>
                 {isLoading && <div className="flex justify-center p-4"><Loader2 className="h-8 w-8 animate-spin" /></div>}
                {suggestion && !isLoading && (
                    <div className="py-4 space-y-4">
                        <p className="text-center">Рекомендуемая розничная цена (РРЦ):</p>
                        <p className="text-sm font-bold text-center">{suggestion.suggestedRrp.toLocaleString('ru-RU')} ₽</p>
                        <Alert>
                            <BrainCircuit className="h-4 w-4" />
                            <AlertTitle>Обоснование</AlertTitle>
                            <AlertDescription>{suggestion.reasoning}</AlertDescription>
                        </Alert>
                    </div>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Отклонить</Button>
                    <Button disabled={!suggestion} onClick={() => { if(suggestion) onAccept(suggestion.suggestedRrp); }}>Применить</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

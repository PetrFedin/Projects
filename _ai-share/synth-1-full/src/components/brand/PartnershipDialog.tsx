'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Handshake, Send, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIState } from '@/providers/ui-state';

interface PartnershipDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  brandName: string;
  brandId: string;
  onSend: (brandId: string) => void;
  status?: 'pending' | 'accepted' | 'rejected' | 'none';
}

export function PartnershipDialog({
  isOpen,
  onOpenChange,
  brandName,
  brandId,
  onSend,
}: PartnershipDialogProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const { updatePartnershipStatus } = useUIState();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('success');
      onSend(brandId);
    }, 1500);
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset after animation
    setTimeout(() => setStep('form'), 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md overflow-hidden rounded-xl border-none bg-background p-0 shadow-2xl">
        <AnimatePresence mode="wait">
          {step === 'form' ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4"
            >
              <DialogHeader className="mb-6">
                <div className="mb-2 flex items-center gap-3">
                  <div className="bg-accent-primary/10 text-accent-primary flex h-10 w-10 items-center justify-center rounded-xl">
                    <Handshake className="h-5 w-5" />
                  </div>
                  <DialogTitle className="text-sm font-black uppercase tracking-tighter">
                    Сотрудничество
                  </DialogTitle>
                </div>
                <DialogDescription className="text-sm font-medium">
                  Предложение для бренда{' '}
                  <span className="text-accent-primary font-bold">{brandName}</span>
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-text-muted px-1 text-[10px] font-black uppercase tracking-widest">
                    Тип партнера
                  </label>
                  <select className="bg-bg-surface2 border-border-subtle focus:ring-accent-primary/20 h-12 w-full appearance-none rounded-2xl border px-4 text-sm font-medium outline-none focus:ring-2">
                    <option>Магазин / Ритейлер</option>
                    <option>Дистрибьютор</option>
                    <option>Агент / Шоурум</option>
                    <option>Маркетплейс</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-text-muted px-1 text-[10px] font-black uppercase tracking-widest">
                    Ваше предложение
                  </label>
                  <Textarea
                    placeholder="Опишите кратко формат сотрудничества, ваши сильные стороны и географию работы..."
                    className="bg-bg-surface2 border-border-subtle focus:ring-accent-primary/20 min-h-[120px] resize-none rounded-2xl border p-4 text-sm transition-all focus:ring-2"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="button-glimmer button-professional group/btn mt-4 h-10 w-full rounded-2xl border-none !bg-black shadow-md shadow-xl transition-all duration-500 hover:!bg-black"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                      <span>Отправка...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Отправить запрос</span>
                      <Send className="h-4 w-4 transition-transform group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1" />
                    </div>
                  )}
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 text-center"
            >
              <div className="bg-state-success/10 text-state-success mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
                <Check className="h-10 w-10" />
              </div>
              <h3 className="mb-2 text-sm font-black uppercase tracking-tighter">
                Запрос отправлен!
              </h3>
              <p className="text-text-secondary mb-8 text-sm leading-relaxed">
                Ваше предложение успешно передано представителям бренда{' '}
                <span className="font-bold">{brandName}</span>.
                <br />
                <br />
                Статус кнопки «Партнерство» изменился на{' '}
                <span className="text-accent-primary font-bold">«Запрос отправлен»</span>. Как
                только бренд подтвердит заявку, статус изменится на{' '}
                <span className="text-state-success font-bold">«Партнер»</span>.
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleClose}
                  className="bg-bg-surface2 hover:bg-bg-surface border-border-strong text-text-primary h-12 rounded-2xl border px-8 font-mono text-[10px] uppercase tracking-widest transition-all"
                >
                  Закрыть окно
                </Button>
                <button
                  onClick={() => {
                    updatePartnershipStatus(brandId, 'accepted');
                    handleClose();
                  }}
                  className="text-text-muted hover:text-accent-primary font-mono text-[8px] uppercase tracking-tighter transition-colors"
                >
                  [ DEV: Симулировать одобрение ]
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

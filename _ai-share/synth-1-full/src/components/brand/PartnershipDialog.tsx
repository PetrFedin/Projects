'use client';

import React, { useState } from 'react';
import { 
    Dialog, DialogContent, DialogHeader, DialogTitle, 
    DialogDescription 
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

export function PartnershipDialog({ isOpen, onOpenChange, brandName, brandId, onSend }: PartnershipDialogProps) {
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
            <DialogContent className="max-w-md rounded-xl p-0 border-none bg-background shadow-2xl overflow-hidden">
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
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="h-10 w-10 rounded-xl bg-accent-primary/10 flex items-center justify-center text-accent-primary">
                                        <Handshake className="h-5 w-5" />
                                    </div>
                                    <DialogTitle className="text-sm font-black tracking-tighter uppercase">Сотрудничество</DialogTitle>
                                </div>
                                <DialogDescription className="text-sm font-medium">
                                    Предложение для бренда <span className="text-accent-primary font-bold">{brandName}</span>
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Тип партнера</label>
                                    <select className="w-full h-12 bg-bg-surface2 border border-border-subtle rounded-2xl px-4 text-sm font-medium focus:ring-2 focus:ring-accent-primary/20 outline-none appearance-none">
                                        <option>Магазин / Ритейлер</option>
                                        <option>Дистрибьютор</option>
                                        <option>Агент / Шоурум</option>
                                        <option>Маркетплейс</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Ваше предложение</label>
                                    <Textarea 
                                        placeholder="Опишите кратко формат сотрудничества, ваши сильные стороны и географию работы..."
                                        className="min-h-[120px] bg-bg-surface2 border border-border-subtle rounded-2xl p-4 text-sm focus:ring-2 focus:ring-accent-primary/20 transition-all resize-none"
                                        required
                                    />
                                </div>

                                <Button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="w-full h-10 button-glimmer button-professional !bg-black hover:!bg-black shadow-xl shadow-slate-200/50 border-none rounded-2xl group/btn transition-all duration-500 mt-4"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            <span>Отправка...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span>Отправить запрос</span>
                                            <Send className="h-4 w-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
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
                            <div className="mx-auto h-20 w-20 rounded-full bg-state-success/10 flex items-center justify-center text-state-success mb-6">
                                <Check className="h-10 w-10" />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-tighter mb-2">Запрос отправлен!</h3>
                            <p className="text-sm text-text-secondary leading-relaxed mb-8">
                                Ваше предложение успешно передано представителям бренда <span className="font-bold">{brandName}</span>. 
                                <br /><br />
                                Статус кнопки «Партнерство» изменился на <span className="text-accent-primary font-bold">«Запрос отправлен»</span>. 
                                Как только бренд подтвердит заявку, статус изменится на <span className="text-state-success font-bold">«Партнер»</span>.
                            </p>
                            <div className="flex flex-col gap-2">
                                <Button 
                                    onClick={handleClose}
                                    className="h-12 px-8 bg-bg-surface2 hover:bg-bg-surface border border-border-strong text-text-primary rounded-2xl font-mono text-[10px] uppercase tracking-widest transition-all"
                                >
                                    Закрыть окно
                                </Button>
                                <button 
                                    onClick={() => {
                                        updatePartnershipStatus(brandId, 'accepted');
                                        handleClose();
                                    }}
                                    className="text-[8px] font-mono text-text-muted hover:text-accent-primary uppercase tracking-tighter transition-colors"
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

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AiSizeDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    displayName: string;
}

export function AiSizeDialog({ isOpen, onOpenChange, displayName }: AiSizeDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md rounded-xl p-3 border-none bg-background shadow-2xl text-center overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-muted/10">
                    <motion.div 
                        className="h-full bg-accent" 
                        initial={{ width: "30%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>
                <div className="h-24 w-24 rounded-xl bg-accent/10 flex items-center justify-center text-accent mx-auto mb-8 relative">
                    <Brain className="h-12 w-12" />
                    <Sparkles className="h-6 w-6 absolute -top-2 -right-2 animate-bounce" />
                </div>
                <DialogTitle className="text-base font-black tracking-tighter uppercase mb-4 leading-tight">AI Подбор размера</DialogTitle>
                <DialogDescription className="text-base font-medium text-muted-foreground leading-relaxed">
                    Нейросеть анализирует ваши параметры и историю покупок в {displayName} для определения идеальной посадки.
                </DialogDescription>
                
                <div className="mt-10 space-y-4">
                    <div className="p-4 rounded-3xl bg-muted/5 border-2 border-dashed border-accent/20 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Ваш профиль</span>
                            <Badge className="bg-accent text-white border-none text-[8px] font-black uppercase">Active</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-left">
                            <div>
                                <p className="text-[8px] font-black uppercase text-muted-foreground/60 mb-1">Рост</p>
                                <p className="text-sm font-black uppercase">178 см</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-black uppercase text-muted-foreground/60 mb-1">Вес</p>
                                <p className="text-sm font-black uppercase">72 кг</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <Button className="w-full rounded-2xl h-10 text-xs font-black uppercase tracking-[0.2em] bg-black text-white hover:bg-accent transition-all shadow-xl">
                            Запустить сканирование
                        </Button>
                        <p className="text-[8px] font-bold text-muted-foreground/60 uppercase tracking-tighter">
                            Точность подбора: 98.4%
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

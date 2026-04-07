import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface StatusesDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    assignedStatuses: any[];
    potentialStatuses: any[];
}

export function StatusesDialog({ isOpen, onOpenChange, assignedStatuses = [], potentialStatuses = [] }: StatusesDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl rounded-xl p-4 border-none bg-background shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-[0.05] pointer-events-none rotate-12">
                    <ShieldCheck className="w-64 h-64 text-accent" />
                </div>
                <DialogHeader className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest text-center">Статусы бренда в системе Syntha</div>
                    </div>
                    <DialogTitle className="text-sm font-black tracking-tighter uppercase leading-tight">
                        Система <br/>
                        <span className="text-accent">Привилегий и Качества</span>
                    </DialogTitle>
                    <DialogDescription className="text-base font-medium text-foreground/80 pt-4 leading-relaxed max-w-lg">
                        Статусы присваиваются автоматически на основе объективных данных: отзывов клиентов, скорости логистики и результатов аудита.
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-8 space-y-4 relative z-10 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Присвоенные статусы</h4>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {(assignedStatuses || []).map(status => (
                                <Card key={status.id} className="p-4 rounded-2xl border border-accent/20 bg-accent/[0.03] shadow-md relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-2">
                                        <Badge className="bg-accent text-white border-none text-[8px] uppercase tracking-tighter">Активен</Badge>
                                    </div>
                                    <div className="flex gap-3 items-start">
                                        <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm bg-white text-accent">
                                            {status.icon}
                                        </div>
                                        <div className="space-y-1">
                                            <h5 className="font-black text-sm uppercase tracking-wider text-foreground">{status.name}</h5>
                                            <p className="text-xs font-bold text-accent/80">{status.description}</p>
                                            <p className="text-[11px] text-muted-foreground leading-relaxed mt-2 font-medium italic">
                                                {status.fullDesc}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Потенциальные статусы</h4>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {(potentialStatuses || []).map(status => (
                                <Card key={status.id} className="p-4 rounded-2xl border border-muted/20 bg-muted/5 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all cursor-help">
                                    <div className="flex gap-3 items-start">
                                        <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 bg-white text-muted-foreground">
                                            {status.icon}
                                        </div>
                                        <div className="space-y-1">
                                            <h5 className="font-black text-sm uppercase tracking-wider text-foreground">{status.name}</h5>
                                            <p className="text-xs font-bold text-muted-foreground">{status.description}</p>
                                            <p className="text-[11px] text-muted-foreground/60 leading-relaxed mt-2 font-medium italic">
                                                {status.fullDesc}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

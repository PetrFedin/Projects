import React from 'react';
import { Radio } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LiveReminderDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    liveReminderTime: string;
    setLiveReminderTime: (time: string) => void;
    toast: any;
}

export function LiveReminderDialog({ isOpen, onOpenChange, liveReminderTime, setLiveReminderTime, toast }: LiveReminderDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md rounded-xl p-3 border-none bg-background shadow-2xl text-center">
                <div className="h-20 w-20 rounded-xl bg-accent/10 flex items-center justify-center text-accent mx-auto mb-8">
                    <Radio className="h-10 w-10 animate-pulse" />
                </div>
                <DialogTitle className="text-base font-black tracking-tighter uppercase mb-4 leading-tight">Напомнить об эфире?</DialogTitle>
                <DialogDescription className="text-base font-medium text-muted-foreground leading-relaxed">
                    Мы отправим вам PUSH-уведомление и сообщение в личный кабинет, чтобы вы не пропустили начало трансляции.
                </DialogDescription>
                
                <div className="mt-10 space-y-6">
                    <div className="space-y-3">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">За сколько напомнить?</p>
                        <div className="flex gap-2 justify-center">
                            {['5', '15', '30', '60'].map(time => (
                                <Button 
                                    key={time}
                                    variant={liveReminderTime === time ? 'default' : 'outline'}
                                    size="sm"
                                    className={cn(
                                        "h-10 w-10 rounded-xl text-[10px] font-black transition-all",
                                        liveReminderTime === time ? "bg-black text-white border-black shadow-lg" : "hover:bg-muted"
                                    )}
                                    onClick={() => setLiveReminderTime(time)}
                                >
                                    {time}м
                                </Button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="pt-4 space-y-3">
                        <Button 
                            className="w-full rounded-2xl h-10 text-xs font-black uppercase tracking-[0.2em] bg-black text-white hover:bg-accent transition-all shadow-xl"
                            onClick={() => {
                                onOpenChange(false);
                                toast({
                                    title: "Напоминание установлено!",
                                    description: `Мы сообщим вам за ${liveReminderTime} минут до начала.`,
                                });
                            }}
                        >
                            Установить
                        </Button>
                        <Button variant="ghost" className="w-full h-10 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground" onClick={() => onOpenChange(false)}>Отмена</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

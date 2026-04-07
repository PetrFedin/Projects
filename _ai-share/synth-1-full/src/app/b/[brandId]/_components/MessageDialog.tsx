'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MessageSquare, LinkIcon, Send } from 'lucide-react';

interface MessageDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    messageCategory: string;
    displayName: string;
    messageText: string;
    setMessageText: (text: string) => void;
    messageLink: string;
    setMessageLink: (link: string) => void;
    handleSendMessage: () => void;
}

export function MessageDialog({
    isOpen,
    onOpenChange,
    messageCategory,
    displayName,
    messageText,
    setMessageText,
    messageLink,
    setMessageLink,
    handleSendMessage
}: MessageDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md rounded-xl p-4 border-none bg-background shadow-2xl">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest bg-accent/5 text-accent border-accent/20">
                            {messageCategory || 'Общий запрос'}
                        </Badge>
                    </div>
                    <DialogTitle className="text-base font-black tracking-tighter uppercase flex items-center gap-3">
                        <MessageSquare className="h-6 w-6 text-accent" />
                        Написать бренду
                    </DialogTitle>
                    <DialogDescription className="text-sm font-medium pt-2">
                        Отправьте сообщение напрямую команде {displayName}. Сообщение будет доставлено в чат с пометкой "{messageCategory}".
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="message" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Ваше сообщение</Label>
                        <Textarea 
                            id="message"
                            placeholder="Опишите ваш вопрос или предложение..."
                            className="min-h-[120px] rounded-2xl border-muted/20 focus:border-accent/30 bg-muted/5 p-4 text-sm resize-none"
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="links" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Ссылки на файлы / Инфо</Label>
                        <div className="relative">
                            <Input 
                                id="links"
                                placeholder="https://drive.google.com/..."
                                className="h-11 pl-10 rounded-xl border-muted/20 focus:border-accent/30 bg-muted/5 text-xs"
                                value={messageLink}
                                onChange={(e) => setMessageLink(e.target.value)}
                            />
                            <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        <p className="text-[8px] text-muted-foreground px-1 italic">Прикрепите ссылку на презентацию, прайс или портфолио</p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button 
                            className="flex-1 h-12 rounded-2xl bg-accent hover:bg-accent/90 text-white font-black uppercase tracking-widest transition-all shadow-lg shadow-accent/20"
                            onClick={handleSendMessage}
                            disabled={!messageText.trim()}
                        >
                            <Send className="mr-2 h-4 w-4" /> Отправить сообщение
                        </Button>
                    </div>
                    <p className="text-[9px] text-center text-muted-foreground font-medium uppercase tracking-tighter">
                        Обычно бренды отвечают в течение 24 часов
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}

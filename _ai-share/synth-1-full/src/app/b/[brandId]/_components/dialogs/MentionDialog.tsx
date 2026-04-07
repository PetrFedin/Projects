import React from 'react';
import Image from 'next/image';
import { X, Heart, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface MentionDialogProps {
    mention: any;
    onClose: () => void;
}

export function MentionDialog({ mention, onClose }: MentionDialogProps) {
    return (
        <Dialog open={!!mention} onOpenChange={onClose}>
            <DialogContent className="max-w-xl rounded-xl p-0 border-none bg-background shadow-2xl overflow-hidden">
                <VisuallyHidden>
                    <DialogTitle>Отметка покупателя: @{mention?.user}</DialogTitle>
                </VisuallyHidden>
                <div className="relative aspect-square">
                    <Image src={mention?.imageUrl} alt="Mention" fill className="object-cover" />
                    <Button variant="ghost" size="icon" className="absolute top-4 right-4 rounded-full bg-black/20 text-white hover:bg-black/40" onClick={onClose}><X className="h-5 w-5" /></Button>
                </div>
                <div className="p-4 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-accent"><Image src={mention?.avatar} alt="user" width={40} height={40} /></div>
                        <div>
                            <p className="font-black uppercase tracking-tight text-sm">@{mention?.user}</p>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{mention?.date}</p>
                        </div>
                    </div>
                    <p className="text-base font-medium leading-relaxed italic text-foreground/80">"{mention?.text}"</p>
                    <div className="pt-4 flex gap-3">
                        <Button className="flex-1 rounded-xl h-11 text-[10px] font-black uppercase tracking-widest bg-black text-white hover:bg-accent transition-all">Смотреть в Instagram</Button>
                        <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-muted-foreground/10 hover:bg-muted transition-all"><Heart className="h-4 w-4" /></Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

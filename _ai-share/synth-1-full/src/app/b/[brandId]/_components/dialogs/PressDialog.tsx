import React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface PressDialogProps {
    press: any;
    onClose: () => void;
}

export function PressDialog({ press, onClose }: PressDialogProps) {
    return (
        <Dialog open={!!press} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl rounded-xl p-0 border-none bg-background shadow-2xl overflow-hidden">
                <VisuallyHidden>
                    <DialogTitle>Статья: {press?.title}</DialogTitle>
                </VisuallyHidden>
                <div className="relative aspect-[16/7]">
                    <Image src={press?.imageUrl} alt={press?.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute top-4 left-8 h-10 w-32 bg-white/90 backdrop-blur-md rounded-xl p-2 flex items-center justify-center shadow-lg">
                        <img src={press?.logoUrl} alt={press?.name} className="h-full object-contain" />
                    </div>
                    <Button variant="ghost" size="icon" className="absolute top-4 right-6 rounded-full bg-white/20 text-white hover:bg-white/40 backdrop-blur-md" onClick={onClose}><X className="h-5 w-5" /></Button>
                </div>
                <div className="p-3 space-y-6">
                    <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">{press?.name} Special Feature</span>
                        <h3 className="text-base font-black uppercase tracking-tighter leading-tight">{press?.title}</h3>
                    </div>
                    <p className="text-sm font-medium leading-relaxed text-foreground/80 italic">
                        "Syntha Lab устанавливает новые стандарты в индустрии, объединяя экологическую ответственность with передовыми AI-технологиями."
                    </p>
                    <div className="pt-6 flex gap-3">
                        <Button className="flex-1 rounded-xl h-12 text-[10px] font-black uppercase tracking-widest bg-black text-white hover:bg-accent transition-all shadow-xl">Читать статью на сайте издания</Button>
                        <Button variant="outline" className="rounded-xl h-12 px-6 text-[10px] font-black uppercase tracking-widest border-muted-foreground/10 hover:bg-muted transition-all">Скачать PDF</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

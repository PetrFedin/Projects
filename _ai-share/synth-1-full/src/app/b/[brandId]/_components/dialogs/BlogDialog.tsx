import React from 'react';
import Image from 'next/image';
import { X, Clock, Users, ThumbsUp, Send, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface BlogDialogProps {
    blog: any;
    onClose: () => void;
}

export function BlogDialog({ blog, onClose }: BlogDialogProps) {
    return (
        <Dialog open={!!blog} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl p-0 border-none bg-background shadow-2xl custom-scrollbar">
                <VisuallyHidden>
                    <DialogTitle>{blog?.title}</DialogTitle>
                </VisuallyHidden>
                <div className="relative aspect-[21/9]">
                    <Image src={blog?.imageUrl} alt={blog?.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <Button variant="ghost" size="icon" className="absolute top-4 right-6 rounded-full bg-white/20 text-white hover:bg-white/40 backdrop-blur-md" onClick={onClose}><X className="h-5 w-5" /></Button>
                    <div className="absolute bottom-8 left-10 right-10">
                        <Badge className="bg-accent text-white border-none mb-4 text-[10px] font-black uppercase tracking-widest px-3 py-1">{blog?.type}</Badge>
                        <h2 className="text-sm font-black text-white uppercase tracking-tighter leading-tight">{blog?.title}</h2>
                    </div>
                </div>
                <div className="p-3 space-y-4">
                    <div className="flex items-center gap-3 text-muted-foreground border-b pb-6">
                        <div className="flex items-center gap-2"><Clock className="h-4 w-4" /><span className="text-[10px] font-black uppercase tracking-widest">{blog?.date}</span></div>
                        <div className="flex items-center gap-2"><Users className="h-4 w-4" /><span className="text-[10px] font-black uppercase tracking-widest">1.2k чтений</span></div>
                    </div>
                    <div className="prose prose-slate max-w-none">
                        <p className="text-sm font-medium leading-relaxed text-foreground/80 italic mb-8">
                            Этот материал подготовлен редакцией Syntha Lab совместно with командой бренда. Мы погружаемся в детали создания коллекции и делимся инсайдами индустрии.
                        </p>
                        <div className="space-y-6 text-base leading-relaxed text-muted-foreground">
                            <p>Лорем ипсум долор сит амет, консектетур адиписицинг элит. Сэд до эиусмод темпор инцидидунт ут лаборе эт долоре магна аликуа. Ут эним ад миним вениам, квис ноструд ксерцитатион улламцо лаборарис ниси ут аликвип экс эа цоммодо цонсекуат.</p>
                            <p>Дуис ауте ируре долор ин репредехерит ин волуптате велит эссе циллум долоре эу фугиат нулла париатур. Эксцептеур синт оццаецат цупидатат нон проидент, сунт ин цулпа кви оффициа десерунт моллит аним ид эст лаборум.</p>
                        </div>
                    </div>
                    <div className="pt-10 border-t flex items-center justify-between">
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="rounded-xl h-9 gap-2 text-[10px] font-black uppercase tracking-widest"><ThumbsUp className="h-3.5 w-3.5" /> Полезно</Button>
                            <Button variant="outline" size="sm" className="rounded-xl h-9 gap-2 text-[10px] font-black uppercase tracking-widest"><Send className="h-3.5 w-3.5" /> Поделиться</Button>
                        </div>
                        <Button variant="ghost" className="text-accent font-black uppercase text-[10px] tracking-widest">Все статьи бренда <ArrowRight className="ml-2 h-3.5 w-3.5" /></Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

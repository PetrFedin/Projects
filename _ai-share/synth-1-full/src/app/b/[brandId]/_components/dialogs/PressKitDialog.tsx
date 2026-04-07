import React from 'react';
import { FileText, Palette, Camera, BookText, Users, Download, Mail } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface PressKitDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    displayName: string;
}

export function PressKitDialog({ isOpen, onOpenChange, displayName }: PressKitDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl rounded-xl p-0 border-none bg-background shadow-2xl overflow-hidden">
                <div className="bg-slate-900 p-3 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
                        <FileText className="w-64 h-64 text-white" />
                    </div>
                    <div className="relative z-10">
                        <Badge className="bg-accent text-white border-none mb-4 text-[10px] font-black uppercase tracking-widest px-3 py-1">Press Resources</Badge>
                        <h2 className="text-sm font-black tracking-tighter uppercase leading-none mb-2">
                            Press Kit <br/>
                            <span className="text-accent">{displayName}</span>
                        </h2>
                        <p className="text-white/60 font-medium text-sm max-w-md mt-4 leading-relaxed">
                            Официальные материалы для СМИ, блогеров и партнеров. Всегда актуальные версии.
                        </p>
                    </div>
                </div>
                
                <div className="p-3 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            { title: 'Brand Identity', desc: 'Логотипы, шрифты, гайдлайны', size: '45 MB', icon: <Palette className="h-5 w-5" /> },
                            { title: 'Lookbook SS24', desc: 'Студийные фото коллекции', size: '128 MB', icon: <Camera className="h-5 w-5" /> },
                            { title: 'Brand Story', desc: 'История и манифест (PDF)', size: '12 MB', icon: <BookText className="h-5 w-5" /> },
                            { title: 'PR Photos', desc: 'Портреты команды и основателей', size: '85 MB', icon: <Users className="h-5 w-5" /> }
                        ].map((item, i) => (
                            <Card key={i} className="p-3 rounded-2xl border border-muted/20 bg-muted/5 hover:bg-white hover:border-accent/20 hover:shadow-xl transition-all duration-500 cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                                        {item.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h5 className="font-black text-sm uppercase tracking-tight truncate">{item.title}</h5>
                                        <p className="text-[10px] text-muted-foreground font-medium truncate">{item.desc}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-[8px] font-black text-muted-foreground/40 uppercase mb-1">{item.size}</p>
                                        <Download className="h-3.5 w-3.5 text-accent" />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                    
                    <div className="bg-accent/5 p-4 rounded-xl border border-accent/10 flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                            <Mail className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-tight text-accent">PR-отдел бренда</p>
                            <p className="text-[10px] font-bold text-muted-foreground leading-snug mt-0.5">
                                По вопросам интервью и специальных проектов: <span className="text-foreground font-black">press@syntha-lab.ai</span>
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

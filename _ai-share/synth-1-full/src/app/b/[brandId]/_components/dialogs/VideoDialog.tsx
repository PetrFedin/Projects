import React from 'react';
import Image from 'next/image';
import { X, Video, PlayCircle, Maximize2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface VideoDialogProps {
    video: any;
    onClose: () => void;
}

export function VideoDialog({ video, onClose }: VideoDialogProps) {
    return (
        <Dialog open={!!video} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl rounded-xl p-0 border-none bg-black shadow-2xl overflow-hidden aspect-video">
                <VisuallyHidden>
                    <DialogTitle>Видео: {video?.title}</DialogTitle>
                </VisuallyHidden>
                <div className="relative w-full h-full flex items-center justify-center">
                    <div className="absolute top-4 left-6 z-10 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                            <Video className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-white font-black uppercase tracking-tight text-sm leading-none">{video?.title}</h3>
                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1.5">{video?.type} • {video?.duration}</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="absolute top-4 right-6 z-10 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-md" onClick={onClose}><X className="h-5 w-5" /></Button>
                    
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center relative group">
                        <Image src={video?.imageUrl} alt="Video Poster" fill className="object-cover opacity-40" />
                        <div className="h-20 w-20 rounded-full bg-accent text-white flex items-center justify-center shadow-2xl scale-110 group-hover:scale-125 transition-all cursor-pointer relative z-10">
                            <PlayCircle className="h-10 w-10 fill-current" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                            <div className="h-1 w-full bg-white/20 rounded-full mb-4 overflow-hidden">
                                <div className="h-full w-1/3 bg-accent rounded-full" />
                            </div>
                            <div className="flex items-center justify-between text-white/60 text-[10px] font-black uppercase tracking-widest">
                                <span>04:20 / {video?.duration}</span>
                                <div className="flex gap-3">
                                    <span className="hover:text-white cursor-pointer">HD</span>
                                    <span className="hover:text-white cursor-pointer">Subtitles</span>
                                    <Maximize2 className="h-4 w-4 hover:text-white cursor-pointer" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

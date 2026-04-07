import React from 'react';
import Image from 'next/image';
import { X, Instagram, Send, Youtube, ThumbsUp, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface SocialDialogProps {
    post: any;
    onClose: () => void;
}

export function SocialDialog({ post, onClose }: SocialDialogProps) {
    return (
        <Dialog open={!!post} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl rounded-xl p-0 border-none bg-background shadow-2xl overflow-hidden">
                <VisuallyHidden>
                    <DialogTitle>Публикация в {post?.platform}</DialogTitle>
                </VisuallyHidden>
                <div className="relative aspect-video">
                    <Image src={post?.imageUrl} alt="Social" fill className="object-cover" />
                    <div className="absolute top-4 right-4 h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/10 shadow-lg">
                        {post?.platform === 'instagram' && <Instagram className="h-5 w-5" />}
                        {post?.platform === 'telegram' && <Send className="h-5 w-5" />}
                        {post?.platform === 'youtube' && <Youtube className="h-5 w-5" />}
                    </div>
                    <Button variant="ghost" size="icon" className="absolute top-4 left-4 rounded-full bg-black/20 text-white hover:bg-black/40" onClick={onClose}><X className="h-5 w-5" /></Button>
                </div>
                <div className="p-4 space-y-6">
                    <div className="flex items-center justify-between">
                        <Badge className="bg-accent text-white border-none text-[10px] font-black uppercase tracking-widest px-3 py-1">{post?.platform}</Badge>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{post?.date}</span>
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-tighter leading-tight">{post?.title || "Публикация в соцсетях"}</h3>
                    <p className="text-base font-medium leading-relaxed text-foreground/80">{post?.text}</p>
                    <div className="pt-4 flex items-center justify-between border-t border-muted/10">
                        <div className="flex items-center gap-3">
                            {post?.likes && <div className="flex items-center gap-2 text-muted-foreground"><ThumbsUp className="h-4 w-4" /><span className="text-sm font-black">{post.likes}</span></div>}
                            {post?.views && <div className="flex items-center gap-2 text-muted-foreground"><Eye className="h-4 w-4" /><span className="text-sm font-black">{post.views}</span></div>}
                        </div>
                        <Button className="rounded-xl h-11 px-8 text-[10px] font-black uppercase tracking-widest bg-black text-white hover:bg-accent transition-all">Перейти к посту</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

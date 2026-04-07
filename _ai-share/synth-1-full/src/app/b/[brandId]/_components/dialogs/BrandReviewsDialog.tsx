import React from 'react';
import { Star, ThumbsUp, SeparatorHorizontal } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Camera } from 'lucide-react';

interface BrandReviewsDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    brandReviews: { average: number; count: number };
    reviewSort: string;
    setReviewSort: (sort: any) => void;
    detailedReviews: any[];
}

export function BrandReviewsDialog({ 
    isOpen, 
    onOpenChange, 
    brandReviews, 
    reviewSort, 
    setReviewSort, 
    detailedReviews 
}: BrandReviewsDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl p-0 border-none bg-background shadow-2xl custom-scrollbar">
                <DialogHeader className="p-4 pb-4 bg-muted/5 sticky top-0 z-10 backdrop-blur-md border-b border-muted/10">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <DialogTitle className="text-base font-black tracking-tighter uppercase">Отзывы о бренде</DialogTitle>
                            <DialogDescription className="text-sm font-medium mt-1">
                                На основе {brandReviews.count} проверенных покупок и визитов в шоурум
                            </DialogDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <div className="flex items-center gap-1 justify-end">
                                    <Star className="h-6 w-6 text-yellow-500 fill-current" />
                                    <span className="text-base font-black">{brandReviews.average}</span>
                                </div>
                                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Средний балл</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        <span className="text-[10px] uppercase font-black text-muted-foreground tracking-tighter">Сортировать:</span>
                        {[
                            { label: 'Новые', value: 'new' },
                            { label: 'Положительные', value: 'positive' },
                            { label: 'Критичные', value: 'negative' }
                        ].map(sort => (
                            <Button
                                key={sort.value}
                                variant={reviewSort === sort.value ? 'default' : 'outline'}
                                size="sm"
                                className={cn(
                                    "h-8 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
                                    reviewSort === sort.value ? "bg-black text-white border-black shadow-md" : "hover:bg-muted/50 border-muted-foreground/20"
                                )}
                                onClick={() => setReviewSort(sort.value as any)}
                            >
                                {sort.label}
                            </Button>
                        ))}
                    </div>
                </DialogHeader>

                <div className="p-4 pt-6 space-y-10">
                    {detailedReviews
                        .filter(review => {
                            if (reviewSort === 'new') return true;
                            if (reviewSort === 'positive') return review.rating >= 4;
                            if (reviewSort === 'negative') return review.rating <= 3;
                            return true;
                        })
                        .map((review) => (
                            <div key={review.id} className="group animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div className="flex gap-3">
                                    <div className="relative h-10 w-10 rounded-2xl overflow-hidden border-2 border-muted/20 shrink-0 shadow-sm">
                                        <Image src={review.avatar} alt={review.author} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-black text-base">{review.author}</h4>
                                                    {review.status && (
                                                        <Badge variant="secondary" className="text-[8px] font-black uppercase tracking-widest bg-accent/10 text-accent border-none px-2 py-0.5 rounded-full">
                                                            {review.status}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <div className="flex items-center gap-0.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star 
                                                                key={i} 
                                                                className={cn(
                                                                    "h-3.5 w-3.5", 
                                                                    i < review.rating ? "text-yellow-500 fill-current" : "text-muted/20"
                                                                )} 
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">{review.date}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="sm" className="h-8 rounded-xl gap-1.5 text-muted-foreground hover:text-accent">
                                                    <ThumbsUp className="h-3.5 w-3.5" />
                                                    <span className="text-[10px] font-black">{review.likes}</span>
                                                </Button>
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium leading-relaxed text-foreground/80">{review.text}</p>
                                        
                                        {review.images && (
                                            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                                                {review.images.map((img: any) => (
                                                    <div key={img.id} className="relative h-24 w-20 rounded-xl overflow-hidden border border-muted/20 shrink-0 cursor-zoom-in hover:scale-105 transition-transform">
                                                        <Image src={img.url} alt={img.alt} fill className="object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {review.tags && (
                                            <div className="flex flex-wrap gap-2">
                                                {review.tags.map((tag: string) => (
                                                    <Badge key={tag} variant="outline" className="text-[8px] font-black uppercase tracking-tighter border-muted-foreground/20 text-muted-foreground">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}

                                        {review.chat && review.chat.map((msg: any, idx: number) => (
                                            <div key={idx} className={cn(
                                                "p-4 rounded-2xl border text-xs leading-relaxed",
                                                msg.sender === 'brand' ? "bg-accent/5 border-accent/10" : "bg-muted/30 border-muted/20"
                                            )}>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className={cn(
                                                        "h-5 w-5 rounded-full flex items-center justify-center text-[8px] font-black uppercase",
                                                        msg.sender === 'brand' ? "bg-accent text-white" : "bg-muted-foreground text-white"
                                                    )}>
                                                        {msg.sender === 'brand' ? 'B' : 'U'}
                                                    </div>
                                                    <span className="font-black uppercase tracking-widest text-[9px]">
                                                        {msg.sender === 'brand' ? 'Ответ бренда' : 'Ваш ответ'}
                                                    </span>
                                                    <span className="text-[8px] font-bold text-muted-foreground ml-auto">{msg.date}</span>
                                                </div>
                                                <p className="font-medium text-foreground/90">{msg.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <Separator className="mt-8 bg-muted/10" />
                            </div>
                        ))}
                </div>

                <DialogFooter className="p-4 bg-muted/5 border-t border-muted/10">
                    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                                <Camera className="h-5 w-5 text-accent" />
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-xs font-bold text-muted-foreground leading-snug">
                                  Поделитесь фото и получите <span className="text-accent font-black">+100 бонусов</span>.
                              </p>
                              <p className="text-[9px] font-medium text-muted-foreground/60">
                                  * Бонусы неквалификационные, сгорают через 2 недели.
                              </p>
                            </div>
                        </div>
                        <Button 
                            onClick={() => {
                                onOpenChange(false);
                                // Assuming setIsShareLookOpen is handled by parent or passed down if needed, 
                                // but here we just close. The logic in original file was:
                                // setIsBrandReviewsOpen(false);
                                // setIsShareLookOpen(true);
                                // We might need to accept a callback for this action if it switches dialogs.
                            }}
                            className="w-full sm:w-auto rounded-xl font-black uppercase text-[11px] tracking-widest px-8 h-12 shadow-xl shadow-accent/20 bg-accent hover:bg-accent/90 transition-all hover:scale-105"
                        >
                            Написать отзыв
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

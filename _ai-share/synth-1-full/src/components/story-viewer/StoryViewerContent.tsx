'use client';

import React from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useStoryViewer } from './hooks/useStoryViewer';
import { StoryCard } from './_components/StoryCard';
import { ProductContent } from './_components/ProductContent';
import { BuyLookDialog } from './_components/BuyLookDialog';
import LivePlayer from '@/components/live-player';
import { useToast } from '@/hooks/use-toast';
import type { ImagePlaceholder, Product } from '@/lib/types';

interface StoryViewerContentProps {
    story: ImagePlaceholder;
    products?: Product[];
    mode?: 'products' | 'gallery' | 'simple' | 'invitation';
    extraImages?: string[];
    isLiveNow?: boolean;
    onNext?: () => void;
    onPrev?: () => void;
}

export function StoryViewerContent(props: StoryViewerContentProps) {
    const { story, products = [], mode = 'products', extraImages = [], isLiveNow = false, onNext, onPrev } = props;
    const { toast } = useToast();
    
    const state = useStoryViewer(story, products, mode, isLiveNow, onNext);

    const handleShare = () => {
        if (typeof navigator !== 'undefined' && navigator.share) {
            navigator.share({ title: story.description, url: window.location.href }).catch(() => {
                navigator.clipboard.writeText(window.location.href);
                toast({ title: "Ссылка скопирована" });
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast({ title: "Ссылка скопирована" });
        }
    };

    return (
        <DialogContent className={cn("p-0 border-0 bg-transparent shadow-none transition-all duration-500 flex flex-col md:flex-row items-center justify-center gap-3", state.showProducts ? "max-w-5xl" : "max-w-md")}>
            <DialogHeader><VisuallyHidden><DialogTitle>История: {story.description}</DialogTitle></VisuallyHidden></DialogHeader>

            <StoryCard 
                story={story} progress={state.progress} isLiveNow={isLiveNow} 
                showProducts={state.showProducts} setShowProducts={state.setShowProducts}
                products={products} mode={mode} isLiked={state.isLiked} setIsLiked={state.setIsLiked}
                likesCount={state.likesCount} setLikesCount={state.setLikesCount}
                handleShare={handleShare} handleSendGift={() => toast({ title: "Подарок отправлен" })}
                handleJoinRaffle={() => toast({ title: "Участие принято" })}
                onPrev={onPrev} onNext={onNext} setIsLivePlayerOpen={state.setIsLivePlayerOpenFromStory}
            />

            {state.showProducts && mode !== 'simple' && (
                <div className="w-full max-w-lg h-[80vh] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-right-10 duration-500">
                    <div className="p-4 pb-4 flex items-center justify-between shrink-0">
                        <div>
                            <h3 className="text-base font-black uppercase tracking-tighter">{mode === 'gallery' ? 'Галерея образа' : 'В этой истории'}</h3>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">{mode === 'gallery' ? `${extraImages.length} фото` : `${products.length} артикулов`}</p>
                        </div>
                        <DialogPrimitive.Close asChild><Button variant="ghost" size="icon" className="rounded-full"><X className="h-5 w-5" /></Button></DialogPrimitive.Close>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto px-6 space-y-6 pb-8 custom-scrollbar">
                        {mode === 'gallery' ? (
                            <div className="relative h-full flex flex-col gap-3">
                                <div className="relative aspect-[4/5] rounded-xl overflow-hidden group">
                                    <Image src={extraImages[state.currentGalleryIdx]} alt="Gallery" fill className="object-cover" />
                                    <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => state.setCurrentGalleryIdx(p => (p > 0 ? p - 1 : extraImages.length - 1))} className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white"><ChevronLeft /></button>
                                        <button onClick={() => state.setCurrentGalleryIdx(p => (p < extraImages.length - 1 ? p + 1 : 0))} className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white"><ChevronRight /></button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {extraImages.map((img, i) => (
                                        <button key={i} onClick={() => state.setCurrentGalleryIdx(i)} className={cn("relative aspect-square rounded-2xl overflow-hidden border-2 transition-all", i === state.currentGalleryIdx ? "border-black" : "border-transparent opacity-60")}>
                                            <Image src={img} alt="" fill className="object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            products.map((product) => <ProductContent key={product.id} product={product} initialColorId={product.availableColors?.[0]?.id} />)
                        )}
                    </div>
                    
                    {mode === 'products' && (
                        <div className="p-4 pt-4 border-t bg-muted/10">
                            <Button 
                                onClick={() => state.setIsBuyLookOpen(true)}
                                className={cn("w-full rounded-xl font-black uppercase text-[11px] h-20 transition-all flex flex-col gap-1.5", state.isLookOrdered ? "bg-green-500 text-white" : "bg-white text-black")}
                            >
                                <span>{state.isLookOrdered ? 'Запрос отправлен' : 'Купить весь образ'}</span>
                                {!state.isLookOrdered && <span>{state.lookPriceLabel}</span>}
                            </Button>
                        </div>
                    )}
                </div>
            )}

            <BuyLookDialog 
                isOpen={state.isBuyLookOpen} onOpenChange={state.setIsBuyLookOpen}
                products={products} lookSelections={state.lookSelections} updateLookSelection={state.updateLookSelection}
                isAnyPreOrderInSelection={state.isAnyPreOrderInSelection} lookPriceLabel={state.lookPriceLabel}
                isContactStepOpen={state.isContactStepOpen} setIsContactStepOpen={state.setIsContactStepOpen}
                contactMethod={state.contactMethod} setContactMethod={state.setContactMethod}
                userProfile={state.userProfile} setUserProfile={state.setUserProfile}
                editingContactId={state.editingContactId} setEditingContactId={state.setEditingContactId}
                tempContactValue={state.tempContactValue} setTempContactValue={state.setTempContactValue}
                contactTime={state.contactTime} setContactTime={state.setContactTime}
                selectedContactDate={state.selectedContactDate} setSelectedContactDate={state.setSelectedContactDate}
                selectedContactTimeStr={state.selectedContactTimeStr} setSelectedContactTimeStr={state.setSelectedContactTimeStr}
                onConfirm={() => { state.setIsLookOrdered(true); state.setIsBuyLookOpen(false); toast({ title: "Запрос отправлен" }); }}
            />

            {state.isLivePlayerOpenFromStory && (
                <LivePlayer event={story} isOpen={state.isLivePlayerOpenFromStory} onOpenChange={state.setIsLivePlayerOpenFromStory} isLive={true} />
            )}
        </DialogContent>
    );
}

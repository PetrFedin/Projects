'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';
import { ProductContent } from './ProductContent';

interface StoryProductListProps {
    products: Product[];
    mode: 'products' | 'gallery' | 'simple' | 'invitation';
    extraImages: string[];
    showProducts: boolean;
    setShowProducts: (show: boolean) => void;
    footerContent?: React.ReactNode;
}

export function StoryProductList({
    products,
    mode,
    extraImages,
    showProducts,
    setShowProducts,
    footerContent
}: StoryProductListProps) {
    const [currentGalleryIdx, setCurrentGalleryIdx] = useState(0);

    if (!showProducts || mode === 'simple') return null;

    return (
        <div className="w-full max-w-lg h-[80vh] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-right-10 duration-500">
            <div className="p-4 pb-4 flex items-center justify-between shrink-0">
                <div>
                    <h3 className="text-base font-black uppercase tracking-tighter">
                        {mode === 'gallery' ? 'Галерея образа' : 'В этой истории'}
                    </h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                        {mode === 'gallery' ? `${extraImages.length} дополнительных фото` : `${products.length} артикулов`}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <DialogPrimitive.Close asChild>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
                            <X className="h-5 w-5" />
                        </Button>
                    </DialogPrimitive.Close>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 space-y-6 custom-scrollbar pb-8">
                {mode === 'gallery' ? (
                    <div className="relative h-full flex flex-col gap-3">
                        <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-lg group">
                            <Image 
                                src={extraImages[currentGalleryIdx]} 
                                alt={`Gallery ${currentGalleryIdx}`} 
                                fill 
                                className="object-cover" 
                            />
                            
                            {/* Gallery Navigation Overlay */}
                            <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => setCurrentGalleryIdx(prev => (prev > 0 ? prev - 1 : extraImages.length - 1))}
                                    className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-all shadow-lg"
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </button>
                                <button 
                                    onClick={() => setCurrentGalleryIdx(prev => (prev < extraImages.length - 1 ? prev + 1 : 0))}
                                    className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-all shadow-lg"
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Gallery Pagination Dots */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 bg-black/20 backdrop-blur-md rounded-full">
                                {extraImages.map((_, i) => (
                                    <div 
                                        key={i} 
                                        className={cn(
                                            "h-1 rounded-full transition-all duration-300",
                                            i === currentGalleryIdx ? "w-4 bg-white" : "w-1 bg-white/40"
                                        )} 
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {extraImages.map((img, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => setCurrentGalleryIdx(i)}
                                    className={cn(
                                        "relative aspect-square rounded-2xl overflow-hidden border-2 transition-all",
                                        i === currentGalleryIdx ? "border-black scale-95 shadow-sm" : "border-transparent opacity-60 hover:opacity-100"
                                    )}
                                >
                                    <Image src={img} alt={`Thumb ${i}`} fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    products.map((product) => (
                        <div key={product.id} className="bg-muted/30 rounded-3xl p-4 border border-muted/20 group hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col gap-3">
                            <ProductContent product={product} initialColorId={product.availableColors?.[0]?.id || 'c1'} />
                        </div>
                    ))
                )}
            </div>

            {mode === 'products' && footerContent && (
                <div className="p-4 pt-4 border-t bg-muted/10 shrink-0">
                    {footerContent}
                </div>
            )}
        </div>
    );
}

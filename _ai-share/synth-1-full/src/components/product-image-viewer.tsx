
'use client';

import { 
    Dialog, 
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import type { ProductImage } from '@/lib/types';

interface ProductImageViewerProps {
    productName: string;
    images: ProductImage[];
    startIndex?: number;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export function ProductImageViewer({ productName, images, startIndex = 0, isOpen, onOpenChange }: ProductImageViewerProps) {
    const [api, setApi] = useState<CarouselApi>();

    useEffect(() => {
        if(isOpen && api) {
            api.scrollTo(startIndex, true);
        }
    }, [isOpen, api, startIndex]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[90vh] p-0 flex flex-col bg-transparent border-0 shadow-none">
                <VisuallyHidden>
                    <DialogTitle>Просмотр изображений: {productName}</DialogTitle>
                </VisuallyHidden>
                <div className="flex-1 w-full h-full p-4 md:p-4">
                    <Carousel setApi={setApi} className="w-full h-full">
                        <CarouselContent className="h-full">
                            {images.map(image => (
                                <CarouselItem key={image.id}>
                                    <div className="relative w-full h-full">
                                        <Image 
                                            src={image.url}
                                            alt={image.alt}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                         {images.length > 1 && (
                            <>
                                <CarouselPrevious className="left-2 text-white bg-black/30 hover:bg-black/50 border-white/20" />
                                <CarouselNext className="right-2 text-white bg-black/30 hover:bg-black/50 border-white/20" />
                            </>
                         )}
                    </Carousel>
                </div>
            </DialogContent>
        </Dialog>
    );
}

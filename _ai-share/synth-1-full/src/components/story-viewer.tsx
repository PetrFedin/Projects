'use client';

import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { TooltipProvider } from '@/components/ui/tooltip';
import { StoryViewerContent } from './story-viewer/StoryViewerContent';
import type { ImagePlaceholder, Product } from '@/lib/types';

interface StoryViewerProps {
    story: ImagePlaceholder;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    products?: Product[];
    mode?: 'products' | 'gallery' | 'simple' | 'invitation';
    extraImages?: string[];
    isLiveNow?: boolean;
    onNext?: () => void;
    onPrev?: () => void;
}

export default function StoryViewer({ 
    story, 
    isOpen, 
    onOpenChange, 
    products = [],
    mode = 'products',
    extraImages = [],
    isLiveNow = false,
    onNext,
    onPrev
}: StoryViewerProps) {
    if (!story) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
           <TooltipProvider>
                <StoryViewerContent 
                    story={story} 
                    products={products} 
                    mode={mode}
                    extraImages={extraImages}
                    isLiveNow={isLiveNow}
                    onNext={onNext}
                    onPrev={onPrev}
                />
           </TooltipProvider>
        </Dialog>
    );
}

export { StoryViewerContent };

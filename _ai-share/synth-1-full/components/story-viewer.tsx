'use client';

import { 
    Dialog, 
    DialogContent,
} from '@/components/ui/dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Image from 'next/image';
import type { ImagePlaceholder } from '@/lib/types';
import { UIStateProvider } from '@/providers/ui-state';

interface StoryViewerProps {
    story: ImagePlaceholder;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

function StoryViewerContent({ story }: { story: ImagePlaceholder }) {
     if (!story) return null;
    return (
         <DialogContent className="p-0 border-0 max-w-md bg-transparent shadow-none">
            <AspectRatio ratio={9 / 16}>
                <Image 
                    src={story.imageUrl} 
                    alt={story.description} 
                    fill 
                    className="object-cover rounded-lg"
                    sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-lg" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                    <p className="font-semibold text-lg">Стиль дня</p>
                    <p className="text-sm mt-1">Откройте для себя новые образы от нашего сообщества.</p>
                </div>
            </AspectRatio>
        </DialogContent>
    )
}


export default function StoryViewer({ story, isOpen, onOpenChange }: StoryViewerProps) {
    if (!story) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
           <UIStateProvider>
                <StoryViewerContent story={story} />
           </UIStateProvider>
        </Dialog>
    );
}

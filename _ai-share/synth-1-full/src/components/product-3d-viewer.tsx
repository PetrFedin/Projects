
'use client';

import { 
    Dialog, 
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface Product3dViewerProps {
    product: Product;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export default function Product3dViewer({ product, isOpen, onOpenChange }: Product3dViewerProps) {
    const avatarImage = PlaceHolderImages.find(img => img.id === "avatar-3d");

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-0">
                 <DialogHeader className="p-4 pb-0">
                    <DialogTitle>{product.name}</DialogTitle>
                    <DialogDescription>3D модель товара. Вращайте для просмотра.</DialogDescription>
                </DialogHeader>
                <div className="p-4">
                    <div className="relative aspect-square w-full">
                    {avatarImage && (
                        <Image
                            src={avatarImage.imageUrl}
                            alt="3D Avatar"
                            fill
                            className="object-contain"
                            data-ai-hint={avatarImage.imageHint}
                        />
                    )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

    

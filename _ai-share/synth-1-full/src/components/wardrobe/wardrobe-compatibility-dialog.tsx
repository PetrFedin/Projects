
'use client';

import { 
    Dialog, 
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Shirt, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useUIState } from '@/providers/ui-state';

interface WardrobeCompatibilityDialogProps {
    product: Product;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export function WardrobeCompatibilityDialog({ product, isOpen, onOpenChange }: WardrobeCompatibilityDialogProps) {
    const { manualWardrobe } = useUIState();
    const [purchasedProducts, setPurchasedProducts] = useState<Product[]>([]);

    useEffect(() => {
        if (isOpen) {
            const fetchProducts = async () => {
                try {
                    const res = await fetch('/data/products.json');
                    const allProducts: Product[] = await res.json();
                    // Mock purchased items
                    setPurchasedProducts(allProducts.slice(1, 4));
                } catch (error) {
                    console.error("Failed to fetch wardrobe products:", error);
                }
            };
            fetchProducts();
        }
    }, [isOpen]);

    const userWardrobe = [...purchasedProducts, ...manualWardrobe];

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-accent" />
                        AI Совместимость с гардеробом
                    </DialogTitle>
                    <DialogDescription>
                        Этот товар ({product.name}) отлично сочетается со следующими вещами из вашего гардероба.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                    {userWardrobe.map(item => (
                        <div key={item.id} className="flex items-center gap-3 p-2 border rounded-md">
                             <div className="relative aspect-[4/5] w-20 rounded-md overflow-hidden bg-muted">
                                <Image src={item.images[0].url} alt={item.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-muted-foreground">{item.brand}</p>
                                <Link href={`/products/${item.slug}`} className="font-semibold text-base hover:underline">{item.name}</Link>
                                <p className="text-sm font-bold mt-1">{item.price.toLocaleString('ru-RU')} ₽</p>
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}


'use client';

import Image from 'next/image';
import { looks } from '@/lib/looks';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import LookCard from './look-card';
import { useState } from 'react';

interface CommunityLooksPreviewProps {
    productId: string;
}

// A placeholder for product name, as it's not passed down.
// In a real app, you'd fetch this or pass it as a prop.
const productName = "Кашемировый свитер";

export function CommunityLooksPreview({ productId }: CommunityLooksPreviewProps) {
    const [isOpen, setIsOpen] = useState(false);
    // In a real app, you'd filter looks based on productId
    const relevantLooks = looks.slice(0,3);

    if (!relevantLooks || relevantLooks.length === 0) return null;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button className="text-xs font-semibold text-muted-foreground hover:text-primary underline">
                    Как носят другие?
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Как носят другие: {productName}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 py-4 max-h-[70vh] overflow-y-auto">
                    {relevantLooks.map(look => (
                        <LookCard key={look.id} look={look} />
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}

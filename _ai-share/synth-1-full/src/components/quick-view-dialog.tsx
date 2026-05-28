'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { Product } from '@/lib/types';
import ProductPageContent from '@/app/products/[slug]/page-content';

interface QuickViewDialogProps {
  product: Product | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickViewDialog({ product, isOpen, onOpenChange }: QuickViewDialogProps) {
  if (!isOpen || !product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[90vh] max-w-6xl flex-col p-0">
        <DialogHeader className="sr-only p-4 pb-0">
          <DialogTitle>Быстрый просмотр: {product.name}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <ProductPageContent product={product} isQuickView={true} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

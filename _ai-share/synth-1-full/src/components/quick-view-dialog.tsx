

'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import type { Product } from "@/lib/types";
import ProductPageContent from "@/app/products/[slug]/page-content";

interface QuickViewDialogProps {
  product: Product | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickViewDialog({ product, isOpen, onOpenChange }: QuickViewDialogProps) {
  
  if (!isOpen || !product) return null;

  return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl h-[90vh] p-0 flex flex-col">
            <DialogHeader className="p-4 pb-0 sr-only">
                <DialogTitle>Быстрый просмотр: {product.name}</DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto flex-1">
                <ProductPageContent product={product} isQuickView={true} />
            </div>
        </DialogContent>
      </Dialog>
  );
}



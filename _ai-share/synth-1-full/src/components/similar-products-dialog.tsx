'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { Product } from '@/lib/types';
import ProductCard from './product-card';
import { Wand2 } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';

interface SimilarProductsDialogProps {
  product: Product;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function SimilarProductsDialog({
  product,
  isOpen,
  onOpenChange,
}: SimilarProductsDialogProps) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (isOpen) {
      const fetchProducts = async () => {
        const res = await fetch('/data/products.json');
        const data = await res.json();
        setAllProducts(data);
      };
      fetchProducts();
    }
  }, [isOpen]);

  // Mock finding similar products. In a real app, this would be an API call.
  const similarProducts = useMemo(() => {
    return allProducts
      .filter(
        (p) =>
          p.id !== product.id &&
          (p.category === product.category || p.subcategory === product.subcategory)
      )
      .slice(0, 4);
  }, [product, allProducts]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm">
            <Wand2 className="text-accent" />
            Похожие товары
          </DialogTitle>
          <DialogDescription>AI подобрал товары, похожие на "{product.name}".</DialogDescription>
        </DialogHeader>
        <div className="grid max-h-[70vh] grid-cols-1 gap-3 overflow-y-auto py-4 sm:grid-cols-2 md:grid-cols-4">
          {similarProducts.map((p) => (
            <div key={p.id}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

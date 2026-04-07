
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Product } from "@/lib/types";
import ProductCard from "./product-card";
import { Flame } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import products from "@/lib/products";

interface BestsellerRankingDialogProps {
  product: Product;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function BestsellerRankingDialog({ product, isOpen, onOpenChange }: BestsellerRankingDialogProps) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (isOpen) {
        setAllProducts(products);
    }
  }, [isOpen]);
  
  const categoryBestsellers = useMemo(() => allProducts
    .filter(p => (p.category === product.category || p.subcategory === product.subcategory) && p.bestsellerRank)
    .sort((a, b) => (a.bestsellerRank || 99) - (b.bestsellerRank || 99))
    .slice(0, 4), [allProducts, product]);
    
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm">
            <Flame className="text-orange-500" />
            Хиты продаж в категории "{product.subcategory || product.category}"
          </DialogTitle>
          <DialogDescription>
            Рейтинг самых популярных товаров в этой категории.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 py-4 max-h-[70vh] overflow-y-auto">
            {categoryBestsellers.map(p => (
                <div key={p.id}>
                    <ProductCard product={p} />
                </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
    

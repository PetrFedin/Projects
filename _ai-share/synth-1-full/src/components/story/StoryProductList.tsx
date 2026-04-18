'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';
import { ProductContent } from './ProductContent';

interface StoryProductListProps {
  products: Product[];
  mode: 'products' | 'gallery' | 'simple' | 'invitation';
  extraImages: string[];
  showProducts: boolean;
  setShowProducts: (show: boolean) => void;
  footerContent?: React.ReactNode;
}

export function StoryProductList({
  products,
  mode,
  extraImages,
  showProducts,
  setShowProducts,
  footerContent,
}: StoryProductListProps) {
  const [currentGalleryIdx, setCurrentGalleryIdx] = useState(0);

  if (!showProducts || mode === 'simple') return null;

  return (
    <div className="flex h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-2xl duration-500 animate-in slide-in-from-right-10">
      <div className="flex shrink-0 items-center justify-between p-4 pb-4">
        <div>
          <h3 className="text-base font-black uppercase tracking-tighter">
            {mode === 'gallery' ? 'Галерея образа' : 'В этой истории'}
          </h3>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {mode === 'gallery'
              ? `${extraImages.length} дополнительных фото`
              : `${products.length} артикулов`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DialogPrimitive.Close asChild>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
              <X className="h-5 w-5" />
            </Button>
          </DialogPrimitive.Close>
        </div>
      </div>

      <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto px-6 pb-8">
        {mode === 'gallery' ? (
          <div className="relative flex h-full flex-col gap-3">
            <div className="group relative aspect-[4/5] overflow-hidden rounded-xl shadow-lg">
              <Image
                src={extraImages[currentGalleryIdx]}
                alt={`Gallery ${currentGalleryIdx}`}
                fill
                className="object-cover"
              />

              {/* Gallery Navigation Overlay */}
              <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() =>
                    setCurrentGalleryIdx((prev) => (prev > 0 ? prev - 1 : extraImages.length - 1))
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white shadow-lg backdrop-blur-md transition-all hover:bg-white/40"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={() =>
                    setCurrentGalleryIdx((prev) => (prev < extraImages.length - 1 ? prev + 1 : 0))
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white shadow-lg backdrop-blur-md transition-all hover:bg-white/40"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>

              {/* Gallery Pagination Dots */}
              <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/20 px-3 py-1.5 backdrop-blur-md">
                {extraImages.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1 rounded-full transition-all duration-300',
                      i === currentGalleryIdx ? 'w-4 bg-white' : 'w-1 bg-white/40'
                    )}
                  />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {extraImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentGalleryIdx(i)}
                  className={cn(
                    'relative aspect-square overflow-hidden rounded-2xl border-2 transition-all',
                    i === currentGalleryIdx
                      ? 'scale-95 border-black shadow-sm'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  )}
                >
                  <Image src={img} alt={`Thumb ${i}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col gap-3 rounded-3xl border border-muted/20 bg-muted/30 p-4 transition-all duration-300 hover:bg-white hover:shadow-xl"
            >
              <ProductContent
                product={product}
                initialColorId={product.availableColors?.[0]?.id || 'c1'}
              />
            </div>
          ))
        )}
      </div>

      {mode === 'products' && footerContent && (
        <div className="shrink-0 border-t bg-muted/10 p-4 pt-4">{footerContent}</div>
      )}
    </div>
  );
}

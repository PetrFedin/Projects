'use client';

import dynamic from 'next/dynamic';
import type { Product } from '@/lib/types';
import {
  isEyewearCategory,
  resolveEyewearFrameUrl,
} from '@/lib/product-experience/resolvers';
import { DEMO_GLASSES_DATA_URL } from '@/components/virtual-tryon/glasses-virtual-try-on';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const GlassesVirtualTryOn = dynamic(
  () =>
    import('@/components/virtual-tryon/glasses-virtual-try-on').then((m) => m.GlassesVirtualTryOn),
  { ssr: false, loading: () => <p className="text-sm text-muted-foreground py-6">Загрузка примерки…</p> }
);

type Props = {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProductGlassesTryOnDialog({ product, open, onOpenChange }: Props) {
  const explicit = resolveEyewearFrameUrl(product);
  const frameUrl = explicit ?? (isEyewearCategory(product) ? DEMO_GLASSES_DATA_URL : undefined);
  if (!frameUrl) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Виртуальная примерка оправы</DialogTitle>
          <DialogDescription className="text-xs leading-relaxed">
            {product.name} — камера или фото лица. Для строгого CSP/офлайна модель MediaPipe можно self-host.
          </DialogDescription>
        </DialogHeader>
        {open ? <GlassesVirtualTryOn initialGlassesUrl={frameUrl} /> : null}
      </DialogContent>
    </Dialog>
  );
}

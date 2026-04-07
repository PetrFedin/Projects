'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { resolveFootwearExperience } from '@/lib/product-experience/resolvers';
import { ROUTES } from '@/lib/routes';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const Footwear360PairingModule = dynamic(
  () =>
    import('@/components/footwear/footwear-360-pairing-module').then((m) => m.Footwear360PairingModule),
  {
    ssr: false,
    loading: () => <p className="text-sm text-muted-foreground py-6">Загрузка 360°…</p>,
  }
);

type Props = {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProductFootwearExperienceDialog({ product, open, onOpenChange }: Props) {
  const exp = resolveFootwearExperience(product);
  if (!exp) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[94vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>360° и с чем носить</DialogTitle>
          <DialogDescription className="text-xs leading-relaxed">
            Ракурсы из PIM (`Product.footwear`). Полная настройка скана и пресетов — в бренд-кабинете.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end mb-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={ROUTES.brand.footwear360} target="_blank" rel="noreferrer">
              Открыть хаб обуви
            </Link>
          </Button>
        </div>
        {open ? <Footwear360PairingModule bundle={exp.bundle} pairingPresets={exp.pairing} /> : null}
      </DialogContent>
    </Dialog>
  );
}

'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import {
  isEyewearCategory,
  productShowsFootwear360,
  productShowsGlassesTryOn,
  resolveEyewearFrameUrl,
  resolveFootwearExperience,
} from '@/lib/product-experience/resolvers';
import { DEMO_GLASSES_DATA_URL } from '@/components/virtual-tryon/glasses-virtual-try-on';
import { ROUTES } from '@/lib/routes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Glasses, Footprints } from 'lucide-react';

const GlassesVirtualTryOn = dynamic(
  () =>
    import('@/components/virtual-tryon/glasses-virtual-try-on').then((m) => m.GlassesVirtualTryOn),
  { ssr: false, loading: () => <p className="py-4 text-sm text-muted-foreground">Загрузка…</p> }
);

const Footwear360PairingModule = dynamic(
  () =>
    import('@/components/footwear/footwear-360-pairing-module').then(
      (m) => m.Footwear360PairingModule
    ),
  { ssr: false, loading: () => <p className="py-4 text-sm text-muted-foreground">Загрузка…</p> }
);

type Props = {
  product: Product;
  isQuickView?: boolean;
};

export function ProductExperiencePdpSection({ product, isQuickView }: Props) {
  const showGlasses = productShowsGlassesTryOn(product);
  const showFootwear = productShowsFootwear360(product);
  if (!showGlasses && !showFootwear) return null;

  const frameUrl =
    resolveEyewearFrameUrl(product) ??
    (isEyewearCategory(product) ? DEMO_GLASSES_DATA_URL : undefined);
  const footwearExp = resolveFootwearExperience(product);

  return (
    <div
      className={cn(
        'w-full space-y-6',
        isQuickView ? 'mt-4' : 'col-span-1 mx-auto mt-6 max-w-5xl md:col-span-2'
      )}
    >
      {showGlasses && frameUrl && (
        <Card className="border-dashed">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Glasses className="h-4 w-4" />
              Виртуальная примерка
            </CardTitle>
            <CardDescription className="text-xs">
              Наложение оправы по лицу (браузер).{' '}
              <Link
                href={ROUTES.brand.virtualTryonGlasses}
                className="underline underline-offset-2"
              >
                Хаб бренда
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-[min(70vh,560px)] overflow-y-auto">
            <GlassesVirtualTryOn initialGlassesUrl={frameUrl} />
          </CardContent>
        </Card>
      )}

      {showFootwear && footwearExp && (
        <Card className="border-dashed">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Footprints className="h-4 w-4" />
              Обувь: 360° и сочетания
            </CardTitle>
            <CardDescription className="text-xs">
              Данные из <code className="rounded bg-muted px-1 text-[10px]">Product.footwear</code>.{' '}
              <Link href={ROUTES.brand.footwear360} className="underline underline-offset-2">
                Хаб бренда
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-[min(80vh,720px)] overflow-y-auto">
            <Footwear360PairingModule
              bundle={footwearExp.bundle}
              pairingPresets={footwearExp.pairing}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

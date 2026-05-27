'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';
import {
  loadScrollExperienceConfig,
  resolveBrandFeaturedScrollProduct,
  resolveScrollSwitcherSections,
} from '@/lib/product-scroll-switcher';
import { filterRunwayAvailableProducts } from '@/lib/runway/runway-brand-gate';
import { Button } from '@/components/ui/button';

interface BrandRunwayHeroStripProps {
  brandName: string;
  products: Product[];
  className?: string;
}

/**
 * Компактный hero-strip runway для страницы каталога бренда — постер + один CTA.
 */
export function BrandRunwayHeroStrip({
  brandName,
  products,
  className,
}: BrandRunwayHeroStripProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [featured, setFeatured] = useState<Product | undefined>();
  const [scrollConfig, setScrollConfig] = useState<Awaited<
    ReturnType<typeof loadScrollExperienceConfig>
  > | null>(null);

  const gatedProducts = useMemo(
    () => filterRunwayAvailableProducts(products, scrollConfig ?? undefined),
    [products, scrollConfig]
  );

  const resolved = useMemo(
    () =>
      featured ??
      resolveBrandFeaturedScrollProduct(gatedProducts, brandName, scrollConfig ?? undefined),
    [featured, gatedProducts, brandName, scrollConfig]
  );

  useEffect(() => {
    let cancelled = false;
    loadScrollExperienceConfig().then((config) => {
      if (cancelled) return;
      setScrollConfig(config);
      const gated = filterRunwayAvailableProducts(products, config);
      setFeatured(resolveBrandFeaturedScrollProduct(gated, brandName, config));
    });
    return () => {
      cancelled = true;
    };
  }, [brandName, products]);

  if (!resolved) return null;

  const sections = resolveScrollSwitcherSections(resolved);
  const posterUrl = sections[0]?.heroUrl ?? sections[0]?.thumbUrl ?? resolved.images?.[0]?.url;

  return (
    <section
      ref={sectionRef}
      className={cn('overflow-hidden rounded-xl border border-border/50 bg-muted/15', className)}
    >
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
          {posterUrl ? (
            <Image src={posterUrl} alt="" fill className="object-cover" sizes="80px" />
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Runway · {brandName}
          </p>
          <p className="truncate font-headline text-sm font-bold">{resolved.name}</p>
        </div>
        <Button variant="default" size="sm" className="shrink-0 rounded-full" asChild>
          <Link href={`/products/${resolved.slug}?view=runway`}>Открыть Runway</Link>
        </Button>
      </div>
    </section>
  );
}

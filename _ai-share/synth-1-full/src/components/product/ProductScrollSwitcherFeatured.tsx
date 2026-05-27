'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Product } from '@/lib/types';
import {
  loadScrollExperienceConfig,
  resolveFeaturedScrollProduct,
  resolveScrollSwitcherSections,
} from '@/lib/product-scroll-switcher';
import { isProductRunwayAvailable } from '@/lib/runway/runway-brand-gate';
import { ProductScrollSwitcher } from '@/components/product/ProductScrollSwitcher';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductScrollSwitcherFeaturedProps {
  products: Product[];
}

/** Компактный runway-блок на главной — точка входа без перегруза UI. */
export function ProductScrollSwitcherFeatured({ products }: ProductScrollSwitcherFeaturedProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [featured, setFeatured] = useState<Product | undefined>(() =>
    resolveFeaturedScrollProduct(products)
  );
  const [featuredMode, setFeaturedMode] = useState<'interactive' | 'compact'>('compact');

  useEffect(() => {
    let cancelled = false;
    loadScrollExperienceConfig().then((config) => {
      if (cancelled) return;
      const candidate = resolveFeaturedScrollProduct(products, config);
      setFeatured(candidate && isProductRunwayAvailable(candidate, config) ? candidate : undefined);
      setFeaturedMode(config.featuredMode ?? 'compact');
    });
    return () => {
      cancelled = true;
    };
  }, [products]);

  useEffect(() => {
    if (featuredMode !== 'interactive') return;
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setIsVisible(true);
      },
      { rootMargin: '120px', threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [featured?.slug, featuredMode]);

  const sections = useMemo(
    () => (featured ? resolveScrollSwitcherSections(featured) : []),
    [featured]
  );

  const posterUrl = useMemo(() => {
    if (!featured) return undefined;
    const first = sections[0];
    return first?.heroUrl ?? first?.thumbUrl ?? featured.images?.[0]?.url;
  }, [featured, sections]);

  if (!featured) return null;

  const runwayHref = `/products/${featured.slug}?view=runway&demo=1`;
  const isCompact = featuredMode === 'compact';

  return (
    <section
      ref={sectionRef}
      className="section-spacing relative scroll-mt-24 overflow-hidden rounded-2xl border border-border/50 bg-muted/15"
      aria-label="Runway на главной"
    >
      <div className="relative mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl space-y-2">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Runway
            </p>
            <h2 className="font-headline text-xl font-bold leading-tight md:text-2xl">
              {featured.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              Scroll-video витрина на PDP — цвет, цена и образ без перезагрузки.
            </p>
          </div>
          <Button variant="default" size="default" className="w-fit shrink-0 rounded-full" asChild>
            <Link href={runwayHref}>
              Открыть Runway
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>

        {isCompact ? (
          <Link
            href={runwayHref}
            className="group flex flex-col overflow-hidden rounded-xl border border-border/60 bg-background sm:flex-row"
          >
            <div className="relative aspect-[4/5] w-full shrink-0 bg-muted sm:max-w-[280px]">
              {posterUrl ? (
                <Image
                  src={posterUrl}
                  alt={featured.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 640px) 100vw, 280px"
                />
              ) : (
                <div className="h-full w-full bg-muted" aria-hidden />
              )}
            </div>
            <div className="flex flex-1 flex-col justify-center gap-4 p-5">
              <div className="flex flex-wrap items-center gap-2">
                {sections.slice(0, 3).map((section, index) => (
                  <span
                    key={section.id}
                    className={cn(
                      'h-3 w-3 rounded-full border border-border ring-2 ring-offset-2 ring-offset-background',
                      index === 0 ? 'ring-primary' : 'ring-transparent'
                    )}
                    style={{ backgroundColor: section.color }}
                    title={section.label}
                    aria-hidden
                  />
                ))}
                <span className="text-xs text-muted-foreground">
                  {sections.length} {sections.length === 1 ? 'вариант' : 'варианта'}
                </span>
              </div>
              <p className="text-sm font-medium text-primary group-hover:underline">
                Смотреть интерактивную витрину →
              </p>
            </div>
          </Link>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border shadow-sm">
            <ProductScrollSwitcher
              product={featured}
              compact
              deferMedia
              isMediaVisible={isVisible}
            />
          </div>
        )}
      </div>
    </section>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import type { Product } from '@/lib/types';
import {
  filterScrollVideoProducts,
  filterHeroScrollProducts,
  loadScrollExperienceConfig,
} from '@/lib/product-scroll-switcher';
import { filterRunwayAvailableProducts } from '@/lib/runway/runway-brand-gate';
import { loadRunwayProducts } from '@/lib/runway/RunwayExperienceService';
import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { t } from '@/lib/runway/runway-i18n';
import { useUIState } from '@/providers/ui-state';
import { useToast } from '@/hooks/use-toast';

const ProductScrollSwitcher = dynamic(
  () =>
    import('@/components/product/ProductScrollSwitcher').then((m) => ({
      default: m.ProductScrollSwitcher,
    })),
  { ssr: false, loading: () => <RunwayPlaylistSkeleton /> }
);

function RunwayPlaylistSkeleton() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center rounded-xl border border-dashed border-border bg-muted/20">
      <p className="text-sm text-muted-foreground">{t('runway.playlistLoading')}</p>
    </div>
  );
}

interface RunwayPlaylistBlockProps {
  product: Product;
  index: number;
}

/** Один SKU ≈ 1 viewport — lazy mount при входе в viewport. */
function RunwayPlaylistBlock({ product, index }: RunwayPlaylistBlockProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(index === 0);
  const { addCartItem } = useUIState();
  const { toast } = useToast();

  const handleAddToCart = () => {
    const size = product.sizes?.[0]?.name ?? 'One Size';
    const colorName = product.color ?? product.availableColors?.[0]?.name ?? 'Default';
    addCartItem({ ...product, color: colorName }, size, 1);
    toast({
      title: t('runway.addToCart'),
      description: `${product.name} · ${colorName} (${size})`,
    });
  };

  useEffect(() => {
    const node = ref.current;
    if (!node || visible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '120px 0px', threshold: 0.05 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <section
      ref={ref}
      id={`runway-playlist-${product.slug}`}
      className="relative snap-start scroll-mt-0"
      aria-label={`Runway ${index + 1}: ${product.name}`}
      style={{ minHeight: '100svh' }}
    >
      <div className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-2">
        <Badge variant="secondary" className="text-[9px] tabular-nums opacity-90">
          {index + 1}
        </Badge>
        <Link
          href={`/products/${product.slug}?view=runway`}
          className="pointer-events-auto text-[10px] font-medium text-primary/90 hover:underline"
        >
          PDP
        </Link>
      </div>
      {visible ? (
        <ProductScrollSwitcher
          product={product}
          compact={false}
          syncUrl={false}
          showShare
          showWishlist={false}
          analyticsSurface="runway-playlist"
          onAddToCart={handleAddToCart}
        />
      ) : (
        <RunwayPlaylistSkeleton />
      )}
    </section>
  );
}

/**
 * Непрерывный вертикальный runway по всем scroll-video SKU каталога.
 * Investor wow: масштаб платформы, не один SKU.
 */
export function RunwayPlaylistExperience({ className }: { className?: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([loadRunwayProducts(), loadScrollExperienceConfig()])
      .then(([catalog, config]) => {
        if (!cancelled) {
          const scrollVideo = filterScrollVideoProducts(catalog);
          const gated = filterRunwayAvailableProducts(scrollVideo, config);
          setProducts(filterHeroScrollProducts(gated, config));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <CabinetPageContent maxWidth="5xl" className={cn('py-8', className)}>
        <RunwayPlaylistSkeleton />
      </CabinetPageContent>
    );
  }

  if (products.length === 0) {
    return (
      <CabinetPageContent maxWidth="5xl" className={cn('py-8', className)}>
        <p className="text-sm text-muted-foreground">{t('runway.playlistEmpty')}</p>
      </CabinetPageContent>
    );
  }

  return (
    <CabinetPageContent maxWidth="5xl" className={cn('py-8', className)}>
      <header className="mb-4">
        <h1 className="font-headline text-lg font-bold">Runway Playlist</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          {products.length} SKU · {t('runway.playlist.viewportHint')}
        </p>
      </header>

      <div
        className="flex snap-y snap-mandatory flex-col"
        role="feed"
        aria-label={t('runway.playlist.aria')}
      >
        {products.map((product, index) => (
          <RunwayPlaylistBlock key={product.slug} product={product} index={index} />
        ))}
      </div>
    </CabinetPageContent>
  );
}

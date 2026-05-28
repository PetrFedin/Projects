'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ListVideo, Sparkles } from 'lucide-react';
import type { Product } from '@/lib/types';
import { resolveScrollSwitcherSections } from '@/lib/product-scroll-switcher';
import { PageContainer, PageHeader } from '@/components/design-system/page-container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RunwayBadge } from '@/components/product/scroll-switcher/RunwayBadge';

interface RunwayLandingGridProps {
  products: Product[];
}

/** Сетка scroll-video SKU для публичной landing /runway. */
export function RunwayLandingGrid({ products }: RunwayLandingGridProps) {
  return (
    <PageContainer className="pb-16">
      <PageHeader
        title="Product Scroll Switcher"
        titleAddon={
          <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
            Runway
          </Badge>
        }
        description="Интерактивный scroll-video опыт на PDP: три варианта цвета, истории секций, complete the look и аналитика без перезагрузки страницы."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm">
              <Link href="/products/silk-midi-dress?view=runway">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Демо flagship
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/runway/playlist">
                <ListVideo className="mr-1.5 h-3.5 w-3.5" />
                Playlist
              </Link>
            </Button>
          </div>
        }
      />

      <section className="mb-10 grid gap-4 rounded-xl border border-border bg-muted/20 p-5 md:grid-cols-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Что это
          </p>
          <p className="text-sm leading-relaxed text-foreground">
            Product Scroll Switcher — runway-режим карточки товара: вертикальный скролл или свайп по
            сцене переключает цветовые секции с видео, story и upsell look items.
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Для кого
          </p>
          <p className="text-sm leading-relaxed text-foreground">
            Бренды подключают scroll-video SKU через каталог и brand admin; покупатели получают
            immersive PDP без отдельного приложения.
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Opt-in
          </p>
          <p className="text-sm leading-relaxed text-foreground">
            Runway включается только для товаров с{' '}
            <code className="rounded bg-muted px-1 text-xs">displayMode: scroll-video</code> и
            валидным контентом секций — без навязанного режима для всего каталога.
          </p>
        </div>
      </section>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">Scroll-video каталог</h2>
        <Badge variant="outline">{products.length} SKU</Badge>
      </div>

      {products.length === 0 ? (
        <Card className="border-dashed p-10 text-center text-sm text-muted-foreground">
          Пока нет scroll-video товаров в каталоге.
        </Card>
      ) : (
        <ul
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          data-runway-landing-grid
        >
          {products.map((product) => {
            const sections = resolveScrollSwitcherSections(product);
            const hero =
              sections[0]?.sectionImageUrl ?? sections[0]?.thumbImageUrl ?? product.images[0]?.url;

            return (
              <li key={product.slug}>
                <Card className="group overflow-hidden transition-shadow hover:shadow-md">
                  <Link
                    href={`/products/${product.slug}?view=runway`}
                    className="block"
                    data-runway-landing-card={product.slug}
                  >
                    <div className="relative aspect-[4/5] bg-muted">
                      {hero ? (
                        <Image
                          src={hero}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          sizes="(max-width: 640px) 100vw, 280px"
                        />
                      ) : null}
                      <div className="absolute left-3 top-3">
                        <RunwayBadge product={product} />
                      </div>
                      <div className="absolute bottom-3 left-3 flex gap-1">
                        {sections.slice(0, 3).map((s) => (
                          <span
                            key={s.id}
                            className="h-2.5 w-2.5 rounded-full border border-white/60 shadow-sm"
                            style={{ backgroundColor: s.color }}
                            title={s.label}
                            aria-hidden
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1 p-4">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        {product.brand}
                      </p>
                      <p className="font-headline text-sm font-bold leading-snug">{product.name}</p>
                      <p className="text-sm tabular-nums text-primary">
                        от {product.price.toLocaleString('ru-RU')} ₽
                      </p>
                      <p className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                        Открыть runway
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                      </p>
                    </div>
                  </Link>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </PageContainer>
  );
}

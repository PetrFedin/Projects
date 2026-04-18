'use client';

import { useMemo, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlatformDataBanner } from '@/components/client/platform-data-banner';
import { ROUTES } from '@/lib/routes';
import { products } from '@/lib/products';
import { suggestColorHarmony } from '@/lib/fashion/color-harmony';
import { ArrowLeft, Palette } from 'lucide-react';
import { Label } from '@/components/ui/label';

function ColorStudioInner() {
  const search = useSearchParams();
  const initialSlug = search.get('slug') || products[0]?.slug || '';
  const [slug, setSlug] = useState(initialSlug);

  const anchor = useMemo(() => products.find((p) => p.slug === slug) ?? products[0], [slug]);
  const suggestions = useMemo(
    () => (anchor ? suggestColorHarmony(anchor, products, 9) : []),
    [anchor]
  );

  if (!anchor) {
    return <p className="text-sm text-muted-foreground">Каталог пуст.</p>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Якорный товар</CardTitle>
          <CardDescription>
            Цвет и категория влияют на скоринг сочетаний (без компьютерного зрения).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="anchor-pick">Товар</Label>
            <select
              id="anchor-pick"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={anchor.slug}
              onChange={(e) => setSlug(e.target.value)}
            >
              {products.slice(0, 40).map((p) => (
                <option key={p.id} value={p.slug}>
                  {p.name} · {p.color}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-start gap-4">
            <div className="relative h-36 w-28 shrink-0 overflow-hidden rounded-lg border">
              <Image
                src={anchor.images[0]?.url || '/placeholder.jpg'}
                alt=""
                fill
                className="object-cover"
                sizes="120px"
              />
            </div>
            <div className="space-y-1 text-sm">
              <p className="font-medium">{anchor.name}</p>
              <p className="text-muted-foreground">
                Цвет: <span className="text-foreground">{anchor.color}</span> · {anchor.category}
              </p>
              <p className="text-[11px] text-muted-foreground">
                API-ready: передайте <code className="rounded bg-muted px-1">anchorProductId</code>{' '}
                вместо локального списка.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-sm font-semibold">С чем сочетать</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {suggestions.map((s) => (
            <Link
              key={s.productId}
              href={`/products/${s.slug}`}
              className="group overflow-hidden rounded-lg border bg-card"
            >
              <div className="relative aspect-[3/4]">
                <Image src={s.imageUrl} alt={s.name} fill className="object-cover" sizes="200px" />
              </div>
              <div className="space-y-1 p-2">
                <p className="line-clamp-2 text-xs font-medium group-hover:text-primary">
                  {s.name}
                </p>
                <p className="line-clamp-2 text-[10px] text-muted-foreground">{s.reason}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default function ClientColorStudioPage() {
  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-6 pb-24">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href={ROUTES.client.home}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="flex items-center gap-2 text-xl font-bold">
              <Palette className="h-6 w-6" />
              Цвет и сочетания
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Эвристики палитры для мерча и витрины; позже — эмбеддинги образов и правила бренда.
            </p>
          </div>
        </div>
        <PlatformDataBanner />
      </div>

      <Suspense fallback={<p className="text-sm text-muted-foreground">Загрузка…</p>}>
        <ColorStudioInner />
      </Suspense>
    </div>
  );
}

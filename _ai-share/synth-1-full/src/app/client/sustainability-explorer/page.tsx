'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlatformDataBanner } from '@/components/client/platform-data-banner';
import { ROUTES } from '@/lib/routes';
import { products } from '@/lib/products';
import { deriveSustainabilityBreakdown } from '@/lib/fashion/sustainability-score';
import type { SustainabilityBreakdown } from '@/lib/fashion/types';
import { ArrowLeft, Leaf } from 'lucide-react';

type Tier = 'all' | SustainabilityBreakdown['tier'];

export default function SustainabilityExplorerPage() {
  const [tier, setTier] = useState<Tier>('all');

  const ranked = useMemo(() => {
    return products
      .filter((p) => p.images?.length)
      .map((p) => ({ product: p, b: deriveSustainabilityBreakdown(p) }))
      .sort((a, b) => b.b.score - a.b.score);
  }, []);

  const filtered = useMemo(() => {
    if (tier === 'all') return ranked;
    return ranked.filter((x) => x.b.tier === tier);
  }, [ranked, tier]);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href={ROUTES.client.home}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Leaf className="h-6 w-6 text-emerald-600" />
              Eco-сигналы в каталоге
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Скоринг из тегов, состава и описания. Заменяется на LCA / сертификаты при подключении API.
            </p>
          </div>
        </div>
        <PlatformDataBanner />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Фильтр по уровню</CardTitle>
          <CardDescription>Тот же <code className="text-[10px] bg-muted px-1 rounded">deriveSustainabilityBreakdown</code>, что на PDP.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {(['all', 'high', 'mid', 'low', 'unknown'] as Tier[]).map((t) => (
            <Button key={t} size="sm" variant={tier === t ? 'default' : 'outline'} onClick={() => setTier(t)}>
              {t === 'all' ? 'Все' : t}
            </Button>
          ))}
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Показано: <strong>{filtered.length}</strong> из {ranked.length}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {filtered.map(({ product: p, b }) => (
          <Link key={p.id} href={`/products/${p.slug}`} className="group rounded-lg border overflow-hidden bg-card">
            <div className="relative aspect-[3/4]">
              <Image src={p.images[0]?.url || '/placeholder.jpg'} alt={p.name} fill className="object-cover" sizes="200px" />
            </div>
            <div className="p-2 space-y-1">
              <p className="text-xs font-medium line-clamp-2 group-hover:text-primary">{p.name}</p>
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary" className="text-[10px] font-mono">
                  {b.score}
                </Badge>
                <Badge variant="outline" className="text-[10px] capitalize">
                  {b.tier}
                </Badge>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PlatformDataBanner } from '@/components/client/platform-data-banner';
import { ROUTES } from '@/lib/routes';
import { products } from '@/lib/products';
import { buildCategoryIndex } from '@/lib/fashion/category-index';
import { ArrowLeft, FolderTree } from 'lucide-react';

export default function CategoryAtlasPage() {
  const [q, setQ] = useState('');
  const buckets = useMemo(() => buildCategoryIndex(products), []);
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return buckets;
    return buckets.filter((b) => b.path.toLowerCase().includes(s));
  }, [buckets, q]);

  return (
    <div className="container max-w-3xl mx-auto px-4 py-6 space-y-6 pb-24">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href={ROUTES.client.home}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <FolderTree className="h-6 w-6" />
              Атлас категорий
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Путь из category_group → category → subcategory. Тот же индекс можно отдать с API taxonomy.
            </p>
          </div>
        </div>
        <PlatformDataBanner />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Поиск</CardTitle>
          <CardDescription>{buckets.length} уникальных веток · {products.length} SKU в индексе</CardDescription>
        </CardHeader>
        <CardContent>
          <Input placeholder="Фильтр по названию ветки…" value={q} onChange={(e) => setQ(e.target.value)} />
        </CardContent>
      </Card>

      <ul className="space-y-2">
        {filtered.map((b) => (
          <li key={b.path} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 text-sm">
            <span className="font-medium leading-snug">{b.path}</span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-muted-foreground tabular-nums">{b.count} шт.</span>
              <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                <Link href={`/products/${b.exampleSlug}`}>Пример</Link>
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

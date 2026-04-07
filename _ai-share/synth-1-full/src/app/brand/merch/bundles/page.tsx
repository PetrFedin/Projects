'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';
import { products } from '@/lib/products';
import { getAllBundles } from '@/lib/fashion/bundle-logic';
import { ArrowLeft, Sparkles, Percent, Plus } from 'lucide-react';

export default function BundlesManagementPage() {
  const bundles = useMemo(() => getAllBundles(products), []);

  return (
    <div className="container max-w-5xl mx-auto px-4 py-6 space-y-6 pb-24">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={ROUTES.brand.growthHub}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Бандлы и сеты
          </h1>
          <p className="text-sm text-muted-foreground">
            Управление пакетными предложениями (Buy the Look). Увеличение UPT и среднего чека.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" className="gap-2">
          <Plus className="h-4 w-4" />
          Создать бандл
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.brand.assortmentMix}>Микс ассортимента</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {bundles.map(b => (
          <Card key={b.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{b.name}</CardTitle>
                  <CardDescription className="text-xs">ID: {b.id}</CardDescription>
                </div>
                <Badge variant="outline" className="gap-1 border-primary/30 text-primary">
                  <Percent className="h-3 w-3" />
                  -{b.discountPct}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid gap-2">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase">Позиции в сете</p>
                  <div className="flex flex-wrap gap-2">
                    {b.items.map(item => (
                      <Badge key={item} variant="secondary" className="text-[10px] font-normal">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-6 pt-2 border-t text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Базовая сумма</p>
                    <p className="font-medium">{b.totalOriginal} ₽</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Цена в сете</p>
                    <p className="font-bold text-primary">{b.totalDiscounted} ₽</p>
                  </div>
                  <div className="ml-auto">
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      Изменить
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

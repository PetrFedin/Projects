'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';
import { products } from '@/lib/products';
import { assessMediaGallery, galleryHealthToCsv } from '@/lib/fashion/media-gallery-health';
import { ArrowLeft, ImageIcon, FileSpreadsheet } from 'lucide-react';

export default function MediaGalleryHealthPage() {
  const rows = useMemo(() => {
    return products.map((p) => {
      const g = assessMediaGallery(p);
      return { product: p, ...g };
    });
  }, []);

  const weak = rows.filter((r) => !r.ok).length;

  const downloadCsv = () => {
    const csv = galleryHealthToCsv(
      rows.map((r) => ({
        sku: r.product.sku,
        slug: r.product.slug,
        score: r.score,
<<<<<<< HEAD
        issues: r.issues.join('|'),
=======
        issues: r.issues,
>>>>>>> recover/cabinet-wip-from-stash
      }))
    );
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `media-gallery-health-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-6 pb-24">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={ROUTES.brand.growthHub}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold">
            <ImageIcon className="h-6 w-6" />
            Медиа-галерея SKU
          </h1>
          <p className="text-sm text-muted-foreground">
            Минимум кадров и опционально{' '}
            <code className="rounded bg-muted px-1 text-[10px]">attributes.imageMinWidth</code> для
            гайдов маркетплейсов.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={downloadCsv}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          CSV
        </Button>
        <Badge variant="secondary">
          С замечаниями: {weak} / {rows.length}
        </Badge>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.brand.launchReadiness}>Готовность к запуску</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Оценка</CardTitle>
          <CardDescription>100 = без замечаний по правилам демо.</CardDescription>
        </CardHeader>
        <CardContent className="max-h-[520px] overflow-x-auto overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Фото</TableHead>
                <TableHead>Балл</TableHead>
                <TableHead>Issues</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.product.sku}>
                  <TableCell>
                    <Link
                      href={`/products/${r.product.slug}`}
                      className="font-mono text-xs underline"
                    >
                      {r.product.sku}
                    </Link>
                  </TableCell>
                  <TableCell className="text-xs">{r.product.images?.length ?? 0}</TableCell>
                  <TableCell className="font-mono">{r.score}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {r.issues.length ? r.issues.join(', ') : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
